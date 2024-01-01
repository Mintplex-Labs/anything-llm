const prisma = require("../utils/prisma");

const Threads = {
  writable: [
    // Used for generic updates so we can validate keys in request body
    "name",
  ],

  new: async function ({ workspaceId, userId, name}, prismaInstance = prisma) {
    try {
      const thread = await prismaInstance.threads.create({
        data: {
          user_id: userId,
          workspace_id: workspaceId,
          name: name || "New thread"
        },
      });
      return { thread, message: null };
    } catch (error) {
      console.error(error.message);
      return { thread: null, message: error.message };
    }
  },

  forWorkspaceByUser: async function (
    workspaceId = null,
    userId = null,
    limit = null,
    orderBy = null
  ) {
    if (!workspaceId) return [];
    try {
      const threads = await prisma.threads.findMany({
        where: {
          workspace_id: workspaceId,
          ...(userId !== null ? { user_id: userId } : {})
        },
        ...(limit !== null ? { take: limit } : {}),
        ...(orderBy !== null ? { orderBy } : { orderBy: { id: "asc" } }),
      });
      return threads;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  get: async function (clause = {}, limit = null, orderBy = null) {
    try {
      const thread = await prisma.threads.findFirst({
        where: clause,
        ...(limit !== null ? { take: limit } : {}),
        ...(orderBy !== null ? { orderBy } : {}),
      });
      return thread || null;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },

  delete: async function (clause = {}) {
    try {
      await prisma.threads.deleteMany({
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
      const threads = await prisma.threads.findMany({
        where: clause,
        ...(limit !== null ? { take: limit } : {}),
        ...(offset !== null ? { skip: offset } : {}),
        ...(orderBy !== null ? { orderBy } : {}),
      });
      return threads;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  count: async function (clause = {}) {
    try {
      const count = await prisma.threads.count({
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

    // add validate thread
    try {
      const results = await this.where(clause, limit, orderBy, offset);

      for (const res of results) {
        const workspace = await Workspace.get({ id: res.workspace_id });
        res.workspace = workspace
          ? { name: workspace.name, slug: workspace.slug }
          : { name: "deleted workspace", slug: null };

        const user = await User.get({ id: res.user_id });
        res.user = user
          ? { username: user.username }
          : { username: "unknown user" };
      }

      return results;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  update: async function (id = null, data = {}) {
    if (!id) throw new Error("No thread id provided for update");

    const validData = Object.keys(data).filter((key) =>
      this.writable.includes(key)
    ).reduce((obj, key) => {
      if (!obj)
        obj = {};
      obj[key] = data[key];
      return obj;
    }, {});

    if (Object.keys(validData).length === 0) {
      return {thread: {id}, message: "No valid fields to update!"};
    }

    try {
      const thread = await prisma.threads.update({
        where: {id},
        data: validData,
      });
      return {thread, message: null};
    } catch (error) {
      console.error(error.message);
      return {thread: null, message: error.message};
    }
  },
};

module.exports = { Threads };
