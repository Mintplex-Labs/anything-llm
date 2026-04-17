/**
 * Evaluate a calculated rule against the given context. A rule holds one or
 * more conditions joined by `condition_logic` ("AND" or "OR"). An empty
 * conditions list never matches.
 * @param {Object} rule - A hydrated model_router_rules record (conditions parsed)
 * @param {Object} context - { prompt, conversationHistory, conversationTokenCount }
 * @returns {boolean}
 */
function evaluateRule(rule, context) {
  if (rule.type !== "calculated") return false;
  const { conditions, condition_logic: logic } = rule;
  if (!Array.isArray(conditions) || conditions.length === 0) return false;

  const method = logic === "OR" ? "some" : "every";
  return conditions[method]((c) =>
    evaluateCondition(c.property, c.comparator, c.value, context)
  );
}

/**
 * Evaluate a single condition against the context.
 * @param {string} property - "promptContent" | "conversationTokenCount" | "conversationMessageCount" | "currentHour" | "hasImageAttachment"
 * @param {string} comparator - "contains" | "matches" | "gt" | "gte" | "lt" | "lte" | "eq" | "neq" | "between"
 * @param {string} value - The comparison value (stored as string in DB)
 * @param {Object} context - { prompt, conversationHistory, conversationTokenCount, conversationMessageCount, attachments }
 * @returns {boolean}
 */
function evaluateCondition(property, comparator, value, context) {
  const contextValue = getContextValue(property, context);
  if (contextValue === undefined) return false;

  if (property === "promptContent" || property === "hasImageAttachment")
    return evaluateStringCondition(contextValue, comparator, value);

  return evaluateNumericCondition(contextValue, comparator, value);
}

function getContextValue(property, context) {
  switch (property) {
    case "promptContent":
      return context.prompt || "";
    case "conversationTokenCount":
      return context.conversationTokenCount ?? 0;
    case "conversationMessageCount":
      return context.conversationMessageCount ?? 0;
    case "currentHour":
      return new Date().getHours();
    case "hasImageAttachment":
      return (context.attachments || []).some((a) =>
        a.mime?.startsWith("image/")
      )
        ? "true"
        : "false";
    default:
      return undefined;
  }
}

// Cap the input scanned by regex to mitigate catastrophic backtracking on
// pathological patterns + huge prompts. 10k chars is plenty for routing.
const REGEX_INPUT_CAP = 10_000;

function evaluateStringCondition(contextValue, comparator, value) {
  switch (comparator) {
    case "contains":
      return String(value)
        .split(",")
        .map((v) => v.trim().toLowerCase())
        .filter(Boolean)
        .some((keyword) =>
          String(contextValue).toLowerCase().includes(keyword)
        );
    case "matches":
      return matchesRegex(String(contextValue), String(value));
    case "eq":
      return String(contextValue).toLowerCase() === String(value).toLowerCase();
    case "neq":
      return String(contextValue).toLowerCase() !== String(value).toLowerCase();
    default:
      return false;
  }
}

/**
 * Test `input` against a user-provided regex. Accepts either a bare pattern
 * ("foo.*bar", defaults to case-insensitive) or `/pattern/flags` syntax.
 * Invalid patterns and runtime errors return false rather than throwing so a
 * broken rule never crashes routing.
 */
function matchesRegex(input, value) {
  const trimmed = value.trim();
  if (!trimmed) return false;

  const delimited = trimmed.match(/^\/(.+)\/([gimsuy]*)$/);
  const pattern = delimited ? delimited[1] : trimmed;
  const flags = delimited ? delimited[2] || "i" : "i";

  try {
    const regex = new RegExp(pattern, flags);
    return regex.test(input.slice(0, REGEX_INPUT_CAP));
  } catch {
    return false;
  }
}

function evaluateNumericCondition(contextValue, comparator, value) {
  const numContext = Number(contextValue);
  const numValue = Number(value);
  if (isNaN(numContext) || isNaN(numValue)) return false;

  switch (comparator) {
    case "gt":
      return numContext > numValue;
    case "gte":
      return numContext >= numValue;
    case "lt":
      return numContext < numValue;
    case "lte":
      return numContext <= numValue;
    case "eq":
      return numContext === numValue;
    case "neq":
      return numContext !== numValue;
    case "between": {
      const parts = String(value).split(",").map(Number);
      if (parts.length !== 2 || parts.some(isNaN)) return false;
      return numContext >= parts[0] && numContext <= parts[1];
    }
    default:
      return false;
  }
}

module.exports = { evaluateRule, evaluateCondition };
