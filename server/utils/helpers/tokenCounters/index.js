/**
 * Provider-specific prompt token counters.
 *
 * A provider that exposes its own tokenizer can count a chat prompt exactly,
 * which is important for local models where the cl100k_base fallback can be
 * wrong (for example, CJK text). Every counter returns `null` when it cannot
 * produce a count so callers can fall back to TokenManager's local estimate.
 *
 * To add a provider, register a function keyed by its connector class name.
 * The function receives the connector instance and the OpenAI-shaped messages.
 *
 * Native counters available today:
 * - GenericOpenAiLLM when the backend is llama.cpp (input_tokens route)
 * - AnthropicLLM (messages.countTokens)
 * - GeminiLLM (models.countTokens)
 *
 * OpenAI and Azure OpenAI already use their exact tiktoken encoding through
 * getEncodingNameForModel. Providers without a counting API intentionally fall
 * back to the local estimate rather than guessing.
 */

const { countWithLlamaCpp } = require("./llamaCpp");
const { countWithAnthropic } = require("./anthropic");
const { countWithGemini } = require("./gemini");

const tokenCounters = new Map([
  ["GenericOpenAiLLM", countWithLlamaCpp],
  ["AnthropicLLM", countWithAnthropic],
  ["GeminiLLM", countWithGemini],
]);

/**
 * @param {string} className - LLM connector class name
 * @param {(llm: Object, messages: Object[]) => Promise<number|null>} counter
 */
function registerPromptTokenCounter(className, counter) {
  tokenCounters.set(className, counter);
}

/**
 * @param {Object|null} llm - Instantiated LLM connector
 * @returns {((llm: Object, messages: Object[]) => Promise<number|null>)|null}
 */
function getPromptTokenCounter(llm = null) {
  if (!llm?.className) return null;
  return tokenCounters.get(llm.className) ?? null;
}

module.exports = {
  getPromptTokenCounter,
  registerPromptTokenCounter,
};
