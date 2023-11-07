const prisma = require("../utils/prisma");

const CacheData = {
  new: async function (inputs = {}) {
    try {
      const cache = await prisma.cache_data.create({
        data: inputs,
      });
      return { cache, message: null };
    } catch (error) {
      console.error(error.message);
      return { cache: null, message: error.message };
    }
  },

  get: async function (clause = {}, limit = null, orderBy = null) {
    try {
      const cache = await prisma.cache_data.findFirst({
        where: clause,
        ...(limit !== null ? { take: limit } : {}),
        ...(orderBy !== null ? { orderBy } : {}),
      });
      return cache || null;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },

  delete: async function (clause = {}) {
    try {
      await prisma.cache_data.deleteMany({
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
      const caches = await prisma.cache_data.findMany({
        where: clause,
        ...(limit !== null ? { take: limit } : {}),
        ...(orderBy !== null ? { orderBy } : {}),
      });
      return caches;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  count: async function (clause = {}) {
    try {
      const count = await prisma.cache_data.count({
        where: clause,
      });
      return count;
    } catch (error) {
      console.error(error.message);
      return 0;
    }
  },
};

module.exports = { CacheData };
