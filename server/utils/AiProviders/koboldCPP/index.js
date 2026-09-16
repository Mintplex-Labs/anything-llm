const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
  handleDefaultStreamResponseV2,
  formatChatHistory,
} = require("../../helpers/chat/responses");
const {
  LLMPerformanceMonitor,
} = require("../../helpers/chat/LLMPerformanceMonitor");

class KoboldCPPLLM {
  static contextWindowSize = null;

  constructor(embedder = null, modelPreference = null) {
    const { OpenAI: OpenAIApi } = require("openai");
    if (!process.env.KOBOLD_CPP_BASE_PATH)
      throw new Error(
        "KoboldCPP must have a valid base path to use for the api."
      );

    this.className = "KoboldCPPLLM";
    this.basePath = process.env.KOBOLD_CPP_BASE_PATH;
    this.openai = new OpenAIApi({
      baseURL: this.basePath,
      apiKey: null,
    });
    this.model = modelPreference ?? process.env.KOBOLD_CPP_MODEL_PREF ?? null;
    if (!this.model) throw new Error("KoboldCPP must have a valid model set.");

    this.embedder = embedder ?? new NativeEmbedder();
    this.defaultTemp = 0.7;
    this.maxTokens = process.env.KOBOLD_CPP_MAX_TOKENS
      ? Number(process.env.KOBOLD_CPP_MAX_TOKENS)
      : null;

    this.limits = null;
    KoboldCPPLLM.cacheContextWindow();
    this.log(
      `Inference API: ${this.basePath} Model: ${this.model} Context Window: ${this.promptWindowLimit()}`
    );
  }

  log(text, ...args) {
    console.log(`\x1b[36m[${this.className}]\x1b[0m ${text}`, ...args);
  }

  static async cacheContextWindow() {
    if (KoboldCPPLLM.contextWindowSize !== null) return;
    try {
      const basePath = process.env.KOBOLD_CPP_BASE_PATH;
      if (!basePath) return;
      const origin = new URL(basePath).origin;
      const res = await fetch(`${origin}/api/extra/true_max_context_length`);
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      if (data?.value && !isNaN(Number(data.value))) {
        KoboldCPPLLM.contextWindowSize = Number(data.value);
        console.log(
          `\x1b[36m[KoboldCPPLLM]\x1b[0m Context window cached: ${KoboldCPPLLM.contextWindowSize}`
        );
      }
    } catch (e) {
      console.log(
        `\x1b[36m[KoboldCPPLLM]\x1b[0m Could not cache context window: ${e.message}`
      );
    }
  }

  async assertModelContextLimits() {
    if (this.limits !== null) return;
    await KoboldCPPLLM.cacheContextWindow();
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };
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
    const userLimit = process.env.KOBOLD_CPP_MODEL_TOKEN_LIMIT;
    if (userLimit && !isNaN(Number(userLimit)) && Number(userLimit) > 0) {
      const systemLimit = KoboldCPPLLM.contextWindowSize;
      if (systemLimit) return Math.min(Number(userLimit), systemLimit);
      return Number(userLimit);
    }
    return KoboldCPPLLM.contextWindowSize || 16384;
  }

  promptWindowLimit() {
    return this.constructor.promptWindowLimit(this.model);
  }

  isValidChatCompletionModel(_modelName = "") {
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
      this.openai.chat.completions
        .create({
          model: this.model,
          messages,
          temperature,
          ...(this.maxTokens ? { max_tokens: this.maxTokens } : {}),
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
      textResponse: this.#parseReasoningFromResponse(result.output.choices[0]),
      metrics: {
        prompt_tokens: result.output.usage?.prompt_tokens || 0,
        completion_tokens: result.output.usage?.completion_tokens || 0,
        total_tokens: result.output.usage?.total_tokens || 0,
        outputTps:
          (result.output.usage?.completion_tokens || 0) / result.duration,
        duration: result.duration,
        model: this.model,
        provider: this.className,
        timestamp: new Date(),
      },
    };
  }

  async streamGetChatCompletion(messages = null, { temperature = 0.7 }) {
    const measuredStreamRequest = await LLMPerformanceMonitor.measureStream({
      func: this.openai.chat.completions.create({
        model: this.model,
        stream: true,
        messages,
        temperature,
        ...(this.maxTokens ? { max_tokens: this.maxTokens } : {}),
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
  KoboldCPPLLM,
};
