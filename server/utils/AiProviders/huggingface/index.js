const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const { OpenAiEmbedder } = require("../../EmbeddingEngines/openAi");
const { chatPrompt } = require("../../chats");

class HuggingFaceLLM {
  constructor(embedder = null, _modelPreference = null) {
    const { Configuration, OpenAIApi } = require("openai");
    if (!process.env.HUGGING_FACE_LLM_ENDPOINT)
      throw new Error("No HuggingFace Inference Endpoint was set.");
    if (!process.env.HUGGING_FACE_LLM_API_KEY)
      throw new Error("No HuggingFace Access Token was set.");

    const config = new Configuration({
      basePath: `${process.env.HUGGING_FACE_LLM_ENDPOINT}/v1`,
      apiKey: process.env.HUGGING_FACE_LLM_API_KEY,
    });
    this.openai = new OpenAIApi(config);
    // When using HF inference server - the model param is not required so
    // we can stub it here. HF Endpoints can only run one model at a time.
    // We set to 'tgi' so that endpoint for HF can accept message format
    this.model = "tgi";
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };

    if (!embedder)
      console.warn(
        "No embedding provider defined for HuggingFaceLLM - falling back to Native for embedding!"
      );
    this.embedder = !embedder ? new OpenAiEmbedder() : new NativeEmbedder();
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
    return "streamChat" in this && "streamGetChatCompletion" in this;
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

  async isSafe(_input = "") {
    // Not implemented so must be stubbed
    return { safe: true, reasons: [] };
  }

  async sendChat(chatHistory = [], prompt, workspace = {}, rawHistory = []) {
    const textResponse = await this.openai
      .createChatCompletion({
        model: this.model,
        temperature: Number(workspace?.openAiTemp ?? this.defaultTemp),
        n: 1,
        messages: await this.compressMessages(
          {
            systemPrompt: chatPrompt(workspace),
            userPrompt: prompt,
            chatHistory,
          },
          rawHistory
        ),
      })
      .then((json) => {
        const res = json.data;
        if (!res.hasOwnProperty("choices"))
          throw new Error("HuggingFace chat: No results!");
        if (res.choices.length === 0)
          throw new Error("HuggingFace chat: No results length!");
        return res.choices[0].message.content;
      })
      .catch((error) => {
        throw new Error(
          `HuggingFace::createChatCompletion failed with: ${error.message}`
        );
      });

    return textResponse;
  }

  async streamChat(chatHistory = [], prompt, workspace = {}, rawHistory = []) {
    const streamRequest = await this.openai.createChatCompletion(
      {
        model: this.model,
        stream: true,
        temperature: Number(workspace?.openAiTemp ?? this.defaultTemp),
        n: 1,
        messages: await this.compressMessages(
          {
            systemPrompt: chatPrompt(workspace),
            userPrompt: prompt,
            chatHistory,
          },
          rawHistory
        ),
      },
      { responseType: "stream" }
    );
    return { type: "huggingFaceStream", stream: streamRequest };
  }

  async getChatCompletion(messages = null, { temperature = 0.7 }) {
    const { data } = await this.openai.createChatCompletion({
      model: this.model,
      messages,
      temperature,
    });

    if (!data.hasOwnProperty("choices")) return null;
    return data.choices[0].message.content;
  }

  async streamGetChatCompletion(messages = null, { temperature = 0.7 }) {
    const streamRequest = await this.openai.createChatCompletion(
      {
        model: this.model,
        stream: true,
        messages,
        temperature,
      },
      { responseType: "stream" }
    );
    return { type: "huggingFaceStream", stream: streamRequest };
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
