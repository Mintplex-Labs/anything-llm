const {
  DataType,
  MetricType,
  IndexType,
  MilvusClient,
  RRFRanker, // For hybrid-search re-ranking
} = require("@zilliz/milvus2-sdk-node");
const { TextSplitter } = require("../../TextSplitter");
const { SystemSettings } = require("../../../models/systemSettings");
const { v4: uuidv4 } = require("uuid");
const { storeVectorResult, cachedVectorInformation } = require("../../files");
const { toChunks, getEmbeddingEngineSelection } = require("../../helpers");
const { sourceIdentifier } = require("../../chats");
const { DocumentVectors } = require("../../../models/vectors");

// Simple toggle-able logger for tracing Milvus provider flow.
const LOG_ENABLED = process.env.DEBUG_MILVUS_PROVIDER === "true";
const debugLog = (...args) => {
  if (LOG_ENABLED) console.log("\x1b[36m[MilvusProvider]\x1b[0m", ...args);
};

const Milvus = {
  name: "Milvus",
  // Milvus/Zilliz only allows letters, numbers, and underscores in collection names.
  // We re-normalize the names when communicating with the DB.
  normalize: function (inputString) {
    let normalized = inputString.replace(/[^a-zA-Z0-9_]/g, "_");
    if (!/^[a-zA-Z_]/.test(normalized.slice(0, 1))) {
      normalized = `anythingllm_${normalized}`;
    }
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

  // A unified schema that supports both standard and hybrid embeddings.
  // We will always create collections with this schema going forward.
  // It is backward compatible with old data.
  getOrCreateCollection: async function (client, namespace, dimensions = null) {
    const isExists = await this.namespaceExists(client, namespace);
    if (isExists) return;

    debugLog(`Creating new collection ${namespace} with unified schema.`);
    if (!dimensions)
      throw new Error(
        `Milvus:getOrCreateCollection Unable to infer vector dimension for new collection.`
      );

    await client.createCollection({
      collection_name: this.normalize(namespace),
      fields: [
        {
          name: "id",
          description: "Primary key for the vector",
          data_type: DataType.VarChar,
          max_length: 255,
          is_primary_key: true,
        },
        {
          name: "text_dense",
          description: "Dense vector for semantic search",
          data_type: DataType.FloatVector,
          dim: dimensions,
        },
        {
          name: "text",
          description: "Raw text chunk for keyword matching",
          data_type: DataType.VarChar,
          max_length: 65535, // Max length for VarChar
        },
        {
          name: "text_sparse",
          description: "Sparse vector for keyword (BM25) search",
          data_type: DataType.SparseFloatVector,
        },
        {
          name: "metadata",
          description: "JSON metadata object for the chunk",
          data_type: DataType.JSON,
        },
      ],
    });

    // Create index for the dense vector field
    await client.createIndex({
      collection_name: this.normalize(namespace),
      field_name: "text_dense",
      index_type: IndexType.AUTOINDEX, // Let Milvus decide the best index for performance
      metric_type: MetricType.COSINE, // Cosine is great for semantic similarity
    });

    // Create index for the sparse vector field for hybrid search
    await client.createIndex({
      collection_name: this.normalize(namespace),
      field_name: "text_sparse",
      index_type: IndexType.SPARSE_INVERTED_INDEX,
      metric_type: MetricType.IP, // Inner Product is standard for BM25
    });

    // Load the collection into memory for searching
    await client.loadCollectionSync({
      collection_name: this.normalize(namespace),
    });
  },

  addDocumentToNamespace: async function (
    namespace,
    documentData = {},
    fullFilePath = null,
    skipCache = false
  ) {
    try {
      let vectorDimension = null;
      const { pageContent, docId, ...metadata } = documentData;
      if (!pageContent || pageContent.length === 0) return false;

      // TODO: Re-implement cache handling if necessary, ensuring it maps to the new schema.
      // For now, we prioritize the direct embedding flow.
      debugLog(`Vectorizing ${docId} for namespace ${namespace}.`);

      const EmbedderEngine = getEmbeddingEngineSelection(namespace);
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
      debugLog(`Created ${textChunks.length} chunks from document.`);

      const documentVectors = [];
      const vectors = [];
      const vectorValues = await EmbedderEngine.embedChunks(textChunks);

      if (!vectorValues || vectorValues.length === 0) {
        throw new Error(
          "Could not embed document chunks! This document will not be recorded."
        );
      }

      for (const [i, vec] of vectorValues.entries()) {
        // **INTELLIGENT VECTOR DETECTION**
        // Detects if the vector is from the old engine (simple array) or the new hybrid engine (object).
        const isHybrid = typeof vec === "object" && vec.hasOwnProperty("dense");
        const denseVector = isHybrid ? vec.dense : vec;
        const sparseVector = isHybrid
          ? vec.sparse
          : { indices: [], values: [] }; // Default empty sparse vector

        if (!vectorDimension) vectorDimension = denseVector.length;

        const vectorRecord = {
          id: uuidv4(),
          text_dense: denseVector,
          text_sparse: sparseVector,
          text: textChunks[i],
          metadata: { ...metadata, text: textChunks[i] },
        };

        vectors.push(vectorRecord);
        documentVectors.push({ docId, vectorId: vectorRecord.id });
      }

      if (vectors.length > 0) {
        const { client } = await this.connect();
        await this.getOrCreateCollection(client, namespace, vectorDimension);

        debugLog(`Inserting ${vectors.length} vectors into Milvus.`);
        for (const chunkBatch of toChunks(vectors, 100)) {
          const insertResult = await client.insert({
            collection_name: this.normalize(namespace),
            data: chunkBatch, // The data is already in the correct format
          });

          if (insertResult?.status.error_code !== "Success") {
            throw new Error(
              `Error embedding into Milvus! Reason: ${insertResult?.status.reason}`
            );
          }
        }
        await client.flushSync({
          collection_names: [this.normalize(namespace)],
        });
      }

      await DocumentVectors.bulkInsert(documentVectors);
      return { vectorized: true, error: null };
    } catch (e) {
      console.error("addDocumentToNamespace failed", e);
      return { vectorized: false, error: e.message };
    }
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

    const EmbedderEngine = getEmbeddingEngineSelection(namespace);
    const embedResult = await EmbedderEngine.embedTextInput(input);
    const queryVector =
      typeof embedResult === "object" && embedResult.hasOwnProperty("dense")
        ? embedResult.dense
        : embedResult;

    // **FIX FOR 'nq' ERROR**
    // The Milvus SDK expects the `data` field to be an array of vectors.
    const searchParams = {
      collection_name: this.normalize(namespace),
      limit: topN,
      data: [queryVector], // Wrap the single query vector in an array
      anns_field: "text_dense", // Explicitly search the dense vector field
      param: { nprobe: 10 },
      output_fields: ["metadata", "text"], // Specify which fields to return
    };

    debugLog("Performing similarity search with params:", searchParams);
    const searchResponse = await client.search(searchParams);
    const { contextTexts, sources } = this._processSearchResults(
      searchResponse,
      similarityThreshold,
      filterIdentifiers
    );

    return { contextTexts, sources, message: false };
  },

  performHybridSearch: async function ({
    namespace = null,
    input = "",
    LLMConnector = null,
    similarityThreshold = 0.25,
    topN = 10,
    filterIdentifiers = [],
  }) {
    if (!namespace || !input || !LLMConnector)
      throw new Error("Invalid request to performHybridSearch.");

    const { client } = await this.connect();
    if (!(await this.namespaceExists(client, namespace))) {
      return {
        contextTexts: [],
        sources: [],
        message: "Invalid query - no documents found for workspace!",
      };
    }

    const EmbedderEngine = getEmbeddingEngineSelection(namespace);

    debugLog(EmbedderEngine.model);
    if (typeof EmbedderEngine.embedTextInput !== "function") {
      return {
        contextTexts: [],
        sources: [],
        message:
          "Hybrid search is not supported by the configured embedding engine.",
      };
    }

    const embedResult = await EmbedderEngine.embedTextInput(input);
    const queryDense =
      typeof embedResult === "object" ? embedResult.dense : embedResult;

    // Build two AnnSearch objects – one for dense, one for sparse.
    const searchRequests = [
      {
        anns_field: "text_dense",
        data: [queryDense], // Wrap vector in array
        params: { nprobe: 10 },
        limit: topN,
      },
      {
        anns_field: "text_sparse",
        data: [input], // Pass raw text for server-side BM25
        params: { drop_ratio_search: 0.2 },
        limit: topN,
      },
    ];
    const rerank = RRFRanker(60); // Standard k value for RRFRanker
    const searchResponse = await client.hybridSearch({
      collection_name: this.normalize(namespace),
      data: searchRequests,
      rerank,
      limit: topN,
      output_fields: ["metadata", "text"],
    });

    debugLog(
      `Hybrid search returned ${searchResponse.results.length} results.`
    );
    debugLog(searchResponse.results);
    const { contextTexts, sources } = this._processSearchResults(
      searchResponse,
      similarityThreshold,
      filterIdentifiers
    );

    return { contextTexts, sources, message: false };
  },

  // Helper function to process search results from both similarity and hybrid search.
  _processSearchResults: function (
    searchResponse,
    similarityThreshold,
    filterIdentifiers
  ) {
    const contextTexts = [];
    const sources = [];

    // [DEBUG] Log initial state
    debugLog(
      `_processSearchResults called with ${searchResponse.results?.length ?? 0} results.`
    );
    debugLog(
      `similarityThreshold: ${similarityThreshold}, filterIdentifiers:`,
      filterIdentifiers
    );

    if (!searchResponse.results || searchResponse.results.length === 0) {
      return { contextTexts, sources };
    }

    searchResponse.results.forEach((match, index) => {
      debugLog(`\n--- Processing Match #${index} ---`);
      debugLog(`Match ID: ${match.id}, Score: ${match.score}`);

      // [FIXED] The similarity check was inverted for a distance metric like COSINE.
      // We should discard results where the distance (score) is GREATER than the threshold.
      // A lower score is a better match.
      if (match.score > similarityThreshold) {
        debugLog(
          `-> DISCARDING: Score ${match.score} is > threshold ${similarityThreshold}`
        );
        return; // Skip this result
      }

      // [DEBUG] Check for pinned document filtering
      const sourceId = sourceIdentifier(match.metadata);
      const isFiltered = filterIdentifiers.includes(sourceId);
      debugLog(`Source Identifier for filtering: "${sourceId}"`);
      debugLog(`Is filtered by pinned docs: ${isFiltered}`);
      if (isFiltered) {
        debugLog("-> DISCARDING: Source is a pinned document.");
        return; // Skip this result
      }

      debugLog("-> KEEPING: Match passed all filters.");
      // Populate contextTexts for the LLM, using the explicit `text` field.
      contextTexts.push(match.text || "");

      // Construct the source object to match the desired output format.
      const source = {
        id: match.id,
        score: match.score,
        metadata: match.metadata,
        text: match.text, // The Milvus SDK provides the `text` field at the top level.
      };
      sources.push(source);
    });

    // [DEBUG] Log final state
    debugLog(
      `_processSearchResults finished. Returning ${sources.length} sources and ${contextTexts.length} context texts.`
    );
    return {
      contextTexts,
      sources, // Return the sources array directly, correctly formatted.
    };
  },

  deleteDocumentFromNamespace: async function (namespace, docId) {
    const { client } = await this.connect();
    if (!(await this.namespaceExists(client, namespace))) return;
    const knownDocuments = await DocumentVectors.where({ docId });
    if (knownDocuments.length === 0) return;

    const vectorIds = knownDocuments.map((doc) => doc.vectorId);
    if (vectorIds.length === 0) return;

    const queryIn = vectorIds.map((v) => `'${v}'`).join(",");
    await client.deleteEntities({
      collection_name: this.normalize(namespace),
      expr: `id in [${queryIn}]`,
    });

    const indexes = knownDocuments.map((doc) => doc.id);
    await DocumentVectors.deleteIds(indexes);
    await client.flushSync({ collection_names: [this.normalize(namespace)] });
    return true;
  },

  // Boilerplate utility methods
  heartbeat: async function () {
    await this.connect();
    return { heartbeat: Number(new Date()) };
  },
  totalVectors: async function () {
    const { client } = await this.connect();
    const { collection_names } = await client.listCollections();
    let total = 0;
    for (const collection_name of collection_names) {
      const statistics = await client.getCollectionStatistics({
        collection_name,
      });
      total += Number(statistics?.data?.row_count ?? 0);
    }
    return total;
  },
  namespaceCount: async function (_namespace = null) {
    if (!_namespace) return 0;
    const { client } = await this.connect();
    if (!(await this.namespaceExists(client, _namespace))) return 0;
    const statistics = await client.getCollectionStatistics({
      collection_name: this.normalize(_namespace),
    });
    return Number(statistics?.data?.row_count ?? 0);
  },
  namespace: async function (client, namespace = null) {
    if (!namespace) throw new Error("No namespace value provided.");
    return await client
      .getCollectionStatistics({ collection_name: this.normalize(namespace) })
      .catch(() => null);
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
      .catch(() => ({ value: false }));
    return value;
  },
  deleteVectorsInNamespace: async function (client, namespace = null) {
    if (!(await this.namespaceExists(client, namespace))) return true;
    await client.dropCollection({ collection_name: this.normalize(namespace) });
    return true;
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
      if (Object.keys(source).length > 0) {
        documents.push({
          ...source,
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
