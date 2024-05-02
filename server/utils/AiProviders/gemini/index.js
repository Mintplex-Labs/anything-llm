const {
  writeResponseChunk,
  clientAbortedHandler,
} = require("../../helpers/chat/responses");

class GeminiLLM {
  constructor(embedder = null, modelPreference = null) {
    if (!process.env.GEMINI_API_KEY)
      throw new Error("No Gemini API key was set.");

    // Docs: https://ai.google.dev/tutorials/node_quickstart
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model =
      modelPreference || process.env.GEMINI_LLM_MODEL_PREF || "gemini-pro";
    this.gemini = genAI.getGenerativeModel(
      { model: this.model },
      {
        // Gemini-1.5-pro is only available on the v1beta API.
        apiVersion: this.model === "gemini-1.5-pro-latest" ? "v1beta" : "v1",
      }
    );
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
    return "streamGetChatCompletion" in this;
  }

  promptWindowLimit() {
    switch (this.model) {
      case "gemini-pro":
        return 30_720;
      case "gemini-1.5-pro-latest":
        return 1_048_576;
      default:
        return 30_720; // assume a gemini-pro model
    }
  }

  isValidChatCompletionModel(modelName = "") {
    const validModels = ["gemini-pro", "gemini-1.5-pro-latest"];
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
    const allMessages = messages
      .map((message) => {
        if (message.role === "system")
          return { role: "user", parts: [{ text: message.content }] };
        if (message.role === "user")
          return { role: "user", parts: [{ text: message.content }] };
        if (message.role === "assistant")
          return { role: "model", parts: [{ text: message.content }] };
        return null;
      })
      .filter((msg) => !!msg);

    // Specifically, Google cannot have the last sent message be from a user with no assistant reply
    // otherwise it will crash. So if the last item is from the user, it was not completed so pop it off
    // the history.
    if (
      allMessages.length > 0 &&
      allMessages[allMessages.length - 1].role === "user"
    )
      allMessages.pop();
    return allMessages;
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

    return responseStream.stream;
  }

  async compressMessages(promptArgs = {}, rawHistory = []) {
    const { messageArrayCompressor } = require("../../helpers/chat");
    const messageArray = this.constructPrompt(promptArgs);
    return await messageArrayCompressor(this, messageArray, rawHistory);
  }

  handleStream(response, stream, responseProps) {
    const { uuid = uuidv4(), sources = [] } = responseProps;

    return new Promise(async (resolve) => {
      let fullText = "";

      // Establish listener to early-abort a streaming response
      // in case things go sideways or the user does not like the response.
      // We preserve the generated text but continue as if chat was completed
      // to preserve previously generated content.
      const handleAbort = () => clientAbortedHandler(resolve, fullText);
      response.on("close", handleAbort);

      for await (const chunk of stream) {
        let chunkText;
        try {
          // Due to content sensitivity we cannot always get the function .text();
          // https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/configure-safety-attributes#gemini-TASK-samples-nodejs
          // and it is not possible to unblock or disable this safety protocol without being allowlisted by Google.
          chunkText = chunk.text();
        } catch (e) {
          chunkText = e.message;
          writeResponseChunk(response, {
            uuid,
            sources: [],
            type: "abort",
            textResponse: null,
            close: true,
            error: e.message,
          });
          resolve(e.message);
          return;
        }

        fullText += chunkText;
        writeResponseChunk(response, {
          uuid,
          sources: [],
          type: "textResponseChunk",
          textResponse: chunk.text(),
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
}

module.exports = {
  GeminiLLM,
};
