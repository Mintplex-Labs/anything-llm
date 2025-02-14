const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const { v4: uuidv4 } = require("uuid");
const {
  writeResponseChunk,
  clientAbortedHandler,
  formatChatHistory,
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

  log(msg) {
    console.log(`[PPIO] ${msg}`);
  }

  async #syncModels() {
    if (fs.existsSync(this.cacheModelPath) && !this.#cacheIsStale())
      return false;

    this.log("Model cache is not present or stale. Fetching from PPIO API.");
    await fetchPPIOModels();
    return;
  }

  #cacheIsStale() {
    if (!fs.existsSync(this.cacheAtPath)) return true;
    const cacheAge = Number(
      fs.readFileSync(this.cacheAtPath, { encoding: "utf-8" })
    );
    const now = Number(new Date());
    return (now - cacheAge) / 1000 / 60 / 60 >= 24;
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

  constructPrompt({
    systemPrompt = "",
    contextTexts = [],
    userPrompt = "",
    messageHistory = [],
  }) {
    const messages = [];
    if (systemPrompt?.length > 0) {
      messages.push({
        role: "system",
        content: systemPrompt,
      });
    }

    if (contextTexts.length > 0) {
      messages.push({
        role: "system",
        content: `Context:\n${contextTexts
          .map((text) => `${text?.trim()}`)
          .join("\n\n")}`,
      });
    }

    if (messageHistory.length > 0) {
      messages.push(...formatChatHistory(messageHistory));
    }

    messages.push({
      role: "user",
      content: userPrompt,
    });
    return messages;
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
    const { uuid = uuidv4(), sources = [] } = responseProps;
    return new Promise((resolve) => {
      let fullText = "";
      const handleAbort = () => {
        stream?.endMeasurement({
          completion_tokens: LLMPerformanceMonitor.countTokens(fullText),
        });
        clientAbortedHandler(resolve, fullText);
      };
      response.on("close", handleAbort);

      (async () => {
        try {
          for await (const chunk of stream) {
            if (!chunk?.choices?.[0]?.delta?.content) continue;
            const content = chunk.choices[0].delta.content;
            fullText += content;

            writeResponseChunk(response, {
              uuid,
              sources,
              type: "textResponseChunk",
              textResponse: content,
              close: false,
              error: false,
            });
          }
        } catch (error) {
          console.error("Error in stream processing:", error);
          writeResponseChunk(response, {
            uuid,
            sources,
            type: "textResponseChunk",
            textResponse: "",
            close: true,
            error: true,
          });
          response.removeListener("close", handleAbort);
          stream?.endMeasurement({
            completion_tokens: LLMPerformanceMonitor.countTokens(fullText),
          });
          resolve(fullText);
          return;
        }

        writeResponseChunk(response, {
          uuid,
          sources,
          type: "textResponseChunk",
          textResponse: "",
          close: true,
          error: false,
        });
        response.removeListener("close", handleAbort);
        stream?.endMeasurement({
          completion_tokens: LLMPerformanceMonitor.countTokens(fullText),
        });
        resolve(fullText);
      })();
    });
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
  return await fetch(`${this.basePath}/models`, {
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
        models[model.id] = {
          id: model.id,
          name: model.display_name || model.title || model.id,
          organization: "PPIO",
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
