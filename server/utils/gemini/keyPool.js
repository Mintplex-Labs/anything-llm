const PROVIDER_CONFIG = {
  llm: {
    singleEnvKey: "GEMINI_API_KEY",
    multiEnvKey: "GEMINI_API_KEYS",
  },
  embedding: {
    singleEnvKey: "GEMINI_EMBEDDING_API_KEY",
    multiEnvKey: "GEMINI_EMBEDDING_API_KEYS",
  },
};

const preferredIndexes = {
  llm: 0,
  embedding: 0,
};

function getProviderConfig(provider = "") {
  const config = PROVIDER_CONFIG[provider];
  if (!config) throw new Error(`Unknown Gemini provider type: ${provider}`);
  return config;
}

function parseGeminiApiKeys(input = null) {
  if (input === null || typeof input === "undefined" || input === true)
    return [];

  const values = Array.isArray(input) ? input : [input];
  const seen = new Set();
  const keys = [];

  for (const value of values) {
    for (const part of String(value).split(/[\n,]+/)) {
      const key = part.trim();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      keys.push(key);
    }
  }

  return keys;
}

function normalizeGeminiApiKeysForStorage(input = null) {
  return parseGeminiApiKeys(input).join(",");
}

function firstGeminiApiKey(input = null) {
  return parseGeminiApiKeys(input)[0] || null;
}

function getGeminiApiKeys(provider = "llm", overrideKeys = null) {
  if (
    typeof overrideKeys === "string" &&
    parseGeminiApiKeys(overrideKeys).length > 0
  ) {
    return parseGeminiApiKeys(overrideKeys);
  }

  if (Array.isArray(overrideKeys) && overrideKeys.length > 0) {
    return parseGeminiApiKeys(overrideKeys);
  }

  const { multiEnvKey, singleEnvKey } = getProviderConfig(provider);
  return parseGeminiApiKeys([
    process.env[multiEnvKey],
    process.env[singleEnvKey],
  ]);
}

function hasConfiguredGeminiApiKeys(provider = "llm") {
  return getGeminiApiKeys(provider).length > 0;
}

function getConfiguredGeminiKeyCount(provider = "llm") {
  return getGeminiApiKeys(provider).length;
}

function resetGeminiKeyRotation() {
  preferredIndexes.llm = 0;
  preferredIndexes.embedding = 0;
}

function getPreferredGeminiKeyIndex(provider = "llm", keyCount = 0) {
  if (keyCount <= 0) return 0;
  const currentIndex = preferredIndexes[provider] || 0;
  return ((currentIndex % keyCount) + keyCount) % keyCount;
}

function promoteGeminiKey(provider = "llm", apiKey = "", keyIndex = 0) {
  const { singleEnvKey } = getProviderConfig(provider);
  preferredIndexes[provider] = keyIndex;
  process.env[singleEnvKey] = apiKey;
}

function syncGeminiLegacyKey(provider = "llm", input = null) {
  const apiKey = firstGeminiApiKey(input);
  if (!apiKey) return null;
  promoteGeminiKey(provider, apiKey, 0);
  return apiKey;
}

function normalizeGeminiError(error = null) {
  const status = Number(
    error?.status ??
      error?.response?.status ??
      error?.cause?.status ??
      error?.response?.data?.error?.code ??
      NaN
  );
  const message = String(
    error?.response?.data?.error?.message ??
      error?.error?.message ??
      error?.cause?.message ??
      error?.message ??
      "Unknown Gemini error"
  );

  return {
    status: Number.isFinite(status) ? status : null,
    message,
    lowerMessage: message.toLowerCase(),
  };
}

function isRetryableGeminiKeyError(error = null) {
  const { status, lowerMessage } = normalizeGeminiError(error);
  if ([401, 403, 429].includes(status)) return true;
  if (status === 400 && lowerMessage.includes("status code (no body)"))
    return true;

  return [
    "invalid key",
    "api key not valid",
    "quota",
    "rate limit",
  ].some((needle) => lowerMessage.includes(needle));
}

async function withGeminiKeyFallback({
  provider = "llm",
  apiKeys = null,
  operation,
}) {
  const keys = getGeminiApiKeys(provider, apiKeys);
  if (keys.length === 0) throw new Error("No Gemini API key was set.");

  const usingTemporaryKeys =
    (typeof apiKeys === "string" && parseGeminiApiKeys(apiKeys).length > 0) ||
    (Array.isArray(apiKeys) && apiKeys.length > 0);
  const startIndex = usingTemporaryKeys
    ? 0
    : getPreferredGeminiKeyIndex(provider, keys.length);
  const errors = [];

  for (let offset = 0; offset < keys.length; offset++) {
    const keyIndex = (startIndex + offset) % keys.length;
    const apiKey = keys[keyIndex];

    try {
      const result = await operation(apiKey, {
        attempt: offset + 1,
        totalKeys: keys.length,
      });
      if (!usingTemporaryKeys) promoteGeminiKey(provider, apiKey, keyIndex);
      return result;
    } catch (error) {
      const { status, message } = normalizeGeminiError(error);
      const formattedError = `[${provider}:${keyIndex + 1}/${keys.length}${
        status ? `:${status}` : ""
      }] ${message}`;
      errors.push(formattedError);

      if (!isRetryableGeminiKeyError(error)) {
        throw new Error(formattedError);
      }
    }
  }

  throw new Error(
    `Gemini ${provider} failed across ${keys.length} key(s): ${errors.join(
      ", "
    )}`
  );
}

module.exports = {
  firstGeminiApiKey,
  getConfiguredGeminiKeyCount,
  getGeminiApiKeys,
  hasConfiguredGeminiApiKeys,
  isRetryableGeminiKeyError,
  normalizeGeminiApiKeysForStorage,
  parseGeminiApiKeys,
  resetGeminiKeyRotation,
  syncGeminiLegacyKey,
  withGeminiKeyFallback,
};
