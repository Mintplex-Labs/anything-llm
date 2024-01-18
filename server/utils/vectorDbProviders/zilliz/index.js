const {
  DataType,
  MetricType,
  IndexType,
  MilvusClient,
} = require("@zilliz/milvus2-sdk-node");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { v4: uuidv4 } = require("uuid");
const { storeVectorResult, cachedVectorInformation } = require("../../files");
const {
  toChunks,
  getLLMProvider,
  getEmbeddingEngineSelection,
} = require("../../helpers");

// Zilliz is basically a copy of Milvus DB class with a different constructor
// to connect to the cloud
const Zilliz = {
  name: "Zilliz",
  connect: async function () {
    if (process.env.VECTOR_DB !== "zilliz")
      throw new Error("Zilliz::Invalid ENV settings");

    const client = new MilvusClient({
      address: process.env.ZILLIZ_ENDPOINT,
      token: process.env.ZILLIZ_API_TOKEN,
    });

    const { isHealthy } = await client.checkHealth();
    if (!isHealthy)
      throw new Error(
        "Zilliz::Invalid Heartbeat received - is the instance online?"
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
        collection_name,
      });
      return Number(acc) + Number(statistics?.data?.row_count ?? 0);
    }, 0);
    return total;
  },
  namespaceCount: async function (_namespace = null) {
    const { client } = await this.connect();
    const statistics = await client.getCollectionStatistics({
      collection_name: _namespace,
    });
    return Number(statistics?.data?.row_count ?? 0);
  },
  namespace: async function (client, namespace = null) {
    if (!namespace) throw new Error("No namespace value provided.");
    const collection = await client
      .getCollectionStatistics({ collection_name: namespace })
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
      .hasCollection({ collection_name: namespace })
      .catch((e) => {
        console.error("Zilliz::namespaceExists", e.message);
        return { value: false };
      });
    return value;
  },
  deleteVectorsInNamespace: async function (client, namespace = null) {
    await client.dropCollection({ collection_name: namespace });
    return true;
  },
  // Zilliz requires a dimension aspect for collection creation
  // we pass this in from the first chunk to infer the dimensions like other
  // providers do.
  getOrCreateCollection: async function (client, namespace, dimensions = null) {
    const isExists = await this.namespaceExists(client, namespace);
    if (!isExists) {
      if (!dimensions)
        throw new Error(
          `Zilliz:getOrCreateCollection Unable to infer vector dimension from input. Open an issue on Github for support.`
        );

      await client.createCollection({
        collection_name: namespace,
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
        collection_name: namespace,
        field_name: "vector",
        index_type: IndexType.AUTOINDEX,
        metric_type: MetricType.COSINE,
      });
      await client.loadCollectionSync({
        collection_name: namespace,
      });
    }
  },
  addDocumentToNamespace: async function (
    namespace,
    documentData = {},
    fullFilePath = null
  ) {
    const { DocumentVectors } = require("../../../models/vectors");
    try {
      let vectorDimension = null;
      const { pageContent, docId, ...metadata } = documentData;
      if (!pageContent || pageContent.length == 0) return false;

      console.log("Adding new vectorized document into namespace", namespace);
      const cacheResult = await cachedVectorInformation(fullFilePath);
      if (cacheResult.exists) {
        const { client } = await this.connect();
        const { chunks } = cacheResult;
        const documentVectors = [];
        vectorDimension = chunks[0][0].values.length || null;

        await this.getOrCreateCollection(client, namespace, vectorDimension);
        for (const chunk of chunks) {
          // Before sending to Pinecone and saving the records to our db
          // we need to assign the id of each chunk that is stored in the cached file.
          const newChunks = chunk.map((chunk) => {
            const id = uuidv4();
            documentVectors.push({ docId, vectorId: id });
            return { id, vector: chunk.values, metadata: chunk.metadata };
          });
          const insertResult = await client.insert({
            collection_name: namespace,
            data: newChunks,
          });

          if (insertResult?.status.error_code !== "Success") {
            throw new Error(
              `Error embedding into Zilliz! Reason:${insertResult?.status.reason}`
            );
          }
        }
        await DocumentVectors.bulkInsert(documentVectors);
        await client.flushSync({ collection_names: [namespace] });
        return { vectorized: true, error: null };
      }

      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize:
          getEmbeddingEngineSelection()?.embeddingMaxChunkLength || 1_000,
        chunkOverlap: 20,
      });
      const textChunks = await textSplitter.splitText(pageContent);

      console.log("Chunks created from document:", textChunks.length);
      const LLMConnector = getLLMProvider();
      const documentVectors = [];
      const vectors = [];
      const vectorValues = await LLMConnector.embedChunks(textChunks);

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

        console.log("Inserting vectorized chunks into Zilliz.");
        for (const chunk of toChunks(vectors, 100)) {
          chunks.push(chunk);
          const insertResult = await client.insert({
            collection_name: namespace,
            data: chunk.map((item) => ({
              id: item.id,
              vector: item.values,
              metadata: chunk.metadata,
            })),
          });

          if (insertResult?.status.error_code !== "Success") {
            throw new Error(
              `Error embedding into Zilliz! Reason:${insertResult?.status.reason}`
            );
          }
        }
        await storeVectorResult(chunks, fullFilePath);
        await client.flushSync({ collection_names: [namespace] });
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
      collection_name: namespace,
      expr: `id in [${queryIn}]`,
    });

    const indexes = knownDocuments.map((doc) => doc.id);
    await DocumentVectors.deleteIds(indexes);

    // Even after flushing Zilliz can take some time to re-calc the count
    // so all we can hope to do is flushSync so that the count can be correct
    // on a later call.
    await client.flushSync({ collection_names: [namespace] });
    return true;
  },
  performSimilaritySearch: async function ({
    namespace = null,
    input = "",
    LLMConnector = null,
    similarityThreshold = 0.25,
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
      similarityThreshold
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
    similarityThreshold = 0.25
  ) {
    const result = {
      contextTexts: [],
      sourceDocuments: [],
      scores: [],
    };
    const response = await client.search({
      collection_name: namespace,
      vectors: queryVector,
    });
    response.results.forEach((match) => {
      if (match.score < similarityThreshold) return;
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

module.exports.Zilliz = Zilliz;
