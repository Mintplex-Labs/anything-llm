const { toNonNegativeNumber } = require("../numbers");

/**
 * @typedef {Object} TokenUsage
 * @property {number} prompt_tokens - every prompt token, including cached ones
 * @property {number} completion_tokens - every completion token, including reasoning ones
 * @property {number} [cache_read_tokens] - prompt tokens read from the provider's cache (present when above zero)
 * @property {number} [cache_write_tokens] - prompt tokens written to the provider's cache (present when above zero)
 * @property {number} [reasoning_tokens] - completion tokens spent on reasoning (present when above zero)
 */

/** The counts inside the prompt and completion totals that have their own rates. */
const TOKEN_DETAIL_KEYS = [
  "cache_read_tokens",
  "cache_write_tokens",
  "reasoning_tokens",
];

/**
 * Converts a provider usage payload into one shape so cached and reasoning
 * tokens can be priced at their own rates. Understands:
 *  - OpenAI chat completions: `prompt_tokens_details.cached_tokens`, `completion_tokens_details.reasoning_tokens`
 *  - OpenAI responses: `input_tokens_details.cached_tokens`, `output_tokens_details.reasoning_tokens`
 *  - Anthropic: `cache_read_input_tokens` and `cache_creation_input_tokens`, which are reported
 *    next to `input_tokens` instead of inside it, so they are added to the prompt total
 *  - an already normalized usage, which is returned as is
 * Sub-counts are capped at their total so a malformed payload cannot produce a negative cost.
 * @param {unknown} usage
 * @returns {TokenUsage}
 */
function normalizeTokenUsage(usage = {}) {
  const raw = usage && typeof usage === "object" ? usage : {};
  const promptDetails =
    raw.prompt_tokens_details ?? raw.input_tokens_details ?? {};
  const completionDetails =
    raw.completion_tokens_details ?? raw.output_tokens_details ?? {};
  const cacheReportedBesidePrompt =
    "cache_read_input_tokens" in raw || "cache_creation_input_tokens" in raw;

  let cacheRead = toNonNegativeNumber(
    raw.cache_read_tokens ??
      raw.cache_read_input_tokens ??
      promptDetails?.cached_tokens
  );
  let cacheWrite = toNonNegativeNumber(
    raw.cache_write_tokens ??
      raw.cache_creation_input_tokens ??
      promptDetails?.cache_write_tokens
  );
  let promptTokens = toNonNegativeNumber(raw.prompt_tokens || raw.input_tokens);
  if (cacheReportedBesidePrompt) promptTokens += cacheRead + cacheWrite;
  cacheRead = Math.min(cacheRead, promptTokens);
  cacheWrite = Math.min(cacheWrite, promptTokens - cacheRead);

  const completionTokens = toNonNegativeNumber(
    raw.completion_tokens || raw.output_tokens
  );
  const reasoning = Math.min(
    toNonNegativeNumber(
      raw.reasoning_tokens ?? completionDetails?.reasoning_tokens
    ),
    completionTokens
  );

  return {
    prompt_tokens: promptTokens,
    completion_tokens: completionTokens,
    ...(cacheRead ? { cache_read_tokens: cacheRead } : {}),
    ...(cacheWrite ? { cache_write_tokens: cacheWrite } : {}),
    ...(reasoning ? { reasoning_tokens: reasoning } : {}),
  };
}

/**
 * Only the cached and reasoning counts of a provider usage payload, for
 * callers that already track the prompt and completion totals themselves.
 * @param {unknown} usage
 * @returns {{cache_read_tokens?: number, cache_write_tokens?: number, reasoning_tokens?: number}}
 */
function tokenDetails(usage = {}) {
  const normalized = normalizeTokenUsage(usage);
  const details = {};
  for (const key of TOKEN_DETAIL_KEYS)
    if (normalized[key]) details[key] = normalized[key];
  return details;
}

/**
 * The prompt side of a provider usage payload, for providers that report the
 * prompt and the completion in separate stream events.
 * @param {unknown} usage
 * @returns {{prompt_tokens: number, cache_read_tokens?: number, cache_write_tokens?: number}}
 */
function promptUsage(usage = {}) {
  const normalized = normalizeTokenUsage(usage);
  const prompt = { prompt_tokens: normalized.prompt_tokens };
  for (const key of ["cache_read_tokens", "cache_write_tokens"])
    if (normalized[key]) prompt[key] = normalized[key];
  return prompt;
}

module.exports = {
  TOKEN_DETAIL_KEYS,
  normalizeTokenUsage,
  tokenDetails,
  promptUsage,
};
