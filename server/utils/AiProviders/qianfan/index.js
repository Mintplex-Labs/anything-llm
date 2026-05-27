const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
  LLMPerformanceMonitor,
} = require("../../helpers/chat/LLMPerformanceMonitor");
const {
  handleDefaultStreamResponseV2,
} = require("../../helpers/chat/responses");
const { MODEL_MAP } = require("../modelMap");
const LEGACY_MODEL_MAP = require("../modelMap/legacy");

const QIANFAN_BASE_URL = "https://qianfan.baidubce.com/v2";
const QIANFAN_DEFAULT_MODEL = "ernie-4.5-turbo-128k";
const QIANFAN_FALLBACK_MODELS = [
  "ernie-4.5-turbo-128k",
  "ernie-4.5-turbo-32k",
  "ernie-4.5-turbo-latest",
  "ernie-4.0-turbo-128k",
  "ernie-4.0-turbo-8k-latest",
  "ernie-4.0-8k",
  "ernie-3.5-128k",
  "ernie-3.5-8k",
  "ernie-speed-pro-128k",
  "ernie-lite-pro-128k",
  "ernie-x1-32k",
  "ernie-x1-turbo-32k",
];

class QianfanLLM {
  constructor(embedder = null, modelPreference = null) {
    if (!process.env.QIANFAN_API_KEY)
      throw new Error("No Qianfan API key was set.");
    const { OpenAI: OpenAIApi } = require("openai");
    this.className = "QianfanLLM";

    this.openai = new OpenAIApi({
      baseURL: QIANFAN_BASE_URL,
      apiKey: process.env.QIANFAN_API_KEY,
    });
    this.model =
      modelPreference ||
      process.env.QIANFAN_MODEL_PREF ||
      QIANFAN_DEFAULT_MODEL;
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };

    this.embedder = embedder ?? new NativeEmbedder();
    this.defaultTemp = 0.7;
    this.log(
      `Initialized ${this.model} with context window ${this.promptWindowLimit()}`
    );
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

  static promptWindowLimit(modelName) {
    return (
      MODEL_MAP.get("qianfan", modelName) ??
      LEGACY_MODEL_MAP.qianfan[modelName] ??
      8_192
    );
  }

  promptWindowLimit() {
    return this.constructor.promptWindowLimit(this.model);
  }

  async isValidChatCompletionModel(_modelName = "") {
    return true;
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
      !result?.output?.hasOwnProperty("choices") ||
      result?.output?.choices?.length === 0
    )
      throw new Error(
        `Invalid response body returned from Qianfan: ${JSON.stringify(result.output)}`
      );

    return {
      textResponse: result.output.choices[0].message.content,
      metrics: {
        prompt_tokens: result.output.usage.prompt_tokens || 0,
        completion_tokens: result.output.usage.completion_tokens || 0,
        total_tokens: result.output.usage.total_tokens || 0,
        outputTps: result.output.usage.completion_tokens / result.duration,
        duration: result.duration,
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
      runPromptTokenCalculation: true,
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

async function qianfanModels(_apiKey = null) {
  const apiKey =
    _apiKey === true
      ? process.env.QIANFAN_API_KEY
      : _apiKey || process.env.QIANFAN_API_KEY || null;

  const models = await fetch(`${QIANFAN_BASE_URL}/models`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
  })
    .then((res) => res.json())
    .then(({ data = [] }) =>
      data.map((model) => ({
        id: model.id,
        name: model.id,
        organization: model.owned_by || "baidu-qianfan",
      }))
    )
    .catch((e) => {
      console.error(`Qianfan:listModels`, e.message);
      return QIANFAN_FALLBACK_MODELS.map((model) => ({
        id: model,
        name: model,
        organization: "baidu-qianfan",
      }));
    });

  if (models.length > 0 && !!apiKey) process.env.QIANFAN_API_KEY = apiKey;
  return models;
}

module.exports = {
  QianfanLLM,
  qianfanModels,
  QIANFAN_DEFAULT_MODEL,
};
