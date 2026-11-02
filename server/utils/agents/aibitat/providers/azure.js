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
 * or the Responses API when AZURE_OPENAI_AGENT_API is set to "responses".
 */
class AzureOpenAiProvider extends Provider {
  model;

  /**
   * Not every Azure deployment or region supports the Responses API, so agent
   * calls use Chat Completions unless the user opts in. Newer reasoning
   * deployments (eg: GPT-6) reject function tools on Chat Completions, so this
   * also flips on for the session when a deployment asks for /v1/responses.
   */
  #useResponsesAPI = process.env.AZURE_OPENAI_AGENT_API === "responses";

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
   * Switches this session to the Responses API if the error is a deployment
   * refusing function tools on Chat Completions.
   * @param {Error & {status?: number}} error
   * @returns {boolean} Whether the request should be retried on the Responses API.
   */
  #switchToResponsesAPI(error) {
    if (this.#useResponsesAPI) return false;
    if (error?.status !== 400 || !/\/v1\/responses/.test(error?.message ?? ""))
      return false;
    this.providerLog(
      "Deployment requires the Responses API for tool calls - switching for this session."
    );
    this.#useResponsesAPI = true;
    return true;
  }

  /**
   * Maps an Azure OpenAI error to the error aibitat should handle.
   * @param {Error} error
   * @returns {Error}
   */
  #toAgentError(error) {
    if (error instanceof OpenAI.AuthenticationError) return error;
    if (
      error instanceof OpenAI.RateLimitError ||
      error instanceof OpenAI.InternalServerError ||
      error instanceof OpenAI.APIError
    ) {
      return new RetryError(error.message);
    }
    return error;
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
    const streamFn = this.#useResponsesAPI
      ? responsesTooledStream
      : tooledStream;
    this.providerLog(
      `Provider.stream${this.#useResponsesAPI ? " (responses)" : ""} - will process this chat completion.`
    );

    try {
      return await streamFn(
        this.client,
        this.model,
        messages,
        functions,
        eventHandler,
        { provider: this }
      );
    } catch (error) {
      if (this.#switchToResponsesAPI(error))
        return this.stream(messages, functions, eventHandler);
      console.error(error.message, error);
      throw this.#toAgentError(error);
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
      const result = this.#useResponsesAPI
        ? await responsesTooledComplete(
            this.client,
            this.model,
            messages,
            functions,
            { provider: this }
          )
        : await tooledComplete(
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
      if (this.#switchToResponsesAPI(error))
        return this.complete(messages, functions);
      throw this.#toAgentError(error);
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
