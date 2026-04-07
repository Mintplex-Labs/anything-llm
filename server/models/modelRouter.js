const prisma = require("../utils/prisma");

const ModelRouter = {
  validations: {
    name: (value) => {
      if (!value || typeof value !== "string") return null;
      return String(value).trim().slice(0, 255);
    },
    description: (value) => {
      if (!value || typeof value !== "string") return null;
      return String(value).trim();
    },
    fallback_provider: (value) => {
      if (!value || typeof value !== "string") return null;
      return String(value);
    },
    fallback_model: (value) => {
      if (!value || typeof value !== "string") return null;
      return String(value);
    },
    cooldown_seconds: (value) => {
      const num = Number(value);
      if (isNaN(num) || num < 0 || num > 3600) return null;
      return Math.round(num);
    },
  },

  create: async function (data = {}, creatorId = null) {
    const name = this.validations.name(data.name);
    if (!name) return { router: null, message: "Name is required." };

    const fallback_provider = this.validations.fallback_provider(
      data.fallback_provider
    );
    const fallback_model = this.validations.fallback_model(data.fallback_model);
    if (!fallback_provider || !fallback_model)
      return {
        router: null,
        message: "Fallback provider and model are required.",
      };

    const cooldown_seconds =
      data.cooldown_seconds != null
        ? this.validations.cooldown_seconds(data.cooldown_seconds)
        : 30;

    try {
      const router = await prisma.model_routers.create({
        data: {
          name,
          description: this.validations.description(data.description),
          fallback_provider,
          fallback_model,
          cooldown_seconds: cooldown_seconds ?? 30,
          created_by: creatorId ? Number(creatorId) : null,
        },
      });
      return { router, message: null };
    } catch (error) {
      console.error(error.message);
      if (error.message.includes("Unique constraint"))
        return {
          router: null,
          message: "A router with that name already exists.",
        };
      return { router: null, message: error.message };
    }
  },

  get: async function (clause = {}) {
    try {
      const router = await prisma.model_routers.findFirst({
        where: clause,
      });
      return router || null;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },

  getWithRules: async function (clause = {}) {
    try {
      const router = await prisma.model_routers.findFirst({
        where: clause,
        include: {
          rules: {
            orderBy: { priority: "asc" },
          },
        },
      });
      return router || null;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },

  where: async function (clause = {}, limit = null, orderBy = null) {
    try {
      const results = await prisma.model_routers.findMany({
        where: clause,
        ...(limit !== null ? { take: limit } : {}),
        ...(orderBy !== null ? { orderBy } : { orderBy: { createdAt: "asc" } }),
      });
      return results;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  update: async function (id = null, data = {}) {
    if (!id) throw new Error("No router id provided for update");

    const updates = {};
    if (data.name !== undefined) {
      const name = this.validations.name(data.name);
      if (!name) return { router: null, message: "Name cannot be empty." };
      updates.name = name;
    }
    if (data.description !== undefined)
      updates.description = this.validations.description(data.description);
    if (data.fallback_provider !== undefined) {
      const provider = this.validations.fallback_provider(
        data.fallback_provider
      );
      if (!provider)
        return { router: null, message: "Fallback provider is required." };
      updates.fallback_provider = provider;
    }
    if (data.fallback_model !== undefined) {
      const model = this.validations.fallback_model(data.fallback_model);
      if (!model)
        return { router: null, message: "Fallback model is required." };
      updates.fallback_model = model;
    }
    if (data.cooldown_seconds !== undefined) {
      const cooldown = this.validations.cooldown_seconds(data.cooldown_seconds);
      if (cooldown === null)
        return {
          router: null,
          message: "Cooldown must be a number between 0 and 3600.",
        };
      updates.cooldown_seconds = cooldown;
    }

    if (Object.keys(updates).length === 0)
      return { router: { id }, message: "No valid fields to update." };

    try {
      const router = await prisma.model_routers.update({
        where: { id: Number(id) },
        data: updates,
      });
      return { router, message: null };
    } catch (error) {
      console.error(error.message);
      if (error.message.includes("Unique constraint"))
        return {
          router: null,
          message: "A router with that name already exists.",
        };
      return { router: null, message: error.message };
    }
  },

  delete: async function (id = null) {
    if (!id) return false;

    try {
      // Null out any workspace references before deleting
      await prisma.workspaces.updateMany({
        where: { router_id: Number(id) },
        data: { router_id: null },
      });

      await prisma.model_routers.delete({
        where: { id: Number(id) },
      });
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  },

  workspaceCount: async function (routerId) {
    try {
      const count = await prisma.workspaces.count({
        where: { router_id: Number(routerId) },
      });
      return count;
    } catch (error) {
      console.error(error.message);
      return 0;
    }
  },
};

module.exports = { ModelRouter };
