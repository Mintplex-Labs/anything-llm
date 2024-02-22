const { togetherAiModels } = require("../AiProviders/togetherAi");
const SUPPORT_CUSTOM_MODELS = [
  "openai",
  "localai",
  "ollama",
  "togetherai",
  "mistral",
];

async function getCustomModels(provider = "", apiKey = null, basePath = null) {
  if (!SUPPORT_CUSTOM_MODELS.includes(provider))
    return { models: [], error: "Invalid provider for custom models" };

  switch (provider) {
    case "openai":
      return await openAiModels(apiKey);
    case "localai":
      return await localAIModels(basePath, apiKey);
    case "ollama":
      return await ollamaAIModels(basePath);
    case "togetherai":
      return await getTogetherAiModels();
    case "mistral":
      return await getMistralModels(apiKey);
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
    basePath: basePath || process.env.LOCAL_AI_BASE_PATH,
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

async function ollamaAIModels(basePath = null) {
  let url;
  try {
    let urlPath = basePath ?? process.env.OLLAMA_BASE_PATH;
    new URL(urlPath);
    if (urlPath.split("").slice(-1)?.[0] === "/")
      throw new Error("BasePath Cannot end in /!");
    url = urlPath;
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

async function getTogetherAiModels() {
  const knownModels = togetherAiModels();
  if (!Object.keys(knownModels).length === 0)
    return { models: [], error: null };

  const models = Object.values(knownModels).map((model) => {
    return {
      id: model.id,
      organization: model.organization,
      name: model.name,
    };
  });
  return { models, error: null };
}

async function getMistralModels(apiKey = null) {
  const { Configuration, OpenAIApi } = require("openai");
  const config = new Configuration({
    apiKey: apiKey || process.env.MISTRAL_API_KEY,
    basePath: "https://api.mistral.ai/v1",
  });
  const openai = new OpenAIApi(config);
  const models = await openai
    .listModels()
    .then((res) => res.data.data.filter((model) => !model.id.includes("embed")))
    .catch((e) => {
      console.error(`Mistral:listModels`, e.message);
      return [];
    });

  // Api Key was successful so lets save it for future uses
  if (models.length > 0 && !!apiKey) process.env.MISTRAL_API_KEY = apiKey;
  return { models, error: null };
}

module.exports = {
  getCustomModels,
};
