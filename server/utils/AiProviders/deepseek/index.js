const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
  LLMPerformanceMonitor,
} = require("../../helpers/chat/LLMPerformanceMonitor");
const {
  handleDefaultStreamResponseV2,
} = require("../../helpers/chat/responses");
const { MODEL_MAP } = require("../modelMap");

class DeepSeekLLM {
  constructor(embedder = null, modelPreference = null) {
    if (!process.env.DEEPSEEK_API_KEY)
      throw new Error("No DeepSeek API key was set.");
    const { OpenAI: OpenAIApi } = require("openai");

    this.openai = new OpenAIApi({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: "https://api.deepseek.com/v1",
    });
    this.model =
      modelPreference || process.env.DEEPSEEK_MODEL_PREF || "deepseek-chat";
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
    return MODEL_MAP.deepseek[modelName] ?? 8192;
  }

  promptWindowLimit() {
    return MODEL_MAP.deepseek[this.model] ?? 8192;
  }

  async isValidChatCompletionModel(modelName = "") {
    const models = await this.openai.models.list().catch(() => ({ data: [] }));
    return models.data.some((model) => model.id === modelName);
  }

  constructPrompt({
    systemPrompt = "",
    contextTexts = [],
    chatHistory = [],
    userPrompt = "",
  }) {
    const prompt = {
      role: "system",
      content: `${systemPrompt}${this.#appendContext(contextTexts)}`,
    };
    return [prompt, ...chatHistory, { role: "user", content: userPrompt }];
  }

  async getChatCompletion(messages = null, { temperature = 0.7 }) {
    if (!(await this.isValidChatCompletionModel(this.model)))
      throw new Error(
        `DeepSeek chat: ${this.model} is not valid for chat completion!`
      );

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
    if (!(await this.isValidChatCompletionModel(this.model)))
      throw new Error(
        `DeepSeek chat: ${this.model} is not valid for chat completion!`
      );

    const measuredStreamRequest = await LLMPerformanceMonitor.measureStream(
      this.openai.chat.completions.create({
        model: this.model,
        stream: true,
        messages,
        temperature,
      }),
      messages,
      false
    );

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
    const { messageArrayCompressor } = require("../../helpers/chat");
    const messageArray = this.constructPrompt(promptArgs);
    return await messageArrayCompressor(this, messageArray, rawHistory);
  }
}

module.exports = {
  DeepSeekLLM,
};
