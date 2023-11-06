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
  ],
  currentSettings: async function () {
    const llmProvider = process.env.LLM_PROVIDER || "openai";
    const vectorDB = process.env.VECTOR_DB || "pinecone";
    return {
      CanDebug: !!!process.env.NO_DEBUG,
      RequiresAuth: !!process.env.AUTH_TOKEN,
      AuthToken: !!process.env.AUTH_TOKEN,
      JWTSecret: !!process.env.JWT_SECRET,
      StorageDir: process.env.STORAGE_DIR,
      MultiUserMode: await this.isMultiUserMode(),
      VectorDB: vectorDB,
      EmbeddingEngine: process.env.EMBEDDING_ENGINE,
      ...(vectorDB === "pinecone"
        ? {
            PineConeEnvironment: process.env.PINECONE_ENVIRONMENT,
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
          return prisma.system_settings.upsert({
            where: { label: key },
            update: {
              value: updates[key] === null ? null : String(updates[key]),
            },
            create: {
              label: key,
              value: updates[key] === null ? null : String(updates[key]),
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
};

module.exports.SystemSettings = SystemSettings;
