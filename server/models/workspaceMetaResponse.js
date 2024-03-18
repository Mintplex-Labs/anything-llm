const prisma = require("../utils/prisma");

const WorkspaceMetaResponse = {
  writable: ["name"],

  update: async function (workspaceId, data) {
    try {
      const result = await prisma.workspaces.update({
        where: {
          id: workspaceId,
        },
        data: {
          metaResponseSettings: data,
        },
      });
      return {
        metaResponseSettings: result.metaResponseSettings,
        message: null
      };
    } catch (error) {
      console.error(error.message);
      return { workspace: null, message: error.message };
    }
  },

  get: async function (clause = {}) {
    try {
      const thread = await prisma.workspaces.findFirst({
        where: clause,
      });

      return thread || null;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },

  where: async function (clause = {}, limit = null, orderBy = null) {
    try {
      const results = await prisma.workspaces.findMany({
        where: clause,
        ...(limit !== null ? { take: limit } : {}),
        ...(orderBy !== null ? { orderBy } : {}),
      });
      return results;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  toggleMetaResponse: async function (workspaceId, status) {
    try {
      const result = await prisma.workspaces.update({
        where: { id: workspaceId },
        data: {
          metaResponse: status,
        },
      });
      return { result, message: null };
    } catch (error) {
      console.error(error.message);
      return { workspace: null, message: error.message };
    }
  }
};

module.exports = { WorkspaceMetaResponse };
