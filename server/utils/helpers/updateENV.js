const KEY_MAPPING = {
  LLMProvider: {
    envKey: "LLM_PROVIDER",
    checks: [isNotEmpty, supportedLLM],
    postUpdate: [wipeWorkspaceModelPreference],
  },
  // OpenAI Settings
  OpenAiKey: {
    envKey: "OPEN_AI_KEY",
    checks: [isNotEmpty, validOpenAIKey],
  },
  OpenAiModelPref: {
    envKey: "OPEN_MODEL_PREF",
    checks: [isNotEmpty],
  },
  // Azure OpenAI Settings
  AzureOpenAiEndpoint: {
    envKey: "AZURE_OPENAI_ENDPOINT",
    checks: [isNotEmpty, validAzureURL],
  },
  AzureOpenAiTokenLimit: {
    envKey: "AZURE_OPENAI_TOKEN_LIMIT",
    checks: [validOpenAiTokenLimit],
  },
  AzureOpenAiKey: {
    envKey: "AZURE_OPENAI_KEY",
    checks: [isNotEmpty],
  },
  AzureOpenAiModelPref: {
    envKey: "OPEN_MODEL_PREF",
    checks: [isNotEmpty],
  },
  AzureOpenAiEmbeddingModelPref: {
    envKey: "EMBEDDING_MODEL_PREF",
    checks: [isNotEmpty],
  },

  // Anthropic Settings
  AnthropicApiKey: {
    envKey: "ANTHROPIC_API_KEY",
    checks: [isNotEmpty, validAnthropicApiKey],
  },
  AnthropicModelPref: {
    envKey: "ANTHROPIC_MODEL_PREF",
    checks: [isNotEmpty, validAnthropicModel],
  },

  GeminiLLMApiKey: {
    envKey: "GEMINI_API_KEY",
    checks: [isNotEmpty],
  },
  GeminiLLMModelPref: {
    envKey: "GEMINI_LLM_MODEL_PREF",
    checks: [isNotEmpty, validGeminiModel],
  },

  // LMStudio Settings
  LMStudioBasePath: {
    envKey: "LMSTUDIO_BASE_PATH",
    checks: [isNotEmpty, validLLMExternalBasePath, validDockerizedUrl],
  },
  LMStudioTokenLimit: {
    envKey: "LMSTUDIO_MODEL_TOKEN_LIMIT",
    checks: [nonZero],
  },

  // LocalAI Settings
  LocalAiBasePath: {
    envKey: "LOCAL_AI_BASE_PATH",
    checks: [isNotEmpty, validLLMExternalBasePath, validDockerizedUrl],
  },
  LocalAiModelPref: {
    envKey: "LOCAL_AI_MODEL_PREF",
    checks: [],
  },
  LocalAiTokenLimit: {
    envKey: "LOCAL_AI_MODEL_TOKEN_LIMIT",
    checks: [nonZero],
  },
  LocalAiApiKey: {
    envKey: "LOCAL_AI_API_KEY",
    checks: [],
  },

  OllamaLLMBasePath: {
    envKey: "OLLAMA_BASE_PATH",
    checks: [isNotEmpty, validOllamaLLMBasePath, validDockerizedUrl],
  },
  OllamaLLMModelPref: {
    envKey: "OLLAMA_MODEL_PREF",
    checks: [],
  },
  OllamaLLMTokenLimit: {
    envKey: "OLLAMA_MODEL_TOKEN_LIMIT",
    checks: [nonZero],
  },

  // Mistral AI API Settings
  MistralApiKey: {
    envKey: "MISTRAL_API_KEY",
    checks: [isNotEmpty],
  },
  MistralModelPref: {
    envKey: "MISTRAL_MODEL_PREF",
    checks: [isNotEmpty],
  },

  // Native LLM Settings
  NativeLLMModelPref: {
    envKey: "NATIVE_LLM_MODEL_PREF",
    checks: [isDownloadedModel],
  },
  NativeLLMTokenLimit: {
    envKey: "NATIVE_LLM_MODEL_TOKEN_LIMIT",
    checks: [nonZero],
  },

  // Hugging Face LLM Inference Settings
  HuggingFaceLLMEndpoint: {
    envKey: "HUGGING_FACE_LLM_ENDPOINT",
    checks: [isNotEmpty, isValidURL, validHuggingFaceEndpoint],
  },
  HuggingFaceLLMAccessToken: {
    envKey: "HUGGING_FACE_LLM_API_KEY",
    checks: [isNotEmpty],
  },
  HuggingFaceLLMTokenLimit: {
    envKey: "HUGGING_FACE_LLM_TOKEN_LIMIT",
    checks: [nonZero],
  },

  EmbeddingEngine: {
    envKey: "EMBEDDING_ENGINE",
    checks: [supportedEmbeddingModel],
  },
  EmbeddingBasePath: {
    envKey: "EMBEDDING_BASE_PATH",
    checks: [isNotEmpty, validDockerizedUrl],
  },
  EmbeddingModelPref: {
    envKey: "EMBEDDING_MODEL_PREF",
    checks: [isNotEmpty],
  },
  EmbeddingModelMaxChunkLength: {
    envKey: "EMBEDDING_MODEL_MAX_CHUNK_LENGTH",
    checks: [nonZero],
  },

  // Vector Database Selection Settings
  VectorDB: {
    envKey: "VECTOR_DB",
    checks: [isNotEmpty, supportedVectorDB],
  },

  // Chroma Options
  ChromaEndpoint: {
    envKey: "CHROMA_ENDPOINT",
    checks: [isValidURL, validChromaURL, validDockerizedUrl],
  },
  ChromaApiHeader: {
    envKey: "CHROMA_API_HEADER",
    checks: [],
  },
  ChromaApiKey: {
    envKey: "CHROMA_API_KEY",
    checks: [],
  },

  // Weaviate Options
  WeaviateEndpoint: {
    envKey: "WEAVIATE_ENDPOINT",
    checks: [isValidURL, validDockerizedUrl],
  },
  WeaviateApiKey: {
    envKey: "WEAVIATE_API_KEY",
    checks: [],
  },

  // QDrant Options
  QdrantEndpoint: {
    envKey: "QDRANT_ENDPOINT",
    checks: [isValidURL, validDockerizedUrl],
  },
  QdrantApiKey: {
    envKey: "QDRANT_API_KEY",
    checks: [],
  },
  PineConeKey: {
    envKey: "PINECONE_API_KEY",
    checks: [],
  },
  PineConeIndex: {
    envKey: "PINECONE_INDEX",
    checks: [],
  },

  // Milvus Options
  MilvusAddress: {
    envKey: "MILVUS_ADDRESS",
    checks: [isValidURL, validDockerizedUrl],
  },
  MilvusUsername: {
    envKey: "MILVUS_USERNAME",
    checks: [isNotEmpty],
  },
  MilvusPassword: {
    envKey: "MILVUS_PASSWORD",
    checks: [isNotEmpty],
  },

  // Zilliz Cloud Options
  ZillizEndpoint: {
    envKey: "ZILLIZ_ENDPOINT",
    checks: [isValidURL],
  },
  ZillizApiToken: {
    envKey: "ZILLIZ_API_TOKEN",
    checks: [isNotEmpty],
  },

  // Astra DB Options

  AstraDBApplicationToken: {
    envKey: "ASTRA_DB_APPLICATION_TOKEN",
    checks: [isNotEmpty],
  },
  AstraDBEndpoint: {
    envKey: "ASTRA_DB_ENDPOINT",
    checks: [isNotEmpty],
  },

  // Together Ai Options
  TogetherAiApiKey: {
    envKey: "TOGETHER_AI_API_KEY",
    checks: [isNotEmpty],
  },
  TogetherAiModelPref: {
    envKey: "TOGETHER_AI_MODEL_PREF",
    checks: [isNotEmpty],
  },

  // Perplexity Options
  PerplexityApiKey: {
    envKey: "PERPLEXITY_API_KEY",
    checks: [isNotEmpty],
  },
  PerplexityModelPref: {
    envKey: "PERPLEXITY_MODEL_PREF",
    checks: [isNotEmpty],
  },

  // OpenRouter Options
  OpenRouterApiKey: {
    envKey: "OPENROUTER_API_KEY",
    checks: [isNotEmpty],
  },
  OpenRouterModelPref: {
    envKey: "OPENROUTER_MODEL_PREF",
    checks: [isNotEmpty],
  },

  // Groq Options
  GroqApiKey: {
    envKey: "GROQ_API_KEY",
    checks: [isNotEmpty],
  },
  GroqModelPref: {
    envKey: "GROQ_MODEL_PREF",
    checks: [isNotEmpty],
  },

  // Whisper (transcription) providers
  WhisperProvider: {
    envKey: "WHISPER_PROVIDER",
    checks: [isNotEmpty, supportedTranscriptionProvider],
    postUpdate: [],
  },

  // System Settings
  AuthToken: {
    envKey: "AUTH_TOKEN",
    checks: [requiresForceMode],
  },
  JWTSecret: {
    envKey: "JWT_SECRET",
    checks: [requiresForceMode],
  },
  DisableTelemetry: {
    envKey: "DISABLE_TELEMETRY",
    checks: [],
  },
};

function isNotEmpty(input = "") {
  return !input || input.length === 0 ? "Value cannot be empty" : null;
}

function nonZero(input = "") {
  if (isNaN(Number(input))) return "Value must be a number";
  return Number(input) <= 0 ? "Value must be greater than zero" : null;
}

function isValidURL(input = "") {
  try {
    new URL(input);
    return null;
  } catch (e) {
    return "URL is not a valid URL.";
  }
}

function validOpenAIKey(input = "") {
  return input.startsWith("sk-") ? null : "OpenAI Key must start with sk-";
}

function validAnthropicApiKey(input = "") {
  return input.startsWith("sk-ant-")
    ? null
    : "Anthropic Key must start with sk-ant-";
}

function validLLMExternalBasePath(input = "") {
  try {
    new URL(input);
    if (!input.includes("v1")) return "URL must include /v1";
    if (input.split("").slice(-1)?.[0] === "/")
      return "URL cannot end with a slash";
    return null;
  } catch {
    return "Not a valid URL";
  }
}

function validOllamaLLMBasePath(input = "") {
  try {
    new URL(input);
    if (input.split("").slice(-1)?.[0] === "/")
      return "URL cannot end with a slash";
    return null;
  } catch {
    return "Not a valid URL";
  }
}

function supportedLLM(input = "") {
  const validSelection = [
    "openai",
    "azure",
    "anthropic",
    "gemini",
    "lmstudio",
    "localai",
    "ollama",
    "native",
    "togetherai",
    "mistral",
    "huggingface",
    "perplexity",
    "openrouter",
    "groq",
  ].includes(input);
  return validSelection ? null : `${input} is not a valid LLM provider.`;
}

function supportedTranscriptionProvider(input = "") {
  const validSelection = ["openai", "local"].includes(input);
  return validSelection
    ? null
    : `${input} is not a valid transcription model provider.`;
}

function validGeminiModel(input = "") {
  const validModels = ["gemini-pro"];
  return validModels.includes(input)
    ? null
    : `Invalid Model type. Must be one of ${validModels.join(", ")}.`;
}

function validAnthropicModel(input = "") {
  const validModels = [
    "claude-instant-1.2",
    "claude-2.0",
    "claude-2.1",
    "claude-3-opus-20240229",
    "claude-3-sonnet-20240229",
    "claude-3-haiku-20240307",
  ];
  return validModels.includes(input)
    ? null
    : `Invalid Model type. Must be one of ${validModels.join(", ")}.`;
}

function supportedEmbeddingModel(input = "") {
  const supported = ["openai", "azure", "localai", "native", "ollama"];
  return supported.includes(input)
    ? null
    : `Invalid Embedding model type. Must be one of ${supported.join(", ")}.`;
}

function supportedVectorDB(input = "") {
  const supported = [
    "chroma",
    "pinecone",
    "lancedb",
    "weaviate",
    "qdrant",
    "milvus",
    "zilliz",
    "astra",
  ];
  return supported.includes(input)
    ? null
    : `Invalid VectorDB type. Must be one of ${supported.join(", ")}.`;
}

function validChromaURL(input = "") {
  return input.slice(-1) === "/"
    ? `Chroma Instance URL should not end in a trailing slash.`
    : null;
}

function validAzureURL(input = "") {
  try {
    new URL(input);
    if (!input.includes("openai.azure.com"))
      return "URL must include openai.azure.com";
    return null;
  } catch {
    return "Not a valid URL";
  }
}

function validOpenAiTokenLimit(input = "") {
  const tokenLimit = Number(input);
  if (isNaN(tokenLimit)) return "Token limit is not a number";
  if (![4_096, 16_384, 8_192, 32_768, 128_000].includes(tokenLimit))
    return "Invalid OpenAI token limit.";
  return null;
}

function requiresForceMode(_, forceModeEnabled = false) {
  return forceModeEnabled === true ? null : "Cannot set this setting.";
}

function isDownloadedModel(input = "") {
  const fs = require("fs");
  const path = require("path");
  const storageDir = path.resolve(
    process.env.STORAGE_DIR
      ? path.resolve(process.env.STORAGE_DIR, "models", "downloaded")
      : path.resolve(__dirname, `../../storage/models/downloaded`)
  );
  if (!fs.existsSync(storageDir)) return false;

  const files = fs
    .readdirSync(storageDir)
    .filter((file) => file.includes(".gguf"));
  return files.includes(input);
}

function validDockerizedUrl(input = "") {
  if (process.env.ANYTHING_LLM_RUNTIME !== "docker") return null;
  try {
    const { hostname } = new URL(input);
    if (["localhost", "127.0.0.1", "0.0.0.0"].includes(hostname.toLowerCase()))
      return "Localhost, 127.0.0.1, or 0.0.0.0 origins cannot be reached from inside the AnythingLLM container. Please use host.docker.internal, a real machine ip, or domain to connect to your service.";
    return null;
  } catch {}
  return null;
}

function validHuggingFaceEndpoint(input = "") {
  return input.slice(-6) !== ".cloud"
    ? `Your HF Endpoint should end in ".cloud"`
    : null;
}

// If the LLMProvider has changed we need to reset all workspace model preferences to
// null since the provider<>model name combination will be invalid for whatever the new
// provider is.
async function wipeWorkspaceModelPreference(key, prev, next) {
  if (prev === next) return;
  const { Workspace } = require("../../models/workspace");
  await Workspace.resetWorkspaceChatModels();
}

// This will force update .env variables which for any which reason were not able to be parsed or
// read from an ENV file as this seems to be a complicating step for many so allowing people to write
// to the process will at least alleviate that issue. It does not perform comprehensive validity checks or sanity checks
// and is simply for debugging when the .env not found issue many come across.
async function updateENV(newENVs = {}, force = false, userId = null) {
  let error = "";
  const validKeys = Object.keys(KEY_MAPPING);
  const ENV_KEYS = Object.keys(newENVs).filter(
    (key) => validKeys.includes(key) && !newENVs[key].includes("******") // strip out answers where the value is all asterisks
  );
  const newValues = {};

  for (const key of ENV_KEYS) {
    const { envKey, checks, postUpdate = [] } = KEY_MAPPING[key];
    const prevValue = process.env[envKey];
    const nextValue = newENVs[key];
    const errors = checks
      .map((validityCheck) => validityCheck(nextValue, force))
      .filter((err) => typeof err === "string");

    if (errors.length > 0) {
      error += errors.join("\n");
      break;
    }

    newValues[key] = nextValue;
    process.env[envKey] = nextValue;

    for (const postUpdateFunc of postUpdate)
      await postUpdateFunc(key, prevValue, nextValue);
  }

  await logChangesToEventLog(newValues, userId);
  return { newValues, error: error?.length > 0 ? error : false };
}

async function logChangesToEventLog(newValues = {}, userId = null) {
  const { EventLogs } = require("../../models/eventLogs");
  const eventMapping = {
    LLMProvider: "update_llm_provider",
    EmbeddingEngine: "update_embedding_engine",
    VectorDB: "update_vector_db",
  };

  for (const [key, eventName] of Object.entries(eventMapping)) {
    if (!newValues.hasOwnProperty(key)) continue;
    await EventLogs.logEvent(eventName, {}, userId);
  }
  return;
}

async function dumpENV() {
  const fs = require("fs");
  const path = require("path");

  const frozenEnvs = {};
  const protectedKeys = [
    ...Object.values(KEY_MAPPING).map((values) => values.envKey),
    "STORAGE_DIR",
    "SERVER_PORT",
    // Password Schema Keys if present.
    "PASSWORDMINCHAR",
    "PASSWORDMAXCHAR",
    "PASSWORDLOWERCASE",
    "PASSWORDUPPERCASE",
    "PASSWORDNUMERIC",
    "PASSWORDSYMBOL",
    "PASSWORDREQUIREMENTS",
    // HTTPS SETUP KEYS
    "ENABLE_HTTPS",
    "HTTPS_CERT_PATH",
    "HTTPS_KEY_PATH",
    // DISABLED TELEMETRY
    "DISABLE_TELEMETRY",
  ];

  for (const key of protectedKeys) {
    const envValue = process.env?.[key] || null;
    if (!envValue) continue;
    frozenEnvs[key] = process.env?.[key] || null;
  }

  var envResult = `# Auto-dump ENV from system call on ${new Date().toTimeString()}\n`;
  envResult += Object.entries(frozenEnvs)
    .map(([key, value]) => {
      return `${key}='${value}'`;
    })
    .join("\n");

  const envPath = path.join(__dirname, "../../.env");
  fs.writeFileSync(envPath, envResult, { encoding: "utf8", flag: "w" });
  return true;
}

module.exports = {
  dumpENV,
  updateENV,
};
