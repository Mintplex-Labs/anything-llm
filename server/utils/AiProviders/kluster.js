const KlusterProvider = require("../agents/aibitat/providers/kluster");
const { BaseLLM } = require("./base");
const { MODEL_MAP } = require("./modelMap");
const {
  handleDefaultStreamResponseV2,
  formatChatHistory,
} = require("../helpers/chat/responses");
const {
  LLMPerformanceMonitor,
} = require("../helpers/chat/LLMPerformanceMonitor");
const { messageArrayCompressor } = require("../helpers/chat");

class KlusterLLM extends BaseLLM {
  static provider = "kluster";
  static models = [
    "klusterai/Meta-Llama-3.3-70B-Instruct-Turbo",
    "klusterai/Meta-Llama-3.1-8B-Instruct-Turbo",
    "meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8",
    "meta-llama/Llama-4-Scout-17B-16E-Instruct",
    "deepseek-ai/DeepSeek-R1",
    "deepseek-ai/DeepSeek-V3-0324",
    "google/gemma-3-27b-it",
    "Qwen/Qwen2.5-VL-7B-Instruct",
  ];

  constructor(embedder, model = null) {
    super(embedder, model);
    this.model = model || KlusterLLM.models[0];
    this.provider = new KlusterProvider({
      model: this.model,
    });
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };
    this.defaultTemp = 0.7;
  }

  static promptWindowLimit(modelName) {
    return MODEL_MAP.kluster?.[modelName] ?? 8192; // Default to 8k tokens if not specified
  }

  promptWindowLimit() {
    return KlusterLLM.promptWindowLimit(this.model);
  }

  streamingEnabled() {
    return true;
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

  constructPrompt({
    systemPrompt = "",
    contextTexts = [],
    chatHistory = [],
    userPrompt = "",
    attachments = [],
  }) {
    return [
      {
        role: "system",
        content: `${systemPrompt}${this.#appendContext(contextTexts)}`,
      },
      ...formatChatHistory(chatHistory),
      {
        role: "user",
        content: userPrompt,
      },
    ];
  }

  async compressMessages(promptArgs = {}, rawHistory = []) {
    const messages = this.constructPrompt(promptArgs);
    return await messageArrayCompressor(this, messages, rawHistory);
  }

  async embedTextInput(textInput) {
    return await this.embedder.embedTextInput(textInput);
  }

  async embedChunks(textChunks = []) {
    return await this.embedder.embedChunks(textChunks);
  }

  async getChatCompletion(messages = [], { temperature = 0.7 } = {}) {
    const result = await LLMPerformanceMonitor.measureAsyncFunction(
      this.provider.complete(messages, [], { temperature })
    );

    return {
      textResponse: result.output,
      metrics: {
        prompt_tokens: 0, // Kluster doesn't provide token counts
        completion_tokens: 0,
        total_tokens: 0,
        outputTps: 0,
        duration: result.duration,
      },
    };
  }

  async streamGetChatCompletion(messages = [], { temperature = 0.7 } = {}) {
    const stream = await this.provider.complete(messages, [], {
      stream: true,
      temperature,
    });
    const measuredStreamRequest = await LLMPerformanceMonitor.measureStream(
      stream,
      messages
    );
    return measuredStreamRequest;
  }

  handleStream(response, stream, responseProps) {
    return handleDefaultStreamResponseV2(response, stream, responseProps);
  }

  async getEmbedding(text) {
    return await this.embedder.getEmbedding(text);
  }
}

module.exports = {
  KlusterLLM,
};
