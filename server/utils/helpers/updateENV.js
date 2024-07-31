const KEY_MAPPING = {
  LLMProvider: {
    envKey: "LLM_PROVIDER",
    checks: [isNotEmpty, supportedLLM],
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
    checks: [isNotEmpty],
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
  GeminiSafetySetting: {
    envKey: "GEMINI_SAFETY_SETTING",
    checks: [validGeminiSafetySetting],
  },

  // LMStudio Settings
  LMStudioBasePath: {
    envKey: "LMSTUDIO_BASE_PATH",
    checks: [isNotEmpty, validLLMExternalBasePath, validDockerizedUrl],
  },
  LMStudioModelPref: {
    envKey: "LMSTUDIO_MODEL_PREF",
    checks: [],
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
  OllamaLLMKeepAliveSeconds: {
    envKey: "OLLAMA_KEEP_ALIVE_TIMEOUT",
    checks: [isInteger],
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

  // KoboldCPP Settings
  KoboldCPPBasePath: {
    envKey: "KOBOLD_CPP_BASE_PATH",
    checks: [isNotEmpty, isValidURL],
  },
  KoboldCPPModelPref: {
    envKey: "KOBOLD_CPP_MODEL_PREF",
    checks: [isNotEmpty],
  },
  KoboldCPPTokenLimit: {
    envKey: "KOBOLD_CPP_MODEL_TOKEN_LIMIT",
    checks: [nonZero],
  },

  // Text Generation Web UI Settings
  TextGenWebUIBasePath: {
    envKey: "TEXT_GEN_WEB_UI_BASE_PATH",
    checks: [isValidURL],
  },
  TextGenWebUITokenLimit: {
    envKey: "TEXT_GEN_WEB_UI_MODEL_TOKEN_LIMIT",
    checks: [nonZero],
  },
  TextGenWebUIAPIKey: {
    envKey: "TEXT_GEN_WEB_UI_API_KEY",
    checks: [],
  },

  // LiteLLM Settings
  LiteLLMModelPref: {
    envKey: "LITE_LLM_MODEL_PREF",
    checks: [isNotEmpty],
  },
  LiteLLMTokenLimit: {
    envKey: "LITE_LLM_MODEL_TOKEN_LIMIT",
    checks: [nonZero],
  },
  LiteLLMBasePath: {
    envKey: "LITE_LLM_BASE_PATH",
    checks: [isValidURL],
  },
  LiteLLMApiKey: {
    envKey: "LITE_LLM_API_KEY",
    checks: [],
  },

  // Generic OpenAI InferenceSettings
  GenericOpenAiBasePath: {
    envKey: "GENERIC_OPEN_AI_BASE_PATH",
    checks: [isValidURL],
  },
  GenericOpenAiModelPref: {
    envKey: "GENERIC_OPEN_AI_MODEL_PREF",
    checks: [isNotEmpty],
  },
  GenericOpenAiTokenLimit: {
    envKey: "GENERIC_OPEN_AI_MODEL_TOKEN_LIMIT",
    checks: [nonZero],
  },
  GenericOpenAiKey: {
    envKey: "GENERIC_OPEN_AI_API_KEY",
    checks: [],
  },
  GenericOpenAiMaxTokens: {
    envKey: "GENERIC_OPEN_AI_MAX_TOKENS",
    checks: [nonZero],
  },

  // AWS Bedrock LLM InferenceSettings
  AwsBedrockLLMAccessKeyId: {
    envKey: "AWS_BEDROCK_LLM_ACCESS_KEY_ID",
    checks: [isNotEmpty],
  },
  AwsBedrockLLMAccessKey: {
    envKey: "AWS_BEDROCK_LLM_ACCESS_KEY",
    checks: [isNotEmpty],
  },
  AwsBedrockLLMRegion: {
    envKey: "AWS_BEDROCK_LLM_REGION",
    checks: [isNotEmpty],
  },
  AwsBedrockLLMModel: {
    envKey: "AWS_BEDROCK_LLM_MODEL_PREFERENCE",
    checks: [isNotEmpty],
  },
  AwsBedrockLLMTokenLimit: {
    envKey: "AWS_BEDROCK_LLM_MODEL_TOKEN_LIMIT",
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

  // Generic OpenAI Embedding Settings
  GenericOpenAiEmbeddingApiKey: {
    envKey: "GENERIC_OPEN_AI_EMBEDDING_API_KEY",
    checks: [],
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
  OpenRouterTimeout: {
    envKey: "OPENROUTER_TIMEOUT_MS",
    checks: [],
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

  // Cohere Options
  CohereApiKey: {
    envKey: "COHERE_API_KEY",
    checks: [isNotEmpty],
  },
  CohereModelPref: {
    envKey: "COHERE_MODEL_PREF",
    checks: [isNotEmpty],
  },

  // VoyageAi Options
  VoyageAiApiKey: {
    envKey: "VOYAGEAI_API_KEY",
    checks: [isNotEmpty],
  },

  // Whisper (transcription) providers
  WhisperProvider: {
    envKey: "WHISPER_PROVIDER",
    checks: [isNotEmpty, supportedTranscriptionProvider],
    postUpdate: [],
  },
  WhisperModelPref: {
    envKey: "WHISPER_MODEL_PREF",
    checks: [validLocalWhisper],
    postUpdate: [],
  },

  // System Settings
  AuthToken: {
    envKey: "AUTH_TOKEN",
    checks: [requiresForceMode, noRestrictedChars],
  },
  JWTSecret: {
    envKey: "JWT_SECRET",
    checks: [requiresForceMode],
  },
  DisableTelemetry: {
    envKey: "DISABLE_TELEMETRY",
    checks: [],
  },

  // Agent Integration ENVs
  AgentGoogleSearchEngineId: {
    envKey: "AGENT_GSE_CTX",
    checks: [],
  },
  AgentGoogleSearchEngineKey: {
    envKey: "AGENT_GSE_KEY",
    checks: [],
  },
  AgentSerperApiKey: {
    envKey: "AGENT_SERPER_DEV_KEY",
    checks: [],
  },
  AgentBingSearchApiKey: {
    envKey: "AGENT_BING_SEARCH_API_KEY",
    checks: [],
  },
  AgentSerplyApiKey: {
    envKey: "AGENT_SERPLY_API_KEY",
    checks: [],
  },
  AgentSearXNGApiUrl: {
    envKey: "AGENT_SEARXNG_API_URL",
    checks: [],
  },

  // TTS/STT Integration ENVS
  TextToSpeechProvider: {
    envKey: "TTS_PROVIDER",
    checks: [supportedTTSProvider],
  },

  // TTS OpenAI
  TTSOpenAIKey: {
    envKey: "TTS_OPEN_AI_KEY",
    checks: [validOpenAIKey],
  },
  TTSOpenAIVoiceModel: {
    envKey: "TTS_OPEN_AI_VOICE_MODEL",
    checks: [],
  },

  // TTS ElevenLabs
  TTSElevenLabsKey: {
    envKey: "TTS_ELEVEN_LABS_KEY",
    checks: [isNotEmpty],
  },
  TTSElevenLabsVoiceModel: {
    envKey: "TTS_ELEVEN_LABS_VOICE_MODEL",
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

function isInteger(input = "") {
  if (isNaN(Number(input))) return "Value must be a number";
  return Number(input);
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

function supportedTTSProvider(input = "") {
  const validSelection = ["native", "openai", "elevenlabs"].includes(input);
  return validSelection ? null : `${input} is not a valid TTS provider.`;
}

function validLocalWhisper(input = "") {
  const validSelection = [
    "Xenova/whisper-small",
    "Xenova/whisper-large",
  ].includes(input);
  return validSelection
    ? null
    : `${input} is not a valid Whisper model selection.`;
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
    "koboldcpp",
    "textgenwebui",
    "cohere",
    "litellm",
    "generic-openai",
    "bedrock",
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
  const validModels = [
    "gemini-pro",
    "gemini-1.0-pro",
    "gemini-1.5-pro-latest",
    "gemini-1.5-flash-latest",
  ];
  return validModels.includes(input)
    ? null
    : `Invalid Model type. Must be one of ${validModels.join(", ")}.`;
}

function validGeminiSafetySetting(input = "") {
  const validModes = [
    "BLOCK_NONE",
    "BLOCK_ONLY_HIGH",
    "BLOCK_MEDIUM_AND_ABOVE",
    "BLOCK_LOW_AND_ABOVE",
  ];
  return validModes.includes(input)
    ? null
    : `Invalid Safety setting. Must be one of ${validModes.join(", ")}.`;
}

function validAnthropicModel(input = "") {
  const validModels = [
    "claude-instant-1.2",
    "claude-2.0",
    "claude-2.1",
    "claude-3-opus-20240229",
    "claude-3-sonnet-20240229",
    "claude-3-haiku-20240307",
    "claude-3-5-sonnet-20240620",
  ];
  return validModels.includes(input)
    ? null
    : `Invalid Model type. Must be one of ${validModels.join(", ")}.`;
}

function supportedEmbeddingModel(input = "") {
  const supported = [
    "openai",
    "azure",
    "localai",
    "native",
    "ollama",
    "lmstudio",
    "cohere",
    "voyageai",
    "litellm",
    "generic-openai",
  ];
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

async function validDockerizedUrl(input = "") {
  if (process.env.ANYTHING_LLM_RUNTIME !== "docker") return null;

  try {
    const { isPortInUse, getLocalHosts } = require("./portAvailabilityChecker");
    const localInterfaces = getLocalHosts();
    const url = new URL(input);
    const hostname = url.hostname.toLowerCase();
    const port = parseInt(url.port, 10);

    // If not a loopback, skip this check.
    if (!localInterfaces.includes(hostname)) return null;
    if (isNaN(port)) return "Invalid URL: Port is not specified or invalid";

    const isPortAvailableFromDocker = await isPortInUse(port, hostname);
    if (isPortAvailableFromDocker)
      return "Port is not running a reachable service on loopback address from inside the AnythingLLM container. Please use host.docker.internal (for linux use 172.17.0.1), a real machine ip, or domain to connect to your service.";
  } catch (error) {
    console.error(error.message);
    return "An error occurred while validating the URL";
  }

  return null;
}

function validHuggingFaceEndpoint(input = "") {
  return input.slice(-6) !== ".cloud"
    ? `Your HF Endpoint should end in ".cloud"`
    : null;
}

function noRestrictedChars(input = "") {
  const regExp = new RegExp(/^[a-zA-Z0-9_\-!@$%^&*();]+$/);
  return !regExp.test(input)
    ? `Your password has restricted characters in it. Allowed symbols are _,-,!,@,$,%,^,&,*,(,),;`
    : null;
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

    const errors = await executeValidationChecks(checks, nextValue, force);
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
  if (process.env.NODE_ENV === "production") dumpENV();
  return { newValues, error: error?.length > 0 ? error : false };
}

async function executeValidationChecks(checks, value, force) {
  const results = await Promise.all(
    checks.map((validator) => validator(value, force))
  );
  return results.filter((err) => typeof err === "string");
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

function dumpENV() {
  const fs = require("fs");
  const path = require("path");

  const frozenEnvs = {};
  const protectedKeys = [
    ...Object.values(KEY_MAPPING).map((values) => values.envKey),
    // Manually Add Keys here which are not already defined in KEY_MAPPING
    // and are either managed or manually set ENV key:values.
    "STORAGE_DIR",
    "SERVER_PORT",
    // For persistent data encryption
    "SIG_KEY",
    "SIG_SALT",
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
  ];

  // Simple sanitization of each value to prevent ENV injection via newline or quote escaping.
  function sanitizeValue(value) {
    const offendingChars =
      /[\n\r\t\v\f\u0085\u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000"'`#]/;
    const firstOffendingCharIndex = value.search(offendingChars);
    if (firstOffendingCharIndex === -1) return value;

    return value.substring(0, firstOffendingCharIndex);
  }

  for (const key of protectedKeys) {
    const envValue = process.env?.[key] || null;
    if (!envValue) continue;
    frozenEnvs[key] = process.env?.[key] || null;
  }

  var envResult = `# Auto-dump ENV from system call on ${new Date().toTimeString()}\n`;
  envResult += Object.entries(frozenEnvs)
    .map(([key, value]) => `${key}='${sanitizeValue(value)}'`)
    .join("\n");

  const envPath = path.join(__dirname, "../../.env");
  fs.writeFileSync(envPath, envResult, { encoding: "utf8", flag: "w" });
  return true;
}

module.exports = {
  dumpENV,
  updateENV,
};
