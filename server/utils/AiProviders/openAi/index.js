const { OpenAiEmbedder } = require("../../EmbeddingEngines/openAi");
const { chatPrompt } = require("../../chats");

class OpenAiLLM extends OpenAiEmbedder {
  constructor() {
    super();
    const { Configuration, OpenAIApi } = require("openai");
    if (!process.env.OPEN_AI_KEY) throw new Error("No OpenAI API key was set.");

    const config = new Configuration({
      apiKey: process.env.OPEN_AI_KEY,
    });
    this.openai = new OpenAIApi(config);
    this.model = process.env.OPEN_MODEL_PREF;
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };
  }

  promptWindowLimit() {
    switch (this.model) {
      case "gpt-3.5-turbo":
        return 4096;
      case "gpt-4":
        return 8192;
      default:
        return 4096; // assume a fine-tune 3.5
    }
  }

  async isValidChatCompletionModel(modelName = "") {
    const validModels = ["gpt-4", "gpt-3.5-turbo"];
    const isPreset = validModels.some((model) => modelName === model);
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
      content: `${systemPrompt}
Context:
    ${contextTexts
      .map((text, i) => {
        return `[CONTEXT ${i}]:\n${text}\n[END CONTEXT ${i}]\n\n`;
      })
      .join("")}`,
    };
    return [prompt, ...chatHistory, { role: "user", content: userPrompt }];
  }

  async isSafe(input = "") {
    const { flagged = false, categories = {} } = await this.openai
      .createModeration({ input })
      .then((json) => {
        const res = json.data;
        if (!res.hasOwnProperty("results"))
          throw new Error("OpenAI moderation: No results!");
        if (res.results.length === 0)
          throw new Error("OpenAI moderation: No results length!");
        return res.results[0];
      })
      .catch((error) => {
        throw new Error(
          `OpenAI::CreateModeration failed with: ${error.message}`
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
    const model = process.env.OPEN_MODEL_PREF;
    if (!(await this.isValidChatCompletionModel(model)))
      throw new Error(
        `OpenAI chat: ${model} is not valid for chat completion!`
      );

    const textResponse = await this.openai
      .createChatCompletion({
        model,
        temperature: Number(workspace?.openAiTemp ?? 0.7),
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

  async getChatCompletion(messages = null, { temperature = 0.7 }) {
    if (!(await this.isValidChatCompletionModel(this.model)))
      throw new Error(
        `OpenAI chat: ${this.model} is not valid for chat completion!`
      );

    const { data } = await this.openai.createChatCompletion({
      model: this.model,
      messages,
      temperature,
    });

    if (!data.hasOwnProperty("choices")) return null;
    return data.choices[0].message.content;
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
