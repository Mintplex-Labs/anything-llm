const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
  LLMPerformanceMonitor,
} = require("../../helpers/chat/LLMPerformanceMonitor");
const {
  handleDefaultStreamResponseV2,
  formatChatHistory,
} = require("../../helpers/chat/responses");
const { OpenAI: OpenAIApi } = require("openai");

class FoundryLLM {
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
    this.defaultTemp = 0.7;
    FoundryLLM.cacheContextWindows(true).then(() => {
      this.limits = {
        history: this.promptWindowLimit() * 0.15,
        system: this.promptWindowLimit() * 0.15,
        user: this.promptWindowLimit() * 0.7,
      };

      this.#log(
        `Loaded with model: ${this.model} with context window: ${this.promptWindowLimit()}`
      );
    });
  }

  static #slog(text, ...args) {
    console.log(`\x1b[36m[FoundryLLM]\x1b[0m ${text}`, ...args);
  }

  #log(text, ...args) {
    console.log(`\x1b[36m[${this.className}]\x1b[0m ${text}`, ...args);
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

      const openai = new OpenAIApi({
        baseURL: parseFoundryBasePath(process.env.FOUNDRY_BASE_PATH),
        apiKey: null,
      });
      (await openai.models.list().then((result) => result.data)).map(
        (model) => {
          const contextWindow =
            Number(model.maxInputTokens) + Number(model.maxOutputTokens);
          FoundryLLM.modelContextWindows[model.id] = contextWindow;
        }
      );
      FoundryLLM.#slog(`Context windows cached for all models!`);
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
    const basePath = parseFoundryBasePath(process.env.FOUNDRY_BASE_PATH);
    const baseUrl = new URL(basePath);
    baseUrl.pathname = `/openai/unload/${modelName}`;
    baseUrl.searchParams.set("force", "true");
    return await fetch(baseUrl.toString())
      .then((res) => res.json())
      .catch(() => null);
  }

  static promptWindowLimit(modelName) {
    let userDefinedLimit = null;
    const systemDefinedLimit =
      Number(this.modelContextWindows[modelName]) || 4096;

    if (
      process.env.FOUNDRY_MODEL_TOKEN_LIMIT &&
      !isNaN(Number(process.env.FOUNDRY_MODEL_TOKEN_LIMIT)) &&
      Number(process.env.FOUNDRY_MODEL_TOKEN_LIMIT) > 0
    )
      userDefinedLimit = Number(process.env.FOUNDRY_MODEL_TOKEN_LIMIT);

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

  async getChatCompletion(messages = null, { temperature = 0.7 }) {
    if (!this.model)
      throw new Error(
        `Foundry chat: ${this.model} is not valid or defined model for chat completion!`
      );

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
      },
    };
  }

  async streamGetChatCompletion(messages = null, { temperature = 0.7 }) {
    if (!this.model)
      throw new Error(
        `Foundry chat: ${this.model} is not valid or defined model for chat completion!`
      );

    const measuredStreamRequest = await LLMPerformanceMonitor.measureStream(
      this.openai.chat.completions.create({
        model: this.model,
        stream: true,
        messages,
        temperature,
        max_completion_tokens: this.promptWindowLimit(),
      }),
      messages
    );
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
  } catch (e) {
    return providedBasePath;
  }
}

module.exports = {
  FoundryLLM,
  parseFoundryBasePath,
};
