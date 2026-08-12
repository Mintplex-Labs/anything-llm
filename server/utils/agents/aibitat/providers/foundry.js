const OpenAI = require("openai");
const Provider = require("./ai-provider.js");
const InheritMultiple = require("./helpers/classes.js");
const UnTooled = require("./helpers/untooled.js");
const { tooledStream, tooledComplete } = require("./helpers/tooled.js");
const { RetryError } = require("../error.js");
const {
  parseFoundryBasePath,
  FoundryLLM,
} = require("../../../AiProviders/foundry/index.js");
const ToolCallTextFilter = require("../../../AiProviders/foundry/toolCallFilter.js");

/**
 * The agent provider for Microsoft Foundry Local.
 * Uses native OpenAI-compatible tool calling when the selected model advertises
 * support for it, falling back to the UnTooled prompt-based approach otherwise.
 */
class FoundryProvider extends InheritMultiple([Provider, UnTooled]) {
  model;

  constructor(config = {}) {
    const { model = process.env.FOUNDRY_MODEL_PREF } = config;
    super();
    this.providerTag = "foundry";
    const client = new OpenAI({
      baseURL: parseFoundryBasePath(process.env.FOUNDRY_BASE_PATH),
      apiKey: null,
    });

    this._client = client;
    this.model = model;
    this.verbose = true;
    this._supportsToolCalling = null;
    this._llm = null;
  }

  /**
   * Get the client.
   * @returns {OpenAI.OpenAI}
   */
  get client() {
    return this._client;
  }

  get supportsAgentStreaming() {
    return true;
  }

  /**
   * The provider instance backing capability and context-window lookups.
   * Built once and reused — constructing it spins up an embedder, which is
   * wasted work on every completion.
   * @returns {FoundryLLM}
   */
  #llm() {
    if (!this._llm) this._llm = new FoundryLLM(null, this.model);
    return this._llm;
  }

  /**
   * Resolve the model's context window before a request is built. Foundry caps
   * output at 1024 tokens when max_completion_tokens is unset, so every path
   * that sends a completion has to know the window first.
   * @returns {Promise<void>}
   */
  async #assertContextLimits() {
    await this.#llm().assertModelContextLimits();
    await this.#llm().assertModelLoaded();
  }

  /**
   * Whether the selected model supports native OpenAI-compatible tool calling.
   * Foundry reports this per-model in its catalog; a service that exposes no
   * catalog reports "unknown", in which case we fall back to UnTooled.
   * @returns {Promise<boolean>}
   */
  async supportsNativeToolCalling() {
    if (this.optsOutOfNativeToolCallingViaEnv(this.providerTag)) return false;
    if (this._supportsToolCalling !== null) return this._supportsToolCalling;
    const capabilities = await this.#llm().getModelCapabilities();
    this._supportsToolCalling = capabilities.tools === true;
    return this._supportsToolCalling;
  }

  /**
   * Foundry echoes every tool call into `delta.content` as raw
   * `<tool_call>…</tool_call>` markup on top of emitting it natively, so the
   * markup would otherwise be printed into the chat. Wrap the event handler to
   * strip it from text chunks while leaving every other event untouched.
   * @param {function|null} eventHandler
   * @returns {function|null}
   */
  #filterToolCallMarkup(eventHandler) {
    if (!eventHandler) return eventHandler;
    const filter = new ToolCallTextFilter();

    return (event, payload) => {
      if (
        event !== "reportStreamEvent" ||
        payload?.type !== "textResponseChunk"
      )
        return eventHandler(event, payload);

      const content = filter.push(payload.content ?? "");
      if (!content) return;
      return eventHandler(event, { ...payload, content });
    };
  }

  // ---- UnTooled callbacks (used when native tool calling is not supported) ----

  async #handleFunctionCallChat({ messages = [] }) {
    await this.#assertContextLimits();
    return await this.client.chat.completions
      .create({
        model: this.model,
        messages,
        max_completion_tokens: FoundryLLM.promptWindowLimit(this.model),
      })
      .then((result) => {
        if (!result.hasOwnProperty("choices"))
          throw new Error("Microsoft Foundry Local chat: No results!");
        if (result.choices.length === 0)
          throw new Error("Microsoft Foundry Local chat: No results length!");
        return result.choices[0].message.content;
      })
      .catch((_) => {
        return null;
      });
  }

  async #handleFunctionCallStream({ messages = [] }) {
    await this.#assertContextLimits();
    return await this.client.chat.completions.create({
      model: this.model,
      stream: true,
      messages,
      max_completion_tokens: FoundryLLM.promptWindowLimit(this.model),
    });
  }

  /**
   * Stream a chat completion with tool calling support.
   * Uses native tool calling when supported, otherwise falls back to UnTooled.
   */
  async stream(messages, functions = [], eventHandler = null) {
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
      await this.#assertContextLimits();
      return await tooledStream(
        this.client,
        this.model,
        messages,
        functions,
        this.#filterToolCallMarkup(eventHandler),
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
   * Create a non-streaming completion with tool calling support.
   * Uses native tool calling when supported, otherwise falls back to UnTooled.
   */
  async complete(messages, functions = []) {
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
      await this.#assertContextLimits();
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

      // Same markup echo as the streaming path, minus the chunk boundaries.
      if (typeof result?.result === "string")
        result.result = ToolCallTextFilter.clean(result.result);
      return result;
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
   * Get the cost of the completion.
   *
   * @param _usage The completion to get the cost for.
   * @returns The cost of the completion.
   */
  getCost(_usage) {
    return 0;
  }
}

module.exports = FoundryProvider;
