const OpenAI = require("openai");
const Provider = require("../../agents/aibitat/providers/ai-provider.js");
const InheritMultiple = require("../../agents/aibitat/providers/helpers/classes.js");
const UnTooled = require("../../agents/aibitat/providers/helpers/untooled.js");
const {
  tooledStream,
  tooledComplete,
  temperatureParam,
} = require("../../agents/aibitat/providers/helpers/tooled.js");
const { reasoningParams } = require("../../helpers/reasoningEffort");
const { RetryError } = require("../../agents/aibitat/error.js");
const { EmbeddedLemonadeLLM } = require("./index.js");
const { EmbeddedLemonadeEngine } = require("./engine");
const { PROVIDER, isEnabled } = require("./config");

/**
 * The agent provider for the embedded Lemonade engine. Same as the Lemonade agent provider, but lemond is booted
 * on demand and the model is loaded with the chat context window. Uses native tool calling when the model
 * supports it, falling back to the UnTooled prompt-based approach otherwise.
 */
class EmbeddedLemonadeProvider extends InheritMultiple([Provider, UnTooled]) {
  model;
  /** The raw response behind the text #handleFunctionCallChat last returned, for watchTokenLimit. */
  #lastChatResponse = null;

  /**
   * @param {{model?: string, reasoningEffort?: string|null}} config
   */
  constructor(config = {}) {
    super();
    if (!isEnabled())
      throw new Error("The built-in LLM engine is not enabled.");
    this.providerTag = PROVIDER;
    this.model =
      config?.model || process.env.EMBEDDED_LEMONADE_MODEL_PREF || null;
    this._client = new OpenAI({
      baseURL: EmbeddedLemonadeLLM.openaiBasePath(),
      apiKey: "not-used",
      fetch: EmbeddedLemonadeLLM.bootingFetch(this.model),
    });
    this.reasoningEffort = config?.reasoningEffort ?? null;
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

  /**
   * The reasoning portion of the request body. The effort is validated against
   * the model before the provider is built, so it only needs mapping here.
   * @returns {object}
   */
  get reasoningConfig() {
    return reasoningParams("lemonade", this.reasoningEffort, this.model);
  }

  async supportsNativeToolCalling() {
    if (this.optsOutOfNativeToolCallingViaEnv(this.providerTag)) return false;
    if (this._supportsToolCalling !== null) return this._supportsToolCalling;
    const llm = new EmbeddedLemonadeLLM(null, this.model);
    const capabilities = await llm.getModelCapabilities();
    this._supportsToolCalling = capabilities.tools === true;
    return this._supportsToolCalling;
  }

  /**
   * If lemond is not running yet the model will certainly need to be loaded. Any other error resolves true so we
   * never show a spurious loading message.
   * @returns {Promise<boolean>}
   */
  async isModelLoaded() {
    return await EmbeddedLemonadeLLM.getCurrentlyLoadedModels()
      .then((models) => models.some((m) => m.model_name === this.model))
      .catch((e) => (e?.message?.includes("fetch failed") ? false : true));
  }

  async preloadModel() {
    if (this.preloaded) return;
    await EmbeddedLemonadeEngine.ensureRunning();
    await EmbeddedLemonadeLLM.loadModel(this.model);
    this.preloaded = true;
  }

  /**
   * #handleFunctionCallChat returns only the message text, since UnTooled.functionCall parses that callback's
   * result as JSON - so UnTooled.complete hands watchTokenLimit a string. Check the response the text came from.
   * @template T
   * @param {T} streamOrResponse
   * @returns {T}
   */
  watchTokenLimit(streamOrResponse) {
    if (typeof streamOrResponse !== "string" || !this.#lastChatResponse)
      return Provider.prototype.watchTokenLimit.call(this, streamOrResponse);
    Provider.prototype.watchTokenLimit.call(this, this.#lastChatResponse);
    this.#lastChatResponse = null;
    return streamOrResponse;
  }

  async #handleFunctionCallChat({ messages = [] }) {
    this.#lastChatResponse = null;
    return await this.client.chat.completions
      .create({
        model: this.model,
        ...temperatureParam(this.temperature),
        messages,
        ...this.reasoningConfig,
      })
      .then((result) => {
        if (!result.hasOwnProperty("choices"))
          throw new Error("Embedded Lemonade chat: No results!");
        if (result.choices.length === 0)
          throw new Error("Embedded Lemonade chat: No results length!");
        this.#lastChatResponse = result;
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
      ...this.reasoningConfig,
    });
  }

  #rethrow(error) {
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

  async stream(messages, functions = [], eventHandler = null) {
    await this.preloadModel();
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
      "EmbeddedLemonadeProvider.stream (tooled) - will process this chat completion."
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
      this.#rethrow(error);
    }
  }

  async complete(messages, functions = []) {
    await this.preloadModel();
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
      this.#rethrow(error);
    }
  }

  /**
   * Stubbed since a local engine has no cost basis.
   * @returns {number}
   */
  getCost(_usage) {
    return 0;
  }
}

module.exports = EmbeddedLemonadeProvider;
