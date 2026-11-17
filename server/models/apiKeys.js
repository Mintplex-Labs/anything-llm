const prisma = require("../utils/prisma");
const { safeJsonParse } = require("../utils/http");

/**
 * @typedef {Object} ApiKeyRecord
 * @property {number} id
 * @property {string|null} name
 * @property {string|null} secret
 * @property {string|null} scope
 * @property {string|null} scopeConfig - JSON, eg: `{"workspaceIds":[1,2]}`
 * @property {number|null} createdBy
 * @property {Date} createdAt
 * @property {Date} lastUpdatedAt
 */

const ApiKey = {
  tablename: "api_keys",
  writable: ["name"],

  /** A key with a null scope is treated as `full`. */
  scopes: {
    full: "full",
    workspace: "workspace",
    user: "user",
  },

  validations: {
    scope: (value) => {
      if (value === null || value === undefined) return null;
      if (!Object.values(ApiKey.scopes).includes(value))
        throw new Error(
          `Invalid scope. Must be one of ${Object.values(ApiKey.scopes).join(", ")}.`
        );
      return value;
    },
    workspaceIds: (value) => {
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
   * @returns {boolean}
   */
  isFullAccess: function (apiKey) {
    if (!apiKey) return false;
    return !apiKey.scope || apiKey.scope === this.scopes.full;
  },

  /**
   * @param {ApiKeyRecord} apiKey
   * @returns {number[]}
   */
  workspaceIds: function (apiKey) {
    const ids = safeJsonParse(apiKey?.scopeConfig, {})?.workspaceIds;
    return Array.isArray(ids) ? ids.map((id) => Number(id)) : [];
  },

  /**
   * @param {ApiKeyRecord} apiKey
   * @param {number} workspaceId
   * @returns {boolean}
   */
  canAccessWorkspace: function (apiKey, workspaceId) {
    if (this.isFullAccess(apiKey)) return true;
    if (apiKey.scope !== this.scopes.workspace) return false;
    return this.workspaceIds(apiKey).includes(Number(workspaceId));
  },

  /**
   * @param {ApiKeyRecord} apiKey
   * @param {string} slug
   * @returns {Promise<boolean>}
   */
  canAccessWorkspaceSlug: async function (apiKey, slug) {
    if (this.isFullAccess(apiKey)) return true;
    const workspace = await prisma.workspaces.findFirst({
      where: { slug: String(slug) },
      select: { id: true },
    });
    return !!workspace && this.canAccessWorkspace(apiKey, workspace.id);
  },

  /**
   * @param {ApiKeyRecord} apiKey
   * @returns {Object} Prisma where clause for the workspaces the key can access
   */
  workspaceClause: function (apiKey) {
    if (this.isFullAccess(apiKey)) return {};
    return { id: { in: this.workspaceIds(apiKey) } };
  },

  /**
   * @param {string|null} scope
   * @param {number[]} workspaceIds
   * @returns {Promise<{scope: string|null, scopeConfig: string|null}>}
   */
  scopeData: async function (scope = null, workspaceIds = []) {
    const validScope = this.validations.scope(scope);
    if (validScope !== this.scopes.workspace)
      return { scope: validScope, scopeConfig: null };

    const ids = this.validations.workspaceIds(workspaceIds);
    const found = await prisma.workspaces.count({ where: { id: { in: ids } } });
    if (found !== ids.length)
      throw new Error("One or more selected workspaces do not exist.");
    return {
      scope: validScope,
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
   * @param {string|null} [options.scope]
   * @param {number[]} [options.workspaceIds] - Required for the `workspace` scope
   * @returns {Promise<{apiKey: ApiKeyRecord|null, error: string|null}>}
   */
  create: async function (
    createdByUserId = null,
    name = null,
    { scope = null, workspaceIds = [] } = {}
  ) {
    try {
      const normalizedName =
        typeof name === "string" && name.trim().length > 0 ? name.trim() : null;
      const apiKey = await prisma.api_keys.create({
        data: {
          name: normalizedName,
          secret: this.makeSecret(),
          createdBy: createdByUserId,
          ...(await this.scopeData(scope, workspaceIds)),
        },
      });

      return { apiKey, error: null };
    } catch (error) {
      console.error("FAILED TO CREATE API KEY.", error.message);
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
