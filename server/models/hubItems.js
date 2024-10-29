const prisma = require("../utils/prisma");

const HubItem = {
  tablename: "hub_items",
  writable: [],

  makeSecret: () => {
    const uuidAPIKey = require("uuid-apikey");
    return uuidAPIKey.create().apiKey;
  },

  create: async function (createdByUserId = null) {
    try {
      const hubItem = await prisma.hub_items.create({
        data: {
          secret: this.makeSecret(),
          createdBy: createdByUserId,
        },
      });

      return { hubItem, error: null };
    } catch (error) {
      console.error("FAILED TO CREATE HUB ITEM.", error.message);
      return { hubItem: null, error: error.message };
    }
  },

  get: async function (clause = {}) {
    try {
      const hubItem = await prisma.hub_items.findFirst({ where: clause });
      return hubItem;
    } catch (error) {
      console.error("FAILED TO GET HUB ITEM.", error.message);
      return null;
    }
  },

  count: async function (clause = {}) {
    try {
      const count = await prisma.hub_items.count({ where: clause });
      return count;
    } catch (error) {
      console.error("FAILED TO COUNT HUB ITEMS.", error.message);
      return 0;
    }
  },

  delete: async function (clause = {}) {
    try {
      await prisma.hub_items.deleteMany({ where: clause });
      return true;
    } catch (error) {
      console.error("FAILED TO DELETE HUB ITEM.", error.message);
      return false;
    }
  },

  where: async function (clause = {}, limit) {
    try {
      const hubItems = await prisma.hub_items.findMany({
        where: clause,
        take: limit,
      });
      return hubItems;
    } catch (error) {
      console.error("FAILED TO GET HUB ITEMS.", error.message);
      return [];
    }
  },

  whereWithUser: async function (clause = {}, limit) {
    try {
      const { User } = require("./user");
      const apiKeys = await this.where(clause, limit);

      for (const hubItem of hubItems) {
        if (!hubItem.createdBy) continue;
        const user = await User.get({ id: hubItem.createdBy });
        if (!user) continue;

        hubItem.createdBy = {
          id: user.id,
          username: user.username,
          role: user.role,
        };
      }

      return apiKeys;
    } catch (error) {
      console.error("FAILED TO GET HUB ITEMS WITH USER.", error.message);
      return [];
    }
  },
};

module.exports = { HubItem };
