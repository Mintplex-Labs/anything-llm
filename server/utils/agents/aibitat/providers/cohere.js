const OpenAI = require("openai");
const Provider = require("./ai-provider.js");
const InheritMultiple = require("./helpers/classes.js");
const UnTooled = require("./helpers/untooled.js");
const { tooledStream, tooledComplete } = require("./helpers/tooled.js");
const { RetryError } = require("../error.js");
const { CohereLLM } = require("../../../AiProviders/cohere/index.js");

/**
 * The agent provider for the Cohere AI provider.
 * Uses Cohere's OpenAI-compatible API (https://docs.cohere.com/docs/compatibility-api)
 * which supports native tool calling and vision.
 */
class CohereProvider extends InheritMultiple([Provider, UnTooled]) {
  model;

  constructor(config = {}) {
    super();
    const { model = process.env.COHERE_MODEL_PREF || "command-r-08-2024" } =
      config;
    const client = new OpenAI({
      baseURL: "https://api.cohere.ai/compatibility/v1",
      apiKey: process.env.COHERE_API_KEY ?? null,
    });

    this.providerTag = "cohere";
    this._client = client;
    this.model = model;
    this.verbose = true;
    this._supportsToolCalling = null;
  }

  get client() {
    return this._client;
  }

  get supportsAgentStreaming() {
    return true;
  }

  /**
   * Whether the loaded model supports native OpenAI-compatible tool calling.
   * Not all Cohere models support tools (e.g. the c4ai-aya models), so we check
   * the model's capabilities up front instead of failing over on a 400 error.
   * @returns {Promise<boolean>}
   */
  async supportsNativeToolCalling() {
    if (this.optsOutOfNativeToolCallingViaEnv(this.providerTag)) return false;
    if (this._supportsToolCalling !== null) return this._supportsToolCalling;
    const cohere = new CohereLLM(null, this.model);
    const capabilities = await cohere.getModelCapabilities();
    this._supportsToolCalling = capabilities.tools === true;
    return this._supportsToolCalling;
  }

  async #handleFunctionCallChat({ messages = [] }) {
    return await this.client.chat.completions
      .create({
        model: this.model,
        temperature: 0,
        messages,
      })
      .then((result) => {
        if (!result.hasOwnProperty("choices"))
          throw new Error("Cohere chat: No results!");
        if (result.choices.length === 0)
          throw new Error("Cohere chat: No results length!");
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
    });
  }

  async stream(messages, functions = [], eventHandler = null) {
    const useNative =
      functions.length > 0 && (await this.supportsNativeToolCalling());

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
    const useNative =
      functions.length > 0 && (await this.supportsNativeToolCalling());

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

module.exports = CohereProvider;
