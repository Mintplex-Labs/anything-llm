/**
 * @typedef {Object} BaseLLMProvider - A basic llm provider object
 * @property {Function} streamingEnabled - Checks if streaming is enabled for chat completions.
 * @property {Function} promptWindowLimit - Returns the token limit for the current model.
 * @property {Function} isValidChatCompletionModel - Validates if the provided model is suitable for chat completion.
 * @property {Function} constructPrompt - Constructs a formatted prompt for the chat completion request.
 * @property {Function} getChatCompletion - Gets a chat completion response from OpenAI.
 * @property {Function} streamGetChatCompletion - Streams a chat completion response from OpenAI.
 * @property {Function} handleStream - Handles the streaming response.
 * @property {Function} embedTextInput - Embeds the provided text input using the specified embedder.
 * @property {Function} embedChunks - Embeds multiple chunks of text using the specified embedder.
 * @property {Function} compressMessages - Compresses chat messages to fit within the token limit.
 */

/**
 * @typedef {Object} BaseVectorDatabaseProvider
 * @property {string} name - The name of the Vector Database instance.
 * @property {Function} connect - Connects to the Vector Database client.
 * @property {Function} totalVectors - Returns the total number of vectors in the database.
 * @property {Function} namespaceCount - Returns the count of vectors in a given namespace.
 * @property {Function} similarityResponse - Performs a similarity search on a given namespace.
 * @property {Function} namespace - Retrieves the specified namespace collection.
 * @property {Function} hasNamespace - Checks if a namespace exists.
 * @property {Function} namespaceExists - Verifies if a namespace exists in the client.
 * @property {Function} deleteVectorsInNamespace - Deletes all vectors in a specified namespace.
 * @property {Function} deleteDocumentFromNamespace - Deletes a document from a specified namespace.
 * @property {Function} addDocumentToNamespace - Adds a document to a specified namespace.
 * @property {Function} performSimilaritySearch - Performs a similarity search in the namespace.
 */

/**
 * @typedef {Object} BaseEmbedderProvider
 * @property {string} model - The model used for embedding.
 * @property {number} maxConcurrentChunks - The maximum number of chunks processed concurrently.
 * @property {number} embeddingMaxChunkLength - The maximum length of each chunk for embedding.
 * @property {Function} embedTextInput - Embeds a single text input.
 * @property {Function} embedChunks - Embeds multiple chunks of text.
 */

/**
 * Gets the systems current vector database provider.
 * @returns { BaseVectorDatabaseProvider}
 */
function getVectorDbClass() {
  const vectorSelection = process.env.VECTOR_DB || "lancedb";
  switch (vectorSelection) {
    case "pinecone":
      const { Pinecone } = require("../vectorDbProviders/pinecone");
      return Pinecone;
    case "chroma":
      const { Chroma } = require("../vectorDbProviders/chroma");
      return Chroma;
    case "lancedb":
      const { LanceDb } = require("../vectorDbProviders/lance");
      return LanceDb;
    case "weaviate":
      const { Weaviate } = require("../vectorDbProviders/weaviate");
      return Weaviate;
    case "qdrant":
      const { QDrant } = require("../vectorDbProviders/qdrant");
      return QDrant;
    case "milvus":
      const { Milvus } = require("../vectorDbProviders/milvus");
      return Milvus;
    case "zilliz":
      const { Zilliz } = require("../vectorDbProviders/zilliz");
      return Zilliz;
    case "astra":
      const { AstraDB } = require("../vectorDbProviders/astra");
      return AstraDB;
    default:
      throw new Error("ENV: No VECTOR_DB value found in environment!");
  }
}

/**
 * Returns the LLMProvider with its embedder attached via system or via defined provider.
 * @param {{provider: string | null, model: string | null} | null} params - Initialize params for LLMs provider
 * @returns {BaseLLMProvider}
 */
function getLLMProvider({ provider = null, model = null } = {}) {
  const LLMSelection = provider ?? process.env.LLM_PROVIDER ?? "openai";
  const embedder = getEmbeddingEngineSelection();

  switch (LLMSelection) {
    case "openai":
      const { OpenAiLLM } = require("../AiProviders/openAi");
      return new OpenAiLLM(embedder, model);
    case "azure":
      const { AzureOpenAiLLM } = require("../AiProviders/azureOpenAi");
      return new AzureOpenAiLLM(embedder, model);
    case "anthropic":
      const { AnthropicLLM } = require("../AiProviders/anthropic");
      return new AnthropicLLM(embedder, model);
    case "gemini":
      const { GeminiLLM } = require("../AiProviders/gemini");
      return new GeminiLLM(embedder, model);
    case "lmstudio":
      const { LMStudioLLM } = require("../AiProviders/lmStudio");
      return new LMStudioLLM(embedder, model);
    case "localai":
      const { LocalAiLLM } = require("../AiProviders/localAi");
      return new LocalAiLLM(embedder, model);
    case "ollama":
      const { OllamaAILLM } = require("../AiProviders/ollama");
      return new OllamaAILLM(embedder, model);
    case "togetherai":
      const { TogetherAiLLM } = require("../AiProviders/togetherAi");
      return new TogetherAiLLM(embedder, model);
    case "perplexity":
      const { PerplexityLLM } = require("../AiProviders/perplexity");
      return new PerplexityLLM(embedder, model);
    case "openrouter":
      const { OpenRouterLLM } = require("../AiProviders/openRouter");
      return new OpenRouterLLM(embedder, model);
    case "mistral":
      const { MistralLLM } = require("../AiProviders/mistral");
      return new MistralLLM(embedder, model);
    case "native":
      const { NativeLLM } = require("../AiProviders/native");
      return new NativeLLM(embedder, model);
    case "huggingface":
      const { HuggingFaceLLM } = require("../AiProviders/huggingface");
      return new HuggingFaceLLM(embedder, model);
    case "groq":
      const { GroqLLM } = require("../AiProviders/groq");
      return new GroqLLM(embedder, model);
    case "koboldcpp":
      const { KoboldCPPLLM } = require("../AiProviders/koboldCPP");
      return new KoboldCPPLLM(embedder, model);
    case "textgenwebui":
      const { TextGenWebUILLM } = require("../AiProviders/textGenWebUI");
      return new TextGenWebUILLM(embedder, model);
    case "cohere":
      const { CohereLLM } = require("../AiProviders/cohere");
      return new CohereLLM(embedder, model);
    case "litellm":
      const { LiteLLM } = require("../AiProviders/liteLLM");
      return new LiteLLM(embedder, model);
    case "generic-openai":
      const { GenericOpenAiLLM } = require("../AiProviders/genericOpenAi");
      return new GenericOpenAiLLM(embedder, model);
    case "bedrock":
      const { AWSBedrockLLM } = require("../AiProviders/bedrock");
      return new AWSBedrockLLM(embedder, model);
    default:
      throw new Error(
        `ENV: No valid LLM_PROVIDER value found in environment! Using ${process.env.LLM_PROVIDER}`
      );
  }
}

/**
 * Returns the EmbedderProvider by itself to whatever is currently in the system settings.
 * @returns {BaseEmbedderProvider}
 */
function getEmbeddingEngineSelection() {
  const { NativeEmbedder } = require("../EmbeddingEngines/native");
  const engineSelection = process.env.EMBEDDING_ENGINE;
  switch (engineSelection) {
    case "openai":
      const { OpenAiEmbedder } = require("../EmbeddingEngines/openAi");
      return new OpenAiEmbedder();
    case "azure":
      const {
        AzureOpenAiEmbedder,
      } = require("../EmbeddingEngines/azureOpenAi");
      return new AzureOpenAiEmbedder();
    case "localai":
      const { LocalAiEmbedder } = require("../EmbeddingEngines/localAi");
      return new LocalAiEmbedder();
    case "ollama":
      const { OllamaEmbedder } = require("../EmbeddingEngines/ollama");
      return new OllamaEmbedder();
    case "native":
      return new NativeEmbedder();
    case "lmstudio":
      const { LMStudioEmbedder } = require("../EmbeddingEngines/lmstudio");
      return new LMStudioEmbedder();
    case "cohere":
      const { CohereEmbedder } = require("../EmbeddingEngines/cohere");
      return new CohereEmbedder();
    case "voyageai":
      const { VoyageAiEmbedder } = require("../EmbeddingEngines/voyageAi");
      return new VoyageAiEmbedder();
    case "litellm":
      const { LiteLLMEmbedder } = require("../EmbeddingEngines/liteLLM");
      return new LiteLLMEmbedder();
    case "generic-openai":
      const {
        GenericOpenAiEmbedder,
      } = require("../EmbeddingEngines/genericOpenAi");
      return new GenericOpenAiEmbedder();
    default:
      return new NativeEmbedder();
  }
}

// Some models have lower restrictions on chars that can be encoded in a single pass
// and by default we assume it can handle 1,000 chars, but some models use work with smaller
// chars so here we can override that value when embedding information.
function maximumChunkLength() {
  if (
    !!process.env.EMBEDDING_MODEL_MAX_CHUNK_LENGTH &&
    !isNaN(process.env.EMBEDDING_MODEL_MAX_CHUNK_LENGTH) &&
    Number(process.env.EMBEDDING_MODEL_MAX_CHUNK_LENGTH) > 1
  )
    return Number(process.env.EMBEDDING_MODEL_MAX_CHUNK_LENGTH);

  return 1_000;
}

function toChunks(arr, size) {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_v, i) =>
    arr.slice(i * size, i * size + size)
  );
}

module.exports = {
  getEmbeddingEngineSelection,
  maximumChunkLength,
  getVectorDbClass,
  getLLMProvider,
  toChunks,
};
