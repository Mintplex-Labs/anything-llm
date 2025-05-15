const fs = require("fs");
const path = require("path");
const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
  LLMPerformanceMonitor,
} = require("../../helpers/chat/LLMPerformanceMonitor");
const {
  formatChatHistory,
  handleDefaultStreamResponseV2,
} = require("../../helpers/chat/responses");
const { MODEL_MAP } = require("../modelMap");
const { defaultGeminiModels, v1BetaModels } = require("./defaultModels");
const { safeJsonParse } = require("../../http");
const cacheFolder = path.resolve(
  process.env.STORAGE_DIR
    ? path.resolve(process.env.STORAGE_DIR, "models", "gemini")
    : path.resolve(__dirname, `../../../storage/models/gemini`)
);

const NO_SYSTEM_PROMPT_MODELS = [
  "gemma-3-1b-it",
  "gemma-3-4b-it",
  "gemma-3-12b-it",
  "gemma-3-27b-it",
];

class GeminiLLM {
  constructor(embedder = null, modelPreference = null) {
    if (!process.env.GEMINI_API_KEY)
      throw new Error("No Gemini API key was set.");

    const { OpenAI: OpenAIApi } = require("openai");
    this.model =
      modelPreference ||
      process.env.GEMINI_LLM_MODEL_PREF ||
      "gemini-2.0-flash-lite";

    const isExperimental = this.isExperimentalModel(this.model);
    this.openai = new OpenAIApi({
      apiKey: process.env.GEMINI_API_KEY,
      // Even models that are v1 in gemini API can be used with v1beta/openai/ endpoint and nobody knows why.
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    });

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
    this.#log(
      `Initialized with model: ${this.model} ${isExperimental ? "[Experimental v1beta]" : "[Stable v1]"} - ctx: ${this.promptWindowLimit()}`
    );
  }

  /**
   * Checks if the model supports system prompts
   * This is a static list of models that are known to not support system prompts
   * since this information is not available in the API model response.
   * @returns {boolean}
   */
  get supportsSystemPrompt() {
    return !NO_SYSTEM_PROMPT_MODELS.includes(this.model);
  }

  #log(text, ...args) {
    console.log(`\x1b[32m[GeminiLLM]\x1b[0m ${text}`, ...args);
  }

  // This checks if the .cached_at file has a timestamp that is more than 1Week (in millis)
  // from the current date. If it is, then we will refetch the API so that all the models are up
  // to date.
  static cacheIsStale() {
    const MAX_STALE = 8.64e7; // 1 day in MS
    if (!fs.existsSync(path.resolve(cacheFolder, ".cached_at"))) return true;
    const now = Number(new Date());
    const timestampMs = Number(
      fs.readFileSync(path.resolve(cacheFolder, ".cached_at"))
    );
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

  streamingEnabled() {
    return "streamGetChatCompletion" in this;
  }

  static promptWindowLimit(modelName) {
    try {
      const cacheModelPath = path.resolve(cacheFolder, "models.json");
      if (!fs.existsSync(cacheModelPath))
        return MODEL_MAP.get("gemini", modelName) ?? 30_720;

      const models = safeJsonParse(fs.readFileSync(cacheModelPath));
      const model = models.find((model) => model.id === modelName);
      if (!model)
        throw new Error(
          "Model not found in cache - falling back to default model."
        );
      return model.contextWindow;
    } catch (e) {
      console.error(`GeminiLLM:promptWindowLimit`, e.message);
      return MODEL_MAP.get("gemini", modelName) ?? 30_720;
    }
  }

  promptWindowLimit() {
    try {
      if (!fs.existsSync(this.cacheModelPath))
        return MODEL_MAP.get("gemini", this.model) ?? 30_720;
      const models = safeJsonParse(fs.readFileSync(this.cacheModelPath));
      const model = models.find((model) => model.id === this.model);
      if (!model)
        throw new Error(
          "Model not found in cache - falling back to default model."
        );
      return model.contextWindow;
    } catch (e) {
      console.error(`GeminiLLM:promptWindowLimit`, e.message);
      return MODEL_MAP.get("gemini", this.model) ?? 30_720;
    }
  }

  /**
   * Checks if a model is experimental by reading from the cache if available, otherwise it will perform
   * a blind check against the v1BetaModels list - which is manually maintained and updated.
   * @param {string} modelName - The name of the model to check
   * @returns {boolean} A boolean indicating if the model is experimental
   */
  isExperimentalModel(modelName) {
    if (
      fs.existsSync(cacheFolder) &&
      fs.existsSync(path.resolve(cacheFolder, "models.json"))
    ) {
      const models = safeJsonParse(
        fs.readFileSync(path.resolve(cacheFolder, "models.json"))
      );
      const model = models.find((model) => model.id === modelName);
      if (!model) return false;
      return model.experimental;
    }

    return modelName.includes("exp") || v1BetaModels.includes(modelName);
  }

  /**
   * Fetches Gemini models from the Google Generative AI API
   * @param {string} apiKey - The API key to use for the request
   * @param {number} limit - The maximum number of models to fetch
   * @param {string} pageToken - The page token to use for pagination
   * @returns {Promise<[{id: string, name: string, contextWindow: number, experimental: boolean}]>} A promise that resolves to an array of Gemini models
   */
  static async fetchModels(apiKey, limit = 1_000, pageToken = null) {
    if (!apiKey) return [];
    if (fs.existsSync(cacheFolder) && !this.cacheIsStale()) {
      console.log(
        `\x1b[32m[GeminiLLM]\x1b[0m Using cached models API response.`
      );
      return safeJsonParse(
        fs.readFileSync(path.resolve(cacheFolder, "models.json"))
      );
    }

    const stableModels = [];
    const allModels = [];

    // Fetch from v1
    try {
      const url = new URL(
        "https://generativelanguage.googleapis.com/v1/models"
      );
      url.searchParams.set("pageSize", limit);
      url.searchParams.set("key", apiKey);
      if (pageToken) url.searchParams.set("pageToken", pageToken);
      await fetch(url.toString(), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) throw new Error(data.error.message);
          return data.models ?? [];
        })
        .then((models) => {
          return models
            .filter(
              (model) => !model.displayName?.toLowerCase()?.includes("tuning")
            ) // remove tuning models
            .filter(
              (model) =>
                !model.description?.toLowerCase()?.includes("deprecated")
            ) // remove deprecated models (in comment)
            .filter((model) =>
              //  Only generateContent is supported
              model.supportedGenerationMethods.includes("generateContent")
            )
            .map((model) => {
              stableModels.push(model.name);
              allModels.push({
                id: model.name.split("/").pop(),
                name: model.displayName,
                contextWindow: model.inputTokenLimit,
                experimental: false,
              });
            });
        })
        .catch((e) => {
          console.error(`Gemini:getGeminiModelsV1`, e.message);
          return;
        });
    } catch (e) {
      console.error(`Gemini:getGeminiModelsV1`, e.message);
    }

    // Fetch from v1beta
    try {
      const url = new URL(
        "https://generativelanguage.googleapis.com/v1beta/models"
      );
      url.searchParams.set("pageSize", limit);
      url.searchParams.set("key", apiKey);
      if (pageToken) url.searchParams.set("pageToken", pageToken);
      await fetch(url.toString(), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) throw new Error(data.error.message);
          return data.models ?? [];
        })
        .then((models) => {
          return models
            .filter((model) => !stableModels.includes(model.name)) // remove stable models that are already in the v1 list
            .filter(
              (model) => !model.displayName?.toLowerCase()?.includes("tuning")
            ) // remove tuning models
            .filter(
              (model) =>
                !model.description?.toLowerCase()?.includes("deprecated")
            ) // remove deprecated models (in comment)
            .filter((model) =>
              //  Only generateContent is supported
              model.supportedGenerationMethods.includes("generateContent")
            )
            .map((model) => {
              allModels.push({
                id: model.name.split("/").pop(),
                name: model.displayName,
                contextWindow: model.inputTokenLimit,
                experimental: true,
              });
            });
        })
        .catch((e) => {
          console.error(`Gemini:getGeminiModelsV1beta`, e.message);
          return;
        });
    } catch (e) {
      console.error(`Gemini:getGeminiModelsV1beta`, e.message);
    }

    if (allModels.length === 0) {
      console.error(`Gemini:getGeminiModels - No models found`);
      return defaultGeminiModels();
    }

    console.log(
      `\x1b[32m[GeminiLLM]\x1b[0m Writing cached models API response to disk.`
    );
    if (!fs.existsSync(cacheFolder))
      fs.mkdirSync(cacheFolder, { recursive: true });
    fs.writeFileSync(
      path.resolve(cacheFolder, "models.json"),
      JSON.stringify(allModels)
    );
    fs.writeFileSync(
      path.resolve(cacheFolder, ".cached_at"),
      new Date().getTime().toString()
    );

    return allModels;
  }

  /**
   * Checks if a model is valid for chat completion (unused)
   * @deprecated
   * @param {string} modelName - The name of the model to check
   * @returns {Promise<boolean>} A promise that resolves to a boolean indicating if the model is valid
   */
  async isValidChatCompletionModel(modelName = "") {
    const models = await this.fetchModels(process.env.GEMINI_API_KEY);
    return models.some((model) => model.id === modelName);
  }

  /**
   * Generates appropriate content array for a message + attachments.
   * @param {{userPrompt:string, attachments: import("../../helpers").Attachment[]}}
   * @returns {string|object[]}
   */
  #generateContent({ userPrompt, attachments = [] }) {
    if (!attachments.length) return userPrompt;

    const content = [{ type: "text", text: userPrompt }];
    for (let attachment of attachments) {
      content.push({
        type: "image_url",
        image_url: {
          url: attachment.contentString,
          detail: "high",
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
    attachments = [], // This is the specific attachment for only this prompt
  }) {
    let prompt = [];
    if (this.supportsSystemPrompt) {
      prompt.push({
        role: "system",
        content: `${systemPrompt}${this.#appendContext(contextTexts)}`,
      });
    } else {
      this.#log(
        `${this.model} - does not support system prompts - emulating...`
      );
      prompt.push(
        {
          role: "user",
          content: `${systemPrompt}${this.#appendContext(contextTexts)}`,
        },
        {
          role: "assistant",
          content: "Okay.",
        }
      );
    }

    return [
      ...prompt,
      ...formatChatHistory(chatHistory, this.#generateContent),
      {
        role: "user",
        content: this.#generateContent({ userPrompt, attachments }),
      },
    ];
  }

  async getChatCompletion(messages = null, { temperature = 0.7 }) {
    const result = await LLMPerformanceMonitor.measureAsyncFunction(
      this.openai.chat.completions
        .create({
          model: this.model,
          messages,
          temperature: temperature,
        })
        .catch((e) => {
          console.error(e);
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
    const measuredStreamRequest = await LLMPerformanceMonitor.measureStream(
      this.openai.chat.completions.create({
        model: this.model,
        stream: true,
        messages,
        temperature: temperature,
      }),
      messages,
      true
    );

    return measuredStreamRequest;
  }

  handleStream(response, stream, responseProps) {
    return handleDefaultStreamResponseV2(response, stream, responseProps);
  }

  async compressMessages(promptArgs = {}, rawHistory = []) {
    const { messageArrayCompressor } = require("../../helpers/chat");
    const messageArray = this.constructPrompt(promptArgs);
    return await messageArrayCompressor(this, messageArray, rawHistory);
  }

  // Simple wrapper for dynamic embedder & normalize interface for all LLM implementations
  async embedTextInput(textInput) {
    return await this.embedder.embedTextInput(textInput);
  }
  async embedChunks(textChunks = []) {
    return await this.embedder.embedChunks(textChunks);
  }
}

module.exports = {
  GeminiLLM,
  NO_SYSTEM_PROMPT_MODELS,
};
