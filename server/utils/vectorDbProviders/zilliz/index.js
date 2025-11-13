const {
  DataType,
  MetricType,
  IndexType,
  MilvusClient,
} = require("@zilliz/milvus2-sdk-node");
const { TextSplitter } = require("../../TextSplitter");
const { SystemSettings } = require("../../../models/systemSettings");
const { v4: uuidv4 } = require("uuid");
const { storeVectorResult, cachedVectorInformation } = require("../../files");
const { toChunks, getEmbeddingEngineSelection } = require("../../helpers");
const { sourceIdentifier } = require("../../chats");

// Zilliz is basically a copy of Milvus DB class with a different constructor
// to connect to the cloud
const Zilliz = {
  name: "Zilliz",
  // Milvus/Zilliz only allows letters, numbers, and underscores in collection names
  // so we need to enforce that by re-normalizing the names when communicating with
  // the DB.
  // If the first char of the collection is not an underscore or letter the collection name will be invalid.
  normalize: function (inputString) {
    let normalized = inputString.replace(/[^a-zA-Z0-9_]/g, "_");
    if (new RegExp(/^[a-zA-Z_]/).test(normalized.slice(0, 1)))
      normalized = `anythingllm_${normalized}`;
    return normalized;
  },
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
        collection_name: this.normalize(collection_name),
      });
      return Number(acc) + Number(statistics?.data?.row_count ?? 0);
    }, 0);
    return total;
  },
  namespaceCount: async function (_namespace = null) {
    const { client } = await this.connect();
    const statistics = await client.getCollectionStatistics({
      collection_name: this.normalize(_namespace),
    });
    return Number(statistics?.data?.row_count ?? 0);
  },
  namespace: async function (client, namespace = null) {
    if (!namespace) throw new Error("No namespace value provided.");
    const collection = await client
      .getCollectionStatistics({ collection_name: this.normalize(namespace) })
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
      .hasCollection({ collection_name: this.normalize(namespace) })
      .catch((e) => {
        console.error("Zilliz::namespaceExists", e.message);
        return { value: false };
      });
    return value;
  },
  deleteVectorsInNamespace: async function (client, namespace = null) {
    await client.dropCollection({ collection_name: this.normalize(namespace) });
    return true;
  },
  // Zilliz requires a dimension aspect for collection creation
  // we pass this in from the first chunk to infer the dimensions like other
  // providers do.
  // When EMBEDDING_ENGINE=hybrid, creates schema with both dense and sparse vector fields.
  getOrCreateCollection: async function (client, namespace, dimensions = null) {
    const isExists = await this.namespaceExists(client, namespace);
    if (!isExists) {
      if (!dimensions)
        throw new Error(
          `Zilliz:getOrCreateCollection Unable to infer vector dimension from input. Open an issue on GitHub for support.`
        );

      const isHybridMode = process.env.EMBEDDING_ENGINE === "hybrid";
      const fields = [
        {
          name: "id",
          description: "id",
          data_type: DataType.VarChar,
          max_length: 255,
          is_primary_key: true,
        },
        {
          name: "vector",
          description: "dense vector",
          data_type: DataType.FloatVector,
          dim: dimensions,
        },
        {
          name: "text",
          description: "chunk text content",
          data_type: DataType.VarChar,
          max_length: 65535, // Maximum length for VarChar in Milvus
        },
        {
          name: "metadata",
          decription: "metadata",
          data_type: DataType.JSON,
        },
      ];

      // Add sparse vector field for hybrid search
      if (isHybridMode) {
        fields.push({
          name: "vector_sparse",
          description: "sparse vector for BM25",
          data_type: DataType.SparseFloatVector,
        });
      }

      await client.createCollection({
        collection_name: this.normalize(namespace),
        fields,
      });

      // Create index for dense vectors
      await client.createIndex({
        collection_name: this.normalize(namespace),
        field_name: "vector",
        index_type: IndexType.AUTOINDEX,
        metric_type: MetricType.COSINE,
      });

      // Create index for sparse vectors if in hybrid mode
      if (isHybridMode) {
        await client.createIndex({
          collection_name: this.normalize(namespace),
          field_name: "vector_sparse",
          index_type: IndexType.SPARSE_INVERTED_INDEX,
          metric_type: MetricType.IP, // Inner Product for sparse vectors
        });
      }

      await client.loadCollectionSync({
        collection_name: this.normalize(namespace),
      });
    }
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
      if (skipCache) {
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
              return {
                id,
                vector: chunk.values,
                text: chunk.metadata?.text || "",
                metadata: chunk.metadata,
              };
            });
            const insertResult = await client.insert({
              collection_name: this.normalize(namespace),
              data: newChunks,
            });

            if (insertResult?.status.error_code !== "Success") {
              throw new Error(
                `Error embedding into Zilliz! Reason:${insertResult?.status.reason}`
              );
            }
          }
          await DocumentVectors.bulkInsert(documentVectors);
          await client.flushSync({
            collection_names: [this.normalize(namespace)],
          });
          return { vectorized: true, error: null };
        }
      }

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

      console.log("Chunks created from document:", textChunks.length);
      const documentVectors = [];
      const vectors = [];
      const vectorValues = await EmbedderEngine.embedChunks(textChunks);
      const isHybridMode = EmbedderEngine?.supportsSparseVectors === true;

      if (!!vectorValues && vectorValues.length > 0) {
        for (const [i, vector] of vectorValues.entries()) {
          // Handle hybrid embeddings (dense + sparse) vs standard embeddings
          const denseVector = isHybridMode ? vector.dense : vector;
          const sparseVector = isHybridMode ? vector.sparse : null;

          if (!vectorDimension) {
            vectorDimension = Array.isArray(denseVector)
              ? denseVector.length
              : null;
          }

          const vectorRecord = {
            id: uuidv4(),
            values: denseVector,
            sparseValues: sparseVector,
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
          const insertData = chunk.map((item) => {
            const record = {
              id: item.id,
              vector: item.values,
              text: item.metadata?.text || "",
              metadata: item.metadata,
            };
            // Add sparse vector field if in hybrid mode
            if (isHybridMode && item.sparseValues) {
              record.vector_sparse = item.sparseValues;
            }
            return record;
          });

          const insertResult = await client.insert({
            collection_name: this.normalize(namespace),
            data: insertData,
          });

          if (insertResult?.status.error_code !== "Success") {
            throw new Error(
              `Error embedding into Zilliz! Reason:${insertResult?.status.reason}`
            );
          }
        }
        await storeVectorResult(chunks, fullFilePath);
        await client.flushSync({
          collection_names: [this.normalize(namespace)],
        });
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
      collection_name: this.normalize(namespace),
      expr: `id in [${queryIn}]`,
    });

    const indexes = knownDocuments.map((doc) => doc.id);
    await DocumentVectors.deleteIds(indexes);

    // Even after flushing Zilliz can take some time to re-calc the count
    // so all we can hope to do is flushSync so that the count can be correct
    // on a later call.
    await client.flushSync({ collection_names: [this.normalize(namespace)] });
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
    const normalizedName = this.normalize(namespace);
    console.log(
      `Zilliz::performSimilaritySearch - Namespace: ${namespace}, Normalized: ${normalizedName}`
    );

    const exists = await this.namespaceExists(client, namespace);
    console.log(
      `Zilliz::performSimilaritySearch - Collection exists: ${exists}`
    );

    if (!exists) {
      return {
        contextTexts: [],
        sources: [],
        message: "Invalid query - no documents found for workspace!",
      };
    }

    // Extract dense vector from hybrid embedding result (like Milvus does)
    const { getEmbeddingEngineSelection } = require("../../helpers");
    const EmbedderEngine = getEmbeddingEngineSelection(namespace);
    const embedResult = await EmbedderEngine.embedTextInput(input);
    const queryVector =
      typeof embedResult === "object" && embedResult.hasOwnProperty("dense")
        ? embedResult.dense
        : embedResult;

    console.log(
      `Zilliz::performSimilaritySearch - Query vector length: ${queryVector?.length || "N/A"}`
    );
    console.log(
      `Zilliz::performSimilaritySearch - Query vector type: ${Array.isArray(queryVector) ? "Array" : typeof queryVector}`
    );

    const { contextTexts, sourceDocuments } = await this.similarityResponse({
      client,
      namespace,
      queryVector,
      similarityThreshold,
      topN,
      filterIdentifiers,
    });

    console.log(
      `Zilliz::performSimilaritySearch - Found ${contextTexts.length} context texts, ${sourceDocuments.length} sources`
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
  // Toggles hybrid search when EMBEDDING_ENGINE=hybrid, else uses similarity search.
  // Hybrid search supported: uses both dense & sparse vector fields when available.
  performHybridSearch: async function ({
    namespace = null,
    input = "",
    LLMConnector = null,
    similarityThreshold = 0.25,
    topN = 4,
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

    // Check if embedder supports sparse vectors (hybrid embedder)
    const embedder = LLMConnector.embedder;
    if (!embedder?.supportsSparseVectors) {
      console.log(
        "Zilliz: Embedder does not support sparse vectors, falling back to similarity search"
      );
      return await this.performSimilaritySearch({
        namespace,
        input,
        LLMConnector,
        similarityThreshold,
        topN,
        filterIdentifiers,
      });
    }

    try {
      // Get hybrid embedding (dense + sparse)
      const hybridEmbedding = await embedder.embedTextInput(input);

      // Validate we have both dense and sparse vectors
      if (
        !hybridEmbedding?.dense ||
        !hybridEmbedding?.sparse ||
        !Array.isArray(hybridEmbedding.dense)
      ) {
        console.log(
          "Zilliz: Hybrid embedding incomplete, falling back to similarity search"
        );
        return await this.performSimilaritySearch({
          namespace,
          input,
          LLMConnector,
          similarityThreshold,
          topN,
          filterIdentifiers,
        });
      }

      const { contextTexts, sourceDocuments } = await this.hybridSearchResponse(
        {
          client,
          namespace,
          denseVector: hybridEmbedding.dense,
          sparseVector: hybridEmbedding.sparse,
          similarityThreshold,
          topN,
          filterIdentifiers,
        }
      );

      const sources = sourceDocuments.map((metadata, i) => {
        return { ...metadata, text: contextTexts[i] };
      });

      return {
        contextTexts,
        sources: this.curateSources(sources),
        message: false,
      };
    } catch (error) {
      console.error(
        "Zilliz: Hybrid search failed, falling back:",
        error.message
      );
      // Fallback to similarity search on error
      return await this.performSimilaritySearch({
        namespace,
        input,
        LLMConnector,
        similarityThreshold,
        topN,
        filterIdentifiers,
      });
    }
  },
  hybridSearchResponse: async function ({
    client,
    namespace,
    denseVector,
    sparseVector,
    similarityThreshold = 0.25,
    topN = 4,
    filterIdentifiers = [],
  }) {
    const result = {
      contextTexts: [],
      sourceDocuments: [],
      scores: [],
    };

    // Build the hybrid search request with both dense and sparse vectors
    // Using RRF (Reciprocal Rank Fusion) as the reranking strategy
    const searchRequests = [
      {
        anns_field: "vector", // dense vector field
        data: [denseVector],
        limit: topN * 2, // Get more results for better reranking
        params: { nprobe: 10 },
      },
      {
        anns_field: "vector_sparse", // sparse vector field
        data: [sparseVector],
        limit: topN * 2,
        params: {},
      },
    ];

    try {
      console.log(
        `Zilliz::hybridSearchResponse - Searching collection: ${this.normalize(namespace)}`
      );
      console.log(
        `Zilliz::hybridSearchResponse - Dense vector length: ${denseVector?.length}, Sparse vector keys: ${Object.keys(sparseVector || {}).join(", ")}`
      );

      const response = await client.hybridSearch({
        collection_name: this.normalize(namespace),
        data: searchRequests,
        limit: topN,
        output_fields: ["text", "metadata"],
        rerank: {
          strategy: "rrf", // Reciprocal Rank Fusion
          params: { k: 60 },
        },
      });

      console.log(
        `Zilliz::hybridSearchResponse - Raw response:`,
        JSON.stringify(response, null, 2)
      );
      console.log(
        `Zilliz::hybridSearchResponse - Response keys:`,
        Object.keys(response || {})
      );

      // Check if results are nested differently
      let results = response?.results;
      if (!results && response?.data) {
        results = response.data;
        console.log(
          "Zilliz::hybridSearchResponse - Using response.data instead of response.results"
        );
      }
      if (!results && Array.isArray(response)) {
        results = response;
        console.log(
          "Zilliz::hybridSearchResponse - Response is directly an array"
        );
      }

      if (!results || results.length === 0) {
        console.log(
          "Zilliz::hybridSearchResponse - No results returned from hybrid search"
        );
        return result;
      }

      console.log(
        `Zilliz::hybridSearchResponse - Processing ${results.length} results`
      );

      results.forEach((match, index) => {
        console.log(`Zilliz::hybridSearchResponse - Match ${index}:`, {
          score: match.score,
          distance: match.distance,
          id: match.id,
          hasText: !!match.text,
          hasMetadata: !!match.metadata,
          metadataKeys: match.metadata ? Object.keys(match.metadata) : [],
        });

        // Milvus uses COSINE distance - lower score = better match
        // So we filter when score > threshold (opposite of similarity)
        // The score from Milvus/Zilliz is a distance, not a similarity
        const distance =
          match.score !== undefined
            ? match.score
            : match.distance !== undefined
              ? match.distance
              : Infinity;

        // For COSINE distance: lower is better, so filter when distance > threshold
        if (distance > similarityThreshold) {
          console.log(
            `Zilliz::hybridSearchResponse - Distance ${distance} above threshold ${similarityThreshold} (filtering out)`
          );
          return;
        }

        // Convert distance to similarity score for output (1 - distance for COSINE)
        const similarityScore = 1 - distance;

        if (filterIdentifiers.includes(sourceIdentifier(match.metadata))) {
          console.log(
            "Zilliz: A source was filtered from context as it's parent document is pinned."
          );
          return;
        }
        // Use dedicated text field, fallback to metadata.text
        result.contextTexts.push(match.text || match.metadata?.text || "");
        result.sourceDocuments.push({
          ...match,
          score: similarityScore,
          _distance: distance,
        });
        result.scores.push(similarityScore);
      });

      console.log(
        `Zilliz::hybridSearchResponse - Final result: ${result.contextTexts.length} texts, ${result.sourceDocuments.length} sources`
      );
    } catch (error) {
      console.error("Zilliz::hybridSearchResponse error:", error.message);
      console.error("Zilliz::hybridSearchResponse error stack:", error.stack);
      // Return empty results on error - caller will handle fallback
      return result;
    }

    return result;
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

    const normalizedName = this.normalize(namespace);
    console.log(
      `Zilliz::similarityResponse - Searching collection: ${normalizedName}`
    );
    console.log(
      `Zilliz::similarityResponse - Query vector is array: ${Array.isArray(queryVector)}, length: ${queryVector?.length}`
    );

    try {
      // Use the same format as Milvus - data array and anns_field
      const searchParams = {
        collection_name: normalizedName,
        data: [queryVector], // Wrap vector in array
        anns_field: "vector", // Field name in Zilliz collection
        limit: topN,
        param: { nprobe: 10 },
        output_fields: ["text", "metadata"],
      };

      console.log(
        `Zilliz::similarityResponse - Search params:`,
        JSON.stringify(
          {
            ...searchParams,
            data: [`[Array of ${queryVector?.length} elements]`],
          },
          null,
          2
        )
      );

      const response = await client.search(searchParams);

      console.log(
        `Zilliz::similarityResponse - Raw response:`,
        JSON.stringify(response, null, 2)
      );
      console.log(
        `Zilliz::similarityResponse - Response keys:`,
        Object.keys(response || {})
      );
      console.log(
        `Zilliz::similarityResponse - Results count: ${response?.results?.length || 0}`
      );

      // Check if results are nested differently
      let results = response?.results;
      if (!results && response?.data) {
        results = response.data;
        console.log(
          "Zilliz::similarityResponse - Using response.data instead of response.results"
        );
      }
      if (!results && Array.isArray(response)) {
        results = response;
        console.log(
          "Zilliz::similarityResponse - Response is directly an array"
        );
      }

      if (!results || results.length === 0) {
        console.log(
          "Zilliz::similarityResponse - No results returned from search"
        );
        return result;
      }

      results.forEach((match, index) => {
        console.log(`Zilliz::similarityResponse - Match ${index}:`, {
          score: match.score,
          distance: match.distance,
          id: match.id,
          hasText: !!match.text,
          hasMetadata: !!match.metadata,
          metadataKeys: match.metadata ? Object.keys(match.metadata) : [],
          fullMatch: JSON.stringify(match, null, 2),
        });

        // Milvus uses COSINE distance - lower score = better match
        // So we filter when score > threshold (opposite of similarity)
        // The score from Milvus/Zilliz is a distance, not a similarity
        const distance =
          match.score !== undefined
            ? match.score
            : match.distance !== undefined
              ? match.distance
              : Infinity;

        // For COSINE distance: lower is better, so filter when distance > threshold
        if (distance > similarityThreshold) {
          console.log(
            `Zilliz::similarityResponse - Distance ${distance} above threshold ${similarityThreshold} (filtering out)`
          );
          return;
        }

        // Convert distance to similarity score for output (1 - distance for COSINE)
        const similarityScore = 1 - distance;

        if (filterIdentifiers.includes(sourceIdentifier(match.metadata))) {
          console.log(
            "Zilliz: A source was filtered from context as it's parent document is pinned."
          );
          return;
        }
        // Use dedicated text field, fallback to metadata.text
        result.contextTexts.push(match.text || match.metadata?.text || "");
        result.sourceDocuments.push({
          ...match,
          score: similarityScore,
          _distance: distance,
        });
        result.scores.push(similarityScore);
      });
    } catch (error) {
      console.error("Zilliz::similarityResponse - Error:", error.message);
      console.error("Zilliz::similarityResponse - Error stack:", error.stack);
      return result;
    }

    console.log(
      `Zilliz::similarityResponse - Final result: ${result.contextTexts.length} texts, ${result.sourceDocuments.length} sources`
    );
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
