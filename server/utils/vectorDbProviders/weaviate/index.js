const { default: weaviate } = require("weaviate-ts-client");
const { TextSplitter } = require("../../TextSplitter");
const { SystemSettings } = require("../../../models/systemSettings");
const { storeVectorResult, cachedVectorInformation } = require("../../files");
const { v4: uuidv4 } = require("uuid");
const { toChunks, getEmbeddingEngineSelection } = require("../../helpers");
const { camelCase } = require("../../helpers/camelcase");
const { sourceIdentifier } = require("../../chats");

const Weaviate = {
  name: "Weaviate",
  connect: async function () {
    if (process.env.VECTOR_DB !== "weaviate")
      throw new Error("Weaviate::Invalid ENV settings");

    const weaviateUrl = new URL(process.env.WEAVIATE_ENDPOINT);
    const options = {
      scheme: weaviateUrl.protocol?.replace(":", "") || "http",
      host: weaviateUrl?.host,
      ...(process.env?.WEAVIATE_API_KEY?.length > 0
        ? { apiKey: new weaviate.ApiKey(process.env?.WEAVIATE_API_KEY) }
        : {}),
    };
    const client = weaviate.client(options);
    const isAlive = await await client.misc.liveChecker().do();
    if (!isAlive)
      throw new Error(
        "Weaviate::Invalid Alive signal received - is the service online?"
      );
    return { client };
  },
  heartbeat: async function () {
    await this.connect();
    return { heartbeat: Number(new Date()) };
  },
  totalVectors: async function () {
    const { client } = await this.connect();
    const collectionNames = await this.allNamespaces(client);
    var totalVectors = 0;
    for (const name of collectionNames) {
      totalVectors += await this.namespaceCountWithClient(client, name);
    }
    return totalVectors;
  },
  namespaceCountWithClient: async function (client, namespace) {
    try {
      const response = await client.graphql
        .aggregate()
        .withClassName(camelCase(namespace))
        .withFields("meta { count }")
        .do();
      return (
        response?.data?.Aggregate?.[camelCase(namespace)]?.[0]?.meta?.count || 0
      );
    } catch (e) {
      console.error(`Weaviate:namespaceCountWithClient`, e.message);
      return 0;
    }
  },
  namespaceCount: async function (namespace = null) {
    try {
      const { client } = await this.connect();
      const response = await client.graphql
        .aggregate()
        .withClassName(camelCase(namespace))
        .withFields("meta { count }")
        .do();

      return (
        response?.data?.Aggregate?.[camelCase(namespace)]?.[0]?.meta?.count || 0
      );
    } catch (e) {
      console.error(`Weaviate:namespaceCountWithClient`, e.message);
      return 0;
    }
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

    const weaviateClass = await this.namespace(client, namespace);
    const fields =
      weaviateClass.properties?.map((prop) => prop.name)?.join(" ") ?? "";
    const queryResponse = await client.graphql
      .get()
      .withClassName(camelCase(namespace))
      .withFields(`${fields} _additional { id certainty }`)
      .withNearVector({ vector: queryVector })
      .withLimit(topN)
      .do();

    const responses = queryResponse?.data?.Get?.[camelCase(namespace)];
    responses.forEach((response) => {
      // In Weaviate we have to pluck id from _additional and spread it into the rest
      // of the properties.
      const {
        _additional: { id, certainty },
        ...rest
      } = response;
      if (certainty < similarityThreshold) return;
      if (filterIdentifiers.includes(sourceIdentifier(rest))) {
        console.log(
          "Weaviate: A source was filtered from context as it's parent document is pinned."
        );
        return;
      }
      result.contextTexts.push(rest.text);
      result.sourceDocuments.push({ ...rest, id });
      result.scores.push(certainty);
    });

    return result;
  },
  allNamespaces: async function (client) {
    try {
      const { classes = [] } = await client.schema.getter().do();
      return classes.map((classObj) => classObj.class);
    } catch (e) {
      console.error("Weaviate::AllNamespace", e);
      return [];
    }
  },
  namespace: async function (client, namespace = null) {
    if (!namespace) throw new Error("No namespace value provided.");
    if (!(await this.namespaceExists(client, namespace))) return null;

    const weaviateClass = await client.schema
      .classGetter()
      .withClassName(camelCase(namespace))
      .do();

    return {
      ...weaviateClass,
      vectorCount: await this.namespaceCount(namespace),
    };
  },
  addVectors: async function (client, vectors = []) {
    const response = { success: true, errors: new Set([]) };
    const results = await client.batch
      .objectsBatcher()
      .withObjects(...vectors)
      .do();

    results.forEach((res) => {
      const { status, errors = [] } = res.result;
      if (status === "SUCCESS" || errors.length === 0) return;
      response.success = false;
      response.errors.add(errors.error?.[0]?.message || null);
    });

    response.errors = [...response.errors];
    return response;
  },
  hasNamespace: async function (namespace = null) {
    if (!namespace) return false;
    const { client } = await this.connect();
    const weaviateClasses = await this.allNamespaces(client);
    return weaviateClasses.includes(camelCase(namespace));
  },
  namespaceExists: async function (client, namespace = null) {
    if (!namespace) throw new Error("No namespace value provided.");
    const weaviateClasses = await this.allNamespaces(client);
    return weaviateClasses.includes(camelCase(namespace));
  },
  deleteVectorsInNamespace: async function (client, namespace = null) {
    await client.schema.classDeleter().withClassName(camelCase(namespace)).do();
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
      const {
        pageContent,
        docId,
        id: _id, // Weaviate will abort if `id` is present in properties
        ...metadata
      } = documentData;
      if (!pageContent || pageContent.length == 0) return false;

      console.log("Adding new vectorized document into namespace", namespace);
      if (skipCache) {
        const cacheResult = await cachedVectorInformation(fullFilePath);
        if (cacheResult.exists) {
          const { client } = await this.connect();
          const weaviateClassExits = await this.hasNamespace(namespace);
          if (!weaviateClassExits) {
            await client.schema
              .classCreator()
              .withClass({
                class: camelCase(namespace),
                description: `Class created by AnythingLLM named ${camelCase(
                  namespace
                )}`,
                vectorizer: "none",
              })
              .do();
          }

          const { chunks } = cacheResult;
          const documentVectors = [];
          const vectors = [];

          for (const chunk of chunks) {
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
                class: camelCase(namespace),
                vector: chunk.vector || chunk.values || [],
                properties: { ...flattenedMetadata },
              };
              vectors.push(vectorRecord);
            });

            const { success: additionResult, errors = [] } =
              await this.addVectors(client, vectors);
            if (!additionResult) {
              console.error("Weaviate::addVectors failed to insert", errors);
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
      });
      const textChunks = await textSplitter.splitText(pageContent);

      console.log("Chunks created from document:", textChunks.length);
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
            class: camelCase(namespace),
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
        await client.schema
          .classCreator()
          .withClass({
            class: camelCase(namespace),
            description: `Class created by AnythingLLM named ${camelCase(
              namespace
            )}`,
            vectorizer: "none",
          })
          .do();
      }

      if (vectors.length > 0) {
        const chunks = [];
        for (const chunk of toChunks(vectors, 500)) chunks.push(chunk);

        console.log("Inserting vectorized chunks into Weaviate collection.");
        const { success: additionResult, errors = [] } = await this.addVectors(
          client,
          vectors
        );
        if (!additionResult) {
          console.error("Weaviate::addVectors failed to insert", errors);
          throw new Error("Error embedding into Weaviate");
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
    if (!(await this.namespaceExists(client, namespace))) return;

    const knownDocuments = await DocumentVectors.where({ docId });
    if (knownDocuments.length === 0) return;

    for (const doc of knownDocuments) {
      await client.data
        .deleter()
        .withClassName(camelCase(namespace))
        .withId(doc.vectorId)
        .do();
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
  "namespace-stats": async function (reqBody = {}) {
    const { namespace = null } = reqBody;
    if (!namespace) throw new Error("namespace required");
    const { client } = await this.connect();
    const stats = await this.namespace(client, namespace);
    return stats
      ? stats
      : { message: "No stats were able to be fetched from DB for namespace" };
  },
  "delete-namespace": async function (reqBody = {}) {
    const { namespace = null } = reqBody;
    const { client } = await this.connect();
    const details = await this.namespace(client, namespace);
    await this.deleteVectorsInNamespace(client, namespace);
    return {
      message: `Namespace ${camelCase(namespace)} was deleted along with ${
        details?.vectorCount
      } vectors.`,
    };
  },
  reset: async function () {
    const { client } = await this.connect();
    const weaviateClasses = await this.allNamespaces(client);
    for (const weaviateClass of weaviateClasses) {
      await client.schema.classDeleter().withClassName(weaviateClass).do();
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
        documents.push({ ...metadata });
      }
    }

    return documents;
  },
  flattenObjectForWeaviate: function (obj = {}) {
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  },
};

module.exports.Weaviate = Weaviate;
