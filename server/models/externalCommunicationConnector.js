const prisma = require("../utils/prisma");
const { safeJsonParse } = require("../utils/http");

// Prisma diagnostics may embed complete credential-bearing input values.
function logConnectorError(operation, type) {
  console.error(
    operation,
    ["telegram", "lark"].includes(type) ? type : "unknown"
  );
}

const ExternalCommunicationConnector = {
  supportedTypes: Object.freeze(["telegram", "lark"]),

  /**
   * Get a connector by type.
   * @param {'telegram'|'lark'} type
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
    } catch {
      logConnectorError("ExternalCommunicationConnector.get", type);
      return null;
    }
  },

  /**
   * Read state for a subsequent save without conflating absence and read failure.
   * Legacy get() intentionally retains its nullable return contract.
   * @param {'telegram'|'lark'} type
   * @returns {Promise<{connector: object|null, error: string|null}>}
   */
  getWithStatus: async function (type) {
    try {
      const connector =
        await prisma.external_communication_connectors.findUnique({
          where: { type },
        });
      if (!connector) return { connector: null, error: null };
      // A malformed stored document must not turn into an empty user list.
      const config = JSON.parse(connector.config);
      if (!config || typeof config !== "object" || Array.isArray(config))
        throw new Error("Invalid connector configuration");
      return { connector: { ...connector, config }, error: null };
    } catch {
      logConnectorError("ExternalCommunicationConnector.getWithStatus", type);
      return {
        connector: null,
        error: "Could not read connector configuration.",
      };
    }
  },

  /**
   * Create or update a connector's config and active state.
   * @param {'telegram'|'lark'} type
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
        update.active = Boolean(config.active);
        create.active = Boolean(config.active);
        delete config.active;
      }

      update = Object.assign(update, {
        config: JSON.stringify(config),
        lastUpdatedAt: new Date(),
      });
      create = Object.assign(create, {
        config: JSON.stringify(config),
        type: String(type),
      });

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
      logConnectorError("ExternalCommunicationConnector.upsert", type);
      return { connector: null, error: error.message };
    }
  },

  /**
   * Merge partial config updates into an existing connector.
   * @param {'telegram'|'lark'} type
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
   * Delete a connector entirely.
   * @param {'telegram'|'lark'} type
   * @returns {Promise<boolean>}
   */
  delete: async function (type) {
    try {
      await prisma.external_communication_connectors.delete({
        where: { type },
      });
      return true;
    } catch {
      logConnectorError("ExternalCommunicationConnector.delete", type);
      return false;
    }
  },
};

module.exports = { ExternalCommunicationConnector };
