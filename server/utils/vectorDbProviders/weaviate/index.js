const { default: weaviate } = require("weaviate-client");
const { TextSplitter } = require("../../TextSplitter");
const { SystemSettings } = require("../../../models/systemSettings");
const { storeVectorResult, cachedVectorInformation } = require("../../files");
const { v4: uuidv4 } = require("uuid");
const { toChunks, getEmbeddingEngineSelection } = require("../../helpers");
const { camelCase } = require("../../helpers/camelcase");
const { sourceIdentifier } = require("../../chats");
const { VectorDatabase } = require("../base");

class Weaviate extends VectorDatabase {
  constructor() {
    super();
  }

  get name() {
    return "Weaviate";
  }

  // Weaviate class names must start with a capital letter, so namespaces are stored
  // PascalCased (eg: `sales-2024` -> `Sales2024`).
  normalize(namespace) {
    return camelCase(namespace);
  }

  // Weaviate Cloud serves gRPC on a separate host, which `connectToWeaviateCloud` resolves.
  // Self-hosted instances serve gRPC on the same host as HTTP, on WEAVIATE_GRPC_PORT.
  async connect() {
    if (process.env.VECTOR_DB !== "weaviate")
      throw new Error("Weaviate::Invalid ENV settings");

    const weaviateUrl = new URL(process.env.WEAVIATE_ENDPOINT);
    const isSecure = weaviateUrl.protocol === "https:";
    const isWeaviateCloud =
      weaviateUrl.hostname.endsWith(".weaviate.cloud") ||
      weaviateUrl.hostname.endsWith(".weaviate.network");
    const options = {
      ...(process.env?.WEAVIATE_API_KEY?.length > 0
        ? {
            authCredentials: new weaviate.ApiKey(process.env?.WEAVIATE_API_KEY),
          }
        : {}),
    };

    const client = isWeaviateCloud
      ? await weaviate.connectToWeaviateCloud(weaviateUrl.origin, options)
      : await weaviate.connectToCustom({
          httpHost: weaviateUrl.hostname,
          httpPort: Number(weaviateUrl.port) || (isSecure ? 443 : 80),
          httpSecure: isSecure,
          grpcHost: weaviateUrl.hostname,
          grpcPort: Number(process.env.WEAVIATE_GRPC_PORT) || 50051,
          grpcSecure: isSecure,
          ...options,
        });
    const isAlive = await client.isLive();
    if (!isAlive)
      throw new Error(
        "Weaviate::Invalid Alive signal received - is the service online?"
      );
    return { client };
  }

  /**
   * Converts a cosine distance ([0, 2]: 0 identical, 1 orthogonal, 2 opposite)
   * to a similarity score in [0, 1]. Distances at or past orthogonal floor at 0
   * so unrelated chunks can never clear a similarity threshold.
   * Weaviate's own `certainty` is 1 - distance / 2, which puts an orthogonal
   * chunk at 0.5, so it is not comparable with the other providers' scores.
   * @see https://docs.weaviate.io/weaviate/config-refs/distances
   * @param {number|null} distance - Cosine distance from the vector search.
   * @returns {number} Similarity score in [0, 1].
   */
  distanceToSimilarity(distance = null) {
    if (distance === null || typeof distance !== "number") return 0.0;
    if (distance >= 1.0) return 0;
    if (distance < 0) return 1 - Math.abs(distance);
    return 1 - distance;
  }

  async heartbeat() {
    await this.connect();
    return { heartbeat: Number(new Date()) };
  }

  async totalVectors() {
    const { client } = await this.connect();
    const collectionNames = await this.allNamespaces(client);
    var totalVectors = 0;
    for (const name of collectionNames) {
      totalVectors += await this.namespaceCountWithClient(client, name);
    }
    return totalVectors;
  }

  async namespaceCountWithClient(client, namespace) {
    try {
      return await client.collections.get(this.normalize(namespace)).length();
    } catch (e) {
      this.logger(`namespaceCountWithClient`, e.message);
      return 0;
    }
  }

  async namespaceCount(namespace = null) {
    const { client } = await this.connect();
    return await this.namespaceCountWithClient(client, namespace);
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

    const { objects } = await client.collections
      .get(this.normalize(namespace))
      .query.nearVector(queryVector, {
        limit: topN,
        returnMetadata: ["distance"],
      });

    objects.forEach((object) => {
      const { uuid: id, properties, metadata } = object;
      const score = this.distanceToSimilarity(metadata?.distance);
      if (score < similarityThreshold) return;
      if (filterIdentifiers.includes(sourceIdentifier(properties))) {
        this.logger(
          "A source was filtered from context as it's parent document is pinned."
        );
        return;
      }
      result.contextTexts.push(properties.text);
      result.sourceDocuments.push({ ...properties, id, score });
      result.scores.push(score);
    });

    return result;
  }

  async allNamespaces(client) {
    try {
      const collections = await client.collections.listAll();
      return collections.map((collection) => collection.name);
    } catch (e) {
      this.logger("AllNamespace", e);
      return [];
    }
  }

  async namespace(client, namespace = null) {
    if (!namespace) throw new Error("No namespace value provided.");
    if (!(await this.namespaceExists(client, namespace))) return null;

    const collection = client.collections.get(this.normalize(namespace));
    return {
      ...(await collection.config.get()),
      vectorCount: await collection.length(),
    };
  }

  async addVectors(client, namespace, vectors = []) {
    const { hasErrors, errors } = await client.collections
      .get(this.normalize(namespace))
      .data.insertMany(
        vectors.map(({ id, vector, properties }) => ({
          id,
          vectors: vector,
          properties,
        }))
      );

    return {
      success: !hasErrors,
      errors: [...new Set(Object.values(errors).map((e) => e.message))],
    };
  }

  async hasNamespace(namespace = null) {
    if (!namespace) return false;
    const { client } = await this.connect();
    return await client.collections.exists(this.normalize(namespace));
  }

  async namespaceExists(client, namespace = null) {
    if (!namespace) throw new Error("No namespace value provided.");
    return await client.collections.exists(this.normalize(namespace));
  }

  async deleteVectorsInNamespace(client, namespace = null) {
    await client.collections.delete(this.normalize(namespace));
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
      const {
        pageContent,
        docId,
        id: _id, // Weaviate will abort if `id` is present in properties
        ...metadata
      } = documentData;
      if (!pageContent || pageContent.length == 0) return false;

      this.logger("Adding new vectorized document into namespace", namespace);
      if (!skipCache) {
        const cacheResult = await cachedVectorInformation(fullFilePath);
        if (cacheResult.exists) {
          const { client } = await this.connect();
          const weaviateClassExits = await this.hasNamespace(namespace);
          if (!weaviateClassExits) {
            await client.collections.createFromSchema({
              class: this.normalize(namespace),
              description: `Class created by AnythingLLM named ${this.normalize(
                namespace
              )}`,
              vectorizer: "none",
            });
          }

          const { chunks } = cacheResult;
          const documentVectors = [];

          for (const chunk of chunks) {
            const vectors = [];
            // Before sending to Weaviate and saving the records to our db
            // we need to assign the id of each chunk that is stored in the cached file.
            chunk.forEach((chunk) => {
              const id = uuidv4();
              const flattenedMetadata = this.flattenObjectForWeaviate(
                chunk.properties ?? chunk.metadata
              );
              documentVectors.push({ docId, vectorId: id });
              const vectorRecord = {
                id,
                vector: chunk.vector || chunk.values || [],
                properties: { ...flattenedMetadata },
              };
              vectors.push(vectorRecord);
            });

            const { success: additionResult, errors = [] } =
              await this.addVectors(client, namespace, vectors);
            if (!additionResult) {
              this.logger("addVectors failed to insert", errors);
              throw new Error("Error embedding into Weaviate");
            }
          }

          await DocumentVectors.bulkInsert(documentVectors);
          return { vectorized: true, error: null };
        }
      }

      // If we are here then we are going to embed and store a novel document.
      // We have to do this manually as opposed to using LangChains `Chroma.fromDocuments`
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
      const vectorValues = await EmbedderEngine.embedChunks(textChunks);
      const submission = {
        ids: [],
        vectors: [],
        properties: [],
      };

      if (!!vectorValues && vectorValues.length > 0) {
        for (const [i, vector] of vectorValues.entries()) {
          const flattenedMetadata = this.flattenObjectForWeaviate(metadata);
          const vectorRecord = {
            id: uuidv4(),
            vector: vector,
            // [DO NOT REMOVE]
            // LangChain will be unable to find your text if you embed manually and dont include the `text` key.
            // https://github.com/hwchase17/langchainjs/blob/5485c4af50c063e257ad54f4393fa79e0aff6462/langchain/src/vectorstores/weaviate.ts#L133
            properties: { ...flattenedMetadata, text: textChunks[i] },
          };

          submission.ids.push(vectorRecord.id);
          submission.vectors.push(vectorRecord.values);
          submission.properties.push(metadata);

          vectors.push(vectorRecord);
          documentVectors.push({ docId, vectorId: vectorRecord.id });
        }
      } else {
        throw new Error(
          "Could not embed document chunks! This document will not be recorded."
        );
      }

      const { client } = await this.connect();
      const weaviateClassExits = await this.hasNamespace(namespace);
      if (!weaviateClassExits) {
        await client.collections.createFromSchema({
          class: this.normalize(namespace),
          description: `Class created by AnythingLLM named ${this.normalize(
            namespace
          )}`,
          vectorizer: "none",
        });
      }

      if (vectors.length > 0) {
        const chunks = [];
        for (const chunk of toChunks(vectors, 500)) chunks.push(chunk);

        this.logger("Inserting vectorized chunks into Weaviate collection.");
        for (const chunk of chunks) {
          const { success: additionResult, errors = [] } =
            await this.addVectors(client, namespace, chunk);
          if (!additionResult) {
            this.logger("addVectors failed to insert", errors);
            throw new Error("Error embedding into Weaviate");
          }
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
    if (!(await this.namespaceExists(client, namespace))) return;

    const knownDocuments = await DocumentVectors.where({ docId });
    if (knownDocuments.length === 0) return;

    const collection = client.collections.get(this.normalize(namespace));
    for (const chunk of toChunks(knownDocuments, 500)) {
      await collection.data.deleteMany(
        collection.filter.byId().containsAny(chunk.map((doc) => doc.vectorId))
      );
    }

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
  }

  async "namespace-stats"(reqBody = {}) {
    const { namespace = null } = reqBody;
    if (!namespace) throw new Error("namespace required");
    const { client } = await this.connect();
    const stats = await this.namespace(client, namespace);
    return stats
      ? stats
      : { message: "No stats were able to be fetched from DB for namespace" };
  }

  async "delete-namespace"(reqBody = {}) {
    const { namespace = null } = reqBody;
    const { client } = await this.connect();
    const details = await this.namespace(client, namespace);
    await this.deleteVectorsInNamespace(client, namespace);
    return {
      message: `Namespace ${this.normalize(namespace)} was deleted along with ${
        details?.vectorCount
      } vectors.`,
    };
  }

  async reset() {
    const { client } = await this.connect();
    await client.collections.deleteAll();
    return { reset: true };
  }

  curateSources(sources = []) {
    const documents = [];
    for (const source of sources) {
      if (Object.keys(source).length > 0) {
        const metadata = source.hasOwnProperty("metadata")
          ? source.metadata
          : source;
        documents.push({ ...metadata });
      }
    }

    return documents;
  }

  flattenObjectForWeaviate(obj = {}) {
    // Note this function is not generic, it is designed specifically for Weaviate
    // https://weaviate.io/developers/weaviate/config-refs/datatypes#introduction
    // Credit to LangchainJS
    // https://github.com/hwchase17/langchainjs/blob/5485c4af50c063e257ad54f4393fa79e0aff6462/langchain/src/vectorstores/weaviate.ts#L11C1-L50C3
    const flattenedObject = {};

    for (const key in obj) {
      if (!Object.hasOwn(obj, key) || key === "id") {
        continue;
      }
      const value = obj[key];
      if (typeof obj[key] === "object" && !Array.isArray(value)) {
        const recursiveResult = this.flattenObjectForWeaviate(value);

        for (const deepKey in recursiveResult) {
          if (Object.hasOwn(obj, key)) {
            flattenedObject[`${key}_${deepKey}`] = recursiveResult[deepKey];
          }
        }
      } else if (Array.isArray(value)) {
        if (
          value.length > 0 &&
          typeof value[0] !== "object" &&
          value.every((el) => typeof el === typeof value[0])
        ) {
          // Weaviate only supports arrays of primitive types,
          // where all elements are of the same type
          flattenedObject[key] = value;
        }
      } else {
        flattenedObject[key] = value;
      }
    }

    return flattenedObject;
  }
}

module.exports.Weaviate = Weaviate;
