const { Telemetry } = require("../../models/telemetry");
const {
  SUPPORTED_CONNECTION_METHODS,
} = require("../AiProviders/bedrock/utils");
const { resetAllVectorStores } = require("../vectorStore/resetAllVectorStores");

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
  AzureOpenAiModelType: {
    envKey: "AZURE_OPENAI_MODEL_TYPE",
    checks: [
      (input) =>
        ["default", "reasoning"].includes(input)
          ? null
          : "Invalid model type. Must be one of: default, reasoning.",
    ],
  },

  // Anthropic Settings
  AnthropicApiKey: {
    envKey: "ANTHROPIC_API_KEY",
    checks: [isNotEmpty, validAnthropicApiKey],
  },
  AnthropicModelPref: {
    envKey: "ANTHROPIC_MODEL_PREF",
    checks: [isNotEmpty],
  },

  GeminiLLMApiKey: {
    envKey: "GEMINI_API_KEY",
    checks: [isNotEmpty],
  },
  GeminiLLMModelPref: {
    envKey: "GEMINI_LLM_MODEL_PREF",
    checks: [isNotEmpty],
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
  OllamaLLMPerformanceMode: {
    envKey: "OLLAMA_PERFORMANCE_MODE",
    checks: [],
  },
  OllamaLLMKeepAliveSeconds: {
    envKey: "OLLAMA_KEEP_ALIVE_TIMEOUT",
    checks: [isInteger],
  },
  OllamaLLMAuthToken: {
    envKey: "OLLAMA_AUTH_TOKEN",
    checks: [],
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
  KoboldCPPMaxTokens: {
    envKey: "KOBOLD_CPP_MAX_TOKENS",
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
  AwsBedrockLLMConnectionMethod: {
    envKey: "AWS_BEDROCK_LLM_CONNECTION_METHOD",
    checks: [
      (input) =>
        SUPPORTED_CONNECTION_METHODS.includes(input) ? null : "invalid Value",
    ],
  },
  AwsBedrockLLMAccessKeyId: {
    envKey: "AWS_BEDROCK_LLM_ACCESS_KEY_ID",
    checks: [isNotEmpty],
  },
  AwsBedrockLLMAccessKey: {
    envKey: "AWS_BEDROCK_LLM_ACCESS_KEY",
    checks: [isNotEmpty],
  },
  AwsBedrockLLMSessionToken: {
    envKey: "AWS_BEDROCK_LLM_SESSION_TOKEN",
    checks: [],
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
  AwsBedrockLLMMaxOutputTokens: {
    envKey: "AWS_BEDROCK_LLM_MAX_OUTPUT_TOKENS",
    checks: [nonZero],
  },

  // Dell Pro AI Studio Settings
  DellProAiStudioBasePath: {
    envKey: "DPAIS_LLM_BASE_PATH",
    checks: [isNotEmpty, validDockerizedUrl],
  },
  DellProAiStudioModelPref: {
    envKey: "DPAIS_LLM_MODEL_PREF",
    checks: [isNotEmpty],
  },
  DellProAiStudioTokenLimit: {
    envKey: "DPAIS_LLM_MODEL_TOKEN_LIMIT",
    checks: [nonZero],
  },

  EmbeddingEngine: {
    envKey: "EMBEDDING_ENGINE",
    checks: [supportedEmbeddingModel],
    postUpdate: [handleVectorStoreReset],
  },
  EmbeddingBasePath: {
    envKey: "EMBEDDING_BASE_PATH",
    checks: [isNotEmpty, validDockerizedUrl],
  },
  EmbeddingModelPref: {
    envKey: "EMBEDDING_MODEL_PREF",
    checks: [isNotEmpty],
    postUpdate: [handleVectorStoreReset],
  },
  EmbeddingModelMaxChunkLength: {
    envKey: "EMBEDDING_MODEL_MAX_CHUNK_LENGTH",
    checks: [nonZero],
  },

  // Gemini Embedding Settings
  GeminiEmbeddingApiKey: {
    envKey: "GEMINI_EMBEDDING_API_KEY",
    checks: [isNotEmpty],
  },

  // Generic OpenAI Embedding Settings
  GenericOpenAiEmbeddingApiKey: {
    envKey: "GENERIC_OPEN_AI_EMBEDDING_API_KEY",
    checks: [],
  },
  GenericOpenAiEmbeddingMaxConcurrentChunks: {
    envKey: "GENERIC_OPEN_AI_EMBEDDING_MAX_CONCURRENT_CHUNKS",
    checks: [nonZero],
  },

  // Vector Database Selection Settings
  VectorDB: {
    envKey: "VECTOR_DB",
    checks: [isNotEmpty, supportedVectorDB],
    postUpdate: [handleVectorStoreReset],
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

  /*
  PGVector Options
  - Does very simple validations - we should expand this in the future
  - to ensure the connection string is valid and the table name is valid
  - via direct query
  */
  PGVectorConnectionString: {
    envKey: "PGVECTOR_CONNECTION_STRING",
    checks: [isNotEmpty, looksLikePostgresConnectionString],
    preUpdate: [validatePGVectorConnectionString],
  },
  PGVectorTableName: {
    envKey: "PGVECTOR_TABLE_NAME",
    checks: [isNotEmpty],
    preUpdate: [validatePGVectorTableName],
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

  // Fireworks AI Options
  FireworksAiLLMApiKey: {
    envKey: "FIREWORKS_AI_LLM_API_KEY",
    checks: [isNotEmpty],
  },
  FireworksAiLLMModelPref: {
    envKey: "FIREWORKS_AI_LLM_MODEL_PREF",
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

  // Novita Options
  NovitaLLMApiKey: {
    envKey: "NOVITA_LLM_API_KEY",
    checks: [isNotEmpty],
  },
  NovitaLLMModelPref: {
    envKey: "NOVITA_LLM_MODEL_PREF",
    checks: [isNotEmpty],
  },
  NovitaLLMTimeout: {
    envKey: "NOVITA_LLM_TIMEOUT_MS",
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
    preUpdate: [
      (_, __, nextValue) => {
        if (nextValue === "true") Telemetry.sendTelemetry("telemetry_disabled");
      },
    ],
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
  AgentSearchApiKey: {
    envKey: "AGENT_SEARCHAPI_API_KEY",
    checks: [],
  },
  AgentSearchApiEngine: {
    envKey: "AGENT_SEARCHAPI_ENGINE",
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
  AgentTavilyApiKey: {
    envKey: "AGENT_TAVILY_API_KEY",
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

  // PiperTTS Local
  TTSPiperTTSVoiceModel: {
    envKey: "TTS_PIPER_VOICE_MODEL",
    checks: [],
  },

  // OpenAI Generic TTS
  TTSOpenAICompatibleKey: {
    envKey: "TTS_OPEN_AI_COMPATIBLE_KEY",
    checks: [],
  },
  TTSOpenAICompatibleVoiceModel: {
    envKey: "TTS_OPEN_AI_COMPATIBLE_VOICE_MODEL",
    checks: [isNotEmpty],
  },
  TTSOpenAICompatibleEndpoint: {
    envKey: "TTS_OPEN_AI_COMPATIBLE_ENDPOINT",
    checks: [isValidURL],
  },

  // DeepSeek Options
  DeepSeekApiKey: {
    envKey: "DEEPSEEK_API_KEY",
    checks: [isNotEmpty],
  },
  DeepSeekModelPref: {
    envKey: "DEEPSEEK_MODEL_PREF",
    checks: [isNotEmpty],
  },

  // APIPie Options
  ApipieLLMApiKey: {
    envKey: "APIPIE_LLM_API_KEY",
    checks: [isNotEmpty],
  },
  ApipieLLMModelPref: {
    envKey: "APIPIE_LLM_MODEL_PREF",
    checks: [isNotEmpty],
  },

  // xAI Options
  XAIApiKey: {
    envKey: "XAI_LLM_API_KEY",
    checks: [isNotEmpty],
  },
  XAIModelPref: {
    envKey: "XAI_LLM_MODEL_PREF",
    checks: [isNotEmpty],
  },

  // Nvidia NIM Options
  NvidiaNimLLMBasePath: {
    envKey: "NVIDIA_NIM_LLM_BASE_PATH",
    checks: [isValidURL],
    postUpdate: [
      (_, __, nextValue) => {
        const { parseNvidiaNimBasePath } = require("../AiProviders/nvidiaNim");
        process.env.NVIDIA_NIM_LLM_BASE_PATH =
          parseNvidiaNimBasePath(nextValue);
      },
    ],
  },
  NvidiaNimLLMModelPref: {
    envKey: "NVIDIA_NIM_LLM_MODEL_PREF",
    checks: [],
    postUpdate: [
      async (_, __, nextValue) => {
        const { NvidiaNimLLM } = require("../AiProviders/nvidiaNim");
        await NvidiaNimLLM.setModelTokenLimit(nextValue);
      },
    ],
  },

  // PPIO Options
  PPIOApiKey: {
    envKey: "PPIO_API_KEY",
    checks: [isNotEmpty],
  },
  PPIOModelPref: {
    envKey: "PPIO_MODEL_PREF",
    checks: [isNotEmpty],
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
  const validSelection = [
    "native",
    "openai",
    "elevenlabs",
    "piper_local",
    "generic-openai",
  ].includes(input);
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
    "togetherai",
    "fireworksai",
    "mistral",
    "huggingface",
    "perplexity",
    "openrouter",
    "novita",
    "groq",
    "koboldcpp",
    "textgenwebui",
    "cohere",
    "litellm",
    "generic-openai",
    "bedrock",
    "deepseek",
    "apipie",
    "xai",
    "nvidia-nim",
    "ppio",
    "dpais",
  ].includes(input);
  return validSelection ? null : `${input} is not a valid LLM provider.`;
}

function supportedTranscriptionProvider(input = "") {
  const validSelection = ["openai", "local"].includes(input);
  return validSelection
    ? null
    : `${input} is not a valid transcription model provider.`;
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

function supportedEmbeddingModel(input = "") {
  const supported = [
    "openai",
    "azure",
    "gemini",
    "localai",
    "native",
    "ollama",
    "lmstudio",
    "cohere",
    "voyageai",
    "litellm",
    "generic-openai",
    "mistral",
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
    "pgvector",
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
  return null;
}

function requiresForceMode(_, forceModeEnabled = false) {
  return forceModeEnabled === true ? null : "Cannot set this setting.";
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

async function handleVectorStoreReset(key, prevValue, nextValue) {
  if (prevValue === nextValue) return;
  if (key === "VectorDB") {
    console.log(
      `Vector configuration changed from ${prevValue} to ${nextValue} - resetting ${prevValue} namespaces`
    );
    return await resetAllVectorStores({ vectorDbKey: prevValue });
  }

  if (key === "EmbeddingEngine" || key === "EmbeddingModelPref") {
    console.log(
      `${key} changed from ${prevValue} to ${nextValue} - resetting ${process.env.VECTOR_DB} namespaces`
    );
    return await resetAllVectorStores({ vectorDbKey: process.env.VECTOR_DB });
  }
  return false;
}

/**
 * Validates the Postgres connection string for the PGVector options.
 * @param {string} input - The Postgres connection string to validate.
 * @returns {string} - An error message if the connection string is invalid, otherwise null.
 */
async function looksLikePostgresConnectionString(connectionString = null) {
  if (!connectionString || !connectionString.startsWith("postgresql://"))
    return "Invalid Postgres connection string. Must start with postgresql://";
  if (connectionString.includes(" "))
    return "Invalid Postgres connection string. Must not contain spaces.";
  return null;
}

/**
 * Validates the Postgres connection string for the PGVector options.
 * @param {string} key - The ENV key we are validating.
 * @param {string} prevValue - The previous value of the key.
 * @param {string} nextValue - The next value of the key.
 * @returns {string} - An error message if the connection string is invalid, otherwise null.
 */
async function validatePGVectorConnectionString(key, prevValue, nextValue) {
  const envKey = KEY_MAPPING[key].envKey;

  if (prevValue === nextValue) return; // If the value is the same as the previous value, don't validate it.
  if (!nextValue) return; // If the value is not set, don't validate it.
  if (nextValue === process.env[envKey]) return; // If the value is the same as the current connection string, don't validate it.

  const { PGVector } = require("../vectorDbProviders/pgvector");
  const { error, success } = await PGVector.validateConnection({
    connectionString: nextValue,
  });
  if (!success) return error;

  // Set the ENV variable for the PGVector connection string early so we can use it in the table check.
  process.env[envKey] = nextValue;
  return null;
}

/**
 * Validates the Postgres table name for the PGVector options.
 * - Table should not already exist in the database.
 * @param {string} key - The ENV key we are validating.
 * @param {string} prevValue - The previous value of the key.
 * @param {string} nextValue - The next value of the key.
 * @returns {string} - An error message if the table name is invalid, otherwise null.
 */
async function validatePGVectorTableName(key, prevValue, nextValue) {
  const envKey = KEY_MAPPING[key].envKey;

  if (prevValue === nextValue) return; // If the value is the same as the previous value, don't validate it.
  if (!nextValue) return; // If the value is not set, don't validate it.
  if (nextValue === process.env[envKey]) return; // If the value is the same as the current table name, don't validate it.
  if (!process.env.PGVECTOR_CONNECTION_STRING) return; // if connection string is not set, don't validate it since it will fail.

  const { PGVector } = require("../vectorDbProviders/pgvector");
  const { error, success } = await PGVector.validateConnection({
    connectionString: process.env.PGVECTOR_CONNECTION_STRING,
    tableName: nextValue,
  });
  if (!success) return error;

  return null;
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
    const {
      envKey,
      checks,
      preUpdate = [],
      postUpdate = [],
    } = KEY_MAPPING[key];
    const prevValue = process.env[envKey];
    const nextValue = newENVs[key];
    let errors = await executeValidationChecks(checks, nextValue, force);

    // If there are any errors from regular simple validation checks
    // exit early.
    if (errors.length > 0) {
      error += errors.join("\n");
      break;
    }

    // Accumulate errors from preUpdate functions
    errors = [];
    for (const preUpdateFunc of preUpdate) {
      const errorMsg = await preUpdateFunc(key, prevValue, nextValue);
      if (!!errorMsg && typeof errorMsg === "string") errors.push(errorMsg);
    }

    // If there are any errors from preUpdate functions
    // exit early.
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
    // Other Configuration Keys
    "DISABLE_VIEW_CHAT_HISTORY",
    // Simple SSO
    "SIMPLE_SSO_ENABLED",
    "SIMPLE_SSO_NO_LOGIN",
    // Community Hub
    "COMMUNITY_HUB_BUNDLE_DOWNLOADS_ENABLED",

    // Nvidia NIM Keys that are automatically managed
    "NVIDIA_NIM_LLM_MODEL_TOKEN_LIMIT",

    // OCR Language Support
    "TARGET_OCR_LANG",

    // Collector API common ENV - allows bypassing URL validation checks
    "COLLECTOR_ALLOW_ANY_IP",

    // Allow disabling of streaming for generic openai
    "GENERIC_OPENAI_STREAMING_DISABLED",
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
