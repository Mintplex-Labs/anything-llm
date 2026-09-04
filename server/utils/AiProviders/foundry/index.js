const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const { v4: uuidv4 } = require("uuid");
const {
  formatChatHistory,
  writeResponseChunk,
  clientAbortedHandler,
} = require("../../helpers/chat/responses");
const {
  LLMPerformanceMonitor,
} = require("../../helpers/chat/LLMPerformanceMonitor");

const { OpenAI: OpenAIApi } = require("openai");
const ToolCallTextFilter = require("./toolCallFilter.js");

class FoundryLLM {
  /**
   * The largest context window we will select on the user's behalf.
   * Foundry runs on the user's own machine with no performance setting, so a
   * model advertising 128K would make an average laptop crawl. A user who
   * explicitly sets a larger limit still gets it, up to the model's real window.
   * @type {number}
   */
  static MAX_DEFAULT_CONTEXT_WINDOW = 16_000;

  /** @see FoundryLLM.cacheContextWindows */
  static modelContextWindows = {};

  constructor(embedder = null, modelPreference = null) {
    if (!process.env.FOUNDRY_BASE_PATH)
      throw new Error("No Foundry Base Path was set.");

    this.className = "FoundryLLM";
    this.model = modelPreference || process.env.FOUNDRY_MODEL_PREF;
    this.openai = new OpenAIApi({
      baseURL: parseFoundryBasePath(process.env.FOUNDRY_BASE_PATH),
      apiKey: null,
    });

    this.embedder = embedder ?? new NativeEmbedder();
    this.limits = null;
    FoundryLLM.cacheContextWindows(true);
    this.#log(`Loaded with model: ${this.model}`);
  }

  static #slog(text, ...args) {
    console.log(`\x1b[36m[FoundryLLM]\x1b[0m ${text}`, ...args);
  }

  #log(text, ...args) {
    console.log(`\x1b[36m[${this.className}]\x1b[0m ${text}`, ...args);
  }

  async assertModelContextLimits() {
    if (this.limits !== null) return;
    await FoundryLLM.cacheContextWindows();
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };
  }

  /**
   * Models this process has already loaded, so the check costs nothing after
   * the first message. Cleared for a model whenever it turns out to be gone.
   * @type {Set<string>}
   */
  static #loadedModels = new Set();

  /**
   * Ensure the model is in memory before we try to infer with it.
   *
   * Foundry 0.10 stopped auto-loading on inference. A non-streaming request
   * against an unloaded model returns a clean error, but a *streaming* one
   * answers 200 with SSE headers and then drops the connection, surfacing only
   * as an opaque "Premature close". Loading first avoids both.
   * @returns {Promise<void>}
   */
  async assertModelLoaded() {
    if (!this.model || FoundryLLM.#loadedModels.has(this.model)) return;
    const FoundryModels = require("./models.js");

    // The service reports fully-qualified variant ids while the preference is
    // usually an alias, so match on either side of the colon-versioned name.
    const loaded = await FoundryModels.loadedModels();
    const isLoaded = loaded.some(
      (id) => id === this.model || id.split(":")[0] === this.model
    );
    if (isLoaded) {
      FoundryLLM.#loadedModels.add(this.model);
      return;
    }

    this.#log(`Loading ${this.model} into Foundry Local...`);
    const { success, error } = await FoundryModels.loadModel(this.model);
    if (!success)
      throw new Error(
        `Could not load ${this.model} into Foundry Local: ${error}`
      );
    FoundryLLM.#loadedModels.add(this.model);
  }

  /**
   * Turn a mid-stream failure into something actionable.
   *
   * A model evicted after we loaded it — by an idle timeout, or from the host —
   * makes the service answer 200 and then drop the socket, which reaches us
   * only as "Premature close". Forget it so the next message reloads it.
   * @param {Error} error
   * @param {string} model
   * @returns {string}
   */
  static explainStreamError(error, model) {
    const isPrematureClose =
      error?.code === "ERR_STREAM_PREMATURE_CLOSE" ||
      /premature close/i.test(error?.message ?? "");
    if (!isPrematureClose) return error.message;

    FoundryLLM.#loadedModels.delete(model);
    return "Foundry Local crashed trying to reply to this message. You should change the message or try again.";
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

  streamingEnabled() {
    return "streamGetChatCompletion" in this;
  }

  /**
   * Cache the context windows for the Foundry models.
   * This is done once and then cached for the lifetime of the server. This is absolutely necessary to ensure that the context windows are correct.
   * Foundry Local has a weird behavior that when max_completion_tokens is unset it will only allow the output to be 1024 tokens.
   *
   * If you pass in too large of a max_completion_tokens, it will throw an error.
   * If you pass in too little of a max_completion_tokens, you will get stubbed outputs before you reach a real "stop" token.
   * So we need to cache the context windows and use them for the lifetime of the server.
   * @param {boolean} force
   * @returns
   */
  static async cacheContextWindows(force = false) {
    try {
      // Skip if we already have cached context windows and we're not forcing a refresh
      if (Object.keys(FoundryLLM.modelContextWindows).length > 0 && !force)
        return;

      // A 0.10+ daemon dropped maxInputTokens/maxOutputTokens from /v1/models,
      // so the registry catalog is the only place the real window is published.
      // Key every name a model can be selected by, since the preference may
      // hold an alias or a fully-qualified variant id.
      const FoundryCatalog = require("./catalog.js");
      for (const model of await FoundryCatalog.models()) {
        if (!model.contextLength) continue;
        FoundryLLM.modelContextWindows[model.alias] = model.contextLength;
        for (const variant of model.variants)
          FoundryLLM.modelContextWindows[variant.name] = model.contextLength;
      }

      const openai = new OpenAIApi({
        baseURL: parseFoundryBasePath(process.env.FOUNDRY_BASE_PATH),
        apiKey: null,
      });
      (await openai.models.list().then((result) => result.data)).map(
        (model) => {
          // Whatever the daemon reports wins — it knows how the model was
          // actually loaded. Older daemons are the only ones that report this.
          const contextWindow =
            Number(model.maxInputTokens) + Number(model.maxOutputTokens);
          if (contextWindow > 0)
            FoundryLLM.modelContextWindows[model.id] = contextWindow;
        }
      );
      FoundryLLM.#slog(
        `Context windows cached for ${Object.keys(FoundryLLM.modelContextWindows).length} model name(s).`
      );
    } catch (e) {
      FoundryLLM.#slog(`Error caching context windows: ${e.message}`);
      return;
    }
  }

  /**
   * Unload a model from the Foundry engine forcefully
   * If the model is invalid, we just ignore the error. This is a util
   * simply to have the foundry engine drop the resources for the model.
   *
   * @param {string} modelName
   * @returns {Promise<boolean>}
   */
  static async unloadModelFromEngine(modelName) {
    const FoundryModels = require("./models.js");
    FoundryLLM.#loadedModels.delete(modelName);
    return await FoundryModels.unloadModel(modelName);
  }

  /**
   * Resolve the context window to run a model with.
   *
   * - A user-set limit wins, but is clamped to what the model actually supports.
   * - With no user limit we cap at MAX_DEFAULT_CONTEXT_WINDOW rather than using
   *   the model's full window: these run on the user's own hardware, and
   *   silently handing a 128K window to a laptop makes the app crawl.
   * - With nothing known at all we fall back to a conservative 4096.
   *
   * @param {string} modelName - Alias or fully-qualified variant id.
   * @returns {number}
   */
  static promptWindowLimit(modelName) {
    const modelLimit = Number(this.modelContextWindows[modelName]) || null;
    if (!modelLimit)
      this.#slog(
        `No context window known for ${modelName} - it may be inaccurately reported.`
      );

    const envLimit = Number(process.env.FOUNDRY_MODEL_TOKEN_LIMIT);
    const userDefinedLimit =
      Number.isFinite(envLimit) && envLimit > 0 ? envLimit : null;

    if (userDefinedLimit !== null)
      return modelLimit
        ? Math.min(userDefinedLimit, modelLimit)
        : userDefinedLimit;

    return modelLimit
      ? Math.min(modelLimit, FoundryLLM.MAX_DEFAULT_CONTEXT_WINDOW)
      : 8192;
  }

  promptWindowLimit() {
    return this.constructor.promptWindowLimit(this.model);
  }

  async isValidChatCompletionModel(_ = "") {
    return true;
  }

  /**
   * Returns the capabilities of the model.
   * @returns {Promise<{tools: 'unknown' | boolean, reasoning: 'unknown' | boolean, imageGeneration: 'unknown' | boolean, vision: 'unknown' | boolean}>}
   */
  async getModelCapabilities() {
    const FoundryModels = require("./models.js");
    return await FoundryModels.getModelCapabilities(this.model);
  }

  /**
   * Generates appropriate content array for a message + attachments.
   * @param {{userPrompt:string, attachments: import("../../helpers").Attachment[]}}
   * @returns {string|object[]}
   */
  #generateContent({ userPrompt, attachments = [] }) {
    if (!attachments.length) {
      return userPrompt;
    }

    const content = [{ type: "text", text: userPrompt }];
    for (let attachment of attachments) {
      content.push({
        type: "image_url",
        image_url: {
          url: attachment.contentString,
          detail: "auto",
        },
      });
    }
    return content.flat();
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
      ...formatChatHistory(chatHistory, this.#generateContent),
      {
        role: "user",
        content: this.#generateContent({ userPrompt, attachments }),
      },
    ];
  }

  async getChatCompletion(
    messages = null,
    { temperature = this.temperature } = {}
  ) {
    if (!this.model)
      throw new Error(
        `Foundry chat: ${this.model} is not valid or defined model for chat completion!`
      );

    // max_completion_tokens is required by Foundry (it caps output at 1024
    // otherwise), so the window has to be resolved before the request is built.
    await this.assertModelContextLimits();
    await this.assertModelLoaded();
    const result = await LLMPerformanceMonitor.measureAsyncFunction(
      this.openai.chat.completions
        .create({
          model: this.model,
          messages,
          temperature,
          max_completion_tokens: this.promptWindowLimit(),
        })
        .catch((e) => {
          throw new Error(e.message);
        })
    );

    if (
      !result.output.hasOwnProperty("choices") ||
      result.output.choices.length === 0
    )
      return null;

    return {
      textResponse: result.output.choices[0].message.content,
      metrics: {
        prompt_tokens: result.output.usage.prompt_tokens || 0,
        completion_tokens: result.output.usage.completion_tokens || 0,
        total_tokens: result.output.usage.total_tokens || 0,
        outputTps: result.output.usage.completion_tokens / result.duration,
        duration: result.duration,
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
    if (!this.model)
      throw new Error(
        `Foundry chat: ${this.model} is not valid or defined model for chat completion!`
      );

    await this.assertModelContextLimits();
    await this.assertModelLoaded();
    const measuredStreamRequest = await LLMPerformanceMonitor.measureStream({
      func: this.openai.chat.completions.create({
        model: this.model,
        stream: true,
        messages,
        temperature,
        max_completion_tokens: this.promptWindowLimit(),
      }),
      messages,
      runPromptTokenCalculation: true,
      modelTag: this.model,
      provider: this.className,
    });
    return measuredStreamRequest;
  }

  /**
   * The timeout for the Foundry stream in milliseconds.
   * This is because Foundry does not self-close the stream and so we need to timeout the stream after a certain amount of time.
   * @returns {number}
   */
  get timeout() {
    return 500;
  }

  /**
   * Handles the default stream response for a chat.
   * @param {import("express").Response} response
   * @param {import('../../helpers/chat/LLMPerformanceMonitor').MonitoredStream} stream
   * @param {Object} responseProps
   * @returns {Promise<string>}
   */
  handleStream(response, stream, responseProps) {
    const timeoutThresholdMs = this.timeout;
    const { uuid = uuidv4(), sources = [] } = responseProps;

    return new Promise(async (resolve) => {
      let fullText = "";
      let reasoningText = "";
      let lastChunkTime = null; // null when first token is still not received.
      // Foundry echoes tool calls into the content stream as raw markup on top
      // of emitting them natively — keep that out of the chat window.
      const toolCallFilter = new ToolCallTextFilter();

      // Establish listener to early-abort a streaming response
      // in case things go sideways or the user does not like the response.
      // We preserve the generated text but continue as if chat was completed
      // to preserve previously generated content.
      const handleAbort = () => {
        stream?.endMeasurement({
          completion_tokens: LLMPerformanceMonitor.countTokens(fullText),
        });
        clientAbortedHandler(resolve, fullText);
      };
      response.on("close", handleAbort);

      // NOTICE: As of Foundry 0.8.119 the stream will never return a finish_reason
      // nor will it self-close or send a final chunk. So we need to maintain an interval timer that if we go >=timeoutThresholdMs with
      // no new chunks then we kill the stream and assume it to be complete.
      const timeoutCheck = setInterval(() => {
        if (lastChunkTime === null) return;

        const now = Number(new Date());
        const diffMs = now - lastChunkTime;

        if (diffMs >= timeoutThresholdMs) {
          console.log(
            `Foundry stream did not self-close and has been stale for >${timeoutThresholdMs}ms. Closing response stream.`
          );
          writeResponseChunk(response, {
            uuid,
            sources,
            type: "textResponseChunk",
            textResponse: "",
            close: true,
            error: false,
          });
          clearInterval(timeoutCheck);
          response.removeListener("close", handleAbort);
          stream?.endMeasurement({
            completion_tokens: LLMPerformanceMonitor.countTokens(fullText),
          });
          resolve(fullText);
        }
      }, 500);

      try {
        for await (const chunk of stream) {
          // console.log(JSON.stringify(chunk, null, 2));
          const message = chunk?.choices?.[0];
          const token = message?.delta?.content;
          const reasoningToken = message?.delta?.reasoning;
          lastChunkTime = Number(new Date());

          // Reasoning models will always return the reasoning text before the token text.
          // can be null or ''
          if (reasoningToken) {
            // If the reasoning text is empty (''), we need to initialize it
            // and send the first chunk of reasoning text.
            if (reasoningText.length === 0) {
              writeResponseChunk(response, {
                uuid,
                sources: [],
                type: "textResponseChunk",
                textResponse: `<think>${reasoningToken}`,
                close: false,
                error: false,
              });
              reasoningText += `<think>${reasoningToken}`;
              continue;
            } else {
              // If the reasoning text is not empty, we need to append the reasoning text
              // to the existing reasoning text.
              writeResponseChunk(response, {
                uuid,
                sources: [],
                type: "textResponseChunk",
                textResponse: reasoningToken,
                close: false,
                error: false,
              });
              reasoningText += reasoningToken;
            }
          }

          // If the reasoning text is not empty, but the reasoning token is empty
          // and the token text is not empty we need to close the reasoning text and begin sending the token text.
          if (!!reasoningText && !reasoningToken && token) {
            writeResponseChunk(response, {
              uuid,
              sources: [],
              type: "textResponseChunk",
              textResponse: `</think>`,
              close: false,
              error: false,
            });
            fullText += `${reasoningText}</think>`;
            reasoningText = "";
          }

          if (token) {
            const visible = toolCallFilter.push(token);
            if (visible) {
              fullText += visible;
              writeResponseChunk(response, {
                uuid,
                sources: [],
                type: "textResponseChunk",
                textResponse: visible,
                close: false,
                error: false,
              });
            }
          }

          // finish_reason can be "stop", "length", etc. when complete
          // Must check for truthy value since undefined !== null is true
          if (message?.finish_reason) {
            writeResponseChunk(response, {
              uuid,
              sources,
              type: "textResponseChunk",
              textResponse: "",
              close: true,
              error: false,
            });
            response.removeListener("close", handleAbort);
            clearInterval(timeoutCheck);
            stream?.endMeasurement({
              completion_tokens: LLMPerformanceMonitor.countTokens(fullText),
            });
            resolve(fullText);
            return; // Exit the loop after resolving
          }
        }
      } catch (e) {
        writeResponseChunk(response, {
          uuid,
          sources,
          type: "abort",
          textResponse: null,
          close: true,
          error: FoundryLLM.explainStreamError(e, this.model),
        });
        response.removeListener("close", handleAbort);
        clearInterval(timeoutCheck);
        stream?.endMeasurement({
          completion_tokens: LLMPerformanceMonitor.countTokens(fullText),
        });
        resolve(fullText);
      }
    });
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

/**
 * Parse the base path for the Foundry container API. Since the base path must end in /v1 and cannot have a trailing slash,
 * and the user can possibly set it to anything and likely incorrectly due to pasting behaviors, we need to ensure it is in the correct format.
 * @param {string} basePath
 * @returns {string}
 */
function parseFoundryBasePath(providedBasePath = "") {
  try {
    const baseURL = new URL(providedBasePath);
    const basePath = `${baseURL.origin}/v1`;
    return basePath;
  } catch {
    return providedBasePath;
  }
}

module.exports = {
  FoundryLLM,
  parseFoundryBasePath,
};
