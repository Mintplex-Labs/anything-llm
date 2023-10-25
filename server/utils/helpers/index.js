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

async function getLLMProvider() {
  const llmSeclection = process.env.LLM_PROVIDER || "openai";
  let providerInstance;

  switch (llmSeclection) {
    case "openai":
      const { OpenAi } = require("../AiProviders/openAi");
      providerInstance = new OpenAi();
      console.log("OpenAi::calling init constructor");
      await providerInstance.init();
      break;
    case "azure":
      const { AzureOpenAi } = require("../AiProviders/azureOpenAi");
      providerInstance = new AzureOpenAi();
      await providerInstance.init();
      break;
    default:
      throw new Error("ENV: No LLM_PROVIDER value found in environment!");
  }

  console.log(`Using ${llmSeclection} as LLM provider.`);

  return providerInstance;
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
