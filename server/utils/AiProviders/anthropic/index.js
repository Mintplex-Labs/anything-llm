const { v4 } = require("uuid");
const { chatPrompt } = require("../../chats");
const {
  writeResponseChunk,
  clientAbortedHandler,
} = require("../../helpers/chat/responses");
class AnthropicLLM {
  constructor(embedder = null, modelPreference = null) {
    if (!process.env.ANTHROPIC_API_KEY)
      throw new Error("No Anthropic API key was set.");

    // Docs: https://www.npmjs.com/package/@anthropic-ai/sdk
    const AnthropicAI = require("@anthropic-ai/sdk");
    const anthropic = new AnthropicAI({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    this.anthropic = anthropic;
    this.model =
      modelPreference || process.env.ANTHROPIC_MODEL_PREF || "claude-2.0";
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };

    if (!embedder)
      throw new Error(
        "INVALID ANTHROPIC SETUP. No embedding engine has been set. Go to instance settings and set up an embedding interface to use Anthropic as your LLM."
      );
    this.embedder = embedder;
    this.answerKey = v4().split("-")[0];
    this.defaultTemp = 0.7;
  }

  streamingEnabled() {
    return "streamChat" in this && "streamGetChatCompletion" in this;
  }

  promptWindowLimit() {
    switch (this.model) {
      case "claude-instant-1.2":
        return 100_000;
      case "claude-2.0":
        return 100_000;
      case "claude-2.1":
        return 200_000;
      case "claude-3-opus-20240229":
        return 200_000;
      case "claude-3-sonnet-20240229":
        return 200_000;
      case "claude-3-haiku-20240307":
        return 200_000;
      default:
        return 100_000; // assume a claude-instant-1.2 model
    }
  }

  isValidChatCompletionModel(modelName = "") {
    const validModels = [
      "claude-instant-1.2",
      "claude-2.0",
      "claude-2.1",
      "claude-3-opus-20240229",
      "claude-3-sonnet-20240229",
      "claude-3-haiku-20240307",
    ];
    return validModels.includes(modelName);
  }

  // Moderation can be done with Anthropic, but its not really "exact" so we skip it
  // https://docs.anthropic.com/claude/docs/content-moderation
  async isSafe(_input = "") {
    // Not implemented so must be stubbed
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

    return [prompt, ...chatHistory, { role: "user", content: userPrompt }];
  }

  async getChatCompletion(messages = null, { temperature = 0.7 }) {
    if (!this.isValidChatCompletionModel(this.model))
      throw new Error(
        `Anthropic chat: ${this.model} is not valid for chat completion!`
      );

    try {
      const response = await this.anthropic.messages.create({
        model: this.model,
        max_tokens: 4096,
        system: messages[0].content, // Strip out the system message
        messages: messages.slice(1), // Pop off the system message
        temperature: Number(temperature ?? this.defaultTemp),
      });

      return response.content[0].text;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async streamChat(chatHistory = [], prompt, workspace = {}, rawHistory = []) {
    if (!this.isValidChatCompletionModel(this.model))
      throw new Error(
        `Anthropic chat: ${this.model} is not valid for chat completion!`
      );

    const messages = await this.compressMessages(
      {
        systemPrompt: chatPrompt(workspace),
        userPrompt: prompt,
        chatHistory,
      },
      rawHistory
    );

    const streamRequest = await this.anthropic.messages.stream({
      model: this.model,
      max_tokens: 4096,
      system: messages[0].content, // Strip out the system message
      messages: messages.slice(1), // Pop off the system message
      temperature: Number(workspace?.openAiTemp ?? this.defaultTemp),
    });
    return streamRequest;
  }

  async streamGetChatCompletion(messages = null, { temperature = 0.7 }) {
    if (!this.isValidChatCompletionModel(this.model))
      throw new Error(
        `OpenAI chat: ${this.model} is not valid for chat completion!`
      );

    const streamRequest = await this.anthropic.messages.stream({
      model: this.model,
      max_tokens: 4096,
      system: messages[0].content, // Strip out the system message
      messages: messages.slice(1), // Pop off the system message
      temperature: Number(temperature ?? this.defaultTemp),
    });
    return streamRequest;
  }

  handleStream(response, stream, responseProps) {
    return new Promise((resolve) => {
      let fullText = "";
      const { uuid = v4(), sources = [] } = responseProps;

      // Establish listener to early-abort a streaming response
      // in case things go sideways or the user does not like the response.
      // We preserve the generated text but continue as if chat was completed
      // to preserve previously generated content.
      const handleAbort = () => clientAbortedHandler(resolve, fullText);
      response.on("close", handleAbort);

      stream.on("streamEvent", (message) => {
        const data = message;
        if (
          data.type === "content_block_delta" &&
          data.delta.type === "text_delta"
        ) {
          const text = data.delta.text;
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

        if (
          message.type === "message_stop" ||
          (data.stop_reason && data.stop_reason === "end_turn")
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
          resolve(fullText);
        }
      });
    });
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

  async compressMessages(promptArgs = {}, rawHistory = []) {
    const { messageStringCompressor } = require("../../helpers/chat");
    const compressedPrompt = await messageStringCompressor(
      this,
      promptArgs,
      rawHistory
    );
    return compressedPrompt;
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
  AnthropicLLM,
};
