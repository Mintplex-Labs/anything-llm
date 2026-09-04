const {
  writeResponseChunk,
  clientAbortedHandler,
  formatChatHistory,
} = require("../../helpers/chat/responses");
const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
  LLMPerformanceMonitor,
} = require("../../helpers/chat/LLMPerformanceMonitor");
const { Ollama } = require("ollama");
const { v4: uuidv4 } = require("uuid");

// Talks the Ollama API, which llmman serves alongside OpenAI- and
// Anthropic-compatible ones, so the same client library is reused.
// llmman: https://github.com/llmmanorg/llmman
class LlmmanLLM {
  /** @see LlmmanLLM.cacheContextWindows */
  static modelContextWindows = {};

  constructor(embedder = null, modelPreference = null) {
    if (!process.env.LLMMAN_BASE_PATH)
      throw new Error("No llmman Base Path was set.");

    this.className = "LlmmanLLM";
    this.authToken = process.env.LLMMAN_AUTH_TOKEN;
    this.basePath = process.env.LLMMAN_BASE_PATH;
    this.model = modelPreference || process.env.LLMMAN_MODEL_PREF;
    this.keepAlive = process.env.LLMMAN_KEEP_ALIVE_TIMEOUT
      ? Number(process.env.LLMMAN_KEEP_ALIVE_TIMEOUT)
      : 300; // Default 5-minute timeout for model loading.

    const headers = this.authToken
      ? { Authorization: `Bearer ${this.authToken}` }
      : {};
    this.client = new Ollama({
      host: this.basePath,
      headers: headers,
      fetch: LlmmanLLM.applyLlmmanFetch(),
    });
    this.embedder = embedder ?? new NativeEmbedder();

    // Lazy load the limits to avoid blocking the main thread on cacheContextWindows
    this.limits = null;

    LlmmanLLM.cacheContextWindows(true);
    this.#log(`initialized with model: ${this.model}`);
  }

  #log(text, ...args) {
    console.log(`\x1b[32m[llmman]\x1b[0m ${text}`, ...args);
  }

  static #slog(text, ...args) {
    console.log(`\x1b[32m[llmman]\x1b[0m ${text}`, ...args);
  }

  async assertModelContextLimits() {
    if (this.limits !== null) return;
    await LlmmanLLM.cacheContextWindows();
    await this.#syncLoadedContextWindow();
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };
    this.#log(
      `model ${this.model} is using a max context window of ${this.promptWindowLimit()}/${LlmmanLLM.maxContextWindow(this.model)} tokens.`
    );
  }

  /**
   * Cache the context windows for the models llmman serves.
   * This is done once and then cached for the lifetime of the server. This is absolutely necessary to ensure that the context windows are correct.
   *
   * This is a convenience to ensure that the context windows are correct and that the user
   * does not have to manually set the context window for each model.
   * @param {boolean} force - Force the cache to be refreshed.
   * @returns {Promise<void>} - A promise that resolves when the cache is refreshed.
   */
  static async cacheContextWindows(force = false) {
    try {
      // Skip if we already have cached context windows and we're not forcing a refresh
      if (Object.keys(LlmmanLLM.modelContextWindows).length > 0 && !force)
        return;

      const authToken = process.env.LLMMAN_AUTH_TOKEN;
      const basePath = process.env.LLMMAN_BASE_PATH;
      const client = new Ollama({
        host: basePath,
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      });

      const { models } = await client.list().catch(() => ({ models: [] }));
      if (!models.length) return;

      // llmman serves the Ollama API surface but /api/show does not always
      // include the `capabilities` array or `model_info` block Ollama returns,
      // so both are treated as optional here. The loaded-model report from
      // /api/ps carries the accurate runtime `context_length`, so it takes
      // priority over whatever /api/show advertises.
      const loadedModels = await client
        .ps()
        .then((res) => res?.models || [])
        .catch(() => []);
      const loadedContextWindows = {};
      loadedModels.forEach((model) => {
        if (!model?.context_length) return;
        loadedContextWindows[model.name] = Number(model.context_length);
      });

      const infoPromises = models.map((model) =>
        client
          .show({ model: model.name })
          .then((info) => ({ name: model.name, ...info }))
          .catch(() => ({ name: model.name }))
      );
      const infos = await Promise.all(infoPromises);
      infos.forEach((showInfo) => {
        if ((showInfo.capabilities || []).includes("embedding")) return;
        if (loadedContextWindows[showInfo.name])
          return (LlmmanLLM.modelContextWindows[showInfo.name] =
            loadedContextWindows[showInfo.name]);
        const contextWindowKey = Object.keys(showInfo.model_info || {}).find(
          (key) => key.endsWith(".context_length")
        );
        if (!contextWindowKey)
          return (LlmmanLLM.modelContextWindows[showInfo.name] = 4096);
        LlmmanLLM.modelContextWindows[showInfo.name] =
          showInfo.model_info[contextWindowKey];
      });
      LlmmanLLM.#slog(`Context windows cached for all models!`);
    } catch (e) {
      LlmmanLLM.#slog(`Error caching context windows`, e);
      return;
    }
  }

  /**
   * llmman's /api/show does not report a model's context length, so the only
   * accurate source is the runtime `context_length` from /api/ps - which only
   * lists loaded models. Since this runs right before a completion, load the
   * model now (empty prompt = load-only, Ollama semantics - returns instantly
   * with done_reason "load") and record its true context window in the cache.
   * Best-effort: any failure leaves the /api/show-derived value in place.
   * @returns {Promise<void>}
   */
  async #syncLoadedContextWindow() {
    try {
      const findLoaded = async () => {
        const { models = [] } = await this.client.ps();
        return models.find(
          (m) => m.name === this.model || m.model === this.model
        );
      };

      let loaded = await findLoaded();
      if (!loaded) {
        await this.client.generate({
          model: this.model,
          prompt: "",
          keep_alive: this.keepAlive,
        });
        loaded = await findLoaded();
      }

      if (!loaded?.context_length) return;
      LlmmanLLM.modelContextWindows[this.model] = Number(loaded.context_length);
    } catch {
      // Model may not be pullable/loadable right now - the cached or default
      // context window will be used instead.
    }
  }

  #appendContext(contextTexts = []) {
    if (!contextTexts || !contextTexts.length) return "";
    return (
      "\nContext:\n" +
      contextTexts
        .map((text, i) => {
          return `[CONTEXT ${i}]:\n${text}\n[END CONTEXT ${i}]\n\n`;
        })
        .join("")
    );
  }

  /**
   * Apply a custom fetch function to the API client.
   * This is useful when we want to bypass the default 5m timeout for global fetch
   * for machines which run responses very slowly.
   * @returns {Function} The custom fetch function.
   */
  static applyLlmmanFetch() {
    try {
      if (!("LLMMAN_RESPONSE_TIMEOUT" in process.env)) return fetch;
      const { Agent } = require("undici");
      const moment = require("moment");
      let timeout = process.env.LLMMAN_RESPONSE_TIMEOUT;

      if (!timeout || isNaN(Number(timeout)) || Number(timeout) <= 5 * 60_000) {
        LlmmanLLM.#slog(
          "Timeout option was not set, is not a number, or is less than 5 minutes in ms - falling back to default",
          { timeout }
        );
        return fetch;
      } else timeout = Number(timeout);

      const noTimeoutFetch = (input, init = {}) => {
        return fetch(input, {
          ...init,
          dispatcher: new Agent({ headersTimeout: timeout }),
        });
      };

      const humanDiff = moment.duration(timeout).humanize();
      LlmmanLLM.#slog(`Applying custom fetch w/timeout of ${humanDiff}.`);
      return noTimeoutFetch;
    } catch (error) {
      LlmmanLLM.#slog(
        "Error applying custom fetch - using default fetch",
        error
      );
      return fetch;
    }
  }

  streamingEnabled() {
    return "streamGetChatCompletion" in this;
  }

  static promptWindowLimit(modelName) {
    if (Object.keys(LlmmanLLM.modelContextWindows).length === 0) {
      this.#slog(
        "No context windows cached - Context window may be inaccurately reported."
      );
      return Number(process.env.LLMMAN_MODEL_TOKEN_LIMIT) || 4096;
    }

    let userDefinedLimit = null;
    const systemDefinedLimit = LlmmanLLM.maxContextWindow(modelName);

    if (
      process.env.LLMMAN_MODEL_TOKEN_LIMIT &&
      !isNaN(Number(process.env.LLMMAN_MODEL_TOKEN_LIMIT)) &&
      Number(process.env.LLMMAN_MODEL_TOKEN_LIMIT) > 0
    )
      userDefinedLimit = Number(process.env.LLMMAN_MODEL_TOKEN_LIMIT);

    // The user defined limit is always higher priority than the context window limit, but it cannot be higher than the context window limit
    // so we return the minimum of the two, if there is no user defined limit, we return the system defined limit as-is.
    if (userDefinedLimit !== null)
      return Math.min(userDefinedLimit, systemDefinedLimit);

    // Cap the context window limit to 16,384 tokens if the model supports more than that and no value is specified by the user.
    // This prevents super-large context windows from being used if the user does not specify a value
    // as well as also having smaller context windows use the full context window limit.
    return Math.min(systemDefinedLimit, 16384);
  }

  promptWindowLimit() {
    return this.constructor.promptWindowLimit(this.model);
  }

  static maxContextWindow(modelName = null) {
    if (Object.keys(LlmmanLLM.modelContextWindows).length === 0 || !modelName)
      return 4096;
    return Number(LlmmanLLM.modelContextWindows[modelName]) || 16384;
  }

  async isValidChatCompletionModel(_ = "") {
    return true;
  }

  /**
   * Generates appropriate content array for a message + attachments.
   * @param {{userPrompt:string, attachments: import("../../helpers").Attachment[]}}
   * @returns {{content: string, images: string[]}}
   */
  #generateContent({ userPrompt, attachments = [] }) {
    if (!attachments.length) return { content: userPrompt };
    const images = attachments.map(
      (attachment) => attachment.contentString.split("base64,").slice(-1)[0]
    );
    return { content: userPrompt, images };
  }

  /**
   * Handles API errors to make them more user friendly.
   * @param {Error} e
   */
  #errorHandler(e) {
    switch (e.message) {
      case "fetch failed":
        throw new Error(
          "Your llmman instance could not be reached or is not responding. Please make sure `llmman serve` is running and your connection information is correct in AnythingLLM."
        );
      default:
        return e;
    }
  }

  /**
   * Construct the user prompt for this model.
   * @param {{attachments: import("../../helpers").Attachment[]}} param0
   * @returns
   */
  constructPrompt({
    systemPrompt = "",
    contextTexts = [],
    chatHistory = [],
    userPrompt = "",
    attachments = [],
  }) {
    const prompt = {
      role: "system",
      content: `${systemPrompt}${this.#appendContext(contextTexts)}`,
    };
    return [
      prompt,
      ...formatChatHistory(chatHistory, this.#generateContent, "spread"),
      {
        role: "user",
        ...this.#generateContent({ userPrompt, attachments }),
      },
    ];
  }

  async getChatCompletion(
    messages = null,
    { temperature = this.temperature } = {}
  ) {
    const result = await LLMPerformanceMonitor.measureAsyncFunction(
      this.client
        .chat({
          model: this.model,
          stream: false,
          messages,
          keep_alive: this.keepAlive,
          options: {
            temperature,
            num_ctx: this.promptWindowLimit(),
          },
        })
        .then((res) => {
          let content = res.message.content;
          if (res.message.thinking)
            content = `<think>${res.message.thinking}</think>${content}`;
          return {
            content,
            usage: {
              prompt_tokens: res.prompt_eval_count,
              completion_tokens: res.eval_count,
              total_tokens: res.prompt_eval_count + res.eval_count,
              duration: res.eval_duration / 1e9,
            },
          };
        })
        .catch((e) => {
          throw new Error(
            `llmman::getChatCompletion failed to communicate with llmman. ${this.#errorHandler(e).message}`
          );
        })
    );

    if (!result.output.content || !result.output.content.length)
      throw new Error(`llmman::getChatCompletion text response was empty.`);

    return {
      textResponse: result.output.content,
      metrics: {
        prompt_tokens: result.output.usage.prompt_tokens,
        completion_tokens: result.output.usage.completion_tokens,
        total_tokens: result.output.usage.total_tokens,
        outputTps:
          result.output.usage.completion_tokens / result.output.usage.duration,
        duration: result.output.usage.duration,
        model: this.model,
        provider: this.className,
        timestamp: new Date(),
      },
    };
  }

  async streamGetChatCompletion(
    messages = null,
    { temperature = this.temperature } = {}
  ) {
    const measuredStreamRequest = await LLMPerformanceMonitor.measureStream({
      func: this.client.chat({
        model: this.model,
        stream: true,
        messages,
        keep_alive: this.keepAlive,
        options: {
          temperature,
          num_ctx: this.promptWindowLimit(),
        },
      }),
      messages,
      runPromptTokenCalculation: false,
      modelTag: this.model,
      provider: this.className,
    }).catch((e) => {
      throw this.#errorHandler(e);
    });
    return measuredStreamRequest;
  }

  /**
   * Handles streaming responses from the API.
   * @param {import("express").Response} response
   * @param {import("../../helpers/chat/LLMPerformanceMonitor").MonitoredStream} stream
   * @param {import("express").Request} request
   * @returns {Promise<string>}
   */
  handleStream(response, stream, responseProps) {
    const { uuid = uuidv4(), sources = [] } = responseProps;

    return new Promise(async (resolve) => {
      let fullText = "";
      let reasoningText = "";
      let usage = {
        prompt_tokens: 0,
        completion_tokens: 0,
      };

      // Establish listener to early-abort a streaming response
      // in case things go sideways or the user does not like the response.
      // We preserve the generated text but continue as if chat was completed
      // to preserve previously generated content.
      const handleAbort = () => {
        stream?.endMeasurement(usage);
        clientAbortedHandler(resolve, fullText);
      };
      response.on("close", handleAbort);

      try {
        for await (const chunk of stream) {
          if (chunk === undefined)
            throw new Error(
              "Stream returned undefined chunk. Aborting reply - check model provider logs."
            );

          if (chunk.done) {
            usage.prompt_tokens = chunk.prompt_eval_count;
            usage.completion_tokens = chunk.eval_count;
            usage.duration = chunk.eval_duration / 1e9;
            writeResponseChunk(response, {
              uuid,
              sources,
              type: "textResponseChunk",
              textResponse: "",
              close: true,
              error: false,
            });
            response.removeListener("close", handleAbort);
            stream?.endMeasurement(usage);
            resolve(fullText);
            break;
          }

          if (chunk.hasOwnProperty("message")) {
            // Thinking content arrives in a separate property on the message.
            // in the response object. If it exists, we need to handle it separately by wrapping it in <think> tags.
            const content = chunk.message.content;
            const reasoningToken = chunk.message.thinking;

            if (reasoningToken) {
              if (reasoningText.length === 0) {
                const startTag = "<think>";
                writeResponseChunk(response, {
                  uuid,
                  sources,
                  type: "textResponseChunk",
                  textResponse: startTag + reasoningToken,
                  close: false,
                  error: false,
                });
                reasoningText += startTag + reasoningToken;
              } else {
                writeResponseChunk(response, {
                  uuid,
                  sources,
                  type: "textResponseChunk",
                  textResponse: reasoningToken,
                  close: false,
                  error: false,
                });
                reasoningText += reasoningToken;
              }
            } else if (content.length > 0) {
              // If we have reasoning text, we need to close the reasoning tag and then append the content.
              if (reasoningText.length > 0) {
                const endTag = "</think>";
                writeResponseChunk(response, {
                  uuid,
                  sources,
                  type: "textResponseChunk",
                  textResponse: endTag,
                  close: false,
                  error: false,
                });
                fullText += reasoningText + endTag;
                reasoningText = ""; // Reset reasoning buffer
              }
              fullText += content; // Append regular text
              writeResponseChunk(response, {
                uuid,
                sources,
                type: "textResponseChunk",
                textResponse: content,
                close: false,
                error: false,
              });
            }
          }
        }
      } catch (error) {
        writeResponseChunk(response, {
          uuid,
          sources: [],
          type: "textResponseChunk",
          textResponse: "",
          close: true,
          error: `llmman:streaming - could not stream chat. ${
            error?.cause ?? error.message
          }`,
        });
        response.removeListener("close", handleAbort);
        stream?.endMeasurement(usage);
        resolve(fullText);
      }
    });
  }

  /**
   * Returns the capabilities of the model.
   * @returns {Promise<{tools: 'unknown' | boolean, reasoning: 'unknown' | boolean, imageGeneration: 'unknown' | boolean, vision: 'unknown' | boolean}>}
   */
  async getModelCapabilities() {
    try {
      const { capabilities = [] } = await this.client.show({
        model: this.model,
      });
      return {
        tools: capabilities.includes("tools") ? true : false,
        reasoning: capabilities.includes("thinking") ? true : false,
        imageGeneration: false, // no image generation capabilities via this provider.
        vision: capabilities.includes("vision") ? true : false,
      };
    } catch (error) {
      console.error("Error getting model capabilities:", error);
      return {
        tools: "unknown",
        reasoning: "unknown",
        imageGeneration: "unknown",
        vision: "unknown",
      };
    }
  }

  // Simple wrapper for dynamic embedder & normalize interface for all LLM implementations
  async embedTextInput(textInput) {
    return await this.embedder.embedTextInput(textInput);
  }
  async embedChunks(textChunks = []) {
    return await this.embedder.embedChunks(textChunks);
  }

  async compressMessages(promptArgs = {}, rawHistory = []) {
    await this.assertModelContextLimits();
    const { messageArrayCompressor } = require("../../helpers/chat");
    const messageArray = this.constructPrompt(promptArgs);
    return await messageArrayCompressor(this, messageArray, rawHistory);
  }
}

module.exports = {
  LlmmanLLM,
};
