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
    default:
      throw new Error("ENV: No VECTOR_DB value found in environment!");
  }
}

function getLLMProvider() {
  const vectorSelection = process.env.LLM_PROVIDER || "openai";
  const embedder = getEmbeddingEngineSelection();
  switch (vectorSelection) {
    case "openai":
      const { OpenAiLLM } = require("../AiProviders/openAi");
      return new OpenAiLLM(embedder);
    case "azure":
      const { AzureOpenAiLLM } = require("../AiProviders/azureOpenAi");
      return new AzureOpenAiLLM(embedder);
    case "anthropic":
      const { AnthropicLLM } = require("../AiProviders/anthropic");
      return new AnthropicLLM(embedder);
    case "lmstudio":
      const { LMStudioLLM } = require("../AiProviders/lmStudio");
      return new LMStudioLLM(embedder);
    case "localai":
      const { LocalAiLLM } = require("../AiProviders/localAi");
      return new LocalAiLLM(embedder);
    case "native":
      const { NativeLLM } = require("../AiProviders/native");
      return new NativeLLM(embedder);
    default:
      throw new Error("ENV: No LLM_PROVIDER value found in environment!");
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
    case "native":
      const { NativeEmbedder } = require("../EmbeddingEngines/native");
      return new NativeEmbedder();
    default:
      return null;
  }
}

function toChunks(arr, size) {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_v, i) =>
    arr.slice(i * size, i * size + size)
  );
}

module.exports = {
  getEmbeddingEngineSelection,
  getVectorDbClass,
  getLLMProvider,
  toChunks,
};
