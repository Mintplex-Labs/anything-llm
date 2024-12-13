const { TokenManager } = require("../tiktoken");

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
    } catch (e) {
      return 0;
    }
  }
  /**
   * Wraps a function and logs the duration (in seconds) of the function call.
   * @param {Function} func
   * @returns {Promise<{output: any, duration: number}>}
   */
  static measureAsyncFunction(func) {
    return (async () => {
      const start = Date.now();
      const output = await func; // is a promise
      const end = Date.now();
      return { output, duration: (end - start) / 1000 };
    })();
  }

  /**
   * Wraps a completion stream and and attaches a start time and duration property to the stream.
   * Also attaches an `endMeasurement` method to the stream that will calculate the duration of the stream and metrics.
   * @param {Promise<import("openai/streaming").Stream<import("openai").OpenAI.ChatCompletionChunk>>} func
   * @param {Array<Object>} messages - the messages sent to the LLM so we can calculate the prompt tokens since most providers do not return this on stream
   * @returns {Promise<import("openai/streaming").Stream<import("openai").OpenAI.ChatCompletionChunk> & {start: number, duration: number, endMeasurement: () => {duration: number}}>}
   */
  static async measureStream(func, messages = []) {
    const stream = await func;
    stream.start = Date.now();
    stream.duration = 0;
    stream.metrics = {
      completion_tokens: 0,
      prompt_tokens: this.countTokens(messages),
      total_tokens: 0,
      outputTps: 0,
      duration: 0,
    };

    /**
     * Stop the stream and log the duration to the stream object.
     * Will mutate the stream object to fill out the `.metrics` property.
     * @param {{[key: string]: number}} reportedUsage - the usage metrics to report from provider
     * @returns {{[key: string]: number, outputTps: number, duration: number}}
     */
    stream.endMeasurement = (reportedUsage = {}) => {
      const end = Date.now();
      const duration = (end - stream.start) / 1000;
      stream.metrics = {
        ...stream.metrics,
        ...reportedUsage,
        total_tokens:
          stream.metrics.prompt_tokens + (reportedUsage.completion_tokens || 0),
        outputTps: reportedUsage.hasOwnProperty("completion_tokens")
          ? reportedUsage.completion_tokens / duration
          : null,
        duration,
      };
      return stream.metrics;
    };
    return stream;
  }
}

module.exports = {
  LLMPerformanceMonitor,
};
