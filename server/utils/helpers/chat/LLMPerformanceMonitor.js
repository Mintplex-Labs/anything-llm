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
   * Wraps a completion stream and and attaches a start time and duration property to the stream.
   * Also attaches an `endMeasurement` method to the stream that will calculate the duration of the stream and metrics.
   * @param {Object} opts
   * @param {Promise<OpenAICompatibleStream>} opts.func
   * @param {Messages} [opts.messages=[]] - the messages sent to the LLM so we can calculate the prompt tokens since most providers do not return this on stream
   * @param {boolean} [opts.runPromptTokenCalculation=true] - whether to run the prompt token calculation to estimate the `prompt_tokens` metric. This is useful for providers that do not return this on stream.
   * @param {string} [opts.modelTag=""] - the tag of the model that was used to generate the stream (eg: gpt-4o, claude-3-5-sonnet, qwen3/72b-instruct, etc.)
   * @returns {Promise<MonitoredStream>}
   */
  static async measureStream({
    func,
    messages = [],
    runPromptTokenCalculation = true,
    modelTag = "",
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
