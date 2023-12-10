const SUPPORT_CUSTOM_MODELS = ["openai", "localai", "native-llm"];

async function getCustomModels(provider = "", apiKey = null, basePath = null) {
  if (!SUPPORT_CUSTOM_MODELS.includes(provider))
    return { models: [], error: "Invalid provider for custom models" };

  switch (provider) {
    case "openai":
      return await openAiModels(apiKey);
    case "localai":
      return await localAIModels(basePath);
    case "native-llm":
      return nativeLLMModels();
    default:
      return { models: [], error: "Invalid provider for custom models" };
  }
}

async function openAiModels(apiKey = null) {
  const { Configuration, OpenAIApi } = require("openai");
  const config = new Configuration({
    apiKey: apiKey || process.env.OPEN_AI_KEY,
  });
  const openai = new OpenAIApi(config);
  const models = (
    await openai
      .listModels()
      .then((res) => res.data.data)
      .catch((e) => {
        console.error(`OpenAI:listModels`, e.message);
        return [];
      })
  ).filter(
    (model) => !model.owned_by.includes("openai") && model.owned_by !== "system"
  );

  return { models, error: null };
}

async function localAIModels(basePath = null, apiKey = null) {
  const { Configuration, OpenAIApi } = require("openai");
  const config = new Configuration({
    basePath,
    ...(!!apiKey ? { apiKey } : {}),
  });
  const openai = new OpenAIApi(config);
  const models = await openai
    .listModels()
    .then((res) => res.data.data)
    .catch((e) => {
      console.error(`LocalAI:listModels`, e.message);
      return [];
    });

  return { models, error: null };
}

function nativeLLMModels() {
  const fs = require("fs");
  const path = require("path");
  const storageDir = path.resolve(
    process.env.STORAGE_DIR
      ? path.resolve(process.env.STORAGE_DIR, "models", "downloaded")
      : path.resolve(__dirname, `../../storage/models/downloaded`)
  );
  if (!fs.existsSync(storageDir))
    return { models: [], error: "No model/downloaded storage folder found." };

  const files = fs
    .readdirSync(storageDir)
    .filter((file) => file.toLowerCase().includes(".gguf"))
    .map((file) => {
      return { id: file, name: file };
    });
  return { models: files, error: null };
}

module.exports = {
  getCustomModels,
};
