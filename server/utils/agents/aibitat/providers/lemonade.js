const OpenAI = require("openai");
const Provider = require("./ai-provider.js");
const InheritMultiple = require("./helpers/classes.js");
const UnTooled = require("./helpers/untooled.js");
const { tooledStream, tooledComplete } = require("./helpers/tooled.js");
const { RetryError } = require("../error.js");
const {
  LemonadeLLM,
  parseLemonadeServerEndpoint,
} = require("../../../AiProviders/lemonade/index.js");

/**
 * The agent provider for the Lemonade.
 */
class LemonadeProvider extends InheritMultiple([Provider, UnTooled]) {
  model;

  /**
   *
   * @param {{model?: string}} config
   */
  constructor(config = {}) {
    super();
    const model = config?.model || process.env.LEMONADE_LLM_MODEL_PREF || null;
    const client = new OpenAI({
      baseURL: parseLemonadeServerEndpoint(
        process.env.LEMONADE_LLM_BASE_PATH,
        "openai"
      ),
      apiKey: null,
      maxRetries: 3,
    });

    this._client = client;
    this.model = model;
    this.verbose = true;
    this.preloaded = false;
    this._supportsToolCalling = null;
  }

  get client() {
    return this._client;
  }

  get supportsAgentStreaming() {
    return true;
  }

  async preloadModel() {
    if (this.preloaded) return;
    await LemonadeLLM.loadModel(this.model);
    this.preloaded = true;
  }

  /**
   * Whether this provider supports native OpenAI-compatible tool calling.
   * - Since Lemonade models vary in tool calling support, we check the ENV.
   * - If the ENV is not set and the capabilities are not set, we default to false.
   * - To enable tool calling for a model, set the ENV flag for `PROVIDER_SUPPORTS_NATIVE_TOOL_CALLING` to include `lemonade`.
   * - or update the label in the Lemonade server to include `tool-calling`.
   * @returns {boolean|Promise<boolean>}
   */
  async supportsNativeToolCalling() {
    if (this._supportsToolCalling !== null) return this._supportsToolCalling;
    const lemonade = new LemonadeLLM(null, this.model);

    // Labels can be missing for tool calling models, so we also check if ENV flag is set
    const supportsToolCallingFlag =
      process.env.PROVIDER_SUPPORTS_NATIVE_TOOL_CALLING?.includes("lemonade");
    if (supportsToolCallingFlag) {
      this.providerLog(
        "Lemonade supports native tool calling is ENABLED via ENV."
      );
      this._supportsToolCalling = true;
      return this._supportsToolCalling;
    }

    const capabilities = await lemonade.getModelCapabilities();
    this._supportsToolCalling = capabilities.tools === true;
    return this._supportsToolCalling;
  }

  async #handleFunctionCallChat({ messages = [] }) {
    return await this.client.chat.completions
      .create({
        model: this.model,
        messages,
      })
      .then((result) => {
        if (!result.hasOwnProperty("choices"))
          throw new Error("Lemonade chat: No results!");
        if (result.choices.length === 0)
          throw new Error("Lemonade chat: No results length!");
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

  /**
   * Stream a chat completion with tool calling support.
   * Uses native tool calling when supported, otherwise falls back to UnTooled.
   */
  async stream(messages, functions = [], eventHandler = null) {
    await this.preloadModel();
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
      "LemonadeProvider.stream (tooled) - will process this chat completion."
    );

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
   * Create a non-streaming completion with tool calling support.
   * Uses native tool calling when supported, otherwise falls back to UnTooled.
   */
  async complete(messages, functions = []) {
    await this.preloadModel();
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
   *
   * @param _usage The completion to get the cost for.
   * @returns The cost of the completion.
   * Stubbed since Lemonade has no cost basis.
   */
  getCost(_usage) {
    return 0;
  }
}

module.exports = LemonadeProvider;
