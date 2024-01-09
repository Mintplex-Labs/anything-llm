const {
  DataType,
  MetricType,
  IndexType,
  OrmClient,
} = require("@zilliz/milvus2-sdk-node");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { v4: uuidv4 } = require("uuid");
const { storeVectorResult, cachedVectorInformation } = require("../../files");
const {
  toChunks,
  getLLMProvider,
  getEmbeddingEngineSelection,
} = require("../../helpers");

let client = null;

const Milvus = {
  name: "Milvus",
  connect: async function () {
    if (process.env.VECTOR_DB !== "milvus")
      throw new Error("Milvus::Invalid ENV settings");

    if (!client) {
      client = new OrmClient({
        address: process.env.MILVUS_ENDPOINT,
        token: process.env.MILVUS_TOKEN,
      });
    }

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
    const collections = await client.collections();
    const total = collections.reduce(async (acc, collection) => {
      const count = await collection.count();
      return acc + count;
    }, 0);
    return total;
  },
  namespaceCount: async function (_namespace = null) {
    const { client } = await this.connect();
    const namespace = await this.namespace(client, _namespace);
    return namespace?.count() ?? 0;
  },
  namespace: async function (client, namespace = null) {
    if (!namespace) throw new Error("No namespace value provided.");
    const collections = await client
      .collections({ collection_names: [namespace] })
      .catch(() => []);
    return collections?.[0];
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
        console.error("MilvusDB::namespaceExists", e.message);
        return { value: null };
      });
    return !!value;
  },
  deleteVectorsInNamespace: async function (client, namespace = null) {
    await client.dropCollection({ collection_name: namespace });
    return true;
  },
  getOrCreateCollection: async function (client, namespace) {
    const isExists = await this.namespaceExists(client, namespace);
    if (!isExists) {
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
            dim: 1536,
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
      const { pageContent, docId, ...metadata } = documentData;
      if (!pageContent || pageContent.length == 0) return false;

      console.log("Adding new vectorized document into namespace", namespace);
      const cacheResult = await cachedVectorInformation(fullFilePath);
      if (cacheResult.exists) {
        const { client } = await this.connect();
        await this.getOrCreateCollection(client, namespace);

        const { chunks } = cacheResult;
        const documentVectors = [];

        for (const chunk of chunks) {
          // Before sending to Pinecone and saving the records to our db
          // we need to assign the id of each chunk that is stored in the cached file.
          const newChunks = chunk.map((chunk) => {
            const id = uuidv4();
            documentVectors.push({ docId, vectorId: id });
            return { id, vector: chunk.values, metadata: chunk.metadata };
          });
          await client
            .insert({
              collection_name: namespace,
              data: newChunks,
            })
            .catch((e) => {
              console.error("MilvusDB::addDocumentToNamespace", e.message);
            });
        }
        await DocumentVectors.bulkInsert(documentVectors);
        return true;
      }

      // If we are here then we are going to embed and store a novel document.
      // We have to do this manually as opposed to using LangChains `Chroma.fromDocuments`
      // because we then cannot atomically control our namespace to granularly find/remove documents
      // from vectordb.
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
        console.log("Inserting vectorized chunks into Milvus.");
        for (const chunk of toChunks(vectors, 100)) {
          chunks.push(chunk);
          await client.upsert({
            collection_name: namespace,
            data: chunk.map((item) => ({
              id: item.id,
              vector: item.values,
              metadata: chunk.metadata,
            })),
          });
        }
        await storeVectorResult(chunks, fullFilePath);
      }

      await DocumentVectors.bulkInsert(documentVectors);
      return true;
    } catch (e) {
      console.error(e);
      console.error("addDocumentToNamespace", e.message);
      return false;
    }
  },
  deleteDocumentFromNamespace: async function (namespace, docId) {
    const { DocumentVectors } = require("../../../models/vectors");
    const { client } = await this.connect();
    if (!(await this.namespaceExists(client, namespace))) return;
    const knownDocuments = await DocumentVectors.where({ docId });
    if (knownDocuments.length === 0) return;

    const vectorIds = knownDocuments.map((doc) => doc.vectorId);
    await client.delete({ collection_name: namespace, ids: vectorIds });

    const indexes = knownDocuments.map((doc) => doc.id);
    await DocumentVectors.deleteIds(indexes);
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

    const details = await this.namespace(client, namespace);
    await this.deleteVectorsInNamespace(client, namespace);
    const vectorCount = await details?.count();
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
