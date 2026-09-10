/**
 * Reasoning effort levels each provider accepts per model. A stored effort can
 * outlive a provider/model switch, so request builders validate against this
 * map before sending. Verified against live provider APIs (Sept 2026).
 * @type {Record<string, (model?: string) => string[]>}
 */
const PROVIDER_REASONING_EFFORTS = {
  // "off" is sent as "none". gpt-5.x rejects "minimal", gpt-5 rejects "none".
  openai: (model = "") => {
    if (/^gpt-5\.\d/.test(model)) return ["off", "low", "medium", "high"];
    if (model.startsWith("gpt-5")) return ["minimal", "low", "medium", "high"];
    if (model.startsWith("o")) return ["low", "medium", "high"];
    return [];
  },
  // Superset - levels vary per model. The UI list comes from their models API.
  anthropic: () => ["low", "medium", "high", "xhigh", "max"],
  // No model accepts "none"; pro models also reject "minimal".
  gemini: (model = "") =>
    model.includes("pro")
      ? ["low", "medium", "high"]
      : ["minimal", "low", "medium", "high"],
  ollama: () => ["on", "off", "low", "medium", "high", "max"],
  // "off" is sent as "none".
  lmstudio: () => ["off", "minimal", "low", "medium", "high"],
  // Lemonade does no validation of its own - this gate is the only guard.
  lemonade: () => ["off", "low", "medium", "high"],
  // Only the thinking toggle is documented.
  deepseek: () => ["on", "off"],
};

/**
 * Returns the effort when the provider's API accepts it for the model,
 * otherwise logs and returns null so no reasoning params are sent.
 * @param {string} provider - Provider key from PROVIDER_REASONING_EFFORTS
 * @param {string|null} model - Model name the request targets
 * @param {string|null} reasoningEffort - Stored effort to validate
 * @returns {string|null}
 */
function validReasoningEffort(provider, model, reasoningEffort = null) {
  if (!reasoningEffort) return null;
  const allowed = PROVIDER_REASONING_EFFORTS[provider]?.(model ?? "") ?? [];
  if (allowed.includes(reasoningEffort)) return reasoningEffort;
  console.log(
    `\x1b[36m[ReasoningEffort]\x1b[0m Ignoring reasoning effort "${reasoningEffort}" - not supported by ${provider} model "${model}".`
  );
  return null;
}

module.exports = { PROVIDER_REASONING_EFFORTS, validReasoningEffort };
