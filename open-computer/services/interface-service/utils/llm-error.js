/**
 * LLM Error Classification
 *
 * Detects common failure modes from local models (LMStudio, Ollama) and
 * cloud providers. Returns structured error info the proxy can act on.
 */

const ERROR_TYPES = {
  CONTEXT_EXCEEDED: "context_exceeded",
  RATE_LIMIT:       "rate_limit",
  AUTH_ERROR:       "auth_error",
  MODEL_NOT_FOUND:  "model_not_found",
  CONNECTION_ERROR: "connection_error",
  TIMEOUT:          "timeout",
  UPSTREAM_ERROR:   "upstream_error",
};

// ─── Pattern tables ────────────────────────────────────────────────────────

const CONTEXT_PATTERNS = [
  /context.{0,30}(length|window|size|limit)/i,
  /context_length_exceeded/i,
  /maximum.{0,30}(context|token)/i,
  /too.{0,30}(long|large)/i,
  /prompt.{0,30}too.{0,30}long/i,
  /exceeds.{0,30}(context|token|limit)/i,
  /input.{0,30}too.{0,30}long/i,
  /sequence.{0,20}exceed/i,
  /\bKV\b.{0,20}(full|exceed)/i,   // LMStudio KV-cache full
  /tokens?.{0,20}exceed/i,
  /n_ctx/i,                          // Ollama context size setting
  /max_tokens.*exceed/i,
];

const RATE_PATTERNS = [
  /rate.{0,20}limit/i,
  /too.{0,20}many.{0,20}requests/i,
  /quota.{0,20}exceed/i,
];

const AUTH_PATTERNS = [
  /unauthorized/i,
  /invalid.{0,20}api.{0,20}key/i,
  /authentication.{0,20}failed/i,
  /access.{0,20}denied/i,
];

const MODEL_PATTERNS = [
  /model.{0,30}not.{0,30}found/i,
  /no.{0,20}such.{0,20}model/i,
  /model.{0,30}does.{0,30}not.{0,20}exist/i,
  /unknown.{0,20}model/i,
];

const CONNECTION_PATTERNS = [
  /econnrefused/i,
  /enotfound/i,
  /econnreset/i,
  /network.*error/i,
  /connection.{0,20}refused/i,
  /failed.{0,20}to.{0,20}(connect|fetch)/i,
  /socket.{0,20}hang/i,
  /fetch.{0,20}failed/i,
  /aborted/i,
];

// ─── Classifier ────────────────────────────────────────────────────────────

/**
 * Classify an error from an HTTP response body string and status code.
 *
 * @param {string} text     Raw error text (body or message)
 * @param {number} status   HTTP status code (or null for network errors)
 * @returns {{ type: string, userMessage: string, canRetry: boolean }}
 */
function classifyLlmError(text, status = null) {
  const t = String(text || "");
  const tl = t.toLowerCase();

  // Context window — 400 from local models is almost always this.
  // Be generous: any context pattern OR bare 400 qualifies.
  if (
    CONTEXT_PATTERNS.some((p) => p.test(tl)) ||
    (status === 400 && !AUTH_PATTERNS.some((p) => p.test(tl)))
  ) {
    return {
      type: ERROR_TYPES.CONTEXT_EXCEEDED,
      userMessage:
        "Context window exceeded — the conversation is too long for this model. " +
        "Compressing history and retrying…",
      canRetry: true,
    };
  }

  if (RATE_PATTERNS.some((p) => p.test(tl)) || status === 429) {
    return {
      type: ERROR_TYPES.RATE_LIMIT,
      userMessage:
        "Rate limit reached — please wait a moment, then try again.",
      canRetry: false,
    };
  }

  if (AUTH_PATTERNS.some((p) => p.test(tl)) || status === 401 || status === 403) {
    return {
      type: ERROR_TYPES.AUTH_ERROR,
      userMessage:
        "Authentication failed — check your API key in settings.",
      canRetry: false,
    };
  }

  if (MODEL_PATTERNS.some((p) => p.test(tl)) || status === 404) {
    return {
      type: ERROR_TYPES.MODEL_NOT_FOUND,
      userMessage:
        "Model not found — verify the model name in settings and make sure it " +
        "is loaded in LMStudio/Ollama.",
      canRetry: false,
    };
  }

  if (CONNECTION_PATTERNS.some((p) => p.test(tl))) {
    return {
      type: ERROR_TYPES.CONNECTION_ERROR,
      userMessage:
        "Cannot reach the LLM endpoint — is LMStudio / Ollama running and " +
        "is the proxy target URL correct?",
      canRetry: false,
    };
  }

  if (status === 413) {
    return {
      type: ERROR_TYPES.CONTEXT_EXCEEDED,
      userMessage:
        "Request too large (413) — compressing context and retrying…",
      canRetry: true,
    };
  }

  return {
    type: ERROR_TYPES.UPSTREAM_ERROR,
    userMessage: `LLM error (HTTP ${status ?? "?"}): ${t.slice(0, 300)}`,
    canRetry: false,
  };
}

module.exports = { classifyLlmError, ERROR_TYPES };
