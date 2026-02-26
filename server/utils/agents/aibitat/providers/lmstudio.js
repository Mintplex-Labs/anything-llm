const OpenAI = require("openai");
const Provider = require("./ai-provider.js");
const InheritMultiple = require("./helpers/classes.js");
const UnTooled = require("./helpers/untooled.js");
const { tooledStream, tooledComplete } = require("./helpers/tooled.js");
const { RetryError } = require("../error.js");
const {
  LMStudioLLM,
  parseLMStudioBasePath,
} = require("../../../AiProviders/lmStudio/index.js");

/**
 * The agent provider for the LMStudio.
 * Supports true OpenAI-compatible tool calling when the model supports it,
 * falling back to the UnTooled prompt-based approach otherwise.
 */
class LMStudioProvider extends InheritMultiple([Provider, UnTooled]) {
  model;

  /**
   * @param {{model?: string}} config
   */
  constructor(config = {}) {
    super();
    const model = config?.model || process.env.LMSTUDIO_MODEL_PREF;
    if (!model) throw new Error("LMStudio must have a valid model set.");

    const apiKey = process.env.LMSTUDIO_AUTH_TOKEN ?? null;
    const client = new OpenAI({
      baseURL: parseLMStudioBasePath(process.env.LMSTUDIO_BASE_PATH),
      apiKey,
      maxRetries: 3,
    });

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
   * Checks the LMStudio /api/v1/models endpoint for the model's capabilities.
   * @returns {Promise<boolean>}
   */
  async supportsNativeToolCalling() {
    if (this._supportsToolCalling !== null) return this._supportsToolCalling;
    const lmstudio = new LMStudioLLM(null, this.model);
    const capabilities = await lmstudio.getModelCapabilities();
    this._supportsToolCalling = capabilities.tools === true;
    return this._supportsToolCalling;
  }

  // ---- UnTooled callbacks (used when native tool calling is not supported) ----

  async #handleFunctionCallChat({ messages = [] }) {
    await LMStudioLLM.cacheContextWindows();
    return await this.client.chat.completions
      .create({
        model: this.model,
        messages,
      })
      .then((result) => {
        if (!result.hasOwnProperty("choices"))
          throw new Error("LMStudio chat: No results!");
        if (result.choices.length === 0)
          throw new Error("LMStudio chat: No results length!");
        return result.choices[0].message.content;
      })
      .catch((_) => {
        return null;
      });
  }

  async #handleFunctionCallStream({ messages = [] }) {
    await LMStudioLLM.cacheContextWindows();
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
      await LMStudioLLM.cacheContextWindows();
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
      await LMStudioLLM.cacheContextWindows();
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
   * Stubbed since LMStudio has no cost basis.
   * @param _usage The completion to get the cost for.
   * @returns The cost of the completion.
   */
  getCost(_usage) {
    return 0;
  }
}

module.exports = LMStudioProvider;
