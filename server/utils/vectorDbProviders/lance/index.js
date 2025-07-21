const lancedb = require("@lancedb/lancedb");
const { toChunks, getEmbeddingEngineSelection } = require("../../helpers");
const { TextSplitter } = require("../../TextSplitter");
const { SystemSettings } = require("../../../models/systemSettings");
const { storeVectorResult, cachedVectorInformation } = require("../../files");
const { v4: uuidv4 } = require("uuid");
const { sourceIdentifier } = require("../../chats");
const { NativeEmbeddingReranker } = require("../../EmbeddingRerankers/native");

/**
 * LancedDB Client connection object
 * @typedef {import('@lancedb/lancedb').Connection} LanceClient
 */

const LanceDb = {
  uri: `${
    !!process.env.STORAGE_DIR ? `${process.env.STORAGE_DIR}/` : "./storage/"
  }lancedb`,
  name: "LanceDb",

  /** @returns {Promise<{client: LanceClient}>} */
  connect: async function () {
    if (process.env.VECTOR_DB !== "lancedb")
      throw new Error("LanceDB::Invalid ENV settings");

    const client = await lancedb.connect(this.uri);
    return { client };
  },
  distanceToSimilarity: function (distance = null) {
    if (distance === null || typeof distance !== "number") return 0.0;
    if (distance >= 1.0) return 1;
    if (distance < 0) return 1 - Math.abs(distance);
    return 1 - distance;
  },
  heartbeat: async function () {
    await this.connect();
    return { heartbeat: Number(new Date()) };
  },
  tables: async function () {
    const { client } = await this.connect();
    return await client.tableNames();
  },
  totalVectors: async function () {
    const { client } = await this.connect();
    const tables = await client.tableNames();
    let count = 0;
    for (const tableName of tables) {
      const table = await client.openTable(tableName);
      count += await table.countRows();
    }
    return count;
  },
  namespaceCount: async function (_namespace = null) {
    const { client } = await this.connect();
    const exists = await this.namespaceExists(client, _namespace);
    if (!exists) return 0;

    const table = await client.openTable(_namespace);
    return (await table.countRows()) || 0;
  },
  /**
   * Performs a SimilaritySearch + Reranking on a namespace.
   * @param {Object} params - The parameters for the rerankedSimilarityResponse.
   * @param {Object} params.client - The vectorDB client.
   * @param {string} params.namespace - The namespace to search in.
   * @param {string} params.query - The query to search for (plain text).
   * @param {number[]} params.queryVector - The vector of the query.
   * @param {number} params.similarityThreshold - The threshold for similarity.
   * @param {number} params.topN - the number of results to return from this process.
   * @param {string[]} params.filterIdentifiers - The identifiers of the documents to filter out.
   * @returns
   */
  rerankedSimilarityResponse: async function ({
    client,
    namespace,
    query,
    queryVector,
    topN = 4,
    similarityThreshold = 0.25,
    filterIdentifiers = [],
  }) {
    const reranker = new NativeEmbeddingReranker();
    const collection = await client.openTable(namespace);
    const totalEmbeddings = await this.namespaceCount(namespace);
    const result = {
      contextTexts: [],
      sourceDocuments: [],
      scores: [],
    };

    /**
     * For reranking, we want to work with a larger number of results than the topN.
     * This is because the reranker can only rerank the results it it given and we dont auto-expand the results.
     * We want to give the reranker a larger number of results to work with.
     *
     * However, we cannot make this boundless as reranking is expensive and time consuming.
     * So we limit the number of results to a maximum of 50 and a minimum of 10.
     * This is a good balance between the number of results to rerank and the cost of reranking
     * and ensures workspaces with 10K embeddings will still rerank within a reasonable timeframe on base level hardware.
     *
     * Benchmarks:
     * On Intel Mac: 2.6 GHz 6-Core Intel Core i7 - 20 docs reranked in ~5.2 sec
     */
    const searchLimit = Math.max(
      10,
      Math.min(50, Math.ceil(totalEmbeddings * 0.1))
    );
    const vectorSearchResults = await collection
      .vectorSearch(queryVector)
      .distanceType("cosine")
      .limit(searchLimit)
      .toArray();

    await reranker
      .rerank(query, vectorSearchResults, { topK: topN })
      .then((rerankResults) => {
        rerankResults.forEach((item) => {
          if (this.distanceToSimilarity(item._distance) < similarityThreshold)
            return;
          const { vector: _, ...rest } = item;
          if (filterIdentifiers.includes(sourceIdentifier(rest))) {
            console.log(
              "LanceDB: A source was filtered from context as it's parent document is pinned."
            );
            return;
          }
          const score =
            item?.rerank_score || this.distanceToSimilarity(item._distance);

          result.contextTexts.push(rest.text);
          result.sourceDocuments.push({
            ...rest,
            score,
          });
          result.scores.push(score);
        });
      })
      .catch((e) => {
        console.error(e);
        console.error("LanceDB::rerankedSimilarityResponse", e.message);
      });

    return result;
  },

  /**
   * Performs a SimilaritySearch on a give LanceDB namespace.
   * @param {Object} params
   * @param {LanceClient} params.client
   * @param {string} params.namespace
   * @param {number[]} params.queryVector
   * @param {number} params.similarityThreshold
   * @param {number} params.topN
   * @param {string[]} params.filterIdentifiers
   * @returns
   */
  similarityResponse: async function ({
    client,
    namespace,
    queryVector,
    similarityThreshold = 0.25,
    topN = 4,
    filterIdentifiers = [],
  }) {
    const collection = await client.openTable(namespace);
    const result = {
      contextTexts: [],
      sourceDocuments: [],
      scores: [],
    };

    const response = await collection
      .vectorSearch(queryVector)
      .distanceType("cosine")
      .limit(topN)
      .toArray();

    response.forEach((item) => {
      if (this.distanceToSimilarity(item._distance) < similarityThreshold)
        return;
      const { vector: _, ...rest } = item;
      if (filterIdentifiers.includes(sourceIdentifier(rest))) {
        console.log(
          "LanceDB: A source was filtered from context as it's parent document is pinned."
        );
        return;
      }

      result.contextTexts.push(rest.text);
      result.sourceDocuments.push({
        ...rest,
        score: this.distanceToSimilarity(item._distance),
      });
      result.scores.push(this.distanceToSimilarity(item._distance));
    });

    return result;
  },
  /**
   *
   * @param {LanceClient} client
   * @param {string} namespace
   * @returns
   */
  namespace: async function (client, namespace = null) {
    if (!namespace) throw new Error("No namespace value provided.");
    const collection = await client.openTable(namespace).catch(() => false);
    if (!collection) return null;

    return {
      ...collection,
    };
  },
  /**
   *
   * @param {LanceClient} client
   * @param {number[]} data
   * @param {string} namespace
   * @returns
   */
  updateOrCreateCollection: async function (client, data = [], namespace) {
    const hasNamespace = await this.hasNamespace(namespace);
    if (hasNamespace) {
      const collection = await client.openTable(namespace);
      await collection.add(data);
      return true;
    }

    await client.createTable(namespace, data);
    return true;
  },
  hasNamespace: async function (namespace = null) {
    if (!namespace) return false;
    const { client } = await this.connect();
    const exists = await this.namespaceExists(client, namespace);
    return exists;
  },
  /**
   *
   * @param {LanceClient} client
   * @param {string} namespace
   * @returns
   */
  namespaceExists: async function (client, namespace = null) {
    if (!namespace) throw new Error("No namespace value provided.");
    const collections = await client.tableNames();
    return collections.includes(namespace);
  },
  /**
   *
   * @param {LanceClient} client
   * @param {string} namespace
   * @returns
   */
  deleteVectorsInNamespace: async function (client, namespace = null) {
    await client.dropTable(namespace);
    return true;
  },
  deleteDocumentFromNamespace: async function (namespace, docId) {
    const { client } = await this.connect();
    const exists = await this.namespaceExists(client, namespace);
    if (!exists) {
      console.error(
        `LanceDB:deleteDocumentFromNamespace - namespace ${namespace} does not exist.`
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
  },
  addDocumentToNamespace: async function (
    namespace,
    documentData = {},
    fullFilePath = null,
    skipCache = false
  ) {
    const { DocumentVectors } = require("../../../models/vectors");
    try {
      const { pageContent, docId, ...metadata } = documentData;
      if (!pageContent || pageContent.length == 0) return false;

      console.log("Adding new vectorized document into namespace", namespace);
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
      });
      const textChunks = await textSplitter.splitText(pageContent);

      console.log("Snippets created from document:", textChunks.length);
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

        console.log("Inserting vectorized chunks into LanceDB collection.");
        const { client } = await this.connect();
        await this.updateOrCreateCollection(client, submissions, namespace);
        await storeVectorResult(chunks, fullFilePath);
      }

      await DocumentVectors.bulkInsert(documentVectors);
      return { vectorized: true, error: null };
    } catch (e) {
      console.error("addDocumentToNamespace", e.message);
      return { vectorized: false, error: e.message };
    }
  },
  performSimilaritySearch: async function ({
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
    const result = rerank
      ? await this.rerankedSimilarityResponse({
          client,
          namespace,
          query: input,
          queryVector,
          similarityThreshold,
          topN,
          filterIdentifiers,
        })
      : await this.similarityResponse({
          client,
          namespace,
          queryVector,
          similarityThreshold,
          topN,
          filterIdentifiers,
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
  },
  "namespace-stats": async function (reqBody = {}) {
    const { namespace = null } = reqBody;
    if (!namespace) throw new Error("namespace required");
    const { client } = await this.connect();
    if (!(await this.namespaceExists(client, namespace)))
      throw new Error("Namespace by that name does not exist.");
    const stats = await this.namespace(client, namespace);
    return stats
      ? stats
      : { message: "No stats were able to be fetched from DB for namespace" };
  },
  "delete-namespace": async function (reqBody = {}) {
    const { namespace = null } = reqBody;
    const { client } = await this.connect();
    if (!(await this.namespaceExists(client, namespace)))
      throw new Error("Namespace by that name does not exist.");

    await this.deleteVectorsInNamespace(client, namespace);
    return {
      message: `Namespace ${namespace} was deleted.`,
    };
  },
  reset: async function () {
    const { client } = await this.connect();
    const fs = require("fs");
    fs.rm(`${client.uri}`, { recursive: true }, () => null);
    return { reset: true };
  },
  curateSources: function (sources = []) {
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
  },
};

module.exports.LanceDb = LanceDb;
