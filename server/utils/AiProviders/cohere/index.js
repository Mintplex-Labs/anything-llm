const { v4 } = require("uuid");
const { writeResponseChunk } = require("../../helpers/chat/responses");
const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const { MODEL_MAP } = require("../modelMap");
const {
  LLMPerformanceMonitor,
} = require("../../helpers/chat/LLMPerformanceMonitor");

class CohereLLM {
  constructor(embedder = null) {
    const { CohereClient } = require("cohere-ai");
    if (!process.env.COHERE_API_KEY)
      throw new Error("No Cohere API key was set.");

    const cohere = new CohereClient({
      token: process.env.COHERE_API_KEY,
    });

    this.cohere = cohere;
    this.model = process.env.COHERE_MODEL_PREF;
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };

    this.embedder = embedder ?? new NativeEmbedder();
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

  #convertChatHistoryCohere(chatHistory = []) {
    let cohereHistory = [];
    chatHistory.forEach((message) => {
      switch (message.role) {
        case "system":
          cohereHistory.push({ role: "SYSTEM", message: message.content });
          break;
        case "user":
          cohereHistory.push({ role: "USER", message: message.content });
          break;
        case "assistant":
          cohereHistory.push({ role: "CHATBOT", message: message.content });
          break;
      }
    });

    return cohereHistory;
  }

  streamingEnabled() {
    return "streamGetChatCompletion" in this;
  }

  static promptWindowLimit(modelName) {
    return MODEL_MAP.get("cohere", modelName) ?? 4_096;
  }

  promptWindowLimit() {
    return MODEL_MAP.get("cohere", this.model) ?? 4_096;
  }

  async isValidChatCompletionModel(model = "") {
    const validModels = [
      "command-r",
      "command-r-plus",
      "command",
      "command-light",
      "command-nightly",
      "command-light-nightly",
    ];
    return validModels.includes(model);
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
        `Cohere chat: ${this.model} is not valid for chat completion!`
      );

    const message = messages[messages.length - 1].content; // Get the last message
    const cohereHistory = this.#convertChatHistoryCohere(messages.slice(0, -1)); // Remove the last message and convert to Cohere

    const result = await LLMPerformanceMonitor.measureAsyncFunction(
      this.cohere.chat({
        model: this.model,
        message: message,
        chatHistory: cohereHistory,
        temperature,
      })
    );

    if (
      !result.output.hasOwnProperty("text") ||
      result.output.text.length === 0
    )
      return null;

    const promptTokens = result.output.meta?.tokens?.inputTokens || 0;
    const completionTokens = result.output.meta?.tokens?.outputTokens || 0;
    return {
      textResponse: result.output.text,
      metrics: {
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        total_tokens: promptTokens + completionTokens,
        outputTps: completionTokens / result.duration,
        duration: result.duration,
      },
    };
  }

  async streamGetChatCompletion(messages = null, { temperature = 0.7 }) {
    if (!(await this.isValidChatCompletionModel(this.model)))
      throw new Error(
        `Cohere chat: ${this.model} is not valid for chat completion!`
      );

    const message = messages[messages.length - 1].content; // Get the last message
    const cohereHistory = this.#convertChatHistoryCohere(messages.slice(0, -1)); // Remove the last message and convert to Cohere
    const measuredStreamRequest = await LLMPerformanceMonitor.measureStream(
      this.cohere.chatStream({
        model: this.model,
        message: message,
        chatHistory: cohereHistory,
        temperature,
      }),
      messages,
      false
    );

    return measuredStreamRequest;
  }

  /**
   * Handles the stream response from the Cohere API.
   * @param {Object} response - the response object
   * @param {import('../../helpers/chat/LLMPerformanceMonitor').MonitoredStream} stream - the stream response from the Cohere API w/tracking
   * @param {Object} responseProps - the response properties
   * @returns {Promise<string>}
   */
  async handleStream(response, stream, responseProps) {
    return new Promise(async (resolve) => {
      const { uuid = v4(), sources = [] } = responseProps;
      let fullText = "";
      let usage = {
        prompt_tokens: 0,
        completion_tokens: 0,
      };

      const handleAbort = () => {
        writeResponseChunk(response, {
          uuid,
          sources,
          type: "abort",
          textResponse: fullText,
          close: true,
          error: false,
        });
        response.removeListener("close", handleAbort);
        stream.endMeasurement(usage);
        resolve(fullText);
      };
      response.on("close", handleAbort);

      try {
        for await (const chat of stream) {
          if (chat.eventType === "stream-end") {
            const usageMetrics = chat?.response?.meta?.tokens || {};
            usage.prompt_tokens = usageMetrics.inputTokens || 0;
            usage.completion_tokens = usageMetrics.outputTokens || 0;
          }

          if (chat.eventType === "text-generation") {
            const text = chat.text;
            fullText += text;

            writeResponseChunk(response, {
              uuid,
              sources,
              type: "textResponseChunk",
              textResponse: text,
              close: false,
              error: false,
            });
          }
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
        stream.endMeasurement(usage);
        resolve(fullText);
      } catch (error) {
        writeResponseChunk(response, {
          uuid,
          sources,
          type: "abort",
          textResponse: null,
          close: true,
          error: error.message,
        });
        response.removeListener("close", handleAbort);
        stream.endMeasurement(usage);
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
  CohereLLM,
};
