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

  constructor() {
    if (ContextWindowFinder.instance) return ContextWindowFinder.instance;
    ContextWindowFinder.instance = this;
    if (!fs.existsSync(this.cacheLocation))
      fs.mkdirSync(this.cacheLocation, { recursive: true });
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

  get cache() {
    if (!fs.existsSync(this.cacheFileExpiryPath)) return null;
    if (!this.isCacheStale)
      return JSON.parse(
        fs.readFileSync(this.cacheFilePath, { encoding: "utf8" })
      );
    return null;
  }

  /**
   * Pulls the remote model map from the remote URL, formats it and caches it.
   * @returns {Record<string, Record<string, number>>} - The formatted model map
   */
  async #pullRemoteModelMap() {
    const remoteContexWindowMap = await fetch(ContextWindowFinder.remoteUrl)
      .then((res) => res.json())
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
    fs.writeFileSync(this.cacheFilePath, JSON.stringify(modelMap, null, 2));
    fs.writeFileSync(this.cacheFileExpiryPath, Date.now().toString());
    return modelMap;
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
   * @param {string} provider - The provider to get the context window for
   * @param {string} model - The model to get the context window for
   * @returns {number} - The context window for the given provider and model
   */
  get(provider = null, model = null) {
    if (!provider || !this.cache || !this.cache[provider]) return null;
    if (!model) return this.cache[provider];
    const modelContextWindow = this.cache[provider][model];
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
