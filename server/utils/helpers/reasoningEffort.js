/**
 * Every effort level a workspace, thread session, or the system default can
 * store. Which of these a request may actually carry depends on the provider
 * and model - see getReasoningCapabilities.
 */
const REASONING_EFFORT_LEVELS = [
  "off",
  "on",
  "minimal",
  "low",
  "medium",
  "high",
  "xhigh",
  "max",
];

// Optional dated snapshot suffix, eg: gpt-5-2025-08-07.
const SNAPSHOT = "(-\\d{4}-\\d{2}-\\d{2})?";

/**
 * OpenAI models whose accepted `reasoning.effort` values were verified against
 * the live Responses API. Models not listed here get no reasoning controls.
 * @type {Array<[RegExp, string[]]>}
 */
const OPENAI_REASONING_MODELS = [
  [new RegExp(`^gpt-5-pro${SNAPSHOT}$`), ["high"]],
  [new RegExp(`^gpt-5\\.\\d+-pro${SNAPSHOT}$`), ["medium", "high"]],
  [
    new RegExp(`^gpt-5(-mini|-nano)?${SNAPSHOT}$`),
    ["minimal", "low", "medium", "high"],
  ],
  [
    new RegExp(`^gpt-5\\.\\d+(-mini|-nano|-luna|-terra|-sol)?${SNAPSHOT}$`),
    ["off", "low", "medium", "high"],
  ],
  [
    new RegExp(`^(o1|o1-pro|o3|o3-mini|o3-pro|o4-mini)${SNAPSHOT}$`),
    ["low", "medium", "high"],
  ],
];

/**
 * Reasoning effort levels a provider accepts for a model it already reports as
 * reasoning capable. Providers with a live capability lookup (Anthropic,
 * LM Studio) are not listed - their lookup is the only source of truth.
 * @type {Record<string, (model?: string) => string[]>}
 */
const PROVIDER_REASONING_EFFORTS = {
  // "off" is sent as "none".
  openai: (model = "") =>
    OPENAI_REASONING_MODELS.find(([pattern]) => pattern.test(model))?.[1] ?? [],
  // No model accepts "none"; pro models also reject "minimal".
  gemini: (model = "") =>
    model.includes("pro")
      ? ["low", "medium", "high"]
      : ["minimal", "low", "medium", "high"],
  // gpt-oss takes a reasoning level and ignores booleans, other thinking
  // models only take the on/off toggle.
  ollama: (model = "") =>
    model.includes("gpt-oss") ? ["low", "medium", "high"] : ["on", "off"],
  // "off" is sent as "none". Filtered per model by the LM Studio models API.
  lmstudio: () => ["off", "low", "medium", "high"],
  // llama.cpp chat template kwargs: gpt-oss takes a reasoning level, other
  // thinking models only a toggle.
  lemonade: (model = "") =>
    model.includes("gpt-oss") ? ["low", "medium", "high"] : ["on", "off"],
  // Only the thinking toggle is documented.
  deepseek: () => ["on", "off"],
};

/**
 * Request body fields that apply a reasoning effort for a provider. The effort
 * must already be validated against the model (see resolveReasoningEffort) -
 * this only translates it to the provider's wire format.
 * @param {string} provider - Provider slug
 * @param {string|null} effort - Validated reasoning effort
 * @returns {object} Fields to spread into the request body, empty when no effort applies
 */
function reasoningParams(provider, effort = null) {
  if (!effort) return {};
  const toggle = ["on", "off"].includes(effort);
  switch (provider) {
    case "openai":
      return { reasoning: { effort: effort === "off" ? "none" : effort } };
    case "anthropic":
      return { output_config: { effort } };
    case "gemini":
      return { reasoning_effort: effort };
    case "ollama":
      return { think: toggle ? effort === "on" : effort };
    case "lmstudio":
      return { reasoning_effort: effort === "off" ? "none" : effort };
    case "lemonade":
      return {
        chat_template_kwargs: toggle
          ? { enable_thinking: effort === "on" }
          : { reasoning_effort: effort },
      };
    case "deepseek":
      return { thinking: { type: effort === "on" ? "enabled" : "disabled" } };
    default:
      return {};
  }
}

const CAPABILITY_CACHE_TTL_MS = 5 * 60 * 1000;
/** @type {Map<string, {expiresAt: number, capabilities: {reasoning: boolean, reasoningOptions: string[]}}>} */
const capabilityCache = new Map();

/**
 * Reasoning capabilities of the model an LLM connector targets. Some providers
 * only know this from a network lookup (Anthropic models API, Gemini model
 * info, Ollama show), so results are cached briefly per connector + model.
 * A failed lookup reports `reasoning: "unknown"` and is not cached.
 * @param {{model: string, basePath?: string, getModelCapabilities?: () => Promise<object>}|null} llm
 * @returns {Promise<{reasoning: 'unknown'|boolean, reasoningOptions: string[]}>}
 */
async function getReasoningCapabilities(llm) {
  if (typeof llm?.getModelCapabilities !== "function")
    return { reasoning: false, reasoningOptions: [] };

  const key = `${llm.constructor.name}:${llm.basePath ?? ""}:${llm.model}`;
  const cached = capabilityCache.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached.capabilities;

  const result = await llm.getModelCapabilities().catch(() => null);
  const capabilities = {
    reasoning: result?.reasoning ?? "unknown",
    reasoningOptions: Array.isArray(result?.reasoningOptions)
      ? result.reasoningOptions
      : [],
  };
  if (capabilities.reasoning !== "unknown")
    capabilityCache.set(key, {
      expiresAt: Date.now() + CAPABILITY_CACHE_TTL_MS,
      capabilities,
    });
  return capabilities;
}

/**
 * Picks the reasoning effort for a request. Candidates are tried in order -
 * the chat session's own choice, then the workspace default, then the system
 * default - and the first one the model's capabilities list wins. Anything the
 * model does not list is skipped, so a value left over from a model switch or
 * a provider without reasoning controls is never sent.
 * @param {{reasoningEffort?: string|null}|null} workspace
 * @param {object|(() => object)|null} connector - LLM connector the request will use, or a
 *   function building it - only called when an effort is set, and a throw resolves to null
 * @param {string|null} [sessionEffort] - Effort chosen for this chat session
 * @returns {Promise<string|null>}
 */
async function resolveReasoningEffort(
  workspace,
  connector,
  sessionEffort = null
) {
  const candidates = [
    ["session", sessionEffort],
    ["workspace", workspace?.reasoningEffort],
    ["system", process.env.REASONING_EFFORT],
  ].filter(
    ([, value]) => !!value && REASONING_EFFORT_LEVELS.includes(String(value))
  );
  if (!candidates.length) return null;

  let llm = connector;
  try {
    if (typeof connector === "function") llm = connector();
  } catch (e) {
    console.log(
      `\x1b[36m[ReasoningEffort]\x1b[0m Could not build the LLM connector - no reasoning effort applied. ${e.message}`
    );
    return null;
  }
  if (!llm) return null;

  const { reasoningOptions } = await getReasoningCapabilities(llm);
  for (const [source, value] of candidates) {
    if (reasoningOptions.includes(value)) {
      console.log(
        `\x1b[36m[ReasoningEffort]\x1b[0m Using ${source} reasoning effort "${value}" for model "${llm.model}".`
      );
      return value;
    }
    console.log(
      `\x1b[36m[ReasoningEffort]\x1b[0m Skipping ${source} reasoning effort "${value}" - not supported by model "${llm.model}".`
    );
  }
  return null;
}

module.exports = {
  REASONING_EFFORT_LEVELS,
  PROVIDER_REASONING_EFFORTS,
  reasoningParams,
  getReasoningCapabilities,
  resolveReasoningEffort,
  capabilityCache,
};
