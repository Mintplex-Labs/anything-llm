const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
  LLMPerformanceMonitor,
} = require("../../helpers/chat/LLMPerformanceMonitor");
const { v4: uuidv4 } = require("uuid");
const {
  writeResponseChunk,
  clientAbortedHandler,
} = require("../../helpers/chat/responses");
const { getAnythingLLMUserAgent } = require("../../../endpoints/utils");

class LLMApiLLM {
  /** @see LLMApiLLM.cacheContextWindows */
  static modelContextWindows = {};

  constructor(embedder = null, modelPreference = null) {
    if (!process.env.LLMAPI_LLM_API_KEY)
      throw new Error("No LLM API key was set.");
    this.className = "LLMApiLLM";
    const { OpenAI: OpenAIApi } = require("openai");

    this.openai = new OpenAIApi({
      baseURL: "https://api.llmapi.ai/v1",
      apiKey: process.env.LLMAPI_LLM_API_KEY,
      defaultHeaders: {
        "User-Agent": getAnythingLLMUserAgent(),
      },
    });
    this.model = modelPreference || process.env.LLMAPI_LLM_MODEL_PREF;

    this.embedder = embedder ?? new NativeEmbedder();
    this.defaultTemp = 0.7;

    // Lazy load the limits to avoid blocking the main thread on cacheContextWindows
    this.limits = null;

    LLMApiLLM.cacheContextWindows(true);
    this.log(
      `Initialized ${this.model} with context window ${this.promptWindowLimit()}`
    );
  }

  log(text, ...args) {
    console.log(`\x1b[36m[${this.className}]\x1b[0m ${text}`, ...args);
  }

  static #slog(text, ...args) {
    console.log(`\x1b[36m[LLMApiLLM]\x1b[0m ${text}`, ...args);
  }

  /**
   * Cache the context windows for available LLMAPI models.
   * Done once and then cached for the lifetime of the server.
   * @param {boolean} force - Force the cache to be refreshed.
   */
  static async cacheContextWindows(force = false) {
    try {
      if (Object.keys(LLMApiLLM.modelContextWindows).length > 0 && !force)
        return;

      const { OpenAI: OpenAIApi } = require("openai");
      const client = new OpenAIApi({
        baseURL: "https://api.llmapi.ai/v1",
        // /v1/models does not require authentication
        apiKey: process.env.LLMAPI_LLM_API_KEY || "no-key",
      });

      const { data: models } = await client.models
        .list()
        .catch(() => ({ data: [] }));
      if (!models.length) return;

      models.forEach((model) => {
        // context_length is available on some models
        if (model.context_length)
          LLMApiLLM.modelContextWindows[model.id] = model.context_length;
      });

      LLMApiLLM.#slog(`Context windows cached for ${models.length} models.`);
    } catch (e) {
      LLMApiLLM.#slog(`Error caching context windows`, e);
    }
  }

  async assertModelContextLimits() {
    if (this.limits !== null) return;
    await LLMApiLLM.cacheContextWindows();
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };
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
    const defaultLimit = 128_000;
    if (!modelName) return defaultLimit;
    return LLMApiLLM.modelContextWindows[modelName] ?? defaultLimit;
  }

  promptWindowLimit() {
    return this.constructor.promptWindowLimit(this.model);
  }

  async isValidChatCompletionModel(modelName = "") {
    return !!modelName;
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
    attachments = [],
  }) {
    const prompt = {
      role: "system",
      content: `${systemPrompt}${this.#appendContext(contextTexts)}`,
    };
    return [
      prompt,
      ...chatHistory,
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
          temperature,
        })
        .catch((e) => {
          const msg =
            e.status === 401
              ? "LLM API authentication failed. Check your LLMAPI_LLM_API_KEY."
              : e.message;
          throw new Error(msg);
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
        prompt_tokens: result.output.usage?.prompt_tokens || 0,
        completion_tokens: result.output.usage?.completion_tokens || 0,
        total_tokens: result.output.usage?.total_tokens || 0,
        outputTps: result.output.usage?.total_tokens_per_sec || 0,
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
        stream_options: {
          include_usage: true,
        },
      }),
      messages,
      runPromptTokenCalculation: false,
      modelTag: this.model,
      provider: this.className,
    });

    return measuredStreamRequest;
  }

  async handleStream(response, stream, responseProps) {
    const { uuid = uuidv4(), sources = [] } = responseProps;
    let hasUsageMetrics = false;
    let usage = {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0,
    };
    let fullText = "";
    let resolveStream;
    const streamPromise = new Promise((resolve) => {
      resolveStream = resolve;
    });

    const handleAbort = () => {
      stream?.endMeasurement(usage);
      clientAbortedHandler(resolveStream, fullText);
    };
    response.on("close", handleAbort);

    try {
      let closed = false;
      for await (const chunk of stream) {
        const message = chunk?.choices?.[0];
        const delta = message?.delta ?? {};

        // Some LLMAPI-proxied reasoning models (e.g. GLM, Kimi) place their
        // full response in delta.reasoning with no delta.content at all.
        // Fall back to delta.reasoning so those models produce non-empty output.
        const token = delta.content || delta.reasoning || null;

        if (
          chunk.hasOwnProperty("usage") &&
          !!chunk.usage &&
          Object.values(chunk.usage).length > 0
        ) {
          if (chunk.usage.hasOwnProperty("prompt_tokens"))
            usage.prompt_tokens = Number(chunk.usage.prompt_tokens);
          if (chunk.usage.hasOwnProperty("completion_tokens")) {
            hasUsageMetrics = true;
            usage.completion_tokens = Number(chunk.usage.completion_tokens);
          }
          if (chunk.usage.hasOwnProperty("total_tokens"))
            usage.total_tokens = Number(chunk.usage.total_tokens);
        }

        if (token) {
          fullText += token;
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

        if (
          message?.hasOwnProperty("finish_reason") &&
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
          resolveStream(fullText);
          closed = true;
          break;
        }
      }

      // Some providers (e.g. Gemini via LLMAPI) never send finish_reason,
      // so the stream ends naturally without hitting the break above.
      if (!closed) {
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
        resolveStream(fullText);
      }
    } catch (e) {
      this.log(`\x1b[43m\x1b[34m[STREAMING ERROR]\x1b[0m ${e.message}`);
      writeResponseChunk(response, {
        uuid,
        type: "abort",
        textResponse: null,
        sources: [],
        close: true,
        error: e.message,
      });
      stream?.endMeasurement(usage);
      resolveStream(fullText);
    }

    return streamPromise;
  }

  async embedTextInput(textInput) {
    return await this.embedder.embedTextInput(textInput);
  }

  async embedChunks(textChunks = []) {
    return await this.embedder.embedChunks(textChunks);
  }

  async compressMessages(promptArgs = {}, rawHistory = []) {
    await this.assertModelContextLimits();
    const { messageArrayCompressor } = require("../../helpers/chat");
    const messageArray = this.constructPrompt(promptArgs);
    return await messageArrayCompressor(this, messageArray, rawHistory);
  }
}

module.exports = {
  LLMApiLLM,
};
