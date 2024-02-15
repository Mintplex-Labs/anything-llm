const { OpenAiEmbedder } = require("../../EmbeddingEngines/openAi");
const { chatPrompt } = require("../../chats");
const { handleDefaultStreamResponse } = require("../../helpers/chat/responses");

class OpenAiLLM {
  constructor(embedder = null, modelPreference = null) {
    const OpenAI = require("openai");
    if (!process.env.OPEN_AI_KEY) throw new Error("No OpenAI API key was set.");

    this.openai = new OpenAI({
      apiKey: process.env.OPEN_AI_KEY,
    })

    this.model =
      modelPreference || process.env.OPEN_MODEL_PREF || "gpt-3.5-turbo";
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };

    this.embedder = !embedder ? new OpenAiEmbedder() : embedder;
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
    return "streamChat" in this && "streamGetChatCompletion" in this;
  }

  promptWindowLimit() {
    switch (this.model) {
      case "gpt-3.5-turbo":
        return 4096;
      case "gpt-3.5-turbo-1106":
        return 16385;
      case "gpt-4":
        return 8192;
      case "gpt-4-1106-preview":
        return 128000;
      case "gpt-4-turbo-preview":
        return 128000;
      case "gpt-4-32k":
        return 32000;
      default:
        return 4096; // assume a fine-tune 3.5
    }
  }

  async isValidChatCompletionModel(modelName = "") {
    const validModels = [
      "gpt-4",
      "gpt-3.5-turbo",
      "gpt-3.5-turbo-1106",
      "gpt-4-1106-preview",
      "gpt-4-turbo-preview",
      "gpt-4-32k",
    ];
    const isPreset = validModels.some((model) => modelName === model);
    if (isPreset) return true;

    const model = await openai.models.list()
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

  async isSafe(input = "") {
    const { flagged = false, categories = {} } = await this.openai
      .moderations.create({ input })
      .then((res) => {
        if (!res.hasOwnProperty("results"))
          throw new Error("OpenAI moderations: No results!");
        if (res.results.length === 0)
          throw new Error("OpenAI moderations: No results length!");
        return res.results[0];
      })
      .catch((error) => {
        throw new Error(
          `OpenAI::moderations failed with: ${error.message}`
        );
      });

    if (!flagged) return { safe: true, reasons: [] };
    const reasons = Object.keys(categories)
      .map((category) => {
        const value = categories[category];
        if (value === true) {
          return category.replace("/", " or ");
        } else {
          return null;
        }
      })
      .filter((reason) => !!reason);

    return { safe: false, reasons };
  }

  async sendChat(chatHistory = [], prompt, workspace = {}, rawHistory = []) {
    if (!(await this.isValidChatCompletionModel(this.model)))
      throw new Error(
        `OpenAI chat: ${this.model} is not valid for chat completion!`
      );

    const textResponse = await this.openai
      .chat.completions.create({
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
          throw new Error("OpenAI chat: No results!");
        if (res.choices.length === 0)
          throw new Error("OpenAI chat: No results length!");
        return res.choices[0].message.content;
      })
      .catch((error) => {
        throw new Error(
          `OpenAI::createChatCompletion failed with: ${error.message}`
        );
      });

    return textResponse;
  }

  async streamChat(chatHistory = [], prompt, workspace = {}, rawHistory = []) {
    if (!(await this.isValidChatCompletionModel(this.model)))
      throw new Error(
        `OpenAI chat: ${this.model} is not valid for chat completion!`
      );

    const streamRequest = await this.openai.chat.completions.create(
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
        `OpenAI chat: ${this.model} is not valid for chat completion!`
      );

    const { data } = await this.openai.chat.completions.create({
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
        `OpenAI chat: ${this.model} is not valid for chat completion!`
      );

    const streamRequest = await this.openai.chat.completions.create(
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
  OpenAiLLM,
};
