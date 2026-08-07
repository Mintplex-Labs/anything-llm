const path = require("path");
const fs = require("fs");

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

/**
 * Providers that are local or self-hosted - inference is always free
 * so we never consult the pricing data for them.
 * @type {Set<string>}
 */
const FREE_PROVIDERS = new Set([
  "ollama",
  "lmstudio",
  "localai",
  "koboldcpp",
  "textgenwebui",
  "omlx",
  "lemonade",
  "docker-model-runner",
]);

/**
 * AnythingLLM provider slug -> models.dev provider id.
 * Slugs absent from this map (and from FREE_PROVIDERS) resolve to "unknown cost"
 * (eg: generic-openai, litellm, foundry, privatemode, nvidia-nim, apipie,
 * cometapi, giteeai, ppio, sambanova - not present on models.dev as of Aug 2026).
 * A missing/stale mapping degrades to "unknown", never a wrong price.
 * @type {Record<string, string>}
 */
const PROVIDER_ID_MAP = {
  openai: "openai",
  azure: "azure", // best-effort: only matches when deployment name === model id
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

class ModelPricing {
  static instance = null;
  static expiryMs = 1000 * 60 * 60 * 24 * 3; // 3 days
  static remoteUrl = "https://models.dev/api.json";

  /**
   * Loads the pricing snapshot bundled with `@opencode-ai/models`. The package
   * is ESM-only so it must be dynamically imported - never require()'d.
   * Static so tests can inject a fake importer (Jest's VM cannot execute
   * dynamic import without --experimental-vm-modules).
   * @returns {Promise<{providers: Record<string, any>}>}
   */
  static importSnapshot = () => import("@opencode-ai/models/snapshot");

  cacheLocation = path.resolve(
    process.env.STORAGE_DIR
      ? path.resolve(process.env.STORAGE_DIR, "models", "pricing")
      : path.resolve(__dirname, `../../../storage/models/pricing`)
  );
  cacheFilePath = path.resolve(this.cacheLocation, "model-pricing.json");
  cacheFileExpiryPath = path.resolve(this.cacheLocation, ".cached_at");
  cacheEtagPath = path.resolve(this.cacheLocation, ".etag");

  /** @type {Record<string, Record<string, ModelCost>>|null} - memoized pricing map keyed by models.dev provider id */
  #pricing = null;
  /** @type {Record<string, Record<string, string>>} - lazy per-provider lowercased model id -> real model id */
  #lowercaseIndexes = {};
  /** @type {Record<string, Record<string, string>>} - lazy per-provider normalized model id -> real model id (bedrock) */
  #normalizedIndexes = {};

  constructor() {
    if (ModelPricing.instance) return ModelPricing.instance;
    ModelPricing.instance = this;
    if (!fs.existsSync(this.cacheLocation))
      fs.mkdirSync(this.cacheLocation, { recursive: true });

    this.#loadFromDisk();
    if (this.isCacheStale || !this.#pricing) {
      this.#refresh().catch((err) =>
        this.log("Background pricing refresh failed:", err?.message)
      );
    }
  }

  log(text, ...args) {
    if (process.env.NODE_ENV === "test") return;
    console.log(`\x1b[36m[ModelPricing]\x1b[0m ${text}`, ...args);
  }

  /**
   * Checks if the disk cache is older than the expiry time (or missing entirely).
   * @returns {boolean}
   */
  get isCacheStale() {
    if (!fs.existsSync(this.cacheFileExpiryPath)) return true;
    const cachedAt = Number(fs.readFileSync(this.cacheFileExpiryPath, "utf8"));
    // A corrupted timestamp would make every comparison false (NaN) and the
    // cache permanently fresh - treat it as stale so it self-heals.
    if (!Number.isFinite(cachedAt)) return true;
    return Date.now() - cachedAt > ModelPricing.expiryMs;
  }

  /** Loads and memoizes the slimmed pricing map from the disk cache, if present. */
  #loadFromDisk() {
    try {
      if (!fs.existsSync(this.cacheFilePath)) return;
      this.#pricing = JSON.parse(
        fs.readFileSync(this.cacheFilePath, { encoding: "utf8" })
      );
    } catch (error) {
      this.log("Failed to read pricing cache from disk", error?.message);
      this.#pricing = null;
    }
  }

  /**
   * Fetches the latest pricing data from models.dev, slims it, and caches it
   * to disk + memory. Uses a conditional GET (ETag) so an unchanged upstream
   * only bumps the cache expiry. Falls back to the bundled snapshot from
   * `@opencode-ai/models` when the remote is unreachable and no disk cache exists.
   */
  async #refresh() {
    try {
      const headers = {};
      if (this.#pricing && fs.existsSync(this.cacheEtagPath)) {
        const etag = fs.readFileSync(this.cacheEtagPath, "utf8").trim();
        if (etag) headers["If-None-Match"] = etag;
      }

      const response = await fetch(ModelPricing.remoteUrl, { headers });
      if (response.status === 304) {
        await fs.promises.writeFile(
          this.cacheFileExpiryPath,
          Date.now().toString()
        );
        this.log("Remote pricing unchanged (304) - cache expiry bumped.");
        return;
      }

      if (response.status !== 200)
        throw new Error(
          `Failed to fetch remote pricing data - status ${response.status}`
        );

      const data = await response.json();
      const pricing = this.#slim(data);
      if (!Object.keys(pricing).length)
        throw new Error("Remote pricing data contained no usable cost data");

      this.#pricing = pricing;
      this.#lowercaseIndexes = {};
      this.#normalizedIndexes = {};

      const etag = response.headers.get("etag");
      await Promise.all([
        fs.promises.writeFile(this.cacheFilePath, JSON.stringify(pricing)),
        fs.promises.writeFile(this.cacheFileExpiryPath, Date.now().toString()),
        etag
          ? fs.promises.writeFile(this.cacheEtagPath, etag)
          : Promise.resolve(),
      ]);
      this.log("Remote pricing data synced and cached.");
    } catch (error) {
      this.log("Error syncing remote pricing data", error?.message);
      if (!this.#pricing) await this.#loadSnapshot();
    }
  }

  /**
   * Loads the pricing data bundled with the `@opencode-ai/models` package as an
   * offline/air-gapped fallback. We intentionally do not write `.cached_at`
   * here so the next boot retries the remote source.
   */
  async #loadSnapshot() {
    try {
      const { providers } = await ModelPricing.importSnapshot();
      this.#pricing = this.#slim(providers);
      this.#lowercaseIndexes = {};
      this.#normalizedIndexes = {};
      this.log("Loaded bundled pricing snapshot (offline fallback).");
    } catch (error) {
      this.log("Bundled pricing snapshot failed to load", error?.message);
    }
  }

  /**
   * Slims the full models.dev provider map down to only cost data.
   * Models with an absent or null cost object are dropped entirely so a
   * lookup miss cleanly signals "unknown pricing".
   * @param {Record<string, {models?: Record<string, {cost?: ModelCost|null}>}>} apiJson
   * @returns {Record<string, Record<string, ModelCost>>}
   */
  #slim(apiJson = {}) {
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
   * Strips the region prefix and version suffix from a Bedrock model id since
   * both our stored ids and models.dev's keys are inconsistently prefixed.
   * eg: `us.anthropic.claude-sonnet-4-v1:0` -> `anthropic.claude-sonnet-4`
   * @param {string} modelId
   * @returns {string}
   */
  #normalizeBedrockId(modelId = "") {
    return modelId
      .replace(/^(us|eu|ap|apac|jp|au|global)\./, "")
      .replace(/-v\d+(:\d+)?$/, "");
  }

  /**
   * Finds the cost object for a model under a models.dev provider id.
   * Resolution order: exact match -> case-insensitive match -> bedrock
   * region/version normalization (bedrock only).
   * @param {string} providerId - models.dev provider id
   * @param {string} providerSlug - AnythingLLM provider slug
   * @param {string} model
   * @returns {ModelCost|null}
   */
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
          const normalized = this.#normalizeBedrockId(key);
          // Regional variants (au./eu./jp.) can be priced differently and all
          // normalize to the same id - prefer the shortest (unprefixed) key.
          if (!index[normalized] || key.length < index[normalized].length)
            index[normalized] = key;
        }
        this.#normalizedIndexes[providerId] = index;
      }
      const normalizedMatch =
        this.#normalizedIndexes[providerId][this.#normalizeBedrockId(model)];
      if (normalizedMatch) return models[normalizedMatch];
    }

    return null;
  }

  /**
   * Resolves the effective per-1M-token rates for a request, accounting for
   * long-context pricing tiers (eg: Gemini >200k prompts).
   * @param {ModelCost} cost
   * @param {number} promptTokens
   * @returns {{input: number, output: number}|null}
   */
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
   * Coerces a caller-supplied token count into a safe, finite, non-negative
   * number. Chat metrics are not sanitized upstream like agent usage is, so a
   * provider reporting a negative or non-finite count must not produce a
   * negative or infinite cost.
   * @param {unknown} value
   * @returns {number}
   */
  static #safeTokenCount(value) {
    const number = Number(value);
    if (!Number.isFinite(number) || number < 0) return 0;
    return number;
  }

  /**
   * Calculates the USD cost of a completion for a given provider slug + model.
   *
   * Returns zeros for local/self-hosted providers, `null` when pricing is
   * unknown (unmapped provider, unknown model). Callers should treat `null`
   * as "do not report cost" - absence is how the UI distinguishes unknown
   * from free.
   *
   * Note: only flat prompt/completion rates are applied today since our
   * metrics do not track cache or reasoning token counts. If they ever do,
   * models.dev conventions are `reasoning ?? output` and
   * `cache_read`/`cache_write ?? input` for the fallback rates.
   * @param {string|null} providerSlug - AnythingLLM provider slug (eg: "openai" - NOT the class name)
   * @param {string|null} model - model id used for the completion
   * @param {{prompt_tokens?: number, completion_tokens?: number}} usage
   * @returns {CostBreakdown|null}
   */
  getCostBreakdown(providerSlug = null, model = null, usage = {}) {
    if (!providerSlug) return null;
    if (FREE_PROVIDERS.has(providerSlug))
      return { inputCost: 0, outputCost: 0, totalCost: 0 };

    const providerId = PROVIDER_ID_MAP[providerSlug];
    if (!providerId || !model || !this.#pricing) return null;

    const cost = this.#findModelCost(providerId, providerSlug, model);
    if (!cost) return null;

    const promptTokens = ModelPricing.#safeTokenCount(usage?.prompt_tokens);
    const completionTokens = ModelPricing.#safeTokenCount(
      usage?.completion_tokens
    );
    const rates = this.#resolveRates(cost, promptTokens);
    if (!rates) return null;

    const inputCost = (promptTokens / 1_000_000) * rates.input;
    const outputCost = (completionTokens / 1_000_000) * rates.output;
    return { inputCost, outputCost, totalCost: inputCost + outputCost };
  }
}

const MODEL_PRICING = new ModelPricing();

/**
 * Returns a new metrics object with `inputCost`/`outputCost`/`totalCost`
 * (USD) added when the price of the provider + model is known. Returns the
 * metrics unchanged when pricing is unknown so the fields stay absent.
 * @param {object} metrics - a chat metrics object with `prompt_tokens`/`completion_tokens`
 * @param {{provider?: string|null, model?: string|null}} identity - provider slug + model used
 * @returns {object}
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
 * Convenience wrapper for the chat flows: resolves the provider slug + model
 * that actually served the completion (router delegate first, then workspace
 * overrides, then the system default) and decorates the metrics with cost.
 * @param {object} metrics - a chat metrics object with `prompt_tokens`/`completion_tokens`
 * @param {Object} opts
 * @param {object|null} [opts.routingMetadata] - from `resolveProviderConnector` when the workspace uses the model router
 * @param {object|null} [opts.workspace] - the workspace record the chat ran in
 * @param {object|null} [opts.connector] - the LLM connector instance used
 * @returns {object}
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
