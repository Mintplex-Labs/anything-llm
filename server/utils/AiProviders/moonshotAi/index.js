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
    ? path.resolve(process.env.STORAGE_DIR, "models", "moonshotai")
    : path.resolve(__dirname, `../../../storage/models/moonshotai`)
);

class MoonshotAiLLM {
  constructor(embedder = null, modelPreference = null) {
    if (!process.env.MOONSHOT_AI_API_KEY)
      throw new Error("No Moonshot AI API key was set.");
    const { OpenAI: OpenAIApi } = require("openai");

    this.openai = new OpenAIApi({
      baseURL: "https://api.moonshot.ai/v1",
      apiKey: process.env.MOONSHOT_AI_API_KEY,
    });
    this.model =
      modelPreference ||
      process.env.MOONSHOT_AI_MODEL_PREF ||
      "moonshot-v1-32k";
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

    this.log(
      `Initialized ${this.model} with context window ${this.promptWindowLimit()}`
    );
  }

  log(message) {
    console.log(`[Moonshot AI] ${message}`);
  }

  // This checks if the .cached_at file has a timestamp that is more than 1Week (in millis)
  // from the current date. If it is, then we will refetch the API so that all the models are up
  // to date.
  #cacheIsStale() {
    const MAX_STALE = 6.048e8; // 1 Week in MS
    if (!fs.existsSync(this.cacheAtPath)) return true;
    const now = Number(new Date());
    const timestampMs = Number(fs.readFileSync(this.cacheAtPath));
    return now - timestampMs > MAX_STALE;
  }

  // This function fetches the models from the Moonshot AI API and caches them locally.
  async #syncModels() {
    if (fs.existsSync(this.cacheModelPath) && !this.#cacheIsStale())
      return false;

    this.log(
      "Model cache is not present or stale. Fetching from Moonshot AI API."
    );
    await fetchMoonshotAiModels();
    return;
  }

  models() {
    if (!fs.existsSync(this.cacheModelPath)) return {};
    return safeJsonParse(
      fs.readFileSync(this.cacheModelPath, { encoding: "utf-8" }),
      {}
    );
  }

  streamingEnabled() {
    return true;
  }

  async isValidChatCompletionModel(model) {
    await this.#syncModels();
    const availableModels = this.models();
    return Object.prototype.hasOwnProperty.call(availableModels, model);
  }

  promptWindowLimit() {
    const availableModels = this.models();
    const modelInfo = availableModels[this.model];
    if (!modelInfo) {
      if (this.model.includes("128k")) return 128000;
      if (this.model.includes("32k")) return 32000;
      if (this.model.includes("8k")) return 8000;
      if (this.model.includes("kimi")) return 128000;
      return 8000;
    }
    return modelInfo.maxLength;
  }

  constructPrompt({
    systemPrompt = "",
    contextTexts = [],
    chatHistory = [],
    userPrompt = "",
    attachments = [],
  }) {
    const messages = [];

    if (systemPrompt) {
      messages.push({
        role: "system",
        content: systemPrompt,
      });
    }

    if (contextTexts?.length > 0) {
      messages.push({
        role: "system",
        content: `Context:\n${contextTexts.join("\n")}`,
      });
    }

    messages.push(...formatChatHistory(chatHistory));

    if (userPrompt) {
      messages.push({
        role: "user",
        content: userPrompt,
      });
    }

    return messages;
  }

  async compressMessages(promptArgs = {}, rawHistory = []) {
    const { messageArrayCompressor } = require("../../helpers/chat");
    const messageArray = this.constructPrompt(promptArgs);
    return await messageArrayCompressor(this, messageArray, rawHistory);
  }

  async getChatCompletion(messages = null, { temperature = 0.7 }) {
    if (!(await this.isValidChatCompletionModel(this.model)))
      throw new Error(
        `Moonshot AI chat: ${this.model} is not valid for chat completion!`
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
        `Moonshot AI chat: ${this.model} is not valid for chat completion!`
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

  // Simple wrapper for dynamic embedder & normalize interface for all LLM implementations
  async embedTextInput(textInput) {
    return await this.embedder.embedTextInput(textInput);
  }
  async embedChunks(textChunks = []) {
    return await this.embedder.embedChunks(textChunks);
  }

  async sendChat(chatHistory, prompt, workspace = null) {
    try {
      const messages = formatChatHistory(chatHistory, prompt, {
        systemPrompt: workspace?.openAiSystemPrompt,
      });

      const stream = await this.openai.chat.completions.create({
        model: this.model,
        messages,
        temperature: this.defaultTemp,
        stream: true,
      });

      return await handleDefaultStreamResponseV2(stream);
    } catch (error) {
      throw new Error(
        `[Moonshot AI] ${error?.error?.message || error?.message || error}`
      );
    }
  }
}

async function fetchMoonshotAiModels(providedApiKey = null) {
  const apiKey = providedApiKey || process.env.MOONSHOT_AI_API_KEY || null;
  if (!apiKey) return {};

  const { OpenAI: OpenAIApi } = require("openai");
  const openai = new OpenAIApi({
    baseURL: "https://api.moonshot.ai/v1",
    apiKey,
  });

  return await openai.models
    .list()
    .then((response) => {
      const models = {};
      response.data.forEach((model) => {
        models[model.id] = {
          id: model.id,
          name: model.id,
          organization: model.owned_by,
          maxLength: (() => {
            if (model.id.includes("128k")) return 128000;
            if (model.id.includes("32k")) return 32000;
            if (model.id.includes("8k")) return 8000;
            if (model.id.includes("kimi")) return 128000;
            return 8000;
          })(),
        };
      });

      // Cache all response information
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

module.exports = { MoonshotAiLLM, fetchMoonshotAiModels };
