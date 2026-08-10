const OpenAI = require("openai");
const Anthropic = require("@anthropic-ai/sdk");
const Provider = require("./ai-provider.js");
const InheritMultiple = require("./helpers/classes.js");
const UnTooled = require("./helpers/untooled.js");
const { tooledStream, tooledComplete } = require("./helpers/tooled.js");
const {
  anthropicTooledStream,
  anthropicTooledComplete,
} = require("./helpers/anthropicTooled.js");
const { RetryError } = require("../error.js");

/**
 * The agent provider for the AWS Bedrock provider.
 * Uses the OpenAI-compatible Mantle API endpoint for non-Anthropic models,
 * and the Anthropic Messages API with native tool calling for Anthropic models.
 */
class AWSBedrockProvider extends InheritMultiple([Provider, UnTooled]) {
  model;

  constructor(config = {}) {
    super();
    const model =
      config.model || process.env.AWS_BEDROCK_LLM_MODEL_PREFERENCE || null;
    const region = process.env.AWS_BEDROCK_LLM_REGION;
    const client = new OpenAI({
      baseURL: `https://bedrock-mantle.${region}.api.aws/v1`,
      apiKey: process.env.AWS_BEDROCK_LLM_API_KEY,
    });

    this.providerTag = "bedrock";
    this._client = client;
    this.model = model;
    this.verbose = true;
    this._supportsToolCalling = null;

    if (this.model?.includes("anthropic")) {
      this._anthropic = new Anthropic({
        apiKey: process.env.AWS_BEDROCK_LLM_API_KEY,
        baseURL: `https://bedrock-mantle.${region}.api.aws/anthropic`,
        defaultHeaders: { "anthropic-version": "2023-06-01" },
      });
    }
  }

  get client() {
    return this._client;
  }

  /**
   * Anthropic models on Bedrock go through a second client, which must honor the
   * session abort signal too.
   * @returns {Array<object>}
   */
  abortableClients() {
    return [this._client, this._anthropic].filter(Boolean);
  }

  get supportsAgentStreaming() {
    if (!!process.env.AWS_BEDROCK_STREAMING_DISABLED) return false;
    return true;
  }

  get #maxTokens() {
    return Number(process.env.AWS_BEDROCK_LLM_MAX_TOKENS) || 4096;
  }

  // --- OpenAI (non-Anthropic) handlers ---

  async #handleFunctionCallChat({ messages = [] }) {
    return await this.client.chat.completions
      .create({
        model: this.model,
        messages,
        user: this.executingUserId,
      })
      .then((result) => {
        if (!result.hasOwnProperty("choices"))
          throw new Error("AWSBedrock chat: No results!");
        if (result.choices.length === 0)
          throw new Error("AWSBedrock chat: No results length!");
        return result.choices[0].message.content;
      })
      .catch((_) => {
        return null;
      });
  }

  async #handleFunctionCallStream({ messages = [] }) {
    return await this.client.chat.completions.create({
      model: this.model,
      stream: true,
      messages,
      user: this.executingUserId,
    });
  }

  // --- Main stream/complete entry points ---

  async stream(messages, functions = [], eventHandler = null) {
    if (this._anthropic) {
      return anthropicTooledStream(
        this._anthropic,
        this.model,
        this.#maxTokens,
        messages,
        functions,
        eventHandler,
        { provider: this }
      );
    }

    const useNative = await this.supportsNativeToolCalling();

    if (!useNative) {
      return await UnTooled.prototype.stream.call(
        this,
        messages,
        functions,
        this.#handleFunctionCallStream.bind(this),
        eventHandler
      );
    }

    this.providerLog(
      "Provider.stream (tooled) - will process this chat completion."
    );

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

  async complete(messages, functions = []) {
    if (this._anthropic) {
      return anthropicTooledComplete(
        this._anthropic,
        this.model,
        this.#maxTokens,
        messages,
        functions,
        { provider: this }
      );
    }

    const useNative = await this.supportsNativeToolCalling();

    if (!useNative) {
      return await UnTooled.prototype.complete.call(
        this,
        messages,
        functions,
        this.#handleFunctionCallChat.bind(this)
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

  getCost(_usage) {
    return 0;
  }
}

module.exports = AWSBedrockProvider;
