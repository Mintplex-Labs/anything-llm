const DEFAULT_LOCAL_IMAGE_ENGINE_URL = "http://localhost:8188";
const DEFAULT_TIMEOUT_MS = 2_500;
const COMFYUI_REACHABLE_MESSAGE = "ComfyUI is reachable.";
const COMFYUI_UNREACHABLE_MESSAGE =
  "ComfyUI is not reachable. Start ComfyUI locally before image generation.";
const COMFYUI_LOCAL_EXPLANATION =
  "Desktop/local mode checks ComfyUI on this computer.";
const COMFYUI_HOSTED_EXPLANATION =
  "Hosted/server mode checks the configured server-side ComfyUI URL. localhost inside Docker is not the user's PC.";

function normalizeComfyUiBaseUrl(value) {
  return String(value || "")
    .trim()
    .replace(/\/+$/, "");
}

function explanationForMode(mode) {
  return mode === "hosted_server"
    ? COMFYUI_HOSTED_EXPLANATION
    : COMFYUI_LOCAL_EXPLANATION;
}

function resolveLocalImageEngineConfig(url, { mode = null } = {}) {
  const resolvedMode =
    mode === "hosted_server" ? "hosted_server" : "local_user";
  const explicitUrl = normalizeComfyUiBaseUrl(url);
  if (explicitUrl) {
    return {
      url: explicitUrl,
      mode: resolvedMode,
      configuredBy: "default",
      explanation: explanationForMode(resolvedMode),
    };
  }

  const swarmsyUrl = normalizeComfyUiBaseUrl(
    process.env.SWARMSY_LOCAL_COMFYUI_URL
  );
  if (swarmsyUrl) {
    return {
      url: swarmsyUrl,
      mode: "hosted_server",
      configuredBy: "SWARMSY_LOCAL_COMFYUI_URL",
      explanation: COMFYUI_HOSTED_EXPLANATION,
    };
  }

  const comfyBaseUrl = normalizeComfyUiBaseUrl(process.env.COMFYUI_BASE_URL);
  if (comfyBaseUrl) {
    return {
      url: comfyBaseUrl,
      mode: "hosted_server",
      configuredBy: "COMFYUI_BASE_URL",
      explanation: COMFYUI_HOSTED_EXPLANATION,
    };
  }

  return {
    url: DEFAULT_LOCAL_IMAGE_ENGINE_URL,
    mode: resolvedMode,
    configuredBy: "default",
    explanation: explanationForMode(resolvedMode),
  };
}

function resolveLocalImageEngineUrl(url, options = {}) {
  return resolveLocalImageEngineConfig(url, options).url;
}

function withComfyUiStatusMetadata(result, config) {
  return {
    ...result,
    mode: config.mode,
    configuredBy: config.configuredBy,
    explanation: config.explanation,
  };
}

function unavailableResult(config, message = COMFYUI_UNREACHABLE_MESSAGE) {
  return {
    success: true,
    mode: config.mode,
    available: false,
    engine: "comfyui",
    url: config.url,
    configuredBy: config.configuredBy,
    explanation: config.explanation,
    message,
  };
}

function nonOkResult(config, status) {
  return unavailableResult(
    config,
    `ComfyUI returned HTTP ${status ?? "unknown"}. Check the configured image engine URL.`
  );
}

function unexpectedErrorResult(config, error = null) {
  const message = String(
    error?.message || "Unexpected ComfyUI detection error."
  ).trim();
  return unavailableResult(config, `Failed to detect ComfyUI: ${message}`);
}

function isUnreachableError(error = null) {
  const message = String(error?.message || "").toLowerCase();
  return (
    error?.name === "AbortError" ||
    message.includes("fetch failed") ||
    message.includes("networkerror") ||
    message.includes("econnrefused") ||
    message.includes("econnreset") ||
    message.includes("ehostunreach") ||
    message.includes("enotfound") ||
    message.includes("timed out")
  );
}

async function fetchWithTimeout(fetchImpl, url, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetchImpl(url, {
      method: "GET",
      redirect: "manual",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function detectLocalImageEngine({
  url,
  fetchImpl = global.fetch,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  mode = null,
} = {}) {
  const config = resolveLocalImageEngineConfig(url, { mode });
  const resolvedUrl = config.url;
  if (typeof fetchImpl !== "function") {
    return unavailableResult(
      config,
      "Fetch is unavailable for ComfyUI detection."
    );
  }

  try {
    const response = await fetchWithTimeout(fetchImpl, resolvedUrl, timeoutMs);
    if (!response?.ok) return nonOkResult(config, response?.status);

    return withComfyUiStatusMetadata(
      {
        success: true,
        available: true,
        engine: "comfyui",
        url: resolvedUrl,
        message: COMFYUI_REACHABLE_MESSAGE,
      },
      config
    );
  } catch (error) {
    if (isUnreachableError(error)) return unavailableResult(config);
    return unexpectedErrorResult(config, error);
  }
}

module.exports = {
  COMFYUI_REACHABLE_MESSAGE,
  COMFYUI_UNREACHABLE_MESSAGE,
  COMFYUI_HOSTED_EXPLANATION,
  COMFYUI_LOCAL_EXPLANATION,
  DEFAULT_LOCAL_IMAGE_ENGINE_URL,
  detectLocalImageEngine,
  resolveLocalImageEngineConfig,
  resolveLocalImageEngineUrl,
};
