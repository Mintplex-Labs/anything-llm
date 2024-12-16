const fs = require("fs");
const path = require("path");
const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
  writeResponseChunk,
  clientAbortedHandler,
} = require("../../helpers/chat/responses");
const {
  LLMPerformanceMonitor,
} = require("../../helpers/chat/LLMPerformanceMonitor");

// Docs: https://js.langchain.com/docs/integrations/chat/llama_cpp
const ChatLlamaCpp = (...args) =>
  import("@langchain/community/chat_models/llama_cpp").then(
    ({ ChatLlamaCpp }) => new ChatLlamaCpp(...args)
  );

class NativeLLM {
  constructor(embedder = null, modelPreference = null) {
    if (!process.env.NATIVE_LLM_MODEL_PREF)
      throw new Error("No local Llama model was set.");

    this.model = modelPreference || process.env.NATIVE_LLM_MODEL_PREF || null;
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };
    this.embedder = embedder ?? new NativeEmbedder();
    this.cacheDir = path.resolve(
      process.env.STORAGE_DIR
        ? path.resolve(process.env.STORAGE_DIR, "models", "downloaded")
        : path.resolve(__dirname, `../../../storage/models/downloaded`)
    );

    // Make directory when it does not exist in existing installations
    if (!fs.existsSync(this.cacheDir)) fs.mkdirSync(this.cacheDir);
    this.defaultTemp = 0.7;
  }

  async #initializeLlamaModel(temperature = 0.7) {
    const modelPath = path.join(this.cacheDir, this.model);
    if (!fs.existsSync(modelPath))
      throw new Error(
        `Local Llama model ${this.model} was not found in storage!`
      );

    global.llamaModelInstance = await ChatLlamaCpp({
      modelPath,
      temperature,
      useMlock: true,
    });
  }

  // If the model has been loaded once, it is in the memory now
  // so we can skip  re-loading it and instead go straight to inference.
  // Note: this will break temperature setting hopping between workspaces with different temps.
  async #llamaClient({ temperature = 0.7 }) {
    if (global.llamaModelInstance) return global.llamaModelInstance;
    await this.#initializeLlamaModel(temperature);
    return global.llamaModelInstance;
  }

  #convertToLangchainPrototypes(chats = []) {
    const {
      HumanMessage,
      SystemMessage,
      AIMessage,
    } = require("@langchain/core/messages");
    const langchainChats = [];
    const roleToMessageMap = {
      system: SystemMessage,
      user: HumanMessage,
      assistant: AIMessage,
    };

    for (const chat of chats) {
      if (!roleToMessageMap.hasOwnProperty(chat.role)) continue;
      const MessageClass = roleToMessageMap[chat.role];
      langchainChats.push(new MessageClass({ content: chat.content }));
    }

    return langchainChats;
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
    const limit = process.env.NATIVE_LLM_MODEL_TOKEN_LIMIT || 4096;
    if (!limit || isNaN(Number(limit)))
      throw new Error("No NativeAI token context limit was set.");
    return Number(limit);
  }

  // Ensure the user set a value for the token limit
  promptWindowLimit() {
    const limit = process.env.NATIVE_LLM_MODEL_TOKEN_LIMIT || 4096;
    if (!limit || isNaN(Number(limit)))
      throw new Error("No NativeAI token context limit was set.");
    return Number(limit);
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
    const model = await this.#llamaClient({ temperature });
    const result = await LLMPerformanceMonitor.measureAsyncFunction(
      model.call(messages)
    );

    if (!result.output?.content) return null;

    const promptTokens = LLMPerformanceMonitor.countTokens(messages);
    const completionTokens = LLMPerformanceMonitor.countTokens(
      result.output.content
    );
    return {
      textResponse: result.output.content,
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
    const model = await this.#llamaClient({ temperature });
    const measuredStreamRequest = await LLMPerformanceMonitor.measureStream(
      model.stream(messages),
      messages
    );
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
    const { uuid = uuidv4(), sources = [] } = responseProps;

    return new Promise(async (resolve) => {
      let fullText = "";

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

      for await (const chunk of stream) {
        if (chunk === undefined)
          throw new Error(
            "Stream returned undefined chunk. Aborting reply - check model provider logs."
          );

        const content = chunk.hasOwnProperty("content") ? chunk.content : chunk;
        fullText += content;
        writeResponseChunk(response, {
          uuid,
          sources: [],
          type: "textResponseChunk",
          textResponse: content,
          close: false,
          error: false,
        });
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
    const compressedMessages = await messageArrayCompressor(
      this,
      messageArray,
      rawHistory
    );
    return this.#convertToLangchainPrototypes(compressedMessages);
  }
}

module.exports = {
  NativeLLM,
};
