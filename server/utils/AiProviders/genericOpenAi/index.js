const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const { chatPrompt } = require("../../chats");
const { handleDefaultStreamResponse } = require("../../helpers/chat/responses");

class GenericOpenAiLLM {
  constructor(embedder = null, modelPreference = null) {
    const { Configuration, OpenAIApi } = require("openai");
    if (!process.env.GENERIC_OPEN_AI_BASE_PATH)
      throw new Error(
        "GenericOpenAI must have a valid base path to use for the api."
      );

    this.basePath = process.env.GENERIC_OPEN_AI_BASE_PATH;
    const config = new Configuration({
      basePath: this.basePath,
      apiKey: process.env.GENERIC_OPEN_AI_API_KEY ?? null,
    });
    this.openai = new OpenAIApi(config);
    this.model =
      modelPreference ?? process.env.GENERIC_OPEN_AI_MODEL_PREF ?? null;
    if (!this.model)
      throw new Error("GenericOpenAI must have a valid model set.");
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };

    if (!embedder)
      console.warn(
        "No embedding provider defined for GenericOpenAiLLM - falling back to NativeEmbedder for embedding!"
      );
    this.embedder = !embedder ? new NativeEmbedder() : embedder;
    this.defaultTemp = 0.7;
    this.log(`Inference API: ${this.basePath} Model: ${this.model}`);
  }

  log(text, ...args) {
    console.log(`\x1b[36m[${this.constructor.name}]\x1b[0m ${text}`, ...args);
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
    const limit = process.env.GENERIC_OPEN_AI_MODEL_TOKEN_LIMIT || 4096;
    if (!limit || isNaN(Number(limit)))
      throw new Error("No token context limit was set.");
    return Number(limit);
  }

  // Short circuit if name has 'gpt' since we now fetch models from OpenAI API
  // via the user API key, so the model must be relevant and real.
  // and if somehow it is not, chat will fail but that is caught.
  // we don't want to hit the OpenAI api every chat because it will get spammed
  // and introduce latency for no reason.
  async isValidChatCompletionModel(modelName = "") {
    const isPreset = modelName.toLowerCase().includes("gpt");
    if (isPreset) return true;

    const model = await this.openai
      .retrieveModel(modelName)
      .then((res) => res.data)
      .catch(() => null);
    return !!model;
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
    if (!(await this.isValidChatCompletionModel(this.model)))
      throw new Error(
        `GenericOpenAI chat: ${this.model} is not valid for chat completion!`
      );

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
          throw new Error("GenericOpenAI chat: No results!");
        if (res.choices.length === 0)
          throw new Error("GenericOpenAI chat: No results length!");
        return res.choices[0].message.content;
      })
      .catch((error) => {
        throw new Error(
          `GenericOpenAI::createChatCompletion failed with: ${error.message}`
        );
      });

    return textResponse;
  }

  async streamChat(chatHistory = [], prompt, workspace = {}, rawHistory = []) {
    if (!(await this.isValidChatCompletionModel(this.model)))
      throw new Error(
        `GenericOpenAI chat: ${this.model} is not valid for chat completion!`
      );

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
    return streamRequest;
  }

  async getChatCompletion(messages = null, { temperature = 0.7 }) {
    if (!(await this.isValidChatCompletionModel(this.model)))
      throw new Error(
        `GenericOpenAI chat: ${this.model} is not valid for chat completion!`
      );

    const { data } = await this.openai
      .createChatCompletion({
        model: this.model,
        messages,
        temperature,
      })
      .catch((e) => {
        throw new Error(e.response.data.error.message);
      });

    if (!data.hasOwnProperty("choices")) return null;
    return data.choices[0].message.content;
  }

  async streamGetChatCompletion(messages = null, { temperature = 0.7 }) {
    if (!(await this.isValidChatCompletionModel(this.model)))
      throw new Error(
        `GenericOpenAI chat: ${this.model} is not valid for chat completion!`
      );

    const streamRequest = await this.openai.createChatCompletion(
      {
        model: this.model,
        stream: true,
        messages,
        temperature,
      },
      { responseType: "stream" }
    );
    return streamRequest;
  }

  handleStream(response, stream, responseProps) {
    return handleDefaultStreamResponse(response, stream, responseProps);
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
  GenericOpenAiLLM,
};
