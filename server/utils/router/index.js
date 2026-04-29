const { ModelRouter } = require("../../models/modelRouter");
const { evaluateRule } = require("./deterministic");
const {
  classifyWithLLM,
} = require("../agents/aibitat/plugins/router-classifier");

/**
 * Load the router config and rules for a workspace.
 * @param {Object} workspace - A workspaces record with router_id set
 * @returns {Promise<Object|null>} Router with rules, or null if not found
 */
async function resolveRouterForWorkspace(workspace) {
  if (!workspace?.router_id) return null;
  return await ModelRouter.getWithRules({ id: workspace.router_id });
}

/**
 * Evaluate routing rules against the given context and return the matched route.
 * Walks rules in priority order. Calculated rules are evaluated instantly.
 * Contiguous LLM rules are batched into a single classification call.
 * @param {Object} router - A model_routers record (with fallback_provider/model)
 * @param {Array} rules - Array of model_router_rules records, sorted by priority ASC
 * @param {Object} context - { prompt, conversationHistory, conversationTokenCount }
 * @returns {Promise<{ provider: string, model: string, ruleTitle: string|null, ruleType: string|null, isFallback: boolean }>}
 */
async function evaluateRouting(router, rules, context) {
  const enabledRules = rules.filter((r) => r.enabled);

  let i = 0;
  while (i < enabledRules.length) {
    const rule = enabledRules[i];

    if (rule.type === "calculated") {
      if (evaluateRule(rule, context)) {
        return routeFromRule(rule);
      }
      i++;
      continue;
    }

    if (rule.type === "llm") {
      // Collect contiguous LLM rules into one batch for a single LLM call
      const llmBatch = [];
      while (i < enabledRules.length && enabledRules[i].type === "llm") {
        llmBatch.push(enabledRules[i]);
        i++;
      }
      const matched = await classifyWithLLM(llmBatch, context.prompt, router);
      if (matched) return routeFromRule(matched);
      continue;
    }

    // Unknown type, skip
    i++;
  }

  return {
    provider: router.fallback_provider,
    model: router.fallback_model,
    ruleTitle: null,
    ruleType: null,
    isFallback: true,
  };
}

function routeFromRule(rule) {
  return {
    provider: rule.route_provider,
    model: rule.route_model,
    ruleTitle: rule.title,
    ruleType: rule.type,
    isFallback: false,
  };
}

module.exports = { resolveRouterForWorkspace, evaluateRouting };
