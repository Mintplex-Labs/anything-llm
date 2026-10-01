const { MODEL_PRICING } = require("./modelPricing");

/**
 * Every effort level a chat session can pick. Which of these a request may actually carry depends on the provider
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

/**
 * Reasoning effort levels a local provider accepts for a model its own API
 * reports as reasoning capable. Local models are not listed on models.dev, so
 * the level style is picked from the model family. Cloud providers read their
 * levels from models.dev instead - see modelsDevReasoningCapabilities.
 * @type {Record<string, (model?: string) => string[]>}
 */
const PROVIDER_REASONING_EFFORTS = {
  // gpt-oss takes a reasoning level and ignores booleans, other thinking
  // models only take the on/off toggle.
  ollama: (model = "") =>
    model.includes("gpt-oss") ? ["low", "medium", "high"] : ["on", "off"],
  // Filtered per model by `reasoning.allowed_options` from the LM Studio
  // models API - on/off for toggle models, levels for eg: gpt-oss.
  lmstudio: () => ["off", "on", "low", "medium", "high"],
  // llama.cpp chat template kwargs: gpt-oss takes a reasoning level, other
  // thinking models only a toggle.
  lemonade: (model = "") =>
    model.includes("gpt-oss") ? ["low", "medium", "high"] : ["on", "off"],
};

// Google's documented thinking budgets for each OpenAI-compatible reasoning_effort.
const GEMINI_THINKING_BUDGETS = { low: 1024, medium: 8192, high: 24576 };

/** The models.dev reasoning options of a model, by option type. */
function modelsDevOptions(provider, model) {
  const options = MODEL_PRICING.getReasoningOptions(provider, model);
  if (options === null) return null;
  const effort = options.find((option) => option?.type === "effort");
  return {
    effortValues: Array.isArray(effort?.values) ? effort.values : [],
    budget: options.find((option) => option?.type === "budget_tokens") ?? null,
    toggle: options.some((option) => option?.type === "toggle"),
  };
}

/**
 * The reasoning capabilities models.dev lists for a cloud model, as levels
 * this provider's request format can send. A model models.dev does not list
 * gets no reasoning controls.
 * @param {"openai"|"gemini"|"deepseek"} provider
 * @param {string} model
 * @returns {{reasoning: 'unknown'|boolean, reasoningOptions: string[]}}
 */
function modelsDevReasoningCapabilities(provider, model) {
  const options = modelsDevOptions(provider, model);
  if (!options) return { reasoning: "unknown", reasoningOptions: [] };

  const levels = new Set();
  for (const value of options.effortValues)
    levels.add(provider === "openai" && value === "none" ? "off" : value);
  if (provider === "deepseek" && options.toggle) {
    levels.add("on");
    levels.add("off");
  }
  if (provider === "gemini" && options.budget) {
    for (const level of Object.keys(GEMINI_THINKING_BUDGETS)) levels.add(level);
    // A thinking toggle alongside a budget means a zero budget is allowed.
    if (options.toggle) levels.add("off");
  }

  const reasoningOptions = REASONING_EFFORT_LEVELS.filter((level) =>
    levels.has(level)
  );
  return { reasoning: reasoningOptions.length > 0, reasoningOptions };
}

/** The Gemini `thinking_config` for an effort, shaped by the model's options. */
function geminiThinkingConfig(effort, model) {
  const { budget = null } = modelsDevOptions("gemini", model) ?? {};
  if (!budget) return { thinking_level: effort, include_thoughts: true };
  if (effort === "off") return { thinking_budget: 0 };

  const min = Number.isFinite(budget.min) ? budget.min : 0;
  const max = Number.isFinite(budget.max) ? budget.max : Infinity;
  return {
    thinking_budget: Math.min(
      Math.max(GEMINI_THINKING_BUDGETS[effort], min),
      max
    ),
    include_thoughts: true,
  };
}

/**
 * Request body fields that apply a reasoning effort for a provider. The effort
 * must already be validated against the model (see resolveReasoningEffort) -
 * this only translates it to the provider's wire format.
 * @param {string} provider - Provider slug
 * @param {string|null} effort - Validated reasoning effort
 * @param {string|null} [model] - Model the request targets (shapes Gemini's thinking config)
 * @returns {object} Fields to spread into the request body, empty when no effort applies
 */
function reasoningParams(provider, effort = null, model = null) {
  if (!effort) return {};
  const toggle = ["on", "off"].includes(effort);
  switch (provider) {
    case "openai":
      // Raw reasoning is never returned - a summary is the only way to show
      // the model's thinking, so it is requested whenever reasoning is on.
      return {
        reasoning:
          effort === "off" ? { effort: "none" } : { effort, summary: "auto" },
      };
    case "anthropic":
      return { output_config: { effort } };
    case "gemini":
      // `reasoning_effort` cannot be combined with `include_thoughts`, so the
      // effort goes in the thinking config - a level for 3.x models, a budget
      // for 2.5 models - and the thoughts are returned in <thought> tags.
      return {
        extra_body: {
          google: { thinking_config: geminiThinkingConfig(effort, model) },
        },
      };
    case "ollama":
      return { think: toggle ? effort === "on" : effort };
    case "lmstudio":
      // Only levels are accepted on the wire - toggle models think at any
      // level, so "on" is sent as the middle one.
      return {
        reasoning_effort: { off: "none", on: "medium" }[effort] ?? effort,
      };
    case "lemonade":
      return {
        chat_template_kwargs: toggle
          ? { enable_thinking: effort === "on" }
          : { reasoning_effort: effort },
      };
    case "deepseek":
      if (toggle)
        return { thinking: { type: effort === "on" ? "enabled" : "disabled" } };
      return { thinking: { type: "enabled" }, reasoning_effort: effort };
    default:
      return {};
  }
}

// OpenAI only returns reasoning summaries to verified organizations - once a
// request is refused for that, summaries are no longer requested.
let reasoningSummariesUnavailable = false;

/**
 * Whether an OpenAI error is the refusal to return reasoning summaries.
 * @param {Error & {status?: number}} error
 * @returns {boolean}
 */
function isReasoningSummaryRefusal(error) {
  return (
    error?.status === 400 &&
    /summar/i.test(error?.message ?? "") &&
    /verif/i.test(error?.message ?? "")
  );
}

/**
 * Sends an OpenAI Responses API request, retrying once without the reasoning
 * summary when the organization is not allowed to receive summaries.
 * @template T
 * @param {(body: object) => Promise<T>} create - Sends the request body
 * @param {object} body - Request body, possibly with `reasoning.summary`
 * @returns {Promise<T>}
 */
async function createWithReasoningSummaryFallback(create, body) {
  const withoutSummary = () => {
    if (!body?.reasoning?.summary) return body;
    const { summary: _, ...reasoning } = body.reasoning;
    return { ...body, reasoning };
  };

  if (reasoningSummariesUnavailable) return await create(withoutSummary());
  try {
    return await create(body);
  } catch (error) {
    if (!body?.reasoning?.summary || !isReasoningSummaryRefusal(error))
      throw error;
    reasoningSummariesUnavailable = true;
    console.log(
      `\x1b[36m[ReasoningEffort]\x1b[0m Reasoning summaries are not available for this OpenAI organization - requesting without them.`
    );
    return await create(withoutSummary());
  }
}

/** Resets the summary refusal flag - for tests only. */
function resetReasoningSummaryFallback() {
  reasoningSummariesUnavailable = false;
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
 * The reasoning effort a request is sent with: the chat session's choice, but
 * only when the model's capabilities list it. A value left over from a model
 * switch, or one for a provider without reasoning controls, is never sent.
 * @param {object|(() => object)|null} connector - LLM connector the request will use, or a
 *   function building it - only called when an effort is set, and a throw resolves to null
 * @param {string|null} [sessionEffort] - Effort chosen for this chat session
 * @returns {Promise<string|null>}
 */
async function resolveReasoningEffort(connector, sessionEffort = null) {
  if (
    typeof sessionEffort !== "string" ||
    !REASONING_EFFORT_LEVELS.includes(sessionEffort)
  )
    return null;

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
  const supported = reasoningOptions.includes(sessionEffort);
  console.log(
    `\x1b[36m[ReasoningEffort]\x1b[0m ${llm.model}: ${
      supported ? sessionEffort : `none - "${sessionEffort}" not supported`
    }`
  );
  return supported ? sessionEffort : null;
}

module.exports = {
  REASONING_EFFORT_LEVELS,
  PROVIDER_REASONING_EFFORTS,
  modelsDevReasoningCapabilities,
  reasoningParams,
  getReasoningCapabilities,
  resolveReasoningEffort,
  createWithReasoningSummaryFallback,
  resetReasoningSummaryFallback,
  capabilityCache,
};
