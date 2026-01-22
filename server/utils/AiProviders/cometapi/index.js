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
const { COMETAPI_IGNORE_PATTERNS } = require("./constants");
const cacheFolder = path.resolve(
  process.env.STORAGE_DIR
    ? path.resolve(process.env.STORAGE_DIR, "models", "cometapi")
    : path.resolve(__dirname, `../../../storage/models/cometapi`)
);

class CometApiLLM {
  defaultTimeout = 3_000;
  constructor(embedder = null, modelPreference = null) {
    if (!process.env.COMETAPI_LLM_API_KEY)
      throw new Error("No CometAPI API key was set.");

    this.className = "CometApiLLM";
    const { OpenAI: OpenAIApi } = require("openai");
    this.basePath = "https://api.cometapi.com/v1";
    this.openai = new OpenAIApi({
      baseURL: this.basePath,
      apiKey: process.env.COMETAPI_LLM_API_KEY ?? null,
      defaultHeaders: {
        "HTTP-Referer": "https://anythingllm.com",
        "X-CometAPI-Source": "anythingllm",
      },
    });
    this.model =
      modelPreference || process.env.COMETAPI_LLM_MODEL_PREF || "gpt-5-mini";
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };

    this.embedder = embedder ?? new NativeEmbedder();
    this.defaultTemp = 0.7;
    this.timeout = this.#parseTimeout();

    if (!fs.existsSync(cacheFolder))
      fs.mkdirSync(cacheFolder, { recursive: true });
    this.cacheModelPath = path.resolve(cacheFolder, "models.json");
    this.cacheAtPath = path.resolve(cacheFolder, ".cached_at");

    this.log(`Loaded with model: ${this.model}`);
  }

  log(text, ...args) {
    console.log(`\x1b[36m[${this.className}]\x1b[0m ${text}`, ...args);
  }

  /**
   * CometAPI has various models that never return `finish_reasons` and thus leave the stream open
   * which causes issues in subsequent messages. This timeout value forces us to close the stream after
   * x milliseconds. This is a configurable value via the COMETAPI_LLM_TIMEOUT_MS value
   * @returns {number} The timeout value in milliseconds (default: 3_000)
   */
  #parseTimeout() {
    this.log(
      `CometAPI timeout is set to ${process.env.COMETAPI_LLM_TIMEOUT_MS ?? this.defaultTimeout}ms`
    );
    if (isNaN(Number(process.env.COMETAPI_LLM_TIMEOUT_MS)))
      return this.defaultTimeout;
    const setValue = Number(process.env.COMETAPI_LLM_TIMEOUT_MS);
    if (setValue < 500) return 500;
    return setValue;
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

  // The CometAPI model API has a lot of models, so we cache this locally in the directory
  // as if the cache directory JSON file is stale or does not exist we will fetch from API and store it.
  // This might slow down the first request, but we need the proper token context window
  // for each model and this is a constructor property - so we can really only get it if this cache exists.
  // We used to have this as a chore, but given there is an API to get the info - this makes little sense.
  async #syncModels() {
    if (fs.existsSync(this.cacheModelPath) && !this.#cacheIsStale())
      return false;

    this.log(
      "Model cache is not present or stale. Fetching from CometAPI API."
    );
    await fetchCometApiModels();
    return;
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

  async isValidChatCompletionModel(model = "") {
    await this.#syncModels();
    const availableModels = this.models();
    return availableModels.hasOwnProperty(model);
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
        `CometAPI chat: ${this.model} is not valid for chat completion!`
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
        model: this.model,
        timestamp: new Date(),
      },
    };
  }

  async streamGetChatCompletion(messages = null, { temperature = 0.7 }) {
    if (!(await this.isValidChatCompletionModel(this.model)))
      throw new Error(
        `CometAPI chat: ${this.model} is not valid for chat completion!`
      );

    const measuredStreamRequest = await LLMPerformanceMonitor.measureStream({
      func: this.openai.chat.completions.create({
        model: this.model,
        stream: true,
        messages,
        temperature,
      }),
      messages,
      runPromptTokenCalculation: true,
      modelTag: this.model,
    });
    return measuredStreamRequest;
  }

  /**
   * Handles the default stream response for a chat.
   * @param {import("express").Response} response
   * @param {import('../../helpers/chat/LLMPerformanceMonitor').MonitoredStream} stream
   * @param {Object} responseProps
   * @returns {Promise<string>}
   */
  handleStream(response, stream, responseProps) {
    const timeoutThresholdMs = this.timeout;
    const { uuid = uuidv4(), sources = [] } = responseProps;

    return new Promise(async (resolve) => {
      let fullText = "";
      let lastChunkTime = null; // null when first token is still not received.

      // Establish listener to early-abort a streaming response
      // in case things go sideways or the user does not like the response.
      // We preserve the generated text but continue as if chat was completed
      // to preserve previously generated content.
      const handleAbort = () => {
        stream?.endMeasurement({
          completion_tokens: LLMPerformanceMonitor.countTokens(fullText),
        });
        clientAbortedHandler(resolve, fullText);
      };
      response.on("close", handleAbort);

      // NOTICE: Not all CometAPI models will return a stop reason
      // which keeps the connection open and so the model never finalizes the stream
      // like the traditional OpenAI response schema does. So in the case the response stream
      // never reaches a formal close state we maintain an interval timer that if we go >=timeoutThresholdMs with
      // no new chunks then we kill the stream and assume it to be complete. CometAPI is quite fast
      // so this threshold should permit most responses, but we can adjust `timeoutThresholdMs` if
      // we find it is too aggressive.
      const timeoutCheck = setInterval(() => {
        if (lastChunkTime === null) return;

        const now = Number(new Date());
        const diffMs = now - lastChunkTime;
        if (diffMs >= timeoutThresholdMs) {
          this.log(
            `CometAPI stream did not self-close and has been stale for >${timeoutThresholdMs}ms. Closing response stream.`
          );
          writeResponseChunk(response, {
            uuid,
            sources,
            type: "textResponseChunk",
            textResponse: "",
            close: true,
            error: false,
          });
          clearInterval(timeoutCheck);
          response.removeListener("close", handleAbort);
          stream?.endMeasurement({
            completion_tokens: LLMPerformanceMonitor.countTokens(fullText),
          });
          resolve(fullText);
        }
      }, 500);

      try {
        for await (const chunk of stream) {
          const message = chunk?.choices?.[0];
          const token = message?.delta?.content;
          lastChunkTime = Number(new Date());

          if (token) {
            fullText += token;
            writeResponseChunk(response, {
              uuid,
              sources: [],
              type: "textResponseChunk",
              textResponse: token,
              close: false,
              error: false,
            });
          }

          if (message.finish_reason !== null) {
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
          }
        }
      } catch (e) {
        writeResponseChunk(response, {
          uuid,
          sources,
          type: "abort",
          textResponse: null,
          close: true,
          error: e.message,
        });
        response.removeListener("close", handleAbort);
        stream?.endMeasurement({
          completion_tokens: LLMPerformanceMonitor.countTokens(fullText),
        });
        resolve(fullText);
      }
    });
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

/**
 * Fetches available models from CometAPI and filters out non-chat models
 * Based on cometapi.md specifications
 */
async function fetchCometApiModels() {
  return await fetch(`https://api.cometapi.com/v1/models`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.COMETAPI_LLM_API_KEY}`,
    },
  })
    .then((res) => res.json())
    .then(({ data = [] }) => {
      const models = {};

      // Filter out non-chat models using patterns from cometapi.md
      const chatModels = data.filter((model) => {
        const modelId = model.id.toLowerCase();
        return !COMETAPI_IGNORE_PATTERNS.some((pattern) =>
          modelId.includes(pattern.toLowerCase())
        );
      });

      chatModels.forEach((model) => {
        models[model.id] = {
          id: model.id,
          name: model.id, // CometAPI has limited model info according to cometapi.md
          organization:
            model.id.split("/")[0] || model.id.split("-")[0] || "CometAPI",
          maxLength: model.context_length || 4096, // Conservative default
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
      console.error("Error fetching CometAPI models:", e);
      return {};
    });
}

module.exports = {
  CometApiLLM,
  fetchCometApiModels,
};
