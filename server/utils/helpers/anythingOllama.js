const { AnythingLLMOllama } = require("../AiProviders/anythingLLM");
async function downloadAnythingOllamaModel(
  modelName = "llama2",
  progressCallback,
  successCallback
) {
  const models = await new AnythingLLMOllama().pullModel(
    modelName,
    progressCallback,
    successCallback
  );
  return { models, error: null };
}

module.exports = { downloadAnythingOllamaModel };
