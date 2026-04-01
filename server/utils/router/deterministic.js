/**
 * Evaluate a single calculated rule against the given context.
 * @param {Object} rule - A model_router_rules record
 * @param {Object} context - { prompt, conversationHistory, conversationTokenCount }
 * @returns {boolean}
 */
function evaluateRule(rule, context) {
  if (rule.type !== "calculated") return false;
  if (!rule.property || !rule.comparator || rule.value == null) return false;
  return evaluateCondition(rule.property, rule.comparator, rule.value, context);
}

/**
 * Evaluate a single condition against the context.
 * @param {string} property - "promptContent" | "conversationTokenCount"
 * @param {string} comparator - "contains" | "gt" | "gte" | "lt" | "lte" | "eq" | "neq"
 * @param {string} value - The comparison value (stored as string in DB)
 * @param {Object} context - { prompt, conversationHistory, conversationTokenCount }
 * @returns {boolean}
 */
function evaluateCondition(property, comparator, value, context) {
  const contextValue = getContextValue(property, context);
  if (contextValue === undefined) return false;

  if (property === "promptContent")
    return evaluateStringCondition(contextValue, comparator, value);
  if (property === "conversationTokenCount")
    return evaluateNumericCondition(contextValue, comparator, value);

  return false;
}

function getContextValue(property, context) {
  switch (property) {
    case "promptContent":
      return context.prompt || "";
    case "conversationTokenCount":
      return context.conversationTokenCount ?? 0;
    default:
      return undefined;
  }
}

function evaluateStringCondition(contextValue, comparator, value) {
  switch (comparator) {
    case "contains":
      return String(contextValue)
        .toLowerCase()
        .includes(String(value).toLowerCase());
    case "eq":
      return String(contextValue).toLowerCase() === String(value).toLowerCase();
    case "neq":
      return String(contextValue).toLowerCase() !== String(value).toLowerCase();
    default:
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
    default:
      return false;
  }
}

module.exports = { evaluateRule, evaluateCondition };
