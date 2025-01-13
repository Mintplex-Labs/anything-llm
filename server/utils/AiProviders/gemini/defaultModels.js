const { MODEL_MAP } = require("../modelMap");

const stableModels = [
  "gemini-pro",
  "gemini-1.0-pro",
  "gemini-1.5-pro-latest",
  "gemini-1.5-flash-latest",
];

const experimentalModels = [
  "gemini-1.5-pro-exp-0801",
  "gemini-1.5-pro-exp-0827",
  "gemini-1.5-flash-exp-0827",
  "gemini-1.5-flash-8b-exp-0827",
  "gemini-exp-1114",
  "gemini-exp-1121",
  "gemini-exp-1206",
  "learnlm-1.5-pro-experimental",
  "gemini-2.0-flash-exp",
];

// There are some models that are only available in the v1beta API
// and some models that are only available in the v1 API
// generally, v1beta models have `exp` in the name, but not always
// so we check for both against a static list as well.
const v1BetaModels = ["gemini-1.5-pro-latest", "gemini-1.5-flash-latest"];

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
