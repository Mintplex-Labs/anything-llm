const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { safeJsonParse, toValidNumber } = require("../../http");
const LEGACY_MODEL_MAP = require("../modelMap/legacy");
const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
  LLMPerformanceMonitor,
} = require("../../helpers/chat/LLMPerformanceMonitor");
const {
  writeResponseChunk,
  clientAbortedHandler,
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

  // This function fetches the models from the GiteeAI API and caches them locally.
  async #syncModels() {
    if (fs.existsSync(this.cacheModelPath) && !this.#cacheIsStale())
      return false;

    this.log("Model cache is not present or stale. Fetching from GiteeAI API.");
    await giteeAiModels();
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

  async isValidChatCompletionModel(modelName = "") {
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
    });

    return measuredStreamRequest;
  }

  // TODO: This is a copy of the generic handleStream function in responses.js
  // to specifically handle the GiteeAI reasoning model `reasoning_content` field.
  // When or if ever possible, we should refactor this to be in the generic function.
  handleStream(response, stream, responseProps) {
    const { uuid = uuidv4(), sources = [] } = responseProps;
    let hasUsageMetrics = false;
    let usage = {
      completion_tokens: 0,
    };

    return new Promise(async (resolve) => {
      let fullText = "";
      let reasoningText = "";

      // Establish listener to early-abort a streaming response
      // in case things go sideways or the user does not like the response.
      // We preserve the generated text but continue as if chat was completed
      // to preserve previously generated content.
      const handleAbort = () => {
        stream?.endMeasurement(usage);
        clientAbortedHandler(resolve, fullText);
      };
      response.on("close", handleAbort);

      try {
        for await (const chunk of stream) {
          const message = chunk?.choices?.[0];
          const token = message?.delta?.content;
          const reasoningToken = message?.delta?.reasoning_content;

          if (
            chunk.hasOwnProperty("usage") && // exists
            !!chunk.usage && // is not null
            Object.values(chunk.usage).length > 0 // has values
          ) {
            if (chunk.usage.hasOwnProperty("prompt_tokens")) {
              usage.prompt_tokens = Number(chunk.usage.prompt_tokens);
            }

            if (chunk.usage.hasOwnProperty("completion_tokens")) {
              hasUsageMetrics = true; // to stop estimating counter
              usage.completion_tokens = Number(chunk.usage.completion_tokens);
            }
          }

          // Reasoning models will always return the reasoning text before the token text.
          if (reasoningToken) {
            // If the reasoning text is empty (''), we need to initialize it
            // and send the first chunk of reasoning text.
            if (reasoningText.length === 0) {
              writeResponseChunk(response, {
                uuid,
                sources: [],
                type: "textResponseChunk",
                textResponse: `<think>${reasoningToken}`,
                close: false,
                error: false,
              });
              reasoningText += `<think>${reasoningToken}`;
              continue;
            } else {
              writeResponseChunk(response, {
                uuid,
                sources: [],
                type: "textResponseChunk",
                textResponse: reasoningToken,
                close: false,
                error: false,
              });
              reasoningText += reasoningToken;
            }
          }

          // If the reasoning text is not empty, but the reasoning token is empty
          // and the token text is not empty we need to close the reasoning text and begin sending the token text.
          if (!!reasoningText && !reasoningToken && token) {
            writeResponseChunk(response, {
              uuid,
              sources: [],
              type: "textResponseChunk",
              textResponse: `</think>`,
              close: false,
              error: false,
            });
            fullText += `${reasoningText}</think>`;
            reasoningText = "";
          }

          if (token) {
            fullText += token;
            // If we never saw a usage metric, we can estimate them by number of completion chunks
            if (!hasUsageMetrics) usage.completion_tokens++;
            writeResponseChunk(response, {
              uuid,
              sources: [],
              type: "textResponseChunk",
              textResponse: token,
              close: false,
              error: false,
            });
          }

          // LocalAi returns '' and others return null on chunks - the last chunk is not "" or null.
          // Either way, the key `finish_reason` must be present to determine ending chunk.
          if (
            message?.hasOwnProperty("finish_reason") && // Got valid message and it is an object with finish_reason
            message.finish_reason !== "" &&
            message.finish_reason !== null
          ) {
            writeResponseChunk(response, {
              uuid,
              sources,
              type: "textResponseChunk",
              textResponse: "",
              close: true,
              error: false,
            });
            response.removeListener("close", handleAbort);
            stream?.endMeasurement(usage);
            resolve(fullText);
            break; // Break streaming when a valid finish_reason is first encountered
          }
        }
      } catch (e) {
        console.log(`\x1b[43m\x1b[34m[STREAMING ERROR]\x1b[0m ${e.message}`);
        writeResponseChunk(response, {
          uuid,
          type: "abort",
          textResponse: null,
          sources: [],
          close: true,
          error: e.message,
        });
        stream?.endMeasurement(usage);
        resolve(fullText); // Return what we currently have - if anything.
      }
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
