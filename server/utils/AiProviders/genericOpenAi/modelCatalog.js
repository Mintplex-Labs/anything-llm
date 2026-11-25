/**
 * Reasoning levels an OpenAI-compatible backend lists on `GET /models`. This is
 * not part of the OpenAI spec, so each backend's shape gets a parser below. A
 * backend without any of these shapes simply has no reasoning controls.
 *
 * The catalog is cached per base path + credentials, so a changed API key or
 * custom header is looked up fresh instead of reusing a result fetched with the
 * old one. Any HTTP response or timeout is cached for the full TTL so a backend
 * without the endpoint (or one that hangs on it) is not hit on every request.
 * An unreachable backend is retried sooner, since it is often just not started yet.
 */
const crypto = require("crypto");
const { OpenAI } = require("openai");
const { REASONING_EFFORT_LEVELS } = require("../../helpers/reasoningEffort");

const CATALOG_CACHE_TTL_MS = 30 * 60 * 1000;
const CATALOG_UNREACHABLE_TTL_MS = 30 * 1000;
const CATALOG_TIMEOUT_MS = 5_000;

/** @type {Array<(entry: object) => string[]|undefined>} */
const REASONING_EFFORT_PARSERS = [
  // NanoGPT
  // https://docs.nano-gpt.com/api-reference/endpoint/models
  // https://docs.nano-gpt.com/api-reference/miscellaneous/extended-thinking
  (entry) => entry?.reasoning_efforts,
];

/**
 * @typedef {{ok: boolean, efforts: Map<string, string[]>}} CatalogResult
 * @type {Map<string, {expiresAt: number, result: Promise<CatalogResult>}>}
 */
const catalogCache = new Map();

/**
 * Cache key for a client: its base path plus a hash of everything that can
 * change which catalog the backend returns (API key and custom headers).
 * @param {import("openai").OpenAI} client
 * @returns {string}
 */
function catalogCacheKey(client) {
  const credentials = crypto
    .createHash("sha256")
    .update(
      JSON.stringify([client.apiKey ?? null, client._options?.defaultHeaders])
    )
    .digest("hex");
  return `${client.baseURL}|${credentials}`;
}

/**
 * @param {import("openai").OpenAI} client
 * @param {string} key - Cache key the result is stored under
 * @returns {Promise<CatalogResult>}
 */
async function fetchReasoningEfforts(client, key) {
  try {
    const page = await client.models.list({
      query: { detailed: true },
      timeout: CATALOG_TIMEOUT_MS,
      maxRetries: 0,
    });
    const efforts = new Map();
    for (const entry of page.data ?? []) {
      const values = REASONING_EFFORT_PARSERS.map((parse) => parse(entry)).find(
        Array.isArray
      );
      if (values) efforts.set(entry.id, values);
    }
    return { ok: true, efforts };
  } catch (e) {
    const unreachable =
      e instanceof OpenAI.APIConnectionError &&
      !(e instanceof OpenAI.APIConnectionTimeoutError);
    if (unreachable) {
      const cached = catalogCache.get(key);
      if (cached) cached.expiresAt = Date.now() + CATALOG_UNREACHABLE_TTL_MS;
    }
    console.log(
      `\x1b[36m[GenericOpenAiLLM]\x1b[0m Could not read the model catalog for reasoning controls. ${e.message}`
    );
    return { ok: false, efforts: new Map() };
  }
}

/**
 * @param {import("openai").OpenAI} client
 * @param {string} model
 * @returns {Promise<{ok: boolean, reasoningOptions: string[]}>} Reasoning levels
 * for the model (empty when none are listed), and whether the catalog was read.
 */
async function catalogReasoningOptions(client, model) {
  const key = catalogCacheKey(client);
  let cached = catalogCache.get(key);
  if (!cached || cached.expiresAt <= Date.now()) {
    cached = { expiresAt: Date.now() + CATALOG_CACHE_TTL_MS, result: null };
    catalogCache.set(key, cached);
    cached.result = fetchReasoningEfforts(client, key);
  }

  const { ok, efforts } = await cached.result;
  const levels = new Set(
    (efforts.get(model) ?? []).map((value) =>
      value === "none" ? "off" : value
    )
  );
  return {
    ok,
    reasoningOptions: REASONING_EFFORT_LEVELS.filter((level) =>
      levels.has(level)
    ),
  };
}

module.exports = { catalogReasoningOptions, catalogCache };
