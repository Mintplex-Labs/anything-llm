const fs = require("fs");
const path = require("path");
const { safeJsonParse } = require("../http");

/**
 * Request fields owned by AnythingLLM at inference time.
 * These must never be overridden by provider config files.
 */
const RESERVED_REQUEST_KEYS = new Set([
  "model",
  "messages",
  "stream",
  "stream_options",
  "tools",
  "tool_choice",
  "functions",
  "function_call",
  "n",
]);

/**
 * Structural keys in the provider JSON that are not request body fields.
 */
const STRUCTURAL_KEYS = new Set(["models"]);

/**
 * Directory containing per-provider LLM request config files:
 * `storage/config/llm/<provider>.json`
 */
function getLLMProviderConfigDir() {
  if (process.env.NODE_ENV === "development") {
    return path.resolve(__dirname, "../../storage/config/llm");
  }
  return path.resolve(
    process.env.STORAGE_DIR || path.resolve(__dirname, "../../storage"),
    "config",
    "llm"
  );
}

/**
 * Basic path traversal guard for provider config filenames.
 * @param {string} outer
 * @param {string} inner
 * @returns {boolean}
 */
function isWithin(outer, inner) {
  const resolvedOuter = path.resolve(outer);
  const resolvedInner = path.resolve(inner);
  const rel = path.relative(resolvedOuter, resolvedInner);
  if (rel === "") return false;
  return (
    !rel.startsWith(`..${path.sep}`) && rel !== ".." && !path.isAbsolute(rel)
  );
}

/**
 * Resolves and validates the config file path for a provider slug.
 * @param {string} provider
 * @param {string} [configDir]
 * @returns {string|null}
 */
function resolveProviderConfigPath(
  provider,
  configDir = getLLMProviderConfigDir()
) {
  if (!provider || typeof provider !== "string") return null;

  const normalized = path
    .normalize(provider.trim())
    .replace(/^(\.\.(\/|\\|$))+/, "")
    .trim();
  if (
    !normalized ||
    ["..", ".", "/"].includes(normalized) ||
    normalized.includes("..") ||
    path.isAbsolute(normalized)
  ) {
    return null;
  }

  const configPath = path.resolve(configDir, `${normalized}.json`);
  if (!isWithin(configDir, configPath)) return null;
  return configPath;
}

/**
 * Strips reserved/structural keys from a plain object of request params.
 * @param {Object} params
 * @returns {Object}
 */
function sanitizeRequestParams(params = {}) {
  if (!params || typeof params !== "object" || Array.isArray(params)) return {};

  const cleaned = {};
  for (const [key, value] of Object.entries(params)) {
    if (STRUCTURAL_KEYS.has(key)) continue;
    if (RESERVED_REQUEST_KEYS.has(key)) continue;
    if (value === undefined) continue;
    cleaned[key] = value;
  }
  return cleaned;
}

/**
 * Loads a provider config JSON from disk.
 * Missing or invalid files return an empty object.
 * @param {string} provider - Provider slug (e.g. "generic-openai")
 * @param {{ configDir?: string }} [options]
 * @returns {Object}
 */
function loadLLMProviderConfig(provider, { configDir } = {}) {
  const configPath = resolveProviderConfigPath(
    provider,
    configDir || getLLMProviderConfigDir()
  );
  if (!configPath || !fs.existsSync(configPath)) return {};

  try {
    const raw = fs.readFileSync(configPath, "utf8");
    const parsed = safeJsonParse(raw, null);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      console.warn(
        `[LLMProviderConfig] ${path.basename(configPath)} must be a JSON object. Ignoring.`
      );
      return {};
    }
    return parsed;
  } catch (error) {
    console.warn(
      `[LLMProviderConfig] Failed to read ${path.basename(configPath)}: ${error.message}`
    );
    return {};
  }
}

/**
 * Returns request params to spread into chat/agent inference calls.
 *
 * Config file format (`storage/config/llm/<provider>.json`):
 * ```json
 * {
 *   "top_p": 0.9,
 *   "repetition_penalty": 1.1,
 *   "models": {
 *     "my-model-id": { "top_p": 0.95 }
 *   }
 * }
 * ```
 *
 * Top-level keys (except `models`) apply to all models for the provider.
 * Optional `models.<modelId>` values are merged on top for that model.
 * Arbitrary/unlisted provider-specific keys are allowed and passed through.
 *
 * @param {string} provider - Provider slug (e.g. "generic-openai")
 * @param {string|null} [model] - Active model id for per-model overrides
 * @param {{ configDir?: string }} [options]
 * @returns {Object}
 */
function getLLMProviderRequestParams(provider, model = null, options = {}) {
  const config = loadLLMProviderConfig(provider, options);
  if (!Object.keys(config).length) return {};

  const providerDefaults = sanitizeRequestParams(config);
  const modelOverrides =
    model &&
    config.models &&
    typeof config.models === "object" &&
    !Array.isArray(config.models) &&
    config.models[model] &&
    typeof config.models[model] === "object" &&
    !Array.isArray(config.models[model])
      ? sanitizeRequestParams(config.models[model])
      : {};

  return {
    ...providerDefaults,
    ...modelOverrides,
  };
}

module.exports = {
  RESERVED_REQUEST_KEYS,
  getLLMProviderConfigDir,
  getLLMProviderRequestParams,
  loadLLMProviderConfig,
  sanitizeRequestParams,
};
