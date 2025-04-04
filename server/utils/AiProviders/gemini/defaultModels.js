const { MODEL_MAP } = require("../modelMap");

// Google Gemini API , list models : https://generativelanguage.googleapis.com/(v1|v1beta)/models?key=$(APIKey)
// 20250330 update

const stableModels = [
  "gemini-1.0-pro-vision-latest",
  "gemini-pro-vision",
  "gemini-1.5-pro-latest",
  "gemini-1.5-pro-001",
  "gemini-1.5-pro-002",
  "gemini-1.5-pro",
  "gemini-1.5-flash-latest",
  "gemini-1.5-flash-001",
  "gemini-1.5-flash-001-tuning",
  "gemini-1.5-flash",
  "gemini-1.5-flash-002",
  "gemini-1.5-flash-8b",
  "gemini-1.5-flash-8b-001",
  "gemini-1.5-flash-8b-latest",
  "gemini-2.0-flash",
  "gemini-2.0-flash-001",
  "gemini-2.0-flash-lite-001",
  "gemini-2.0-flash-lite"
];

const experimentalModels = [
  "chat-bison-001",
  "text-bison-001",
  "gemini-1.5-flash-8b-exp-0827",
  "gemini-1.5-flash-8b-exp-0924",
  "gemini-2.5-pro-exp-03-25",
  "gemini-2.0-flash-exp",
  "gemini-2.0-flash-exp-image-generation",
  "gemini-2.0-flash-lite-preview-02-05",
  "gemini-2.0-flash-lite-preview",
  "gemini-2.0-pro-exp",
  "gemini-2.0-pro-exp-02-05",
  "gemini-exp-1206",
  "gemini-2.0-flash-thinking-exp-01-21",
  "gemini-2.0-flash-thinking-exp",
  "gemini-2.0-flash-thinking-exp-1219",
  "learnlm-1.5-pro-experimental",
  "gemma-3-27b-it"
];

// There are some models that are only available in the v1beta API
// and some models that are only available in the v1 API
// generally, v1beta models have `exp` in the name, but not always
// so we check for both against a static list as well.

const v1BetaModels = [
  "chat-bison-001",
  "text-bison-001",
  "gemini-1.5-pro-latest",
  "gemini-1.5-flash-latest",
  "gemini-1.5-flash-8b-latest",
  "gemini-1.5-flash-8b-exp-0827",
  "gemini-1.5-flash-8b-exp-0924",
  "gemini-2.5-pro-exp-03-25",
  "gemini-2.0-flash-exp",
  "gemini-2.0-flash-exp-image-generation",
  "gemini-2.0-flash-lite-preview-02-05",
  "gemini-2.0-flash-lite-preview",
  "gemini-2.0-pro-exp",
  "gemini-2.0-pro-exp-02-05",
  "gemini-exp-1206",
  "gemini-2.0-flash-thinking-exp-01-21",
  "gemini-2.0-flash-thinking-exp",
  "gemini-2.0-flash-thinking-exp-1219",
  "learnlm-1.5-pro-experimental",
  "gemma-3-27b-it"
];

const defaultGeminiModels = [
  ...stableModels.map((model) => ({
    id: model,
    name: model,
    contextWindow: MODEL_MAP.gemini[model],
    experimental: false,
  })),
  ...experimentalModels.map((model) => ({
    id: model,
    name: model,
    contextWindow: MODEL_MAP.gemini[model],
    experimental: true,
  })),
];

module.exports = {
  defaultGeminiModels,
  v1BetaModels,
};
