const { Pinecone } = require("@pinecone-database/pinecone");
const { TextSplitter } = require("../../TextSplitter");
const { SystemSettings } = require("../../../models/systemSettings");
const { storeVectorResult, cachedVectorInformation } = require("../../files");
const { v4: uuidv4 } = require("uuid");
const { toChunks, getEmbeddingEngineSelection } = require("../../helpers");
const { sourceIdentifier } = require("../../chats");

const PineconeDB = {
  name: "Pinecone",
  connect: async function () {
    if (process.env.VECTOR_DB !== "pinecone")
      throw new Error("Pinecone::Invalid ENV settings");

    const client = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    const pineconeIndex = client.Index(process.env.PINECONE_INDEX);
    const { status } = await client.describeIndex(process.env.PINECONE_INDEX);

    if (!status.ready) throw new Error("Pinecone::Index not ready.");
    return { client, pineconeIndex, indexName: process.env.PINECONE_INDEX };
  },
  totalVectors: async function () {
    const { pineconeIndex } = await this.connect();
    const { namespaces } = await pineconeIndex.describeIndexStats();

    return Object.values(namespaces).reduce(
      (a, b) => a + (b?.recordCount || 0),
      0
    );
  },
  namespaceCount: async function (_namespace = null) {
    const { pineconeIndex } = await this.connect();
    const namespace = await this.namespace(pineconeIndex, _namespace);
    return namespace?.recordCount || 0;
  },
  similarityResponse: async function (
    index,
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

    const pineconeNamespace = index.namespace(namespace);
    const response = await pineconeNamespace.query({
      vector: queryVector,
      topK: topN,
      includeMetadata: true,
    });

    response.matches.forEach((match) => {
      if (match.score < similarityThreshold) return;
      if (filterIdentifiers.includes(sourceIdentifier(match.metadata))) {
        console.log(
          "Pinecone: A source was filtered from context as it's parent document is pinned."
        );
        return;
      }

      result.contextTexts.push(match.metadata.text);
      result.sourceDocuments.push(match);
      result.scores.push(match.score);
    });

    return result;
  },
  namespace: async function (index, namespace = null) {
    if (!namespace) throw new Error("No namespace value provided.");
    const { namespaces } = await index.describeIndexStats();
    return namespaces.hasOwnProperty(namespace) ? namespaces[namespace] : null;
  },
  hasNamespace: async function (namespace = null) {
    if (!namespace) return false;
    const { pineconeIndex } = await this.connect();
    return await this.namespaceExists(pineconeIndex, namespace);
  },
  namespaceExists: async function (index, namespace = null) {
    if (!namespace) throw new Error("No namespace value provided.");
    const { namespaces } = await index.describeIndexStats();
    return namespaces.hasOwnProperty(namespace);
  },
  deleteVectorsInNamespace: async function (index, namespace = null) {
    const pineconeNamespace = index.namespace(namespace);
    await pineconeNamespace.deleteAll();
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
      const { pageContent, docId, ...metadata } = documentData;
      if (!pageContent || pageContent.length == 0) return false;

      console.log("Adding new vectorized document into namespace", namespace);
      if (!skipCache) {
        const cacheResult = await cachedVectorInformation(fullFilePath);
        if (cacheResult.exists) {
          const { pineconeIndex } = await this.connect();
          const pineconeNamespace = pineconeIndex.namespace(namespace);
          const { chunks } = cacheResult;
          const documentVectors = [];

          for (const chunk of chunks) {
            // Before sending to Pinecone and saving the records to our db
            // we need to assign the id of each chunk that is stored in the cached file.
            const newChunks = chunk.map((chunk) => {
              const id = uuidv4();
              documentVectors.push({ docId, vectorId: id });
              return { ...chunk, id };
            });
            await pineconeNamespace.upsert([...newChunks]);
          }

          await DocumentVectors.bulkInsert(documentVectors);
          return { vectorized: true, error: null };
        }
      }

      // If we are here then we are going to embed and store a novel document.
      // We have to do this manually as opposed to using LangChains `PineconeStore.fromDocuments`
      // because we then cannot atomically control our namespace to granularly find/remove documents
      // from vectordb.
      // https://github.com/hwchase17/langchainjs/blob/2def486af734c0ca87285a48f1a04c057ab74bdf/langchain/src/vectorstores/pinecone.ts#L167
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
          const vectorRecord = {
            id: uuidv4(),
            values: vector,
            // [DO NOT REMOVE]
            // LangChain will be unable to find your text if you embed manually and dont include the `text` key.
            // https://github.com/hwchase17/langchainjs/blob/2def486af734c0ca87285a48f1a04c057ab74bdf/langchain/src/vectorstores/pinecone.ts#L64
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
        const { pineconeIndex } = await this.connect();
        const pineconeNamespace = pineconeIndex.namespace(namespace);
        console.log("Inserting vectorized chunks into Pinecone.");
        for (const chunk of toChunks(vectors, 100)) {
          chunks.push(chunk);
          await pineconeNamespace.upsert([...chunk]);
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
    const { pineconeIndex } = await this.connect();
    if (!(await this.namespaceExists(pineconeIndex, namespace))) return;

    const knownDocuments = await DocumentVectors.where({ docId });
    if (knownDocuments.length === 0) return;

    const vectorIds = knownDocuments.map((doc) => doc.vectorId);

    const pineconeNamespace = pineconeIndex.namespace(namespace);
    for (const batchOfVectorIds of toChunks(vectorIds, 1000)) {
      await pineconeNamespace.deleteMany(batchOfVectorIds);
    }

    const indexes = knownDocuments.map((doc) => doc.id);
    await DocumentVectors.deleteIds(indexes);
    return true;
  },
  "namespace-stats": async function (reqBody = {}) {
    const { namespace = null } = reqBody;
    if (!namespace) throw new Error("namespace required");
    const { pineconeIndex } = await this.connect();
    if (!(await this.namespaceExists(pineconeIndex, namespace)))
      throw new Error("Namespace by that name does not exist.");
    const stats = await this.namespace(pineconeIndex, namespace);
    return stats
      ? stats
      : { message: "No stats were able to be fetched from DB" };
  },
  "delete-namespace": async function (reqBody = {}) {
    const { namespace = null } = reqBody;
    const { pineconeIndex } = await this.connect();
    if (!(await this.namespaceExists(pineconeIndex, namespace)))
      throw new Error("Namespace by that name does not exist.");

    const details = await this.namespace(pineconeIndex, namespace);
    await this.deleteVectorsInNamespace(pineconeIndex, namespace);
    return {
      message: `Namespace ${namespace} was deleted along with ${details.vectorCount} vectors.`,
    };
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

    const { pineconeIndex } = await this.connect();
    if (!(await this.namespaceExists(pineconeIndex, namespace)))
      throw new Error(
        "Invalid namespace - has it been collected and populated yet?"
      );

    const queryVector = await LLMConnector.embedTextInput(input);
    const { contextTexts, sourceDocuments } = await this.similarityResponse(
      pineconeIndex,
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

module.exports.Pinecone = PineconeDB;
