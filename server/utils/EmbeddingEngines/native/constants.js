const SUPPORTED_NATIVE_EMBEDDING_MODELS = {
  "Xenova/all-MiniLM-L6-v2": {
    maxConcurrentChunks: 25,
    // Right now, this is NOT the token length, and is instead the number of characters
    // that can be processed in a single pass. So we override to 1,000 characters.
    // roughtly the max number of tokens assuming 2 characters per token. (undershooting)
    // embeddingMaxChunkLength: 512, (from the model card)
    embeddingMaxChunkLength: 1_000,
    chunkPrefix: "",
    queryPrefix: "",
    apiInfo: {
      id: "Xenova/all-MiniLM-L6-v2",
      name: "all-MiniLM-L6-v2",
      description:
        "A lightweight and fast model for embedding text. The default model for AnythingLLM.",
      lang: "English",
      size: "23MB",
      modelCard: "https://huggingface.co/Xenova/all-MiniLM-L6-v2",
    },
  },
  "Xenova/nomic-embed-text-v1": {
    maxConcurrentChunks: 5,
    // Right now, this is NOT the token length, and is instead the number of characters
    // that can be processed in a single pass. So we override to 16,000 characters.
    // roughtly the max number of tokens assuming 2 characters per token. (undershooting)
    // embeddingMaxChunkLength: 8192, (from the model card)
    embeddingMaxChunkLength: 16_000,
    chunkPrefix: "search_document: ",
    queryPrefix: "search_query: ",
    apiInfo: {
      id: "Xenova/nomic-embed-text-v1",
      name: "nomic-embed-text-v1",
      description:
        "A high-performing open embedding model with a large token context window. Requires more processing power and memory.",
      lang: "English",
      size: "139MB",
      modelCard: "https://huggingface.co/Xenova/nomic-embed-text-v1",
    },
  },
  "MintplexLabs/multilingual-e5-small": {
    maxConcurrentChunks: 5,
    // Right now, this is NOT the token length, and is instead the number of characters
    // that can be processed in a single pass. So we override to 1,000 characters.
    // roughtly the max number of tokens assuming 2 characters per token. (undershooting)
    // embeddingMaxChunkLength: 512, (from the model card)
    embeddingMaxChunkLength: 1_000,
    chunkPrefix: "passage: ",
    queryPrefix: "query: ",
    apiInfo: {
      id: "MintplexLabs/multilingual-e5-small",
      name: "multilingual-e5-small",
      description:
        "A larger multilingual embedding model that supports 100+ languages. Requires more processing power and memory.",
      lang: "100+ languages",
      size: "487MB",
      modelCard: "https://huggingface.co/intfloat/multilingual-e5-small",
    },
  },
};

module.exports = {
  SUPPORTED_NATIVE_EMBEDDING_MODELS,
};
