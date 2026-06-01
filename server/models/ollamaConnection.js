const { Prisma } = require("@prisma/client");
const prisma = require("../utils/prisma");

const OllamaConnection = {
  writable: [
    "name",
    "basePath",
    "authToken",
    "keepAlive",
    "tokenLimit",
    "modelPref",
  ],

  validations: {
    name: (value) => {
      if (!value || typeof value !== "string") return null;
      return String(value).trim().slice(0, 255);
    },
    basePath: (value) => {
      if (!value || typeof value !== "string") return null;
      return String(value).trim().replace(/\/+$/, "");
    },
    authToken: (value) => {
      if (value === null || value === undefined || value === "") return null;
      if (typeof value !== "string") return null;
      return String(value);
    },
    // Matches global OllamaLLMKeepAliveSeconds: 0 (no cache), 300 (5m),
    // 3600 (1h), or -1 (forever).
    keepAlive: (value) => {
      if (value === null || value === undefined || value === "") return null;
      const num = Number(value);
      if (Number.isNaN(num)) return null;
      if (num !== -1 && num < 0) return null;
      return Math.round(num);
    },
    // Matches global OllamaLLMTokenLimit: a positive integer or null (auto).
    tokenLimit: (value) => {
      if (value === null || value === undefined || value === "") return null;
      const num = Number(value);
      if (Number.isNaN(num) || num <= 0) return null;
      return Math.round(num);
    },
    // Default model for this connection — falls back to the env's
    // OLLAMA_MODEL_PREF when null. Used when a workspace selects this
    // connection without specifying its own chatModel.
    modelPref: (value) => {
      if (value === null || value === undefined || value === "") return null;
      if (typeof value !== "string") return null;
      const trimmed = value.trim();
      return trimmed.length === 0 ? null : trimmed.slice(0, 255);
    },
  },

  _sanitize: function (data = {}) {
    const sanitized = {};
    for (const key of this.writable) {
      if (data[key] === undefined) continue;
      sanitized[key] = this.validations[key](data[key]);
    }
    return sanitized;
  },

  /**
   * @param {Object} data Writable fields from `OllamaConnection.writable`.
   * @returns {Promise<{connection: import("@prisma/client").ollama_connections|null, error: string|null}>}
   */
  create: async function (data = {}) {
    const payload = this._sanitize(data);
    if (!payload.name) return { connection: null, error: "Name is required." };
    if (!payload.basePath)
      return { connection: null, error: "Base path is required." };

    try {
      const connection = await prisma.ollama_connections.create({
        data: payload,
      });
      return { connection, error: null };
    } catch (error) {
      console.error(error.message);
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      )
        return {
          connection: null,
          error: "A connection with that name already exists.",
        };
      return { connection: null, error: error.message };
    }
  },

  /**
   * @param {number} id The id of the connection to update.
   * @param {Object} data Writable fields from `OllamaConnection.writable`.
   * @returns {Promise<{connection: import("@prisma/client").ollama_connections|{id:number}|null, error: string|null}>}
   */
  update: async function (id = null, data = {}) {
    if (!id) throw new Error("No ollama connection id provided for update");
    const payload = this._sanitize(data);
    if (payload.name === null)
      return { connection: null, error: "Name cannot be empty." };
    if (payload.basePath === null)
      return { connection: null, error: "Base path cannot be empty." };
    if (Object.keys(payload).length === 0)
      return { connection: { id }, error: "No valid fields to update." };

    try {
      const connection = await prisma.ollama_connections.update({
        where: { id: Number(id) },
        data: { ...payload, lastUpdatedAt: new Date() },
      });
      return { connection, error: null };
    } catch (error) {
      console.error(error.message);
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      )
        return {
          connection: null,
          error: "A connection with that name already exists.",
        };
      return { connection: null, error: error.message };
    }
  },

  /**
   * Fetch a single connection by an arbitrary `where` clause.
   * @param {import("@prisma/client").Prisma.ollama_connectionsWhereInput} clause
   * @returns {Promise<import("@prisma/client").ollama_connections|null>}
   */
  get: async function (clause = {}) {
    try {
      return (
        (await prisma.ollama_connections.findFirst({ where: clause })) || null
      );
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },

  /**
   * List connections matching `clause`, ordered by name.
   * @param {import("@prisma/client").Prisma.ollama_connectionsWhereInput} clause
   * @param {number|null} limit Optional `take` value forwarded to Prisma.
   * @returns {Promise<import("@prisma/client").ollama_connections[]>}
   */
  where: async function (clause = {}, limit = null) {
    try {
      return await prisma.ollama_connections.findMany({
        where: clause,
        orderBy: { name: "asc" },
        ...(limit !== null ? { take: limit } : {}),
      });
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  /**
   * Delete a connection and null out the FK on any workspace that referenced it.
   * @param {number} id
   * @returns {Promise<boolean>} Whether the delete succeeded.
   */
  delete: async function (id = null) {
    if (!id) return false;
    try {
      await prisma.ollama_connections.delete({ where: { id: Number(id) } });
      // Detach any workspaces that were pointing at this connection
      await prisma.workspaces.updateMany({
        where: { ollamaConnectionId: Number(id) },
        data: { ollamaConnectionId: null },
      });
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  },

  /**
   * Count workspaces currently pointing at the given connection.
   * @param {number} connectionId
   * @returns {Promise<number>}
   */
  workspaceCount: async function (connectionId) {
    try {
      return await prisma.workspaces.count({
        where: { ollamaConnectionId: Number(connectionId) },
      });
    } catch (error) {
      console.error(error.message);
      return 0;
    }
  },
};

module.exports = { OllamaConnection };
