/**
 * llama.cpp exposes a non-standard token counting route alongside its
 * OpenAI-compatible chat endpoint. Other Generic OpenAI backends return 404,
 * so the caller falls back to the local token estimate.
 *
 * https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md#post-v1chatcompletionsinput_tokens-token-counting
 * @param {Object} llm - GenericOpenAiLLM instance
 * @param {Array<{role: string, content: string|object[]}>} messages
 * @returns {Promise<number|null>}
 */
async function countWithLlamaCpp(llm, messages = []) {
  if (!llm?.basePath || !Array.isArray(messages) || messages.length === 0)
    return null;

  try {
    const endpoint = new URL(llm.basePath);
    endpoint.pathname = `${endpoint.pathname.replace(
      /\/+$/,
      ""
    )}/chat/completions/input_tokens`;
    const customHeaders =
      typeof llm.constructor?.parseCustomHeaders === "function"
        ? llm.constructor.parseCustomHeaders()
        : {};
    const headers = {
      "Content-Type": "application/json",
      ...(process.env.GENERIC_OPEN_AI_API_KEY
        ? { Authorization: `Bearer ${process.env.GENERIC_OPEN_AI_API_KEY}` }
        : {}),
      ...customHeaders,
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({ model: llm.model, messages }),
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) return null;

    const count = Number((await response.json())?.input_tokens);
    return Number.isInteger(count) && count > 0 ? count : null;
  } catch {
    return null;
  }
}

module.exports = { countWithLlamaCpp };
