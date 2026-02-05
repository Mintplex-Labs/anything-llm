const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
  handleDefaultStreamResponseV2,
  formatChatHistory,
} = require("../../helpers/chat/responses");
const {
  LLMPerformanceMonitor,
} = require("../../helpers/chat/LLMPerformanceMonitor");

class PrivatemodeLLM {
  static contextWindows = {
    "leon-se/gemma-3-27b-it-fp8-dynamic": 128000,
    "gemma-3-27b": 128000,
    "qwen3-coder-30b-a3b": 128000,
    "gpt-oss-120b": 128000,
    "openai/gpt-oss-120b": 128000,
  };

  constructor(embedder = null, modelPreference = null) {
    if (!process.env.PRIVATEMODE_LLM_BASE_PATH)
      throw new Error("No Privatemode Base Path was set.");

    this.className = "PrivatemodeLLM";
    const { OpenAI: OpenAIApi } = require("openai");
    this.client = new OpenAIApi({
      baseURL: PrivatemodeLLM.parseBasePath(),
      apiKey: null,
    });

    this.model = modelPreference || process.env.PRIVATEMODE_LLM_MODEL_PREF;
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };

    this.embedder = embedder ?? new NativeEmbedder();
    this.defaultTemp = 0.7;
    this.log(
      `Privatemode LLM initialized with ${this.model}. ctx: ${this.promptWindowLimit()}`
    );
  }

  /**
   * Parse the base path for the Privatemode API
   * so we can use it for inference requests
   * @param {string} providedBasePath
   * @returns {string}
   */
  static parseBasePath(
    providedBasePath = process.env.PRIVATEMODE_LLM_BASE_PATH
  ) {
    try {
      const baseURL = new URL(providedBasePath);
      const basePath = `${baseURL.origin}/v1`;
      return basePath;
    } catch (e) {
      return null;
    }
  }

  log(text, ...args) {
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

  static promptWindowLimit(_modelName) {
    const limit = PrivatemodeLLM.contextWindows[_modelName] || 16384;
    return Number(limit);
  }

  promptWindowLimit() {
    const limit = PrivatemodeLLM.contextWindows[this.model] || 16384;
    return Number(limit);
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
    if (!attachments.length) return userPrompt;

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
        `Privatemode chat: ${this.model} is not valid or defined model for chat completion!`
      );

    const result = await LLMPerformanceMonitor.measureAsyncFunction(
      this.client.chat.completions.create({
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
        model: this.model,
        provider: this.className,
        timestamp: new Date(),
      },
    };
  }

  async streamGetChatCompletion(messages = null, { temperature = 0.7 }) {
    if (!this.model)
      throw new Error(
        `Privatemode chat: ${this.model} is not valid or defined model for chat completion!`
      );

    const measuredStreamRequest = await LLMPerformanceMonitor.measureStream({
      func: this.client.chat.completions.create({
        model: this.model,
        stream: true,
        messages,
        temperature,
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

module.exports = {
  PrivatemodeLLM,
};
