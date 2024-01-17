const { chatPrompt } = require("../../chats");

class MistralLLM {
  constructor(embedder = null, modelPreference = null) {
    const { Configuration, OpenAIApi } = require("openai");
    if (!process.env.MISTRAL_API_KEY)
      throw new Error("No Mistral API key was set.");

    const config = new Configuration({
      basePath: "https://api.mistral.ai/v1",
      apiKey: process.env.MISTRAL_API_KEY,
    });
    this.openai = new OpenAIApi(config);
    this.model =
      modelPreference || process.env.MISTRAL_MODEL_PREF || "mistral-tiny";
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };

    if (!embedder)
      console.warn(
        "No embedding provider defined for MistralLLM - falling back to OpenAiEmbedder for embedding!"
      );
    this.embedder = embedder;
    this.defaultTemp = 0.0;
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
    return 32000;
  }

  async isValidChatCompletionModel(modelName = "") {
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

  async isSafe(_ = "") {
    return { safe: true, reasons: [] };
  }

  async sendChat(chatHistory = [], prompt, workspace = {}, rawHistory = []) {
    if (!(await this.isValidChatCompletionModel(this.model)))
      throw new Error(
        `Mistral chat: ${this.model} is not valid for chat completion!`
      );

    const textResponse = await this.openai
      .createChatCompletion({
        model: this.model,
        temperature: Number(workspace?.openAiTemp ?? this.defaultTemp),
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
          throw new Error("Mistral chat: No results!");
        if (res.choices.length === 0)
          throw new Error("Mistral chat: No results length!");
        return res.choices[0].message.content;
      })
      .catch((error) => {
        throw new Error(
          `Mistral::createChatCompletion failed with: ${error.message}`
        );
      });

    return textResponse;
  }

  async streamChat(chatHistory = [], prompt, workspace = {}, rawHistory = []) {
    if (!(await this.isValidChatCompletionModel(this.model)))
      throw new Error(
        `Mistral chat: ${this.model} is not valid for chat completion!`
      );

    const streamRequest = await this.openai.createChatCompletion(
      {
        model: this.model,
        stream: true,
        temperature: Number(workspace?.openAiTemp ?? this.defaultTemp),
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
        `Mistral chat: ${this.model} is not valid for chat completion!`
      );

    const { data } = await this.openai.createChatCompletion({
      model: this.model,
      messages,
      temperature,
    });

    if (!data.hasOwnProperty("choices")) return null;
    return data.choices[0].message.content;
  }

  async streamGetChatCompletion(messages = null, { temperature = 0.7 }) {
    if (!(await this.isValidChatCompletionModel(this.model)))
      throw new Error(
        `Mistral chat: ${this.model} is not valid for chat completion!`
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
  MistralLLM,
};
