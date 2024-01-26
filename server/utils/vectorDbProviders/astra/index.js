const { AstraDB: AstraClient } = require("@datastax/astra-db-ts");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { storeVectorResult, cachedVectorInformation } = require("../../files");
const { v4: uuidv4 } = require("uuid");
const {
  toChunks,
  getLLMProvider,
  getEmbeddingEngineSelection,
} = require("../../helpers");

const AstraDB = {
  name: "AstraDB",
  connect: async function () {
    if (process.env.VECTOR_DB !== "astra")
      throw new Error("AstraDB::Invalid ENV settings");

    const client = new AstraClient(
      process?.env?.ASTRA_DB_APPLICATION_TOKEN,
      process?.env?.ASTRA_DB_ENDPOINT
    );
    return { client };
  },
  heartbeat: async function () {
    return { heartbeat: Number(new Date()) };
  },
  // Astra interface will return a valid collection object even if the collection
  // does not actually exist. So we run a simple check which will always throw
  // when the table truly does not exist. Faster than iterating all collections.
  isRealCollection: async function (astraCollection = null) {
    if (!astraCollection) return false;
    return await astraCollection
      .countDocuments()
      .then(() => true)
      .catch(() => false);
  },
  totalVectors: async function () {
    const { client } = await this.connect();
    const collectionNames = await this.allNamespaces(client);
    var totalVectors = 0;
    for (const name of collectionNames) {
      const collection = await client.collection(name).catch(() => null);
      const count = await collection.countDocuments().catch(() => 0);
      totalVectors += count ? count : 0;
    }
    return totalVectors;
  },
  namespaceCount: async function (_namespace = null) {
    const { client } = await this.connect();
    const namespace = await this.namespace(client, _namespace);
    return namespace?.vectorCount || 0;
  },
  namespace: async function (client, namespace = null) {
    if (!namespace) throw new Error("No namespace value provided.");
    const collection = await client.collection(namespace).catch(() => null);
    if (!(await this.isRealCollection(collection))) return null;

    const count = await collection.countDocuments().catch((e) => {
      console.error("Astra::namespaceExists", e.message);
      return null;
    });

    return {
      name: namespace,
      ...collection,
      vectorCount: typeof count === "number" ? count : 0,
    };
  },
  hasNamespace: async function (namespace = null) {
    if (!namespace) return false;
    const { client } = await this.connect();
    return await this.namespaceExists(client, namespace);
  },
  namespaceExists: async function (client, namespace = null) {
    if (!namespace) throw new Error("No namespace value provided.");
    const collection = await client.collection(namespace);
    return await this.isRealCollection(collection);
  },
  deleteVectorsInNamespace: async function (client, namespace = null) {
    await client.dropCollection(namespace);
    return true;
  },
  // AstraDB requires a dimension aspect for collection creation
  // we pass this in from the first chunk to infer the dimensions like other
  // providers do.
  getOrCreateCollection: async function (client, namespace, dimensions = null) {
    const isExists = await this.namespaceExists(client, namespace);
    if (!isExists) {
      if (!dimensions)
        throw new Error(
          `AstraDB:getOrCreateCollection Unable to infer vector dimension from input. Open an issue on Github for support.`
        );

      await client.createCollection(namespace, {
        vector: {
          dimension: dimensions,
          metric: "cosine",
        },
      });
    }
    return await client.collection(namespace);
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

        const collection = await this.getOrCreateCollection(
          client,
          namespace,
          vectorDimension
        );
        if (!(await this.isRealCollection(collection)))
          throw new Error("Failed to create new AstraDB collection!", {
            namespace,
          });

        for (const chunk of chunks) {
          // Before sending to Astra and saving the records to our db
          // we need to assign the id of each chunk that is stored in the cached file.
          const newChunks = chunk.map((chunk) => {
            const _id = uuidv4();
            documentVectors.push({ docId, vectorId: _id });
            return {
              _id: _id,
              $vector: chunk.values,
              metadata: chunk.metadata || {},
            };
          });

          await collection.insertMany(newChunks);
        }
        await DocumentVectors.bulkInsert(documentVectors);
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
            _id: uuidv4(),
            $vector: vector,
            metadata: { ...metadata, text: textChunks[i] },
          };

          vectors.push(vectorRecord);
          documentVectors.push({ docId, vectorId: vectorRecord._id });
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
      if (!(await this.isRealCollection(collection)))
        throw new Error("Failed to create new AstraDB collection!", {
          namespace,
        });

      if (vectors.length > 0) {
        const chunks = [];

        console.log("Inserting vectorized chunks into Astra DB.");

        // AstraDB has maximum upsert size of 20 records per-request so we have to use a lower chunk size here
        // in order to do the queries - this takes a lot more time than other providers but there
        // is no way around it. This will save the vector-cache with the same layout, so we don't
        // have to chunk again for cached files.
        for (const chunk of toChunks(vectors, 20)) {
          chunks.push(
            chunk.map((c) => {
              return { id: c._id, values: c.$vector, metadata: c.metadata };
            })
          );
          await collection.insertMany(chunk);
        }
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
    if (!(await this.namespaceExists(client, namespace)))
      throw new Error(
        "Invalid namespace - has it been collected and populated yet?"
      );
    const collection = await client.collection(namespace);

    const knownDocuments = await DocumentVectors.where({ docId });
    if (knownDocuments.length === 0) return;

    const vectorIds = knownDocuments.map((doc) => doc.vectorId);
    for (const id of vectorIds) {
      await collection.deleteMany({
        _id: id,
      });
    }

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
        message:
          "Invalid query - no namespace found for workspace in vector db!",
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
    topN = 4
  ) {
    const result = {
      contextTexts: [],
      sourceDocuments: [],
      scores: [],
    };

    const collection = await client.collection(namespace);
    const responses = await collection
      .find(
        {},
        {
          sort: { $vector: queryVector },
          limit: topN,
          includeSimilarity: true,
        }
      )
      .toArray();

    responses.forEach((response) => {
      if (response.$similarity < similarityThreshold) return;
      result.contextTexts.push(response.metadata.text);
      result.sourceDocuments.push(response);
      result.scores.push(response.$similarity);
    });
    return result;
  },
  allNamespaces: async function (client) {
    try {
      let header = new Headers();
      header.append("Token", client?.httpClient?.applicationToken);
      header.append("Content-Type", "application/json");

      let raw = JSON.stringify({
        findCollections: {},
      });

      let requestOptions = {
        method: "POST",
        headers: header,
        body: raw,
        redirect: "follow",
      };

      const call = await fetch(client?.httpClient?.baseUrl, requestOptions);
      const resp = await call?.text();
      const collections = resp ? JSON.parse(resp)?.status?.collections : [];
      return collections;
    } catch (e) {
      console.error("Astra::AllNamespace", e);
      return [];
    }
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
      message: `Namespace ${namespace} was deleted along with ${
        details?.vectorCount || "all"
      } vectors.`,
    };
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

module.exports.AstraDB = AstraDB;
