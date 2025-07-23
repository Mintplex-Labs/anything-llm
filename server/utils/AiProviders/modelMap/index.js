const path = require("path");
const fs = require("fs");
const LEGACY_MODEL_MAP = require("./legacy");

class ContextWindowFinder {
  static instance = null;
  static modelMap = LEGACY_MODEL_MAP;

  /**
   * Mapping for AnythingLLM provider <> LiteLLM provider
   * @type {Record<string, string>}
   */
  static trackedProviders = {
    anthropic: "anthropic",
    openai: "openai",
    cohere: "cohere_chat",
    gemini: "vertex_ai-language-models",
    groq: "groq",
    xai: "xai",
    deepseek: "deepseek",
    moonshot: "moonshot",
  };
  static expiryMs = 1000 * 60 * 60 * 24 * 3; // 3 days
  static remoteUrl =
    "https://raw.githubusercontent.com/BerriAI/litellm/main/model_prices_and_context_window.json";

  cacheLocation = path.resolve(
    process.env.STORAGE_DIR
      ? path.resolve(process.env.STORAGE_DIR, "models", "context-windows")
      : path.resolve(__dirname, `../../../storage/models/context-windows`)
  );
  cacheFilePath = path.resolve(this.cacheLocation, "context-windows.json");
  cacheFileExpiryPath = path.resolve(this.cacheLocation, ".cached_at");
  seenStaleCacheWarning = false;

  constructor() {
    if (ContextWindowFinder.instance) return ContextWindowFinder.instance;
    ContextWindowFinder.instance = this;
    if (!fs.existsSync(this.cacheLocation))
      fs.mkdirSync(this.cacheLocation, { recursive: true });

    // If the cache is stale or not found at all, pull the model map from remote
    if (this.isCacheStale || !fs.existsSync(this.cacheFilePath))
      this.#pullRemoteModelMap();
  }

  log(text, ...args) {
    console.log(`\x1b[33m[ContextWindowFinder]\x1b[0m ${text}`, ...args);
  }

  /**
   * Checks if the cache is stale by checking if the cache file exists and if the cache file is older than the expiry time.
   * @returns {boolean}
   */
  get isCacheStale() {
    if (!fs.existsSync(this.cacheFileExpiryPath)) return true;
    const cachedAt = fs.readFileSync(this.cacheFileExpiryPath, "utf8");
    return Date.now() - cachedAt > ContextWindowFinder.expiryMs;
  }

  /**
   * Gets the cached model map.
   *
   * Always returns the available model map - even if it is expired since re-pulling
   * the model map only occurs on container start/system start.
   * @returns {Record<string, Record<string, number>> | null} - The cached model map
   */
  get cachedModelMap() {
    if (!fs.existsSync(this.cacheFilePath)) {
      this.log(`\x1b[33m
--------------------------------
[WARNING] Model map cache is not found!
Invalid context windows will be returned leading to inaccurate model responses
or smaller context windows than expected.
You can fix this by restarting AnythingLLM so the model map is re-pulled.
--------------------------------\x1b[0m`);
      return null;
    }

    if (this.isCacheStale && !this.seenStaleCacheWarning) {
      this.log(
        "Model map cache is stale - some model context windows may be incorrect. This is OK and the model map will be re-pulled on next boot."
      );
      this.seenStaleCacheWarning = true;
    }

    return JSON.parse(
      fs.readFileSync(this.cacheFilePath, { encoding: "utf8" })
    );
  }

  /**
   * Pulls the remote model map from the remote URL, formats it and caches it.
   * @returns {Record<string, Record<string, number>>} - The formatted model map
   */
  async #pullRemoteModelMap() {
    try {
      this.log("Pulling remote model map...");
      const remoteContexWindowMap = await fetch(ContextWindowFinder.remoteUrl)
        .then((res) => {
          if (res.status !== 200)
            throw new Error(
              "Failed to fetch remote model map - non 200 status code"
            );
          return res.json();
        })
        .then((data) => {
          fs.writeFileSync(this.cacheFilePath, JSON.stringify(data, null, 2));
          fs.writeFileSync(this.cacheFileExpiryPath, Date.now().toString());
          this.log("Remote model map synced and cached");
          return data;
        })
        .catch((error) => {
          this.log("Error syncing remote model map", error);
          return null;
        });
      if (!remoteContexWindowMap) return null;

      const modelMap = this.#formatModelMap(remoteContexWindowMap);
      this.#validateModelMap(modelMap);
      fs.writeFileSync(this.cacheFilePath, JSON.stringify(modelMap, null, 2));
      fs.writeFileSync(this.cacheFileExpiryPath, Date.now().toString());
      return modelMap;
    } catch (error) {
      this.log("Error syncing remote model map", error);
      return null;
    }
  }

  #validateModelMap(modelMap = {}) {
    for (const [provider, models] of Object.entries(modelMap)) {
      // If the models is null/falsey or has no keys, throw an error
      if (typeof models !== "object")
        throw new Error(
          `Invalid model map for ${provider} - models is not an object`
        );
      if (!models || Object.keys(models).length === 0)
        throw new Error(`Invalid model map for ${provider} - no models found!`);

      // Validate that the context window is a number
      for (const [model, contextWindow] of Object.entries(models)) {
        if (isNaN(contextWindow) || contextWindow <= 0)
          throw new Error(
            `Invalid model map for ${provider} - context window is not a positive number for model ${model}`
          );
      }
    }
  }

  /**
   * Formats the remote model map to a format that is compatible with how we store the model map
   * for all providers who use it.
   * @param {Record<string, any>} modelMap - The remote model map
   * @returns {Record<string, Record<string, number>>} - The formatted model map
   */
  #formatModelMap(modelMap = {}) {
    const formattedModelMap = {};

    for (const [provider, liteLLMProviderTag] of Object.entries(
      ContextWindowFinder.trackedProviders
    )) {
      formattedModelMap[provider] = {};
      const matches = Object.entries(modelMap).filter(
        ([_key, config]) => config.litellm_provider === liteLLMProviderTag
      );
      for (const [key, config] of matches) {
        const contextWindow = Number(config.max_input_tokens);
        if (isNaN(contextWindow)) continue;

        // Some models have a provider/model-tag format, so we need to get the last part since we dont do paths
        // for names with the exception of some router-providers like OpenRouter or Together.
        const modelName = key.split("/").pop();
        formattedModelMap[provider][modelName] = contextWindow;
      }
    }
    return formattedModelMap;
  }

  /**
   * Gets the context window for a given provider and model.
   *
   * If the provider is not found, null is returned.
   * If the model is not found, the provider's entire model map is returned.
   *
   * if both provider and model are provided, the context window for the given model is returned.
   * @param {string|null} provider - The provider to get the context window for
   * @param {string|null} model - The model to get the context window for
   * @returns {number|null} - The context window for the given provider and model
   */
  get(provider = null, model = null) {
    if (!provider || !this.cachedModelMap || !this.cachedModelMap[provider])
      return null;
    if (!model) return this.cachedModelMap[provider];

    const modelContextWindow = this.cachedModelMap[provider][model];
    if (!modelContextWindow) {
      this.log("Invalid access to model context window - not found in cache", {
        provider,
        model,
      });
      return null;
    }
    return Number(modelContextWindow);
  }
}

module.exports = { MODEL_MAP: new ContextWindowFinder() };
