const { ModelRouter } = require("../../models/modelRouter");
const { evaluateRule } = require("./deterministic");

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
 * @param {Object} router - A model_routers record (with fallback_provider/model)
 * @param {Array} rules - Array of model_router_rules records, sorted by priority ASC
 * @param {Object} context - { prompt, conversationHistory, conversationTokenCount }
 * @returns {{ provider: string, model: string, ruleTitle: string|null, ruleType: string|null, isFallback: boolean }}
 */
function evaluateRouting(router, rules, context) {
  const enabledRules = rules.filter((r) => r.enabled);

  for (const rule of enabledRules) {
    if (evaluateRule(rule, context)) {
      return {
        provider: rule.route_provider,
        model: rule.route_model,
        ruleTitle: rule.title,
        ruleType: rule.type,
        isFallback: false,
      };
    }
  }

  return {
    provider: router.fallback_provider,
    model: router.fallback_model,
    ruleTitle: null,
    ruleType: null,
    isFallback: true,
  };
}

module.exports = { resolveRouterForWorkspace, evaluateRouting };
