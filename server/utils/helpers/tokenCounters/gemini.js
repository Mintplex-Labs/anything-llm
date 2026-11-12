/**
 * Gemini's countTokens route uses the model's own tokenizer and accepts the
 * same content parts as generateContent. Any non-text part is treated as
 * unsupported so the caller falls back rather than making an unsafe estimate.
 * @param {Object} llm - GeminiLLM instance
 * @param {Array<{role: string, content: string|object[]}>} messages
 * @returns {Promise<number|null>}
 */
async function countWithGemini(llm, messages = []) {
  if (!process.env.GEMINI_API_KEY || !llm?.model || !Array.isArray(messages))
    return null;

  let systemInstruction = null;
  const contents = [];
  for (const message of messages) {
    const parts = textParts(message?.content);
    if (!parts) return null;

    if (message.role === "system") {
      systemInstruction = { parts };
      continue;
    }

    contents.push({
      role: message.role === "assistant" ? "model" : "user",
      parts,
    });
  }
  if (contents.length === 0) return null;

  try {
    const model = String(llm.model).replace(/^models\//, "");
    const endpoint = new URL(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        model
      )}:countTokens`
    );
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents,
        ...(systemInstruction ? { systemInstruction } : {}),
      }),
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) return null;

    const count = Number((await response.json())?.totalTokens);
    return Number.isInteger(count) && count > 0 ? count : null;
  } catch {
    return null;
  }
}

/**
 * @param {string|object[]|null} content
 * @returns {{text: string}[]|null}
 */
function textParts(content) {
  if (typeof content === "string") return [{ text: content }];
  if (!Array.isArray(content)) return null;

  const parts = [];
  for (const part of content) {
    if (part?.type !== "text" || typeof part.text !== "string") return null;
    parts.push({ text: part.text });
  }
  return parts.length > 0 ? parts : null;
}

module.exports = { countWithGemini };
