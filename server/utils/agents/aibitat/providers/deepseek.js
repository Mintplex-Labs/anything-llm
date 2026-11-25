const { reasoningParams } = require("../../../helpers/reasoningEffort");
const OpenAI = require("openai");
const Provider = require("./ai-provider.js");
const InheritMultiple = require("./helpers/classes.js");
const UnTooled = require("./helpers/untooled.js");
const {
  tooledStream,
  tooledComplete,
  temperatureParam,
} = require("./helpers/tooled.js");
const { RetryError } = require("../error.js");
const { toValidNumber } = require("../../../http/index.js");

class DeepSeekProvider extends InheritMultiple([Provider, UnTooled]) {
  model;

  constructor(config = {}) {
    super();
    const { model = "deepseek-flash", reasoningEffort = null } = config;
    const client = new OpenAI({
      baseURL: "https://api.deepseek.com/v1",
      apiKey: process.env.DEEPSEEK_API_KEY ?? null,
    });

    this.providerTag = "deepseek";
    this._client = client;
    this.model = model;
    this.reasoningEffort = reasoningEffort;
    this.verbose = true;
    this.maxTokens = process.env.DEEPSEEK_MAX_TOKENS
      ? toValidNumber(process.env.DEEPSEEK_MAX_TOKENS, 1024)
      : 1024;
  }

  get client() {
    return this._client;
  }

  /**
   * The reasoning portion of the request body. The effort is validated against
   * the model before the provider is built, so it only needs mapping here.
   * @returns {object}
   */
  get reasoningConfig() {
    return reasoningParams("deepseek", this.reasoningEffort, this.model);
  }

  get supportsAgentStreaming() {
    return true;
  }

  /**
   * Check if the model is a thinking model
   * because we need to inject reasoning content into the messages
   * or else the DeepSeek API will return an error for specific models.
   * There is no official way to predetect if a model will require this
   * so we have to hardcode the list of thinking models.
   * @returns {boolean}
   */
  get #isThinkingModel() {
    return [
      "deepseek-reasoner",
      "deepseek-v4-flash",
      "deepseek-v4-pro",
      "deepseek-flash",
    ].includes(this.model);
  }

  get #tooledOptions() {
    return {
      provider: this,
      ...(this.#isThinkingModel ? { injectReasoningContent: true } : {}),
    };
  }

  async #handleFunctionCallChat({ messages = [] }) {
    return await this.client.chat.completions
      .create({
        model: this.model,
        ...temperatureParam(this.temperature),
        messages,
        max_tokens: this.maxTokens,
      })
      .then((result) => {
        if (!result.hasOwnProperty("choices"))
          throw new Error("DeepSeek chat: No results!");
        if (result.choices.length === 0)
          throw new Error("DeepSeek chat: No results length!");
        return result.choices[0].message.content;
      })
      .catch((_) => {
        return null;
      });
  }

  async #handleFunctionCallStream({ messages = [] }) {
    return await this.client.chat.completions.create({
      model: this.model,
      ...temperatureParam(this.temperature),
      stream: true,
      messages,
    });
  }

  async stream(messages, functions = [], eventHandler = null) {
    const useNative = this.supportsNativeToolCalling();

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
        this.#tooledOptions
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
    const useNative = this.supportsNativeToolCalling();

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
        this.#tooledOptions
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
   *
   * @param _usage The completion to get the cost for.
   * @returns The cost of the completion.
   */
  getCost(_usage) {
    return 0;
  }
}

module.exports = DeepSeekProvider;
