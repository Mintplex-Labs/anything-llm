const REWRITE_PROMPT = `Given a chat history and the latest user question which might reference context in the chat history, determine if the question needs to be reformulated to be understood without the chat history.

If the question already contains its own subject or topic, return it EXACTLY as written — do not rephrase, expand, or modify it in any way.

Only reformulate when the question contains pronouns (it, that, they), demonstratives (this, these), or incomplete references (the first one, the second) that refer to the chat history.

When reformulating:
- By default, the topic comes from the most recent user question. Only use an older topic if the latest question explicitly refers back to it (e.g. "back to the yoga", "the dance course from earlier").
- Preserve the question type: if the user asks "who" keep it as "who", do not change "who" to "which" or "for whom" to "when".
- Respond with ONLY the reformulated question (max 15 words).
- Include the key subject/topic from conversation history. Do NOT add information not present in the conversation.
- Write in the same language as the LATEST user question (not previous messages).`;

function shouldRewrite(userQuery, chatHistory, workspace) {
  if (!chatHistory || chatHistory.length === 0) return false;
  const mode = workspace?.queryRewriteMode ?? "off";
  if (mode !== "on") return false;
  const wordCount = userQuery.trim().split(/\s+/).length;
  const threshold = parseInt(process.env.QUERY_REWRITE_WORD_THRESHOLD) || 12;
  return wordCount <= threshold;
}

async function rewriteQueryForSearch({
  userQuery,
  chatHistory,
  LLMConnector,
  workspace,
}) {
  if (!shouldRewrite(userQuery, chatHistory, workspace)) return userQuery;

  try {
    const maxTurns = parseInt(process.env.QUERY_REWRITE_MAX_HISTORY) || 2;
    const recentHistory = chatHistory.slice(-maxTurns * 2); // 2 msgs per turn
    const historyText = recentHistory
      .map((m) => {
        // Truncate long assistant messages to keep the rewrite prompt compact
        // Keep the beginning — it usually contains the most relevant topic context
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
          content: `Chat history:\n${historyText}\n\nLatest question: ${userQuery}`,
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

    if (!rewritten) return userQuery;

    // Verbatim check — LLM returned the query as-is (self-contained)
    if (rewritten.trim().toLowerCase() === userQuery.trim().toLowerCase())
      return userQuery;

    return rewritten;
  } catch (error) {
    console.error(
      "[QueryRewrite] Failed, using original query:",
      error.message
    );
    return userQuery;
  }
}

module.exports = { rewriteQueryForSearch };
