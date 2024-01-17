const { chatPrompt } = require("../../chats");

class GeminiLLM {
  constructor(embedder = null, modelPreference = null) {
    if (!process.env.GEMINI_API_KEY)
      throw new Error("No Gemini API key was set.");

    // Docs: https://ai.google.dev/tutorials/node_quickstart
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model =
      modelPreference || process.env.GEMINI_LLM_MODEL_PREF || "gemini-pro";
    this.gemini = genAI.getGenerativeModel({ model: this.model });
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };

    if (!embedder)
      throw new Error(
        "INVALID GEMINI LLM SETUP. No embedding engine has been set. Go to instance settings and set up an embedding interface to use Gemini as your LLM."
      );
    this.embedder = embedder;
    this.defaultTemp = 0.7; // not used for Gemini
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

  promptWindowLimit() {
    switch (this.model) {
      case "gemini-pro":
        return 30_720;
      default:
        return 30_720; // assume a gemini-pro model
    }
  }

  isValidChatCompletionModel(modelName = "") {
    const validModels = ["gemini-pro"];
    return validModels.includes(modelName);
  }

  // Moderation cannot be done with Gemini.
  // Not implemented so must be stubbed
  async isSafe(_input = "") {
    return { safe: true, reasons: [] };
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
    return [
      prompt,
      { role: "assistant", content: "Okay." },
      ...chatHistory,
      { role: "USER_PROMPT", content: userPrompt },
    ];
  }

  // This will take an OpenAi format message array and only pluck valid roles from it.
  formatMessages(messages = []) {
    // Gemini roles are either user || model.
    // and all "content" is relabeled to "parts"
    return messages
      .map((message) => {
        if (message.role === "system")
          return { role: "user", parts: message.content };
        if (message.role === "user")
          return { role: "user", parts: message.content };
        if (message.role === "assistant")
          return { role: "model", parts: message.content };
        return null;
      })
      .filter((msg) => !!msg);
  }

  async sendChat(chatHistory = [], prompt, workspace = {}, rawHistory = []) {
    if (!this.isValidChatCompletionModel(this.model))
      throw new Error(
        `Gemini chat: ${this.model} is not valid for chat completion!`
      );

    const compressedHistory = await this.compressMessages(
      {
        systemPrompt: chatPrompt(workspace),
        chatHistory,
      },
      rawHistory
    );

    const chatThread = this.gemini.startChat({
      history: this.formatMessages(compressedHistory),
    });
    const result = await chatThread.sendMessage(prompt);
    const response = result.response;
    const responseText = response.text();

    if (!responseText) throw new Error("Gemini: No response could be parsed.");

    return responseText;
  }

  async getChatCompletion(messages = [], _opts = {}) {
    if (!this.isValidChatCompletionModel(this.model))
      throw new Error(
        `Gemini chat: ${this.model} is not valid for chat completion!`
      );

    const prompt = messages.find(
      (chat) => chat.role === "USER_PROMPT"
    )?.content;
    const chatThread = this.gemini.startChat({
      history: this.formatMessages(messages),
    });
    const result = await chatThread.sendMessage(prompt);
    const response = result.response;
    const responseText = response.text();

    if (!responseText) throw new Error("Gemini: No response could be parsed.");

    return responseText;
  }

  async streamChat(chatHistory = [], prompt, workspace = {}, rawHistory = []) {
    if (!this.isValidChatCompletionModel(this.model))
      throw new Error(
        `Gemini chat: ${this.model} is not valid for chat completion!`
      );

    const compressedHistory = await this.compressMessages(
      {
        systemPrompt: chatPrompt(workspace),
        chatHistory,
      },
      rawHistory
    );

    const chatThread = this.gemini.startChat({
      history: this.formatMessages(compressedHistory),
    });
    const responseStream = await chatThread.sendMessageStream(prompt);
    if (!responseStream.stream)
      throw new Error("Could not stream response stream from Gemini.");

    return { type: "geminiStream", ...responseStream };
  }

  async streamGetChatCompletion(messages = [], _opts = {}) {
    if (!this.isValidChatCompletionModel(this.model))
      throw new Error(
        `Gemini chat: ${this.model} is not valid for chat completion!`
      );

    const prompt = messages.find(
      (chat) => chat.role === "USER_PROMPT"
    )?.content;
    const chatThread = this.gemini.startChat({
      history: this.formatMessages(messages),
    });
    const responseStream = await chatThread.sendMessageStream(prompt);
    if (!responseStream.stream)
      throw new Error("Could not stream response stream from Gemini.");

    return { type: "geminiStream", ...responseStream };
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
};
