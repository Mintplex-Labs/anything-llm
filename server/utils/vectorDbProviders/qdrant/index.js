const { QdrantClient } = require("@qdrant/js-client-rest");
const { TextSplitter } = require("../../TextSplitter");
const { SystemSettings } = require("../../../models/systemSettings");
const { storeVectorResult, cachedVectorInformation } = require("../../files");
const { v4: uuidv4 } = require("uuid");
const { toChunks, getEmbeddingEngineSelection } = require("../../helpers");
const { sourceIdentifier } = require("../../chats");

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
  similarityResponse: async function ({
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

    const responses = await client.search(namespace, {
      vector: queryVector,
      limit: topN,
      with_payload: true,
    });

    responses.forEach((response) => {
      if (response.score < similarityThreshold) return;
      if (filterIdentifiers.includes(sourceIdentifier(response?.payload))) {
        console.log(
          "QDrant: A source was filtered from context as it's parent document is pinned."
        );
        return;
      }

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
      vectorCount: (await client.count(namespace, { exact: true })).count,
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
  // QDrant requires a dimension aspect for collection creation
  // we pass this in from the first chunk to infer the dimensions like other
  // providers do.
  getOrCreateCollection: async function (client, namespace, dimensions = null) {
    if (await this.namespaceExists(client, namespace)) {
      return await client.getCollection(namespace);
    }
    if (!dimensions)
      throw new Error(
        `Qdrant:getOrCreateCollection Unable to infer vector dimension from input. Open an issue on GitHub for support.`
      );
    await client.createCollection(namespace, {
      vectors: {
        size: dimensions,
        distance: "Cosine",
      },
    });
    return await client.getCollection(namespace);
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
      if (!skipCache) {
        const cacheResult = await cachedVectorInformation(fullFilePath);
        if (cacheResult.exists) {
          const { client } = await this.connect();
          const { chunks } = cacheResult;
          const documentVectors = [];
          vectorDimension =
            chunks[0][0]?.vector?.length ??
            chunks[0][0]?.values?.length ??
            null;

          const collection = await this.getOrCreateCollection(
            client,
            namespace,
            vectorDimension
          );
          if (!collection)
            throw new Error("Failed to create new QDrant collection!", {
              namespace,
            });

          for (const chunk of chunks) {
            const submission = {
              ids: [],
              vectors: [],
              payloads: [],
            };

            // Before sending to Qdrant and saving the records to our db
            // we need to assign the id of each chunk that is stored in the cached file.
            // The id property must be defined or else it will be unable to be managed by ALLM.
            chunk.forEach((chunk) => {
              const id = uuidv4();
              if (chunk?.payload?.hasOwnProperty("id")) {
                const { id: _id, ...payload } = chunk.payload;
                documentVectors.push({ docId, vectorId: id });
                submission.ids.push(id);
                submission.vectors.push(chunk.vector);
                submission.payloads.push(payload);
              } else {
                console.error(
                  "The 'id' property is not defined in chunk.payload - it will be omitted from being inserted in QDrant collection."
                );
              }
            });

            const additionResult = await client.upsert(namespace, {
              wait: true,
              batch: { ...submission },
            });
            if (additionResult?.status !== "completed")
              throw new Error("Error embedding into QDrant", additionResult);
          }

          await DocumentVectors.bulkInsert(documentVectors);
          return { vectorized: true, error: null };
        }
      }

      // If we are here then we are going to embed and store a novel document.
      // We have to do this manually as opposed to using LangChains `Qdrant.fromDocuments`
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

      console.log("Chunks created from document:", textChunks.length);
      const documentVectors = [];
      const vectors = [];
      const vectorValues = await EmbedderEngine.embedChunks(textChunks);
      const submission = {
        ids: [],
        vectors: [],
        payloads: [],
      };

      if (!!vectorValues && vectorValues.length > 0) {
        for (const [i, vector] of vectorValues.entries()) {
          if (!vectorDimension) vectorDimension = vector.length;
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
      const collection = await this.getOrCreateCollection(
        client,
        namespace,
        vectorDimension
      );
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
    const { contextTexts, sourceDocuments } = await this.similarityResponse({
      client,
      namespace,
      queryVector,
      similarityThreshold,
      topN,
      filterIdentifiers,
    });

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
