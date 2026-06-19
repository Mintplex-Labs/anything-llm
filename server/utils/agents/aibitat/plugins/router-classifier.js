const AIbitat = require("../index.js");

/**
 * Internal-only aibitat tool used by the model router to classify a prompt
 * against an enumerated list of semantic rule titles. Not exposed as a
 * user-facing skill (not in DEFAULT_SKILLS or default_agent_skills setting).
 *
 * Driven by `classifyWithLLM()` below, which spins up a headless AIbitat
 * instance whose only job is to invoke `select_category` once. The handler
 * captures the chosen category onto the aibitat instance and terminates the
 * chat via `skipHandleExecution` + a "TERMINATE" reply.
 */
const routerClassifier = {
  name: "router-classifier",
  startupConfig: {
    params: {},
  },
  plugin: function ({ categories = [] } = {}) {
    return {
      name: routerClassifier.name,
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: "select_category",
          description:
            "Select the category that best matches the user's message. Pick the FIRST category whose description matches the message, in the priority order listed. If no category matches, select 'none'.",
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              category: {
                type: "string",
                enum: [...categories, "none"],
                description:
                  "The exact category name from the list, or 'none' if no category matches.",
              },
            },
            required: ["category"],
            additionalProperties: false,
          },
          handler: async function ({ category }) {
            this.super.classifiedCategory = category || "none";
            this.super.skipHandleExecution = true;
            return "TERMINATE";
          },
        });
      },
    };
  },
};

const CLASSIFIER_AGENT = "@router-classifier";

const CLASSIFIER_SYSTEM_PROMPT = `You are a message classifier for a model router. Given the user's message, you MUST call the \`select_category\` tool exactly once with the category that best matches. The categories are listed in priority order — pick the FIRST category whose description matches the user's message. If no category matches, pass "none".

Categories:
{categories}

Do not respond with free text. Always call the tool.`;

/**
 * Classify a user prompt against a batch of LLM rules using the router's
 * fallback provider/model. Runs a headless AIbitat instance with a single
 * internal tool (`select_category`) so tool-call infra is reused across
 * every provider instead of custom text parsing.
 * @param {Array} rules - Contiguous batch of enabled LLM-type rules (priority-sorted)
 * @param {string} prompt - The user's message to classify
 * @param {Object} router - The router record (needs fallback_provider/fallback_model)
 * @returns {Promise<Object|null>} The matched rule, or null if none matched
 */
async function classifyWithLLM(rules, prompt, router) {
  if (!rules.length || !prompt) return null;

  const validRules = rules.filter((rule) => rule.description);
  if (!validRules.length) return null;

  const categoryList = validRules
    .map((rule) => `- ${rule.title}: ${rule.description}`)
    .join("\n");

  const systemPrompt = CLASSIFIER_SYSTEM_PROMPT.replace(
    "{categories}",
    categoryList
  );

  try {
    const aibitat = new AIbitat({
      provider: router.fallback_provider,
      model: router.fallback_model,
      // Safety net: if the provider refuses to call the tool and responds
      // with free text, cap the chat at one round so we don't loop.
      maxRounds: 1,
    });

    aibitat.use(
      routerClassifier.plugin({
        categories: validRules.map((rule) => rule.title),
      })
    );
    aibitat.agent(CLASSIFIER_AGENT, {
      role: systemPrompt,
      functions: ["select_category"],
    });

    await aibitat.start({
      from: "USER",
      to: CLASSIFIER_AGENT,
      content: prompt,
    });

    const selected = aibitat.classifiedCategory?.toLowerCase();
    if (!selected || selected === "none") return null;
    return (
      validRules.find((rule) => rule.title.toLowerCase() === selected) || null
    );
  } catch (error) {
    console.error("[RouterClassifier] Classification failed:", error.message);
    return null;
  }
}

module.exports = { routerClassifier, classifyWithLLM };
