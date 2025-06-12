const { MODEL_MAP } = require("../modelMap");

const stableModels = [
  // %STABLE_MODELS% - updated 2025-05-13T23:13:58.920Z
  "gemini-1.5-pro-001",
  "gemini-1.5-pro-002",
  "gemini-1.5-pro",
  "gemini-1.5-flash-001",
  "gemini-1.5-flash",
  "gemini-1.5-flash-002",
  "gemini-1.5-flash-8b",
  "gemini-1.5-flash-8b-001",
  "gemini-2.0-flash",
  "gemini-2.0-flash-001",
  "gemini-2.0-flash-lite-001",
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash-preview-image-generation",
  // %EOC_STABLE_MODELS%
];

// There are some models that are only available in the v1beta API
// and some models that are only available in the v1 API
// generally, v1beta models have `exp` in the name, but not always
// so we check for both against a static list as well via API.
const v1BetaModels = [
  // %V1BETA_MODELS% - updated 2025-05-13T23:13:58.920Z
  "gemini-1.5-pro-latest",
  "gemini-1.5-flash-latest",
  "gemini-1.5-flash-8b-latest",
  "gemini-1.5-flash-8b-exp-0827",
  "gemini-1.5-flash-8b-exp-0924",
  "gemini-2.5-pro-exp-03-25",
  "gemini-2.5-pro-preview-03-25",
  "gemini-2.5-flash-preview-04-17",
  "gemini-2.5-flash-preview-04-17-thinking",
  "gemini-2.5-pro-preview-05-06",
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
  "learnlm-2.0-flash-experimental",
  "gemma-3-1b-it",
  "gemma-3-4b-it",
  "gemma-3-12b-it",
  "gemma-3-27b-it",
  // %EOC_V1BETA_MODELS%
];

const defaultGeminiModels = () => [
  ...stableModels.map((model) => ({
    id: model,
    name: model,
    contextWindow: MODEL_MAP.get("gemini", model),
    experimental: false,
  })),
  ...v1BetaModels.map((model) => ({
    id: model,
    name: model,
    contextWindow: MODEL_MAP.get("gemini", model),
    experimental: true,
  })),
];

module.exports = {
  defaultGeminiModels,
  v1BetaModels,
};
