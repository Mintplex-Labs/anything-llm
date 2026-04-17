const { Prisma } = require("@prisma/client");
const prisma = require("../utils/prisma");

const VALID_TYPES = ["calculated", "llm"];
const VALID_PROPERTIES = [
  "promptContent",
  "conversationTokenCount",
  "conversationMessageCount",
  "currentHour",
  "hasImageAttachment",
];
const VALID_COMPARATORS = [
  "contains",
  "matches",
  "gt",
  "gte",
  "lt",
  "lte",
  "eq",
  "neq",
  "between",
];
const TITLE_REGEX = /^[a-z0-9_]+$/;

const ModelRouterRule = {
  VALID_TYPES,
  VALID_PROPERTIES,
  VALID_COMPARATORS,

  create: async function (routerId, data = {}, creatorId = null) {
    if (!routerId) return { rule: null, error: "Router ID is required." };

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

    if (type === "llm") {
      if (!data.description || !data.description.trim())
        return {
          rule: null,
          message:
            "Description is required for LLM rules. Describe when this rule should match.",
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
      return { rule, error: null };
    } catch (error) {
      console.error(error.message);
      // P2002 is the unique constraint violation error code
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        const target = error.meta?.target;
        if (target?.includes("title"))
          return {
            rule: null,
            message: "A rule with that title already exists on this router.",
          };
        if (target?.includes("priority"))
          return {
            rule: null,
            message: "A rule with that priority already exists on this router.",
          };
        return { rule: null, error: "Duplicate rule constraint violated." };
      }
      return { rule: null, error: error.message };
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
          error: "Title must be lowercase with underscores only.",
        };
      updates.title = title;
    }

    const simpleFields = [
      ["enabled", (v) => Boolean(v)],
      ["priority", (v) => Number(v)],
      ["description", (v) => v || null],
      ["value", (v) => (v != null ? String(v) : null)],
      ["route_provider", (v) => String(v)],
      ["route_model", (v) => String(v)],
    ];
    for (const [key, map] of simpleFields) {
      if (data[key] !== undefined) updates[key] = map(data[key]);
    }

    const enumErr =
      assignEnum(updates, data, "type", VALID_TYPES, "Type") ||
      assignEnumOrNull(
        updates,
        data,
        "property",
        VALID_PROPERTIES,
        "Property"
      ) ||
      assignEnumOrNull(
        updates,
        data,
        "comparator",
        VALID_COMPARATORS,
        "Comparator"
      );
    if (enumErr) return enumErr;

    if (Object.keys(updates).length === 0)
      return { rule: { id }, error: "No valid fields to update." };

    try {
      const rule = await prisma.model_router_rules.update({
        where: { id: Number(id) },
        data: updates,
      });
      return { rule, error: null };
    } catch (error) {
      console.error(error.message);
      // P2002 is the unique constraint violation error code
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        const target = error.meta?.target;
        if (target?.includes("title"))
          return {
            rule: null,
            error: "A rule with that title already exists on this router.",
          };
        if (target?.includes("priority"))
          return {
            rule: null,
            error: "A rule with that priority already exists on this router.",
          };
        return { rule: null, error: "Duplicate rule constraint violated." };
      }
      return { rule: null, error: error.message };
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
      return { success: true, error: null };
    } catch (error) {
      console.error(error.message);
      return { success: false, error: error.message };
    }
  },

  _validateTitle: function (title) {
    if (!title || typeof title !== "string") return null;
    const cleaned = title.trim().toLowerCase();
    if (!TITLE_REGEX.test(cleaned)) return null;
    return cleaned;
  },
};

function assignEnum(updates, data, key, validList, label) {
  if (data[key] === undefined) return null;
  if (!validList.includes(data[key]))
    return {
      rule: null,
      error: `${label} must be one of: ${validList.join(", ")}`,
    };
  updates[key] = data[key];
  return null;
}

function assignEnumOrNull(updates, data, key, validList, label) {
  if (data[key] === undefined) return null;
  const v = data[key];
  if (v && !validList.includes(v))
    return {
      rule: null,
      error: `${label} must be one of: ${validList.join(", ")}`,
    };
  updates[key] = v || null;
  return null;
}

module.exports = { ModelRouterRule };
