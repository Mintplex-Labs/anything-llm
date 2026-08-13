const { MODEL_MAP } = require("../modelMap");

const stableModels = [
  // %STABLE_MODELS% - updated 2026-08-10T18:00:04.775Z
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemma-4-26b-a4b-it",
  "gemma-4-31b-it",
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash-image",
  "gemini-3.1-flash-lite",
  "gemini-3.1-flash-image",
  "gemini-3.1-flash-lite-image",
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.6-flash",
  // %EOC_STABLE_MODELS%
];

// There are some models that are only available in the v1beta API
// and some models that are only available in the v1 API
// generally, v1beta models have `exp` in the name, but not always
// so we check for both against a static list as well via API.
const v1BetaModels = [
  // %V1BETA_MODELS% - updated 2026-08-10T18:00:04.776Z
  "gemini-flash-latest",
  "gemini-flash-lite-latest",
  "gemini-pro-latest",
  "gemini-3-flash-preview",
  "gemini-3.1-pro-preview",
  "gemini-3.1-flash-lite-preview",
  "gemini-3-pro-image-preview",
  "gemini-3-pro-image",
  "nano-banana-pro-preview",
  "gemini-3.1-flash-image-preview",
  "gemini-omni-flash-preview",
  "deep-research-max-preview-04-2026",
  "deep-research-preview-04-2026",
  "deep-research-pro-preview-12-2025",
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
