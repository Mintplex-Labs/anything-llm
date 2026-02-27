const { toValidNumber } = require("../../http");

const PARAM_ENV_KEYS = [
  { prop: "maxTokens", envKey: "OPENROUTER_MAX_TOKENS", apiKey: "max_tokens" },
  { prop: "topP", envKey: "OPENROUTER_TOP_P", apiKey: "top_p" },
  { prop: "topK", envKey: "OPENROUTER_TOP_K", apiKey: "top_k" },
  { prop: "minP", envKey: "OPENROUTER_MIN_P", apiKey: "min_p" },
  {
    prop: "frequencyPenalty",
    envKey: "OPENROUTER_FREQUENCY_PENALTY",
    apiKey: "frequency_penalty",
  },
  {
    prop: "presencePenalty",
    envKey: "OPENROUTER_PRESENCE_PENALTY",
    apiKey: "presence_penalty",
  },
  {
    prop: "repetitionPenalty",
    envKey: "OPENROUTER_REPETITION_PENALTY",
    apiKey: "repetition_penalty",
  },
  { prop: "topA", envKey: "OPENROUTER_TOP_A", apiKey: "top_a" },
  { prop: "seed", envKey: "OPENROUTER_SEED", apiKey: "seed" },
];

/**
 * Reads OpenRouter model parameters from ENV and assigns them as properties on the target object.
 * Values are parsed as numbers; unset ENV vars result in null (omitted from API calls).
 * @param {Object} target - The object to assign parameter properties to (e.g. `this`).
 */
function assignOpenRouterModelParams(target) {
  for (const { prop, envKey } of PARAM_ENV_KEYS) {
    target[prop] = process.env[envKey]
      ? toValidNumber(process.env[envKey], null)
      : null;
  }
}

/**
 * Builds an object of optional model parameters from the target, only including non-null values.
 * OpenRouter uses its own defaults when parameters are absent.
 * @param {Object} target - The object with parameter properties (e.g. `this`).
 * @returns {Object} API-ready parameter object.
 */
function getOpenRouterModelParams(target) {
  const params = {};
  for (const { prop, apiKey } of PARAM_ENV_KEYS) {
    if (target[prop] !== null) params[apiKey] = target[prop];
  }
  return params;
}

module.exports = {
  assignOpenRouterModelParams,
  getOpenRouterModelParams,
};
