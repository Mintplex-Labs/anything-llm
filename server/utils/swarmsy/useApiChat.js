const NO_API_KEY_CONNECTED_MESSAGE =
  "No API key is connected yet. Add one in settings or continue with local AI.";
const API_PROVIDER_ROUTING_FAILED_MESSAGE =
  "Use API provider routing failed. Check your provider settings and try again, or continue with local AI.";
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
  "AZURE_OPENAI_KEY",
  "GENERIC_OPEN_AI_API_KEY",
  "HUGGING_FACE_LLM_API_KEY",
  "LITE_LLM_API_KEY",
  "APIPIE_LLM_API_KEY",
  "XAI_LLM_API_KEY",
  "SAMBANOVA_LLM_API_KEY",
  "ZAI_API_KEY",
  "PPIO_API_KEY",
  "MOONSHOT_AI_API_KEY",
  "GITEE_AI_API_KEY",
  "MINIMAX_API_KEY",
  "COMETAPI_LLM_API_KEY",
  "DEEPSEEK_API_KEY",
  "AWS_BEDROCK_LLM_ACCESS_KEY_ID",
  "AWS_BEDROCK_LLM_ACCESS_KEY",
  "AWS_BEDROCK_LLM_SESSION_TOKEN",
  "AWS_BEDROCK_LLM_API_KEY",
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

const CANONICAL_CHAT_PROVIDER_IDS = {
  anthropic: "anthropic",
  apipie: "apipie",
  azure: "azure",
  azureopenai: "azure",
  bedrock: "bedrock",
  cohere: "cohere",
  cometapi: "cometapi",
  deepseek: "deepseek",
  fireworksai: "fireworksai",
  foundry: "foundry",
  gemini: "gemini",
  genericopenai: "generic-openai",
  giteeai: "giteeai",
  groq: "groq",
  huggingface: "huggingface",
  lemonade: "lemonade",
  litellm: "litellm",
  minimax: "minimax",
  mistral: "mistral",
  moonshotai: "moonshotai",
  novita: "novita",
  nvidianim: "nvidia-nim",
  openai: "openai",
  openrouter: "openrouter",
  perplexity: "perplexity",
  ppio: "ppio",
  sambanova: "sambanova",
  togetherai: "togetherai",
  xai: "xai",
  zai: "zai",
  dockermodelrunner: "docker-model-runner",
  koboldcpp: "koboldcpp",
  lmstudio: "lmstudio",
  localai: "localai",
  ollama: "ollama",
  privatemode: "privatemode",
  textgenwebui: "textgenwebui",
};

const PROVIDER_KEY_ENV_VARS = {
  anthropic: ["ANTHROPIC_API_KEY"],
  apipie: ["APIPIE_LLM_API_KEY"],
  azure: ["AZURE_OPENAI_KEY"],
  azureopenai: ["AZURE_OPENAI_KEY"],
  bedrock: [
    "AWS_BEDROCK_LLM_ACCESS_KEY_ID",
    "AWS_BEDROCK_LLM_ACCESS_KEY",
    "AWS_BEDROCK_LLM_SESSION_TOKEN",
    "AWS_BEDROCK_LLM_API_KEY",
    "AWS_BEDROCK_LLM_REGION",
    "AWS_BEDROCK_LLM_MODEL_PREFERENCE",
  ],
  cohere: ["COHERE_API_KEY"],
  cometapi: ["COMETAPI_LLM_API_KEY"],
  deepseek: ["DEEPSEEK_API_KEY"],
  fireworksai: ["FIREWORKS_AI_LLM_API_KEY"],
  gemini: ["GEMINI_API_KEY", "GOOGLE_GENERATIVE_AI_API_KEY"],
  genericopenai: ["GENERIC_OPEN_AI_API_KEY", "OPEN_AI_KEY", "OPENAI_API_KEY"],
  giteeai: ["GITEE_AI_API_KEY"],
  groq: ["GROQ_API_KEY"],
  huggingface: ["HUGGING_FACE_LLM_API_KEY"],
  litellm: ["LITE_LLM_API_KEY"],
  minimax: ["MINIMAX_API_KEY"],
  mistral: ["MISTRAL_API_KEY"],
  moonshotai: ["MOONSHOT_AI_API_KEY"],
  novita: ["NOVITA_LLM_API_KEY"],
  nvidianim: ["NVIDIA_NIM_LLM_API_KEY"],
  openai: ["OPEN_AI_KEY", "OPENAI_API_KEY"],
  openrouter: ["OPENROUTER_API_KEY", "OPEN_ROUTER_API_KEY"],
  perplexity: ["PERPLEXITY_API_KEY"],
  ppio: ["PPIO_API_KEY"],
  sambanova: ["SAMBANOVA_LLM_API_KEY"],
  togetherai: ["TOGETHER_AI_API_KEY"],
  xai: ["XAI_LLM_API_KEY"],
  zai: ["ZAI_API_KEY"],
};

function normalizeProviderId(provider = "") {
  return String(provider || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function canonicalProviderId(provider = "") {
  return CANONICAL_CHAT_PROVIDER_IDS[normalizeProviderId(provider)] || null;
}

function normalizeUseApiIntent(useApi) {
  return useApi === true;
}

function hasEnvValue(env = process.env, key) {
  const value = env?.[key];
  return typeof value === "string" && value.trim().length > 0;
}

function hasConnectedOnlineProviderConfig(env = process.env) {
  return ONLINE_PROVIDER_KEY_ENV_VARS.some((key) => hasEnvValue(env, key));
}

function providerKeyEnvVars(provider = "") {
  const canonicalProvider = canonicalProviderId(provider);
  return PROVIDER_KEY_ENV_VARS[normalizeProviderId(canonicalProvider)] || [];
}

function hasBedrockProviderConfig(env = process.env) {
  const authMethod = env?.AWS_BEDROCK_LLM_CONNECTION_METHOD || "iam";
  const commonRequired = [
    "AWS_BEDROCK_LLM_REGION",
    "AWS_BEDROCK_LLM_MODEL_PREFERENCE",
  ];

  const credentialRequired = (() => {
    switch (authMethod) {
      case "iam_role":
        return [];
      case "apiKey":
        return ["AWS_BEDROCK_LLM_API_KEY"];
      case "sessionToken":
        return [
          "AWS_BEDROCK_LLM_ACCESS_KEY_ID",
          "AWS_BEDROCK_LLM_ACCESS_KEY",
          "AWS_BEDROCK_LLM_SESSION_TOKEN",
        ];
      case "iam":
      default:
        return ["AWS_BEDROCK_LLM_ACCESS_KEY_ID", "AWS_BEDROCK_LLM_ACCESS_KEY"];
    }
  })();

  return [...commonRequired, ...credentialRequired].every((key) =>
    hasEnvValue(env, key)
  );
}

function hasProviderKeyConfig(provider = "", env = process.env) {
  const canonicalProvider = canonicalProviderId(provider);
  if (canonicalProvider === "bedrock") return hasBedrockProviderConfig(env);

  const keys = providerKeyEnvVars(provider);
  if (!keys.length) return false;
  return keys.some((key) => hasEnvValue(env, key));
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

function configuredOnlineProvider(provider = "", env = process.env) {
  if (!isOnlineChatProvider(provider)) return null;
  if (!hasProviderKeyConfig(provider, env)) return null;
  return canonicalProviderId(provider);
}

function firstConfiguredUseApiProvider({ workspace, env = process.env } = {}) {
  const workspaceProvider = configuredOnlineProvider(
    workspace?.chatProvider,
    env
  );
  if (workspaceProvider) {
    return { provider: workspaceProvider, source: "workspace" };
  }

  const systemProvider = configuredOnlineProvider(env?.LLM_PROVIDER, env);
  if (systemProvider) {
    return { provider: systemProvider, source: "system" };
  }

  const swarmsyProvider = configuredOnlineProvider(
    env?.SWARMSY_API_CHAT_PROVIDER || env?.SWARMSY_API_PROVIDER,
    env
  );
  if (swarmsyProvider) {
    return { provider: swarmsyProvider, source: "swarmsy" };
  }

  return null;
}

function buildUseApiRuntimeWorkspace({
  workspace,
  runtime = null,
  env = process.env,
} = {}) {
  const selected = firstConfiguredUseApiProvider({ workspace, env });
  if (!selected) {
    return {
      workspace: null,
      status: buildUseApiGuardResponse({ hasProviderConfig: false }),
      provider: null,
      source: null,
    };
  }

  const runtimeWorkspace = {
    ...(workspace || {}),
    chatProvider: selected.provider,
  };

  if (selected.source !== "workspace") {
    runtimeWorkspace.chatModel = null;
  }

  return {
    workspace: runtimeWorkspace,
    status: null,
    provider: selected.provider,
    source: selected.source,
    runtime,
  };
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
    status: "routing_failed",
    message: API_PROVIDER_ROUTING_FAILED_MESSAGE,
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

function useApiProviderSelectedSsePayload({ uuid, provider, source } = {}) {
  return {
    id: uuid,
    uuid,
    type: "statusResponse",
    textResponse: `Use API is routing this message through ${provider}.`,
    sources: [],
    close: false,
    error: null,
    success: true,
    mode: "api_requested",
    status: "provider_selected",
    provider,
    providerSource: source,
  };
}

function useApiRoutingFailedSsePayload({ uuid } = {}) {
  return {
    id: uuid,
    uuid,
    type: "statusResponse",
    textResponse: API_PROVIDER_ROUTING_FAILED_MESSAGE,
    sources: [],
    close: true,
    error: null,
    success: false,
    mode: "api_requested",
    status: "routing_failed",
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
  API_PROVIDER_ROUTING_FAILED_MESSAGE,
  API_PROVIDER_NOT_WIRED_MESSAGE: API_PROVIDER_ROUTING_FAILED_MESSAGE,
  LOCAL_ONLY_ONLINE_PROVIDER_BLOCKED_MESSAGE,
  ONLINE_PROVIDER_KEY_ENV_VARS,
  ONLINE_CHAT_PROVIDER_IDS,
  LOCAL_CHAT_PROVIDER_IDS,
  PROVIDER_KEY_ENV_VARS,
  CANONICAL_CHAT_PROVIDER_IDS,
  normalizeProviderId,
  canonicalProviderId,
  normalizeUseApiIntent,
  hasConnectedOnlineProviderConfig,
  providerKeyEnvVars,
  hasBedrockProviderConfig,
  hasProviderKeyConfig,
  isLocalChatProvider,
  isOnlineChatProvider,
  firstConfiguredUseApiProvider,
  buildUseApiRuntimeWorkspace,
  buildUseApiGuardResponse,
  useApiSsePayload,
  useApiProviderSelectedSsePayload,
  useApiRoutingFailedSsePayload,
  localOnlyProviderBlockedSsePayload,
};
