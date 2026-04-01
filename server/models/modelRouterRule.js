const prisma = require("../utils/prisma");

const VALID_TYPES = ["calculated"];
const VALID_PROPERTIES = ["promptContent", "conversationTokenCount"];
const VALID_COMPARATORS = ["contains", "gt", "gte", "lt", "lte", "eq", "neq"];
const TITLE_REGEX = /^[a-z0-9_]+$/;

const ModelRouterRule = {
  VALID_TYPES,
  VALID_PROPERTIES,
  VALID_COMPARATORS,

  create: async function (routerId, data = {}, creatorId = null) {
    if (!routerId) return { rule: null, message: "Router ID is required." };

    const title = this._validateTitle(data.title);
    if (!title)
      return {
        rule: null,
        message:
          "Title is required and must be lowercase with underscores only.",
      };

    const type = VALID_TYPES.includes(data.type) ? data.type : null;
    if (!type)
      return {
        rule: null,
        message: `Type must be one of: ${VALID_TYPES.join(", ")}`,
      };

    if (type === "calculated") {
      if (!VALID_PROPERTIES.includes(data.property))
        return {
          rule: null,
          message: `Property must be one of: ${VALID_PROPERTIES.join(", ")}`,
        };
      if (!VALID_COMPARATORS.includes(data.comparator))
        return {
          rule: null,
          message: `Comparator must be one of: ${VALID_COMPARATORS.join(", ")}`,
        };
      if (data.value === undefined || data.value === null || data.value === "")
        return {
          rule: null,
          message: "Value is required for calculated rules.",
        };
    }

    if (!data.route_provider || !data.route_model)
      return {
        rule: null,
        message: "Route provider and model are required.",
      };

    try {
      const rule = await prisma.model_router_rules.create({
        data: {
          router_id: Number(routerId),
          enabled: data.enabled !== false,
          priority: Number(data.priority),
          type,
          title,
          description: data.description || null,
          property: data.property || null,
          comparator: data.comparator || null,
          value: data.value != null ? String(data.value) : null,
          route_provider: String(data.route_provider),
          route_model: String(data.route_model),
          created_by: creatorId ? Number(creatorId) : null,
        },
      });
      return { rule, message: null };
    } catch (error) {
      console.error(error.message);
      if (error.message.includes("Unique constraint")) {
        if (error.message.includes("title"))
          return {
            rule: null,
            message: "A rule with that title already exists on this router.",
          };
        if (error.message.includes("priority"))
          return {
            rule: null,
            message: "A rule with that priority already exists on this router.",
          };
        return { rule: null, message: "Duplicate rule constraint violated." };
      }
      return { rule: null, message: error.message };
    }
  },

  get: async function (clause = {}) {
    try {
      const rule = await prisma.model_router_rules.findFirst({
        where: clause,
      });
      return rule || null;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },

  where: async function (clause = {}, limit = null, orderBy = null) {
    try {
      const results = await prisma.model_router_rules.findMany({
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

  forRouter: async function (routerId) {
    try {
      const rules = await prisma.model_router_rules.findMany({
        where: { router_id: Number(routerId) },
        orderBy: { priority: "asc" },
      });
      return rules;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  update: async function (id = null, data = {}) {
    if (!id) throw new Error("No rule id provided for update");

    const updates = {};

    if (data.title !== undefined) {
      const title = this._validateTitle(data.title);
      if (!title)
        return {
          rule: null,
          message: "Title must be lowercase with underscores only.",
        };
      updates.title = title;
    }

    if (data.enabled !== undefined) updates.enabled = Boolean(data.enabled);
    if (data.priority !== undefined) updates.priority = Number(data.priority);
    if (data.description !== undefined)
      updates.description = data.description || null;

    if (data.type !== undefined) {
      if (!VALID_TYPES.includes(data.type))
        return {
          rule: null,
          message: `Type must be one of: ${VALID_TYPES.join(", ")}`,
        };
      updates.type = data.type;
    }

    if (data.property !== undefined) {
      if (data.property && !VALID_PROPERTIES.includes(data.property))
        return {
          rule: null,
          message: `Property must be one of: ${VALID_PROPERTIES.join(", ")}`,
        };
      updates.property = data.property || null;
    }

    if (data.comparator !== undefined) {
      if (data.comparator && !VALID_COMPARATORS.includes(data.comparator))
        return {
          rule: null,
          message: `Comparator must be one of: ${VALID_COMPARATORS.join(", ")}`,
        };
      updates.comparator = data.comparator || null;
    }

    if (data.value !== undefined)
      updates.value = data.value != null ? String(data.value) : null;
    if (data.route_provider !== undefined)
      updates.route_provider = String(data.route_provider);
    if (data.route_model !== undefined)
      updates.route_model = String(data.route_model);

    if (Object.keys(updates).length === 0)
      return { rule: { id }, message: "No valid fields to update." };

    try {
      const rule = await prisma.model_router_rules.update({
        where: { id: Number(id) },
        data: updates,
      });
      return { rule, message: null };
    } catch (error) {
      console.error(error.message);
      if (error.message.includes("Unique constraint")) {
        if (error.message.includes("title"))
          return {
            rule: null,
            message: "A rule with that title already exists on this router.",
          };
        if (error.message.includes("priority"))
          return {
            rule: null,
            message: "A rule with that priority already exists on this router.",
          };
        return { rule: null, message: "Duplicate rule constraint violated." };
      }
      return { rule: null, message: error.message };
    }
  },

  delete: async function (id = null) {
    if (!id) return false;
    try {
      await prisma.model_router_rules.delete({
        where: { id: Number(id) },
      });
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  },

  /**
   * Bulk update priorities for rules within a router.
   * @param {Array<{id: number, priority: number}>} ruleUpdates
   */
  reorderRules: async function (ruleUpdates = []) {
    try {
      await prisma.$transaction(
        ruleUpdates.map(({ id, priority }) =>
          prisma.model_router_rules.update({
            where: { id: Number(id) },
            data: { priority: Number(priority) },
          })
        )
      );
      return { success: true, message: null };
    } catch (error) {
      console.error(error.message);
      return { success: false, message: error.message };
    }
  },

  _validateTitle: function (title) {
    if (!title || typeof title !== "string") return null;
    const cleaned = title.trim().toLowerCase();
    if (!TITLE_REGEX.test(cleaned)) return null;
    return cleaned;
  },
};

module.exports = { ModelRouterRule };
