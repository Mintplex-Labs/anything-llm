const prisma = require("../utils/prisma");

const GLOBAL_LIMIT = 5;
const WORKSPACE_LIMIT = 20;

const Memory = {
  forUserWorkspace: async function (userId, workspaceId) {
    try {
      const memories = await prisma.memories.findMany({
        where: { userId, workspaceId, scope: "workspace" },
        orderBy: { createdAt: "desc" },
      });
      return memories;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  globalForUser: async function (userId) {
    try {
      const memories = await prisma.memories.findMany({
        where: { userId, scope: "global" },
        orderBy: { createdAt: "desc" },
      });
      return memories;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  create: async function ({
    userId,
    workspaceId = null,
    scope = "workspace",
    content,
    sourceThreadId = null,
  }) {
    try {
      const count = await this.countForScope(userId, workspaceId, scope);
      const limit = scope === "global" ? GLOBAL_LIMIT : WORKSPACE_LIMIT;
      if (count >= limit)
        return {
          memory: null,
          message: `Maximum ${scope} memory limit (${limit}) reached.`,
        };

      const memory = await prisma.memories.create({
        data: { userId, workspaceId, scope, content, sourceThreadId },
      });
      return { memory, message: null };
    } catch (error) {
      console.error(error.message);
      return { memory: null, message: error.message };
    }
  },

  update: async function (id, { content }) {
    try {
      const memory = await prisma.memories.update({
        where: { id },
        data: { content, updatedAt: new Date() },
      });
      return { memory, message: null };
    } catch (error) {
      console.error(error.message);
      return { memory: null, message: error.message };
    }
  },

  delete: async function (id) {
    try {
      await prisma.memories.delete({ where: { id } });
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  },

  promoteToGlobal: async function (id) {
    try {
      const existing = await prisma.memories.findUnique({ where: { id } });
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
        where: { id },
        data: { scope: "global", workspaceId: null, updatedAt: new Date() },
      });
      return { memory, message: null };
    } catch (error) {
      console.error(error.message);
      return { memory: null, message: error.message };
    }
  },

  demoteToWorkspace: async function (id, workspaceId) {
    try {
      const existing = await prisma.memories.findUnique({ where: { id } });
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
        where: { id },
        data: { scope: "workspace", workspaceId, updatedAt: new Date() },
      });
      return { memory, message: null };
    } catch (error) {
      console.error(error.message);
      return { memory: null, message: error.message };
    }
  },

  updateLastUsed: async function (ids = []) {
    if (!ids.length) return;
    try {
      await prisma.memories.updateMany({
        where: { id: { in: ids } },
        data: { lastUsedAt: new Date() },
      });
    } catch (error) {
      console.error(error.message);
    }
  },

  countForScope: async function (userId, workspaceId, scope) {
    try {
      const where = { userId, scope };
      if (scope === "workspace") where.workspaceId = workspaceId;
      return await prisma.memories.count({ where });
    } catch (error) {
      console.error(error.message);
      return 0;
    }
  },

  replaceWorkspaceMemories: async function (userId, workspaceId, memories) {
    try {
      await prisma.$transaction(async (tx) => {
        await tx.memories.deleteMany({
          where: { userId, workspaceId, scope: "workspace" },
        });

        for (const content of memories.slice(0, WORKSPACE_LIMIT)) {
          await tx.memories.create({
            data: { userId, workspaceId, scope: "workspace", content },
          });
        }
      });
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  },

  migrateToMultiUser: async function (adminUserId) {
    try {
      await prisma.memories.updateMany({
        where: { userId: null },
        data: { userId: adminUserId },
      });
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  },

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
