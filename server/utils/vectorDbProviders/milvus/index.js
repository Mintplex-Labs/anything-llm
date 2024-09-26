const {
  DataType,
  MetricType,
  IndexType,
  MilvusClient,
} = require("@zilliz/milvus2-sdk-node");
const { TextSplitter } = require("../../TextSplitter");
const { SystemSettings } = require("../../../models/systemSettings");
const { v4: uuidv4 } = require("uuid");
const { storeVectorResult, cachedVectorInformation } = require("../../files");
const { toChunks, getEmbeddingEngineSelection } = require("../../helpers");
const { sourceIdentifier } = require("../../chats");

const Milvus = {
  name: "Milvus",
  // Milvus/Zilliz only allows letters, numbers, and underscores in collection names
  // so we need to enforce that by re-normalizing the names when communicating with
  // the DB.
  // If the first char of the collection is not an underscore or letter the collection name will be invalid.
  normalize: function (inputString) {
    let normalized = inputString.replace(/[^a-zA-Z0-9_]/g, "_");
    if (new RegExp(/^[a-zA-Z_]/).test(normalized.slice(0, 1)))
      normalized = `anythingllm_${normalized}`;
    return normalized;
  },
  connect: async function () {
    if (process.env.VECTOR_DB !== "milvus")
      throw new Error("Milvus::Invalid ENV settings");

    const client = new MilvusClient({
      address: process.env.MILVUS_ADDRESS,
      username: process.env.MILVUS_USERNAME,
      password: process.env.MILVUS_PASSWORD,
    });

    const { isHealthy } = await client.checkHealth();
    if (!isHealthy)
      throw new Error(
        "MilvusDB::Invalid Heartbeat received - is the instance online?"
      );

    return { client };
  },
  heartbeat: async function () {
    await this.connect();
    return { heartbeat: Number(new Date()) };
  },
  totalVectors: async function () {
    const { client } = await this.connect();
    const { collection_names } = await client.listCollections();
    const total = collection_names.reduce(async (acc, collection_name) => {
      const statistics = await client.getCollectionStatistics({
        collection_name: this.normalize(collection_name),
      });
      return Number(acc) + Number(statistics?.data?.row_count ?? 0);
    }, 0);
    return total;
  },
  namespaceCount: async function (_namespace = null) {
    const { client } = await this.connect();
    const statistics = await client.getCollectionStatistics({
      collection_name: this.normalize(_namespace),
    });
    return Number(statistics?.data?.row_count ?? 0);
  },
  namespace: async function (client, namespace = null) {
    if (!namespace) throw new Error("No namespace value provided.");
    const collection = await client
      .getCollectionStatistics({ collection_name: this.normalize(namespace) })
      .catch(() => null);
    return collection;
  },
  hasNamespace: async function (namespace = null) {
    if (!namespace) return false;
    const { client } = await this.connect();
    return await this.namespaceExists(client, namespace);
  },
  namespaceExists: async function (client, namespace = null) {
    if (!namespace) throw new Error("No namespace value provided.");
    const { value } = await client
      .hasCollection({ collection_name: this.normalize(namespace) })
      .catch((e) => {
        console.error("MilvusDB::namespaceExists", e.message);
        return { value: false };
      });
    return value;
  },
  deleteVectorsInNamespace: async function (client, namespace = null) {
    await client.dropCollection({ collection_name: this.normalize(namespace) });
    return true;
  },
  // Milvus requires a dimension aspect for collection creation
  // we pass this in from the first chunk to infer the dimensions like other
  // providers do.
  getOrCreateCollection: async function (client, namespace, dimensions = null) {
    const isExists = await this.namespaceExists(client, namespace);
    if (!isExists) {
      if (!dimensions)
        throw new Error(
          `Milvus:getOrCreateCollection Unable to infer vector dimension from input. Open an issue on Github for support.`
        );

      await client.createCollection({
        collection_name: this.normalize(namespace),
        fields: [
          {
            name: "id",
            description: "id",
            data_type: DataType.VarChar,
            max_length: 255,
            is_primary_key: true,
          },
          {
            name: "vector",
            description: "vector",
            data_type: DataType.FloatVector,
            dim: dimensions,
          },
          {
            name: "metadata",
            decription: "metadata",
            data_type: DataType.JSON,
          },
        ],
      });
      await client.createIndex({
        collection_name: this.normalize(namespace),
        field_name: "vector",
        index_type: IndexType.AUTOINDEX,
        metric_type: MetricType.COSINE,
      });
      await client.loadCollectionSync({
        collection_name: this.normalize(namespace),
      });
    }
  },
  addDocumentToNamespace: async function (
    namespace,
    documentData = {},
    fullFilePath = null,
    skipCache = false
  ) {
    const { DocumentVectors } = require("../../../models/vectors");
    try {
      let vectorDimension = null;
      const { pageContent, docId, ...metadata } = documentData;
      if (!pageContent || pageContent.length == 0) return false;

      console.log("Adding new vectorized document into namespace", namespace);
      if (skipCache) {
        const cacheResult = await cachedVectorInformation(fullFilePath);
        if (cacheResult.exists) {
          const { client } = await this.connect();
          const { chunks } = cacheResult;
          const documentVectors = [];
          vectorDimension = chunks[0][0].values.length || null;

          await this.getOrCreateCollection(client, namespace, vectorDimension);
          try {
            for (const chunk of chunks) {
              // Before sending to Milvus and saving the records to our db
              // we need to assign the id of each chunk that is stored in the cached file.
              const newChunks = chunk.map((chunk) => {
                const id = uuidv4();
                documentVectors.push({ docId, vectorId: id });
                return { id, vector: chunk.values, metadata: chunk.metadata };
              });
              const insertResult = await client.insert({
                collection_name: this.normalize(namespace),
                data: newChunks,
              });

              if (insertResult?.status.error_code !== "Success") {
                throw new Error(
                  `Error embedding into Milvus! Reason:${insertResult?.status.reason}`
                );
              }
            }
            await DocumentVectors.bulkInsert(documentVectors);
            await client.flushSync({
              collection_names: [this.normalize(namespace)],
            });
            return { vectorized: true, error: null };
          } catch (insertError) {
            console.error(
              "Error inserting cached chunks:",
              insertError.message
            );
            return { vectorized: false, error: insertError.message };
          }
        }
      }

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
        chunkHeaderMeta: {
          sourceDocument: metadata?.title,
          published: metadata?.published || "unknown",
        },
      });
      const textChunks = await textSplitter.splitText(pageContent);

      console.log("Chunks created from document:", textChunks.length);
      const documentVectors = [];
      const vectors = [];
      const vectorValues = await EmbedderEngine.embedChunks(textChunks);

      if (!!vectorValues && vectorValues.length > 0) {
        for (const [i, vector] of vectorValues.entries()) {
          if (!vectorDimension) vectorDimension = vector.length;
          const vectorRecord = {
            id: uuidv4(),
            values: vector,
            // [DO NOT REMOVE]
            // LangChain will be unable to find your text if you embed manually and dont include the `text` key.
            metadata: { ...metadata, text: textChunks[i] },
          };

          vectors.push(vectorRecord);
          documentVectors.push({ docId, vectorId: vectorRecord.id });
        }
      } else {
        throw new Error(
          "Could not embed document chunks! This document will not be recorded."
        );
      }

      if (vectors.length > 0) {
        const chunks = [];
        const { client } = await this.connect();
        await this.getOrCreateCollection(client, namespace, vectorDimension);

        console.log("Inserting vectorized chunks into Milvus.");
        for (const chunk of toChunks(vectors, 100)) {
          chunks.push(chunk);
          const insertResult = await client.insert({
            collection_name: this.normalize(namespace),
            data: chunk.map((item) => ({
              id: item.id,
              vector: item.values,
              metadata: chunk.metadata,
            })),
          });

          if (insertResult?.status.error_code !== "Success") {
            throw new Error(
              `Error embedding into Milvus! Reason:${insertResult?.status.reason}`
            );
          }
        }
        await storeVectorResult(chunks, fullFilePath);
        await client.flushSync({
          collection_names: [this.normalize(namespace)],
        });
      }

      await DocumentVectors.bulkInsert(documentVectors);
      return { vectorized: true, error: null };
    } catch (e) {
      console.error("addDocumentToNamespace", e.message);
      return { vectorized: false, error: e.message };
    }
  },
  deleteDocumentFromNamespace: async function (namespace, docId) {
    const { DocumentVectors } = require("../../../models/vectors");
    const { client } = await this.connect();
    if (!(await this.namespaceExists(client, namespace))) return;
    const knownDocuments = await DocumentVectors.where({ docId });
    if (knownDocuments.length === 0) return;

    const vectorIds = knownDocuments.map((doc) => doc.vectorId);
    const queryIn = vectorIds.map((v) => `'${v}'`).join(",");
    await client.deleteEntities({
      collection_name: this.normalize(namespace),
      expr: `id in [${queryIn}]`,
    });

    const indexes = knownDocuments.map((doc) => doc.id);
    await DocumentVectors.deleteIds(indexes);

    // Even after flushing Milvus can take some time to re-calc the count
    // so all we can hope to do is flushSync so that the count can be correct
    // on a later call.
    await client.flushSync({ collection_names: [this.normalize(namespace)] });
    return true;
  },
  performSimilaritySearch: async function ({
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
    const { contextTexts, sourceDocuments } = await this.similarityResponse(
      client,
      namespace,
      queryVector,
      similarityThreshold,
      topN,
      filterIdentifiers
    );

    const sources = sourceDocuments.map((metadata, i) => {
      return { ...metadata, text: contextTexts[i] };
    });
    return {
      contextTexts,
      sources: this.curateSources(sources),
      message: false,
    };
  },
  similarityResponse: async function (
    client,
    namespace,
    queryVector,
    similarityThreshold = 0.25,
    topN = 4,
    filterIdentifiers = []
  ) {
    const result = {
      contextTexts: [],
      sourceDocuments: [],
      scores: [],
    };
    const response = await client.search({
      collection_name: this.normalize(namespace),
      vectors: queryVector,
      limit: topN,
    });
    response.results.forEach((match) => {
      if (match.score < similarityThreshold) return;
      if (filterIdentifiers.includes(sourceIdentifier(match.metadata))) {
        console.log(
          "Milvus: A source was filtered from context as it's parent document is pinned."
        );
        return;
      }

      result.contextTexts.push(match.metadata.text);
      result.sourceDocuments.push(match);
      result.scores.push(match.score);
    });
    return result;
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

    const statistics = await this.namespace(client, namespace);
    await this.deleteVectorsInNamespace(client, namespace);
    const vectorCount = Number(statistics?.data?.row_count ?? 0);
    return {
      message: `Namespace ${namespace} was deleted along with ${vectorCount} vectors.`,
    };
  },
  curateSources: function (sources = []) {
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
  },
};

module.exports.Milvus = Milvus;
