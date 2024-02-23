process.env.NODE_ENV === "development"
  ? require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` })
  : require("dotenv").config();

const prisma = require("../utils/prisma");

const SystemSettings = {
  supportedFields: [
    "multi_user_mode",
    "users_can_delete_workspaces",
    "limit_user_messages",
    "message_limit",
    "logo_filename",
    "telemetry_id",
    "footer_data",
    "support_email",
  ],
  validations: {
    footer_data: (updates) => {
      try {
        const array = JSON.parse(updates);
        return JSON.stringify(array.slice(0, 3)); // max of 3 items in footer.
      } catch (e) {
        console.error(`Failed to run validation function on footer_data`);
        return JSON.stringify([]);
      }
    },
  },
  currentSettings: async function () {
    const llmProvider = process.env.LLM_PROVIDER;
    const vectorDB = process.env.VECTOR_DB;
    return {
      RequiresAuth: !!process.env.AUTH_TOKEN,
      AuthToken: !!process.env.AUTH_TOKEN,
      JWTSecret: !!process.env.JWT_SECRET,
      StorageDir: process.env.STORAGE_DIR,
      MultiUserMode: await this.isMultiUserMode(),
      VectorDB: vectorDB,
      HasExistingEmbeddings: await this.hasEmbeddings(),
      EmbeddingEngine: process.env.EMBEDDING_ENGINE,
      EmbeddingBasePath: process.env.EMBEDDING_BASE_PATH,
      EmbeddingModelPref: process.env.EMBEDDING_MODEL_PREF,
      EmbeddingModelMaxChunkLength:
        process.env.EMBEDDING_MODEL_MAX_CHUNK_LENGTH,
      LocalAiApiKey: !!process.env.LOCAL_AI_API_KEY,
      ...(vectorDB === "pinecone"
        ? {
            PineConeKey: !!process.env.PINECONE_API_KEY,
            PineConeIndex: process.env.PINECONE_INDEX,
          }
        : {}),
      ...(vectorDB === "chroma"
        ? {
            ChromaEndpoint: process.env.CHROMA_ENDPOINT,
            ChromaApiHeader: process.env.CHROMA_API_HEADER,
            ChromaApiKey: !!process.env.CHROMA_API_KEY,
          }
        : {}),
      ...(vectorDB === "weaviate"
        ? {
            WeaviateEndpoint: process.env.WEAVIATE_ENDPOINT,
            WeaviateApiKey: process.env.WEAVIATE_API_KEY,
          }
        : {}),
      ...(vectorDB === "qdrant"
        ? {
            QdrantEndpoint: process.env.QDRANT_ENDPOINT,
            QdrantApiKey: process.env.QDRANT_API_KEY,
          }
        : {}),
      ...(vectorDB === "milvus"
        ? {
            MilvusAddress: process.env.MILVUS_ADDRESS,
            MilvusUsername: process.env.MILVUS_USERNAME,
            MilvusPassword: !!process.env.MILVUS_PASSWORD,
          }
        : {}),
      ...(vectorDB === "zilliz"
        ? {
            ZillizEndpoint: process.env.ZILLIZ_ENDPOINT,
            ZillizApiToken: process.env.ZILLIZ_API_TOKEN,
          }
        : {}),
      ...(vectorDB === "astra"
        ? {
            AstraDBApplicationToken: process?.env?.ASTRA_DB_APPLICATION_TOKEN,
            AstraDBEndpoint: process?.env?.ASTRA_DB_ENDPOINT,
          }
        : {}),
      LLMProvider: llmProvider,
      ...(llmProvider === "openai"
        ? {
            OpenAiKey: !!process.env.OPEN_AI_KEY,
            OpenAiModelPref: process.env.OPEN_MODEL_PREF || "gpt-3.5-turbo",
          }
        : {}),

      ...(llmProvider === "azure"
        ? {
            AzureOpenAiEndpoint: process.env.AZURE_OPENAI_ENDPOINT,
            AzureOpenAiKey: !!process.env.AZURE_OPENAI_KEY,
            AzureOpenAiModelPref: process.env.OPEN_MODEL_PREF,
            AzureOpenAiEmbeddingModelPref: process.env.EMBEDDING_MODEL_PREF,
            AzureOpenAiTokenLimit: process.env.AZURE_OPENAI_TOKEN_LIMIT || 4096,
          }
        : {}),

      ...(llmProvider === "anthropic"
        ? {
            AnthropicApiKey: !!process.env.ANTHROPIC_API_KEY,
            AnthropicModelPref: process.env.ANTHROPIC_MODEL_PREF || "claude-2",

            // For embedding credentials when Anthropic is selected.
            OpenAiKey: !!process.env.OPEN_AI_KEY,
            AzureOpenAiEndpoint: process.env.AZURE_OPENAI_ENDPOINT,
            AzureOpenAiKey: !!process.env.AZURE_OPENAI_KEY,
            AzureOpenAiEmbeddingModelPref: process.env.EMBEDDING_MODEL_PREF,
          }
        : {}),

      ...(llmProvider === "gemini"
        ? {
            GeminiLLMApiKey: !!process.env.GEMINI_API_KEY,
            GeminiLLMModelPref:
              process.env.GEMINI_LLM_MODEL_PREF || "gemini-pro",

            // For embedding credentials when Gemini is selected.
            OpenAiKey: !!process.env.OPEN_AI_KEY,
            AzureOpenAiEndpoint: process.env.AZURE_OPENAI_ENDPOINT,
            AzureOpenAiKey: !!process.env.AZURE_OPENAI_KEY,
            AzureOpenAiEmbeddingModelPref: process.env.EMBEDDING_MODEL_PREF,
          }
        : {}),

      ...(llmProvider === "lmstudio"
        ? {
            LMStudioBasePath: process.env.LMSTUDIO_BASE_PATH,
            LMStudioTokenLimit: process.env.LMSTUDIO_MODEL_TOKEN_LIMIT,

            // For embedding credentials when lmstudio is selected.
            OpenAiKey: !!process.env.OPEN_AI_KEY,
            AzureOpenAiEndpoint: process.env.AZURE_OPENAI_ENDPOINT,
            AzureOpenAiKey: !!process.env.AZURE_OPENAI_KEY,
            AzureOpenAiEmbeddingModelPref: process.env.EMBEDDING_MODEL_PREF,
          }
        : {}),
      ...(llmProvider === "localai"
        ? {
            LocalAiBasePath: process.env.LOCAL_AI_BASE_PATH,
            LocalAiModelPref: process.env.LOCAL_AI_MODEL_PREF,
            LocalAiTokenLimit: process.env.LOCAL_AI_MODEL_TOKEN_LIMIT,

            // For embedding credentials when localai is selected.
            OpenAiKey: !!process.env.OPEN_AI_KEY,
            AzureOpenAiEndpoint: process.env.AZURE_OPENAI_ENDPOINT,
            AzureOpenAiKey: !!process.env.AZURE_OPENAI_KEY,
            AzureOpenAiEmbeddingModelPref: process.env.EMBEDDING_MODEL_PREF,
          }
        : {}),

      ...(llmProvider === "ollama"
        ? {
            OllamaLLMBasePath: process.env.OLLAMA_BASE_PATH,
            OllamaLLMModelPref: process.env.OLLAMA_MODEL_PREF,
            OllamaLLMTokenLimit: process.env.OLLAMA_MODEL_TOKEN_LIMIT,

            // For embedding credentials when ollama is selected.
            OpenAiKey: !!process.env.OPEN_AI_KEY,
            AzureOpenAiEndpoint: process.env.AZURE_OPENAI_ENDPOINT,
            AzureOpenAiKey: !!process.env.AZURE_OPENAI_KEY,
            AzureOpenAiEmbeddingModelPref: process.env.EMBEDDING_MODEL_PREF,
          }
        : {}),
      ...(llmProvider === "togetherai"
        ? {
            TogetherAiApiKey: !!process.env.TOGETHER_AI_API_KEY,
            TogetherAiModelPref: process.env.TOGETHER_AI_MODEL_PREF,

            // For embedding credentials when ollama is selected.
            OpenAiKey: !!process.env.OPEN_AI_KEY,
            AzureOpenAiEndpoint: process.env.AZURE_OPENAI_ENDPOINT,
            AzureOpenAiKey: !!process.env.AZURE_OPENAI_KEY,
            AzureOpenAiEmbeddingModelPref: process.env.EMBEDDING_MODEL_PREF,
          }
        : {}),
      ...(llmProvider === "perplexity"
        ? {
            PerplexityApiKey: !!process.env.PERPLEXITY_API_KEY,
            PerplexityModelPref: process.env.PERPLEXITY_MODEL_PREF,

            // For embedding credentials when ollama is selected.
            OpenAiKey: !!process.env.OPEN_AI_KEY,
            AzureOpenAiEndpoint: process.env.AZURE_OPENAI_ENDPOINT,
            AzureOpenAiKey: !!process.env.AZURE_OPENAI_KEY,
            AzureOpenAiEmbeddingModelPref: process.env.EMBEDDING_MODEL_PREF,
          }
        : {}),
      ...(llmProvider === "openrouter"
        ? {
            OpenRouterApiKey: !!process.env.OPENROUTER_API_KEY,
            OpenRouterModelPref: process.env.OPENROUTER_MODEL_PREF,

            // For embedding credentials when ollama is selected.
            OpenAiKey: !!process.env.OPEN_AI_KEY,
            AzureOpenAiEndpoint: process.env.AZURE_OPENAI_ENDPOINT,
            AzureOpenAiKey: !!process.env.AZURE_OPENAI_KEY,
            AzureOpenAiEmbeddingModelPref: process.env.EMBEDDING_MODEL_PREF,
          }
        : {}),
      ...(llmProvider === "mistral"
        ? {
            MistralApiKey: !!process.env.MISTRAL_API_KEY,
            MistralModelPref: process.env.MISTRAL_MODEL_PREF,

            // For embedding credentials when mistral is selected.
            OpenAiKey: !!process.env.OPEN_AI_KEY,
            AzureOpenAiEndpoint: process.env.AZURE_OPENAI_ENDPOINT,
            AzureOpenAiKey: !!process.env.AZURE_OPENAI_KEY,
            AzureOpenAiEmbeddingModelPref: process.env.EMBEDDING_MODEL_PREF,
          }
        : {}),
      ...(llmProvider === "native"
        ? {
            NativeLLMModelPref: process.env.NATIVE_LLM_MODEL_PREF,
            NativeLLMTokenLimit: process.env.NATIVE_LLM_MODEL_TOKEN_LIMIT,

            // For embedding credentials when ollama is selected.
            OpenAiKey: !!process.env.OPEN_AI_KEY,
            AzureOpenAiEndpoint: process.env.AZURE_OPENAI_ENDPOINT,
            AzureOpenAiKey: !!process.env.AZURE_OPENAI_KEY,
            AzureOpenAiEmbeddingModelPref: process.env.EMBEDDING_MODEL_PREF,
          }
        : {}),

      ...(llmProvider === "huggingface"
        ? {
            HuggingFaceLLMEndpoint: process.env.HUGGING_FACE_LLM_ENDPOINT,
            HuggingFaceLLMAccessToken: !!process.env.HUGGING_FACE_LLM_API_KEY,
            HuggingFaceLLMTokenLimit: process.env.HUGGING_FACE_LLM_TOKEN_LIMIT,

            // For embedding credentials when Anthropic is selected.
            OpenAiKey: !!process.env.OPEN_AI_KEY,
            AzureOpenAiEndpoint: process.env.AZURE_OPENAI_ENDPOINT,
            AzureOpenAiKey: !!process.env.AZURE_OPENAI_KEY,
            AzureOpenAiEmbeddingModelPref: process.env.EMBEDDING_MODEL_PREF,
          }
        : {}),
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

  updateSettings: async function (updates = {}) {
    try {
      const updatePromises = Object.keys(updates)
        .filter((key) => this.supportedFields.includes(key))
        .map((key) => {
          const validatedValue = this.validations.hasOwnProperty(key)
            ? this.validations[key](updates[key])
            : updates[key];

          return prisma.system_settings.upsert({
            where: { label: key },
            update: {
              value: validatedValue === null ? null : String(validatedValue),
            },
            create: {
              label: key,
              value: validatedValue === null ? null : String(validatedValue),
            },
          });
        });

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

  canDeleteWorkspaces: async function () {
    try {
      const setting = await this.get({ label: "users_can_delete_workspaces" });
      return setting?.value === "true";
    } catch (error) {
      console.error(error.message);
      return false;
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
};

module.exports.SystemSettings = SystemSettings;
