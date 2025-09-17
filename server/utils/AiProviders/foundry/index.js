const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
  LLMPerformanceMonitor,
} = require("../../helpers/chat/LLMPerformanceMonitor");
const {
  handleDefaultStreamResponseV2,
  formatChatHistory,
} = require("../../helpers/chat/responses");

let manager;
const modelInfoCache = {};

class FoundryLLM {
  #modelInfo = null;
  constructor(embedder = null, modelPreference = null) {
    if (!manager) {
      const { FoundryLocalManager } = require("foundry-local-sdk");
      manager = new FoundryLocalManager();
    }
    this.model = modelPreference ?? process.env.FOUNDRY_MODEL_PREF ?? null;
    if (!this.model) throw new Error("Foundry must have a valid model set.");

    this.embedder = embedder ?? new NativeEmbedder();
    this.defaultTemp = 0.7;
    this.log(`Model preference set to: ${this.model}`);
  }

  async #initialize() {
    if (modelInfoCache.hasOwnProperty(this.model)) {
      this.#modelInfo = modelInfoCache[this.model];
      return;
    }

    this.log(`Initializing model ${this.model}...`);

    await manager.init();
    try {
      const cachedModels = await manager.listCachedModels();
      const isDownloaded = cachedModels.some(
        (model) => model.alias === this.model || model.id.includes(this.model)
      );

      if (!isDownloaded) {
        this.log(`Model ${this.model} not found in cache, downloading...`);
        await manager.downloadModel(this.model, null, false, (progress) => {
          if (progress) {
            this.log(
              `${this.model} Download progress: ${progress.toFixed(1)}%`
            );
          }
        });
        this.log(`Model ${this.model} download completed`);
      }
    } catch (error) {
      this.log(`Download check failed: ${error.message}`);
    }

    // The foundry sdk provides us access to listCachedModels and listCatalogModels
    // but does not include the token limits for the model.
    // The OpenAI compat endpoint shows all models downloaded and their token limits.
    const sdkModelInfo = await manager.loadModel(this.model);
    const models = await this.openai.models.list();
    const modelData = models.data.find((model) => model.id === sdkModelInfo.id);

    if (!modelData) {
      throw new Error(
        `Could not find OpenAI model info for ${sdkModelInfo.id}`
      );
    }

    this.#modelInfo = modelData;
    modelInfoCache[this.model] = modelData;
    this.log(
      `Model ${this.model} initialized with ${modelData.maxInputTokens} input tokens, ${modelData.maxOutputTokens} output tokens`
    );
  }

  get openai() {
    const { OpenAI: OpenAIApi } = require("openai");
    return new OpenAIApi({
      baseURL: manager.endpoint,
      apiKey: manager.apiKey,
    });
  }

  log(text, ...args) {
    console.log(`\x1b[36m[${this.constructor.name}]\x1b[0m ${text}`, ...args);
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
    return true;
  }

  promptWindowLimit() {
    if (!this.#modelInfo) {
      return 4096;
    }

    const limit = this.#modelInfo.maxInputTokens || 4096;
    this.log(`Context window size is ${limit} tokens.`);
    return Number(limit);
  }

  isValidChatCompletionModel() {
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
          detail: "high",
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
    await this.#initialize();
    const result = await LLMPerformanceMonitor.measureAsyncFunction(
      this.openai.chat.completions
        .create({
          model: this.#modelInfo.id,
          messages,
          temperature,
          max_tokens: this.#modelInfo.maxOutputTokens || 1024,
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
        prompt_tokens: result.output?.usage?.prompt_tokens || 0,
        completion_tokens: result.output?.usage?.completion_tokens || 0,
        total_tokens: result.output?.usage?.total_tokens || 0,
        outputTps:
          (result.output?.usage?.completion_tokens || 0) / result.duration,
        duration: result.duration,
      },
    };
  }

  async streamGetChatCompletion(messages = null, { temperature = 0.7 }) {
    await this.#initialize();
    const measuredStreamRequest = await LLMPerformanceMonitor.measureStream(
      this.openai.chat.completions.create({
        model: this.#modelInfo.id,
        stream: true,
        messages,
        temperature,
        max_tokens: this.#modelInfo.maxOutputTokens || 1024,
      }),
      messages
      // runPromptTokenCalculation: true - There is not way to know if the generic provider connected is returning
      // the correct usage metrics if any at all since any provider could be connected.
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
    await this.#initialize();
    const { messageArrayCompressor } = require("../../helpers/chat");
    const messageArray = this.constructPrompt(promptArgs);
    return await messageArrayCompressor(this, messageArray, rawHistory);
  }
}

module.exports = {
  FoundryLLM,
};
