const prisma = require("../utils/prisma");
const { safeJsonParse } = require("../utils/http");

const ExternalCommunicationConnector = {
  supportedTypes: ["telegram"],

  /**
   * Get a connector by type.
   * @param {'telegram'} type
   * @returns {Promise<{id: number, type: string, config: object, active: boolean}|null>}
   */
  get: async function (type) {
    try {
      const connector =
        await prisma.external_communication_connectors.findUnique({
          where: { type },
        });
      if (!connector) return null;
      return {
        ...connector,
        config: safeJsonParse(connector.config, {}),
      };
    } catch (error) {
      console.error("ExternalCommunicationConnector.get", error.message);
      return null;
    }
  },

  /**
   * Create or update a connector's config and active state.
   * @param {'telegram'} type
   * @param {object} config
   * @param {boolean} active
   * @returns {Promise<{connector: object|null, error: string|null}>}
   */
  upsert: async function (type, config = {}) {
    if (!this.supportedTypes.includes(type))
      return { connector: null, error: `Unsupported connector type: ${type}` };

    try {
      let update = {},
        create = {};

      if (config.hasOwnProperty("active")) {
        delete config.active;
        update.active = Boolean(config.active);
        create.active = Boolean(config.active);
      }

      update = { config: JSON.stringify(config), lastUpdatedAt: new Date() };
      create = { config: JSON.stringify(config), type: String(type) };

      const connector = await prisma.external_communication_connectors.upsert({
        where: { type: String(type) },
        update,
        create,
      });
      return {
        connector: {
          ...connector,
          config: safeJsonParse(connector.config, {}),
        },
        error: null,
      };
    } catch (error) {
      console.error("ExternalCommunicationConnector.upsert", error.message);
      return { connector: null, error: error.message };
    }
  },

  /**
   * Merge partial config updates into an existing connector.
   * @param {'telegram'} type
   * @param {object} configUpdates - Partial config to merge.
   * @returns {Promise<{connector: object|null, error: string|null}>}
   */
  updateConfig: async function (type, configUpdates = {}) {
    const existing = await this.get(type);
    if (!existing)
      return { connector: null, error: `No ${type} connector found` };

    const mergedConfig = { ...existing.config, ...configUpdates };
    return this.upsert(type, mergedConfig, existing.active);
  },

  /**
   * Toggle a connector's active state.
   * @param {'telegram'} type
   * @param {boolean} active
   * @returns {Promise<{success: boolean, error: string|null}>}
   */
  setActive: async function (type, active) {
    try {
      await prisma.external_communication_connectors.update({
        where: { type },
        data: { active, lastUpdatedAt: new Date() },
      });
      return { success: true, error: null };
    } catch (error) {
      console.error("ExternalCommunicationConnector.setActive", error.message);
      return { success: false, error: error.message };
    }
  },

  /**
   * Delete a connector entirely.
   * @param {'telegram'} type
   * @returns {Promise<boolean>}
   */
  delete: async function (type) {
    try {
      await prisma.external_communication_connectors.delete({
        where: { type },
      });
      return true;
    } catch (error) {
      console.error("ExternalCommunicationConnector.delete", error.message);
      return false;
    }
  },

  /**
   * Mask a bot token for safe display: shows first segment and last 4 chars.
   * @param {string} token
   * @returns {string}
   */
  maskToken: function (token) {
    if (!token || token.length < 10) return "****";
    const [id, ...rest] = token.split(":");
    const secret = rest.join(":");
    if (!secret) return "****";
    return `${id}:${"*".repeat(Math.max(secret.length - 4, 4))}${secret.slice(-4)}`;
  },
};

module.exports = { ExternalCommunicationConnector };
