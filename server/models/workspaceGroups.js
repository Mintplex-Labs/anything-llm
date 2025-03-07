const prisma = require("../utils/prisma");

const WorkspaceGroup = {
  createMany: async function (groupId, workspaceIds = []) {
    if (workspaceIds.length === 0) return;
    try {
      await prisma.$transaction(
        workspaceIds.map((workspaceId) =>
          prisma.workspace_groups.create({
            data: { group_id: groupId, workspace_id: workspaceId },
          })
        )
      );
    } catch (error) {
      console.error(error.message);
    }
    return;
  },

  createManyGroups: async function (groupIds = [], workspaceId) {
    if (groupIds.length === 0) return;
    try {
      await prisma.$transaction(
        groupIds.map((groupId) =>
          prisma.workspace_groups.create({
            data: {
              group_id: Number(groupId),
              workspace_id: Number(workspaceId),
            },
          })
        )
      );
    } catch (error) {
      console.error(error.message);
    }
    return;
  },

  create: async function (groupId = 0, workspaceId = 0) {
    try {
      await prisma.workspace_groups.create({
        data: { group_id: Number(groupId), workspace_id: Number(workspaceId) },
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

  get: async function (clause = {}) {
    try {
      const result = await prisma.workspace_groups.findFirst({ where: clause });
      return result || null;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },

  where: async function (clause = {}, limit = null) {
    try {
      const results = await prisma.workspace_groups.findMany({
        where: clause,
        ...(limit !== null ? { take: limit } : {}),
      });
      return results;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  getGroupWorkspaces: async function (clause = {}, limit = null) {
    try {
      const results = await prisma.workspace_groups.findMany({
        where: clause,
        include: {
          workspaces: {
            select: { slug: true }  // Only include the 'slug' field from the 'workspace'
          }
        },
        ...(limit !== null ? { take: limit } : {}),
      });
      const enhancedResults = results.map(item => {
        return {
          ...item,
          workspaceSlug: item.workspaces?.slug  // Accessing the slug from the joined workspace
        };
      });

      return enhancedResults;
      // return results;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  count: async function (clause = {}) {
    try {
      const count = await prisma.workspace_groups.count({ where: clause });
      return count;
    } catch (error) {
      console.error(error.message);
      return 0;
    }
  },

  delete: async function (clause = {}) {
    try {
      await prisma.workspace_groups.deleteMany({ where: clause });
    } catch (error) {
      console.error(error.message);
    }
    return;
  },
};

module.exports.WorkspaceGroup = WorkspaceGroup;
