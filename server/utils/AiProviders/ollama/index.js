const {
  writeResponseChunk,
  clientAbortedHandler,
  formatChatHistory,
} = require("../../helpers/chat/responses");
const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
  LLMPerformanceMonitor,
} = require("../../helpers/chat/LLMPerformanceMonitor");
const { Ollama } = require("ollama");

// Docs: https://github.com/jmorganca/ollama/blob/main/docs/api.md
class OllamaAILLM {
  constructor(embedder = null, modelPreference = null) {
    if (!process.env.OLLAMA_BASE_PATH)
      throw new Error("No Ollama Base Path was set.");

    this.authToken = process.env.OLLAMA_AUTH_TOKEN;
    this.basePath = process.env.OLLAMA_BASE_PATH;
    this.model = modelPreference || process.env.OLLAMA_MODEL_PREF;
    this.performanceMode = process.env.OLLAMA_PERFORMANCE_MODE || "base";
    this.keepAlive = process.env.OLLAMA_KEEP_ALIVE_TIMEOUT
      ? Number(process.env.OLLAMA_KEEP_ALIVE_TIMEOUT)
      : 300; // Default 5-minute timeout for Ollama model loading.
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };

    const headers = this.authToken
      ? { Authorization: `Bearer ${this.authToken}` }
      : {};
    this.client = new Ollama({ host: this.basePath, headers: headers });
    this.embedder = embedder ?? new NativeEmbedder();
    this.defaultTemp = 0.7;
    this.#log(
      `OllamaAILLM initialized with\nmodel: ${this.model}\nperf: ${this.performanceMode}\nn_ctx: ${this.promptWindowLimit()}`
    );
  }

  #log(text, ...args) {
    console.log(`\x1b[32m[Ollama]\x1b[0m ${text}`, ...args);
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

  static promptWindowLimit(_modelName) {
    const limit = process.env.OLLAMA_MODEL_TOKEN_LIMIT || 4096;
    if (!limit || isNaN(Number(limit)))
      throw new Error("No Ollama token context limit was set.");
    return Number(limit);
  }

  // Ensure the user set a value for the token limit
  // and if undefined - assume 4096 window.
  promptWindowLimit() {
    const limit = process.env.OLLAMA_MODEL_TOKEN_LIMIT || 4096;
    if (!limit || isNaN(Number(limit)))
      throw new Error("No Ollama token context limit was set.");
    return Number(limit);
  }

  async isValidChatCompletionModel(_ = "") {
    return true;
  }

  /**
   * Generates appropriate content array for a message + attachments.
   * @param {{userPrompt:string, attachments: import("../../helpers").Attachment[]}}
   * @returns {{content: string, images: string[]}}
   */
  #generateContent({ userPrompt, attachments = [] }) {
    if (!attachments.length) return { content: userPrompt };
    const images = attachments.map(
      (attachment) => attachment.contentString.split("base64,").slice(-1)[0]
    );
    return { content: userPrompt, images };
  }

  /**
   * Handles errors from the Ollama API to make them more user friendly.
   * @param {Error} e
   */
  #errorHandler(e) {
    switch (e.message) {
      case "fetch failed":
        throw new Error(
          "Your Ollama instance could not be reached or is not responding. Please make sure it is running the API server and your connection information is correct in AnythingLLM."
        );
      default:
        return e;
    }
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
      ...formatChatHistory(chatHistory, this.#generateContent, "spread"),
      {
        role: "user",
        ...this.#generateContent({ userPrompt, attachments }),
      },
    ];
  }

  async getChatCompletion(messages = null, { temperature = 0.7 }) {
    const result = await LLMPerformanceMonitor.measureAsyncFunction(
      this.client
        .chat({
          model: this.model,
          stream: false,
          messages,
          keep_alive: this.keepAlive,
          options: {
            temperature,
            use_mlock: true,
            // There are currently only two performance settings so if its not "base" - its max context.
            ...(this.performanceMode === "base"
              ? {}
              : { num_ctx: this.promptWindowLimit() }),
          },
        })
        .then((res) => {
          return {
            content: res.message.content,
            usage: {
              prompt_tokens: res.prompt_eval_count,
              completion_tokens: res.eval_count,
              total_tokens: res.prompt_eval_count + res.eval_count,
            },
          };
        })
        .catch((e) => {
          throw new Error(
            `Ollama::getChatCompletion failed to communicate with Ollama. ${this.#errorHandler(e).message}`
          );
        })
    );

    if (!result.output.content || !result.output.content.length)
      throw new Error(`Ollama::getChatCompletion text response was empty.`);

    return {
      textResponse: result.output.content,
      metrics: {
        prompt_tokens: result.output.usage.prompt_tokens,
        completion_tokens: result.output.usage.completion_tokens,
        total_tokens: result.output.usage.total_tokens,
        outputTps: result.output.usage.completion_tokens / result.duration,
        duration: result.duration,
      },
    };
  }

  async streamGetChatCompletion(messages = null, { temperature = 0.7 }) {
    const measuredStreamRequest = await LLMPerformanceMonitor.measureStream(
      this.client.chat({
        model: this.model,
        stream: true,
        messages,
        keep_alive: this.keepAlive,
        options: {
          temperature,
          use_mlock: true,
          // There are currently only two performance settings so if its not "base" - its max context.
          ...(this.performanceMode === "base"
            ? {}
            : { num_ctx: this.promptWindowLimit() }),
        },
      }),
      messages,
      false
    ).catch((e) => {
      throw this.#errorHandler(e);
    });
    return measuredStreamRequest;
  }

  /**
   * Handles streaming responses from Ollama.
   * @param {import("express").Response} response
   * @param {import("../../helpers/chat/LLMPerformanceMonitor").MonitoredStream} stream
   * @param {import("express").Request} request
   * @returns {Promise<string>}
   */
  handleStream(response, stream, responseProps) {
    const { uuid = uuidv4(), sources = [] } = responseProps;

    return new Promise(async (resolve) => {
      let fullText = "";
      let usage = {
        prompt_tokens: 0,
        completion_tokens: 0,
      };

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
          if (chunk === undefined)
            throw new Error(
              "Stream returned undefined chunk. Aborting reply - check model provider logs."
            );

          if (chunk.done) {
            usage.prompt_tokens = chunk.prompt_eval_count;
            usage.completion_tokens = chunk.eval_count;
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
            break;
          }

          if (chunk.hasOwnProperty("message")) {
            const content = chunk.message.content;
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
        }
      } catch (error) {
        writeResponseChunk(response, {
          uuid,
          sources: [],
          type: "textResponseChunk",
          textResponse: "",
          close: true,
          error: `Ollama:streaming - could not stream chat. ${
            error?.cause ?? error.message
          }`,
        });
        response.removeListener("close", handleAbort);
        stream?.endMeasurement(usage);
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

module.exports = {
  OllamaAILLM,
};
