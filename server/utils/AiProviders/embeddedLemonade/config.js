const path = require("path");

/**
 * Embedded Lemonade (`embedded_lemonade`) - a built-in lemond engine for the Linux (Docker) server.
 *
 * Everything for this provider lives in this folder so it can be ignored or deleted downstream (eg: AnythingLLM
 * Desktop, which has its own built-in engine `anythingllm_lemond`). Nothing here runs outside the Docker image or
 * without ENABLE_BUILT_IN_LLM in the container's start environment - see isEnabled().
 */

/** The provider tag. Distinct from `lemonade` (an external Lemonade server) and desktop's `anythingllm_lemond`. */
const PROVIDER = "embedded_lemonade";

/**
 * Pinned engine versions. lemond is our build of the Lemonade server hosted on our CDN (same builds desktop ships).
 * lemond downloads its own llama.cpp backends - we pin the cpu/vulkan llama.cpp release it fetches (ggml-org).
 * CUDA builds come from lemonade-sdk under their own tags, so CUDA stays on the version this lemond pins.
 * Bump both together and keep them in step with desktop's BUILT_IN_LLM.md pins.
 */
const LEMOND_VERSION = "2026.40.0";
const LLAMACPP_VERSION = "b11425";
const CDN_BASE = `https://cdn.anythingllm.com/support/lemonade/${LEMOND_VERSION}`;

/** The model registries lemond can pull from. `auto` tries Hugging Face first and falls back to ModelScope. */
const REGISTRIES = ["auto", "huggingface", "modelscope"];

/** The largest context window used when the user has not set one - avoids out-of-memory errors on long-context models. */
const DEFAULT_CONTEXT_WINDOW = 16384;

/** lemond's platform name for this host, or null when there is no lemond build for it. */
function lemondPlatform() {
  if (process.platform !== "linux") return null;
  if (process.arch === "x64") return "linux-x64";
  if (process.arch === "arm64") return "linux-arm64";
  return null;
}

/**
 * The environment this process was started with - from the docker run command or compose file. Read from
 * /proc/self/environ because process.env also holds values loaded from the .env file (dotenv) or set at runtime,
 * and those must never turn the engine on.
 * @returns {Record<string, string>}
 */
function startupEnv() {
  try {
    const fs = require("fs");
    return Object.fromEntries(
      fs
        .readFileSync("/proc/self/environ", "utf8")
        .split("\0")
        .filter(Boolean)
        .map((entry) => {
          const index = entry.indexOf("=");
          return [entry.slice(0, index), entry.slice(index + 1)];
        })
    );
  } catch {
    return {};
  }
}

let enabled = null;

/**
 * Whether the embedded engine is available on this instance. Only true when ALL of these hold:
 * - the process is the Docker image (ANYTHING_LLM_RUNTIME=docker, set by the Dockerfile)
 * - ENABLE_BUILT_IN_LLM is set in the docker run command or compose file (not the .env file)
 * - there is a lemond build for this platform (Linux x64/arm64)
 * Decided once per process since the startup environment cannot change.
 */
function isEnabled() {
  if (enabled !== null) return enabled;
  const env = startupEnv();
  const flag = String(env.ENABLE_BUILT_IN_LLM || "").toLowerCase();
  enabled =
    env.ANYTHING_LLM_RUNTIME === "docker" &&
    process.env.ANYTHING_LLM_RUNTIME === "docker" &&
    ["true", "1", "yes"].includes(flag) &&
    lemondPlatform() !== null;
  return enabled;
}

/** The provider tag when the engine is available, for updateENV's supported LLM list. */
function supportedProviders() {
  return isEnabled() ? [PROVIDER] : [];
}

function port() {
  return Number(process.env.EMBEDDED_LEMONADE_PORT) || 13355;
}

/**
 * Where the engine and its state live, all under STORAGE_DIR so they persist across container restarts.
 * - engines/embedded-lemonade/lemond: the lemond binary and its resources (replaced on version bumps)
 * - engines/embedded-lemonade/config: lemond's config.json
 * - engines/embedded-lemonade/cache: lemond state and the llama.cpp backends it downloads
 * - models/embedded-lemonade: downloaded models
 */
function paths() {
  const storage =
    process.env.STORAGE_DIR ?? path.resolve(__dirname, "../../../storage");
  const root = path.join(storage, "engines", "embedded-lemonade");
  return {
    root,
    lemond: path.join(root, "lemond"),
    config: path.join(root, "config"),
    cache: path.join(root, "cache"),
    models: path.join(storage, "models", "embedded-lemonade"),
  };
}

/**
 * updateENV check for the model preference. The options form always submits this key, so an empty value means
 * Built-in was saved without a model picked or downloaded.
 * @param {string} input
 * @returns {string|null}
 */
function modelSelected(input = "") {
  return String(input ?? "").trim()
    ? null
    : "Select or download a model for the Built-in LLM first.";
}

/**
 * updateENV check for the context window. Empty is valid and means the model's own context window (see
 * promptWindowLimit), otherwise it must be a whole number of tokens.
 * @param {string} input
 * @returns {string|null}
 */
function validTokenLimit(input = "") {
  if (String(input ?? "").trim() === "") return null;
  const value = Number(input);
  return Number.isInteger(value) && value > 0
    ? null
    : "Context window must be a whole number greater than zero.";
}

/** ENV keys this provider adds to updateENV's KEY_MAPPING. */
const ENV_KEYS = {
  EmbeddedLemonadeModelPref: {
    envKey: "EMBEDDED_LEMONADE_MODEL_PREF",
    checks: [modelSelected],
  },
  EmbeddedLemonadeTokenLimit: {
    envKey: "EMBEDDED_LEMONADE_MODEL_TOKEN_LIMIT",
    checks: [validTokenLimit],
  },
};

/**
 * updateENV hook for the system LLM provider. Moving off this provider unloads every model and stops lemond so
 * its RAM and VRAM are freed; moving onto it starts lemond in the background.
 * @param {string} _key
 * @param {string} prev - the previous LLM_PROVIDER
 * @param {string} next - the new LLM_PROVIDER
 */
function manageEngineOnProviderChange(_key, prev, next) {
  if (prev === next || !isEnabled()) return;
  if (prev !== PROVIDER && next !== PROVIDER) return;
  const { EmbeddedLemonadeEngine } = require("./engine");
  if (next === PROVIDER) return EmbeddedLemonadeEngine.prepareInBackground();
  // Not awaited - lemond can take a few seconds to shut down and the settings save should not wait on it.
  EmbeddedLemonadeEngine.stop().catch((e) =>
    EmbeddedLemonadeEngine.log(`Stop failed: ${e.message}`)
  );
}

/** Settings this provider adds to SystemSettings.currentSettings. */
function settings() {
  return {
    EmbeddedLemonadeEnabled: isEnabled(),
    EmbeddedLemonadeModelPref: process.env.EMBEDDED_LEMONADE_MODEL_PREF,
    EmbeddedLemonadeTokenLimit:
      process.env.EMBEDDED_LEMONADE_MODEL_TOKEN_LIMIT || null,
  };
}

module.exports = {
  PROVIDER,
  LEMOND_VERSION,
  LLAMACPP_VERSION,
  CDN_BASE,
  REGISTRIES,
  DEFAULT_CONTEXT_WINDOW,
  lemondPlatform,
  isEnabled,
  supportedProviders,
  port,
  paths,
  ENV_KEYS,
  modelSelected,
  validTokenLimit,
  settings,
  manageEngineOnProviderChange,
};
