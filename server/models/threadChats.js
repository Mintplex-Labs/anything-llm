const prisma = require("../utils/prisma");
const {Threads} = require("./threads");

const ThreadChats = {
  new: async function ({ workspaceId, threadId, prompt, response = {}}) {
    try {
      const chat = await prisma.thread_chats.create({
        data: {
          thread_id: threadId,
          workspace_id: workspaceId,
          prompt: prompt,
          response: JSON.stringify(response),
        },
      });
      return { chat, message: null };
    } catch (error) {
      console.error(error.message);
      return { chat: null, message: error.message };
    }
  },

  forWorkspaceByThread: async function (
    workspaceId = null,
    threadId = null,
    limit = null,
    orderBy = null
  ) {
    if (!workspaceId || !threadId) return [];
    try {
      const chats = await prisma.thread_chats.findMany({
        where: {
          workspace_id: workspaceId,
          thread_id: Number(threadId),
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
      const chats = await prisma.thread_chats.findMany({
        where: {
          workspace_id: workspaceId,
          include: true,
        },
        include: {
          thread: true
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

  markHistoryInvalid: async function (workspaceId = null, thread = null) {
    if (!workspaceId) return;
    try {
      await prisma.thread_chats.updateMany({
        where: {
          workspace_id: workspaceId,
          thread_id: thread?.id,
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
      const chat = await prisma.thread_chats.findFirst({
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
      await prisma.thread_chats.deleteMany({
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
      const chats = await prisma.thread_chats.findMany({
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
      const count = await prisma.thread_chats.count({
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
    const { Threads } = require("./threads");
    const { User } = require("./user");

    // add validate thread
    try {
      const results = await this.where(clause, limit, orderBy, offset);

      for (const res of results) {
        const workspace = await Workspace.get({ id: res.workspace_id });
        res.workspace = workspace
          ? { name: workspace.name, slug: workspace.slug }
          : { name: "deleted workspace", slug: null };

        const thread = await Threads.get({ id: res.thread_id });
        res.thread = thread
          ? { name: thread.name }
          : { username: "deleted thread" };

        const user = thread.user_id ? await User.get({ id: thread.user_id }) : null;
        res.user = user
          ? { username: user.username }
          : { username: "Unknown user" };
      }

      return results;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },
};

module.exports = { ThreadChats };
