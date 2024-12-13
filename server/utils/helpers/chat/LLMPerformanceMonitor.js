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
   * @param {Promise<OpenAICompatibleStream>} func
   * @param {Messages} messages - the messages sent to the LLM so we can calculate the prompt tokens since most providers do not return this on stream
   * @param {boolean} runPromptTokenCalculation - whether to run the prompt token calculation to estimate the `prompt_tokens` metric. This is useful for providers that do not return this on stream.
   * @returns {Promise<MonitoredStream>}
   */
  static async measureStream(
    func,
    messages = [],
    runPromptTokenCalculation = true
  ) {
    const stream = await func;
    stream.start = Date.now();
    stream.duration = 0;
    stream.metrics = {
      completion_tokens: 0,
      prompt_tokens: runPromptTokenCalculation ? this.countTokens(messages) : 0,
      total_tokens: 0,
      outputTps: 0,
      duration: 0,
    };

    stream.endMeasurement = (reportedUsage = {}) => {
      const end = Date.now();
      const duration = (end - stream.start) / 1000;

      // Merge the reported usage with the existing metrics
      // so the math in the metrics object is correct when calculating
      stream.metrics = {
        ...stream.metrics,
        ...reportedUsage,
      };

      stream.metrics.total_tokens =
        stream.metrics.prompt_tokens + (stream.metrics.completion_tokens || 0);
      stream.metrics.outputTps = stream.metrics.completion_tokens / duration;
      stream.metrics.duration = duration;
      return stream.metrics;
    };
    return stream;
  }
}

module.exports = {
  LLMPerformanceMonitor,
};
