const prisma = require("../utils/prisma");
const uuidAPIKey = require("uuid-apikey");

const BrowserExtensionApiKey = {
  tablename: "browser_extension_api_keys",
  writable: [],

  makeSecret: () => {
    return `brx-${uuidAPIKey.create().apiKey}`;
  },

  create: async function () {
    try {
      const apiKey = await prisma.browser_extension_api_keys.create({
        data: {
          key: this.makeSecret(),
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
      where: { key },
    });
    return !!apiKey;
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

  delete: async function (key) {
    try {
      await prisma.browser_extension_api_keys.delete({
        where: { key },
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
      });
      return apiKeys;
    } catch (error) {
      console.error("FAILED TO GET BROWSER EXTENSION API KEYS.", error.message);
      return [];
    }
  },
};

module.exports = { BrowserExtensionApiKey };
