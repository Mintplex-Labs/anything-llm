/**
 * Base class for all Vector Database providers.
 * All vector database providers should extend this class and implement/override the necessary methods.
 */
class VectorDatabase {
  constructor() {
    if (this.constructor === VectorDatabase) {
      throw new Error("VectorDatabase cannot be instantiated directly");
    }
  }

  /**
   * The name of the vector database provider
   * @returns {string}
   */
  get name() {
    throw new Error("Must be implemented by provider");
  }

  /**
   * Connect to the vector database
   * @returns {Promise<{client: any}>}
   */
  async connect() {
    throw new Error("Must be implemented by provider");
  }

  /**
   * Heartbeat check for the vector database
   * @returns {Promise<{heartbeat: number}>}
   */
  async heartbeat() {
    throw new Error("Must be implemented by provider");
  }

  /**
   * Get the total number of vectors across all namespaces
   * @returns {Promise<number>}
   */
  async totalVectors() {
    throw new Error("Must be implemented by provider");
  }

  /**
   * Get the count of vectors in a specific namespace
   * @param {string} namespace - The namespace to count vectors in
   * @returns {Promise<number>}
   */
  async namespaceCount(namespace = null) {
    throw new Error("Must be implemented by provider");
  }

  /**
   * Get namespace details
   * @param {any} client - The database client
   * @param {string} namespace - The namespace to get
   * @returns {Promise<any>}
   */
  async namespace(client, namespace = null) {
    throw new Error("Must be implemented by provider");
  }

  /**
   * Check if a namespace exists
   * Default implementation that works for most providers.
   * Providers that need namespace normalization (Chroma, Weaviate) should override this.
   * @param {string} namespace - The namespace to check
   * @returns {Promise<boolean>}
   */
  async hasNamespace(namespace = null) {
    if (!namespace) return false;
    const { client } = await this.connect();
    return await this.namespaceExists(client, namespace);
  }

  /**
   * Check if a namespace exists with a client
   * @param {any} client - The database client
   * @param {string} namespace - The namespace to check
   * @returns {Promise<boolean>}
   */
  async namespaceExists(client, namespace = null) {
    throw new Error("Must be implemented by provider");
  }

  /**
   * Delete all vectors in a namespace
   * @param {any} client - The database client
   * @param {string} namespace - The namespace to delete vectors from
   * @returns {Promise<boolean>}
   */
  async deleteVectorsInNamespace(client, namespace = null) {
    throw new Error("Must be implemented by provider");
  }

  /**
   * Delete specific vectors by their IDs from the vector database
   * This is the provider-specific implementation of vector deletion
   * @param {any} client - The database client
   * @param {string} namespace - The namespace containing the vectors
   * @param {string[]} vectorIds - Array of vector IDs to delete
   * @returns {Promise<void>}
   */
  async deleteVectorsByIds(client, namespace, vectorIds) {
    throw new Error("Must be implemented by provider");
  }

  /**
   * Add a document to a namespace
   * @param {string} namespace - The namespace to add the document to
   * @param {Object} documentData - The document data
   * @param {string} fullFilePath - The full file path
   * @param {boolean} skipCache - Whether to skip cache
   * @returns {Promise<{vectorized: boolean, error: string|null}>}
   */
  async addDocumentToNamespace(
    namespace,
    documentData = {},
    fullFilePath = null,
    skipCache = false
  ) {
    throw new Error("Must be implemented by provider");
  }

  /**
   * Delete a document from a namespace
   * Default implementation that works for most providers.
   * Handles the DocumentVectors database logic and delegates actual vector deletion
   * to the provider-specific deleteVectorsByIds method.
   * @param {string} namespace - The namespace to delete the document from
   * @param {string} docId - The document ID
   * @returns {Promise<boolean>}
   */
  async deleteDocumentFromNamespace(namespace, docId) {
    const { DocumentVectors } = require("../../models/vectors");
    const { client } = await this.connect();

    if (!(await this.namespaceExists(client, namespace))) return false;

    const knownDocuments = await DocumentVectors.where({ docId });
    if (knownDocuments.length === 0) return false;

    const vectorIds = knownDocuments.map((doc) => doc.vectorId);

    await this.deleteVectorsByIds(client, namespace, vectorIds);

    const indexes = knownDocuments.map((doc) => doc.id);
    await DocumentVectors.deleteIds(indexes);

    return true;
  }

  /**
   * Perform a similarity search
   * Default implementation that works for most providers.
   * Providers with special requirements (reranking, namespace normalization) can override.
   * @param {Object} params - Search parameters
   * @param {string} params.namespace - The namespace to search in
   * @param {string} params.input - The input text to search for
   * @param {any} params.LLMConnector - The LLM connector for embeddings
   * @param {number} params.similarityThreshold - The similarity threshold
   * @param {number} params.topN - The number of results to return
   * @param {string[]} params.filterIdentifiers - Identifiers to filter out
   * @param {boolean} params.rerank - Whether to use reranking (if supported)
   * @returns {Promise<{contextTexts: string[], sources: any[], message: string|boolean}>}
   */
  async performSimilaritySearch({
    namespace = null,
    input = "",
    LLMConnector = null,
    similarityThreshold = 0.25,
    topN = 4,
    filterIdentifiers = [],
    rerank = false,
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
      return { metadata: { ...metadata, text: contextTexts[i] } };
    });

    return {
      contextTexts,
      sources: this.curateSources(sources),
      message: false,
    };
  }

  /**
   * Perform a similarity search and return raw results
   * @param {Object} params - Search parameters
   * @param {any} params.client - The database client
   * @param {string} params.namespace - The namespace to search in
   * @param {number[]} params.queryVector - The query vector
   * @param {number} params.similarityThreshold - The similarity threshold
   * @param {number} params.topN - The number of results to return
   * @param {string[]} params.filterIdentifiers - Identifiers to filter out
   * @returns {Promise<{contextTexts: string[], sourceDocuments: any[], scores: number[]}>}
   */
  async similarityResponse({
    client,
    namespace,
    queryVector,
    similarityThreshold = 0.25,
    topN = 4,
    filterIdentifiers = [],
  }) {
    throw new Error("Must be implemented by provider");
  }

  /**
   * Get namespace statistics
   * @param {Object} reqBody - Request body
   * @param {string} reqBody.namespace - The namespace to get stats for
   * @returns {Promise<any>}
   */
  async "namespace-stats"(reqBody = {}) {
    const { namespace = null } = reqBody;
    if (!namespace) throw new Error("namespace required");
    const { client } = await this.connect();
    if (!(await this.namespaceExists(client, namespace)))
      throw new Error("Namespace by that name does not exist.");
    const stats = await this.namespace(client, namespace);
    return stats
      ? stats
      : { message: "No stats were able to be fetched from DB for namespace" };
  }

  /**
   * Delete a namespace
   * @param {Object} reqBody - Request body
   * @param {string} reqBody.namespace - The namespace to delete
   * @returns {Promise<{message: string}>}
   */
  async "delete-namespace"(reqBody = {}) {
    const { namespace = null } = reqBody;
    const { client } = await this.connect();
    if (!(await this.namespaceExists(client, namespace)))
      throw new Error("Namespace by that name does not exist.");

    const details = await this.namespace(client, namespace);
    await this.deleteVectorsInNamespace(client, namespace);
    return {
      message: `Namespace ${namespace} was deleted along with ${details?.vectorCount || "all"} vectors.`,
    };
  }

  /**
   * Reset the vector database (delete all data)
   * @returns {Promise<{reset: boolean}>}
   */
  async reset() {
    throw new Error("Must be implemented by provider");
  }

  /**
   * Curate sources from search results
   * @param {any[]} sources - The sources to curate
   * @returns {any[]}
   */
  curateSources(sources = []) {
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
  }

  /**
   * Convert distance to similarity score
   * Some providers may override this based on their distance metric
   * @param {number} distance - The distance value
   * @returns {number}
   */
  distanceToSimilarity(distance = null) {
    if (distance === null || typeof distance !== "number") return 0.0;
    if (distance >= 1.0) return 1;
    if (distance < 0) return 1 - Math.abs(distance);
    return 1 - distance;
  }
}

module.exports = { VectorDatabase };
