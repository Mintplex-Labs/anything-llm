const prisma = require("../utils/prisma");

const GLOBAL_LIMIT = 5;
const WORKSPACE_LIMIT = 20;
const VALID_SCOPES = ["workspace", "global"];

/**
 * @typedef {Object} Memory
 * @property {number} id
 * @property {number|null} userId
 * @property {number|null} workspaceId
 * @property {"workspace"|"global"} scope
 * @property {string} content
 * @property {number|null} sourceThreadId
 * @property {Date|null} lastUsedAt
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

function toInt(v) {
  const n = Number(v);
  if (!Number.isInteger(n))
    throw new Error(`Expected integer, got ${JSON.stringify(v)}`);
  return n;
}

const Memory = {
  validations: {
    id: (v) => toInt(v),
    userId: (v = null) => (v === null || v === undefined ? null : toInt(v)),
    workspaceId: (v = null) =>
      v === null || v === undefined ? null : toInt(v),
    scope: (v = "workspace") => {
      if (!VALID_SCOPES.includes(v))
        throw new Error(`Invalid scope: ${JSON.stringify(v)}`);
      return v;
    },
    content: (v) => {
      if (typeof v !== "string" || v.trim().length === 0)
        throw new Error("Content must be a non-empty string");
      return v;
    },
  },

  /**
   * List a user's workspace-scoped memories, newest first.
   * @param {number|null} userId
   * @param {number} workspaceId
   * @returns {Promise<Memory[]>}
   */
  forUserWorkspace: async function (userId, workspaceId) {
    try {
      const memories = await prisma.memories.findMany({
        where: {
          userId: this.validations.userId(userId),
          workspaceId: this.validations.id(workspaceId),
          scope: "workspace",
        },
        orderBy: { createdAt: "desc" },
      });
      return memories;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  /**
   * List a user's global-scoped memories, newest first.
   * @param {number|null} userId
   * @returns {Promise<Memory[]>}
   */
  globalForUser: async function (userId) {
    try {
      const memories = await prisma.memories.findMany({
        where: {
          userId: this.validations.userId(userId),
          scope: "global",
        },
        orderBy: { createdAt: "desc" },
      });
      return memories;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  /**
   * Create a memory, enforcing per-scope limits (global: 5, workspace: 20).
   * @param {Object} params
   * @param {number|null} params.userId
   * @param {number|null} [params.workspaceId]
   * @param {"workspace"|"global"} [params.scope]
   * @param {string} params.content
   * @param {number|null} [params.sourceThreadId]
   * @returns {Promise<{memory: Memory|null, message: string|null}>}
   */
  create: async function ({
    userId,
    workspaceId = null,
    scope = "workspace",
    content,
    sourceThreadId = null,
  }) {
    try {
      const count = await this.countForScope(userId, workspaceId, scope);
      const limit =
        this.validations.scope(scope) === "global"
          ? GLOBAL_LIMIT
          : WORKSPACE_LIMIT;
      if (count >= limit)
        return {
          memory: null,
          message: `Maximum ${scope} memory limit (${limit}) reached.`,
        };

      const memory = await prisma.memories.create({
        data: {
          userId: this.validations.userId(userId),
          workspaceId: this.validations.workspaceId(workspaceId),
          scope: this.validations.scope(scope),
          content: this.validations.content(content),
          sourceThreadId: this.validations.workspaceId(sourceThreadId),
        },
      });
      return { memory, message: null };
    } catch (error) {
      console.error(error.message);
      return { memory: null, message: error.message };
    }
  },

  /**
   * Update an existing memory's content.
   * @param {number} id
   * @param {{content: string}} fields
   * @returns {Promise<{memory: Memory|null, message: string|null}>}
   */
  update: async function (id, { content }) {
    try {
      const memory = await prisma.memories.update({
        where: { id: this.validations.id(id) },
        data: {
          content: this.validations.content(content),
          updatedAt: new Date(),
        },
      });
      return { memory, message: null };
    } catch (error) {
      console.error(error.message);
      return { memory: null, message: error.message };
    }
  },

  /**
   * Delete a memory by id.
   * @param {number} id
   * @returns {Promise<boolean>} true on success, false on error
   */
  delete: async function (id) {
    try {
      await prisma.memories.delete({
        where: { id: this.validations.id(id) },
      });
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  },

  /**
   * Promote a workspace-scoped memory to global scope.
   * Enforces the global limit and clears its workspaceId.
   * @param {number} id
   * @returns {Promise<{memory: Memory|null, message: string|null}>}
   */
  promoteToGlobal: async function (id) {
    try {
      const existing = await prisma.memories.findUnique({
        where: { id: this.validations.id(id) },
      });
      if (!existing) return { memory: null, message: "Memory not found." };
      if (existing.scope === "global")
        return { memory: existing, message: "Memory is already global." };

      const globalCount = await this.countForScope(
        existing.userId,
        null,
        "global"
      );
      if (globalCount >= GLOBAL_LIMIT)
        return {
          memory: null,
          message: `Maximum global memory limit (${GLOBAL_LIMIT}) reached.`,
        };

      const memory = await prisma.memories.update({
        where: { id: this.validations.id(id) },
        data: { scope: "global", workspaceId: null, updatedAt: new Date() },
      });
      return { memory, message: null };
    } catch (error) {
      console.error(error.message);
      return { memory: null, message: error.message };
    }
  },

  /**
   * Demote a global memory to workspace scope, assigning it to the target workspace.
   * Enforces the per-workspace limit.
   * @param {number} id
   * @param {number} workspaceId
   * @returns {Promise<{memory: Memory|null, message: string|null}>}
   */
  demoteToWorkspace: async function (id, workspaceId) {
    try {
      const existing = await prisma.memories.findUnique({
        where: { id: this.validations.id(id) },
      });
      if (!existing) return { memory: null, message: "Memory not found." };
      if (existing.scope === "workspace")
        return {
          memory: existing,
          message: "Memory is already workspace-scoped.",
        };

      const wsCount = await this.countForScope(
        existing.userId,
        workspaceId,
        "workspace"
      );
      if (wsCount >= WORKSPACE_LIMIT)
        return {
          memory: null,
          message: `Maximum workspace memory limit (${WORKSPACE_LIMIT}) reached.`,
        };

      const memory = await prisma.memories.update({
        where: { id: this.validations.id(id) },
        data: {
          scope: "workspace",
          workspaceId: this.validations.id(workspaceId),
          updatedAt: new Date(),
        },
      });
      return { memory, message: null };
    } catch (error) {
      console.error(error.message);
      return { memory: null, message: error.message };
    }
  },

  /**
   * Stamp a set of memories as just-used (for recency tracking / reranking).
   * @param {number[]} [ids]
   * @returns {Promise<void>}
   */
  updateLastUsed: async function (ids = []) {
    if (!Array.isArray(ids) || ids.length === 0) return;
    try {
      await prisma.memories.updateMany({
        where: { id: { in: ids.map(this.validations.id) } },
        data: { lastUsedAt: new Date() },
      });
    } catch (error) {
      console.error(error.message);
    }
  },

  /**
   * Count a user's memories in a given scope. For "workspace" scope the workspaceId is required.
   * @param {number|null} userId
   * @param {number|null} workspaceId
   * @param {"workspace"|"global"} scope
   * @returns {Promise<number>}
   */
  countForScope: async function (userId, workspaceId, scope) {
    try {
      const where = {
        userId: this.validations.userId(userId),
        scope: this.validations.scope(scope),
      };
      if (scope === "workspace")
        where.workspaceId = this.validations.workspaceId(workspaceId);
      return await prisma.memories.count({ where });
    } catch (error) {
      console.error(error.message);
      return 0;
    }
  },

  /**
   * Replace all of a user's workspace-scoped memories for a workspace with the given set.
   * Runs in a transaction so a failure mid-write does not leave a partial state.
   * Caps the input at WORKSPACE_LIMIT.
   * @param {number|null} userId
   * @param {number} workspaceId
   * @param {string[]} memories - memory contents to insert
   * @returns {Promise<boolean>}
   */
  replaceWorkspaceMemories: async function (userId, workspaceId, memories) {
    try {
      const safeMemories = Array.isArray(memories)
        ? memories.filter((m) => typeof m === "string" && m.trim().length > 0)
        : [];

      await prisma.$transaction(async (tx) => {
        await tx.memories.deleteMany({
          where: {
            userId: this.validations.userId(userId),
            workspaceId: this.validations.id(workspaceId),
            scope: "workspace",
          },
        });

        for (const content of safeMemories.slice(0, WORKSPACE_LIMIT)) {
          await tx.memories.create({
            data: {
              userId: this.validations.userId(userId),
              workspaceId: this.validations.id(workspaceId),
              scope: "workspace",
              content,
            },
          });
        }
      });
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  },

  /**
   * Assign all unowned memories (userId null) to the admin account when the system enters multi-user mode.
   * @param {number} adminUserId
   * @returns {Promise<boolean>}
   */
  migrateToMultiUser: async function (adminUserId) {
    try {
      await prisma.memories.updateMany({
        where: { userId: null },
        data: { userId: this.validations.id(adminUserId) },
      });
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  },

  /**
   * Fetch the first memory matching the given where clause.
   * @param {object} [clause] - Prisma where clause
   * @returns {Promise<Memory|null>}
   */
  get: async function (clause = {}) {
    try {
      const memory = await prisma.memories.findFirst({ where: clause });
      return memory || null;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },
};

module.exports = { Memory };
