const SUPPORT_CUSTOM_MODELS = ["openai", "localai", "ollama", "native-llm"];

async function getCustomModels(provider = "", apiKey = null, basePath = null) {
  if (!SUPPORT_CUSTOM_MODELS.includes(provider))
    return { models: [], error: "Invalid provider for custom models" };

  switch (provider) {
    case "openai":
      return await openAiModels(apiKey);
    case "localai":
      return await localAIModels(basePath, apiKey);
    case "ollama":
      return await ollamaAIModels(basePath, apiKey);
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

  // Api Key was successful so lets save it for future uses
  if (models.length > 0 && !!apiKey) process.env.OPEN_AI_KEY = apiKey;
  return { models, error: null };
}

async function localAIModels(basePath = null, apiKey = null) {
  const { Configuration, OpenAIApi } = require("openai");
  const config = new Configuration({
    basePath,
    apiKey: apiKey || process.env.LOCAL_AI_API_KEY,
  });
  const openai = new OpenAIApi(config);
  const models = await openai
    .listModels()
    .then((res) => res.data.data)
    .catch((e) => {
      console.error(`LocalAI:listModels`, e.message);
      return [];
    });

  // Api Key was successful so lets save it for future uses
  if (models.length > 0 && !!apiKey) process.env.LOCAL_AI_API_KEY = apiKey;
  return { models, error: null };
}

async function ollamaAIModels(basePath = null, _apiKey = null) {
  let url;
  try {
    new URL(basePath);
    if (basePath.split("").slice(-1)?.[0] === "/")
      throw new Error("BasePath Cannot end in /!");
    url = basePath;
  } catch {
    return { models: [], error: "Not a valid URL." };
  }

  const models = await fetch(`${url}/api/tags`)
    .then((res) => {
      if (!res.ok)
        throw new Error(`Could not reach Ollama server! ${res.status}`);
      return res.json();
    })
    .then((data) => data?.models || [])
    .then((models) =>
      models.map((model) => {
        return { id: model.name };
      })
    )
    .catch((e) => {
      console.error(e);
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
