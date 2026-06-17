const lancedb = require("@lancedb/lancedb");
const { toChunks, getEmbeddingEngineSelection } = require("../../helpers");
const { TextSplitter } = require("../../TextSplitter");
const { SystemSettings } = require("../../../models/systemSettings");
const { storeVectorResult, cachedVectorInformation } = require("../../files");
const { v4: uuidv4 } = require("uuid");
const { sourceIdentifier } = require("../../chats");
const { NativeEmbeddingReranker } = require("../../EmbeddingRerankers/native");
const { VectorDatabase } = require("../base");
const path = require("path");

/**
 * LancedDB Client connection object
 * @typedef {import('@lancedb/lancedb').Connection} LanceClient
 */

class LanceDb extends VectorDatabase {
  /** @type {import('@lancedb/lancedb').Connection|null} */
  static #connection = null;

  constructor() {
    super();
  }

  get uri() {
    const basePath = !!process.env.STORAGE_DIR
      ? process.env.STORAGE_DIR
      : path.resolve(__dirname, "../../../storage");
    return path.resolve(basePath, "lancedb");
  }

  get name() {
    return "LanceDb";
  }

  /** @returns {Promise<{client: LanceClient}>} */
  async connect() {
    if (!LanceDb.#connection)
      LanceDb.#connection = await lancedb.connect(this.uri);
    return { client: LanceDb.#connection };
  }

  distanceToSimilarity(distance = null) {
    if (distance === null || typeof distance !== "number") return 0.0;
    if (distance >= 1.0) return 1;
    if (distance < 0) return 1 - Math.abs(distance);
    return 1 - distance;
  }

  async heartbeat() {
    await this.connect();
    return { heartbeat: Number(new Date()) };
  }

  async tables() {
    const { client } = await this.connect();
    return await client.tableNames();
  }

  async totalVectors() {
    const { client } = await this.connect();
    const tables = await client.tableNames();
    let count = 0;
    for (const tableName of tables) {
      const table = await client.openTable(tableName);
      count += await table.countRows();
    }
    return count;
  }

  async namespaceCount(_namespace = null) {
    const { client } = await this.connect();
    const exists = await this.namespaceExists(client, _namespace);
    if (!exists) return 0;

    const table = await client.openTable(_namespace);
    return (await table.countRows()) || 0;
  }

  /**
   * Performs a hybrid search (vector + full-text with RRF reranking) on a LanceDB namespace.
   * Falls back to vector-only search if hybrid search fails.
   * When `rerank` is true, fetches a larger candidate set and applies a second-pass
   * NativeEmbeddingReranker to improve relevance ordering.
   * @param {Object} params
   * @param {LanceClient} params.client
   * @param {string} params.namespace
   * @param {string} params.query - The plain text query for full-text search.
   * @param {number[]} params.queryVector
   * @param {number} params.similarityThreshold
   * @param {number} params.topN
   * @param {string[]} params.filterIdentifiers
   * @param {boolean} params.rerank - Whether to apply a second-pass embedding reranker.
   * @returns
   */
  async similarityResponse({
    client,
    namespace,
    query,
    queryVector,
    similarityThreshold = 0.25,
    topN = 4,
    filterIdentifiers = [],
    rerank = false,
  }) {
    const collection = await client.openTable(namespace);
    const result = {
      contextTexts: [],
      sourceDocuments: [],
      scores: [],
    };

    /**
     * For reranking, we want to work with a larger number of results than the topN.
     * This is because the reranker can only rerank the results it is given and we don't auto-expand the results.
     * We want to give the reranker a larger number of results to work with.
     *
     * However, we cannot make this boundless as reranking is expensive and time consuming.
     * So we limit the number of results to a maximum of 50 and a minimum of 10.
     * This is a good balance between the number of results to rerank and the cost of reranking
     * and ensures workspaces with 10K embeddings will still rerank within a reasonable timeframe on base level hardware.
     */
    let searchLimit = topN;
    if (rerank) {
      const totalEmbeddings = await this.namespaceCount(namespace);
      searchLimit = Math.max(
        10,
        Math.min(50, Math.ceil(totalEmbeddings * 0.1))
      );
    }

    let response;
    let usedHybrid = false;
    try {
      const rrfReranker = await lancedb.rerankers.RRFReranker.create();
      this.logger("Performing hybrid search with RRF reranker...");
      response = await collection
        .query()
        .fullTextSearch(query, { columns: ["text"] })
        .nearestTo(queryVector)
        .distanceType("cosine")
        .rerank(rrfReranker)
        .limit(searchLimit)
        .toArray();
      usedHybrid = true;
    } catch (e) {
      this.logger(
        `Hybrid search failed, falling back to vector-only: ${e.message}`
      );
      response = await collection
        .vectorSearch(queryVector)
        .distanceType("cosine")
        .limit(searchLimit)
        .toArray();
    }

    if (rerank) {
      const embeddingReranker = new NativeEmbeddingReranker();
      try {
        response = await embeddingReranker.rerank(query, response, {
          topK: topN,
        });
      } catch (e) {
        this.logger(
          "Embedding reranker failed - falling back to top results",
          e.message
        );
        response = response.slice(0, topN);
      }
    }

    response.forEach((item) => {
      const distanceScore = this.distanceToSimilarity(item._distance);
      const score = rerank
        ? item?.rerank_score || distanceScore
        : usedHybrid
          ? Math.max(
              item._relevance_score ?? 0,
              item._score ?? 0,
              distanceScore
            )
          : distanceScore;
      if (score < similarityThreshold) return;

      const { vector: _, ...rest } = item;
      if (filterIdentifiers.includes(sourceIdentifier(rest))) {
        this.logger(
          "A source was filtered from context as it's parent document is pinned."
        );
        return;
      }

      result.contextTexts.push(rest.text);
      result.sourceDocuments.push({ ...rest, score });
      result.scores.push(score);
    });

    return result;
  }

  /**
   *
   * @param {LanceClient} client
   * @param {string} namespace
   * @returns
   */
  async namespace(client, namespace = null) {
    if (!namespace) throw new Error("No namespace value provided.");
    const collection = await client.openTable(namespace).catch(() => false);
    if (!collection) return null;

    return {
      ...collection,
    };
  }

  /**
   *
   * @param {LanceClient} client
   * @param {number[]} data
   * @param {string} namespace
   * @returns
   */
  async updateOrCreateCollection(client, data = [], namespace) {
    const hasNamespace = await this.hasNamespace(namespace);
    if (hasNamespace) {
      const collection = await client.openTable(namespace);
      await collection.add(data);
      return true;
    }

    const newTable = await client.createTable(namespace, data);
    try {
      await newTable.createIndex("text", {
        config: lancedb.Index.fts(),
      });
    } catch (e) {
      this.logger(
        `Failed to create FTS index for new table ${namespace}: ${e.message}`
      );
    }
    return true;
  }

  async hasNamespace(namespace = null) {
    if (!namespace) return false;
    const { client } = await this.connect();
    const exists = await this.namespaceExists(client, namespace);
    return exists;
  }

  /**
   *
   * @param {LanceClient} client
   * @param {string} namespace
   * @returns
   */
  async namespaceExists(client, namespace = null) {
    if (!namespace) throw new Error("No namespace value provided.");
    const collections = await client.tableNames();
    return collections.includes(namespace);
  }

  /**
   *
   * @param {LanceClient} client
   * @param {string} namespace
   * @returns
   */
  async deleteVectorsInNamespace(client, namespace = null) {
    await client.dropTable(namespace);
    return true;
  }

  async deleteDocumentFromNamespace(namespace, docId) {
    const { client } = await this.connect();
    const exists = await this.namespaceExists(client, namespace);
    if (!exists) {
      this.logger(
        `deleteDocumentFromNamespace - namespace ${namespace} does not exist.`
      );
      return;
    }

    const { DocumentVectors } = require("../../../models/vectors");
    const table = await client.openTable(namespace);
    const vectorIds = (await DocumentVectors.where({ docId })).map(
      (record) => record.vectorId
    );

    if (vectorIds.length === 0) return;
    await table.delete(`id IN (${vectorIds.map((v) => `'${v}'`).join(",")})`);
    return true;
  }

  async addDocumentToNamespace(
    namespace,
    documentData = {},
    fullFilePath = null,
    skipCache = false
  ) {
    const { DocumentVectors } = require("../../../models/vectors");
    try {
      const { pageContent, docId, ...metadata } = documentData;
      if (!pageContent || pageContent.length == 0) return false;

      this.logger("Adding new vectorized document into namespace", namespace);
      if (!skipCache) {
        const cacheResult = await cachedVectorInformation(fullFilePath);
        if (cacheResult.exists) {
          const { client } = await this.connect();
          const { chunks } = cacheResult;
          const documentVectors = [];
          const submissions = [];

          for (const chunk of chunks) {
            chunk.forEach((chunk) => {
              const id = uuidv4();
              const { id: _id, ...metadata } = chunk.metadata;
              documentVectors.push({ docId, vectorId: id });
              submissions.push({ id: id, vector: chunk.values, ...metadata });
            });
          }

          await this.updateOrCreateCollection(client, submissions, namespace);
          await DocumentVectors.bulkInsert(documentVectors);
          return { vectorized: true, error: null };
        }
      }

      // If we are here then we are going to embed and store a novel document.
      // We have to do this manually as opposed to using LangChains `xyz.fromDocuments`
      // because we then cannot atomically control our namespace to granularly find/remove documents
      // from vectordb.
      const EmbedderEngine = getEmbeddingEngineSelection();
      const textSplitter = new TextSplitter({
        chunkSize: TextSplitter.determineMaxChunkSize(
          await SystemSettings.getValueOrFallback({
            label: "text_splitter_chunk_size",
          }),
          EmbedderEngine?.embeddingMaxChunkLength
        ),
        chunkOverlap: await SystemSettings.getValueOrFallback(
          { label: "text_splitter_chunk_overlap" },
          20
        ),
        chunkHeaderMeta: TextSplitter.buildHeaderMeta(metadata),
        chunkPrefix: EmbedderEngine?.embeddingPrefix,
      });
      const textChunks = await textSplitter.splitText(pageContent);

      this.logger("Snippets created from document:", textChunks.length);
      const documentVectors = [];
      const vectors = [];
      const submissions = [];
      const vectorValues = await EmbedderEngine.embedChunks(textChunks);

      if (!!vectorValues && vectorValues.length > 0) {
        for (const [i, vector] of vectorValues.entries()) {
          const vectorRecord = {
            id: uuidv4(),
            values: vector,
            // [DO NOT REMOVE]
            // LangChain will be unable to find your text if you embed manually and dont include the `text` key.
            // https://github.com/hwchase17/langchainjs/blob/2def486af734c0ca87285a48f1a04c057ab74bdf/langchain/src/vectorstores/pinecone.ts#L64
            metadata: { ...metadata, text: textChunks[i] },
          };

          vectors.push(vectorRecord);
          submissions.push({
            ...vectorRecord.metadata,
            id: vectorRecord.id,
            vector: vectorRecord.values,
          });
          documentVectors.push({ docId, vectorId: vectorRecord.id });
        }
      } else {
        throw new Error(
          "Could not embed document chunks! This document will not be recorded."
        );
      }

      if (vectors.length > 0) {
        const chunks = [];
        for (const chunk of toChunks(vectors, 500)) chunks.push(chunk);

        this.logger("Inserting vectorized chunks into LanceDB collection.");
        const { client } = await this.connect();
        await this.updateOrCreateCollection(client, submissions, namespace);
        await storeVectorResult(chunks, fullFilePath);
      }

      await DocumentVectors.bulkInsert(documentVectors);
      return { vectorized: true, error: null };
    } catch (e) {
      this.logger("addDocumentToNamespace", e.message);
      return { vectorized: false, error: e.message };
    }
  }

  async performSimilaritySearch({
    namespace = null,
    input = "",
    LLMConnector = null,
    similarityThreshold = 0.25,
    topN = 4,
    filterIdentifiers = [],
    rerank = false,
  }) {
    if (!namespace || !input || !LLMConnector)
      throw new Error("Invalid request to performSimilaritySearch.");

    const { client } = await this.connect();
    if (!(await this.namespaceExists(client, namespace))) {
      return {
        contextTexts: [],
        sources: [],
        message: "Invalid query - no documents found for workspace!",
      };
    }

    const queryVector = await LLMConnector.embedTextInput(input);
    const result = await this.similarityResponse({
      client,
      namespace,
      query: input,
      queryVector,
      similarityThreshold,
      topN,
      filterIdentifiers,
      rerank,
    });

    const { contextTexts, sourceDocuments } = result;
    const sources = sourceDocuments.map((metadata, i) => {
      return { metadata: { ...metadata, text: contextTexts[i] } };
    });
    return {
      contextTexts,
      sources: this.curateSources(sources),
      message: false,
    };
  }

  async "namespace-stats"(reqBody = {}) {
    const { namespace = null } = reqBody;
    if (!namespace) throw new Error("namespace required");
    const { client } = await this.connect();
    if (!(await this.namespaceExists(client, namespace)))
      throw new Error("Namespace by that name does not exist.");
    const stats = await this.namespace(client, namespace);
    return stats
      ? stats
      : { message: "No stats were able to be fetched from DB for namespace" };
  }

  async "delete-namespace"(reqBody = {}) {
    const { namespace = null } = reqBody;
    const { client } = await this.connect();
    if (!(await this.namespaceExists(client, namespace)))
      throw new Error("Namespace by that name does not exist.");

    await this.deleteVectorsInNamespace(client, namespace);
    return {
      message: `Namespace ${namespace} was deleted.`,
    };
  }

  async reset() {
    const { client } = await this.connect();
    LanceDb.#connection = null;
    const fs = require("fs");
    fs.rm(`${client.uri}`, { recursive: true }, () => null);
    return { reset: true };
  }

  curateSources(sources = []) {
    const documents = [];
    for (const source of sources) {
      const { text, vector: _v, _distance: _d, ...rest } = source;
      const metadata = rest.hasOwnProperty("metadata") ? rest.metadata : rest;
      if (Object.keys(metadata).length > 0) {
        documents.push({
          ...metadata,
          ...(text ? { text } : {}),
        });
      }
    }

    return documents;
  }
}

module.exports.LanceDb = LanceDb;
