const prisma = require("../utils/prisma");
const { SystemSettings } = require("./systemSettings");
const { ROLES } = require("../utils/middleware/multiUserProtected");

const BrowserExtensionApiKey = {
  /**
   * Creates a new secret for a browser extension API key.
   * @returns {string} brx-*** API key to use with extension
   */
  makeSecret: () => {
    const uuidAPIKey = require("uuid-apikey");
    return `brx-${uuidAPIKey.create().apiKey}`;
  },

  /**
   * Creates a new api key for the browser Extension
   * @param {number|null} userId - User id to associate creation of key with.
   * @returns {Promise<{apiKey: import("@prisma/client").browser_extension_api_keys|null, error:string|null}>}
   */
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

  /**
   * Validated existing API key
   * @param {string} key
   * @returns {Promise<{apiKey: import("@prisma/client").browser_extension_api_keys|boolean}>}
   */
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

  /**
   * Fetches browser api key by params.
   * @param {object} clause - Prisma props for search
   * @returns {Promise<{apiKey: import("@prisma/client").browser_extension_api_keys|boolean}>}
   */
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

  /**
   * Deletes browser api key by db id.
   * @param {number} id - database id of browser key
   * @returns {Promise<{success: boolean, error:string|null}>}
   */
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

  /**
   * Gets browser keys by params
   * @param {object} clause
   * @param {number|null} limit
   * @param {object|null} orderBy
   * @returns {Promise<import("@prisma/client").browser_extension_api_keys[]>}
   */
  where: async function (clause = {}, limit = null, orderBy = null) {
    try {
      const apiKeys = await prisma.browser_extension_api_keys.findMany({
        where: clause,
        ...(limit !== null ? { take: limit } : {}),
        ...(orderBy !== null ? { orderBy } : {}),
        include: { user: true },
      });
      return apiKeys;
    } catch (error) {
      console.error("FAILED TO GET BROWSER EXTENSION API KEYS.", error.message);
      return [];
    }
  },

  /**
   * Get browser API keys for user
   * @param {import("@prisma/client").users} user
   * @param {object} clause
   * @param {number|null} limit
   * @param {object|null} orderBy
   * @returns {Promise<import("@prisma/client").browser_extension_api_keys[]>}
   */
  whereWithUser: async function (
    user,
    clause = {},
    limit = null,
    orderBy = null
  ) {
    // Admin can view and use any keys
    if ([ROLES.admin].includes(user.role))
      return await this.where(clause, limit, orderBy);

    try {
      const apiKeys = await prisma.browser_extension_api_keys.findMany({
        where: {
          ...clause,
          user_id: user.id,
        },
        include: { user: true },
        ...(limit !== null ? { take: limit } : {}),
        ...(orderBy !== null ? { orderBy } : {}),
      });
      return apiKeys;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  /**
   * Updates owner of all DB ids to new admin.
   * @param {number} userId
   * @returns {Promise<void>}
   */
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
