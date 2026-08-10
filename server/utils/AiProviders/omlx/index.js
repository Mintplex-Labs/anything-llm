const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
  handleDefaultStreamResponseV2,
  formatChatHistory,
} = require("../../helpers/chat/responses");
const {
  LLMPerformanceMonitor,
} = require("../../helpers/chat/LLMPerformanceMonitor");
const { OpenAI: OpenAIApi } = require("openai");

/**
 * OMLX (oMLX) is an OpenAI-compatible MLX inference server for Apple Silicon.
 * https://github.com/jundot/omlx
 */
class OMLXLLM {
  /** @see OMLXLLM.cacheContextWindows */
  static modelContextWindows = {};

  constructor(embedder = null, modelPreference = null) {
    if (!process.env.OMLX_LLM_BASE_PATH)
      throw new Error("No OMLX API Base Path was set.");

    this.className = "OMLXLLM";
    this.omlx = new OpenAIApi({
      baseURL: parseOMLXBasePath(process.env.OMLX_LLM_BASE_PATH),
      apiKey: process.env.OMLX_LLM_API_KEY || null,
    });

    this.model = modelPreference || process.env.OMLX_LLM_MODEL_PREF;
    if (!this.model) throw new Error("OMLX must have a valid model set.");

    this.embedder = embedder ?? new NativeEmbedder();
    this.defaultTemp = 0.7;

    // Lazy load the limits to avoid blocking the main thread on cacheContextWindows
    this.limits = null;

    OMLXLLM.cacheContextWindows(true);
    this.#log(`initialized with model: ${this.model}`);
  }

  #log(text, ...args) {
    console.log(`\x1b[32m[OMLX]\x1b[0m ${text}`, ...args);
  }

  static #slog(text, ...args) {
    console.log(`\x1b[32m[OMLX]\x1b[0m ${text}`, ...args);
  }

  async assertModelContextLimits() {
    if (this.limits !== null) return;
    await OMLXLLM.cacheContextWindows();
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };
    this.#log(
      `${this.model} is using a max context window of ${this.promptWindowLimit()} tokens.`
    );
  }

  /**
   * Cache the context windows for the models available on the OMLX server.
   * OMLX reports the effective context window of each model via the
   * vLLM-compatible `max_model_len` field on `/v1/models`, so we can discover
   * limits without the user having to set them manually.
   * @param {boolean} force - Force the cache to be refreshed.
   * @returns {Promise<void>} - A promise that resolves when the cache is refreshed.
   */
  static async cacheContextWindows(force = false) {
    try {
      // Skip if we already have cached context windows and we're not forcing a refresh
      if (Object.keys(OMLXLLM.modelContextWindows).length > 0 && !force) return;

      const endpoint = new URL(
        parseOMLXBasePath(process.env.OMLX_LLM_BASE_PATH)
      );
      endpoint.pathname += "/models";
      await fetch(endpoint.toString(), {
        headers: {
          "Content-Type": "application/json",
          ...(process.env.OMLX_LLM_API_KEY
            ? { Authorization: `Bearer ${process.env.OMLX_LLM_API_KEY}` }
            : {}),
        },
      })
        .then((res) => {
          if (!res.ok)
            throw new Error(`OMLX:cacheContextWindows - ${res.statusText}`);
          return res.json();
        })
        .then(({ data: models }) => {
          models.forEach((model) => {
            // A model can omit max_model_len - cache the 16k fallback for it
            // so it is not later mistaken for a large-context model.
            if (!model?.max_model_len)
              return (OMLXLLM.modelContextWindows[model.id] = 16000);
            OMLXLLM.modelContextWindows[model.id] = Number(model.max_model_len);
          });
        })
        .catch((e) => {
          OMLXLLM.#slog(`Error caching context windows`, e);
          return;
        });

      OMLXLLM.#slog(`Context windows cached for all models!`);
    } catch (e) {
      OMLXLLM.#slog(`Error caching context windows`, e);
      return;
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

  streamingEnabled() {
    return "streamGetChatCompletion" in this;
  }

  static promptWindowLimit(modelName) {
    if (Object.keys(OMLXLLM.modelContextWindows).length === 0) {
      this.#slog(
        "No context windows cached - Context window may be inaccurately reported."
      );
      return Number(process.env.OMLX_LLM_TOKEN_LIMIT) || 16000;
    }

    let userDefinedLimit = null;
    const systemDefinedLimit = OMLXLLM.maxContextWindow(modelName);

    if (
      process.env.OMLX_LLM_TOKEN_LIMIT &&
      !isNaN(Number(process.env.OMLX_LLM_TOKEN_LIMIT)) &&
      Number(process.env.OMLX_LLM_TOKEN_LIMIT) > 0
    )
      userDefinedLimit = Number(process.env.OMLX_LLM_TOKEN_LIMIT);

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
    if (Object.keys(OMLXLLM.modelContextWindows).length === 0 || !modelName)
      return 16384;
    return Number(OMLXLLM.modelContextWindows[modelName]) || 16384;
  }

  async isValidChatCompletionModel(_ = "") {
    return true;
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

  /**
   * Parses and prepends reasoning from the response and returns the full text response.
   * Used for getChatCompletions to render thinking text if present in full response.
   * @param {Object} message - The message object from the OMLX response.
   * @returns {string}
   */
  #parseReasoningFromResponse({ message }) {
    let textResponse = message?.content ?? "";
    if (
      !!message?.reasoning_content &&
      message.reasoning_content.trim().length > 0
    )
      textResponse = `<think>${message.reasoning_content}</think>${textResponse}`;
    return textResponse;
  }

  async getChatCompletion(messages = null, { temperature = 0.7 }) {
    const result = await LLMPerformanceMonitor.measureAsyncFunction(
      this.omlx.chat.completions.create({
        model: this.model,
        messages,
        temperature,
      })
    );

    if (
      !result.output.hasOwnProperty("choices") ||
      result.output.choices.length === 0
    )
      return null;

    return {
      textResponse: this.#parseReasoningFromResponse(result.output.choices[0]),
      metrics: {
        prompt_tokens: result.output.usage?.prompt_tokens || 0,
        completion_tokens: result.output.usage?.completion_tokens || 0,
        total_tokens: result.output.usage?.total_tokens || 0,
        outputTps: result.output.usage?.completion_tokens / result.duration,
        duration: result.duration,
        model: this.model,
        provider: this.className,
        timestamp: new Date(),
      },
    };
  }

  async streamGetChatCompletion(messages = null, { temperature = 0.7 }) {
    const measuredStreamRequest = await LLMPerformanceMonitor.measureStream({
      func: this.omlx.chat.completions.create({
        model: this.model,
        stream: true,
        stream_options: { include_usage: true },
        messages,
        temperature,
      }),
      messages,
      runPromptTokenCalculation: false,
      modelTag: this.model,
      provider: this.className,
    });
    return measuredStreamRequest;
  }

  handleStream(response, stream, responseProps) {
    return handleDefaultStreamResponseV2(response, stream, responseProps);
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

  async getModelCapabilities() {
    const capabilities = {
      reasoning: false,
      tools: true,
      vision: false,
      imageGeneration: false,
    };
    try {
      // oMLX currently does not implement a /v1/models/{model_id} endpoint.
      // As of now, this endpoint offers the richest metadata for models on
      // the server
      const { models = [] } = await this.omlx.get("/models/status");

      const modelData = models.find((m) => m.id === this.model);

      if (!modelData) {
        throw new Error(
          `Model capabilities for ${this.model} could not be retrieved`
        );
      }

      // thinking_default is currently the best flag for identifying a
      // reasoning model. All this boolean means is "Does this model reason by
      // default or do I have to prompt it to reason?". But the field will either be
      // undefined or null for non-reasonig models.
      capabilities.reasoning =
        modelData.thinking_default !== null &&
        modelData.thinking_default !== undefined;
      capabilities.vision = modelData.model_type === "vlm";

      // Curently cannot be determined
      capabilities.imageGeneration = false;
    } catch (e) {
      this.#log(e.message);
    }

    return capabilities;
  }
}

/**
 * Parse the base path for the OMLX server. The OpenAI-compatible API is
 * served under /v1 and the user may paste the URL with or without the /v1
 * suffix or a trailing slash, so we normalize it here.
 * @param {string} providedBasePath
 * @returns {string}
 */
function parseOMLXBasePath(providedBasePath = "") {
  try {
    const baseURL = new URL(providedBasePath);
    return `${baseURL.origin}/v1`;
  } catch {
    return providedBasePath;
  }
}

module.exports = {
  OMLXLLM,
  parseOMLXBasePath,
};
