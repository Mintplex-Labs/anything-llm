const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
  LLMPerformanceMonitor,
} = require("../../helpers/chat/LLMPerformanceMonitor");
const {
  handleDefaultStreamResponseV2,
  formatChatHistory,
} = require("../../helpers/chat/responses");
const fs = require("fs");
const path = require("path");
const { safeJsonParse } = require("../../http");

const cacheFolder = path.resolve(
  process.env.STORAGE_DIR
    ? path.resolve(process.env.STORAGE_DIR, "models", "aimlapi")
    : path.resolve(__dirname, `../../../storage/models/aimlapi`)
);
const embedCacheFolder = path.resolve(cacheFolder, "embeddings");

class AimlApiLLM {
  static BASE_URL = "https://api.aimlapi.com/v1";
  static HEADERS = {
    "HTTP-Referer": "https://anythingllm.com/",
    "X-Title": "anything",
  };
  constructor(embedder = null, modelPreference = null) {
    if (!process.env.AIML_LLM_API_KEY)
      throw new Error("No AI/ML API key was set.");
    const { OpenAI: OpenAIApi } = require("openai");
    this.openai = new OpenAIApi({
      apiKey: process.env.AIML_LLM_API_KEY,
      baseURL: AimlApiLLM.BASE_URL,
      defaultHeaders: AimlApiLLM.HEADERS,
    });
    this.model =
      modelPreference || process.env.AIML_MODEL_PREF || "gpt-3.5-turbo";
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };

    if (!fs.existsSync(cacheFolder))
      fs.mkdirSync(cacheFolder, { recursive: true });
    this.cacheModelPath = path.resolve(cacheFolder, "models.json");
    this.cacheAtPath = path.resolve(cacheFolder, ".cached_at");

    this.embedder = embedder ?? new NativeEmbedder();
    this.defaultTemp = 0.7;
    this.log(
      `Initialized ${this.model} with context window ${this.promptWindowLimit()}`
    );
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

  async #syncModels() {
    if (fs.existsSync(this.cacheModelPath) && !this.#cacheIsStale())
      return false;
    this.log("Model cache is not present or stale. Fetching from AimlApi API.");
    await fetchAimlApiModels();
    return;
  }

  #cacheIsStale() {
    const MAX_STALE = 6.048e8; // 1 Week in MS
    if (!fs.existsSync(this.cacheAtPath)) return true;
    const now = Number(new Date());
    const timestampMs = Number(fs.readFileSync(this.cacheAtPath));
    return now - timestampMs > MAX_STALE;
  }

  models() {
    if (!fs.existsSync(this.cacheModelPath)) return {};
    return safeJsonParse(
      fs.readFileSync(this.cacheModelPath, { encoding: "utf-8" }),
      {}
    );
  }

  streamingEnabled() {
    return "streamGetChatCompletion" in this;
  }

  static promptWindowLimit(modelName) {
    const cacheModelPath = path.resolve(cacheFolder, "models.json");
    const availableModels = fs.existsSync(cacheModelPath)
      ? safeJsonParse(
          fs.readFileSync(cacheModelPath, { encoding: "utf-8" }),
          {}
        )
      : {};
    return availableModels[modelName]?.maxLength || 4096;
  }

  promptWindowLimit() {
    const availableModels = this.models();
    return availableModels[this.model]?.maxLength || 4096;
  }

  async isValidChatCompletionModel(modelName = "") {
    await this.#syncModels();
    const availableModels = this.models();
    return Object.prototype.hasOwnProperty.call(availableModels, modelName);
  }

  #generateContent({ userPrompt, attachments = [] }) {
    if (!attachments.length) return userPrompt;

    const content = [{ type: "text", text: userPrompt }];
    for (let attachment of attachments) {
      content.push({
        type: "image_url",
        image_url: { url: attachment.contentString, detail: "high" },
      });
    }
    return content.flat();
  }

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
    if (!(await this.isValidChatCompletionModel(this.model)))
      throw new Error(
        `AI/ML API chat: ${this.model} is not valid for chat completion!`
      );

    const result = await LLMPerformanceMonitor.measureAsyncFunction(
      this.openai.chat.completions.create({
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
        `AI/ML API chat: ${this.model} is not valid for chat completion!`
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

async function fetchAimlApiModels(providedApiKey = null) {
  const apiKey = providedApiKey || process.env.AIML_LLM_API_KEY || null;
  return await fetch(`${AimlApiLLM.BASE_URL}/models`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      ...AimlApiLLM.HEADERS,
    },
  })
    .then((res) => res.json())
    .then(({ data = [] }) => {
      const models = {};
      data
        .filter((m) => m.type === "chat-completion")
        .forEach((model) => {
          const developer =
            model.info?.developer ||
            model.provider ||
            model.id?.split("/")[0] ||
            "AimlApi";
          models[model.id] = {
            id: model.id,
            name: model.name || model.id,
            developer: developer.charAt(0).toUpperCase() + developer.slice(1),
            maxLength: model.context_length || model.max_tokens || 4096,
          };
        });

      if (!fs.existsSync(cacheFolder))
        fs.mkdirSync(cacheFolder, { recursive: true });
      fs.writeFileSync(
        path.resolve(cacheFolder, "models.json"),
        JSON.stringify(models),
        { encoding: "utf-8" }
      );
      fs.writeFileSync(
        path.resolve(cacheFolder, ".cached_at"),
        String(Number(new Date())),
        { encoding: "utf-8" }
      );

      return models;
    })
    .catch((e) => {
      console.error(e);
      return {};
    });
}

async function fetchAimlApiEmbeddingModels(providedApiKey = null) {
  const apiKey = providedApiKey || process.env.AIML_EMBEDDER_API_KEY || null;
  return await fetch(`${AimlApiLLM.BASE_URL}/models`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      ...AimlApiLLM.HEADERS,
    },
  })
    .then((res) => res.json())
    .then(({ data = [] }) => {
      const models = {};
      data
        .filter((m) => m.type === "embedding")
        .forEach((model) => {
          const developer =
            model.info?.developer ||
            model.provider ||
            model.id?.split("/")[0] ||
            "AimlApi";
          models[model.id] = {
            id: model.id,
            name: model.name || model.id,
            developer: developer.charAt(0).toUpperCase() + developer.slice(1),
            maxLength: model.context_length || model.max_tokens || 4096,
          };
        });

      if (!fs.existsSync(embedCacheFolder))
        fs.mkdirSync(embedCacheFolder, { recursive: true });
      fs.writeFileSync(
        path.resolve(embedCacheFolder, "models.json"),
        JSON.stringify(models),
        { encoding: "utf-8" }
      );
      fs.writeFileSync(
        path.resolve(embedCacheFolder, ".cached_at"),
        String(Number(new Date())),
        { encoding: "utf-8" }
      );

      return models;
    })
    .catch((e) => {
      console.error(e);
      return {};
    });
}

module.exports = {
  AimlApiLLM,
  fetchAimlApiModels,
  fetchAimlApiEmbeddingModels,
};
