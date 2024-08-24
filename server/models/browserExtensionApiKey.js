const prisma = require("../utils/prisma");
const uuidAPIKey = require("uuid-apikey");
const { SystemSettings } = require("./systemSettings");

const BrowserExtensionApiKey = {
  makeSecret: () => {
    return `brx-${uuidAPIKey.create().apiKey}`;
  },

  create: async function (userId = null) {
    try {
      const apiKey = await prisma.browser_extension_api_keys.create({
        data: {
          key: this.makeSecret(),
          user_id: userId,
        },
      });
      return { apiKey, error: null };
    } catch (error) {
      console.error("Failed to create browser extension API key", error);
      return { apiKey: null, error: error.message };
    }
  },

  validate: async function (key) {
    if (!key.startsWith("brx-")) return false;
    const apiKey = await prisma.browser_extension_api_keys.findUnique({
      where: { key: key.toString() },
      include: { user: true },
    });
    if (!apiKey) return false;

    const multiUserMode = await SystemSettings.isMultiUserMode();
    if (!multiUserMode) return apiKey; // In single-user mode, all keys are valid

    // In multi-user mode, check if the key is associated with a user
    return apiKey.user_id ? apiKey : false;
  },

  get: async function (clause = {}) {
    try {
      const apiKey = await prisma.browser_extension_api_keys.findFirst({
        where: clause,
      });
      return apiKey;
    } catch (error) {
      console.error("FAILED TO GET BROWSER EXTENSION API KEY.", error.message);
      return null;
    }
  },

  delete: async function (id) {
    try {
      await prisma.browser_extension_api_keys.delete({
        where: { id: parseInt(id) },
      });
      return { success: true, error: null };
    } catch (error) {
      console.error("Failed to delete browser extension API key", error);
      return { success: false, error: error.message };
    }
  },

  where: async function (clause = {}, limit) {
    try {
      const apiKeys = await prisma.browser_extension_api_keys.findMany({
        where: clause,
        take: limit,
        include: { user: true },
      });
      return apiKeys;
    } catch (error) {
      console.error("FAILED TO GET BROWSER EXTENSION API KEYS.", error.message);
      return [];
    }
  },

  migrateApiKeysToMultiUser: async function (userId) {
    try {
      await prisma.browser_extension_api_keys.updateMany({
        where: {
          user_id: null,
        },
        data: {
          user_id: userId,
        },
      });
      console.log("Successfully migrated API keys to multi-user mode");
    } catch (error) {
      console.error("Error migrating API keys to multi-user mode:", error);
    }
  },
};

module.exports = { BrowserExtensionApiKey };
