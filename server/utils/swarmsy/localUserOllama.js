const DEFAULT_LOCAL_OLLAMA_TAGS_URL = "http://localhost:11434/api/tags";
const DEFAULT_TIMEOUT_MS = 2_500;

function normalizeOllamaModels(models = []) {
  return models
    .map((model) => {
      const name = typeof model?.name === "string" ? model.name.trim() : "";
      if (!name) return null;
      return {
        id: name,
        name,
        size: Number.isFinite(model?.size) ? model.size : null,
        digest: model?.digest || null,
        modifiedAt: model?.modified_at || null,
      };
    })
    .filter(Boolean);
}

function toOllamaTagsEndpoint(basePath = "") {
  const trimmedBasePath = String(basePath || "")
    .trim()
    .replace(/\/+$/, "");
  if (!trimmedBasePath) return DEFAULT_LOCAL_OLLAMA_TAGS_URL;
  if (trimmedBasePath.endsWith("/api/tags")) return trimmedBasePath;
  if (trimmedBasePath.endsWith("/api")) return `${trimmedBasePath}/tags`;
  return `${trimmedBasePath}/api/tags`;
}

function resolveLocalOllamaTagsEndpoint(endpoint) {
  const explicitEndpoint = String(endpoint || "").trim();
  if (explicitEndpoint) return explicitEndpoint;

  const configuredTagsEndpoint = String(
    process.env.SWARMSY_LOCAL_OLLAMA_TAGS_URL || ""
  ).trim();
  if (configuredTagsEndpoint) return configuredTagsEndpoint;

  const configuredBasePath = String(process.env.OLLAMA_BASE_PATH || "").trim();
  if (configuredBasePath) return toOllamaTagsEndpoint(configuredBasePath);

  return DEFAULT_LOCAL_OLLAMA_TAGS_URL;
}

function unreachableResult(endpoint) {
  return {
    success: true,
    mode: "local_user",
    provider: "ollama",
    endpoint,
    reachable: false,
    status: "unreachable",
    models: [],
    message: `Local Ollama is not reachable at ${endpoint}.`,
  };
}

function errorResult(endpoint, message) {
  return {
    success: true,
    mode: "local_user",
    provider: "ollama",
    endpoint,
    reachable: false,
    status: "error",
    models: [],
    message,
  };
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

async function fetchWithTimeout(fetchImpl, endpoint, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetchImpl(endpoint, {
      method: "GET",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function detectLocalOllama({
  endpoint,
  fetchImpl = global.fetch,
  timeoutMs = DEFAULT_TIMEOUT_MS,
} = {}) {
  const resolvedEndpoint = resolveLocalOllamaTagsEndpoint(endpoint);
  if (typeof fetchImpl !== "function") {
    return errorResult(
      resolvedEndpoint,
      "Fetch is unavailable for local Ollama detection."
    );
  }

  try {
    const response = await fetchWithTimeout(
      fetchImpl,
      resolvedEndpoint,
      timeoutMs
    );
    if (!response?.ok) {
      return errorResult(
        resolvedEndpoint,
        `Local Ollama returned an unexpected status (${response?.status ?? "unknown"}).`
      );
    }

    const payload = await response.json();
    if (!Array.isArray(payload?.models)) {
      return errorResult(
        resolvedEndpoint,
        "Local Ollama returned an unexpected response payload."
      );
    }

    const models = normalizeOllamaModels(payload.models);
    if (models.length === 0) {
      return {
        success: true,
        mode: "local_user",
        provider: "ollama",
        endpoint: resolvedEndpoint,
        reachable: true,
        status: "no_models",
        models: [],
        message: "Local Ollama is reachable, but no models are installed yet.",
      };
    }

    return {
      success: true,
      mode: "local_user",
      provider: "ollama",
      endpoint: resolvedEndpoint,
      reachable: true,
      status: "reachable",
      models,
      message: "Local Ollama is reachable and installed models were detected.",
    };
  } catch (error) {
    if (isUnreachableError(error)) return unreachableResult(resolvedEndpoint);
    return errorResult(
      resolvedEndpoint,
      error?.message || "Local Ollama detection failed unexpectedly."
    );
  }
}

module.exports = {
  DEFAULT_LOCAL_OLLAMA_TAGS_URL,
  detectLocalOllama,
  normalizeOllamaModels,
  resolveLocalOllamaTagsEndpoint,
};
