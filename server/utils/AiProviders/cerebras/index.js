const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
  LLMPerformanceMonitor,
} = require("../../helpers/chat/LLMPerformanceMonitor");
const {
  handleDefaultStreamResponseV2,
} = require("../../helpers/chat/responses");
const { MODEL_MAP } = require("../modelMap");

const CEREBRAS_BASE_URL = "https://api.cerebras.ai/v1";
const DEFAULT_CEREBRAS_MODEL = "gpt-oss-120b";
const DEFAULT_CONTEXT_WINDOW = 131072;

class CerebrasLLM {
  constructor(embedder = null, modelPreference = null) {
    if (!process.env.CEREBRAS_API_KEY)
      throw new Error("No Cerebras API key was set.");

    const { OpenAI: OpenAIApi } = require("openai");
    this.className = "CerebrasLLM";
    this.openai = new OpenAIApi({
      baseURL: CEREBRAS_BASE_URL,
      apiKey: process.env.CEREBRAS_API_KEY,
    });
    this.model =
      modelPreference ||
      process.env.CEREBRAS_MODEL_PREF ||
      DEFAULT_CEREBRAS_MODEL;
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };
    this.embedder = embedder ?? new NativeEmbedder();
    this.defaultTemp = 0.7;
  }

  #appendContext(contextTexts = []) {
    if (!contextTexts || !contextTexts.length) return "";
    return (
      "\nContext:\n" +
      contextTexts
        .map((text, i) => `[CONTEXT ${i}]:\n${text}\n[END CONTEXT ${i}]\n\n`)
        .join("")
    );
  }

  streamingEnabled() {
    return "streamGetChatCompletion" in this;
  }

  static promptWindowLimit(modelName) {
    return MODEL_MAP.get("cerebras", modelName) ?? DEFAULT_CONTEXT_WINDOW;
  }

  promptWindowLimit() {
    return MODEL_MAP.get("cerebras", this.model) ?? DEFAULT_CONTEXT_WINDOW;
  }

  async isValidChatCompletionModel(modelName = "") {
    return !!modelName;
  }

  constructPrompt({
    systemPrompt = "",
    contextTexts = [],
    chatHistory = [],
    userPrompt = "",
  }) {
    return [
      {
        role: "system",
        content: `${systemPrompt}${this.#appendContext(contextTexts)}`,
      },
      ...chatHistory,
      { role: "user", content: userPrompt },
    ];
  }

  async getChatCompletion(messages = null, { temperature = 0.7 }) {
    const result = await LLMPerformanceMonitor.measureAsyncFunction(
      this.openai.chat.completions
        .create({
          model: this.model,
          messages,
          temperature,
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

    const completionTokens = result.output.usage?.completion_tokens || 0;
    const duration = result.duration || 0;
    const outputTps =
      result.output.usage?.total_tokens_per_sec ??
      (duration > 0 ? completionTokens / duration : 0);
    return {
      textResponse: result.output.choices[0].message.content,
      metrics: {
        prompt_tokens: result.output.usage?.prompt_tokens || 0,
        completion_tokens: completionTokens,
        total_tokens: result.output.usage?.total_tokens || 0,
        outputTps,
        duration,
        model: this.model,
        provider: this.className,
        timestamp: new Date(),
      },
    };
  }

  async streamGetChatCompletion(messages = null, { temperature = 0.7 }) {
    return await LLMPerformanceMonitor.measureStream({
      func: this.openai.chat.completions.create({
        model: this.model,
        stream: true,
        messages,
        temperature,
      }),
      messages,
      runPromptTokenCalculation: false,
      modelTag: this.model,
      provider: this.className,
    });
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
    const { messageArrayCompressor } = require("../../helpers/chat");
    const messageArray = this.constructPrompt(promptArgs);
    return await messageArrayCompressor(this, messageArray, rawHistory);
  }
}

module.exports = {
  CEREBRAS_BASE_URL,
  DEFAULT_CEREBRAS_MODEL,
  CerebrasLLM,
};
