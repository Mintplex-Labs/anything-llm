const { Prisma } = require("@prisma/client");
const prisma = require("../utils/prisma");
const { EncryptionManager } = require("../utils/EncryptionManager");

const ENCRYPTED_PREFIX = "enc:";

function encryptApiKey(apiKey) {
  if (!apiKey) return null;
  const encrypted = new EncryptionManager().encrypt(apiKey);
  return encrypted ? `${ENCRYPTED_PREFIX}${encrypted}` : null;
}

function decryptApiKey(apiKey) {
  if (!apiKey || !apiKey.startsWith(ENCRYPTED_PREFIX)) return apiKey || null;
  return new EncryptionManager().decrypt(apiKey.slice(ENCRYPTED_PREFIX.length));
}

const LocalAiConnection = {
  validations: {
    name(value) {
      if (!value || typeof value !== "string") return null;
      return value.trim().slice(0, 255) || null;
    },
    base_url(value) {
      if (!value || typeof value !== "string") return null;
      try {
        const url = new URL(value.trim());
        if (!["http:", "https:"].includes(url.protocol)) return null;
        return url.toString().replace(/\/$/, "");
      } catch {
        return null;
      }
    },
    api_key(value) {
      if (value === null || value === undefined || value === "") return null;
      if (typeof value !== "string") return null;
      return value;
    },
    model(value) {
      if (!value || typeof value !== "string") return null;
      return value.trim() || null;
    },
    token_limit(value) {
      const limit = Number(value);
      if (!Number.isInteger(limit) || limit < 1) return null;
      return limit;
    },
  },

  summary(connection) {
    if (!connection) return null;
    const { api_key, ...safe } = connection;
    return { ...safe, hasApiKey: Boolean(api_key) };
  },

  hydrate(connection) {
    if (!connection) return null;
    return { ...connection, api_key: decryptApiKey(connection.api_key) };
  },

  validate(data = {}, { partial = false } = {}) {
    const result = {};
    const required = ["name", "base_url", "model", "token_limit"];
    for (const field of [...required, "api_key"]) {
      if (partial && data[field] === undefined) continue;
      const value = this.validations[field](data[field]);
      if (required.includes(field) && value === null)
        return { data: null, error: `Invalid ${field}.` };
      result[field] = value;
    }
    return { data: result, error: null };
  },

  get: async function (clause = {}) {
    try {
      const connection = await prisma.local_ai_connections.findFirst({
        where: clause,
      });
      return this.hydrate(connection);
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },

  getAll: async function () {
    try {
      const connections = await prisma.local_ai_connections.findMany({
        orderBy: { name: "asc" },
      });
      return connections.map(this.summary);
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  create: async function (data = {}, creatorId = null) {
    const validated = this.validate(data);
    if (validated.error) return { connection: null, error: validated.error };
    try {
      const connection = await prisma.local_ai_connections.create({
        data: {
          ...validated.data,
          api_key: encryptApiKey(validated.data.api_key),
          created_by: creatorId ? Number(creatorId) : null,
        },
      });
      return { connection: this.summary(connection), error: null };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      )
        return { connection: null, error: "Connection name already exists." };
      console.error(error.message);
      return { connection: null, error: error.message };
    }
  },

  update: async function (id, data = {}) {
    const validated = this.validate(data, { partial: true });
    if (validated.error) return { connection: null, error: validated.error };
    if (Object.keys(validated.data).length === 0)
      return { connection: null, error: "No valid fields to update." };

    try {
      const connection = await prisma.local_ai_connections.update({
        where: { id: Number(id) },
        data: {
          ...validated.data,
          ...(validated.data.api_key !== undefined
            ? { api_key: encryptApiKey(validated.data.api_key) }
            : {}),
          lastUpdatedAt: new Date(),
        },
      });
      return { connection: this.summary(connection), error: null };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      )
        return { connection: null, error: "Connection name already exists." };
      console.error(error.message);
      return { connection: null, error: error.message };
    }
  },

  usageCount: async function (id) {
    const connectionId = Number(id);
    const [workspaces, routers, rules] = await Promise.all([
      prisma.workspaces.count({ where: { chatConnectionId: connectionId } }),
      prisma.model_routers.count({
        where: { fallback_connection_id: connectionId },
      }),
      prisma.model_router_rules.count({
        where: { route_connection_id: connectionId },
      }),
    ]);
    return workspaces + routers + rules;
  },

  delete: async function (id) {
    try {
      if ((await this.usageCount(id)) > 0)
        return {
          success: false,
          error: "Connection is in use by a workspace or model router.",
        };
      await prisma.local_ai_connections.delete({ where: { id: Number(id) } });
      return { success: true, error: null };
    } catch (error) {
      console.error(error.message);
      return { success: false, error: error.message };
    }
  },
};

module.exports = { LocalAiConnection };
