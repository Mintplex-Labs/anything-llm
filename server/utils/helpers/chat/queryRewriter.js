const REWRITE_PROMPT = `You are a search query rewriter. Given conversation history and the user's latest message, decide whether the message needs rewriting to work as a standalone search query.

DEFAULT BEHAVIOR: Respond with UNCHANGED if the message does not need rewriting.

Only rewrite when the message DEPENDS on conversation context and cannot be understood alone:
- Pronouns without antecedent: "Is that available online?", "Tell me more about it"
- Incomplete references: "Yes, the first option", "The second one", "What about weekends?"
- Demonstratives: "How much does that cost?", "Are there more like that?"

Do NOT rewrite when the message contains its own subject/topic — respond with just UNCHANGED.

When rewriting IS needed, respond with ONLY the rewritten query (max 15 words).
Include the key subject/topic from conversation history. Write in the same language as the user.`;

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

    // --- Output validation (3 layers) ---
    // Guarantee: only return original query or a valid rewrite. Never meta-text.

    // Layer 1: Explicit UNCHANGED signal from LLM (fast path, 1 token)
    if (!rewritten || rewritten.toUpperCase().startsWith("UNCHANGED"))
      return userQuery;

    // Layer 2: LLM copied the query verbatim (fallback for less capable models)
    if (rewritten.trim().toLowerCase() === userQuery.trim().toLowerCase())
      return userQuery;

    // Layer 3: Content validation — a valid rewrite shares topic words with
    // the conversation context. Meta-responses ("no rewrite needed") do not.
    const contextWords = new Set(
      (userQuery + " " + historyText)
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w.length > 3)
    );
    const rewriteWords = rewritten
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 3);
    let hasOverlap = rewriteWords.some((w) => contextWords.has(w));

    // Fallback for non-space-separated scripts (CJK, Thai, etc.):
    // Word-level matching fails because these languages don't use spaces.
    // Individual characters carry meaning, so check for shared characters.
    if (!hasOverlap) {
      const contextChars = new Set([...(userQuery + historyText)]);
      hasOverlap = [...rewritten].some(
        (c) => c.charCodeAt(0) > 127 && contextChars.has(c)
      );
    }

    if (!hasOverlap) {
      console.log(
        `\x1b[35m[QueryRewrite]\x1b[0m Rejected meta-response: "${rewritten}"`
      );
      return userQuery;
    }

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
