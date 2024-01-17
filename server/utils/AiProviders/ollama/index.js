const { chatPrompt } = require("../../chats");
const { StringOutputParser } = require("langchain/schema/output_parser");

// Docs: https://github.com/jmorganca/ollama/blob/main/docs/api.md
class OllamaAILLM {
  constructor(embedder = null, modelPreference = null) {
    if (!process.env.OLLAMA_BASE_PATH)
      throw new Error("No Ollama Base Path was set.");

    this.basePath = process.env.OLLAMA_BASE_PATH;
    this.model = modelPreference || process.env.OLLAMA_MODEL_PREF;
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };

    if (!embedder)
      throw new Error(
        "INVALID OLLAMA SETUP. No embedding engine has been set. Go to instance settings and set up an embedding interface to use Ollama as your LLM."
      );
    this.embedder = embedder;
  }

  #ollamaClient({ temperature = 0.07 }) {
    const { ChatOllama } = require("langchain/chat_models/ollama");
    return new ChatOllama({
      baseUrl: this.basePath,
      model: this.model,
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
    } = require("langchain/schema");
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
    return "streamChat" in this && "streamGetChatCompletion" in this;
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

  async isSafe(_input = "") {
    // Not implemented so must be stubbed
    return { safe: true, reasons: [] };
  }

  async sendChat(chatHistory = [], prompt, workspace = {}, rawHistory = []) {
    const messages = await this.compressMessages(
      {
        systemPrompt: chatPrompt(workspace),
        userPrompt: prompt,
        chatHistory,
      },
      rawHistory
    );

    const model = this.#ollamaClient({
      temperature: Number(workspace?.openAiTemp ?? 0.7),
    });
    const textResponse = await model
      .pipe(new StringOutputParser())
      .invoke(this.#convertToLangchainPrototypes(messages));

    if (!textResponse.length)
      throw new Error(`Ollama::sendChat text response was empty.`);

    return textResponse;
  }

  async streamChat(chatHistory = [], prompt, workspace = {}, rawHistory = []) {
    const messages = await this.compressMessages(
      {
        systemPrompt: chatPrompt(workspace),
        userPrompt: prompt,
        chatHistory,
      },
      rawHistory
    );

    const model = this.#ollamaClient({
      temperature: Number(workspace?.openAiTemp ?? 0.7),
    });
    const stream = await model
      .pipe(new StringOutputParser())
      .stream(this.#convertToLangchainPrototypes(messages));
    return stream;
  }

  async getChatCompletion(messages = null, { temperature = 0.7 }) {
    const model = this.#ollamaClient({ temperature });
    const textResponse = await model
      .pipe(new StringOutputParser())
      .invoke(this.#convertToLangchainPrototypes(messages));

    if (!textResponse.length)
      throw new Error(`Ollama::getChatCompletion text response was empty.`);

    return textResponse;
  }

  async streamGetChatCompletion(messages = null, { temperature = 0.7 }) {
    const model = this.#ollamaClient({ temperature });
    const stream = await model
      .pipe(new StringOutputParser())
      .stream(this.#convertToLangchainPrototypes(messages));
    return stream;
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
