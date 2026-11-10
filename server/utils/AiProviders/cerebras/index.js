const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
  LLMPerformanceMonitor,
} = require("../../helpers/chat/LLMPerformanceMonitor");
const {
  handleDefaultStreamResponseV2,
  formatChatHistory,
} = require("../../helpers/chat/responses");
const {
  temperatureParam,
} = require("../../agents/aibitat/providers/helpers/tooled");
const { MODEL_MAP } = require("../modelMap");
const { ContextWindowCache } = require("../../helpers/contextWindowCache");

class CerebrasLLM {
  constructor(embedder = null, modelPreference = null) {
    const { OpenAI: OpenAIApi } = require("openai");
    if (!process.env.CEREBRAS_API_KEY)
      throw new Error("No Cerebras API key was set.");

    this.className = "CerebrasLLM";
    this.openai = new OpenAIApi({
      baseURL: "https://api.cerebras.ai/v1",
      apiKey: process.env.CEREBRAS_API_KEY,
    });
    this.model =
      modelPreference || process.env.CEREBRAS_MODEL_PREF || "gpt-oss-120b";
    this.embedder = embedder ?? new NativeEmbedder();

    // Limits are resolved in assertModelContextLimits; start the lookup now.
    this.limits = null;
    CerebrasLLM.contextWindows.ensure(this.model);
    this.#log(`Initialized with model: ${this.model}`);
  }

  #log(text, ...args) {
    console.log(`\x1b[36m[${this.className}]\x1b[0m ${text}`, ...args);
  }

  static #slog(text, ...args) {
    console.log(`\x1b[36m[CerebrasLLM]\x1b[0m ${text}`, ...args);
  }

  async assertModelContextLimits() {
    if (this.limits !== null) return;
    await CerebrasLLM.contextWindows.ensure(this.model);
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };
  }

  /** @see ContextWindowCache */
  static contextWindows = new ContextWindowCache({
    fetchAll: async () => {
      const res = await fetch("https://api.cerebras.ai/public/v1/models");
      if (!res.ok) throw new Error(`Cerebras:/models ${res.statusText}`);

      const { data: models = [] } = await res.json();
      const limits = {};
      for (const model of models)
        limits[model.id] = model.limits?.max_context_length;
      return limits;
    },
    log: (...args) => CerebrasLLM.#slog(...args),
  });

  /**
   * Refresh the context windows of every available model.
   * @param {boolean} force - Refresh even if the cached inventory has not expired.
   * @returns {Promise<void>}
   */
  static async cacheContextWindows(force = false) {
    await CerebrasLLM.contextWindows.refresh({ force });
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
    if (CerebrasLLM.contextWindows.size === 0) {
      this.#slog(
        "No context windows cached - Context window may be inaccurately reported."
      );
      return (
        Number(process.env.CEREBRAS_MODEL_TOKEN_LIMIT) || // Legacy support for old ENV
        MODEL_MAP.get("cerebras", modelName) || // Use the model map for the context window
        128000 // Default to 128000 if no context window is found and modelMap is not available
      );
    }
    return Number(CerebrasLLM.contextWindows.get(modelName)) || 128000;
  }

  promptWindowLimit() {
    return this.constructor.promptWindowLimit(this.model);
  }

  // The Cerebras inference API is OpenAI-compatible, so any model the account
  // has access to can be used. The available models are surfaced to the UI via
  // the customModels helper, so we only need to ensure a model is present here.
  async isValidChatCompletionModel(_modelName = "") {
    return true;
  }

  /**
   * Generates appropriate content array for a message + attachments.
   * @param {{userPrompt:string, attachments: import("../../helpers").Attachment[]}}
   * @returns {string|object[]}
   */
  #generateContent({ userPrompt, attachments: _attachments = [] }) {
    return userPrompt;

    /** @dev-note
     * There are not cerebras models that support vision - so this can be stubbed out for now.
     * If the provider ever figures out how to support vision, this can be uncommented so images can be supported.
     */

    // if (!attachments.length) {
    //   return userPrompt;
    // }

    // const content = [{ type: "text", text: userPrompt }];
    // for (let attachment of attachments) {
    //   content.push({
    //     type: "image_url",
    //     image_url: {
    //       url: attachment.contentString,
    //       detail: "auto",
    //     },
    //   });
    // }
    // return content.flat();
  }

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
   * Do we need this?
   * Parses and prepends reasoning from the response and returns the full text response.
   * Used for getChatCompletions to render thinking text if present in full response.
   * @param {Object} message - The message object from the LMStudio response.
   * @returns {string}
   */
  #parseReasoningFromResponse({ message }) {
    let textResponse = message?.content ?? "";
    if (!!message?.reasoning && message.reasoning.trim().length > 0)
      textResponse = `<think>${message.reasoning}</think>${textResponse}`;
    return textResponse;
  }

  async getChatCompletion(
    messages = null,
    { temperature = this.temperature } = {}
  ) {
    const result = await LLMPerformanceMonitor.measureAsyncFunction(
      this.openai.chat.completions
        .create({
          model: this.model,
          messages,
          ...temperatureParam(temperature),
        })
        .catch((e) => {
          console.error(e);
          throw new Error(e.message);
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
        prompt_tokens: result.output.usage.prompt_tokens || 0,
        completion_tokens: result.output.usage.completion_tokens || 0,
        total_tokens: result.output.usage.total_tokens || 0,
        outputTps:
          result.output.usage.completion_tokens /
          result.output.time_info.completion_time,
        duration: result.output.time_info.completion_time,
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
      func: this.openai.chat.completions.create({
        model: this.model,
        stream: true,
        messages,
        ...temperatureParam(temperature),
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

  /**
   * Returns the capabilities of the model.
   * This uses the new /public/v1/models endpoint, which returns the model capabilities.
   * @returns {Promise<{tools: 'unknown' | boolean, reasoning: 'unknown' | boolean, imageGeneration: 'unknown' | boolean, vision: 'unknown' | boolean}>}
   */
  async getModelCapabilities() {
    try {
      const capabilities =
        (await fetch(`https://api.cerebras.ai/public/v1/models/${this.model}`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => {
            if (!res.ok)
              throw new Error(
                `Cerebras:getModelCapabilities - ${res.statusText}`
              );
            return res.json();
          })
          .then(({ capabilities }) => capabilities)) || {};

      return {
        tools: capabilities?.tools,
        reasoning: capabilities?.reasoning,
        imageGeneration: false,
        vision: capabilities?.vision,
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
  CerebrasLLM,
};
