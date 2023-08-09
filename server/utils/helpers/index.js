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
    default:
      throw new Error("ENV: No VECTOR_DB value found in environment!");
  }
}

function getLLMProvider() {
  const vectorSelection = process.env.LLM_PROVIDER || "openai";
  switch (vectorSelection) {
    case "openai":
      const { OpenAi } = require("../AiProviders/openAi");
      return new OpenAi();
    case "azure":
      const { AzureOpenAi } = require("../AiProviders/azureOpenAi");
      return new AzureOpenAi();
    default:
      throw new Error("ENV: No LLM_PROVIDER value found in environment!");
  }
}

function toChunks(arr, size) {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_v, i) =>
    arr.slice(i * size, i * size + size)
  );
}

module.exports = {
  getVectorDbClass,
  getLLMProvider,
  toChunks,
};
