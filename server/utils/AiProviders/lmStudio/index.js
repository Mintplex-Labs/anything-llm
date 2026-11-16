const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
  handleDefaultStreamResponseV2,
  formatChatHistory,
} = require("../../helpers/chat/responses");
const {
  LLMPerformanceMonitor,
} = require("../../helpers/chat/LLMPerformanceMonitor");
const { OpenAI: OpenAIApi } = require("openai");
const {
  temperatureParam,
} = require("../../agents/aibitat/providers/helpers/tooled");
const {
  PROVIDER_REASONING_EFFORTS,
  reasoningParams,
} = require("../../helpers/reasoningEffort");
const { ContextWindowCache } = require("../../helpers/contextWindowCache");

//  hybrid of openAi LLM chat completion for LMStudio
class LMStudioLLM {
  constructor(embedder = null, modelPreference = null) {
    if (!process.env.LMSTUDIO_BASE_PATH)
      throw new Error("No LMStudio API Base Path was set.");

    this.className = "LMStudioLLM";
    const apiKey = process.env.LMSTUDIO_AUTH_TOKEN ?? null;
    this.lmstudio = new OpenAIApi({
      baseURL: parseLMStudioBasePath(process.env.LMSTUDIO_BASE_PATH), // here is the URL to your LMStudio instance
      apiKey,
    });

    // Prior to LMStudio 0.2.17 the `model` param was not required and you could pass anything
    // into that field and it would work. On 0.2.17 LMStudio introduced multi-model chat
    // which now has a bug that reports the server model id as "Loaded from Chat UI"
    // and any other value will crash inferencing. So until this is patched we will
    // try to fetch the `/models` and have the user set it, or just fallback to "Loaded from Chat UI"
    // which will not impact users with <v0.2.17 and should work as well once the bug is fixed.
    this.model = modelPreference || process.env.LMSTUDIO_MODEL_PREF;
    if (!this.model) throw new Error("LMStudio must have a valid model set.");

    this.embedder = embedder ?? new NativeEmbedder();

    // Limits are resolved in assertModelContextLimits; start the lookup now.
    this.limits = null;
    LMStudioLLM.contextWindows.ensure(this.model);
    this.#log(`initialized with model: ${this.model}`);
  }

  #log(text, ...args) {
    console.log(`\x1b[32m[LMStudio]\x1b[0m ${text}`, ...args);
  }

  static #slog(text, ...args) {
    console.log(`\x1b[32m[LMStudio]\x1b[0m ${text}`, ...args);
  }

  async assertModelContextLimits() {
    if (this.limits !== null) return;
    await LMStudioLLM.contextWindows.ensure(this.model);
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };
  }

  /** @see ContextWindowCache */
  static contextWindows = new ContextWindowCache({
    connection: () =>
      `${process.env.LMSTUDIO_BASE_PATH}|${process.env.LMSTUDIO_AUTH_TOKEN ?? ""}`,
    fetchAll: async () => {
      const apiKey = process.env.LMSTUDIO_AUTH_TOKEN ?? null;
      const endpoint = new URL(
        parseLMStudioBasePath(process.env.LMSTUDIO_BASE_PATH)
      );
      endpoint.pathname = "/api/v0/models";
      const res = await fetch(endpoint.toString(), {
        headers: {
          "Content-Type": "application/json",
          ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
        },
      });
      if (!res.ok) throw new Error(`LMStudio:/api/v0/models ${res.statusText}`);

      const { data: models = [] } = await res.json();
      const limits = {};
      for (const model of models) {
        if (model.type === "embeddings") continue;
        limits[model.id] = model.max_context_length;
      }
      return limits;
    },
    log: (...args) => LMStudioLLM.#slog(...args),
  });

  /**
   * Refresh the context windows of every available model.
   * @param {boolean} force - Refresh even if the cached inventory has not expired.
   * @returns {Promise<void>}
   */
  static async cacheContextWindows(force = false) {
    await LMStudioLLM.contextWindows.refresh({ force });
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
    if (LMStudioLLM.contextWindows.size === 0) {
      this.#slog(
        "No context windows cached - Context window may be inaccurately reported."
      );
      return process.env.LMSTUDIO_MODEL_TOKEN_LIMIT || 16384;
    }

    let userDefinedLimit = null;
    const systemDefinedLimit =
      Number(LMStudioLLM.contextWindows.get(modelName)) || 16384;

    if (
      process.env.LMSTUDIO_MODEL_TOKEN_LIMIT &&
      !isNaN(Number(process.env.LMSTUDIO_MODEL_TOKEN_LIMIT)) &&
      Number(process.env.LMSTUDIO_MODEL_TOKEN_LIMIT) > 0
    )
      userDefinedLimit = Number(process.env.LMSTUDIO_MODEL_TOKEN_LIMIT);

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
    // LMStudio may be anything. The user must do it correctly.
    // See comment about this.model declaration in constructor
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
   * @param {Object} message - The message object from the LMStudio response.
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

  async getChatCompletion(
    messages = null,
    { temperature = this.temperature, reasoningEffort = null } = {}
  ) {
    if (!this.model)
      throw new Error(
        `LMStudio chat: ${this.model} is not valid or defined model for chat completion!`
      );

    const result = await LLMPerformanceMonitor.measureAsyncFunction(
      this.lmstudio.chat.completions.create({
        model: this.model,
        messages,
        ...temperatureParam(temperature),
        ...reasoningParams("lmstudio", reasoningEffort, this.model),
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

  async streamGetChatCompletion(
    messages = null,
    { temperature = this.temperature, reasoningEffort = null } = {}
  ) {
    if (!this.model)
      throw new Error(
        `LMStudio chat: ${this.model} is not valid or defined model for chat completion!`
      );

    const measuredStreamRequest = await LLMPerformanceMonitor.measureStream({
      func: this.lmstudio.chat.completions.create({
        model: this.model,
        stream: true,
        messages,
        ...temperatureParam(temperature),
        ...reasoningParams("lmstudio", reasoningEffort, this.model),
      }),
      messages,
      runPromptTokenCalculation: true,
      modelTag: this.model,
      provider: this.className,
    });
    return measuredStreamRequest;
  }

  handleStream(response, stream, responseProps) {
    return handleDefaultStreamResponseV2(response, stream, responseProps);
  }

  /**
   * Fetches a model's entry from the /api/v1/models endpoint.
   * @param {string} model - The model key to look up
   * @returns {Promise<object>} The model info, or an empty object if not found.
   */
  static async #getModelInfo(model) {
    const endpoint = new URL(
      parseLMStudioBasePath(process.env.LMSTUDIO_BASE_PATH, "v1")
    );
    const apiKey = process.env.LMSTUDIO_AUTH_TOKEN ?? null;
    endpoint.pathname += "/models";
    return (
      (await fetch(endpoint.toString(), {
        headers: {
          "Content-Type": "application/json",
          ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
        },
      })
        .then((res) => {
          if (!res.ok)
            throw new Error(`LMStudio:getModelInfo - ${res.statusText}`);
          return res.json();
        })
        .then(({ models = [] }) => models.find((m) => m.key === model))) || {}
    );
  }

  /**
   * Whether the model currently has an instance loaded into memory.
   * Resolves true on error so a dead server fails on the real completion instead.
   * @param {string} model - The model key to check
   * @returns {Promise<boolean>}
   */
  static async isModelLoaded(model) {
    return await LMStudioLLM.#getModelInfo(model)
      .then((info) => (info.loaded_instances ?? []).length > 0)
      .catch(() => true);
  }

  /**
   * Returns the capabilities of the model.
   * This uses the new /api/v1 endpoint, which returns the model info in a different format.
   * @returns {Promise<{tools: 'unknown' | boolean, reasoning: 'unknown' | boolean, reasoningOptions: string[], imageGeneration: 'unknown' | boolean, vision: 'unknown' | boolean}>}
   */
  async getModelCapabilities() {
    try {
      const modelInfo = await LMStudioLLM.#getModelInfo(this.model);

      const capabilities = modelInfo.hasOwnProperty("capabilities")
        ? modelInfo.capabilities
        : {
            trained_for_tool_use: "unknown",
            vision: "unknown",
          };

      // `reasoning.allowed_options` is per model (eg: on/off for Qwen3, or
      // low/medium/high for gpt-oss).
      const reasoningOptions = PROVIDER_REASONING_EFFORTS.lmstudio().filter(
        (option) => capabilities.reasoning?.allowed_options?.includes(option)
      );

      return {
        tools: capabilities.trained_for_tool_use,
        reasoning: capabilities.hasOwnProperty("reasoning"),
        reasoningOptions,
        imageGeneration: "unknown", // LM Studio does not support image generation yet.
        vision: capabilities.vision,
      };
    } catch (error) {
      console.error("Error getting model capabilities:", error);
      return {
        tools: "unknown",
        reasoning: "unknown",
        reasoningOptions: [],
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

/**
 * Parse the base path for the LMStudio API. Since the base path must end in /v1 and cannot have a trailing slash,
 * and the user can possibly set it to anything and likely incorrectly due to pasting behaviors, we need to ensure it is in the correct format.
 * @param {string} basePath
 * @param {'legacy' | 'v1'} apiVersion
 * @returns {string}
 */
function parseLMStudioBasePath(providedBasePath = "", apiVersion = "legacy") {
  try {
    const baseURL = new URL(providedBasePath);
    let basePath = `${baseURL.origin}`;
    if (apiVersion === "legacy") basePath += `/v1`;
    if (apiVersion === "v1") basePath += `/api/v1`;
    return basePath;
  } catch {
    return providedBasePath;
  }
}

module.exports = {
  LMStudioLLM,
  parseLMStudioBasePath,
};
