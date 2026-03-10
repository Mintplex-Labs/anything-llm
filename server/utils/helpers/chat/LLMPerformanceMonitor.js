const { TokenManager } = require("../tiktoken");

/**
 * @typedef {import("openai/streaming").Stream<import("openai").OpenAI.ChatCompletionChunk>} OpenAICompatibleStream
 * @typedef {(reportedUsage: {[key: string]: number, completion_tokens?: number, prompt_tokens?: number}) => StreamMetrics} EndMeasurementFunction
 * @typedef {Array<{content: string}>} Messages
 */

/**
 * @typedef {Object} StreamMetrics
 * @property {number} prompt_tokens - the number of tokens in the prompt
 * @property {number} completion_tokens - the number of tokens in the completion
 * @property {number} total_tokens - the total number of tokens
 * @property {number} outputTps - the tokens per second of the output
 * @property {number} duration - the duration of the stream
 */

/**
 * @typedef {Object} MonitoredStream
 * @property {number} start - the start time of the stream
 * @property {number} duration - the duration of the stream
 * @property {StreamMetrics} metrics - the metrics of the stream
 * @property {EndMeasurementFunction} endMeasurement - the method to end the stream and calculate the metrics
 */

class LLMPerformanceMonitor {
  static tokenManager = new TokenManager();
  /**
   * Counts the tokens in the messages.
   * @param {Array<{content: string}>} messages - the messages sent to the LLM so we can calculate the prompt tokens since most providers do not return this on stream
   * @returns {number}
   */
  static countTokens(messages = []) {
    try {
      return this.tokenManager.statsFrom(messages);
    } catch {
      return 0;
    }
  }
  /**
   * Wraps a function and logs the duration (in seconds) of the function call.
   * If the output contains a `usage.duration` property, it will be used instead of the calculated duration.
   * This allows providers to supply more accurate timing information.
   * @param {Function} func
   * @returns {Promise<{output: any, duration: number}>}
   */
  static measureAsyncFunction(func) {
    return (async () => {
      const start = Date.now();
      const output = await func; // is a promise
      const end = Date.now();
      const duration = output?.usage?.duration ?? (end - start) / 1000;
      return { output, duration };
    })();
  }

  /**
   * HTTP status codes that indicate a transient failure worth retrying.
   * @type {Set<number>}
   */
  static RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504]);

  /**
   * Determines whether an error is transient and worth retrying.
   * @param {Error} error
   * @returns {boolean}
   */
  static isRetryableError(error) {
    const name = error?.constructor?.name || "";
    if (
      name === "RateLimitError" ||
      name === "APIConnectionError" ||
      name === "APITimeoutError" ||
      name === "InternalServerError"
    )
      return true;

    const status = error?.status ?? error?.statusCode ?? null;
    if (status && this.RETRYABLE_STATUS_CODES.has(status)) return true;

    const msg = (error?.message || "").toLowerCase();
    if (
      msg.includes("timeout") ||
      msg.includes("econnreset") ||
      msg.includes("econnrefused") ||
      msg.includes("temporarily unavailable") ||
      msg.includes("rate limit")
    )
      return true;

    return false;
  }

  /**
   * Like `measureAsyncFunction` but accepts a **function** (thunk) that returns
   * a promise, enabling automatic retry with exponential backoff on transient
   * errors such as rate limits (429), server errors (5xx), and timeouts.
   *
   * Permanent errors (401 auth, 400 bad request) are thrown immediately.
   *
   * @param {() => Promise<any>} fn - A function that initiates the API request.
   * @param {Object} [opts]
   * @param {number} [opts.maxRetries=3] - Maximum number of retry attempts.
   * @param {number} [opts.baseDelay=1000] - Initial delay in ms before the first retry.
   * @returns {Promise<{output: any, duration: number}>}
   */
  static async measureWithRetry(fn, { maxRetries = 3, baseDelay = 1000 } = {}) {
    const start = Date.now();
    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const output = await fn();
        const end = Date.now();
        const duration = output?.usage?.duration ?? (end - start) / 1000;
        return { output, duration };
      } catch (error) {
        lastError = error;

        if (attempt >= maxRetries || !this.isRetryableError(error)) {
          throw error;
        }

        const delay = Math.min(baseDelay * 2 ** attempt, 60000);
        const jitter = Math.random() * delay * 0.5;
        console.log(
          `\x1b[33m[LLMRetry]\x1b[0m ${error?.constructor?.name || "Error"}: ${
            (error?.message || "").slice(0, 120)
          }. Retrying in ${((delay + jitter) / 1000).toFixed(1)}s (attempt ${
            attempt + 1
          }/${maxRetries})`
        );
        await new Promise((r) => setTimeout(r, delay + jitter));
      }
    }

    throw lastError;
  }

  /**
   * Wraps a completion stream and and attaches a start time and duration property to the stream.
   * Also attaches an `endMeasurement` method to the stream that will calculate the duration of the stream and metrics.
   * @param {Object} opts
   * @param {Promise<OpenAICompatibleStream>} opts.func
   * @param {Messages} [opts.messages=[]] - the messages sent to the LLM so we can calculate the prompt tokens since most providers do not return this on stream
   * @param {boolean} [opts.runPromptTokenCalculation=true] - whether to run the prompt token calculation to estimate the `prompt_tokens` metric. This is useful for providers that do not return this on stream.
   * @param {string} [opts.modelTag=""] - the tag of the model that was used to generate the stream (eg: gpt-4o, claude-3-5-sonnet, qwen3/72b-instruct, etc.)
   * @param {string} [opts.provider=""] - the class name of the LLM that was used to generate the stream (eg: OpenAI, Anthropic, LMStudio, ApiPie, etc.)
   * @returns {Promise<MonitoredStream>}
   */
  static async measureStream({
    func,
    messages = [],
    runPromptTokenCalculation = true,
    modelTag = "",
    provider = "",
  }) {
    const stream = await func;
    stream.start = Date.now();
    stream.duration = 0;
    stream.metrics = {
      completion_tokens: 0,
      prompt_tokens: runPromptTokenCalculation ? this.countTokens(messages) : 0,
      total_tokens: 0,
      outputTps: 0,
      duration: 0,
      ...(modelTag ? { model: modelTag } : {}),
      ...(provider ? { provider: provider } : {}),
    };

    stream.endMeasurement = (reportedUsage = {}) => {
      const end = Date.now();
      const estimatedDuration = (end - stream.start) / 1000;

      // Merge the reported usage with the existing metrics
      // so the math in the metrics object is correct when calculating
      stream.metrics = {
        ...stream.metrics,
        ...reportedUsage,
        duration: reportedUsage?.duration ?? estimatedDuration,
        timestamp: new Date(),
      };

      stream.metrics.total_tokens =
        stream.metrics.prompt_tokens + (stream.metrics.completion_tokens || 0);
      stream.metrics.outputTps =
        stream.metrics.completion_tokens / stream.metrics.duration;
      return stream.metrics;
    };
    return stream;
  }
}

module.exports = {
  LLMPerformanceMonitor,
};
