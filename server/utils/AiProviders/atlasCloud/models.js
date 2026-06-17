// Curated Atlas Cloud LLM catalog (synced with https://www.atlascloud.ai/models).
// Atlas Cloud is OpenAI-compatible; these ids are passed straight through as the
// `model` field to https://api.atlascloud.ai/v1/chat/completions.
// We ship a static list rather than calling GET /v1/models so model selection
// works before a key is validated and stays stable across releases.
const ATLAS_CLOUD_MODELS = [
  // Anthropic (Claude)
  { id: "anthropic/claude-opus-4.8", organization: "Anthropic" },
  { id: "anthropic/claude-sonnet-4.6", organization: "Anthropic" },
  { id: "anthropic/claude-haiku-4.5-20251001", organization: "Anthropic" },
  // OpenAI (GPT)
  { id: "openai/gpt-5.5", organization: "OpenAI" },
  { id: "openai/gpt-5.4", organization: "OpenAI" },
  // Google (Gemini)
  { id: "google/gemini-3.1-pro-preview", organization: "Google" },
  { id: "google/gemini-3.5-flash", organization: "Google" },
  { id: "google/gemini-3.1-flash-lite", organization: "Google" },
  // DeepSeek
  { id: "deepseek-ai/deepseek-v4-pro", organization: "DeepSeek" },
  { id: "deepseek-ai/deepseek-v4-flash", organization: "DeepSeek" },
  { id: "deepseek-ai/deepseek-v3.2", organization: "DeepSeek" },
  { id: "deepseek-ai/DeepSeek-V3.2-Exp", organization: "DeepSeek" },
  { id: "deepseek-ai/DeepSeek-V3.1-Terminus", organization: "DeepSeek" },
  { id: "deepseek-ai/DeepSeek-V3.1", organization: "DeepSeek" },
  { id: "deepseek-ai/DeepSeek-V3-0324", organization: "DeepSeek" },
  { id: "deepseek-ai/deepseek-r1-0528", organization: "DeepSeek" },
  { id: "deepseek-ai/deepseek-ocr", organization: "DeepSeek" },
  // Alibaba (Qwen)
  { id: "qwen/qwen3.6-plus", organization: "Alibaba Qwen" },
  { id: "qwen/qwen3.6-35b-a3b", organization: "Alibaba Qwen" },
  { id: "qwen/qwen3.5-397b-a17b", organization: "Alibaba Qwen" },
  { id: "qwen/qwen3.5-122b-a10b", organization: "Alibaba Qwen" },
  { id: "qwen/qwen3.5-35b-a3b", organization: "Alibaba Qwen" },
  { id: "qwen/qwen3.5-27b", organization: "Alibaba Qwen" },
  { id: "qwen/qwen3-max-2026-01-23", organization: "Alibaba Qwen" },
  { id: "Qwen/Qwen3-Coder", organization: "Alibaba Qwen" },
  { id: "qwen/qwen3-coder-next", organization: "Alibaba Qwen" },
  { id: "Qwen/Qwen3-Next-80B-A3B-Instruct", organization: "Alibaba Qwen" },
  { id: "Qwen/Qwen3-Next-80B-A3B-Thinking", organization: "Alibaba Qwen" },
  { id: "Qwen/Qwen3-235B-A22B-Instruct-2507", organization: "Alibaba Qwen" },
  { id: "qwen/qwen3-235b-a22b-thinking-2507", organization: "Alibaba Qwen" },
  { id: "Qwen/Qwen3-VL-235B-A22B-Instruct", organization: "Alibaba Qwen" },
  { id: "qwen/qwen3-vl-235b-a22b-thinking", organization: "Alibaba Qwen" },
  { id: "qwen/qwen3-vl-30b-a3b-instruct", organization: "Alibaba Qwen" },
  { id: "qwen/qwen3-vl-30b-a3b-thinking", organization: "Alibaba Qwen" },
  { id: "qwen/qwen3-vl-8b-instruct", organization: "Alibaba Qwen" },
  { id: "qwen/qwen3-30b-a3b", organization: "Alibaba Qwen" },
  { id: "Qwen/Qwen3-30B-A3B-Instruct-2507", organization: "Alibaba Qwen" },
  { id: "qwen/qwen3-30b-a3b-thinking-2507", organization: "Alibaba Qwen" },
  { id: "qwen/qwen3-32b", organization: "Alibaba Qwen" },
  { id: "qwen/qwen3-8b", organization: "Alibaba Qwen" },
  { id: "qwen/qwen2.5-7b-instruct", organization: "Alibaba Qwen" },
  // Moonshot (Kimi)
  { id: "moonshotai/kimi-k2.6", organization: "Moonshot" },
  { id: "moonshotai/kimi-k2.5", organization: "Moonshot" },
  { id: "moonshotai/Kimi-K2-Thinking", organization: "Moonshot" },
  { id: "moonshotai/Kimi-K2-Instruct-0905", organization: "Moonshot" },
  { id: "moonshotai/Kimi-K2-Instruct", organization: "Moonshot" },
  // Zhipu (GLM)
  { id: "zai-org/glm-5", organization: "Zhipu GLM" },
  { id: "zai-org/glm-5-turbo", organization: "Zhipu GLM" },
  { id: "zai-org/glm-5.1", organization: "Zhipu GLM" },
  { id: "zai-org/glm-5v-turbo", organization: "Zhipu GLM" },
  { id: "zai-org/glm-4.7", organization: "Zhipu GLM" },
  { id: "zai-org/GLM-4.6", organization: "Zhipu GLM" },
  // MiniMax
  { id: "minimaxai/minimax-m2.7", organization: "MiniMax" },
  { id: "minimaxai/minimax-m2.5", organization: "MiniMax" },
  { id: "minimaxai/minimax-m2.1", organization: "MiniMax" },
  { id: "MiniMaxAI/MiniMax-M2", organization: "MiniMax" },
  // xAI
  { id: "xai/grok-4.3", organization: "xAI" },
  // Kuaishou (KAT)
  { id: "kwaipilot/kat-coder-pro-v2", organization: "Kuaishou" },
  // Other
  { id: "owl", organization: "Atlas Cloud" },
];

function atlasCloudModels() {
  return ATLAS_CLOUD_MODELS.map((model) => ({
    id: model.id,
    name: model.id,
    organization: model.organization,
  }));
}

module.exports = {
  ATLAS_CLOUD_MODELS,
  atlasCloudModels,
};
