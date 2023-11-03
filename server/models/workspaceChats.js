const prisma = require("../utils/prisma");

const WorkspaceChats = {
  new: async function ({ workspaceId, prompt, response = {}, user = null }) {
    try {
      const chat = await prisma.workspace_chats.create({
        data: {
          workspaceId,
          prompt,
          response: JSON.stringify(response),
          user_id: user?.id || null,
        },
      });
      return { chat, message: null };
    } catch (error) {
      console.error(error.message);
      return { chat: null, message: error.message };
    }
  },

  forWorkspaceByUser: async function (
    workspaceId = null,
    userId = null,
    limit = null,
    orderBy = null
  ) {
    if (!workspaceId || !userId) return [];
    try {
      const chats = await prisma.workspace_chats.findMany({
        where: {
          workspaceId,
          user_id: userId,
          include: true,
        },
        ...(limit !== null ? { take: limit } : {}),
        ...(orderBy !== null ? { orderBy } : { orderBy: { id: "asc" } }),
      });
      return chats;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  forWorkspace: async function (
    workspaceId = null,
    limit = null,
    orderBy = null
  ) {
    if (!workspaceId) return [];
    try {
      const chats = await prisma.workspace_chats.findMany({
        where: {
          workspaceId,
          include: true,
        },
        ...(limit !== null ? { take: limit } : {}),
        ...(orderBy !== null ? { orderBy } : { orderBy: { id: "asc" } }),
      });
      return chats;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  markHistoryInvalid: async function (workspaceId = null, user = null) {
    if (!workspaceId) return;
    try {
      await prisma.workspace_chats.updateMany({
        where: {
          workspaceId,
          user_id: user?.id,
        },
        data: {
          include: false,
        },
      });
      return;
    } catch (error) {
      console.error(error.message);
    }
  },

  get: async function (clause = {}, limit = null, orderBy = null) {
    try {
      const chat = await prisma.workspace_chats.findFirst({
        where: clause,
        ...(limit !== null ? { take: limit } : {}),
        ...(orderBy !== null ? { orderBy } : {}),
      });
      return chat || null;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },

  delete: async function (clause = {}) {
    try {
      await prisma.workspace_chats.deleteMany({
        where: clause,
      });
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  },

  where: async function (
    clause = {},
    limit = null,
    orderBy = null,
    offset = null
  ) {
    try {
      const chats = await prisma.workspace_chats.findMany({
        where: clause,
        ...(limit !== null ? { take: limit } : {}),
        ...(offset !== null ? { skip: offset } : {}),
        ...(orderBy !== null ? { orderBy } : {}),
      });
      return chats;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  count: async function (clause = {}) {
    try {
      const count = await prisma.workspace_chats.count({
        where: clause,
      });
      return count;
    } catch (error) {
      console.error(error.message);
      return 0;
    }
  },

  whereWithData: async function (
    clause = {},
    limit = null,
    offset = null,
    orderBy = null
  ) {
    const { Workspace } = require("./workspace");
    const { User } = require("./user");

    try {
      const results = await this.where(clause, limit, orderBy, offset);

      for (const res of results) {
        const workspace = await Workspace.get({ id: res.workspaceId });
        res.workspace = workspace
          ? { name: workspace.name, slug: workspace.slug }
          : { name: "deleted workspace", slug: null };

        const user = await User.get({ id: res.user_id });
        res.user = user
          ? { username: user.username }
          : { username: "deleted user" };
      }

      return results;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },
};

module.exports = { WorkspaceChats };
