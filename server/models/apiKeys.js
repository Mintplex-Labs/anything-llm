const prisma = require("../utils/prisma");
const { safeJsonParse } = require("../utils/http");

/**
 * @typedef {Object} ApiKeyRecord
 * @property {number} id
 * @property {string|null} name
 * @property {string|null} secret
 * @property {string|null} scope - JSON array of scopes, eg: `["chat","documents"]`. Null is full access.
 * @property {string|null} scopeConfig - JSON, eg: `{"workspaceIds":[1,2]}`. Null is every workspace.
 * @property {number|null} createdBy
 * @property {Date} createdAt
 * @property {Date} lastUpdatedAt
 */

const ApiKey = {
  tablename: "api_keys",
  writable: ["name"],

  /**
   * `full` is never stored. A key with null `scope` is a full access key.
   * `users` can create and promote admins, so it is effectively full access.
   */
  scopes: {
    full: "full",
    chat: "chat",
    workspace: "workspace",
    documents: "documents",
    openai: "openai",
    embeds: "embeds",
    mcp: "mcp",
    users: "users",
    sso: "sso",
  },

  validations: {
    scopes: (value) => {
      if (value === null || value === undefined) return null;
      if (!Array.isArray(value) || value.length === 0)
        throw new Error("scopes must be a list of scopes.");
      const scopes = [...new Set(value)];
      const valid = Object.values(ApiKey.scopes);
      if (scopes.some((scope) => !valid.includes(scope)))
        throw new Error(`Invalid scope. Must be any of ${valid.join(", ")}.`);
      return scopes.includes(ApiKey.scopes.full) ? null : scopes;
    },
    workspaceIds: (value) => {
      if (value === null || value === undefined) return null;
      if (!Array.isArray(value))
        throw new Error("workspaceIds must be an array.");
      const ids = [...new Set(value.map((id) => Number(id)))];
      if (
        ids.length === 0 ||
        ids.some((id) => !Number.isInteger(id) || id <= 0)
      )
        throw new Error("workspaceIds must be a list of workspace ids.");
      return ids;
    },
  },

  /**
   * @param {ApiKeyRecord} apiKey
   * @returns {string[]} `["full"]` for a full access key. Empty when the stored value is unreadable.
   */
  scopesOf: function (apiKey) {
    if (!apiKey) return [];
    if (apiKey.scope === null || apiKey.scope === undefined)
      return [this.scopes.full];
    const scopes = safeJsonParse(apiKey.scope, []);
    return Array.isArray(scopes) ? scopes : [];
  },

  /**
   * @param {ApiKeyRecord} apiKey
   * @returns {boolean}
   */
  isFullAccess: function (apiKey) {
    return this.scopesOf(apiKey).includes(this.scopes.full);
  },

  /**
   * @param {ApiKeyRecord} apiKey
   * @returns {number[]|null} Null when the key is not limited to specific workspaces
   */
  workspaceIds: function (apiKey) {
    if (this.isFullAccess(apiKey)) return null;
    if (apiKey?.scopeConfig === null || apiKey?.scopeConfig === undefined)
      return null;
    const ids = safeJsonParse(apiKey.scopeConfig, {})?.workspaceIds;
    return Array.isArray(ids) ? ids.map((id) => Number(id)) : [];
  },

  /**
   * @param {ApiKeyRecord} apiKey
   * @param {number} workspaceId
   * @returns {boolean}
   */
  canAccessWorkspace: function (apiKey, workspaceId) {
    const ids = this.workspaceIds(apiKey);
    return ids === null || ids.includes(Number(workspaceId));
  },

  /**
   * @param {ApiKeyRecord} apiKey
   * @param {number[]} workspaceIds
   * @returns {boolean}
   */
  canAccessWorkspaces: function (apiKey, workspaceIds = []) {
    return [workspaceIds]
      .flat()
      .every((id) => this.canAccessWorkspace(apiKey, id));
  },

  /**
   * @param {ApiKeyRecord} apiKey
   * @param {string} [field] - Column holding the workspace id on the queried table
   * @returns {Object} Prisma where clause for the workspaces the key can access
   */
  workspaceClause: function (apiKey, field = "id") {
    const ids = this.workspaceIds(apiKey);
    return ids === null ? {} : { [field]: { in: ids } };
  },

  /**
   * @param {string[]|null} scopes
   * @param {number[]|null} workspaceIds
   * @returns {Promise<{scope: string|null, scopeConfig: string|null}>}
   */
  scopeData: async function (scopes = null, workspaceIds = null) {
    const validScopes = this.validations.scopes(scopes);
    if (validScopes === null) return { scope: null, scopeConfig: null };

    const ids = this.validations.workspaceIds(workspaceIds);
    if (ids === null)
      return { scope: JSON.stringify(validScopes), scopeConfig: null };

    const found = await prisma.workspaces.count({ where: { id: { in: ids } } });
    if (found !== ids.length)
      throw new Error("One or more selected workspaces do not exist.");
    return {
      scope: JSON.stringify(validScopes),
      scopeConfig: JSON.stringify({ workspaceIds: ids }),
    };
  },

  makeSecret: () => {
    const uuidAPIKey = require("uuid-apikey");
    return uuidAPIKey.create().apiKey;
  },

  /**
   * @param {number|null} createdByUserId
   * @param {string|null} name
   * @param {Object} [options]
   * @param {string[]|null} [options.scopes] - Null for full access
   * @param {number[]|null} [options.workspaceIds] - Null for every workspace
   * @returns {Promise<{apiKey: ApiKeyRecord|null, error: string|null}>}
   */
  create: async function (
    createdByUserId = null,
    name = null,
    { scopes = null, workspaceIds = null } = {}
  ) {
    try {
      const normalizedName =
        typeof name === "string" && name.trim().length > 0 ? name.trim() : null;
      const apiKey = await prisma.api_keys.create({
        data: {
          name: normalizedName,
          secret: this.makeSecret(),
          createdBy: createdByUserId,
          ...(await this.scopeData(scopes, workspaceIds)),
        },
      });

      return { apiKey, error: null };
    } catch (error) {
      console.error("FAILED TO CREATE API KEY.", error.message);
      return { apiKey: null, error: error.message };
    }
  },

  /**
   * Replaces the scopes and workspace limit of an existing key.
   * @param {number} id
   * @param {Object} [options]
   * @param {string[]|null} [options.scopes] - Null for full access
   * @param {number[]|null} [options.workspaceIds] - Null for every workspace
   * @returns {Promise<{apiKey: ApiKeyRecord|null, error: string|null}>}
   */
  updateScopes: async function (
    id,
    { scopes = null, workspaceIds = null } = {}
  ) {
    try {
      if (!(await this.get({ id: Number(id) })))
        throw new Error("API key not found.");
      const apiKey = await prisma.api_keys.update({
        where: { id: Number(id) },
        data: {
          ...(await this.scopeData(scopes, workspaceIds)),
          lastUpdatedAt: new Date(),
        },
      });
      return { apiKey, error: null };
    } catch (error) {
      return { apiKey: null, error: error.message };
    }
  },

  get: async function (clause = {}) {
    try {
      const apiKey = await prisma.api_keys.findFirst({ where: clause });
      return apiKey;
    } catch (error) {
      console.error("FAILED TO GET API KEY.", error.message);
      return null;
    }
  },

  count: async function (clause = {}) {
    try {
      const count = await prisma.api_keys.count({ where: clause });
      return count;
    } catch (error) {
      console.error("FAILED TO COUNT API KEYS.", error.message);
      return 0;
    }
  },

  delete: async function (clause = {}) {
    try {
      await prisma.api_keys.deleteMany({ where: clause });
      return true;
    } catch (error) {
      console.error("FAILED TO DELETE API KEY.", error.message);
      return false;
    }
  },

  where: async function (clause = {}, limit) {
    try {
      const apiKeys = await prisma.api_keys.findMany({
        where: clause,
        take: limit,
      });
      return apiKeys;
    } catch (error) {
      console.error("FAILED TO GET API KEYS.", error.message);
      return [];
    }
  },

  whereWithUser: async function (clause = {}, limit) {
    try {
      const { User } = require("./user");
      const apiKeys = await this.where(clause, limit);

      for (const apiKey of apiKeys) {
        if (!apiKey.createdBy) continue;
        const user = await User.get({ id: apiKey.createdBy });
        if (!user) continue;

        apiKey.createdBy = {
          id: user.id,
          username: user.username,
          role: user.role,
        };
      }

      return apiKeys;
    } catch (error) {
      console.error("FAILED TO GET API KEYS WITH USER.", error.message);
      return [];
    }
  },
};

module.exports = { ApiKey };
