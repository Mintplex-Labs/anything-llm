/**
 * Reasoning levels an OpenAI-compatible backend lists on `GET /models`. This is
 * not part of the OpenAI spec, so each backend's shape gets a parser below. The
 * catalog is cached per base path, failed lookups included.
 */
const { REASONING_EFFORT_LEVELS } = require("../../helpers/reasoningEffort");

const CATALOG_CACHE_TTL_MS = 30 * 60 * 1000;
const CATALOG_TIMEOUT_MS = 5_000;

/** @type {Array<(entry: object) => string[]|undefined>} */
const REASONING_EFFORT_PARSERS = [
  // NanoGPT
  // https://docs.nano-gpt.com/api-reference/endpoint/models
  // https://docs.nano-gpt.com/api-reference/miscellaneous/extended-thinking
  (entry) => entry?.reasoning_efforts,
];

/** @type {Map<string, {expiresAt: number, efforts: Promise<Map<string, string[]>>}>} */
const catalogCache = new Map();

/**
 * @param {import("openai").OpenAI} client
 * @returns {Promise<Map<string, string[]>>} Effort values by model id
 */
async function fetchReasoningEfforts(client) {
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
    return efforts;
  } catch (e) {
    console.log(
      `\x1b[36m[GenericOpenAiLLM]\x1b[0m Could not read the model catalog for reasoning controls. ${e.message}`
    );
    return new Map();
  }
}

/**
 * @param {import("openai").OpenAI} client
 * @param {string} model
 * @returns {Promise<string[]>} Reasoning levels for the model, empty when none are listed
 */
async function catalogReasoningOptions(client, model) {
  const key = client.baseURL;
  let cached = catalogCache.get(key);
  if (!cached || cached.expiresAt <= Date.now()) {
    cached = {
      expiresAt: Date.now() + CATALOG_CACHE_TTL_MS,
      efforts: fetchReasoningEfforts(client),
    };
    catalogCache.set(key, cached);
  }

  const values = (await cached.efforts).get(model) ?? [];
  const levels = new Set(
    values.map((value) => (value === "none" ? "off" : value))
  );
  return REASONING_EFFORT_LEVELS.filter((level) => levels.has(level));
}

module.exports = { catalogReasoningOptions, catalogCache };
