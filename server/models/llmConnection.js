const prisma = require("../utils/prisma");
const { LLMConfigEncryption } = require("../utils/LLMConfigEncryption");

const LLMConnection = {
  tablename: "llm_connections",
  writable: ["name", "provider", "config", "isDefault", "isActive"],

  /**
   * Create a new LLM connection
   * @param {Object} params
   * @param {string} params.name - Unique name for the connection
   * @param {string} params.provider - Provider type (e.g., "litellm", "ollama")
   * @param {Object} params.config - Provider-specific configuration
   * @param {boolean} params.isDefault - Whether this is the default connection for this provider
   * @returns {Promise<{connection: Object|null, error: string|null}>}
   */
  create: async function ({ name, provider, config, isDefault = false }) {
    try {
      // Validate required fields
      if (!name || !provider || !config) {
        throw new Error("Name, provider, and config are required");
      }

      // Encrypt sensitive fields in config
      const encryptionManager = new LLMConfigEncryption();
      const encryptedConfig = encryptionManager.encryptConfig(provider, config);

      // If setting as default, unset other defaults for this provider
      if (isDefault) {
        await prisma.llm_connections.updateMany({
          where: { provider, isDefault: true },
          data: { isDefault: false },
        });
      }

      const connection = await prisma.llm_connections.create({
        data: {
          name,
          provider,
          config: JSON.stringify(encryptedConfig),
          isDefault,
          isActive: true,
        },
      });

      // Return with decrypted config for immediate use
      const decryptedConfig = encryptionManager.decryptConfig(
        provider,
        JSON.parse(connection.config)
      );

      return {
        connection: {
          ...connection,
          config: decryptedConfig,
        },
        error: null,
      };
    } catch (error) {
      console.error("FAILED TO CREATE LLM CONNECTION.", error.message);
      return { connection: null, error: error.message };
    }
  },

  /**
   * Get a single LLM connection by ID
   * @param {number} id - Connection ID
   * @returns {Promise<Object|null>} Connection with decrypted config
   */
  get: async function (id) {
    try {
      const connection = await prisma.llm_connections.findUnique({
        where: { id: Number(id) },
      });

      if (!connection) return null;

      // Decrypt sensitive fields
      const encryptionManager = new LLMConfigEncryption();
      const decryptedConfig = encryptionManager.decryptConfig(
        connection.provider,
        JSON.parse(connection.config)
      );

      return {
        ...connection,
        config: decryptedConfig,
      };
    } catch (error) {
      console.error("FAILED TO GET LLM CONNECTION.", error.message);
      return null;
    }
  },

  /**
   * Get all connections matching a clause
   * @param {Object} clause - Prisma where clause
   * @param {number} limit - Optional limit
   * @param {Object} orderBy - Optional orderBy clause
   * @returns {Promise<Array>} Array of connections with decrypted configs
   */
  where: async function (clause = {}, limit = null, orderBy = null) {
    try {
      const query = {
        where: clause,
        orderBy: orderBy || { createdAt: "desc" },
      };

      // Only include take if limit is provided (Prisma doesn't accept null)
      if (limit !== null) {
        query.take = limit;
      }

      const connections = await prisma.llm_connections.findMany(query);

      // Decrypt all connections
      const encryptionManager = new LLMConfigEncryption();
      return connections.map((conn) => ({
        ...conn,
        config: encryptionManager.decryptConfig(
          conn.provider,
          JSON.parse(conn.config)
        ),
      }));
    } catch (error) {
      console.error("FAILED TO GET LLM CONNECTIONS.", error.message);
      return [];
    }
  },

  /**
   * Get all connections for a specific provider
   * @param {string} provider - Provider type
   * @returns {Promise<Array>} Array of connections
   */
  getByProvider: async function (provider) {
    return await this.where({ provider, isActive: true });
  },

  /**
   * Get the default connection for a provider
   * @param {string} provider - Provider type
   * @returns {Promise<Object|null>} Default connection or null
   */
  getDefault: async function (provider) {
    try {
      const connection = await prisma.llm_connections.findFirst({
        where: { provider, isDefault: true, isActive: true },
      });

      if (!connection) return null;

      const encryptionManager = new LLMConfigEncryption();
      return {
        ...connection,
        config: encryptionManager.decryptConfig(
          connection.provider,
          JSON.parse(connection.config)
        ),
      };
    } catch (error) {
      console.error("FAILED TO GET DEFAULT LLM CONNECTION.", error.message);
      return null;
    }
  },

  /**
   * Update an existing connection
   * @param {number} id - Connection ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<{connection: Object|null, error: string|null}>}
   */
  update: async function (id, updates = {}) {
    try {
      // Filter to only writable fields
      const data = {};
      for (const key of this.writable) {
        if (updates.hasOwnProperty(key)) {
          data[key] = updates[key];
        }
      }

      // If updating config, encrypt it
      if (data.config) {
        const connection = await prisma.llm_connections.findUnique({
          where: { id: Number(id) },
        });
        if (!connection) {
          throw new Error("Connection not found");
        }

        const encryptionManager = new LLMConfigEncryption();

        // Get existing decrypted config
        const existingConfig = encryptionManager.decryptConfig(
          connection.provider,
          JSON.parse(connection.config)
        );

        // Merge with updates, preserving encrypted values where redacted placeholder is used
        const mergedConfig = { ...data.config };
        for (const [key, value] of Object.entries(mergedConfig)) {
          if (value === "***REDACTED***" && existingConfig[key]) {
            // User didn't change this field - preserve original value
            mergedConfig[key] = existingConfig[key];
          }
        }

        const encryptedConfig = encryptionManager.encryptConfig(
          connection.provider,
          mergedConfig
        );
        data.config = JSON.stringify(encryptedConfig);
      }

      // If setting as default, unset other defaults
      if (data.isDefault === true) {
        const connection = await prisma.llm_connections.findUnique({
          where: { id: Number(id) },
        });
        if (connection) {
          await prisma.llm_connections.updateMany({
            where: {
              provider: connection.provider,
              isDefault: true,
              id: { not: Number(id) },
            },
            data: { isDefault: false },
          });
        }
      }

      data.lastUpdatedAt = new Date();

      const updated = await prisma.llm_connections.update({
        where: { id: Number(id) },
        data,
      });

      // Return with decrypted config
      const encryptionManager = new LLMConfigEncryption();
      return {
        connection: {
          ...updated,
          config: encryptionManager.decryptConfig(
            updated.provider,
            JSON.parse(updated.config)
          ),
        },
        error: null,
      };
    } catch (error) {
      console.error("FAILED TO UPDATE LLM CONNECTION.", error.message);
      return { connection: null, error: error.message };
    }
  },

  /**
   * Soft delete a connection (set isActive = false)
   * @param {number} id - Connection ID
   * @returns {Promise<{success: boolean, error: string|null}>}
   */
  delete: async function (id) {
    try {
      // Check if connection is in use by workspaces
      const workspacesUsingChat = await prisma.workspaces.count({
        where: { chatConnectionId: Number(id) },
      });
      const workspacesUsingAgent = await prisma.workspaces.count({
        where: { agentConnectionId: Number(id) },
      });

      if (workspacesUsingChat > 0 || workspacesUsingAgent > 0) {
        return {
          success: false,
          error: `Connection is in use by ${
            workspacesUsingChat + workspacesUsingAgent
          } workspace(s)`,
        };
      }

      await prisma.llm_connections.update({
        where: { id: Number(id) },
        data: { isActive: false, lastUpdatedAt: new Date() },
      });

      return { success: true, error: null };
    } catch (error) {
      console.error("FAILED TO DELETE LLM CONNECTION.", error.message);
      return { success: false, error: error.message };
    }
  },

  /**
   * Permanently delete a connection (admin only)
   * @param {number} id - Connection ID
   * @returns {Promise<{success: boolean, error: string|null}>}
   */
  hardDelete: async function (id) {
    try {
      // Check if connection is in use
      const workspacesUsingChat = await prisma.workspaces.count({
        where: { chatConnectionId: Number(id) },
      });
      const workspacesUsingAgent = await prisma.workspaces.count({
        where: { agentConnectionId: Number(id) },
      });

      if (workspacesUsingChat > 0 || workspacesUsingAgent > 0) {
        return {
          success: false,
          error: `Connection is in use by ${
            workspacesUsingChat + workspacesUsingAgent
          } workspace(s)`,
        };
      }

      await prisma.llm_connections.delete({
        where: { id: Number(id) },
      });

      return { success: true, error: null };
    } catch (error) {
      console.error("FAILED TO HARD DELETE LLM CONNECTION.", error.message);
      return { success: false, error: error.message };
    }
  },

  /**
   * Set a connection as the default for its provider
   * @param {number} id - Connection ID
   * @returns {Promise<{success: boolean, error: string|null}>}
   */
  setAsDefault: async function (id) {
    try {
      const connection = await prisma.llm_connections.findUnique({
        where: { id: Number(id) },
      });

      if (!connection) {
        return { success: false, error: "Connection not found" };
      }

      // Unset other defaults for this provider
      await prisma.llm_connections.updateMany({
        where: {
          provider: connection.provider,
          isDefault: true,
          id: { not: Number(id) },
        },
        data: { isDefault: false },
      });

      // Set this as default
      await prisma.llm_connections.update({
        where: { id: Number(id) },
        data: { isDefault: true, lastUpdatedAt: new Date() },
      });

      return { success: true, error: null };
    } catch (error) {
      console.error("FAILED TO SET DEFAULT LLM CONNECTION.", error.message);
      return { success: false, error: error.message };
    }
  },

  /**
   * Count connections matching a clause
   * @param {Object} clause - Prisma where clause
   * @returns {Promise<number>}
   */
  count: async function (clause = {}) {
    try {
      return await prisma.llm_connections.count({ where: clause });
    } catch (error) {
      console.error("FAILED TO COUNT LLM CONNECTIONS.", error.message);
      return 0;
    }
  },
};

module.exports = { LLMConnection };
