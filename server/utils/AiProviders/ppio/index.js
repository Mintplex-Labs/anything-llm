const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
  handleDefaultStreamResponseV2,
} = require("../../helpers/chat/responses");
const fs = require("fs");
const path = require("path");
const { safeJsonParse } = require("../../http");
const {
  LLMPerformanceMonitor,
} = require("../../helpers/chat/LLMPerformanceMonitor");
const cacheFolder = path.resolve(
  process.env.STORAGE_DIR
    ? path.resolve(process.env.STORAGE_DIR, "models", "ppio")
    : path.resolve(__dirname, `../../../storage/models/ppio`)
);

class PPIOLLM {
  constructor(embedder = null, modelPreference = null) {
    if (!process.env.PPIO_API_KEY) throw new Error("No PPIO API key was set.");

    const { OpenAI: OpenAIApi } = require("openai");
    this.basePath = "https://api.ppinfra.com/v3/openai/";
    this.openai = new OpenAIApi({
      baseURL: this.basePath,
      apiKey: process.env.PPIO_API_KEY ?? null,
      defaultHeaders: {
        "HTTP-Referer": "https://anythingllm.com",
        "X-API-Source": "anythingllm",
      },
    });
    this.model =
      modelPreference ||
      process.env.PPIO_MODEL_PREF ||
      "qwen/qwen2.5-32b-instruct";
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

    this.log(`Loaded with model: ${this.model}`);
  }

  log(text, ...args) {
    console.log(`\x1b[36m[${this.constructor.name}]\x1b[0m ${text}`, ...args);
  }

  async #syncModels() {
    if (fs.existsSync(this.cacheModelPath) && !this.#cacheIsStale())
      return false;

    this.log("Model cache is not present or stale. Fetching from PPIO API.");
    await fetchPPIOModels();
    return;
  }

  #cacheIsStale() {
    const MAX_STALE = 6.048e8; // 1 Week in MS
    if (!fs.existsSync(this.cacheAtPath)) return true;
    const now = Number(new Date());
    const timestampMs = Number(fs.readFileSync(this.cacheAtPath));
    return now - timestampMs > MAX_STALE;
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

  promptWindowLimit() {
    const model = this.models()[this.model];
    if (!model) return 4096; // Default to 4096 if we cannot find the model
    return model?.maxLength || 4096;
  }

  async isValidChatCompletionModel(model = "") {
    await this.#syncModels();
    const availableModels = this.models();
    return Object.prototype.hasOwnProperty.call(availableModels, model);
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

  constructPrompt({
    systemPrompt = "",
    contextTexts = [],
    chatHistory = [],
    userPrompt = "",
    // attachments = [], - not supported
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
        `PPIO chat: ${this.model} is not valid for chat completion!`
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
      !Object.prototype.hasOwnProperty.call(result.output, "choices") ||
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
        `PPIO chat: ${this.model} is not valid for chat completion!`
      );

    const measuredStreamRequest = await LLMPerformanceMonitor.measureStream(
      this.openai.chat.completions.create({
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

async function fetchPPIOModels() {
  return await fetch(`https://api.ppinfra.com/v3/openai/models`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.PPIO_API_KEY}`,
    },
  })
    .then((res) => res.json())
    .then(({ data = [] }) => {
      const models = {};
      data.forEach((model) => {
        const organization = model.id?.split("/")?.[0] || "PPIO";
        models[model.id] = {
          id: model.id,
          name: model.display_name || model.title || model.id,
          organization,
          maxLength: model.context_size || 4096,
        };
      });

      if (!fs.existsSync(cacheFolder))
        fs.mkdirSync(cacheFolder, { recursive: true });
      fs.writeFileSync(
        path.resolve(cacheFolder, "models.json"),
        JSON.stringify(models),
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
      return models;
    })
    .catch((e) => {
      console.error(e);
      return {};
    });
}

module.exports = {
  PPIOLLM,
  fetchPPIOModels,
};
