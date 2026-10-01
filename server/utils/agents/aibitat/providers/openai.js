const OpenAI = require("openai");
const Provider = require("./ai-provider.js");
const { reasoningParams } = require("../../../helpers/reasoningEffort");
const {
  responsesTooledStream,
  responsesTooledComplete,
} = require("./helpers/responsesTooled.js");

/**
 * The agent provider for the OpenAI API.
 * By default, the model is set to 'gpt-4.1-nano'.
 */
class OpenAIProvider extends Provider {
  model;
  constructor(config = {}) {
    const {
      options = {
        apiKey: process.env.OPEN_AI_KEY,
      },
      model = "gpt-4.1-nano",
      reasoningEffort = null,
    } = config;

    const client = new OpenAI(options);

    super(client);

    this.providerTag = "openai";
    this.model = model;
    this.reasoningEffort = reasoningEffort;
  }

  /**
   * The reasoning portion of the request body. The effort is validated against
   * the model before the provider is built, so it only needs mapping here.
   * @returns {object}
   */
  get reasoningConfig() {
    return reasoningParams("openai", this.reasoningEffort, this.model);
  }

  get supportsAgentStreaming() {
    return true;
  }

  /**
   * Whether this provider supports native OpenAI-compatible tool calling.
   * - OpenAI always supports tool calling.
   * @returns {boolean}
   */
  supportsNativeToolCalling() {
    return true;
  }

  /**
   * Stream a chat completion from the LLM with tool calling via the Responses API.
   *
   * @param {any[]} messages - The messages to send to the LLM.
   * @param {any[]} functions - The functions to use in the LLM.
   * @param {function} eventHandler - The event handler to use to report stream events.
   * @returns {Promise<{ functionCall: any, textResponse: string }>} - The result of the chat completion.
   */
  async stream(messages, functions = [], eventHandler = null) {
    this.providerLog("OpenAI.stream - will process this chat completion.");
    return await responsesTooledStream(
      this.client,
      this.model,
      messages,
      functions,
      eventHandler,
      { provider: this }
    );
  }

  /**
   * Create a completion based on the received messages via the Responses API.
   *
   * @param messages A list of messages to send to the OpenAI API.
   * @param functions
   * @returns The completion.
   */
  async complete(messages, functions = []) {
    this.providerLog("OpenAI.complete - will process this chat completion.");
    return await responsesTooledComplete(
      this.client,
      this.model,
      messages,
      functions,
      { provider: this }
    );
  }

  /**
   * Get the cost of the completion.
   * @returns {number} The cost of the completion (currently returns 0).
   */
  getCost() {
    return 0;
  }
}

module.exports = OpenAIProvider;
