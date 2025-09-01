const { fetchOpenRouterModels } = require("../AiProviders/openRouter");
const { fetchApiPieModels } = require("../AiProviders/apipie");
const { perplexityModels } = require("../AiProviders/perplexity");
const { fireworksAiModels } = require("../AiProviders/fireworksAi");
const { ElevenLabsTTS } = require("../TextToSpeech/elevenLabs");
const { fetchNovitaModels } = require("../AiProviders/novita");
const { parseLMStudioBasePath } = require("../AiProviders/lmStudio");
const { parseNvidiaNimBasePath } = require("../AiProviders/nvidiaNim");
const { fetchPPIOModels } = require("../AiProviders/ppio");
const { GeminiLLM } = require("../AiProviders/gemini");

const SUPPORT_CUSTOM_MODELS = [
  "openai",
  "anthropic",
  "burncloud",
  "localai",
  "ollama",
  "togetherai",
  "fireworksai",
  "nvidia-nim",
  "mistral",
  "perplexity",
  "openrouter",
  "lmstudio",
  "koboldcpp",
  "litellm",
  "elevenlabs-tts",
  "groq",
  "deepseek",
  "apipie",
  "novita",
  "xai",
  "gemini",
  "ppio",
  "dpais",
  "moonshotai",
  // Embedding Engines
  "native-embedder",
];

async function getCustomModels(provider = "", apiKey = null, basePath = null) {
  if (!SUPPORT_CUSTOM_MODELS.includes(provider))
    return { models: [], error: "Invalid provider for custom models" };

  switch (provider) {
    case "openai":
      return await openAiModels(apiKey);
    case "anthropic":
      return await anthropicModels(apiKey);
    case "burncloud":
      return await burncloudModels(apiKey);
    case "localai":
      return await localAIModels(basePath, apiKey);
    case "ollama":
      return await ollamaAIModels(basePath, apiKey);
    case "togetherai":
      return await getTogetherAiModels(apiKey);
    case "fireworksai":
      return await getFireworksAiModels(apiKey);
    case "mistral":
      return await getMistralModels(apiKey);
    case "perplexity":
      return await getPerplexityModels();
    case "openrouter":
      return await getOpenRouterModels();
    case "lmstudio":
      return await getLMStudioModels(basePath);
    case "koboldcpp":
      return await getKoboldCPPModels(basePath);
    case "litellm":
      return await liteLLMModels(basePath, apiKey);
    case "elevenlabs-tts":
      return await getElevenLabsModels(apiKey);
    case "groq":
      return await getGroqAiModels(apiKey);
    case "deepseek":
      return await getDeepSeekModels(apiKey);
    case "apipie":
      return await getAPIPieModels(apiKey);
    case "novita":
      return await getNovitaModels();
    case "xai":
      return await getXAIModels(apiKey);
    case "nvidia-nim":
      return await getNvidiaNimModels(basePath);
    case "gemini":
      return await getGeminiModels(apiKey);
    case "ppio":
      return await getPPIOModels(apiKey);
    case "dpais":
      return await getDellProAiStudioModels(basePath);
    case "moonshotai":
      return await getMoonshotAiModels(apiKey);
    case "native-embedder":
      return await getNativeEmbedderModels();
    default:
      return { models: [], error: "Invalid provider for custom models" };
  }
}

// ... 保留所有现有的函数 ...

async function burncloudModels(_apiKey = null) {
  const apiKey =
    _apiKey === true
      ? process.env.BURNCLOUD_API_KEY
      : _apiKey || process.env.BURNCLOUD_API_KEY || null;

  if (!apiKey) return { models: [], error: "No API key provided" };

  try {
    const { OpenAI } = require("openai");
    const burncloud = new OpenAI({
      apiKey,
      baseURL: process.env.BURNCLOUD_BASE_URL || "https://ai.burncloud.com/v1",
    });

    const models = await burncloud.models
      .list()
      .then((results) => results.data)
      .then((models) => {
        return models
          .filter((model) => model.object === "model")
          .map((model) => {
            return {
              id: model.id,
              name: model.id, // Use model ID as display name
            };
          });
      })
      .catch((e) => {
        console.error(`BurnCloud:listModels`, e.message);
        // Return default models if API call fails
        return [
          { id: "claude-sonnet-4-20250514", name: "Claude Sonnet 4" },
          { id: "claude-3-7-sonnet-20250219", name: "Claude 3.7 Sonnet" },
          { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet" },
          { id: "gpt-4o", name: "GPT-4o" },
          { id: "gpt-4o-mini", name: "GPT-4o Mini" },
          { id: "o1", name: "GPT-o1" },
          { id: "gpt-4.5-preview", name: "GPT-4.5 Preview" },
          { id: "o1-mini", name: "GPT-o1 Mini" },
          { id: "gpt-image-1", name: "GPT Image 1" },
          {
            id: "gemini-2.5-pro-preview-05-06",
            name: "Gemini 2.5 Pro Preview",
          },
          { id: "deepseek-r1", name: "DeepSeek R1" },
          { id: "deepseek-v3", name: "DeepSeek V3" },
        ];
      });

    // Api Key was successful so lets save it for future uses
    if (models.length > 0 && !!apiKey) process.env.BURNCLOUD_API_KEY = apiKey;
    return { models, error: null };
  } catch (error) {
    console.error(`BurnCloud:listModels`, error.message);
    return { models: [], error: error.message };
  }
}

function getNativeEmbedderModels() {
  const { NativeEmbedder } = require("../EmbeddingEngines/native");
  return { models: NativeEmbedder.availableModels(), error: null };
}

async function getMoonshotAiModels(_apiKey = null) {
  const apiKey =
    _apiKey === true
      ? process.env.MOONSHOT_AI_API_KEY
      : _apiKey || process.env.MOONSHOT_AI_API_KEY || null;

  const { OpenAI: OpenAIApi } = require("openai");
  const openai = new OpenAIApi({
    baseURL: "https://api.moonshot.ai/v1",
    apiKey,
  });
  const models = await openai.models
    .list()
    .then((results) => results.data)
    .catch((e) => {
      console.error(`MoonshotAi:listModels`, e.message);
      return [];
    });

  // Api Key was successful so lets save it for future uses
  if (models.length > 0) process.env.MOONSHOT_AI_API_KEY = apiKey;
  return { models, error: null };
}

module.exports = {
  getCustomModels,
  SUPPORT_CUSTOM_MODELS,
};
