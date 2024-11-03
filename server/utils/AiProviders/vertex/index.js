const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
  writeResponseChunk,
  clientAbortedHandler,
} = require("../../helpers/chat/responses");
const { MODEL_MAP } = require("../modelMap");

class VertexLLM {
  constructor(embedder = null, modelPreference = null) {
    const { VertexAI } = require("@google-cloud/vertexai");
    const vertexAI = new VertexAI({
      project: process.env.VERTEX_PROJECT_NAME,
      location: process.env.VERTEX_REGION,
    });
    this.model =
      modelPreference ||
      process.env.VERTEX_LLM_MODEL_PREF ||
      "gemini-1.5-flash";
    this.vertex = vertexAI.getGenerativeModel({
      model: this.model,
    });
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };

    this.embedder = embedder ?? new NativeEmbedder();
    this.defaultTemp = 0.7;
    this.safetyThreshold = this.#fetchSafetyThreshold();
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

  // BLOCK_NONE can be a special candidate for some fields
  // https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/configure-safety-attributes#how_to_remove_automated_response_blocking_for_select_safety_attributes
  // so if you are wondering why BLOCK_NONE still failed, the link above will explain why.
  #fetchSafetyThreshold() {
    const threshold =
      process.env.GEMINI_SAFETY_SETTING ?? "BLOCK_MEDIUM_AND_ABOVE";
    const safetyThresholds = [
      "BLOCK_NONE",
      "BLOCK_ONLY_HIGH",
      "BLOCK_MEDIUM_AND_ABOVE",
      "BLOCK_LOW_AND_ABOVE",
    ];
    return safetyThresholds.includes(threshold)
      ? threshold
      : "BLOCK_MEDIUM_AND_ABOVE";
  }

  #safetySettings() {
    return [
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: this.safetyThreshold,
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: this.safetyThreshold,
      },
      { category: "HARM_CATEGORY_HARASSMENT", threshold: this.safetyThreshold },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: this.safetyThreshold,
      },
    ];
  }

  streamingEnabled() {
    return "streamGetChatCompletion" in this;
  }

  static promptWindowLimit(modelName) {
    return MODEL_MAP.vertex[modelName] ?? 30_720;
  }

  promptWindowLimit() {
    return MODEL_MAP.vertex[this.model] ?? 30_720;
  }

  isValidChatCompletionModel(modelName = "") {
    const validModels = [
      "gemini-1.5-flash",
      "gemini-1.5-pro",
      "gemini-1.5-flash-001",
      "gemini-1.5-pro-001",
      "gemini-1.5-flash-002",
      "gemini-1.5-pro-002",
    ];
    return validModels.includes(modelName);
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

    const content = [{ text: userPrompt }];
    for (let attachment of attachments) {
      content.push({
        inlineData: {
          data: attachment.contentString.split("base64,")[1],
          mimeType: attachment.mime,
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
      { role: "assistant", content: "Okay." },
      ...chatHistory,
      {
        role: "USER_PROMPT",
        content: this.#generateContent({ userPrompt, attachments }),
      },
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

    // Validate that after every user message, there is a model message
    // sometimes when using gemini we try to compress messages in order to retain as
    // much context as possible but this may mess up the order of the messages that the gemini model expects
    // we do this check to work around the edge case where 2 user prompts may be next to each other, in the message array
    for (let i = 0; i < allMessages.length; i++) {
      if (
        allMessages[i].role === "user" &&
        i < allMessages.length - 1 &&
        allMessages[i + 1].role !== "model"
      ) {
        allMessages.splice(i + 1, 0, {
          role: "model",
          parts: [{ text: "Okay." }],
        });
      }
    }

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
    const chatThread = this.vertex.startChat({
      history: this.formatMessages(messages),
      safetySettings: this.#safetySettings(),
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
    const chatThread = this.vertex.startChat({
      history: this.formatMessages(messages),
      safetySettings: this.#safetySettings(),
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

  async handleStream(response, stream, responseProps) {
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
        try {
          for (const part of chunk.candidates[0].content.parts) {
            fullText += part.text;
            writeResponseChunk(response, {
              uuid,
              sources: [],
              type: "textResponseChunk",
              textResponse: part.text,
              close: false,
              error: false,
            });
          }
        } catch (e) {
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
      }

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
  VertexLLM,
};
