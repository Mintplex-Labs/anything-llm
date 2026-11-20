const path = require("path");
const fs = require("fs");
const { toNonNegativeNumber } = require("../numbers");
const { normalizeTokenUsage } = require("./usage");
const {
  CURRENCY_EXCHANGE,
  isSupportedCurrency,
} = require("../currencyExchange");

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
 * @typedef {Object} PricingOverride - admin-defined price per 1,000,000 tokens
 * @property {string} provider - AnythingLLM provider slug
 * @property {string|null} model - model id, null applies to every model of the provider
 * @property {number} input - cost per 1M prompt tokens, in `currency`
 * @property {number} output - cost per 1M completion tokens, in `currency`
 * @property {string} currency - currency the admin entered the price in. The price is kept in
 *   this currency and only converted to USD when a completion is costed.
 */

/**
 * @typedef {Object} TokenRates - USD per 1,000,000 tokens
 * @property {number} input
 * @property {number} output
 * @property {number} cache_read - cached prompt tokens read
 * @property {number} cache_write - prompt tokens written to cache
 * @property {number} reasoning - reasoning tokens
 */

/**
 * @typedef {Object} CostBreakdown
 * @property {number} inputCost - USD cost of the prompt tokens (cached ones at their own rates)
 * @property {number} outputCost - USD cost of the completion tokens (reasoning ones at their own rate)
 * @property {number} totalCost - USD sum of input and output costs
 * @property {false} [costKnown] - only present, as false, when no price is known for the model.
 *   The costs are then zero and callers can tell "unknown" apart from "free".
 */

/**
 * Thrown when an admin submits a pricing override that cannot be saved.
 * The message is safe to show to the admin.
 */
class InvalidPricingOverrideError extends Error {}

const FREE_PROVIDERS = [
  "ollama",
  "lmstudio",
  "localai",
  "koboldcpp",
  "textgenwebui",
  "omlx",
  "lemonade",
  "llmman",
  "foundry",
];

/**
 * Providers explicitly excluded from both FREE_PROVIDERS and PROVIDER_ID_MAP.
 * These record zero cost unless an admin pricing override exists — not forgotten, just unsupported:
 *  - generic-openai, litellm: proxies to arbitrary backends, no way to determine cost
 *  - apipie, cometapi, ppio, sambanova, giteeai, privatemode: cloud aggregators with costs but no models.dev listing
 *  - nvidia-nim: self-hosted NIM, model set is user-defined and unaccounted for
 */

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

const MAX_OVERRIDES = 500;
const CACHE_EXPIRY_MS = 1000 * 60 * 60 * 24 * 3; // 3 days
const REMOTE_URL = "https://models.dev/api.json";
const FETCH_TIMEOUT_MS = 5000;
const EXCHANGE_REFRESH_MS = 1000 * 60 * 60; // 1 hour

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
  get reasoning() {
    return path.resolve(cacheDir(), "model-reasoning.json");
  },
};

// Overrides are saved to a file and indexed in memory when the process boots,
// so cost lookups stay synchronous (getCostBreakdown runs inside sync usage
// accounting) and touch no disk. Worker threads, like scheduled jobs, boot per
// run and so read the prices the admin last saved in the main process.
function overridesFile() {
  return path.resolve(cacheDir(), "overrides.json");
}

/**
 * Lookup key for an override. Model ids match case-insensitively and a null
 * model is the provider-wide override.
 * @param {string} provider
 * @param {string|null} model
 * @returns {string}
 */
function overrideKey(provider, model) {
  return JSON.stringify([provider, model?.toLowerCase() ?? null]);
}

/** @returns {CostBreakdown} zero cost flagged as not known */
function unknownCost() {
  return { inputCost: 0, outputCost: 0, totalCost: 0, costKnown: false };
}

/** Fixes a USD amount to the 10 decimals costs are stored with. */
function roundCost(amount) {
  return parseFloat(amount.toFixed(10));
}

const RATE_KEYS = ["input", "output", "cache_read", "cache_write", "reasoning"];

/**
 * Fills the cached and reasoning rates a price does not list with the rate
 * providers bill them at by default.
 * @param {{input: number, output: number, cache_read?: number, cache_write?: number, reasoning?: number}} rates
 * @returns {TokenRates}
 */
function completeRates(rates) {
  const rate = (value, fallback) =>
    typeof value === "number" ? value : fallback;
  return {
    input: rates.input,
    output: rates.output,
    cache_read: rate(rates.cache_read, rates.input),
    cache_write: rate(rates.cache_write, rates.input),
    reasoning: rate(rates.reasoning, rates.output),
  };
}

/**
 * A price must be a finite, non-negative number (or numeric string). Anything
 * else is rejected rather than coerced to 0, since a $0 override would hide
 * the models.dev price for that model.
 * @param {unknown} value
 * @returns {number|null}
 */
function parsePrice(value) {
  if (typeof value === "string" && !value.trim()) return null;
  if (typeof value !== "number" && typeof value !== "string") return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

/**
 * Reads the currency of an override entry. An entry without one is in USD.
 * @param {unknown} currency
 * @returns {string|null} null when the currency is not supported
 */
function parseOverrideCurrency(currency) {
  if (currency === undefined || currency === null) return "USD";
  if (typeof currency !== "string") return null;
  const code = currency.trim().toUpperCase();
  return isSupportedCurrency(code) ? code : null;
}

/**
 * Reads one override entry.
 * @param {unknown} entry
 * @returns {{override?: PricingOverride, error?: string}} the parsed override, or why it is invalid
 */
function parseOverride(entry) {
  if (!entry || typeof entry !== "object")
    return { error: "A model price must be an object." };
  const provider =
    typeof entry.provider === "string" ? entry.provider.trim() : "";
  if (!provider) return { error: "A model price is missing its provider." };
  const model =
    typeof entry.model === "string" && entry.model.trim()
      ? entry.model.trim()
      : null;
  const name = `${provider} / ${model ?? "all models"}`;

  const input = parsePrice(entry.input);
  const output = parsePrice(entry.output);
  if (input === null || output === null)
    return {
      error: `The input and output price for ${name} must be numbers of zero or more.`,
    };

  const currency = parseOverrideCurrency(entry.currency);
  if (!currency) return { error: `The currency for ${name} is not supported.` };

  return { override: { provider, model, input, output, currency } };
}

/**
 * Lenient read used for the saved file: malformed entries are dropped and
 * duplicates of a provider + model keep the last one, so a hand-edited or
 * partly corrupt file still loads what it can.
 * @param {unknown} overrides
 * @returns {PricingOverride[]}
 */
function sanitizeOverrides(overrides) {
  if (!Array.isArray(overrides)) return [];
  const byKey = new Map();
  for (const entry of overrides) {
    const { override } = parseOverride(entry);
    if (override)
      byKey.set(overrideKey(override.provider, override.model), override);
  }
  return Array.from(byKey.values());
}

/**
 * Strict read used when an admin saves: the first invalid or duplicate entry
 * rejects the whole save, so nothing is silently dropped.
 * @param {unknown} overrides
 * @returns {PricingOverride[]}
 * @throws {InvalidPricingOverrideError}
 */
function validateOverrides(overrides) {
  if (!Array.isArray(overrides))
    throw new InvalidPricingOverrideError("Model prices must be a list.");
  if (overrides.length > MAX_OVERRIDES)
    throw new InvalidPricingOverrideError(
      `Cannot save more than ${MAX_OVERRIDES} model prices.`
    );

  const byKey = new Map();
  for (const entry of overrides) {
    const { override, error } = parseOverride(entry);
    if (error) throw new InvalidPricingOverrideError(error);
    const key = overrideKey(override.provider, override.model);
    if (byKey.has(key))
      throw new InvalidPricingOverrideError(
        `A price for ${override.provider} / ${override.model ?? "all models"} already exists.`
      );
    byKey.set(key, override);
  }
  return Array.from(byKey.values());
}

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
 * Extracts the reasoning options of every reasoning model from the full
 * models.dev API response. Models without reasoning are dropped, so a lookup
 * miss means the model has no reasoning controls.
 * @param {Object} apiJson - full models.dev response: `{provider: {models: {model: {reasoning, reasoning_options}}}}`
 * @returns {Record<string, Record<string, Array<object>>>} flattened to `{provider: {model: reasoning_options}}`
 */
function slimReasoning(apiJson = {}) {
  const slimmed = {};
  for (const [providerId, provider] of Object.entries(apiJson)) {
    if (!provider?.models || typeof provider.models !== "object") continue;
    for (const [modelId, model] of Object.entries(provider.models)) {
      if (model?.reasoning !== true || !Array.isArray(model.reasoning_options))
        continue;
      slimmed[providerId] ??= {};
      slimmed[providerId][modelId] = model.reasoning_options;
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

  /** @type {Promise<void>} - settles when the constructor's background refresh finishes (or immediately when the cache was fresh) */
  bootRefresh = Promise.resolve();

  /** @type {Record<string, Record<string, ModelCost>>|null} */
  #pricing = null;
  /** @type {boolean} - true when data came from disk cache (safe to send etag) */
  #hasDiskCache = false;
  /** @type {Record<string, Record<string, Array<object>>>|null} */
  #reasoning = null;
  /** @type {Record<string, Record<string, string>>} - lazy case-insensitive index per provider */
  #lowercaseIndexes = {};
  /** @type {Record<string, Record<string, string>>} - lazy bedrock normalization index per provider */
  #normalizedIndexes = {};
  /** @type {PricingOverride[]} - admin overrides, in saved order */
  #overrides = [];
  /** @type {Map<string, PricingOverride>} - the same overrides keyed by {@link overrideKey} */
  #overrideIndex = new Map();
  /** @type {number} - epoch ms an exchange rate refresh was last asked for */
  #exchangeRefreshAskedAt = 0;

  constructor() {
    if (ModelPricing.instance) return ModelPricing.instance;
    ModelPricing.instance = this;

    const dir = cacheDir();
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    this.#loadFromDisk();
    this.#loadOverrides();
    if (this.#isCacheStale() || !this.#pricing || !this.#reasoning) {
      this.bootRefresh = this.#refresh()
        .then(() => {
          if (this.#pricing)
            log(`⚡\x1b[32mPre-cached model pricing data\x1b[0m`);
        })
        .catch((err) =>
          log("Background pricing refresh failed:", err?.message)
        );
    } else {
      this.bootRefresh = Promise.resolve();
      log(`⚡\x1b[32mPre-cached model pricing data\x1b[0m`);
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
      return;
    }

    // A cache written before reasoning options were kept has no reasoning
    // file. The pricing stays usable, and the etag is dropped so the next
    // refresh is a full GET that fills in the reasoning options.
    try {
      this.#reasoning = JSON.parse(
        fs.readFileSync(CACHE_FILES.reasoning, { encoding: "utf8" })
      );
    } catch {
      this.#reasoning = null;
      fs.rmSync(CACHE_FILES.etag, { force: true });
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

      const reasoning = slimReasoning(data);
      this.#pricing = pricing;
      this.#reasoning = reasoning;
      this.#hasDiskCache = true;
      this.#clearIndexes();

      const etag = response.headers.get("etag");
      await Promise.all([
        fs.promises.writeFile(CACHE_FILES.data, JSON.stringify(pricing)),
        fs.promises.writeFile(CACHE_FILES.reasoning, JSON.stringify(reasoning)),
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

  /**
   * Finds a model's entry in a slimmed models.dev table - exact id, then
   * case-insensitive, then (for Bedrock) with region/version stripped.
   * @param {"pricing"|"reasoning"} table
   */
  #findModelEntry(table, providerId, providerSlug, model) {
    const models = (table === "reasoning" ? this.#reasoning : this.#pricing)?.[
      providerId
    ];
    if (!models) return null;
    if (models[model]) return models[model];

    const indexKey = `${table}:${providerId}`;
    if (!this.#lowercaseIndexes[indexKey]) {
      const index = {};
      for (const key of Object.keys(models)) index[key.toLowerCase()] = key;
      this.#lowercaseIndexes[indexKey] = index;
    }
    const caseMatch = this.#lowercaseIndexes[indexKey][model.toLowerCase()];
    if (caseMatch) return models[caseMatch];

    if (providerSlug === "bedrock") {
      if (!this.#normalizedIndexes[indexKey]) {
        const index = {};
        for (const key of Object.keys(models)) {
          const normalized = normalizeBedrockId(key);
          if (!index[normalized] || key.length < index[normalized].length)
            index[normalized] = key;
        }
        this.#normalizedIndexes[indexKey] = index;
      }
      const normalizedMatch =
        this.#normalizedIndexes[indexKey][normalizeBedrockId(model)];
      if (normalizedMatch) return models[normalizedMatch];
    }

    return null;
  }

  /**
   * The rates of a models.dev cost entry for a prompt of the given size. A
   * long-context tier replaces each base rate it lists.
   * @returns {TokenRates|null} null when the entry has no usable input/output rate
   */
  #resolveRates(cost, promptTokens) {
    let tier = null;
    if (Array.isArray(cost.tiers)) {
      tier = cost.tiers
        .filter(
          (t) => t?.tier?.type === "context" && promptTokens > t.tier.size
        )
        .sort((a, b) => a.tier.size - b.tier.size)
        .pop();
    } else if (cost.context_over_200k && promptTokens > 200_000) {
      tier = cost.context_over_200k;
    }

    const rates = {};
    for (const key of RATE_KEYS) rates[key] = tier?.[key] ?? cost[key];
    if (typeof rates.input !== "number" || typeof rates.output !== "number")
      return null;
    return completeRates(rates);
  }

  /** Reads the saved overrides into memory. A missing or corrupt file means none. */
  #loadOverrides() {
    let overrides = [];
    try {
      if (fs.existsSync(overridesFile()))
        overrides = sanitizeOverrides(
          JSON.parse(fs.readFileSync(overridesFile(), "utf8"))
        );
    } catch (error) {
      log("Failed to read model pricing overrides", error?.message);
    }
    this.#indexOverrides(overrides);
  }

  /** @param {PricingOverride[]} overrides - already sanitized */
  #indexOverrides(overrides) {
    this.#overrides = overrides;
    this.#overrideIndex = new Map(
      overrides.map((o) => [overrideKey(o.provider, o.model), o])
    );
  }

  /**
   * Admin pricing overrides.
   * @returns {PricingOverride[]} copies, safe for callers to mutate
   */
  getOverrides() {
    return this.#overrides.map((o) => ({ ...o }));
  }

  /**
   * Replaces the admin pricing overrides. Nothing is saved unless every entry
   * is valid.
   * @param {unknown} overrides - list of {@link PricingOverride}
   * @returns {PricingOverride[]} the overrides that were saved
   * @throws {InvalidPricingOverrideError} when an entry is malformed, a provider + model is
   *   listed twice, or more than MAX_OVERRIDES entries are given
   */
  setOverrides(overrides = []) {
    const sanitized = validateOverrides(overrides);
    // Write then rename so a worker thread reading mid-save never sees a
    // truncated file (which it would read as "no overrides").
    const tmpFile = `${overridesFile()}.${process.pid}.tmp`;
    fs.writeFileSync(tmpFile, JSON.stringify(sanitized));
    fs.renameSync(tmpFile, overridesFile());
    this.#indexOverrides(sanitized);
    return sanitized.map((o) => ({ ...o }));
  }

  /**
   * An exact (case-insensitive) model override wins over a provider-wide one.
   * @returns {PricingOverride|null}
   */
  #findOverride(providerSlug, model) {
    if (!this.#overrideIndex.size) return null;
    const modelId = typeof model === "string" && model ? model : null;
    return (
      (modelId &&
        this.#overrideIndex.get(overrideKey(providerSlug, modelId))) ||
      this.#overrideIndex.get(overrideKey(providerSlug, null)) ||
      null
    );
  }

  /**
   * The USD rates of an override. A price entered in another currency is
   * converted with the exchange rate loaded right now, and is unknown while
   * no rate for its currency has ever been fetched.
   * @param {PricingOverride} override
   * @returns {TokenRates|null}
   */
  #overrideRates(override) {
    if (override.currency === "USD") return completeRates(override);

    // The cost lookup is synchronous, so it uses the loaded rate and only
    // asks for a refresh (at most hourly) to keep that rate current.
    if (Date.now() - this.#exchangeRefreshAskedAt > EXCHANGE_REFRESH_MS) {
      this.#exchangeRefreshAskedAt = Date.now();
      CURRENCY_EXCHANGE.getRates().catch(() => {});
    }
    const unitsPerUsd = CURRENCY_EXCHANGE.cachedRate(override.currency);
    if (!unitsPerUsd) return null;
    return completeRates({
      input: override.input / unitsPerUsd,
      output: override.output / unitsPerUsd,
    });
  }

  /**
   * Per-1M-token USD rates for a completion: admin override first, then free
   * local providers, then models.dev. Null means the rates are unknown.
   * @returns {TokenRates|null}
   */
  #findRates(providerSlug, model, promptTokens) {
    if (!providerSlug || typeof providerSlug !== "string") return null;
    const override = this.#findOverride(providerSlug, model);
    if (override) return this.#overrideRates(override);
    if (FREE_PROVIDERS.includes(providerSlug))
      return completeRates({ input: 0, output: 0 });
    return this.getListedRates(providerSlug, model, promptTokens);
  }

  /**
   * Per-1M-token USD rates models.dev lists for a model, ignoring admin overrides.
   * @param {string|null} providerSlug - AnythingLLM provider slug
   * @param {string|null} model - model id
   * @param {number} [promptTokens] - selects long-context tier rates when large enough
   * @returns {TokenRates|null} null when the price is unknown
   */
  getListedRates(providerSlug = null, model = null, promptTokens = 0) {
    if (typeof providerSlug !== "string" || typeof model !== "string")
      return null;
    if (FREE_PROVIDERS.includes(providerSlug)) return null;
    if (!Object.hasOwn(PROVIDER_ID_MAP, providerSlug)) return null;

    const providerId = PROVIDER_ID_MAP[providerSlug];
    if (!model || !this.#pricing) return null;

    const cost = this.#findModelEntry(
      "pricing",
      providerId,
      providerSlug,
      model
    );
    if (!cost) return null;
    return this.#resolveRates(cost, promptTokens);
  }

  /**
   * @param {string|null} providerSlug - AnythingLLM provider slug
   * @param {string|null} model - model id used for the completion
   * @param {import("./usage").TokenUsage} usage - `prompt_tokens` and `completion_tokens` are totals;
   *   the cached and reasoning counts inside them are billed at their own rates
   * @returns {CostBreakdown} unknown pricing is zero cost with `costKnown: false`
   */
  getCostBreakdown(providerSlug = null, model = null, usage = {}) {
    const promptTokens = toNonNegativeNumber(usage?.prompt_tokens);
    const completionTokens = toNonNegativeNumber(usage?.completion_tokens);
    const rates = this.#findRates(providerSlug, model, promptTokens);
    if (!rates) return unknownCost();

    const cacheRead = Math.min(
      toNonNegativeNumber(usage?.cache_read_tokens),
      promptTokens
    );
    const cacheWrite = Math.min(
      toNonNegativeNumber(usage?.cache_write_tokens),
      promptTokens - cacheRead
    );
    const reasoning = Math.min(
      toNonNegativeNumber(usage?.reasoning_tokens),
      completionTokens
    );

    const inputCost = roundCost(
      ((promptTokens - cacheRead - cacheWrite) * rates.input +
        cacheRead * rates.cache_read +
        cacheWrite * rates.cache_write) /
        1_000_000
    );
    const outputCost = roundCost(
      ((completionTokens - reasoning) * rates.output +
        reasoning * rates.reasoning) /
        1_000_000
    );
    return {
      inputCost,
      outputCost,
      totalCost: roundCost(inputCost + outputCost),
    };
  }

  /**
   * The reasoning options models.dev lists for a model, eg:
   * `[{type: "effort", values: ["low", "high"]}]` or `[{type: "toggle"}]`.
   * @param {string|null} providerSlug - AnythingLLM provider slug
   * @param {string|null} model - model id
   * @returns {Array<object>|null} null when the models.dev data is not loaded yet, [] when the model has no reasoning options
   */
  getReasoningOptions(providerSlug = null, model = null) {
    if (!this.#reasoning) return null;
    const providerId = PROVIDER_ID_MAP[providerSlug];
    if (!providerId || !model || typeof model !== "string") return [];
    return (
      this.#findModelEntry("reasoning", providerId, providerSlug, model) ?? []
    );
  }

  get isCacheStale() {
    return this.#isCacheStale();
  }
}

const MODEL_PRICING = new ModelPricing();

/**
 * Enriches a metrics object with inputCost, outputCost, and totalCost (USD).
 * Unknown pricing is recorded as zero cost with `costKnown: false`.
 * @param {Object} metrics - must contain `prompt_tokens` and `completion_tokens`, and may carry the
 *   `cache_read_tokens`, `cache_write_tokens` and `reasoning_tokens` counts inside them
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
      cache_read_tokens: metrics.cache_read_tokens,
      cache_write_tokens: metrics.cache_write_tokens,
      reasoning_tokens: metrics.reasoning_tokens,
    }
  );
  return { ...metrics, ...breakdown };
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
  InvalidPricingOverrideError,
  normalizeTokenUsage,
  addCostToMetrics,
  addChatCostToMetrics,
  FREE_PROVIDERS,
  PROVIDER_ID_MAP,
};
