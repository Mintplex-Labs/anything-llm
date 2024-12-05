process.env.NODE_ENV === "development"
  ? require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` })
  : require("dotenv").config();

const { default: slugify } = require("slugify");
const { isValidUrl, safeJsonParse } = require("../utils/http");
const prisma = require("../utils/prisma");
const { v4 } = require("uuid");
const { MetaGenerator } = require("../utils/boot/MetaGenerator");

function isNullOrNaN(value) {
  if (value === null) return true;
  return isNaN(value);
}

const SystemSettings = {
  protectedFields: ["multi_user_mode", "hub_api_key"],
  publicFields: [
    "footer_data",
    "support_email",
    "text_splitter_chunk_size",
    "text_splitter_chunk_overlap",
    "max_embed_chunk_size",
    "agent_search_provider",
    "agent_sql_connections",
    "default_agent_skills",
    "imported_agent_skills",
    "custom_app_name",
    "feature_flags",
    "meta_page_title",
    "meta_page_favicon",
  ],
  supportedFields: [
    "logo_filename",
    "telemetry_id",
    "footer_data",
    "support_email",

    "text_splitter_chunk_size",
    "text_splitter_chunk_overlap",
    "agent_search_provider",
    "default_agent_skills",
    "agent_sql_connections",
    "custom_app_name",

    // Meta page customization
    "meta_page_title",
    "meta_page_favicon",

    // beta feature flags
    "experimental_live_file_sync",

    // Hub settings
    "hub_api_key",
  ],
  validations: {
    footer_data: (updates) => {
      try {
        const array = JSON.parse(updates)
          .filter((setting) => isValidUrl(setting.url))
          .slice(0, 3); // max of 3 items in footer.
        return JSON.stringify(array);
      } catch (e) {
        console.error(`Failed to run validation function on footer_data`);
        return JSON.stringify([]);
      }
    },
    text_splitter_chunk_size: (update) => {
      try {
        if (isNullOrNaN(update)) throw new Error("Value is not a number.");
        if (Number(update) <= 0) throw new Error("Value must be non-zero.");
        return Number(update);
      } catch (e) {
        console.error(
          `Failed to run validation function on text_splitter_chunk_size`,
          e.message
        );
        return 1000;
      }
    },
    text_splitter_chunk_overlap: (update) => {
      try {
        if (isNullOrNaN(update)) throw new Error("Value is not a number");
        if (Number(update) < 0) throw new Error("Value cannot be less than 0.");
        return Number(update);
      } catch (e) {
        console.error(
          `Failed to run validation function on text_splitter_chunk_overlap`,
          e.message
        );
        return 20;
      }
    },
    agent_search_provider: (update) => {
      try {
        if (update === "none") return null;
        if (
          ![
            "google-search-engine",
            "searchapi",
            "serper-dot-dev",
            "bing-search",
            "serply-engine",
            "searxng-engine",
            "tavily-search",
            "duckduckgo-engine",
          ].includes(update)
        )
          throw new Error("Invalid SERP provider.");
        return String(update);
      } catch (e) {
        console.error(
          `Failed to run validation function on agent_search_provider`,
          e.message
        );
        return null;
      }
    },
    default_agent_skills: (updates) => {
      try {
        const skills = updates.split(",").filter((skill) => !!skill);
        return JSON.stringify(skills);
      } catch (e) {
        console.error(`Could not validate agent skills.`);
        return JSON.stringify([]);
      }
    },
    agent_sql_connections: async (updates) => {
      const existingConnections = safeJsonParse(
        (await SystemSettings.get({ label: "agent_sql_connections" }))?.value,
        []
      );
      try {
        const updatedConnections = mergeConnections(
          existingConnections,
          safeJsonParse(updates, [])
        );
        return JSON.stringify(updatedConnections);
      } catch (e) {
        console.error(`Failed to merge connections`);
        return JSON.stringify(existingConnections ?? []);
      }
    },
    experimental_live_file_sync: (update) => {
      if (typeof update === "boolean")
        return update === true ? "enabled" : "disabled";
      if (!["enabled", "disabled"].includes(update)) return "disabled";
      return String(update);
    },
    meta_page_title: (newTitle) => {
      try {
        if (typeof newTitle !== "string" || !newTitle) return null;
        return String(newTitle);
      } catch {
        return null;
      } finally {
        new MetaGenerator().clearConfig();
      }
    },
    meta_page_favicon: (faviconUrl) => {
      if (!faviconUrl) return null;
      try {
        const url = new URL(faviconUrl);
        return url.toString();
      } catch {
        return null;
      } finally {
        new MetaGenerator().clearConfig();
      }
    },
    hub_api_key: (apiKey) => {
      if (!apiKey) return null;
      return String(apiKey);
    },
  },
  currentSettings: async function () {
    const { hasVectorCachedFiles } = require("../utils/files");
    const llmProvider = process.env.LLM_PROVIDER;
    const vectorDB = process.env.VECTOR_DB;
    return {
      // --------------------------------------------------------
      // General Settings
      // --------------------------------------------------------
      RequiresAuth: !!process.env.AUTH_TOKEN,
      AuthToken: !!process.env.AUTH_TOKEN,
      JWTSecret: !!process.env.JWT_SECRET,
      StorageDir: process.env.STORAGE_DIR,
      MultiUserMode: await this.isMultiUserMode(),
      DisableTelemetry: process.env.DISABLE_TELEMETRY || "false",

      // --------------------------------------------------------
      // Embedder Provider Selection Settings & Configs
      // --------------------------------------------------------
      EmbeddingEngine: process.env.EMBEDDING_ENGINE,
      HasExistingEmbeddings: await this.hasEmbeddings(), // check if they have any currently embedded documents active in workspaces.
      HasCachedEmbeddings: hasVectorCachedFiles(), // check if they any currently cached embedded docs.
      EmbeddingBasePath: process.env.EMBEDDING_BASE_PATH,
      EmbeddingModelPref: process.env.EMBEDDING_MODEL_PREF,
      EmbeddingModelMaxChunkLength:
        process.env.EMBEDDING_MODEL_MAX_CHUNK_LENGTH,
      GenericOpenAiEmbeddingApiKey:
        !!process.env.GENERIC_OPEN_AI_EMBEDDING_API_KEY,
      GenericOpenAiEmbeddingMaxConcurrentChunks:
        process.env.GENERIC_OPEN_AI_EMBEDDING_MAX_CONCURRENT_CHUNKS || 500,

      // --------------------------------------------------------
      // VectorDB Provider Selection Settings & Configs
      // --------------------------------------------------------
      VectorDB: vectorDB,
      ...this.vectorDBPreferenceKeys(),

      // --------------------------------------------------------
      // LLM Provider Selection Settings & Configs
      // --------------------------------------------------------
      LLMProvider: llmProvider,
      ...this.llmPreferenceKeys(),

      // --------------------------------------------------------
      // Whisper (Audio transcription) Selection Settings & Configs
      // - Currently the only 3rd party is OpenAI, so is OPEN_AI_KEY is set
      // - then it can be shared.
      // --------------------------------------------------------
      WhisperProvider: process.env.WHISPER_PROVIDER || "local",
      WhisperModelPref:
        process.env.WHISPER_MODEL_PREF || "Xenova/whisper-small",

      // --------------------------------------------------------
      // TTS/STT  Selection Settings & Configs
      // - Currently the only 3rd party is OpenAI or the native browser-built in
      // --------------------------------------------------------
      TextToSpeechProvider: process.env.TTS_PROVIDER || "native",
      TTSOpenAIKey: !!process.env.TTS_OPEN_AI_KEY,
      TTSOpenAIVoiceModel: process.env.TTS_OPEN_AI_VOICE_MODEL,

      // Eleven Labs TTS
      TTSElevenLabsKey: !!process.env.TTS_ELEVEN_LABS_KEY,
      TTSElevenLabsVoiceModel: process.env.TTS_ELEVEN_LABS_VOICE_MODEL,
      // Piper TTS
      TTSPiperTTSVoiceModel:
        process.env.TTS_PIPER_VOICE_MODEL ?? "en_US-hfc_female-medium",
      // OpenAI Generic TTS
      TTSOpenAICompatibleKey: !!process.env.TTS_OPEN_AI_COMPATIBLE_KEY,
      TTSOpenAICompatibleVoiceModel:
        process.env.TTS_OPEN_AI_COMPATIBLE_VOICE_MODEL,
      TTSOpenAICompatibleEndpoint: process.env.TTS_OPEN_AI_COMPATIBLE_ENDPOINT,

      // --------------------------------------------------------
      // Agent Settings & Configs
      // --------------------------------------------------------
      AgentGoogleSearchEngineId: process.env.AGENT_GSE_CTX || null,
      AgentGoogleSearchEngineKey: !!process.env.AGENT_GSE_KEY || null,
      AgentSearchApiKey: !!process.env.AGENT_SEARCHAPI_API_KEY || null,
      AgentSearchApiEngine: process.env.AGENT_SEARCHAPI_ENGINE || "google",
      AgentSerperApiKey: !!process.env.AGENT_SERPER_DEV_KEY || null,
      AgentBingSearchApiKey: !!process.env.AGENT_BING_SEARCH_API_KEY || null,
      AgentSerplyApiKey: !!process.env.AGENT_SERPLY_API_KEY || null,
      AgentSearXNGApiUrl: process.env.AGENT_SEARXNG_API_URL || null,
      AgentTavilyApiKey: !!process.env.AGENT_TAVILY_API_KEY || null,

      // --------------------------------------------------------
      // Compliance Settings
      // --------------------------------------------------------
      // Disable View Chat History for the whole instance.
      DisableViewChatHistory:
        "DISABLE_VIEW_CHAT_HISTORY" in process.env || false,
    };
  },

  get: async function (clause = {}) {
    try {
      const setting = await prisma.system_settings.findFirst({ where: clause });
      return setting || null;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },

  getValueOrFallback: async function (clause = {}, fallback = null) {
    try {
      return (await this.get(clause))?.value ?? fallback;
    } catch (error) {
      console.error(error.message);
      return fallback;
    }
  },

  where: async function (clause = {}, limit) {
    try {
      const settings = await prisma.system_settings.findMany({
        where: clause,
        take: limit || undefined,
      });
      return settings;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  // Can take generic keys and will pre-filter invalid keys
  // from the set before sending to the explicit update function
  // that will then enforce validations as well.
  updateSettings: async function (updates = {}) {
    const validFields = Object.keys(updates).filter((key) =>
      this.supportedFields.includes(key)
    );

    Object.entries(updates).forEach(([key]) => {
      if (validFields.includes(key)) return;
      delete updates[key];
    });

    return this._updateSettings(updates);
  },

  // Explicit update of settings + key validations.
  // Only use this method when directly setting a key value
  // that takes no user input for the keys being modified.
  _updateSettings: async function (updates = {}) {
    try {
      const updatePromises = [];
      for (const key of Object.keys(updates)) {
        let validatedValue = updates[key];
        if (this.validations.hasOwnProperty(key)) {
          if (this.validations[key].constructor.name === "AsyncFunction") {
            validatedValue = await this.validations[key](updates[key]);
          } else {
            validatedValue = this.validations[key](updates[key]);
          }
        }

        updatePromises.push(
          prisma.system_settings.upsert({
            where: { label: key },
            update: {
              value: validatedValue === null ? null : String(validatedValue),
            },
            create: {
              label: key,
              value: validatedValue === null ? null : String(validatedValue),
            },
          })
        );
      }

      await Promise.all(updatePromises);
      return { success: true, error: null };
    } catch (error) {
      console.error("FAILED TO UPDATE SYSTEM SETTINGS", error.message);
      return { success: false, error: error.message };
    }
  },

  isMultiUserMode: async function () {
    try {
      const setting = await this.get({ label: "multi_user_mode" });
      return setting?.value === "true";
    } catch (error) {
      console.error(error.message);
      return false;
    }
  },

  currentLogoFilename: async function () {
    try {
      const setting = await this.get({ label: "logo_filename" });
      return setting?.value || null;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },

  hasEmbeddings: async function () {
    try {
      const { Document } = require("./documents");
      const count = await Document.count({}, 1);
      return count > 0;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  },

  vectorDBPreferenceKeys: function () {
    return {
      // Pinecone DB Keys
      PineConeKey: !!process.env.PINECONE_API_KEY,
      PineConeIndex: process.env.PINECONE_INDEX,

      // Chroma DB Keys
      ChromaEndpoint: process.env.CHROMA_ENDPOINT,
      ChromaApiHeader: process.env.CHROMA_API_HEADER,
      ChromaApiKey: !!process.env.CHROMA_API_KEY,

      // Weaviate DB Keys
      WeaviateEndpoint: process.env.WEAVIATE_ENDPOINT,
      WeaviateApiKey: process.env.WEAVIATE_API_KEY,

      // QDrant DB Keys
      QdrantEndpoint: process.env.QDRANT_ENDPOINT,
      QdrantApiKey: process.env.QDRANT_API_KEY,

      // Milvus DB Keys
      MilvusAddress: process.env.MILVUS_ADDRESS,
      MilvusUsername: process.env.MILVUS_USERNAME,
      MilvusPassword: !!process.env.MILVUS_PASSWORD,

      // Zilliz DB Keys
      ZillizEndpoint: process.env.ZILLIZ_ENDPOINT,
      ZillizApiToken: process.env.ZILLIZ_API_TOKEN,

      // AstraDB Keys
      AstraDBApplicationToken: process?.env?.ASTRA_DB_APPLICATION_TOKEN,
      AstraDBEndpoint: process?.env?.ASTRA_DB_ENDPOINT,
    };
  },

  llmPreferenceKeys: function () {
    return {
      // OpenAI Keys
      OpenAiKey: !!process.env.OPEN_AI_KEY,
      OpenAiModelPref: process.env.OPEN_MODEL_PREF || "gpt-4o",

      // Azure + OpenAI Keys
      AzureOpenAiEndpoint: process.env.AZURE_OPENAI_ENDPOINT,
      AzureOpenAiKey: !!process.env.AZURE_OPENAI_KEY,
      AzureOpenAiModelPref: process.env.OPEN_MODEL_PREF,
      AzureOpenAiEmbeddingModelPref: process.env.EMBEDDING_MODEL_PREF,
      AzureOpenAiTokenLimit: process.env.AZURE_OPENAI_TOKEN_LIMIT || 4096,

      // Anthropic Keys
      AnthropicApiKey: !!process.env.ANTHROPIC_API_KEY,
      AnthropicModelPref: process.env.ANTHROPIC_MODEL_PREF || "claude-2",

      // Gemini Keys
      GeminiLLMApiKey: !!process.env.GEMINI_API_KEY,
      GeminiLLMModelPref: process.env.GEMINI_LLM_MODEL_PREF || "gemini-pro",
      GeminiSafetySetting:
        process.env.GEMINI_SAFETY_SETTING || "BLOCK_MEDIUM_AND_ABOVE",

      // LMStudio Keys
      LMStudioBasePath: process.env.LMSTUDIO_BASE_PATH,
      LMStudioTokenLimit: process.env.LMSTUDIO_MODEL_TOKEN_LIMIT,
      LMStudioModelPref: process.env.LMSTUDIO_MODEL_PREF,

      // LocalAI Keys
      LocalAiApiKey: !!process.env.LOCAL_AI_API_KEY,
      LocalAiBasePath: process.env.LOCAL_AI_BASE_PATH,
      LocalAiModelPref: process.env.LOCAL_AI_MODEL_PREF,
      LocalAiTokenLimit: process.env.LOCAL_AI_MODEL_TOKEN_LIMIT,

      // Ollama LLM Keys
      OllamaLLMBasePath: process.env.OLLAMA_BASE_PATH,
      OllamaLLMModelPref: process.env.OLLAMA_MODEL_PREF,
      OllamaLLMTokenLimit: process.env.OLLAMA_MODEL_TOKEN_LIMIT,
      OllamaLLMKeepAliveSeconds: process.env.OLLAMA_KEEP_ALIVE_TIMEOUT ?? 300,
      OllamaLLMPerformanceMode: process.env.OLLAMA_PERFORMANCE_MODE ?? "base",

      // Novita LLM Keys
      NovitaLLMApiKey: !!process.env.NOVITA_LLM_API_KEY,
      NovitaLLMModelPref: process.env.NOVITA_LLM_MODEL_PREF,
      NovitaLLMTimeout: process.env.NOVITA_LLM_TIMEOUT_MS,

      // TogetherAI Keys
      TogetherAiApiKey: !!process.env.TOGETHER_AI_API_KEY,
      TogetherAiModelPref: process.env.TOGETHER_AI_MODEL_PREF,

      // Fireworks AI API Keys
      FireworksAiLLMApiKey: !!process.env.FIREWORKS_AI_LLM_API_KEY,
      FireworksAiLLMModelPref: process.env.FIREWORKS_AI_LLM_MODEL_PREF,

      // Perplexity AI Keys
      PerplexityApiKey: !!process.env.PERPLEXITY_API_KEY,
      PerplexityModelPref: process.env.PERPLEXITY_MODEL_PREF,

      // OpenRouter Keys
      OpenRouterApiKey: !!process.env.OPENROUTER_API_KEY,
      OpenRouterModelPref: process.env.OPENROUTER_MODEL_PREF,
      OpenRouterTimeout: process.env.OPENROUTER_TIMEOUT_MS,

      // Mistral AI (API) Keys
      MistralApiKey: !!process.env.MISTRAL_API_KEY,
      MistralModelPref: process.env.MISTRAL_MODEL_PREF,

      // Groq AI API Keys
      GroqApiKey: !!process.env.GROQ_API_KEY,
      GroqModelPref: process.env.GROQ_MODEL_PREF,

      // Native LLM Keys
      NativeLLMModelPref: process.env.NATIVE_LLM_MODEL_PREF,
      NativeLLMTokenLimit: process.env.NATIVE_LLM_MODEL_TOKEN_LIMIT,

      // HuggingFace Dedicated Inference
      HuggingFaceLLMEndpoint: process.env.HUGGING_FACE_LLM_ENDPOINT,
      HuggingFaceLLMAccessToken: !!process.env.HUGGING_FACE_LLM_API_KEY,
      HuggingFaceLLMTokenLimit: process.env.HUGGING_FACE_LLM_TOKEN_LIMIT,

      // KoboldCPP Keys
      KoboldCPPModelPref: process.env.KOBOLD_CPP_MODEL_PREF,
      KoboldCPPBasePath: process.env.KOBOLD_CPP_BASE_PATH,
      KoboldCPPTokenLimit: process.env.KOBOLD_CPP_MODEL_TOKEN_LIMIT,

      // Text Generation Web UI Keys
      TextGenWebUIBasePath: process.env.TEXT_GEN_WEB_UI_BASE_PATH,
      TextGenWebUITokenLimit: process.env.TEXT_GEN_WEB_UI_MODEL_TOKEN_LIMIT,
      TextGenWebUIAPIKey: !!process.env.TEXT_GEN_WEB_UI_API_KEY,

      // LiteLLM Keys
      LiteLLMModelPref: process.env.LITE_LLM_MODEL_PREF,
      LiteLLMTokenLimit: process.env.LITE_LLM_MODEL_TOKEN_LIMIT,
      LiteLLMBasePath: process.env.LITE_LLM_BASE_PATH,
      LiteLLMApiKey: !!process.env.LITE_LLM_API_KEY,

      // Generic OpenAI Keys
      GenericOpenAiBasePath: process.env.GENERIC_OPEN_AI_BASE_PATH,
      GenericOpenAiModelPref: process.env.GENERIC_OPEN_AI_MODEL_PREF,
      GenericOpenAiTokenLimit: process.env.GENERIC_OPEN_AI_MODEL_TOKEN_LIMIT,
      GenericOpenAiKey: !!process.env.GENERIC_OPEN_AI_API_KEY,
      GenericOpenAiMaxTokens: process.env.GENERIC_OPEN_AI_MAX_TOKENS,

      AwsBedrockLLMConnectionMethod:
        process.env.AWS_BEDROCK_LLM_CONNECTION_METHOD || "iam",
      AwsBedrockLLMAccessKeyId: !!process.env.AWS_BEDROCK_LLM_ACCESS_KEY_ID,
      AwsBedrockLLMAccessKey: !!process.env.AWS_BEDROCK_LLM_ACCESS_KEY,
      AwsBedrockLLMSessionToken: !!process.env.AWS_BEDROCK_LLM_SESSION_TOKEN,
      AwsBedrockLLMRegion: process.env.AWS_BEDROCK_LLM_REGION,
      AwsBedrockLLMModel: process.env.AWS_BEDROCK_LLM_MODEL_PREFERENCE,
      AwsBedrockLLMTokenLimit: process.env.AWS_BEDROCK_LLM_MODEL_TOKEN_LIMIT,

      // Cohere API Keys
      CohereApiKey: !!process.env.COHERE_API_KEY,
      CohereModelPref: process.env.COHERE_MODEL_PREF,

      // VoyageAi API Keys
      VoyageAiApiKey: !!process.env.VOYAGEAI_API_KEY,

      // DeepSeek API Keys
      DeepSeekApiKey: !!process.env.DEEPSEEK_API_KEY,
      DeepSeekModelPref: process.env.DEEPSEEK_MODEL_PREF,

      // APIPie LLM API Keys
      ApipieLLMApiKey: !!process.env.APIPIE_LLM_API_KEY,
      ApipieLLMModelPref: process.env.APIPIE_LLM_MODEL_PREF,

      // xAI LLM API Keys
      XAIApiKey: !!process.env.XAI_LLM_API_KEY,
      XAIModelPref: process.env.XAI_LLM_MODEL_PREF,

      // Nvidia NIM Keys
      NvidiaNimLLMBasePath: process.env.NVIDIA_NIM_LLM_BASE_PATH,
      NvidiaNimLLMModelPref: process.env.NVIDIA_NIM_LLM_MODEL_PREF,
      NvidiaNimLLMTokenLimit: process.env.NVIDIA_NIM_LLM_MODEL_TOKEN_LIMIT,
    };
  },

  // For special retrieval of a key setting that does not expose any credential information
  brief: {
    agent_sql_connections: async function () {
      const setting = await SystemSettings.get({
        label: "agent_sql_connections",
      });
      if (!setting) return [];
      return safeJsonParse(setting.value, []).map((dbConfig) => {
        const { connectionString, ...rest } = dbConfig;
        return rest;
      });
    },
  },
  getFeatureFlags: async function () {
    return {
      experimental_live_file_sync:
        (await SystemSettings.get({ label: "experimental_live_file_sync" }))
          ?.value === "enabled",
    };
  },

  /**
   * Get user configured Community Hub Settings
   * Connection key is used to authenticate with the Community Hub API
   * for your account.
   * @returns {Promise<{connectionKey: string}>}
   */
  hubSettings: async function () {
    try {
      const hubKey = await this.get({ label: "hub_api_key" });
      return { connectionKey: hubKey?.value || null };
    } catch (error) {
      console.error(error.message);
      return { connectionKey: null };
    }
  },
};

function mergeConnections(existingConnections = [], updates = []) {
  let updatedConnections = [...existingConnections];
  const existingDbIds = existingConnections.map((conn) => conn.database_id);

  // First remove all 'action:remove' candidates from existing connections.
  const toRemove = updates
    .filter((conn) => conn.action === "remove")
    .map((conn) => conn.database_id);
  updatedConnections = updatedConnections.filter(
    (conn) => !toRemove.includes(conn.database_id)
  );

  // Next add all 'action:add' candidates into the updatedConnections; We DO NOT validate the connection strings.
  // but we do validate their database_id is unique.
  updates
    .filter((conn) => conn.action === "add")
    .forEach((update) => {
      if (!update.connectionString) return; // invalid connection string

      // Remap name to be unique to entire set.
      if (existingDbIds.includes(update.database_id)) {
        update.database_id = slugify(
          `${update.database_id}-${v4().slice(0, 4)}`
        );
      } else {
        update.database_id = slugify(update.database_id);
      }

      updatedConnections.push({
        engine: update.engine,
        database_id: update.database_id,
        connectionString: update.connectionString,
      });
    });

  return updatedConnections;
}

module.exports.SystemSettings = SystemSettings;
