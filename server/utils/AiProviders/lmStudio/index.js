const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
  handleDefaultStreamResponseV2,
  formatChatHistory,
} = require("../../helpers/chat/responses");
const {
  LLMPerformanceMonitor,
} = require("../../helpers/chat/LLMPerformanceMonitor");
const { OpenAI: OpenAIApi } = require("openai");

//  hybrid of openAi LLM chat completion for LMStudio
class LMStudioLLM {
  /** @see LMStudioLLM.cacheContextWindows */
  static modelContextWindows = {};

  constructor(embedder = null, modelPreference = null) {
    if (!process.env.LMSTUDIO_BASE_PATH)
      throw new Error("No LMStudio API Base Path was set.");

    this.lmstudio = new OpenAIApi({
      baseURL: parseLMStudioBasePath(process.env.LMSTUDIO_BASE_PATH), // here is the URL to your LMStudio instance
      apiKey: null,
    });

    // Prior to LMStudio 0.2.17 the `model` param was not required and you could pass anything
    // into that field and it would work. On 0.2.17 LMStudio introduced multi-model chat
    // which now has a bug that reports the server model id as "Loaded from Chat UI"
    // and any other value will crash inferencing. So until this is patched we will
    // try to fetch the `/models` and have the user set it, or just fallback to "Loaded from Chat UI"
    // which will not impact users with <v0.2.17 and should work as well once the bug is fixed.
    this.model =
      modelPreference ||
      process.env.LMSTUDIO_MODEL_PREF ||
      "Loaded from Chat UI";

    this.embedder = embedder ?? new NativeEmbedder();
    this.defaultTemp = 0.7;

    LMStudioLLM.cacheContextWindows(true).then(() => {
      this.limits = {
        history: this.promptWindowLimit() * 0.15,
        system: this.promptWindowLimit() * 0.15,
        user: this.promptWindowLimit() * 0.7,
      };
      this.#log(
        `initialized with\nmodel: ${this.model}\nn_ctx: ${this.promptWindowLimit()}`
      );
    });
  }

  #log(text, ...args) {
    console.log(`\x1b[32m[LMStudio]\x1b[0m ${text}`, ...args);
  }

  static #slog(text, ...args) {
    console.log(`\x1b[32m[LMStudio]\x1b[0m ${text}`, ...args);
  }

  /**
   * Cache the context windows for the LMStudio models.
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
      if (Object.keys(LMStudioLLM.modelContextWindows).length > 0 && !force)
        return;

      const endpoint = new URL(process.env.LMSTUDIO_BASE_PATH);
      endpoint.pathname = "/api/v0/models";
      await fetch(endpoint.toString())
        .then((res) => {
          if (!res.ok)
            throw new Error(`LMStudio:cacheContextWindows - ${res.statusText}`);
          return res.json();
        })
        .then(({ data: models }) => {
          models.forEach((model) => {
            if (model.type === "embeddings") return;
            LMStudioLLM.modelContextWindows[model.id] =
              model.max_context_length;
          });
        })
        .catch((e) => {
          LMStudioLLM.#slog(`Error caching context windows`, e);
          return;
        });

      LMStudioLLM.#slog(`Context windows cached for all models!`);
    } catch (e) {
      LMStudioLLM.#slog(`Error caching context windows`, e);
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
    let userDefinedLimit = null;
    const systemDefinedLimit =
      Number(this.modelContextWindows[modelName]) || 4096;

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

  async getChatCompletion(messages = null, { temperature = 0.7 }) {
    if (!this.model)
      throw new Error(
        `LMStudio chat: ${this.model} is not valid or defined model for chat completion!`
      );

    const result = await LLMPerformanceMonitor.measureAsyncFunction(
      this.lmstudio.chat.completions.create({
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
      textResponse: result.output.choices[0].message.content,
      metrics: {
        prompt_tokens: result.output.usage?.prompt_tokens || 0,
        completion_tokens: result.output.usage?.completion_tokens || 0,
        total_tokens: result.output.usage?.total_tokens || 0,
        outputTps: result.output.usage?.completion_tokens / result.duration,
        duration: result.duration,
      },
    };
  }

  async streamGetChatCompletion(messages = null, { temperature = 0.7 }) {
    if (!this.model)
      throw new Error(
        `LMStudio chat: ${this.model} is not valid or defined model for chat completion!`
      );

    const measuredStreamRequest = await LLMPerformanceMonitor.measureStream(
      this.lmstudio.chat.completions.create({
        model: this.model,
        stream: true,
        messages,
        temperature,
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
 * Parse the base path for the LMStudio API. Since the base path must end in /v1 and cannot have a trailing slash,
 * and the user can possibly set it to anything and likely incorrectly due to pasting behaviors, we need to ensure it is in the correct format.
 * @param {string} basePath
 * @returns {string}
 */
function parseLMStudioBasePath(providedBasePath = "") {
  try {
    const baseURL = new URL(providedBasePath);
    const basePath = `${baseURL.origin}/v1`;
    return basePath;
  } catch (e) {
    return providedBasePath;
  }
}

module.exports = {
  LMStudioLLM,
  parseLMStudioBasePath,
};
