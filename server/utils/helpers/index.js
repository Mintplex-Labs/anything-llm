function getVectorDbClass() {
  const vectorSelection = process.env.VECTOR_DB || "pinecone";
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
    case "generic-openai":
      const { GenericOpenAiLLM } = require("../AiProviders/genericOpenAi");
      return new GenericOpenAiLLM(embedder, model);
    default:
      throw new Error(
        `ENV: No valid LLM_PROVIDER value found in environment! Using ${process.env.LLM_PROVIDER}`
      );
  }
}

function getEmbeddingEngineSelection() {
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
      const { NativeEmbedder } = require("../EmbeddingEngines/native");
      return new NativeEmbedder();
    case "lmstudio":
      const { LMStudioEmbedder } = require("../EmbeddingEngines/lmstudio");
      return new LMStudioEmbedder();
    case "cohere":
      const { CohereEmbedder } = require("../EmbeddingEngines/cohere");
      return new CohereEmbedder();
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
  getLLMProvider,
  toChunks,
};
