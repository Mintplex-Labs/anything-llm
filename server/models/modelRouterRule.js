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
const VALID_CONDITION_LOGIC = ["AND", "OR"];
const TITLE_REGEX = /^[a-z0-9_]+$/;

const ModelRouterRule = {
  VALID_TYPES,
  VALID_PROPERTIES,
  VALID_COMPARATORS,
  VALID_CONDITION_LOGIC,

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

    let conditionLogic = null;
    let serializedConditions = null;

    if (type === "calculated") {
      const validated = this._validateConditions(
        data.condition_logic,
        data.conditions
      );
      if (validated.error) return { rule: null, message: validated.error };
      conditionLogic = validated.condition_logic;
      serializedConditions = validated.serialized;
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
          condition_logic: conditionLogic,
          conditions: serializedConditions,
          route_provider: String(data.route_provider),
          route_model: String(data.route_model),
          created_by: creatorId ? Number(creatorId) : null,
        },
      });
      return { rule: this._hydrate(rule), error: null };
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
      return this._hydrate(rule);
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
      return results.map((r) => this._hydrate(r));
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
      return rules.map((r) => this._hydrate(r));
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
      ["route_provider", (v) => String(v)],
      ["route_model", (v) => String(v)],
    ];
    for (const [key, map] of simpleFields) {
      if (data[key] !== undefined) updates[key] = map(data[key]);
    }

    const typeErr = assignEnum(updates, data, "type", VALID_TYPES, "Type");
    if (typeErr) return typeErr;

    // Conditions are only meaningful for calculated rules. When either
    // condition_logic or conditions is provided we revalidate the pair
    // together so we never persist a half-updated rule.
    if (data.condition_logic !== undefined || data.conditions !== undefined) {
      const effectiveType = updates.type || data.type;
      if (effectiveType === "llm") {
        updates.condition_logic = null;
        updates.conditions = null;
      } else {
        const validated = this._validateConditions(
          data.condition_logic,
          data.conditions
        );
        if (validated.error) return { rule: null, error: validated.error };
        updates.condition_logic = validated.condition_logic;
        updates.conditions = validated.serialized;
      }
    }

    if (Object.keys(updates).length === 0)
      return { rule: { id }, error: "No valid fields to update." };

    try {
      const rule = await prisma.model_router_rules.update({
        where: { id: Number(id) },
        data: updates,
      });
      return { rule: this._hydrate(rule), error: null };
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

  /**
   * Validate a (condition_logic, conditions[]) pair for calculated rules.
   * Returns either `{ error }` or `{ condition_logic, serialized }`.
   */
  _validateConditions: function (logic, conditions) {
    if (!VALID_CONDITION_LOGIC.includes(logic))
      return {
        error: `Condition logic must be one of: ${VALID_CONDITION_LOGIC.join(", ")}`,
      };
    if (!Array.isArray(conditions) || conditions.length === 0)
      return { error: "At least one condition is required." };

    const normalized = [];
    for (let i = 0; i < conditions.length; i++) {
      const c = conditions[i] || {};
      if (!VALID_PROPERTIES.includes(c.property))
        return {
          error: `Condition ${i + 1}: property must be one of: ${VALID_PROPERTIES.join(", ")}`,
        };
      if (!VALID_COMPARATORS.includes(c.comparator))
        return {
          error: `Condition ${i + 1}: comparator must be one of: ${VALID_COMPARATORS.join(", ")}`,
        };
      if (c.value === undefined || c.value === null || String(c.value) === "")
        return { error: `Condition ${i + 1}: value is required.` };
      normalized.push({
        property: c.property,
        comparator: c.comparator,
        value: String(c.value),
      });
    }

    return {
      condition_logic: logic,
      serialized: JSON.stringify(normalized),
    };
  },

  /**
   * Parse the stored JSON `conditions` string into an array so every consumer
   * (API responses, evaluator, UI) works with the same shape. Safe on null and
   * on rule types that don't use conditions.
   */
  _hydrate: function (rule) {
    if (!rule) return null;
    if (!rule.conditions) return { ...rule, conditions: null };
    try {
      return { ...rule, conditions: JSON.parse(rule.conditions) };
    } catch (error) {
      console.error(
        `Failed to parse conditions for rule ${rule.id}: ${error.message}`
      );
      return { ...rule, conditions: null };
    }
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

module.exports = { ModelRouterRule };
