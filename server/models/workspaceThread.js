const prisma = require("../utils/prisma");
const { v4: uuidv4 } = require("uuid");

const WorkspaceThread = {
  writable: ["name"],

  new: async function (workspace, userId = null) {
    try {
      const thread = await prisma.workspace_threads.create({
        data: {
          name: "Thread",
          slug: uuidv4(),
          user_id: userId ? Number(userId) : null,
          workspace_id: workspace.id,
        },
      });

      return { thread, message: null };
    } catch (error) {
      console.error(error.message);
      return { thread: null, message: error.message };
    }
  },

  update: async function (prevThread = null, data = {}) {
    if (!prevThread) throw new Error("No thread id provided for update");

    const validData = {};
    Object.entries(data).forEach(([key, value]) => {
      if (!this.writable.includes(key)) return;
      validData[key] = value;
    });

    if (Object.keys(validData).length === 0)
      return { thread: prevThread, message: "No valid fields to update!" };

    try {
      const thread = await prisma.workspace_threads.update({
        where: { id: prevThread.id },
        data: validData,
      });
      return { thread, message: null };
    } catch (error) {
      console.error(error.message);
      return { thread: null, message: error.message };
    }
  },

  get: async function (clause = {}) {
    try {
      const thread = await prisma.workspace_threads.findFirst({
        where: clause,
      });

      return thread || null;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },

  delete: async function (clause = {}) {
    try {
      await prisma.workspace_threads.deleteMany({
        where: clause,
      });
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  },

  where: async function (clause = {}, limit = null, orderBy = null) {
    try {
      const results = await prisma.workspace_threads.findMany({
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

  // Will fire on first message (included or not) for a thread and rename the thread with the newName prop.
  autoRenameThread: async function ({
    workspace = null,
    thread = null,
    user = null,
    newName = null,
  }) {
    if (!workspace || !thread || !newName) return false;
    const { WorkspaceChats } = require("./workspaceChats");
    const chatCount = await WorkspaceChats.count({
      workspaceId: workspace.id,
      user_id: user?.id || null,
      thread_id: thread.id,
    });
    if (chatCount !== 1) return false;
    await this.update(thread, { name: newName });
    return true;
  },
};

module.exports = { WorkspaceThread };
