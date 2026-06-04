const DEFAULT_LOCAL_IMAGE_ENGINE_URL = "http://localhost:8188";
const DEFAULT_TIMEOUT_MS = 2_500;
const COMFYUI_REACHABLE_MESSAGE = "ComfyUI is reachable.";
const COMFYUI_UNREACHABLE_MESSAGE =
  "ComfyUI is not reachable. Start ComfyUI locally before image generation.";

function resolveLocalImageEngineUrl(url) {
  const explicitUrl = String(url || "").trim();
  if (explicitUrl) return explicitUrl.replace(/\/+$/, "");

  const configuredUrl = String(
    process.env.SWARMSY_LOCAL_COMFYUI_URL || process.env.COMFYUI_BASE_URL || ""
  ).trim();
  if (configuredUrl) return configuredUrl.replace(/\/+$/, "");

  return DEFAULT_LOCAL_IMAGE_ENGINE_URL;
}

function unavailableResult(url, message = COMFYUI_UNREACHABLE_MESSAGE) {
  return {
    success: true,
    mode: "local_user",
    available: false,
    engine: "comfyui",
    url,
    message,
  };
}

function nonOkResult(url, status) {
  return unavailableResult(
    url,
    `ComfyUI returned HTTP ${status ?? "unknown"}. Check the configured image engine URL.`
  );
}

function unexpectedErrorResult(url, error = null) {
  const message = String(
    error?.message || "Unexpected ComfyUI detection error."
  ).trim();
  return unavailableResult(url, `Failed to detect ComfyUI: ${message}`);
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
} = {}) {
  const resolvedUrl = resolveLocalImageEngineUrl(url);
  if (typeof fetchImpl !== "function") {
    return unavailableResult(
      resolvedUrl,
      "Fetch is unavailable for ComfyUI detection."
    );
  }

  try {
    const response = await fetchWithTimeout(fetchImpl, resolvedUrl, timeoutMs);
    if (!response?.ok) return nonOkResult(resolvedUrl, response?.status);

    return {
      success: true,
      mode: "local_user",
      available: true,
      engine: "comfyui",
      url: resolvedUrl,
      message: COMFYUI_REACHABLE_MESSAGE,
    };
  } catch (error) {
    if (isUnreachableError(error)) return unavailableResult(resolvedUrl);
    return unexpectedErrorResult(resolvedUrl, error);
  }
}

module.exports = {
  COMFYUI_REACHABLE_MESSAGE,
  COMFYUI_UNREACHABLE_MESSAGE,
  DEFAULT_LOCAL_IMAGE_ENGINE_URL,
  detectLocalImageEngine,
  resolveLocalImageEngineUrl,
};
