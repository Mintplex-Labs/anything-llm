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
const natural = require('natural');
const TfIdfClass = natural.TfIdf;

const Milvus = {
  name: "Milvus",
  // Milvus/Zilliz only allows letters, numbers, and underscores in collection names
  // so we need to enforce that by re-normalizing the names when communicating with
  // the DB.
  // If the first char of the collection is not an underscore or letter the collection name will be invalid.
  /**
 * Generate a sparse vector from a single text chunk.
 * @param {string} textChunk - The text chunk to be converted into a sparse vector.
 * @returns {Object} - The sparse vector representation of the text chunk.
 */
  generateSparseVectors: function (textChunks) {
    try {
      if (!Array.isArray(textChunks) || textChunks.length === 0) {
        throw new Error('Input must be a non-empty array of text chunks.');
      }

      // Initialize TF-IDF Vectorizer
      const tfidf = new TfIdfClass();

      // Add all text chunks to the TF-IDF model
      textChunks.forEach(chunk => {
        if (chunk && chunk.trim() !== '') {
          tfidf.addDocument(chunk);
        } else {
          throw new Error('One or more text chunks are empty.');
        }
      });

      // Create a global token-to-index map
      const tokenIndexMap = new Map();
      let tokenCounter = 0;

      // Build global token index map
      textChunks.forEach((_, docIndex) => {
        tfidf.listTerms(docIndex).forEach(item => {
          if (!tokenIndexMap.has(item.term)) {
            tokenIndexMap.set(item.term, tokenCounter++);
          }
        });
      });

      // Generate sparse vectors using token indices
      const sparseVectors = textChunks.map((_, docIndex) => {
        const sparseVector = {};
        tfidf.listTerms(docIndex).forEach(item => {
          const tokenIndex = tokenIndexMap.get(item.term);
          sparseVector[tokenIndex] = item.tfidf;
        });

        return sparseVector;
      });

      // console.log('Sparse Vectors (Milvus Compatible):', sparseVectors);
      return sparseVectors;

    } catch (error) {
      console.error('Error generating sparse vectors:', error.message);
      throw error;
    }
  },
  normalize: function (inputString) {
    let normalized = inputString.replace(/[^a-zA-Z0-9_]/g, "_");
    if (new RegExp(/^[a-zA-Z_]/).test(normalized.slice(0, 1)))
      normalized = `anythingllm_${normalized}`;
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
  namespaceCountMultiple: async function (_namespaces = []) {
    const { client } = await this.connect();

    // Initialize a variable to hold the total count
    let totalCount = 0;

    // Iterate over all provided namespaces
    for (const _namespace of _namespaces) {
      // Fetch collection statistics for each namespace
      const statistics = await client.getCollectionStatistics({
        collection_name: this.normalize(_namespace.slug),
      });

      // Add the row count (or 0 if not available) to the total count
      totalCount += Number(statistics?.data?.row_count ?? 0);
    }

    // Return the total count
    return totalCount;
  },
  namespaceCountWithWSNames: async function (_namespaces = []) {
    const { client } = await this.connect();

    // Initialize a variable to hold the total count
    let totalCount = 0;

    // Iterate over all provided namespaces
    for (const _namespace of _namespaces) {
      // Fetch collection statistics for each namespace
      const statistics = await client.getCollectionStatistics({
        collection_name: this.normalize(_namespace),
      });

      // Add the row count (or 0 if not available) to the total count
      totalCount += Number(statistics?.data?.row_count ?? 0);
    }

    // Return the total count
    return totalCount;
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
  hasNamespaces: async function (workspaces = null) {
    if (!workspaces || workspaces.length === 0) return false;

    const { client } = await this.connect();

    // Loop through each namespace and check if it exists
    for (const workspace of workspaces) {
      const exists = await this.namespaceExists(client, workspace.slug);

      if (!exists) {
        // If any namespace doesn't exist, return false
        return false;
      }
    }

    // If all namespaces exist, return true
    return true;
  },
  namespaceExists: async function (client, namespace = null) {
    if (!namespace) throw new Error("No namespace value provided.");
    const { value } = await client
      .hasCollection({ collection_name: this.normalize(namespace) })
      .catch((e) => {
        console.error("MilvusDB::namespaceExists", e.message);
        return { value: false };
      });
    return value;
  },
  deleteVectorsInNamespace: async function (client, namespace = null) {
    await client.dropCollection({ collection_name: this.normalize(namespace) });
    return true;
  },
  // Milvus requires a dimension aspect for collection creation
  // we pass this in from the first chunk to infer the dimensions like other
  // providers do.
  getOrCreateCollection: async function (client, namespace, dimensions = null) {
    const isExists = await this.namespaceExists(client, namespace);
    console.log(`namespace ${namespace} exists in milvus : ${isExists}`)
    if (!isExists) {
      if (!dimensions)
        throw new Error(
          `Milvus:getOrCreateCollection Unable to infer vector dimension from input. Open an issue on Github for support.`
        );

      await client.createCollection({
        collection_name: this.normalize(namespace),
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
            description: "dense_vector",
            data_type: DataType.FloatVector,
            dim: dimensions,
          },
          // {
          //   name: "sparse_vector",
          //   description: "sparse_vector",
          //   data_type: DataType.SparseFloatVector,
          // },
          {
            name: "metadata",
            decription: "metadata",
            data_type: DataType.JSON,
          },
        ],
      });
      await client.createIndex({
        collection_name: this.normalize(namespace),
        field_name: "vector",
        index_type: IndexType.AUTOINDEX,
        metric_type: MetricType.COSINE,
      });

      // await client.createIndex({
      //   collection_name: this.normalize(namespace),
      //   field_name: "sparse_vector",
      //   index_type: IndexType.SPARSE_INVERTED_INDEX,
      //   metric_type: MetricType.IP,
      // });

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
          try {
            for (const chunk of chunks) {
              // Before sending to Milvus and saving the records to our db
              // we need to assign the id of each chunk that is stored in the cached file.
              const newChunks = chunk.map((chunk) => {
                const id = uuidv4();
                documentVectors.push({ docId, vectorId: id });
                return { id, vector: chunk.values, metadata: chunk.metadata };
              });
              const insertResult = await client.insert({
                collection_name: this.normalize(namespace),
                data: newChunks,
              });

              if (insertResult?.status.error_code !== "Success") {
                throw new Error(
                  `Error embedding into Milvus! Reason:${insertResult?.status.reason}`
                );
              }
            }
            await DocumentVectors.bulkInsert(documentVectors);
            await client.flushSync({
              collection_names: [this.normalize(namespace)],
            });
            return { vectorized: true, error: null };
          } catch (insertError) {
            console.error(
              "Error inserting cached chunks:",
              insertError.message
            );
            return { vectorized: false, error: insertError.message };
          }
        }
      }

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
    //  const sparseVectors = this.generateSparseVectors(textChunks);
      // console.log('Final Sparse Vectors:', JSON.stringify(sparseVectors, null, 2));

      if (!!vectorValues && vectorValues.length > 0) {
        for (const [i, vector] of vectorValues.entries()) {
          if (!vectorDimension) vectorDimension = vector.length;
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
        console.log(`add/get collection from milvus`)
        await this.getOrCreateCollection(client, namespace, vectorDimension);

        console.log("Inserting vectorized chunks into Milvus.");
        for (const chunk of toChunks(vectors, 100)) {
          chunks.push(chunk);
          const data = chunk.map((item) => ({
            id: item.id,
            vector: item.values,
            metadata: item.metadata, // Correcting the metadata reference
          }));
          let insertResult;
          // Validate that `data` is a valid JSON
          try {
            JSON.stringify(data); // This will throw an error if `data` is not valid JSON

            // Insert into Milvus
            insertResult = await client.insert({
              collection_name: this.normalize(namespace),
              data,
            });

            if (insertResult?.status.error_code !== "Success") {
              throw new Error(
                `Error embedding into Milvus! Reason: ${insertResult?.status.reason}`
              );
            }
          } catch (error) {
            console.error("Failed to validate or insert data into Milvus:", error.message);
            throw error; // Re-throw the error to handle it upstream if needed
          }


          if (insertResult?.status.error_code !== "Success") {
            throw new Error(
              `Error embedding into Milvus line 255! Reason:${insertResult?.status.reason}`
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

    // Even after flushing Milvus can take some time to re-calc the count
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
  performSimilaritySearchMultiple: async function ({
    namespaces = [],
    input = "",
    LLMConnector = null,
    similarityThreshold = 0.25,
    topN = 4,
    filterIdentifiers = [],
  }) {
    if (!Array.isArray(namespaces) || namespaces.length === 0 || !input || !LLMConnector)
      throw new Error("Invalid request to performSimilaritySearch.");

    const { client } = await this.connect();
    const results = {
      contextTexts: [],
      sources: [],
      message: false,
    };

    for (const namespace of namespaces) {
      console.log(`workspace name : ${namespace.slug}`)
      if (!(await this.namespaceExists(client, namespace.slug))) {
        continue; // Skip this namespace if it doesn't exist
      }
      console.log(`workspace : ${namespace.slug} exists in milvus`)

      const queryVector = await LLMConnector.embedTextInput(input);

      const { contextTexts, sourceDocuments } = await this.similarityResponse(
        client,
        namespace.slug,
        queryVector,
        similarityThreshold,
        topN,
        filterIdentifiers
      );
      // console.log(`###############################################################################################`)
      // console.log(`###############################################################################################`)

      // console.log(`Response from similarity search for workspace ${namespace.slug}:`, {
      //   contextTexts,
      //   sourceDocuments,
      // });
      // console.log(`###############################################################################################`)
      // console.log(`###############################################################################################`)


      const sources = sourceDocuments.map((metadata, i) => {
        return { ...metadata, text: contextTexts[i], namespace };
      });

      results.contextTexts.push(...contextTexts);
      results.sources.push(...this.curateSources(sources));
    }

    // if (results.sources.length === 0) {
    //   results.message = "Invalid query - no documents found for the provided workspaces!";
    // }
    return results;
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
    const response = await client.search({
      collection_name: this.normalize(namespace),
      vectors: queryVector,
      limit: topN,
    });

    const seen = new Set(); // Track unique context texts to remove duplicates

    response.results.forEach((match) => {
      // console.log(`match score is ${match.score}`)
      if (match.score < similarityThreshold) return;
      if (filterIdentifiers.includes(sourceIdentifier(match.metadata))) {
        console.log(
          "Milvus: A source was filtered from context as it's parent document is pinned."
        );
        return;
      }
      const contextText = match.metadata.text;
      

      // result.contextTexts.push(match.metadata.text);
      // result.sourceDocuments.push(match);
      // result.scores.push(match.score);
      if (!seen.has(contextText)) {
        seen.add(contextText); // Add to the set to track uniqueness
        result.contextTexts.push(contextText);
        result.sourceDocuments.push(match);
        result.scores.push(match.score);
      }
    });
    // console.dir(result, { depth: null });
    
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

module.exports.Milvus = Milvus;
