const { OpenAI } = require("openai");
const { AzureOpenAiLLM } = require("../../../AiProviders/azureOpenAi");
const Provider = require("./ai-provider.js");
const { tooledStream, tooledComplete } = require("./helpers/tooled.js");
const { RetryError } = require("../error.js");

/**
 * The agent provider for the Azure OpenAI API.
 * Uses the shared native tool calling helper for OpenAI-compatible tool calling.
 */
class AzureOpenAiProvider extends Provider {
  model;

  constructor(config = { model: null }) {
    const client = new OpenAI({
      apiKey: process.env.AZURE_OPENAI_KEY,
      baseURL: AzureOpenAiLLM.formatBaseUrl(process.env.AZURE_OPENAI_ENDPOINT),
    });
    super(client);
    this.model = config.model ?? process.env.OPEN_MODEL_PREF;
    this.verbose = true;
  }

  get supportsAgentStreaming() {
    return true;
  }

  /**
   * Stream a chat completion from Azure OpenAI with tool calling.
   *
   * @param {any[]} messages
   * @param {any[]} functions
   * @param {function} eventHandler
   * @returns {Promise<{ functionCall: any, textResponse: string }>}
   */
  async stream(messages, functions = [], eventHandler = null) {
    this.providerLog("Provider.stream - will process this chat completion.");

    try {
      return await tooledStream(
        this.client,
        this.model,
        messages,
        functions,
        eventHandler
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
    try {
      const result = await tooledComplete(
        this.client,
        this.model,
        messages,
        functions,
        this.getCost.bind(this)
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
