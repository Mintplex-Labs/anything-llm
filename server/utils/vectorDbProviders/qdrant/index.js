const { QdrantClient } = require("@qdrant/js-client-rest");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { storeVectorResult, cachedVectorInformation } = require("../../files");
const { v4: uuidv4 } = require("uuid");
const { toChunks, getLLMProvider } = require("../../helpers");

const QDrant = {
  name: "QDrant",
  connect: async function () {
    if (process.env.VECTOR_DB !== "qdrant")
      throw new Error("QDrant::Invalid ENV settings");

    const client = new QdrantClient({
      url: process.env.QDRANT_ENDPOINT,
      ...(process.env.QDRANT_API_KEY
        ? { apiKey: process.env.QDRANT_API_KEY }
        : {}),
    });

    const isAlive = (await client.api("cluster")?.clusterStatus())?.ok || false;
    if (!isAlive)
      throw new Error(
        "QDrant::Invalid Heartbeat received - is the instance online?"
      );

    return { client };
  },
  heartbeat: async function () {
    await this.connect();
    return { heartbeat: Number(new Date()) };
  },
  totalVectors: async function () {
    const { client } = await this.connect();
    const { collections } = await client.getCollections();
    var totalVectors = 0;
    for (const collection of collections) {
      if (!collection || !collection.name) continue;
      totalVectors +=
        (await this.namespace(client, collection.name))?.vectorCount || 0;
    }
    return totalVectors;
  },
  namespaceCount: async function (_namespace = null) {
    const { client } = await this.connect();
    const namespace = await this.namespace(client, _namespace);
    return namespace?.vectorCount || 0;
  },
  similarityResponse: async function (
    _client,
    namespace,
    queryVector,
    similarityThreshold = 0.25
  ) {
    const { client } = await this.connect();
    const result = {
      contextTexts: [],
      sourceDocuments: [],
      scores: [],
    };

    const responses = await client.search(namespace, {
      vector: queryVector,
      limit: 4,
      with_payload: true,
    });

    responses.forEach((response) => {
      if (response.score < similarityThreshold) return;
      result.contextTexts.push(response?.payload?.text || "");
      result.sourceDocuments.push({
        ...(response?.payload || {}),
        id: response.id,
      });
      result.scores.push(response.score);
    });

    return result;
  },
  namespace: async function (client, namespace = null) {
    if (!namespace) throw new Error("No namespace value provided.");
    const collection = await client.getCollection(namespace).catch(() => null);
    if (!collection) return null;

    return {
      name: namespace,
      ...collection,
      vectorCount: collection.vectors_count,
    };
  },
  hasNamespace: async function (namespace = null) {
    if (!namespace) return false;
    const { client } = await this.connect();
    return await this.namespaceExists(client, namespace);
  },
  namespaceExists: async function (client, namespace = null) {
    if (!namespace) throw new Error("No namespace value provided.");
    const collection = await client.getCollection(namespace).catch((e) => {
      console.error("QDrant::namespaceExists", e.message);
      return null;
    });
    return !!collection;
  },
  deleteVectorsInNamespace: async function (client, namespace = null) {
    await client.deleteCollection(namespace);
    return true;
  },
  getOrCreateCollection: async function (client, namespace) {
    if (await this.namespaceExists(client, namespace)) {
      return await client.getCollection(namespace);
    }
    await client.createCollection(namespace, {
      vectors: {
        size: 1536, //TODO: Fixed to OpenAI models - when other embeddings exist make variable.
        distance: "Cosine",
      },
    });
    return await client.getCollection(namespace);
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
        const collection = await this.getOrCreateCollection(client, namespace);
        if (!collection)
          throw new Error("Failed to create new QDrant collection!", {
            namespace,
          });

        const { chunks } = cacheResult;
        const documentVectors = [];

        for (const chunk of chunks) {
          const submission = {
            ids: [],
            vectors: [],
            payloads: [],
          };

          // Before sending to Qdrant and saving the records to our db
          // we need to assign the id of each chunk that is stored in the cached file.
          chunk.forEach((chunk) => {
            const id = uuidv4();
            const { id: _id, ...payload } = chunk.payload;
            documentVectors.push({ docId, vectorId: id });
            submission.ids.push(id);
            submission.vectors.push(chunk.vector);
            submission.payloads.push(payload);
          });

          const additionResult = await client.upsert(namespace, {
            wait: true,
            batch: { ...submission },
          });
          if (additionResult?.status !== "completed")
            throw new Error("Error embedding into QDrant", additionResult);
        }

        await DocumentVectors.bulkInsert(documentVectors);
        return true;
      }

      // If we are here then we are going to embed and store a novel document.
      // We have to do this manually as opposed to using LangChains `Qdrant.fromDocuments`
      // because we then cannot atomically control our namespace to granularly find/remove documents
      // from vectordb.
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 20,
      });
      const textChunks = await textSplitter.splitText(pageContent);

      console.log("Chunks created from document:", textChunks.length);
      const LLMConnector = getLLMProvider();
      const documentVectors = [];
      const vectors = [];
      const vectorValues = await LLMConnector.embedChunks(textChunks);
      const submission = {
        ids: [],
        vectors: [],
        payloads: [],
      };

      if (!!vectorValues && vectorValues.length > 0) {
        for (const [i, vector] of vectorValues.entries()) {
          const vectorRecord = {
            id: uuidv4(),
            vector: vector,
            // [DO NOT REMOVE]
            // LangChain will be unable to find your text if you embed manually and dont include the `text` key.
            // https://github.com/hwchase17/langchainjs/blob/2def486af734c0ca87285a48f1a04c057ab74bdf/langchain/src/vectorstores/pinecone.ts#L64
            payload: { ...metadata, text: textChunks[i] },
          };

          submission.ids.push(vectorRecord.id);
          submission.vectors.push(vectorRecord.vector);
          submission.payloads.push(vectorRecord.payload);

          vectors.push(vectorRecord);
          documentVectors.push({ docId, vectorId: vectorRecord.id });
        }
      } else {
        throw new Error(
          "Could not embed document chunks! This document will not be recorded."
        );
      }

      const { client } = await this.connect();
      const collection = await this.getOrCreateCollection(client, namespace);
      if (!collection)
        throw new Error("Failed to create new QDrant collection!", {
          namespace,
        });

      if (vectors.length > 0) {
        const chunks = [];

        console.log("Inserting vectorized chunks into QDrant collection.");
        for (const chunk of toChunks(vectors, 500)) chunks.push(chunk);

        const additionResult = await client.upsert(namespace, {
          wait: true,
          batch: {
            ids: submission.ids,
            vectors: submission.vectors,
            payloads: submission.payloads,
          },
        });
        if (additionResult?.status !== "completed")
          throw new Error("Error embedding into QDrant", additionResult);

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
    await client.delete(namespace, {
      wait: true,
      points: vectorIds,
    });

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
    return {
      message: `Namespace ${namespace} was deleted along with ${details?.vectorCount} vectors.`,
    };
  },
  reset: async function () {
    const { client } = await this.connect();
    const response = await client.getCollections();
    for (const collection of response.collections) {
      await client.deleteCollection(collection.name);
    }
    return { reset: true };
  },
  curateSources: function (sources = []) {
    const documents = [];
    for (const source of sources) {
      if (Object.keys(source).length > 0) {
        const metadata = source.hasOwnProperty("metadata")
          ? source.metadata
          : source;
        documents.push({
          ...metadata,
        });
      }
    }

    return documents;
  },
};

module.exports.QDrant = QDrant;
