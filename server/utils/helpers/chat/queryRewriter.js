const REWRITE_PROMPT = `Given a chat history and the latest user question which might reference context in the chat history, determine if the question needs to be reformulated to be understood without the chat history.

If the question is fully self-contained — meaning a stranger could understand it without any prior conversation — return it EXACTLY as written. Do not rephrase, expand, or modify it. NEVER translate or switch the language of a self-contained question.

If the question would be unclear or ambiguous to someone who has NOT read the chat history, reformulate it by adding the missing context from the history. When in doubt, reformulate — it is better to add context than to lose it.

When reformulating:
- Extract the SPECIFIC topic from the most recent USER question (not from the assistant response). Use the EXACT words the user used — never shorten, generalize, or drop qualifiers.
- For very short questions (1-3 words), ALWAYS combine them with the topic from the last user question into a complete sentence. Short questions always refer to the most recent topic.
- Only use an older topic if the latest question explicitly refers back to it.
- Keep the question structure intact: the question word(s) at the start of the user's question MUST remain at the start of the reformulated question. Only append the missing topic — never restructure the sentence.
- Respond with ONLY the reformulated question (max 15 words).
- NEVER generalize the topic. Keep the full compound noun or phrase from the user's question. Do not drop adjectives, prefixes, or qualifiers.
- Do NOT add information not present in the conversation.
- Write in the same language as the LATEST user question (not previous messages).`;

async function shouldRewrite(userQuery, chatHistory, workspace) {
  if (!chatHistory || chatHistory.length === 0) return false;
  let mode = workspace?.queryRewriteMode;
  // If workspace value is not explicitly set, resolve via system setting → ENV → "off"
  if (mode !== "on" && mode !== "off") {
    const { SystemSettings } = require("../../../models/systemSettings");
    const systemDefault = await SystemSettings.getValueOrFallback(
      { label: "query_rewrite_default" },
      null
    );
    if (systemDefault === "on" || systemDefault === "off") {
      mode = systemDefault;
    } else {
      mode = process.env.QUERY_REWRITING === "true" ? "on" : "off";
    }
  }
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
  if (!(await shouldRewrite(userQuery, chatHistory, workspace))) return userQuery;

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
