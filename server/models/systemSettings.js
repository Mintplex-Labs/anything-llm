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
    "server_port",
    "cache_vectors",
    "llm_provider",
    "vector_db",
    "no_debug",
    "auth_token",
    "jwt_secret",
    "storage_dir",
    "pinecone_environment",
    "pinecone_api_key",
    "pinecone_index",
    "chroma_endpoint",
    "chroma_api_header",
    "chroma_api_key",
    "weaviate_endpoint",
    "weaviate_api_key",
    "qdrant_endpoint",
    "qdrant_api_key",
    "open_ai_key",
    "open_model_pref",
    "azure_openai_endpoint",
    "azure_openai_key",
    "azure_openai_model_pref",
    "azure_openai_embedding_model_pref",
  ],

  syncWithEnvVariables: async function() {
    try {
      const existingSettings = await prisma.system_settings.findMany({
        where: {
          label: { in: this.supportedFields },
        },
      });

      const existingSettingsMap = new Map(existingSettings.map(setting => [setting.label, setting.value]));

      const updates = {};
      this.supportedFields.forEach((field) => {
        const envVarName = field.toUpperCase();
        if (process.env[envVarName] !== undefined && !existingSettingsMap.has(field)) {
          updates[field] = process.env[envVarName];
        }
      });

      const updatePromises = Object.keys(updates).map((key) => {
        return prisma.system_settings.upsert({
          where: { label: key },
          update: { value: updates[key] },
          create: { label: key, value: updates[key] },
        });
      });

      if (updatePromises.length > 0) {
        await Promise.all(updatePromises);
        console.log('New environment variables have been synchronized with the database.');
      } else {
        console.log('No new settings to update.');
      }
    } catch (error) {
      console.error('Failed to synchronize environment variables with the database:', error.message);
    }
  },

  currentSettings: async function () {
    // this.syncWithEnvVariables(); // call this on boot to dump all env vars into the database
    const settingsArray = await prisma.system_settings.findMany({
      where: {
        label: { in: this.supportedFields },
      },
    });

    const settings = Object.fromEntries(settingsArray.map((setting) => [setting.label, setting.value]));

    const vectorDB = settings.vector_db || "pinecone";
    const llm_provider = settings.llm_provider || "openai";

    return {
      CanDebug: !!!settings.no_debug,
      RequiresAuth: !!settings.auth_token,
      AuthToken: !!settings.auth_token,
      JWTSecret: !!settings.jwt_secret,
      StorageDir: settings.storage_dir,
      MultiUserMode: await this.isMultiUserMode(),
      vectorDB: vectorDB,
      ...(vectorDB === "pinecone")
        ? {
            PineConeEnvironment: settings.pinecone_environment,
            PineConeKey: !!settings.pinecone_api_key,
            PineConeIndex: settings.pinecone_index,
          }
        : {},
      ...(vectorDB === "chroma")
        ? {
            ChromaEndpoint: settings.chroma_endpoint,
            ChromaApiHeader: settings.chroma_api_header,
            ChromaApiKey: !!settings.chroma_api_key,
          }
        : {},
      ...(vectorDB === "weaviate")
      ? {
        WeviateEndpoint: settings.weaviate_endpoint,
        WeaviateApiKey: settings.weaviate_api_key,
      }
      : {},
      ...(vectorDB === "qdrant")
      ? {
        QdrantEndpoint: settings.qdrant_endpoint,
        QdrantApiKey: settings.qdrant_api_key,
      }
      : {},
      LLMProvider : llm_provider,
      ...(llm_provider === "openai")
        ? {
            OpenAiKey: !!settings.open_ai_key,
            OpenAiModelPref: settings.open_model_pref || "gpt-3.5-turbo",
          }
        : {},
      ...(llm_provider === "azure")
        ? {
            AzureOpenAiEndpoint: settings.azure_openai_endpoint,
            AzureOpenAiKey: !!settings.azure_openai_key,
            AzureOpenAiModelPref: settings.azure_openai_model_pref,
            AzureOpenAiEmbeddingModelPref: settings.azure_openai_embedding_model_pref,
          }
        : {},
    };

  },

  getMultiple: async function(labels) {
    try {
      const settings = await prisma.system_settings.findMany({
        where: {
          label: {
            in: labels,
          },
        },
      });

      return settings.reduce((acc, setting) => {
        acc[setting.label] = setting.value;
        return acc;
      }, {});
    } catch (error) {
      console.error('Failed to retrieve multiple settings:', error.message);
      return {};
    }
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
