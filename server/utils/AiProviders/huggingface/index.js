const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
  handleDefaultStreamResponseV2,
} = require("../../helpers/chat/responses");

class HuggingFaceLLM {
  constructor(embedder = null, _modelPreference = null) {
    if (!process.env.HUGGING_FACE_LLM_ENDPOINT)
      throw new Error("No HuggingFace Inference Endpoint was set.");
    if (!process.env.HUGGING_FACE_LLM_API_KEY)
      throw new Error("No HuggingFace Access Token was set.");
    const { OpenAI: OpenAIApi } = require("openai");

    this.openai = new OpenAIApi({
      baseURL: `${process.env.HUGGING_FACE_LLM_ENDPOINT}/v1`,
      apiKey: process.env.HUGGING_FACE_LLM_API_KEY,
    });
    // When using HF inference server - the model param is not required so
    // we can stub it here. HF Endpoints can only run one model at a time.
    // We set to 'tgi' so that endpoint for HF can accept message format
    this.model = "tgi";
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };

    this.embedder = embedder ?? new NativeEmbedder();
    this.defaultTemp = 0.2;
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
    const limit = process.env.HUGGING_FACE_LLM_TOKEN_LIMIT || 4096;
    if (!limit || isNaN(Number(limit)))
      throw new Error("No HuggingFace token context limit was set.");
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
    // System prompt it not enabled for HF model chats
    const prompt = {
      role: "user",
      content: `${systemPrompt}${this.#appendContext(contextTexts)}`,
    };
    const assistantResponse = {
      role: "assistant",
      content: "Okay, I will follow those instructions",
    };
    return [
      prompt,
      assistantResponse,
      ...chatHistory,
      { role: "user", content: userPrompt },
    ];
  }

  async getChatCompletion(messages = null, { temperature = 0.7 }) {
    const result = await this.openai.createChatCompletion({
      model: this.model,
      messages,
      temperature,
    });

    if (!result.hasOwnProperty("choices") || result.choices.length === 0)
      return null;
    return result.choices[0].message.content;
  }

  async streamGetChatCompletion(messages = null, { temperature = 0.7 }) {
    const streamRequest = await this.openai.chat.completions.create({
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
  HuggingFaceLLM,
};
