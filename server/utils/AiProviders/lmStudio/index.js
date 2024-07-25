const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
  handleDefaultStreamResponseV2,
} = require("../../helpers/chat/responses");

//  hybrid of openAi LLM chat completion for LMStudio
class LMStudioLLM {
  constructor(embedder = null, _modelPreference = null) {
    if (!process.env.LMSTUDIO_BASE_PATH)
      throw new Error("No LMStudio API Base Path was set.");

    const { OpenAI: OpenAIApi } = require("openai");
    this.lmstudio = new OpenAIApi({
      baseURL: process.env.LMSTUDIO_BASE_PATH?.replace(/\/+$/, ""), // here is the URL to your LMStudio instance
      apiKey: null,
    });

    // Prior to LMStudio 0.2.17 the `model` param was not required and you could pass anything
    // into that field and it would work. On 0.2.17 LMStudio introduced multi-model chat
    // which now has a bug that reports the server model id as "Loaded from Chat UI"
    // and any other value will crash inferencing. So until this is patched we will
    // try to fetch the `/models` and have the user set it, or just fallback to "Loaded from Chat UI"
    // which will not impact users with <v0.2.17 and should work as well once the bug is fixed.
    this.model = process.env.LMSTUDIO_MODEL_PREF || "Loaded from Chat UI";
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };

    this.embedder = embedder ?? new NativeEmbedder();
    this.defaultTemp = 0.7;
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

  // Ensure the user set a value for the token limit
  // and if undefined - assume 4096 window.
  promptWindowLimit() {
    const limit = process.env.LMSTUDIO_MODEL_TOKEN_LIMIT || 4096;
    if (!limit || isNaN(Number(limit)))
      throw new Error("No LMStudio token context limit was set.");
    return Number(limit);
  }

  async isValidChatCompletionModel(_ = "") {
    // LMStudio may be anything. The user must do it correctly.
    // See comment about this.model declaration in constructor
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

  async getChatCompletion(messages = null, { temperature = 0.7 }) {
    if (!this.model)
      throw new Error(
        `LMStudio chat: ${this.model} is not valid or defined model for chat completion!`
      );

    const result = await this.lmstudio.chat.completions.create({
      model: this.model,
      messages,
      temperature,
    });

    if (!result.hasOwnProperty("choices") || result.choices.length === 0)
      return null;
    return result.choices[0].message.content;
  }

  async streamGetChatCompletion(messages = null, { temperature = 0.7 }) {
    if (!this.model)
      throw new Error(
        `LMStudio chat: ${this.model} is not valid or defined model for chat completion!`
      );

    const streamRequest = await this.lmstudio.chat.completions.create({
      model: this.model,
      stream: true,
      messages,
      temperature,
    });
    return streamRequest;
  }

  handleStream(response, stream, responseProps) {
    return handleDefaultStreamResponseV2(response, stream, responseProps);
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
  LMStudioLLM,
};
