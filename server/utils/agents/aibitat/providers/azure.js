const { OpenAI } = require("openai");
const { AzureOpenAiLLM } = require("../../../AiProviders/azureOpenAi");
const Provider = require("./ai-provider.js");
const { tooledStream, tooledComplete } = require("./helpers/tooled.js");
const {
  responsesTooledStream,
  responsesTooledComplete,
} = require("./helpers/responsesTooled.js");
const { RetryError } = require("../error.js");

/**
 * The agent provider for the Azure OpenAI API.
 * Uses the shared native tool calling helper for OpenAI-compatible tool calling,
 * and the Responses API with native tool calling for reasoning deployments.
 */
class AzureOpenAiProvider extends Provider {
  model;

  constructor(config = { model: null }) {
    const client = new OpenAI({
      apiKey: process.env.AZURE_OPENAI_KEY,
      baseURL: AzureOpenAiLLM.formatBaseUrl(process.env.AZURE_OPENAI_ENDPOINT),
    });
    super(client);
    this.providerTag = "azure";
    this.model =
      config.model ||
      process.env.AZURE_OPENAI_MODEL_PREF ||
      process.env.OPEN_MODEL_PREF;
    this.verbose = true;
  }

  get supportsAgentStreaming() {
    return true;
  }

  /**
   * Reasoning deployments (eg: GPT-6) reject function tools on Chat Completions
   * unless reasoning_effort is "none", and only support them via the Responses API.
   * Azure does not expose model metadata, so this relies on the user-declared
   * AZURE_OPENAI_MODEL_TYPE, same as the Azure OpenAI LLM provider.
   * @returns {boolean}
   */
  get #usesResponsesAPI() {
    return process.env.AZURE_OPENAI_MODEL_TYPE === "reasoning";
  }

  /**
   * Stream a chat completion from Azure OpenAI with tool calling.
   *
   * @param {any[]} messages
   * @param {any[]} functions
   * @param {function} eventHandler
   * @returns {Promise<{ functionCall: any, textResponse: string, uuid: string }>}
   */
  async stream(messages, functions = [], eventHandler = null) {
    if (this.#usesResponsesAPI) {
      this.providerLog(
        "Provider.stream (responses) - will process this chat completion."
      );
      return await responsesTooledStream(
        this.client,
        this.model,
        messages,
        functions,
        eventHandler,
        { provider: this }
      );
    }

    this.providerLog("Provider.stream - will process this chat completion.");

    try {
      return await tooledStream(
        this.client,
        this.model,
        messages,
        functions,
        eventHandler,
        { provider: this }
      );
    } catch (error) {
      console.error(error.message, error);
      if (error instanceof OpenAI.AuthenticationError) throw error;
      if (
        error instanceof OpenAI.RateLimitError ||
        error instanceof OpenAI.InternalServerError ||
        error instanceof OpenAI.APIError
      ) {
        throw new RetryError(error.message);
      }
      throw error;
    }
  }

  /**
   * Create a completion based on the received messages with tool calling.
   *
   * @param {any[]} messages
   * @param {any[]} functions
   * @returns The completion.
   */
  async complete(messages, functions = []) {
    if (this.#usesResponsesAPI) {
      return await responsesTooledComplete(
        this.client,
        this.model,
        messages,
        functions,
        { provider: this }
      );
    }

    try {
      const result = await tooledComplete(
        this.client,
        this.model,
        messages,
        functions,
        this.getCost.bind(this),
        { provider: this }
      );

      if (result.retryWithError) {
        return this.complete([...messages, result.retryWithError], functions);
      }

      return result;
    } catch (error) {
      if (error instanceof OpenAI.AuthenticationError) throw error;
      if (
        error instanceof OpenAI.RateLimitError ||
        error instanceof OpenAI.InternalServerError ||
        error instanceof OpenAI.APIError
      ) {
        throw new RetryError(error.message);
      }
      throw error;
    }
  }

  /**
   * Get the cost of the completion.
   * Stubbed since Azure OpenAI has no public cost basis.
   *
   * @param _usage The completion to get the cost for.
   * @returns The cost of the completion.
   */
  getCost(_usage) {
    return 0;
  }
}

module.exports = AzureOpenAiProvider;
