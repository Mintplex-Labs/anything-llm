const REWRITE_PROMPT = `Given the conversation history and the user's latest message, rewrite the message into a standalone search query that captures the full intent. The query will be used for semantic document search.

Rules:
- Output ONLY the rewritten search query, nothing else
- Keep it concise (max 15 words)
- Include the key subject/topic from the conversation context
- If the message is already self-contained, return it unchanged
- Write in the same language as the user's message`;

function shouldRewrite(userQuery, chatHistory) {
  if (!chatHistory || chatHistory.length === 0) return false;
  if (process.env.DISABLE_QUERY_REWRITING === "true") return false;
  const wordCount = userQuery.trim().split(/\s+/).length;
  const threshold = parseInt(process.env.QUERY_REWRITE_WORD_THRESHOLD) || 12;
  return wordCount <= threshold;
}

async function rewriteQueryForSearch({ userQuery, chatHistory, LLMConnector }) {
  if (!shouldRewrite(userQuery, chatHistory)) return userQuery;

  try {
    const maxTurns = parseInt(process.env.QUERY_REWRITE_MAX_HISTORY) || 2;
    const recentHistory = chatHistory.slice(-maxTurns * 2); // 2 msgs per turn
    const historyText = recentHistory
      .map((m) => {
        // Truncate assistant messages to 150 words (keep beginning — topic + course titles)
        // End contains follow-up questions and later courses, less relevant for context
        let content = m.content;
        if (m.role === "assistant") {
          const words = content.split(/\s+/);
          if (words.length > 150)
            content = words.slice(0, 150).join(" ") + "...";
        }
        return `${m.role === "user" ? "User" : "Assistant"}: ${content}`;
      })
      .join("\n");

    const start = Date.now();
    const result = await LLMConnector.getChatCompletion(
      [
        { role: "system", content: REWRITE_PROMPT },
        {
          role: "user",
          content: `Conversation:\n${historyText}\n\nLatest message: ${userQuery}\n\nRewritten query:`,
        },
      ],
      { temperature: 0.1 }
    );

    const rewritten = result?.textResponse
      ?.trim()
      ?.replace(/<think>[\s\S]*?<\/think>/g, "") // Strip reasoning tags
      ?.split("\n")[0]
      ?.trim(); // Take first line only

    const elapsed = Date.now() - start;
    console.log(
      `\x1b[35m[QueryRewrite]\x1b[0m "${userQuery}" → "${rewritten}" (${elapsed}ms)`
    );

    return rewritten || userQuery;
  } catch (error) {
    console.error(
      "[QueryRewrite] Failed, using original query:",
      error.message
    );
    return userQuery;
  }
}

module.exports = { rewriteQueryForSearch };
