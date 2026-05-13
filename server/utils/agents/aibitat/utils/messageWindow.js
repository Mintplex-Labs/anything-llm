const { TokenManager } = require("../../../helpers/tiktoken");
const Provider = require("../providers/ai-provider");

// Reserve a portion of the context window for the model's response, tools, and provider overhead.
const CONTEXT_BUDGET_RATIO = 0.85;

function countMessageTokens(tokenManager, message) {
  if (!message?.content) return 0;
  if (typeof message.content === "string")
    return tokenManager.countFromString(message.content);
  if (Array.isArray(message.content)) {
    return message.content.reduce((acc, part) => {
      if (part?.type === "text" && part.text)
        return acc + tokenManager.countFromString(part.text);
      return acc;
    }, 0);
  }
  return 0;
}

/**
 * Trim the oldest user/assistant pairs from the messages array until the total
 * fits within the model's context window. The system prompt (first item) and
 * the current user message (last item) are never dropped. Messages are popped
 * in pairs so the alternating user/assistant structure is preserved.
 *
 * @param {Object} args
 * @param {Array<{role: string, content: any}>} args.messages
 * @param {string} args.provider - Provider tag (e.g., "openai").
 * @param {string} args.model - Model name.
 * @param {Function} [args.onTruncate] - Called once with `{ droppedPairs, contextLimit, budget, remainingTokens }` when truncation occurs.
 * @returns {Array} The trimmed messages (new array; original is not mutated).
 */
function trimMessagesToContextWindow({
  messages = [],
  provider,
  model,
  onTruncate = () => {},
}) {
  if (!Array.isArray(messages) || messages.length < 4) return messages;

  const contextLimit = Provider.contextLimit(provider, model);
  const budget = Math.floor(contextLimit * CONTEXT_BUDGET_RATIO);
  const tokenManager = new TokenManager(model);

  let totalTokens = messages.reduce(
    (acc, m) => acc + countMessageTokens(tokenManager, m),
    0
  );
  if (totalTokens <= budget) return messages;

  // Keep messages[0] (system) and the last message (current user prompt).
  // Pop pairs at index 1 (oldest user + oldest assistant) until we fit.
  const trimmed = [...messages];
  let droppedPairs = 0;
  while (totalTokens > budget && trimmed.length >= 4) {
    if (trimmed[1]?.role !== "user" || trimmed[2]?.role !== "assistant") break;
    const popped = trimmed.splice(1, 2);
    droppedPairs += 1;
    totalTokens -= popped.reduce(
      (acc, m) => acc + countMessageTokens(tokenManager, m),
      0
    );
  }

  if (droppedPairs > 0)
    onTruncate({
      droppedPairs,
      contextLimit,
      budget,
      remainingTokens: totalTokens,
    });

  return trimmed;
}

module.exports = { trimMessagesToContextWindow };
