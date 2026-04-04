const EventEmitter = require("events");
const { getLLMProvider } = require("../helpers");

const CLASSIFICATION_PROMPT = `You are a message classifier. Given the user's message below, determine which category it belongs to. The categories are listed in priority order. Pick the FIRST category whose description matches the user's message.

Categories:
{categories}

Respond with ONLY the exact category name if one matches, or "none" if no category matches. Do not include any other text, explanation, or punctuation.`;

/**
 * Classify a user prompt against a batch of LLM rules using the router's
 * fallback provider/model. Returns the matched rule or null.
 * Uses the same streaming path as regular chat to work reliably across all providers.
 * @param {Array} rules - Contiguous batch of enabled LLM-type rules (priority-sorted)
 * @param {string} prompt - The user's message to classify
 * @param {Object} router - The router record (needs fallback_provider/fallback_model)
 * @returns {Promise<Object|null>} The matched rule, or null if none matched
 */
async function classifyWithLLM(rules, prompt, router) {
  if (!rules.length || !prompt) return null;

  const validRules = rules.filter((rule) => rule.description);
  if (!validRules.length) return null;

  const categories = validRules
    .map((rule) => `- ${rule.title}: ${rule.description}`)
    .join("\n");

  const systemPrompt = CLASSIFICATION_PROMPT.replace("{categories}", categories);

  try {
    const provider = getLLMProvider({
      provider: router.fallback_provider,
      model: router.fallback_model,
    });

    const messages = await provider.constructPrompt({
      systemPrompt,
      contextTexts: [],
      chatHistory: [],
      userPrompt: prompt,
      attachments: [],
    });

    const fullText = await collectStreamResponse(provider, messages);
    const text = fullText?.trim().toLowerCase() || null;
    if (!text || text === "none") return null;

    return (
      validRules.find((rule) => rule.title.toLowerCase() === text) || null
    );
  } catch (error) {
    console.error("[LLMClassifier] Classification failed:", error.message);
    return null;
  }
}

/**
 * Runs a streaming completion and collects the full text response.
 * Uses the same streaming path as regular chat (streamGetChatCompletion + handleStream)
 * so it works reliably across all providers with no special-casing.
 * @param {Object} provider - An LLM provider instance from getLLMProvider
 * @param {Array} messages - Messages array from constructPrompt
 * @returns {Promise<string>} The full text response
 */
async function collectStreamResponse(provider, messages) {
  const mockResponse = new EventEmitter();
  mockResponse.write = () => {};

  const stream = await provider.streamGetChatCompletion(messages, {
    temperature: 0,
  });
  return await provider.handleStream(mockResponse, stream, {});
}

module.exports = { classifyWithLLM };
