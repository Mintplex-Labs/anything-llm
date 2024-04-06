const { ChromaClient } = require("chromadb");
const { TextSplitter } = require("../../TextSplitter");
const { storeVectorResult, cachedVectorInformation } = require("../../files");
const { v4: uuidv4 } = require("uuid");
const {
  toChunks,
  getLLMProvider,
  getEmbeddingEngineSelection,
} = require("../../helpers");
const { parseAuthHeader } = require("../../http");

const Chroma = {
  name: "Chroma",
  connect: async function () {
    if (process.env.VECTOR_DB !== "chroma")
      throw new Error("Chroma::Invalid ENV settings");

    const client = new ChromaClient({
      path: process.env.CHROMA_ENDPOINT, // if not set will fallback to localhost:8000
      ...(!!process.env.CHROMA_API_HEADER && !!process.env.CHROMA_API_KEY
        ? {
            fetchOptions: {
              headers: parseAuthHeader(
                process.env.CHROMA_API_HEADER || "X-Api-Key",
                process.env.CHROMA_API_KEY
              ),
            },
          }
        : {}),
    });

    const isAlive = await client.heartbeat();
    if (!isAlive)
      throw new Error(
        "ChromaDB::Invalid Heartbeat received - is the instance online?"
      );
    return { client };
  },
  heartbeat: async function () {
    const { client } = await this.connect();
    return { heartbeat: await client.heartbeat() };
  },
  totalVectors: async function () {
    const { client } = await this.connect();
    const collections = await client.listCollections();
    var totalVectors = 0;
    for (const collectionObj of collections) {
      const collection = await client
        .getCollection({ name: collectionObj.name })
        .catch(() => null);
      if (!collection) continue;
      totalVectors += await collection.count();
    }
    return totalVectors;
  },
  distanceToSimilarity: function (distance = null) {
    if (distance === null || typeof distance !== "number") return 0.0;
    if (distance >= 1.0) return 1;
    if (distance <= 0) return 0;
    return 1 - distance;
  },
  namespaceCount: async function (_namespace = null) {
    const { client } = await this.connect();
    const namespace = await this.namespace(client, _namespace);
    return namespace?.vectorCount || 0;
  },
  similarityResponse: async function (
    client,
    namespace,
    queryVector,
    similarityThreshold = 0.25,
    topN = 4
  ) {
    const collection = await client.getCollection({ name: namespace });
    const result = {
      contextTexts: [],
      sourceDocuments: [],
      scores: [],
    };

    const response = await collection.query({
      queryEmbeddings: queryVector,
      nResults: topN,
    });
    response.ids[0].forEach((_, i) => {
      if (
        this.distanceToSimilarity(response.distances[0][i]) <
        similarityThreshold
      )
        return;
      result.contextTexts.push(response.documents[0][i]);
      result.sourceDocuments.push(response.metadatas[0][i]);
      result.scores.push(this.distanceToSimilarity(response.distances[0][i]));
    });

    return result;
  },
  namespace: async function (client, namespace = null) {
    if (!namespace) throw new Error("No namespace value provided.");
    const collection = await client
      .getCollection({ name: namespace })
      .catch(() => null);
    if (!collection) return null;

    return {
      ...collection,
      vectorCount: await collection.count(),
    };
  },
  hasNamespace: async function (namespace = null) {
    if (!namespace) return false;
    const { client } = await this.connect();
    return await this.namespaceExists(client, namespace);
  },
  namespaceExists: async function (client, namespace = null) {
    if (!namespace) throw new Error("No namespace value provided.");
    const collection = await client
      .getCollection({ name: namespace })
      .catch((e) => {
        console.error("ChromaDB::namespaceExists", e.message);
        return null;
      });
    return !!collection;
  },
  deleteVectorsInNamespace: async function (client, namespace = null) {
    await client.deleteCollection({ name: namespace });
    return true;
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
        const collection = await client.getOrCreateCollection({
          name: namespace,
          metadata: { "hnsw:space": "cosine" },
        });
        const { chunks } = cacheResult;
        const documentVectors = [];

        for (const chunk of chunks) {
          const submission = {
            ids: [],
            embeddings: [],
            metadatas: [],
            documents: [],
          };

          // Before sending to Chroma and saving the records to our db
          // we need to assign the id of each chunk that is stored in the cached file.
          chunk.forEach((chunk) => {
            const id = uuidv4();
            const { id: _id, ...metadata } = chunk.metadata;
            documentVectors.push({ docId, vectorId: id });
            submission.ids.push(id);
            submission.embeddings.push(chunk.values);
            submission.metadatas.push(metadata);
            submission.documents.push(metadata.text);
          });

          const additionResult = await collection.add(submission);
          if (!additionResult)
            throw new Error("Error embedding into ChromaDB", additionResult);
        }

        await DocumentVectors.bulkInsert(documentVectors);
        return { vectorized: true, error: null };
      }

      // If we are here then we are going to embed and store a novel document.
      // We have to do this manually as opposed to using LangChains `Chroma.fromDocuments`
      // because we then cannot atomically control our namespace to granularly find/remove documents
      // from vectordb.
      const textSplitter = new TextSplitter({
        chunkSize: TextSplitter.determineMaxChunkSize(
          await SystemSettings.getValueOrFallback({
            label: "text_splitter_chunk_size",
          }),
          getEmbeddingEngineSelection()?.embeddingMaxChunkLength
        ),
        chunkOverlap: await SystemSettings.getValueOrFallback(
          { label: "text_splitter_chunk_overlap" },
          20
        ),
      });
      const textChunks = await textSplitter.splitText(pageContent);

      console.log("Chunks created from document:", textChunks.length);
      const LLMConnector = getLLMProvider();
      const documentVectors = [];
      const vectors = [];
      const vectorValues = await LLMConnector.embedChunks(textChunks);
      const submission = {
        ids: [],
        embeddings: [],
        metadatas: [],
        documents: [],
      };

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

          submission.ids.push(vectorRecord.id);
          submission.embeddings.push(vectorRecord.values);
          submission.metadatas.push(metadata);
          submission.documents.push(textChunks[i]);

          vectors.push(vectorRecord);
          documentVectors.push({ docId, vectorId: vectorRecord.id });
        }
      } else {
        throw new Error(
          "Could not embed document chunks! This document will not be recorded."
        );
      }

      const { client } = await this.connect();
      const collection = await client.getOrCreateCollection({
        name: namespace,
        metadata: { "hnsw:space": "cosine" },
      });

      if (vectors.length > 0) {
        const chunks = [];

        console.log("Inserting vectorized chunks into Chroma collection.");
        for (const chunk of toChunks(vectors, 500)) chunks.push(chunk);

        const additionResult = await collection.add(submission);
        if (!additionResult)
          throw new Error("Error embedding into ChromaDB", additionResult);

        await storeVectorResult(chunks, fullFilePath);
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
    const collection = await client.getCollection({
      name: namespace,
    });

    const knownDocuments = await DocumentVectors.where({ docId });
    if (knownDocuments.length === 0) return;

    const vectorIds = knownDocuments.map((doc) => doc.vectorId);
    await collection.delete({ ids: vectorIds });

    const indexes = knownDocuments.map((doc) => doc.id);
    await DocumentVectors.deleteIds(indexes);
    return true;
  },
  performSimilaritySearch: async function ({
    namespace = null,
    input = "",
    LLMConnector = null,
    similarityThreshold = 0.25,
    topN = 4,
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
      topN
    );

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

    const details = await this.namespace(client, namespace);
    await this.deleteVectorsInNamespace(client, namespace);
    return {
      message: `Namespace ${namespace} was deleted along with ${details?.vectorCount} vectors.`,
    };
  },
  reset: async function () {
    const { client } = await this.connect();
    await client.reset();
    return { reset: true };
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

module.exports.Chroma = Chroma;
