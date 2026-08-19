const path = require("path");
const fs = require("fs");
const { toNonNegativeNumber } = require("../numbers");

/**
 * @typedef {Object} ModelCost - USD per 1,000,000 tokens (models.dev conventions)
 * @property {number} input - cost per 1M prompt tokens
 * @property {number} output - cost per 1M completion tokens
 * @property {number} [cache_read] - cost per 1M cached prompt tokens read (falls back to `input`)
 * @property {number} [cache_write] - cost per 1M prompt tokens written to cache (falls back to `input`)
 * @property {number} [reasoning] - cost per 1M reasoning tokens (falls back to `output`)
 * @property {Array<ModelCost & {tier: {type: string, size: number}}>} [tiers] - long-context pricing tiers
 * @property {ModelCost} [context_over_200k] - legacy long-context pricing (prefer `tiers`)
 */

/**
 * @typedef {Object} CostBreakdown
 * @property {number} inputCost - USD cost of the prompt tokens
 * @property {number} outputCost - USD cost of the completion tokens
 * @property {number} totalCost - USD sum of input and output costs
 */

const FREE_PROVIDERS = [
  "ollama",
  "lmstudio",
  "localai",
  "koboldcpp",
  "textgenwebui",
  "omlx",
  "lemonade",
  "docker-model-runner",
];

/**
 * AnythingLLM provider slug -> models.dev provider id.
 * A missing/stale mapping degrades to "unknown", never a wrong price.
 */
const PROVIDER_ID_MAP = {
  openai: "openai",
  azure: "azure",
  anthropic: "anthropic",
  gemini: "google",
  togetherai: "togetherai",
  fireworksai: "fireworks-ai",
  mistral: "mistral",
  perplexity: "perplexity",
  openrouter: "openrouter",
  novita: "novita-ai",
  groq: "groq",
  cohere: "cohere",
  bedrock: "amazon-bedrock",
  deepseek: "deepseek",
  xai: "xai",
  moonshotai: "moonshotai",
  zai: "zai",
  minimax: "minimax",
  cerebras: "cerebras",
};

const CACHE_EXPIRY_MS = 1000 * 60 * 60 * 24 * 3; // 3 days
const REMOTE_URL = "https://models.dev/api.json";
const FETCH_TIMEOUT_MS = 5000;

function cacheDir() {
  return path.resolve(
    process.env.STORAGE_DIR
      ? path.resolve(process.env.STORAGE_DIR, "models", "pricing")
      : path.resolve(__dirname, "../../../storage/models/pricing")
  );
}

const CACHE_FILES = {
  get data() {
    return path.resolve(cacheDir(), "model-pricing.json");
  },
  get expiry() {
    return path.resolve(cacheDir(), ".cached_at");
  },
  get etag() {
    return path.resolve(cacheDir(), ".etag");
  },
};

/**
 * Extracts only cost data from the full models.dev API response.
 * Models with absent or null cost are dropped so a lookup miss
 * cleanly signals "unknown pricing".
 * @param {Object} apiJson - full models.dev response: `{provider: {models: {model: {cost: ModelCost}}}}`
 * @returns {Record<string, Record<string, ModelCost>>} flattened to `{provider: {model: ModelCost}}`
 */
function slim(apiJson = {}) {
  const slimmed = {};
  for (const [providerId, provider] of Object.entries(apiJson)) {
    if (!provider?.models || typeof provider.models !== "object") continue;
    for (const [modelId, model] of Object.entries(provider.models)) {
      if (!model?.cost || typeof model.cost !== "object") continue;
      if (typeof model.cost.input !== "number") continue;
      slimmed[providerId] ??= {};
      slimmed[providerId][modelId] = model.cost;
    }
  }
  return slimmed;
}

/**
 * Strips region prefix and version suffix from a Bedrock model id
 * so that e.g. `us.anthropic.claude-3-haiku-v1:0` matches `anthropic.claude-3-haiku`.
 * @param {string} modelId
 * @returns {string}
 */
function normalizeBedrockId(modelId = "") {
  return modelId
    .replace(/^(us|eu|ap|apac|jp|au|global)\./, "")
    .replace(/-v\d+(:\d+)?$/, "");
}

function log(text, ...args) {
  if (process.env.NODE_ENV === "test") return;
  console.log(`\x1b[36m[ModelPricing]\x1b[0m ${text}`, ...args);
}

class ModelPricing {
  static instance = null;

  /** @type {Record<string, Record<string, ModelCost>>|null} */
  #pricing = null;
  /** @type {boolean} - true when data came from disk cache (safe to send etag) */
  #hasDiskCache = false;
  /** @type {Record<string, Record<string, string>>} - lazy case-insensitive index per provider */
  #lowercaseIndexes = {};
  /** @type {Record<string, Record<string, string>>} - lazy bedrock normalization index per provider */
  #normalizedIndexes = {};

  constructor() {
    if (ModelPricing.instance) return ModelPricing.instance;
    ModelPricing.instance = this;

    const dir = cacheDir();
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    this.#loadFromDisk();
    if (this.#isCacheStale() || !this.#pricing) {
      this.#refresh()
        .then(() => {
          if (this.#pricing)
            console.log(`⚡\x1b[32mPre-cached model pricing data\x1b[0m`);
        })
        .catch((err) =>
          log("Background pricing refresh failed:", err?.message)
        );
    } else {
      console.log(`⚡\x1b[32mPre-cached model pricing data\x1b[0m`);
    }
  }

  #isCacheStale() {
    if (!fs.existsSync(CACHE_FILES.expiry)) return true;
    const cachedAt = Number(fs.readFileSync(CACHE_FILES.expiry, "utf8"));
    if (!Number.isFinite(cachedAt)) return true;
    return Date.now() - cachedAt > CACHE_EXPIRY_MS;
  }

  #loadFromDisk() {
    try {
      if (!fs.existsSync(CACHE_FILES.data)) return;
      this.#pricing = JSON.parse(
        fs.readFileSync(CACHE_FILES.data, { encoding: "utf8" })
      );
      this.#hasDiskCache = true;
    } catch (error) {
      log("Failed to read pricing cache from disk", error?.message);
      this.#pricing = null;
      this.#hasDiskCache = false;
    }
  }

  async #refresh() {
    try {
      const headers = {};
      if (this.#hasDiskCache && fs.existsSync(CACHE_FILES.etag)) {
        const etag = fs.readFileSync(CACHE_FILES.etag, "utf8").trim();
        if (etag) headers["If-None-Match"] = etag;
      }

      const response = await fetch(REMOTE_URL, {
        headers,
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      });
      if (response.status === 304) {
        await fs.promises.writeFile(CACHE_FILES.expiry, Date.now().toString());
        log("Remote pricing unchanged (304) - cache expiry bumped.");
        return;
      }

      if (response.status !== 200)
        throw new Error(`HTTP ${response.status} from ${REMOTE_URL}`);

      const data = await response.json();
      const pricing = slim(data);
      if (!Object.keys(pricing).length)
        throw new Error("Remote pricing data contained no usable cost data");

      this.#pricing = pricing;
      this.#hasDiskCache = true;
      this.#clearIndexes();

      const etag = response.headers.get("etag");
      await Promise.all([
        fs.promises.writeFile(CACHE_FILES.data, JSON.stringify(pricing)),
        fs.promises.writeFile(CACHE_FILES.expiry, Date.now().toString()),
        etag
          ? fs.promises.writeFile(CACHE_FILES.etag, etag)
          : Promise.resolve(),
      ]);
      log("Remote pricing data synced and cached.");
    } catch (error) {
      log("Error syncing remote pricing data", error?.message);
    }
  }

  #clearIndexes() {
    this.#lowercaseIndexes = {};
    this.#normalizedIndexes = {};
  }

  #findModelCost(providerId, providerSlug, model) {
    const models = this.#pricing?.[providerId];
    if (!models) return null;
    if (models[model]) return models[model];

    if (!this.#lowercaseIndexes[providerId]) {
      const index = {};
      for (const key of Object.keys(models)) index[key.toLowerCase()] = key;
      this.#lowercaseIndexes[providerId] = index;
    }
    const caseMatch = this.#lowercaseIndexes[providerId][model.toLowerCase()];
    if (caseMatch) return models[caseMatch];

    if (providerSlug === "bedrock") {
      if (!this.#normalizedIndexes[providerId]) {
        const index = {};
        for (const key of Object.keys(models)) {
          const normalized = normalizeBedrockId(key);
          if (!index[normalized] || key.length < index[normalized].length)
            index[normalized] = key;
        }
        this.#normalizedIndexes[providerId] = index;
      }
      const normalizedMatch =
        this.#normalizedIndexes[providerId][normalizeBedrockId(model)];
      if (normalizedMatch) return models[normalizedMatch];
    }

    return null;
  }

  #resolveRates(cost, promptTokens) {
    let input = typeof cost.input === "number" ? cost.input : null;
    let output = typeof cost.output === "number" ? cost.output : null;

    if (Array.isArray(cost.tiers)) {
      const applicable = cost.tiers
        .filter(
          (t) => t?.tier?.type === "context" && promptTokens > t.tier.size
        )
        .sort((a, b) => a.tier.size - b.tier.size)
        .pop();
      if (applicable) {
        input = applicable.input ?? input;
        output = applicable.output ?? output;
      }
    } else if (cost.context_over_200k && promptTokens > 200_000) {
      input = cost.context_over_200k.input ?? input;
      output = cost.context_over_200k.output ?? output;
    }

    if (typeof input !== "number" || typeof output !== "number") return null;
    return { input, output };
  }

  /**
   * @param {string|null} providerSlug - AnythingLLM provider slug
   * @param {string|null} model - model id used for the completion
   * @param {{prompt_tokens?: number, completion_tokens?: number}} usage
   * @returns {CostBreakdown|null} null means "unknown" - callers should omit cost fields, not show zero
   */
  getCostBreakdown(providerSlug = null, model = null, usage = {}) {
    if (!providerSlug) return null;
    if (FREE_PROVIDERS.includes(providerSlug))
      return { inputCost: 0, outputCost: 0, totalCost: 0 };

    const providerId = PROVIDER_ID_MAP[providerSlug];
    if (!providerId || !model || typeof model !== "string" || !this.#pricing)
      return null;

    const cost = this.#findModelCost(providerId, providerSlug, model);
    if (!cost) return null;

    const promptTokens = toNonNegativeNumber(usage?.prompt_tokens);
    const completionTokens = toNonNegativeNumber(usage?.completion_tokens);
    const rates = this.#resolveRates(cost, promptTokens);
    if (!rates) return null;

    const inputCost = parseFloat(
      ((promptTokens / 1_000_000) * rates.input).toFixed(10)
    );
    const outputCost = parseFloat(
      ((completionTokens / 1_000_000) * rates.output).toFixed(10)
    );
    const totalCost = parseFloat((inputCost + outputCost).toFixed(10));
    return { inputCost, outputCost, totalCost };
  }

  get isCacheStale() {
    return this.#isCacheStale();
  }
}

const MODEL_PRICING = new ModelPricing();

/**
 * Enriches a metrics object with inputCost, outputCost, and totalCost (USD).
 * Returns the original metrics unchanged when pricing is unavailable.
 * @param {Object} metrics - must contain `prompt_tokens` and `completion_tokens`
 * @param {Object} opts
 * @param {string|null} opts.provider - AnythingLLM provider slug
 * @param {string|null} opts.model - model id (falls back to `metrics.model`)
 * @returns {Object} metrics, optionally extended with cost fields
 */
function addCostToMetrics(
  metrics = {},
  { provider = null, model = null } = {}
) {
  if (!metrics || typeof metrics !== "object" || !Object.keys(metrics).length)
    return metrics;

  const breakdown = MODEL_PRICING.getCostBreakdown(
    provider,
    model ?? metrics.model,
    {
      prompt_tokens: metrics.prompt_tokens,
      completion_tokens: metrics.completion_tokens,
    }
  );
  return breakdown ? { ...metrics, ...breakdown } : metrics;
}

/**
 * Chat-specific wrapper around {@link addCostToMetrics} that resolves the
 * provider and model from routing metadata, workspace config, or env fallback.
 * @param {Object} metrics - must contain `prompt_tokens` and `completion_tokens`
 * @param {Object} opts
 * @param {Object|null} opts.routingMetadata - model router result (if routing is enabled)
 * @param {Object|null} opts.workspace - workspace record (fallback for provider)
 * @param {Object|null} opts.connector - LLM connector instance (fallback for model)
 * @returns {Object} metrics, optionally extended with cost fields
 */
function addChatCostToMetrics(
  metrics = {},
  { routingMetadata = null, workspace = null, connector = null } = {}
) {
  return addCostToMetrics(metrics, {
    provider:
      routingMetadata?.routedTo?.provider ??
      workspace?.chatProvider ??
      process.env.LLM_PROVIDER,
    model: routingMetadata?.routedTo?.model ?? connector?.model,
  });
}

module.exports = {
  ModelPricing,
  MODEL_PRICING,
  addCostToMetrics,
  addChatCostToMetrics,
  FREE_PROVIDERS,
  PROVIDER_ID_MAP,
};
