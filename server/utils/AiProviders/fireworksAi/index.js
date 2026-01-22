const fs = require("fs");
const path = require("path");
const { safeJsonParse } = require("../../http");
const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
  LLMPerformanceMonitor,
} = require("../../helpers/chat/LLMPerformanceMonitor");
const {
  handleDefaultStreamResponseV2,
} = require("../../helpers/chat/responses");

const cacheFolder = path.resolve(
  process.env.STORAGE_DIR
    ? path.resolve(process.env.STORAGE_DIR, "models", "fireworks")
    : path.resolve(__dirname, `../../../storage/models/fireworks`)
);

class FireworksAiLLM {
  constructor(embedder = null, modelPreference = null) {
    this.className = "FireworksAiLLM";

    if (!process.env.FIREWORKS_AI_LLM_API_KEY)
      throw new Error("No FireworksAI API key was set.");
    const { OpenAI: OpenAIApi } = require("openai");
    this.openai = new OpenAIApi({
      baseURL: "https://api.fireworks.ai/inference/v1",
      apiKey: process.env.FIREWORKS_AI_LLM_API_KEY ?? null,
    });
    this.model = modelPreference || process.env.FIREWORKS_AI_LLM_MODEL_PREF;
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };

    this.embedder = !embedder ? new NativeEmbedder() : embedder;
    this.defaultTemp = 0.7;

    if (!fs.existsSync(cacheFolder))
      fs.mkdirSync(cacheFolder, { recursive: true });
    this.cacheModelPath = path.resolve(cacheFolder, "models.json");
    this.cacheAtPath = path.resolve(cacheFolder, ".cached_at");
  }

  log(text, ...args) {
    console.log(`\x1b[36m[${this.className}]\x1b[0m ${text}`, ...args);
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

  // This function fetches the models from the ApiPie API and caches them locally.
  // We do this because the ApiPie API has a lot of models, and we need to get the proper token context window
  // for each model and this is a constructor property - so we can really only get it if this cache exists.
  // We used to have this as a chore, but given there is an API to get the info - this makes little sense.
  // This might slow down the first request, but we need the proper token context window
  // for each model and this is a constructor property - so we can really only get it if this cache exists.
  async #syncModels() {
    if (fs.existsSync(this.cacheModelPath) && !this.#cacheIsStale())
      return false;

    this.log(
      "Model cache is not present or stale. Fetching from FireworksAI API."
    );
    await fireworksAiModels();
    return;
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

  // Ensure the user set a value for the token limit
  // and if undefined - assume 4096 window.
  promptWindowLimit() {
    const availableModels = this.models();
    return availableModels[this.model]?.maxLength || 4096;
  }

  async isValidChatCompletionModel(model = "") {
    await this.#syncModels();
    const availableModels = this.models();
    return availableModels.hasOwnProperty(model);
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
        `FireworksAI chat: ${this.model} is not valid for chat completion!`
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
        model: this.model,
        timestamp: new Date(),
      },
    };
  }

  async streamGetChatCompletion(messages = null, { temperature = 0.7 }) {
    if (!(await this.isValidChatCompletionModel(this.model)))
      throw new Error(
        `FireworksAI chat: ${this.model} is not valid for chat completion!`
      );

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

async function fireworksAiModels(providedApiKey = null) {
  const apiKey = providedApiKey || process.env.FIREWORKS_AI_LLM_API_KEY || null;
  const { OpenAI: OpenAIApi } = require("openai");
  const client = new OpenAIApi({
    baseURL: "https://api.fireworks.ai/inference/v1",
    apiKey: apiKey,
  });

  return await client.models
    .list()
    .then((res) => res.data)
    .then((models = []) => {
      const validModels = {};
      models.forEach((model) => {
        // There are many models - the ones without a context length are not chat models
        if (!model.hasOwnProperty("context_length")) return;

        validModels[model.id] = {
          id: model.id,
          name: model.id.split("/").pop(),
          organization: model.owned_by,
          subtype: model.type,
          maxLength: model.context_length ?? 4096,
        };
      });

      if (Object.keys(validModels).length === 0) {
        console.log("fireworksAi: No models found");
        return {};
      }

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
  FireworksAiLLM,
  fireworksAiModels,
};
