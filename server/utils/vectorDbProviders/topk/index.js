const { Client, schema, query, query_fn } = require("topk-js");
const { TextSplitter } = require("../../TextSplitter");
const { SystemSettings } = require("../../../models/systemSettings");
const { storeVectorResult, cachedVectorInformation } = require("../../files");
const { v4: uuidv4 } = require("uuid");
const { toChunks, getEmbeddingEngineSelection } = require("../../helpers");
const { sourceIdentifier } = require("../../chats");
const { VectorDatabase } = require("../base");

const COLLECTION_PREFIX = "anythingllm-";

class TopK extends VectorDatabase {
  constructor() {
    super();
  }

  get name() {
    return "TopK";
  }

  /**
   * Upserts are capped at 8MB per request, so we batch records to stay well under it.
   * @see https://docs.topk.io/limits
   */
  limits = {
    maxRecordsPerWrite: 100,
  };

  // Every workspace gets one collection per embedding dimension:
  //   anythingllm-<namespace>-d<dimension>
  // A collection's vector dimension is fixed at creation, and changing the
  // embedder in AnythingLLM changes the dimension, so we key on it.
  //
  // We never drop collections. Re-creating a TopK collection under a name that
  // was just deleted loses the new writes, so "deleting" a namespace empties
  // its collections instead. Switching back to an earlier embedder simply
  // reuses the empty collection for that dimension.
  normalize(namespace = "") {
    return String(namespace).replace(/[^a-zA-Z0-9_-]/g, "-");
  }

  collectionName(namespace, dimension) {
    return `${COLLECTION_PREFIX}${this.normalize(namespace)}-d${dimension}`;
  }

  isNotFound(error) {
    return /not found/i.test(error?.message || "");
  }

  async connect() {
    if (process.env.VECTOR_DB !== "topk")
      throw new Error("TopK::Invalid ENV settings");

    const client = new Client({
      apiKey: process.env.TOPK_API_KEY,
      region: process.env.TOPK_REGION,
      ...(process.env.TOPK_HOST ? { host: process.env.TOPK_HOST } : {}),
    });
    return { client };
  }

  async heartbeat() {
    const { client } = await this.connect();
    await client.collections().list({ prefix: COLLECTION_PREFIX }).next();
    return { heartbeat: Number(new Date()) };
  }

  /**
   * Lists the names of every collection AnythingLLM manages, optionally only those for one namespace.
   * @param {Client} client
   * @param {string|null} namespace
   * @returns {Promise<string[]>}
   */
  async collectionNames(client, namespace = null) {
    const prefix = namespace
      ? `${COLLECTION_PREFIX}${this.normalize(namespace)}-d`
      : COLLECTION_PREFIX;
    const names = [];
    for await (const collection of client.collections().list({ prefix })) {
      // The prefix alone would also match a namespace like "<namespace>-d1".
      if (namespace && !/^\d+$/.test(collection.name.slice(prefix.length)))
        continue;
      names.push(collection.name);
    }
    return names;
  }

  async countIn(client, names = []) {
    let total = 0;
    for (const name of names)
      total += await client.collection(name).count({ consistency: "strong" });
    return total;
  }

  async totalVectors() {
    const { client } = await this.connect();
    return await this.countIn(client, await this.collectionNames(client));
  }

  async namespaceCount(_namespace = null) {
    const { client } = await this.connect();
    const namespace = await this.namespace(client, _namespace);
    return namespace?.vectorCount || 0;
  }

  /**
   * Converts TopK's cosine similarity ([-1, 1]) to a similarity score in [0, 1].
   * Scores at or past orthogonal floor at 0 so unrelated chunks can never clear a similarity threshold.
   * @param {number|null} score
   * @returns {number}
   */
  normalizeScore(score = null) {
    if (score === null || typeof score !== "number") return 0.0;
    return Math.min(1, Math.max(0, score));
  }

  async similarityResponse({
    client,
    namespace,
    queryVector,
    similarityThreshold = 0.25,
    topN = 4,
    filterIdentifiers = [],
  }) {
    const result = {
      contextTexts: [],
      sourceDocuments: [],
      scores: [],
    };

    const collectionName = this.collectionName(namespace, queryVector.length);
    const docs = await client
      .collection(collectionName)
      .query(
        query
          .select({
            text: query.field("text"),
            metadata: query.field("metadata"),
            score: query_fn.vectorDistance("embedding", queryVector),
          })
          .topk(query.field("score"), topN, false),
        { consistency: "strong" }
      )
      .catch((e) => {
        if (this.isNotFound(e)) return [];
        throw e;
      });

    docs.forEach((doc) => {
      const similarity = this.normalizeScore(doc.score);
      if (similarity < similarityThreshold) return;

      const metadata = JSON.parse(doc.metadata || "{}");
      if (filterIdentifiers.includes(sourceIdentifier(metadata))) {
        this.logger(
          "A source was filtered from context as it's parent document is pinned."
        );
        return;
      }

      result.contextTexts.push(doc.text);
      result.sourceDocuments.push({ ...metadata, id: doc._id });
      result.scores.push(similarity);
    });

    return result;
  }

  async namespace(client, namespace = null) {
    if (!namespace) throw new Error("No namespace value provided.");
    const names = await this.collectionNames(client, namespace);
    if (names.length === 0) return null;
    return {
      name: namespace,
      collections: names,
      vectorCount: await this.countIn(client, names),
    };
  }

  async hasNamespace(namespace = null) {
    if (!namespace) return false;
    const { client } = await this.connect();
    return await this.namespaceExists(client, namespace);
  }

  async namespaceExists(client, namespace = null) {
    if (!namespace) throw new Error("No namespace value provided.");
    return (await this.collectionNames(client, namespace)).length > 0;
  }

  async deleteVectorsInNamespace(client, namespace = null) {
    for (const name of await this.collectionNames(client, namespace))
      await client.collection(name).delete(query.field("text").isNotNull());
    return true;
  }

  /**
   * Gets the collection for a namespace and embedding dimension, creating it on first write.
   * @param {Client} client
   * @param {string} namespace
   * @param {number} dimension
   * @returns {Promise<import("topk-js").CollectionClient>}
   */
  async getOrCreateCollection(client, namespace, dimension) {
    const name = this.collectionName(namespace, dimension);
    try {
      await client.collections().get(name);
    } catch (e) {
      if (!this.isNotFound(e)) throw e;
      this.logger(`Creating collection ${name}`);
      await client.collections().create(name, {
        embedding: schema
          .f32Vector({ dimension })
          .index(schema.vectorIndex({ metric: "cosine" }))
          .required(),
        text: schema.text().required(),
        doc_id: schema.text(),
        metadata: schema.text(),
      });
    }
    return client.collection(name);
  }

  /**
   * Upserts records in batches that stay under TopK's request size limit.
   * @param {import("topk-js").CollectionClient} collection
   * @param {{id: string, values: number[], text: string, docId: string, metadata: Record<string, any>}[]} records
   * @returns {Promise<boolean>}
   */
  async smartAdd(collection, records = []) {
    const batches = toChunks(records, this.limits.maxRecordsPerWrite);
    for (const [i, batch] of batches.entries()) {
      if (batches.length > 1)
        this.logger(`Upserting batch ${i + 1} of ${batches.length}`);
      await collection.upsert(
        batch.map((record) => ({
          _id: record.id,
          embedding: record.values,
          text: record.text,
          doc_id: record.docId,
          metadata: JSON.stringify(record.metadata),
        }))
      );
    }
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
          const records = [];

          for (const chunk of chunks) {
            // Before sending to TopK and saving the records to our db
            // we need to assign the id of each chunk that is stored in the cached file.
            chunk.forEach((chunk) => {
              const id = uuidv4();
              // The chunk text has its own field, so it is not stored twice.
              const { id: _id, text, ...metadata } = chunk.metadata;
              documentVectors.push({ docId, vectorId: id });
              records.push({
                id,
                values: chunk.values,
                text,
                docId,
                metadata,
              });
            });
          }

          if (records.length > 0) {
            const collection = await this.getOrCreateCollection(
              client,
              namespace,
              records[0].values.length
            );
            await this.smartAdd(collection, records);
          }
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
      const records = [];
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

          records.push({
            id: vectorRecord.id,
            values: vector,
            text: textChunks[i],
            docId,
            metadata,
          });
          vectors.push(vectorRecord);
          documentVectors.push({ docId, vectorId: vectorRecord.id });
        }
      } else {
        throw new Error(
          "Could not embed document chunks! This document will not be recorded."
        );
      }

      if (vectors.length > 0) {
        const { client } = await this.connect();
        const collection = await this.getOrCreateCollection(
          client,
          namespace,
          vectors[0].values.length
        );

        const chunks = [];
        this.logger("Inserting vectorized chunks into TopK collection.");
        for (const chunk of toChunks(vectors, 500)) chunks.push(chunk);

        try {
          await this.smartAdd(collection, records);
          this.logger(
            `Successfully added ${records.length} vectors to namespace ${namespace}`
          );
        } catch (error) {
          this.logger("Error adding to TopK:", error);
          throw new Error(`Error embedding into TopK: ${error.message}`);
        }

        await storeVectorResult(chunks, fullFilePath);
      }

      await DocumentVectors.bulkInsert(documentVectors);
      return { vectorized: true, error: null };
    } catch (e) {
      this.logger("addDocumentToNamespace", e.message);
      return { vectorized: false, error: e.message };
    }
  }

  async deleteDocumentFromNamespace(namespace, docId) {
    const { DocumentVectors } = require("../../../models/vectors");
    const { client } = await this.connect();
    const names = await this.collectionNames(client, namespace);
    if (names.length === 0) return;

    const knownDocuments = await DocumentVectors.where({ docId });
    if (knownDocuments.length === 0) return;

    const vectorIds = knownDocuments.map((doc) => doc.vectorId);
    for (const name of names)
      for (const batch of toChunks(vectorIds, this.limits.maxRecordsPerWrite))
        await client.collection(name).delete(batch);

    const indexes = knownDocuments.map((doc) => doc.id);
    await DocumentVectors.deleteIds(indexes);
    return true;
  }

  async performSimilaritySearch({
    namespace = null,
    input = "",
    LLMConnector = null,
    similarityThreshold = 0.25,
    topN = 4,
    filterIdentifiers = [],
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
    const { contextTexts, sourceDocuments, scores } =
      await this.similarityResponse({
        client,
        namespace,
        queryVector,
        similarityThreshold,
        topN,
        filterIdentifiers,
      });

    const sources = sourceDocuments.map((metadata, i) => ({
      metadata: {
        ...metadata,
        text: contextTexts[i],
        score: scores?.[i] || null,
      },
    }));

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
    const stats = await this.namespace(client, namespace);
    if (!stats) throw new Error("Namespace by that name does not exist.");
    return stats;
  }

  async "delete-namespace"(reqBody = {}) {
    const { namespace = null } = reqBody;
    const { client } = await this.connect();
    const details = await this.namespace(client, namespace);
    if (!details) throw new Error("Namespace by that name does not exist.");

    await this.deleteVectorsInNamespace(client, namespace);
    return {
      message: `Namespace ${namespace} was deleted along with ${details.vectorCount} vectors.`,
    };
  }

  async reset() {
    const { client } = await this.connect();
    for (const name of await this.collectionNames(client))
      await client.collection(name).delete(query.field("text").isNotNull());
    return { reset: true };
  }

  curateSources(sources = []) {
    const documents = [];
    for (const source of sources) {
      const { metadata = {} } = source;
      if (Object.keys(metadata).length > 0) {
        documents.push({
          ...metadata,
          ...(source.hasOwnProperty("pageContent")
            ? { text: source.pageContent }
            : {}),
        });
      }
    }

    return documents;
  }
}

module.exports.TopK = TopK;
