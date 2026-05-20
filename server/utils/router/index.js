const { ModelRouter } = require("../../models/modelRouter");
const { evaluateRule } = require("./deterministic");
const {
  classifyWithLLM,
} = require("../agents/aibitat/plugins/router-classifier");

const LOG_PREFIX = "\x1b[35m[ModelRouter]\x1b[0m";
function log(text, ...args) {
  console.log(`${LOG_PREFIX} ${text}`, ...args);
}

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
  log(
    `Evaluating ${enabledRules.length} enabled rules (of ${rules.length} total) for router "${router.name}"`
  );
  log(
    `Context: prompt="${(context.prompt || "").slice(0, 100)}${context.prompt?.length > 100 ? "..." : ""}", ` +
      `tokens=${context.conversationTokenCount ?? 0}, messages=${context.conversationMessageCount ?? 0}, ` +
      `attachments=${context.attachments?.length ?? 0}`
  );

  let i = 0;
  while (i < enabledRules.length) {
    const rule = enabledRules[i];

    if (rule.type === "calculated") {
      const matched = evaluateRule(rule, context);
      log(
        `Rule #${i + 1} "${rule.title}" (calculated, ${rule.condition_logic}): ${matched ? "MATCHED" : "no match"}`
      );
      if (matched) {
        log(`→ Routing to ${rule.route_provider}/${rule.route_model}`);
        return routeFromRule(rule);
      }
      i++;
      continue;
    }

    if (rule.type === "llm") {
      const llmBatch = [];
      while (i < enabledRules.length && enabledRules[i].type === "llm") {
        llmBatch.push(enabledRules[i]);
        i++;
      }
      log(
        `Evaluating LLM batch of ${llmBatch.length} rules: [${llmBatch.map((r) => `"${r.title}"`).join(", ")}]`
      );
      const matched = await classifyWithLLM(llmBatch, context.prompt, router);
      if (matched) {
        log(
          `LLM classified as "${matched.title}" → Routing to ${matched.route_provider}/${matched.route_model}`
        );
        return routeFromRule(matched);
      }
      log(`LLM batch: no match`);
      continue;
    }

    log(
      `Rule #${i + 1} "${rule.title}": unknown type "${rule.type}", skipping`
    );
    i++;
  }

  log(
    `No rules matched → Using fallback ${router.fallback_provider}/${router.fallback_model}`
  );
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
