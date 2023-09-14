const prisma = require("../utils/prisma");

const WorkspaceUser = {
  createMany: async function (userId, workspaceIds = []) {
    if (workspaceIds.length === 0) return;
    try {
      await prisma.$transaction(
        workspaceIds.map((workspaceId) =>
          prisma.workspace_users.create({
            data: { user_id: userId, workspace_id: workspaceId },
          })
        )
      );
    } catch (error) {
      console.error(error.message);
    }
    return;
  },

  createManyUsers: async function (userIds = [], workspaceId) {
    if (userIds.length === 0) return;
    try {
      await prisma.$transaction(
        userIds.map((userId) =>
          prisma.workspace_users.create({
            data: { user_id: userId, workspace_id: workspaceId },
          })
        )
      );
    } catch (error) {
      console.error(error.message);
    }
    return;
  },

  create: async function (userId = 0, workspaceId = 0) {
    try {
      await prisma.workspace_users.create({
        data: { user_id: userId, workspace_id: workspaceId },
      });
      return true;
    } catch (error) {
      console.error(
        "FAILED TO CREATE WORKSPACE_USER RELATIONSHIP.",
        error.message
      );
      return false;
    }
  },

  get: async function (params) {
    try {
      const result = await prisma.workspace_users.findFirst({ where: params });
      return result || null;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },

  where: async function (params, limit = null) {
    try {
      const results = await prisma.workspace_users.findMany({
        where: params,
        take: limit,
      });
      return results;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  count: async function (params) {
    try {
      const count = await prisma.workspace_users.count({ where: params });
      return count;
    } catch (error) {
      console.error(error.message);
      return 0;
    }
  },

  delete: async function (params) {
    try {
      await prisma.workspace_users.deleteMany({ where: params });
    } catch (error) {
      console.error(error.message);
    }
    return;
  },
};

module.exports.WorkspaceUser = WorkspaceUser;
