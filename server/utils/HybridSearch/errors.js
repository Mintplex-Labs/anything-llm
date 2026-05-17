/**
 * Typed errors for HybridSearch so callers can branch on failure mode
 * without string-matching error messages.
 */

class HybridSearchError extends Error {
  /**
   * @param {string} code - Machine-readable error code (UPPER_SNAKE)
   * @param {string} message - Human-readable message
   * @param {Object} [context] - Structured fields for logs/telemetry
   * @param {Error} [cause] - Underlying error to preserve stack
   */
  constructor(code, message, context = {}, cause = null) {
    super(message);
    this.name = "HybridSearchError";
    this.code = code;
    this.context = context;
    if (cause) this.cause = cause;
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      context: this.context,
      cause: this.cause?.message,
    };
  }
}

/**
 * Wrap any error thrown inside the orchestrator with context. Preserves the
 * original stack via `cause` (Node ≥16.9) so debugging isn't degraded.
 */
function wrapError(code, message, context, originalError) {
  if (originalError instanceof HybridSearchError) return originalError;
  return new HybridSearchError(code, message, context, originalError);
}

module.exports = { HybridSearchError, wrapError };
