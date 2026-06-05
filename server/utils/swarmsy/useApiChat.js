const NO_API_KEY_CONNECTED_MESSAGE =
  "No API key is connected yet. Add one in settings or continue with local AI.";
const API_PROVIDER_NOT_WIRED_MESSAGE =
  "Use API was requested, but online provider execution is not wired for chat yet. Continue with local AI or connect a supported provider after API chat routing is enabled.";
const LOCAL_ONLY_ONLINE_PROVIDER_BLOCKED_MESSAGE =
  "Use API is off, but this workspace is configured for an online provider. Turn on Use API for this message or switch the workspace to local AI.";

const ONLINE_PROVIDER_KEY_ENV_VARS = [
  "OPEN_AI_KEY",
  "OPENAI_API_KEY",
  "ANTHROPIC_API_KEY",
  "GEMINI_API_KEY",
  "GOOGLE_GENERATIVE_AI_API_KEY",
  "GROQ_API_KEY",
  "OPEN_ROUTER_API_KEY",
  "OPENROUTER_API_KEY",
  "MISTRAL_API_KEY",
  "PERPLEXITY_API_KEY",
  "TOGETHER_AI_API_KEY",
  "COHERE_API_KEY",
  "FIREWORKS_AI_LLM_API_KEY",
  "NOVITA_LLM_API_KEY",
];

const ONLINE_CHAT_PROVIDER_IDS = new Set([
  "anthropic",
  "apipie",
  "azure",
  "azureopenai",
  "bedrock",
  "cohere",
  "cometapi",
  "deepseek",
  "fireworksai",
  "foundry",
  "gemini",
  "genericopenai",
  "giteeai",
  "groq",
  "huggingface",
  "lemonade",
  "litellm",
  "minimax",
  "mistral",
  "moonshotai",
  "novita",
  "nvidianim",
  "openai",
  "openrouter",
  "perplexity",
  "ppio",
  "sambanova",
  "togetherai",
  "xai",
  "zai",
]);

const LOCAL_CHAT_PROVIDER_IDS = new Set([
  "dockermodelrunner",
  "koboldcpp",
  "lmstudio",
  "localai",
  "ollama",
  "privatemode",
  "textgenwebui",
]);

function normalizeProviderId(provider = "") {
  return String(provider || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function normalizeUseApiIntent(useApi) {
  return useApi === true;
}

function hasConnectedOnlineProviderConfig(env = process.env) {
  return ONLINE_PROVIDER_KEY_ENV_VARS.some((key) => {
    const value = env?.[key];
    return typeof value === "string" && value.trim().length > 0;
  });
}

function isLocalChatProvider(provider = "") {
  return LOCAL_CHAT_PROVIDER_IDS.has(normalizeProviderId(provider));
}

function isOnlineChatProvider(provider = "") {
  const normalizedProvider = normalizeProviderId(provider);
  if (!normalizedProvider) return false;
  if (isLocalChatProvider(normalizedProvider)) return false;
  return ONLINE_CHAT_PROVIDER_IDS.has(normalizedProvider);
}

function buildUseApiGuardResponse({ hasProviderConfig = false } = {}) {
  if (!hasProviderConfig) {
    return {
      success: false,
      mode: "api_requested",
      status: "needs_user_action",
      message: NO_API_KEY_CONNECTED_MESSAGE,
    };
  }

  return {
    success: false,
    mode: "api_requested",
    status: "not_wired",
    message: API_PROVIDER_NOT_WIRED_MESSAGE,
  };
}

function useApiSsePayload({ uuid, hasProviderConfig = false } = {}) {
  const guard = buildUseApiGuardResponse({ hasProviderConfig });
  return {
    id: uuid,
    uuid,
    type: "statusResponse",
    textResponse: guard.message,
    sources: [],
    close: true,
    error: null,
    success: guard.success,
    mode: guard.mode,
    status: guard.status,
  };
}

function localOnlyProviderBlockedSsePayload({ uuid } = {}) {
  return {
    id: uuid,
    uuid,
    type: "statusResponse",
    textResponse: LOCAL_ONLY_ONLINE_PROVIDER_BLOCKED_MESSAGE,
    sources: [],
    close: true,
    error: null,
    success: false,
    mode: "local_only",
    status: "blocked_online_provider",
  };
}

module.exports = {
  NO_API_KEY_CONNECTED_MESSAGE,
  API_PROVIDER_NOT_WIRED_MESSAGE,
  LOCAL_ONLY_ONLINE_PROVIDER_BLOCKED_MESSAGE,
  ONLINE_PROVIDER_KEY_ENV_VARS,
  ONLINE_CHAT_PROVIDER_IDS,
  LOCAL_CHAT_PROVIDER_IDS,
  normalizeProviderId,
  normalizeUseApiIntent,
  hasConnectedOnlineProviderConfig,
  isLocalChatProvider,
  isOnlineChatProvider,
  buildUseApiGuardResponse,
  useApiSsePayload,
  localOnlyProviderBlockedSsePayload,
};
