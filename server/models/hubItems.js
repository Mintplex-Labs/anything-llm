const prisma = require("../utils/prisma");

const HubItem = {
  tablename: "hub_items",
  writable: ["name", "type", "content", "createdAt"],

  get: async function () {
    try {
      const items = await prisma.hub_items.findMany({
        orderBy: { createdAt: "desc" },
      });
      return items || [];
    } catch (error) {
      console.error("FAILED TO GET HUB ITEMS.", error.message);
      return [];
    }
  },

  create: async function (data, createdByUserId = null) {
    try {
      const item = await prisma.hub_items.create({
        data: {
          name: data.name,
          type: data.type,
          content: data.content,
          createdBy: createdByUserId,
          createdAt: new Date(),
        },
      });
      return { item, error: null };
    } catch (error) {
      console.error("FAILED TO CREATE HUB ITEM.", error.message);
      return { item: null, error: error.message };
    }
  },

  delete: async function (id) {
    try {
      await prisma.hub_items.delete({
        where: { id: Number(id) },
      });
      return true;
    } catch (error) {
      console.error("FAILED TO DELETE HUB ITEM.", error.message);
      return false;
    }
  },
};

module.exports = { HubItem };
