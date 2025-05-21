const LlamaStackClient = require('llama-stack-client');
const { toChunks, getEmbeddingEngineSelection } = require("../../helpers");
const { TextSplitter } = require("../../TextSplitter");
const { v4: uuidv4 } = require("uuid");
const { sourceIdentifier } = require("../../chats");
const { storeVectorResult, cachedVectorInformation } = require("../../files");

const LlamaStackProvider = {
    name: "LlamaStack",
    baseUrl: process.env.LLAMASTACK_BASE_URL || "http://localhost:8321",
    // apiKey: process.env.LLAMASTACK_API_KEY,

    /**
     * Connect to the LlamaStack instance
     * @returns {Promise<{client: LlamaStackClient}>}
     */
    connect: async function () {
        if (!this.baseUrl) throw new Error("LlamaStack base URL not configured");
        // if (!this.apiKey) throw new Error("LlamaStack API key not configured");

        console.log("Connecting to LlamaStack at", this.baseUrl);
        const client = new LlamaStackClient({
            baseUrl: this.baseUrl,
        });
        return { client };
    },

    /**
     * Convert distance to similarity score
     * @param {number} distance 
     * @returns {number}
     */
    distanceToSimilarity: function (distance = null) {
        if (distance === null || typeof distance !== "number") return 0.0;
        if (distance >= 1.0) return 1;
        if (distance < 0) return 1 - Math.abs(distance);
        return 1 - distance;
    },

    // hasNamespace: async function (namespace = null) {
    //     if (!namespace) return false;
    //     const { client } = await this.connect();
    //     const exists = await this.namespaceExists(client, namespace);
    //     return exists;
    // },

    /**
     * Check if the service is available
     * @returns {Promise<{heartbeat: number}>}
     */
    heartbeat: async function () {
        const { client } = await this.connect();
        // Test connection by listing collections
        await client.listCollections();
        return { heartbeat: Number(new Date()) };
    },

    /**
     * Get total number of vectors across all namespaces
     * @returns {Promise<number>}
     */
    totalVectors: async function () {
        const { client } = await this.connect();
        const collections = await client.listCollections();
        let count = 0;
        for (const collection of collections) {
            const stats = await client.getCollectionStats(collection);
            count += stats.totalVectors || 0;
        }
        return count;
    },

    /**
     * Get count of vectors in a specific namespace
     * @param {string} namespace 
     * @returns {Promise<number>}
     */
    namespaceCount: async function (namespace = null) {
        if (!namespace) return 0;
        const { client } = await this.connect();
        const exists = await this.namespaceExists(client, namespace);
        if (!exists) return 0;

        const stats = await client.getCollectionStats(namespace);
        return stats.totalVectors || 0;
    },

    /**
     * Check if namespace exists
     * @param {LlamaStackClient} client 
     * @param {string} namespace 
     * @returns {Promise<boolean>}
     */
    namespaceExists: async function (client, namespace = null) {
        if (!namespace) throw new Error("No namespace provided");
        try {
            const response = await client.vectorDBs.retrieve(namespace);
            return response.status === 200;
        } catch (error) {
            if (error.status === 400) return false;
            throw error; // Re-throw unexpected errors
        }
    },

    /**
     * Get or create a collection
     * @param {LlamaStackClient} client 
     * @param {string} namespace 
     * @param {number} dimensions 
     * @returns {Promise<any>}
     */
    getOrCreateCollection: async function (client, namespace, dimensions = null) {
        const exists = await this.namespaceExists(client, namespace);
        if (!exists) {
            try {
                if (!dimensions) {
                    throw new Error("Unable to infer vector dimensions from input");
                }
                const response = await client.vectorDBs.register({
                    vector_db_id: namespace,
                    // TODO: Make this configurable
                    embedding_model: "all-MiniLM-L6-v2",
                    embedding_dimensions: 384,
                    provider: "sqlite-vec",
                })
                if (response.status !== 200) {
                    throw new Error("Failed to create vector database");
                }
                return response.identifier;
            } catch (err) {
                console.error("Error creating vector database:", err.message);
                return null;
            }
        }
        return namespace;
    },

    /**
     * Add document to namespace
     * @param {string} namespace 
     * @param {Object} documentData 
     * @param {string} fullFilePath 
     * @param {boolean} skipCache 
     * @returns {Promise<{vectorized: boolean, error: string | null}>}
     */
    addDocumentToNamespace: async function (
        namespace,
        documentData = {},
        fullFilePath = null,
        skipCache = false
    ) {
        try {
            const { pageContent, docId, ...metadata } = documentData;
            if (!pageContent || pageContent.length == 0) return false;

            const { client } = await this.connect();
            await this.getOrCreateCollection(client, namespace);

            const documents = [
                {
                    document_id: docId,
                    content: pageContent,
                    metadata: {
                        ...metadata,
                        source: fullFilePath
                    }
                }
            ];
            client.toolRuntime.ragTool.insert({
                documents: documents,
                vector_db_id: namespace,
                chunk_size_in_tokens: 512,
                chunk_overlap_in_tokens: 128
            });
            console.log('Documents inserted successfully using RAG tool_runtime');
            return { vectorized: true, error: null };
        } catch (err) {
            console.error("addDocumentToNamespace", err.message);
            return { vectorized: false, error: err.message };
        }
    },

    /**
     * Delete document from namespace
     * @param {string} namespace 
     * @param {string} docId 
     * @returns {Promise<boolean>}
     */
    deleteDocumentFromNamespace: async function (namespace, docId) {
        throw new Error("Method not implemented");
    },

    /**
     * Delete all vectors in namespace
     * @param {LlamaStackClient} client 
     * @param {string} namespace 
     * @returns {Promise<boolean>}
     */
    deleteVectorsInNamespace: async function (client, namespace = null) {
        throw new Error("Method not implemented");
    },

    /**
     * Perform similarity search
     * @param {Object} params
     * @param {string} params.namespace
     * @param {string} params.input
     * @param {Object} params.LLMConnector
     * @param {number} params.similarityThreshold
     * @param {number} params.topN
     * @param {string[]} params.filterIdentifiers
     * @returns {Promise<{contextTexts: string[], sources: Object[], message: string | null}>}
     */
    performSimilaritySearch: async function ({
        namespace = null,
        input = "",
        LLMConnector = null,
        similarityThreshold = 0.25,
        topN = 4,
        filterIdentifiers = [],
    }) {
        if (!namespace || !input || !LLMConnector)
            throw new Error("Invalid request to performSimilaritySearch");

        try {
            const { client } = await this.connect();
            const response = await client.toolRuntime.ragTool.query({
                query: input,
                vector_db_id: [namespace],
                top_k: topN
            });

            // Extract document IDs from metadata
            const documentIds = response.metadata?.document_ids || [];

            // Process content items
            const contextTexts = [];
            const sources = [];

            if (response.content && Array.isArray(response.content)) {
                // Get only the text content items
                const textItems = response.content.filter(item => item.type === 'text');

                // Skip first and last two items
                // as it contains text like -- 
                // BEGIN of knowledge_search tool results.
                // END of knowledge_search tool results.
                // The above results were retrieved to help answer the user\'s query:
                const relevantItems = textItems.slice(2, -2);

                for (const item of relevantItems) {
                    // Extract content and metadata from each result
                    const contentMatch = item.text.match(/Content: (.*?)(?=Metadata:|$)/s);
                    const metadataMatch = item.text.match(/Metadata: ({.*?})/);

                    if (contentMatch) {
                        const content = contentMatch[1].trim();
                        const metadata = metadataMatch ? JSON.parse(metadataMatch[1]) : {};

                        contextTexts.push(content);
                        sources.push({
                            metadata: {
                                ...metadata,
                                source: metadata.source || 'unknown'
                            }
                        });
                    }
                }
            }
            console.log('contextTexts', contextTexts);
            console.log('sources', sources);
            return {
                contextTexts,
                sources,
                message: null
            };

        } catch (err) {
            console.error("performSimilaritySearch error:", err);
            return { error: err.message, success: false };
        }
    },

    /**
     * Check if a namespace exists (public interface)
     * @param {string} namespace
     * @returns {Promise<boolean>}
     */
    hasNamespace: async function (namespace = null) {
        if (!namespace) return false;
        const { client } = await this.connect();
        return await this.namespaceExists(client, namespace);
    }
};

module.exports = { LlamaStack: LlamaStackProvider };
