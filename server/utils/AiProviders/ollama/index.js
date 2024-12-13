const { StringOutputParser } = require("@langchain/core/output_parsers");
const {
  writeResponseChunk,
  clientAbortedHandler,
} = require("../../helpers/chat/responses");
const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
  LLMPerformanceMonitor,
} = require("../../helpers/chat/LLMPerformanceMonitor");

// Docs: https://github.com/jmorganca/ollama/blob/main/docs/api.md
class OllamaAILLM {
  constructor(embedder = null, modelPreference = null) {
    if (!process.env.OLLAMA_BASE_PATH)
      throw new Error("No Ollama Base Path was set.");

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

    this.embedder = embedder ?? new NativeEmbedder();
    this.defaultTemp = 0.7;
  }

  #ollamaClient({ temperature = 0.07 }) {
    const { ChatOllama } = require("@langchain/community/chat_models/ollama");
    return new ChatOllama({
      baseUrl: this.basePath,
      model: this.model,
      keepAlive: this.keepAlive,
      useMLock: true,
      // There are currently only two performance settings so if its not "base" - its max context.
      ...(this.performanceMode === "base"
        ? {}
        : { numCtx: this.promptWindowLimit() }),
      temperature,
    });
  }

  // For streaming we use Langchain's wrapper to handle weird chunks
  // or otherwise absorb headaches that can arise from Ollama models
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
   * @returns {string|object[]}
   */
  #generateContent({ userPrompt, attachments = [] }) {
    if (!attachments.length) {
      return { content: userPrompt };
    }

    const content = [{ type: "text", text: userPrompt }];
    for (let attachment of attachments) {
      content.push({
        type: "image_url",
        image_url: attachment.contentString,
      });
    }
    return { content: content.flat() };
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
        ...this.#generateContent({ userPrompt, attachments }),
      },
    ];
  }

  async getChatCompletion(messages = null, { temperature = 0.7 }) {
    const model = this.#ollamaClient({ temperature });
    const result = await LLMPerformanceMonitor.measureAsyncFunction(
      model
        .pipe(new StringOutputParser())
        .invoke(this.#convertToLangchainPrototypes(messages))
        .catch((e) => {
          throw new Error(
            `Ollama::getChatCompletion failed to communicate with Ollama. ${e.message}`
          );
        })
    );

    if (!result.output || !result.output.length)
      throw new Error(`Ollama::getChatCompletion text response was empty.`);

    const promptTokens = LLMPerformanceMonitor.countTokens(messages);
    const completionTokens = LLMPerformanceMonitor.countTokens(result.output);

    return {
      textResponse: result.output,
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
    const model = this.#ollamaClient({ temperature });
    const measuredStreamRequest = await LLMPerformanceMonitor.measureStream(
      model
        .pipe(new StringOutputParser())
        .stream(this.#convertToLangchainPrototypes(messages)),
      messages,
      true
    );
    return measuredStreamRequest;
  }

  handleStream(response, stream, responseProps) {
    const { uuid = uuidv4(), sources = [] } = responseProps;

    return new Promise(async (resolve) => {
      let fullText = "";
      let usage = {};

      const handleAbort = () => {
        usage.completion_tokens = LLMPerformanceMonitor.countTokens(fullText);
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

          const content = chunk.hasOwnProperty("content")
            ? chunk.content
            : chunk;
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
        usage.completion_tokens = LLMPerformanceMonitor.countTokens(fullText);
        stream?.endMeasurement(usage);
        resolve(fullText);
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
