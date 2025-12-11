/**
 * File Attachment for automatic upload on the chat container page.
 * @typedef Attachment
 * @property {string} name - the given file name
 * @property {string} mime - the given file mime
 * @property {string} contentString - full base64 encoded string of file
 */

/**
 * @typedef {Object} ResponseMetrics
 * @property {number} prompt_tokens - The number of prompt tokens used
 * @property {number} completion_tokens - The number of completion tokens used
 * @property {number} total_tokens - The total number of tokens used
 * @property {number} outputTps - The output tokens per second
 * @property {number} duration - The duration of the request in seconds
 *
 * @typedef {Object} ChatMessage
 * @property {string} role - The role of the message sender (e.g. 'user', 'assistant', 'system')
 * @property {string} content - The content of the message
 *
 * @typedef {Object} ChatCompletionResponse
 * @property {string} textResponse - The text response from the LLM
 * @property {ResponseMetrics} metrics - The response metrics
 *
 * @typedef {Object} ChatCompletionOptions
 * @property {number} temperature - The sampling temperature for the LLM response
 * @property {import("@prisma/client").users} user - The user object for the chat completion to send to the LLM provider for user tracking (optional)
 *
 * @typedef {function(Array<ChatMessage>, ChatCompletionOptions): Promise<ChatCompletionResponse>} getChatCompletionFunction
 *
 * @typedef {function(Array<ChatMessage>, ChatCompletionOptions): Promise<import("./chat/LLMPerformanceMonitor").MonitoredStream>} streamGetChatCompletionFunction
 */

/**
 * @typedef {Object} BaseLLMProvider - A basic llm provider object
 * @property {Function} streamingEnabled - Checks if streaming is enabled for chat completions.
 * @property {Function} promptWindowLimit - Returns the token limit for the current model.
 * @property {Function} isValidChatCompletionModel - Validates if the provided model is suitable for chat completion.
 * @property {Function} constructPrompt - Constructs a formatted prompt for the chat completion request.
 * @property {getChatCompletionFunction} getChatCompletion - Gets a chat completion response from OpenAI.
 * @property {streamGetChatCompletionFunction} streamGetChatCompletion - Streams a chat completion response from OpenAI.
 * @property {Function} handleStream - Handles the streaming response.
 * @property {Function} embedTextInput - Embeds the provided text input using the specified embedder.
 * @property {Function} embedChunks - Embeds multiple chunks of text using the specified embedder.
 * @property {Function} compressMessages - Compresses chat messages to fit within the token limit.
 */

/**
 * @typedef {Object} BaseLLMProviderClass - Class method of provider - not instantiated
 * @property {function(string): number} promptWindowLimit - Returns the token limit for the provided model.
 */

/**
 * @typedef {Object} BaseVectorDatabaseProvider
 * @property {string} name - The name of the Vector Database instance.
 * @property {Function} connect - Connects to the Vector Database client.
 * @property {Function} totalVectors - Returns the total number of vectors in the database.
 * @property {Function} namespaceCount - Returns the count of vectors in a given namespace.
 * @property {Function} similarityResponse - Performs a similarity search on a given namespace.
 * @property {Function} rerankedSimilarityResponse - Performs a similarity search on a given namespace with reranking (if supported by provider).
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
 * @param {('pinecone' | 'chroma' | 'chromacloud' | 'lancedb' | 'weaviate' | 'qdrant' | 'milvus' | 'zilliz' | 'astra') | null} getExactly - If provided, this will return an explit provider.
 * @returns { BaseVectorDatabaseProvider}
 */
function getVectorDbClass(getExactly = null) {
  const vectorSelection = getExactly ?? process.env.VECTOR_DB ?? "lancedb";
  switch (vectorSelection) {
    case "pinecone":
      const { Pinecone } = require("../vectorDbProviders/pinecone");
      return Pinecone;
    case "chroma":
      const { Chroma } = require("../vectorDbProviders/chroma");
      return Chroma;
    case "chromacloud":
      const { ChromaCloud } = require("../vectorDbProviders/chromacloud");
      return ChromaCloud;
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
    case "pgvector":
      const { PGVector } = require("../vectorDbProviders/pgvector");
      return PGVector;
    default:
      console.error(
        `\x1b[31m[ENV ERROR]\x1b[0m No VECTOR_DB value found in environment! Falling back to LanceDB`
      );
      const { LanceDb: DefaultLanceDb } = require("../vectorDbProviders/lance");
      return DefaultLanceDb;
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
    case "fireworksai":
      const { FireworksAiLLM } = require("../AiProviders/fireworksAi");
      return new FireworksAiLLM(embedder, model);
    case "perplexity":
      const { PerplexityLLM } = require("../AiProviders/perplexity");
      return new PerplexityLLM(embedder, model);
    case "openrouter":
      const { OpenRouterLLM } = require("../AiProviders/openRouter");
      return new OpenRouterLLM(embedder, model);
    case "mistral":
      const { MistralLLM } = require("../AiProviders/mistral");
      return new MistralLLM(embedder, model);
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
    case "deepseek":
      const { DeepSeekLLM } = require("../AiProviders/deepseek");
      return new DeepSeekLLM(embedder, model);
    case "apipie":
      const { ApiPieLLM } = require("../AiProviders/apipie");
      return new ApiPieLLM(embedder, model);
    case "novita":
      const { NovitaLLM } = require("../AiProviders/novita");
      return new NovitaLLM(embedder, model);
    case "xai":
      const { XAiLLM } = require("../AiProviders/xai");
      return new XAiLLM(embedder, model);
    case "nvidia-nim":
      const { NvidiaNimLLM } = require("../AiProviders/nvidiaNim");
      return new NvidiaNimLLM(embedder, model);
    case "ppio":
      const { PPIOLLM } = require("../AiProviders/ppio");
      return new PPIOLLM(embedder, model);
    case "moonshotai":
      const { MoonshotAiLLM } = require("../AiProviders/moonshotAi");
      return new MoonshotAiLLM(embedder, model);
    case "dpais":
      const { DellProAiStudioLLM } = require("../AiProviders/dellProAiStudio");
      return new DellProAiStudioLLM(embedder, model);
    case "cometapi":
      const { CometApiLLM } = require("../AiProviders/cometapi");
      return new CometApiLLM(embedder, model);
    case "foundry":
      const { FoundryLLM } = require("../AiProviders/foundry");
      return new FoundryLLM(embedder, model);
    case "zai":
      const { ZAiLLM } = require("../AiProviders/zai");
      return new ZAiLLM(embedder, model);
    case "giteeai":
      const { GiteeAILLM } = require("../AiProviders/giteeai");
      return new GiteeAILLM(embedder, model);
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
    case "mistral":
      const { MistralEmbedder } = require("../EmbeddingEngines/mistral");
      return new MistralEmbedder();
    case "generic-openai":
      const {
        GenericOpenAiEmbedder,
      } = require("../EmbeddingEngines/genericOpenAi");
      return new GenericOpenAiEmbedder();
    case "gemini":
      const { GeminiEmbedder } = require("../EmbeddingEngines/gemini");
      return new GeminiEmbedder();
    case "openrouter":
      const { OpenRouterEmbedder } = require("../EmbeddingEngines/openRouter");
      return new OpenRouterEmbedder();
    default:
      return new NativeEmbedder();
  }
}

/**
 * Returns the LLMProviderClass - this is a helper method to access static methods on a class
 * @param {{provider: string | null} | null} params - Initialize params for LLMs provider
 * @returns {BaseLLMProviderClass}
 */
function getLLMProviderClass({ provider = null } = {}) {
  switch (provider) {
    case "openai":
      const { OpenAiLLM } = require("../AiProviders/openAi");
      return OpenAiLLM;
    case "azure":
      const { AzureOpenAiLLM } = require("../AiProviders/azureOpenAi");
      return AzureOpenAiLLM;
    case "anthropic":
      const { AnthropicLLM } = require("../AiProviders/anthropic");
      return AnthropicLLM;
    case "gemini":
      const { GeminiLLM } = require("../AiProviders/gemini");
      return GeminiLLM;
    case "lmstudio":
      const { LMStudioLLM } = require("../AiProviders/lmStudio");
      return LMStudioLLM;
    case "localai":
      const { LocalAiLLM } = require("../AiProviders/localAi");
      return LocalAiLLM;
    case "ollama":
      const { OllamaAILLM } = require("../AiProviders/ollama");
      return OllamaAILLM;
    case "togetherai":
      const { TogetherAiLLM } = require("../AiProviders/togetherAi");
      return TogetherAiLLM;
    case "fireworksai":
      const { FireworksAiLLM } = require("../AiProviders/fireworksAi");
      return FireworksAiLLM;
    case "perplexity":
      const { PerplexityLLM } = require("../AiProviders/perplexity");
      return PerplexityLLM;
    case "openrouter":
      const { OpenRouterLLM } = require("../AiProviders/openRouter");
      return OpenRouterLLM;
    case "mistral":
      const { MistralLLM } = require("../AiProviders/mistral");
      return MistralLLM;
    case "huggingface":
      const { HuggingFaceLLM } = require("../AiProviders/huggingface");
      return HuggingFaceLLM;
    case "groq":
      const { GroqLLM } = require("../AiProviders/groq");
      return GroqLLM;
    case "koboldcpp":
      const { KoboldCPPLLM } = require("../AiProviders/koboldCPP");
      return KoboldCPPLLM;
    case "textgenwebui":
      const { TextGenWebUILLM } = require("../AiProviders/textGenWebUI");
      return TextGenWebUILLM;
    case "cohere":
      const { CohereLLM } = require("../AiProviders/cohere");
      return CohereLLM;
    case "litellm":
      const { LiteLLM } = require("../AiProviders/liteLLM");
      return LiteLLM;
    case "generic-openai":
      const { GenericOpenAiLLM } = require("../AiProviders/genericOpenAi");
      return GenericOpenAiLLM;
    case "bedrock":
      const { AWSBedrockLLM } = require("../AiProviders/bedrock");
      return AWSBedrockLLM;
    case "deepseek":
      const { DeepSeekLLM } = require("../AiProviders/deepseek");
      return DeepSeekLLM;
    case "apipie":
      const { ApiPieLLM } = require("../AiProviders/apipie");
      return ApiPieLLM;
    case "novita":
      const { NovitaLLM } = require("../AiProviders/novita");
      return NovitaLLM;
    case "xai":
      const { XAiLLM } = require("../AiProviders/xai");
      return XAiLLM;
    case "nvidia-nim":
      const { NvidiaNimLLM } = require("../AiProviders/nvidiaNim");
      return NvidiaNimLLM;
    case "ppio":
      const { PPIOLLM } = require("../AiProviders/ppio");
      return PPIOLLM;
    case "dpais":
      const { DellProAiStudioLLM } = require("../AiProviders/dellProAiStudio");
      return DellProAiStudioLLM;
    case "moonshotai":
      const { MoonshotAiLLM } = require("../AiProviders/moonshotAi");
      return MoonshotAiLLM;
    case "cometapi":
      const { CometApiLLM } = require("../AiProviders/cometapi");
      return CometApiLLM;
    case "foundry":
      const { FoundryLLM } = require("../AiProviders/foundry");
      return FoundryLLM;
    case "zai":
      const { ZAiLLM } = require("../AiProviders/zai");
      return ZAiLLM;
    case "giteeai":
      const { GiteeAILLM } = require("../AiProviders/giteeai");
      return GiteeAILLM;
    default:
      return null;
  }
}

/**
 * Returns the defined model (if available) for the given provider.
 * @param {{provider: string | null} | null} params - Initialize params for LLMs provider
 * @returns {string | null}
 */
function getBaseLLMProviderModel({ provider = null } = {}) {
  switch (provider) {
    case "openai":
      return process.env.OPEN_MODEL_PREF;
    case "azure":
      return process.env.OPEN_MODEL_PREF;
    case "anthropic":
      return process.env.ANTHROPIC_MODEL_PREF;
    case "gemini":
      return process.env.GEMINI_LLM_MODEL_PREF;
    case "lmstudio":
      return process.env.LMSTUDIO_MODEL_PREF;
    case "localai":
      return process.env.LOCAL_AI_MODEL_PREF;
    case "ollama":
      return process.env.OLLAMA_MODEL_PREF;
    case "togetherai":
      return process.env.TOGETHER_AI_MODEL_PREF;
    case "fireworksai":
      return process.env.FIREWORKS_AI_LLM_MODEL_PREF;
    case "perplexity":
      return process.env.PERPLEXITY_MODEL_PREF;
    case "openrouter":
      return process.env.OPENROUTER_MODEL_PREF;
    case "mistral":
      return process.env.MISTRAL_MODEL_PREF;
    case "huggingface":
      return null;
    case "groq":
      return process.env.GROQ_MODEL_PREF;
    case "koboldcpp":
      return process.env.KOBOLD_CPP_MODEL_PREF;
    case "textgenwebui":
      return null;
    case "cohere":
      return process.env.COHERE_MODEL_PREF;
    case "litellm":
      return process.env.LITE_LLM_MODEL_PREF;
    case "generic-openai":
      return process.env.GENERIC_OPEN_AI_MODEL_PREF;
    case "bedrock":
      return process.env.AWS_BEDROCK_LLM_MODEL_PREFERENCE;
    case "deepseek":
      return process.env.DEEPSEEK_MODEL_PREF;
    case "apipie":
      return process.env.APIPIE_LLM_MODEL_PREF;
    case "novita":
      return process.env.NOVITA_LLM_MODEL_PREF;
    case "xai":
      return process.env.XAI_LLM_MODEL_PREF;
    case "nvidia-nim":
      return process.env.NVIDIA_NIM_LLM_MODEL_PREF;
    case "ppio":
      return process.env.PPIO_MODEL_PREF;
    case "dpais":
      return process.env.DPAIS_LLM_MODEL_PREF;
    case "moonshotai":
      return process.env.MOONSHOT_AI_MODEL_PREF;
    case "cometapi":
      return process.env.COMETAPI_LLM_MODEL_PREF;
    case "foundry":
      return process.env.FOUNDRY_MODEL_PREF;
    case "zai":
      return process.env.ZAI_MODEL_PREF;
    case "giteeai":
      return process.env.GITEE_AI_MODEL_PREF;
    default:
      return null;
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
  getLLMProviderClass,
  getBaseLLMProviderModel,
  getLLMProvider,
  toChunks,
};
