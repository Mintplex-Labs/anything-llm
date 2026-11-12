/**
 * Anthropic's Messages API exposes a count_tokens route that accounts for the
 * model's chat template and system prompt.
 * @param {Object} llm - AnthropicLLM instance
 * @param {Array<{role: string, content: string|object[]}>} messages
 * @returns {Promise<number|null>}
 */
async function countWithAnthropic(llm, messages = []) {
  const countTokens = llm?.anthropic?.messages?.countTokens;
  if (typeof countTokens !== "function" || !Array.isArray(messages))
    return null;

  const [system, ...chatMessages] = messages;
  if (!system || system.role !== "system" || chatMessages.length === 0)
    return null;

  try {
    const result = await countTokens.call(llm.anthropic.messages, {
      model: llm.model,
      system: system.content,
      messages: chatMessages,
    });
    const count = Number(result?.input_tokens);
    return Number.isInteger(count) && count > 0 ? count : null;
  } catch {
    return null;
  }
}

module.exports = { countWithAnthropic };
