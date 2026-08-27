const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
  LLMPerformanceMonitor,
} = require("../../helpers/chat/LLMPerformanceMonitor");
const {
  handleDefaultStreamResponseV2,
  formatChatHistory,
} = require("../../helpers/chat/responses");

class LocalAiLLM {
  /** @see LocalAiLLM.cacheContextWindows */
  static modelContextWindows = {};

  constructor(embedder = null, modelPreference = null) {
    if (!process.env.LOCAL_AI_BASE_PATH)
      throw new Error("No LocalAI Base Path was set.");

    this.className = "LocalAiLLM";
    const { OpenAI: OpenAIApi } = require("openai");
    this.openai = new OpenAIApi({
      baseURL: process.env.LOCAL_AI_BASE_PATH,
      apiKey: process.env.LOCAL_AI_API_KEY ?? null,
    });
    this.model = modelPreference || process.env.LOCAL_AI_MODEL_PREF;

    this.embedder = embedder ?? new NativeEmbedder();
    this.defaultTemp = 0.7;

    // Lazy load the limits to avoid blocking the main thread on cacheContextWindows
    this.limits = null;

    LocalAiLLM.cacheContextWindows(true);
    this.#log(`initialized with model: ${this.model}`);
  }

  #log(text, ...args) {
    console.log(`\x1b[32m[LocalAI]\x1b[0m ${text}`, ...args);
  }

  static #slog(text, ...args) {
    console.log(`\x1b[32m[LocalAI]\x1b[0m ${text}`, ...args);
  }

  async assertModelContextLimits() {
    if (this.limits !== null) return;
    await LocalAiLLM.cacheContextWindows();
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
   * Cache the context windows for the LocalAI models.
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
      if (Object.keys(LocalAiLLM.modelContextWindows).length > 0 && !force)
        return;

      const apiKey = process.env.LOCAL_AI_API_KEY ?? null;
      const headers = apiKey ? { Authorization: `Bearer ${apiKey}` } : {};
      const { origin } = new URL(process.env.LOCAL_AI_BASE_PATH);
      const { data: models = [] } = await fetch(`${origin}/v1/models`, {
        headers,
      }).then((res) => {
        if (!res.ok)
          throw new Error(`LocalAI:cacheContextWindows - ${res.statusText}`);
        return res.json();
      });
      if (!models.length) return;

      // The VRAM-estimate endpoint returns the resolved context_length for a
      // loaded model, including values auto-detected from GGUF metadata that
      // never appear in the static config JSON.
      const estimates = await Promise.all(
        models.map(({ id }) =>
          fetch(`${origin}/api/models/vram-estimate`, {
            method: "POST",
            headers: { ...headers, "Content-Type": "application/json" },
            body: JSON.stringify({ model: id }),
          })
            .then((res) => (res.ok ? res.json() : {}))
            .then((est) => ({ id, ...est }))
            .catch(() => ({ id }))
        )
      );
      estimates.forEach(({ id, context_length }) => {
        if (!context_length) return;
        LocalAiLLM.modelContextWindows[id] = Number(context_length);
      });
      LocalAiLLM.#slog(`Context windows cached for all models!`);
    } catch (e) {
      LocalAiLLM.#slog(`Error caching context windows`, e);
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
    if (Object.keys(LocalAiLLM.modelContextWindows).length === 0) {
      this.#slog(
        "No context windows cached - Context window may be inaccurately reported."
      );
      return Number(process.env.LOCAL_AI_MODEL_TOKEN_LIMIT) || 8192;
    }

    let userDefinedLimit = null;
    const systemDefinedLimit =
      Number(this.modelContextWindows[modelName]) || 8192;

    if (
      process.env.LOCAL_AI_MODEL_TOKEN_LIMIT &&
      !isNaN(Number(process.env.LOCAL_AI_MODEL_TOKEN_LIMIT)) &&
      Number(process.env.LOCAL_AI_MODEL_TOKEN_LIMIT) > 0
    )
      userDefinedLimit = Number(process.env.LOCAL_AI_MODEL_TOKEN_LIMIT);

    // The user defined limit is always higher priority than the context window limit, but it cannot be higher than the context window limit
    // so we return the minimum of the two, if there is no user defined limit, we return the system defined limit as-is.
    if (userDefinedLimit !== null)
      return Math.min(userDefinedLimit, systemDefinedLimit);
    return systemDefinedLimit;
  }

  promptWindowLimit() {
    return this.constructor.promptWindowLimit(this.model);
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

  async getChatCompletion(messages = null, { temperature = 0.7 }) {
    if (!(await this.isValidChatCompletionModel(this.model)))
      throw new Error(
        `LocalAI chat: ${this.model} is not valid for chat completion!`
      );

    const result = await LLMPerformanceMonitor.measureAsyncFunction(
      this.openai.chat.completions.create({
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

    const promptTokens = LLMPerformanceMonitor.countTokens(messages);
    const completionTokens = LLMPerformanceMonitor.countTokens(
      result.output.choices[0].message.content
    );

    return {
      textResponse: result.output.choices[0].message.content,
      metrics: {
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        total_tokens: promptTokens + completionTokens,
        outputTps: completionTokens / result.duration,
        duration: result.duration,
        model: this.model,
        provider: this.className,
        timestamp: new Date(),
      },
    };
  }

  async streamGetChatCompletion(messages = null, { temperature = 0.7 }) {
    if (!(await this.isValidChatCompletionModel(this.model)))
      throw new Error(
        `LocalAi chat: ${this.model} is not valid for chat completion!`
      );

    const measuredStreamRequest = await LLMPerformanceMonitor.measureStream({
      func: this.openai.chat.completions.create({
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
}

module.exports = {
  LocalAiLLM,
};
