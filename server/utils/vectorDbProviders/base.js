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
   * Connect to vector database client
   * @returns {Promise<{client: any}>}
   */
  async connect() {
    throw new Error("Must be implemented by provider");
  }

  /**
   * Heartbeat check for vector database client
   * @returns {Promise<{heartbeat: number}>}
   */
  async heartbeat() {
    throw new Error("Must be implemented by provider");
  }

  /**
   * Get total number of vectors across all namespaces
   * @returns {Promise<number>}
   */
  async totalVectors() {
    throw new Error("Must be implemented by provider");
  }

  /**
   * Get count of vectors in a specific namespace
   * @param {string} namespace - Namespace to count vectors in
   * @returns {Promise<number>}
   */
  async namespaceCount(namespace = null) {
    throw new Error("Must be implemented by provider");
  }

  /**
   * Get namespace details
   * @param {any} client - Vector database client
   * @param {string} namespace - Namespace to get
   * @returns {Promise<any>}
   */
  async namespace(client, namespace = null) {
    throw new Error("Must be implemented by provider");
  }

  /**
   * Check if a namespace exists
   * @param {string} namespace - Namespace to check
   * @returns {Promise<boolean>}
   */
  async hasNamespace(namespace = null) {
    throw new Error("Must be implemented by provider");
  }

  /**
   * Check if a namespace exists with a client
   * @param {any} client - Vector database client
   * @param {string} namespace - Namespace to check
   * @returns {Promise<boolean>}
   */
  async namespaceExists(client, namespace = null) {
    throw new Error("Must be implemented by provider");
  }

  /**
   * Delete all vectors in a namespace
   * @param {any} client - Vector database client
   * @param {string} namespace - Namespace to delete vectors from
   * @returns {Promise<boolean>}
   */
  async deleteVectorsInNamespace(client, namespace = null) {
    throw new Error("Must be implemented by provider");
  }

  /**
   * Add a document to a namespace
   * @param {string} namespace - Namespace to add document to
   * @param {Object} documentData - Document data
   * @param {string} fullFilePath - Full file path
   * @param {boolean} skipCache - Skip cache
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
   * Delete a document from namespace
   * @param {string} namespace - Namespace to delete document from
   * @param {string} docId - Document id
   * @returns {Promise<boolean>}
   */
  async deleteDocumentFromNamespace(namespace, docId) {
    throw new Error("Must be implemented by provider");
  }

  /**
   * Perform a similarity search
   * @param {Object} params - Search parameters
   * @param {string} params.namespace - Namespace to search in
   * @param {string} params.input - Input text to search for
   * @param {any} params.LLMConnector - LLM connector for embeddings
   * @param {number} params.similarityThreshold - Similarity threshold
   * @param {number} params.topN - Number of results to return
   * @param {string[]} params.filterIdentifiers - Identifiers to filter out
   * @returns {Promise<{contextTexts: string[], sources: any[], message: string|boolean}>}
   */
  async performSimilaritySearch({
    namespace = null,
    input = "",
    LLMConnector = null,
    similarityThreshold = 0.25,
    topN = 4,
    filterIdentifiers = [],
  }) {
    throw new Error("Must be implemented by provider");
  }

  /**
   * Perform a similarity search and return raw results
   * @param {Object} params - Search parameters
   * @param {any} params.client - Vector database client
   * @param {string} params.namespace - Namespace to search in
   * @param {number[]} params.queryVector - Query vector
   * @param {number} params.similarityThreshold - Similarity threshold
   * @param {number} params.topN - Number of results to return
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
   * Get namespace stats
   * @param {Object} reqBody - Request body
   * @param {string} reqBody.namespace - Namespace to get stats for
   * @returns {Promise<any>}
   */
  async "namespace-stats"(reqBody = {}) {
    throw new Error("Must be implemented by provider");
  }

  /**
   * Delete a namespace
   * @param {Object} reqBody - Request body
   * @param {string} reqBody.namespace - Namespace to delete
   * @returns {Promise<{message: string}>}
   */
  async "delete-namespace"(reqBody = {}) {
    throw new Error("Must be implemented by provider");
  }

  /**
   * Reset vector database (delete all data)
   * @returns {Promise<{reset: boolean}>}
   */
  async reset() {
    throw new Error("Must be implemented by provider");
  }

  /**
   * Curate sources from search results
   * @param {any[]} sources - Sources to curate
   * @returns {any[]}
   */
  curateSources(sources = []) {
    throw new Error("Must be implemented by provider");
  }
}

module.exports = { VectorDatabase };
