const OpenAI = require("openai");
const Provider = require("./ai-provider.js");
const InheritMultiple = require("./helpers/classes.js");
const UnTooled = require("./helpers/untooled.js");
const { tooledStream, tooledComplete } = require("./helpers/tooled.js");
const { RetryError } = require("../error.js");

/**
 * The agent provider for the KoboldCPP provider.
 */
class KoboldCPPProvider extends InheritMultiple([Provider, UnTooled]) {
  model;

  constructor(_config = {}) {
    super();
    this.providerTag = "koboldcpp";
    const model = process.env.KOBOLD_CPP_MODEL_PREF ?? null;
    const client = new OpenAI({
      baseURL: process.env.KOBOLD_CPP_BASE_PATH?.replace(/\/+$/, ""),
      apiKey: null,
    });

    this._client = client;
    this.model = model;
    this.maxTokens = Number(process.env.KOBOLD_CPP_MAX_TOKENS) || 2048;
    this.verbose = true;
  }

  get client() {
    return this._client;
  }

  get supportsAgentStreaming() {
    return true;
  }

  async #handleFunctionCallChat({ messages = [] }) {
    return await this.client.chat.completions
      .create({
        model: this.model,
        messages,
        max_tokens: this.maxTokens,
      })
      .then((result) => {
        if (!result.hasOwnProperty("choices"))
          throw new Error("KoboldCPP chat: No results!");
        if (result.choices.length === 0)
          throw new Error("KoboldCPP chat: No results length!");
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
      max_tokens: this.maxTokens,
    });
  }

  async stream(messages, functions = [], eventHandler = null) {
    const useNative = functions.length > 0 && this.supportsNativeToolCalling();

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
    const useNative = functions.length > 0 && this.supportsNativeToolCalling();

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

  /**
   * Get the cost of the completion.
   *
   * @param _usage The completion to get the cost for.
   * @returns The cost of the completion.
   * Stubbed since KoboldCPP has no cost basis.
   */
  getCost(_usage) {
    return 0;
  }
}

module.exports = KoboldCPPProvider;
