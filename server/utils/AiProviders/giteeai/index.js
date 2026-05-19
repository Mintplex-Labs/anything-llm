const fs = require("fs");
const path = require("path");
const { safeJsonParse, toValidNumber } = require("../../http");
const LEGACY_MODEL_MAP = require("../modelMap/legacy");
const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
  LLMPerformanceMonitor,
} = require("../../helpers/chat/LLMPerformanceMonitor");
const {
  handleDefaultStreamResponseV2,
} = require("../../helpers/chat/responses");
const cacheFolder = path.resolve(
  process.env.STORAGE_DIR
    ? path.resolve(process.env.STORAGE_DIR, "models", "giteeai")
    : path.resolve(__dirname, `../../../storage/models/giteeai`)
);

class GiteeAILLM {
  constructor(embedder = null, modelPreference = null) {
    if (!process.env.GITEE_AI_API_KEY)
      throw new Error("No Gitee AI API key was set.");
    const { OpenAI: OpenAIApi } = require("openai");

    this.className = "GiteeAILLM";
    this.openai = new OpenAIApi({
      apiKey: process.env.GITEE_AI_API_KEY,
      baseURL: "https://ai.gitee.com/v1",
    });
    this.model = modelPreference || process.env.GITEE_AI_MODEL_PREF || "";
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };

    this.embedder = embedder ?? new NativeEmbedder();
    this.defaultTemp = 0.7;

    if (!fs.existsSync(cacheFolder))
      fs.mkdirSync(cacheFolder, { recursive: true });
    this.cacheModelPath = path.resolve(cacheFolder, "models.json");
    this.cacheAtPath = path.resolve(cacheFolder, ".cached_at");
    this.log("Initialized with model:", this.model);
  }

  log(text, ...args) {
    console.log(`\x1b[36m[${this.constructor.name}]\x1b[0m ${text}`, ...args);
  }

  models() {
    if (!fs.existsSync(this.cacheModelPath)) return {};
    return safeJsonParse(
      fs.readFileSync(this.cacheModelPath, { encoding: "utf-8" }),
      {}
    );
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

  static promptWindowLimit(model) {
    return (
      toValidNumber(process.env.GITEE_AI_MODEL_TOKEN_LIMIT) ||
      LEGACY_MODEL_MAP.giteeai[model] ||
      8192
    );
  }

  promptWindowLimit() {
    return (
      toValidNumber(process.env.GITEE_AI_MODEL_TOKEN_LIMIT) ||
      LEGACY_MODEL_MAP.giteeai[this.model] ||
      8192
    );
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

  /**
   * Parses and prepends reasoning from the response and returns the full text response.
   * @param {Object} response
   * @returns {string}
   */
  #parseReasoningFromResponse({ message }) {
    let textResponse = message?.content;
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
        `Invalid response body returned from GiteeAI: ${JSON.stringify(result.output)}`
      );

    return {
      textResponse: this.#parseReasoningFromResponse(result.output.choices[0]),
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
    const measuredStreamRequest = await LLMPerformanceMonitor.measureStream({
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

async function giteeAiModels() {
  const url = new URL("https://ai.gitee.com/v1/models");
  url.searchParams.set("type", "text2text");
  return await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GITEE_AI_API_KEY}`,
    },
  })
    .then((res) => res.json())
    .then(({ data = [] }) => data)
    .then((models = []) => {
      const validModels = {};
      models.forEach(
        (model) =>
          (validModels[model.id] = {
            id: model.id,
            name: model.id,
            organization: model.owned_by,
          })
      );
      // Cache all response information
      if (!fs.existsSync(cacheFolder))
        fs.mkdirSync(cacheFolder, { recursive: true });
      fs.writeFileSync(
        path.resolve(cacheFolder, "models.json"),
        JSON.stringify(validModels),
        {
          encoding: "utf-8",
        }
      );
      fs.writeFileSync(
        path.resolve(cacheFolder, ".cached_at"),
        String(Number(new Date())),
        {
          encoding: "utf-8",
        }
      );

      return validModels;
    })
    .catch((e) => {
      console.error(e);
      return {};
    });
}

module.exports = {
  GiteeAILLM,
  giteeAiModels,
};
