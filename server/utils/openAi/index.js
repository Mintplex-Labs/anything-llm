const { Configuration, OpenAIApi } = require("openai");
class OpenAi {
  constructor() {
    const config = new Configuration({
      apiKey: process.env.OPEN_AI_KEY,
      // organization: "org-123xyz", // Optional
    });
    const openai = new OpenAIApi(config);
    this.openai = openai;
  }
  isValidChatModel(modelName = "") {
    const validModels = ["gpt-4", "gpt-3.5-turbo"];
    return validModels.includes(modelName);
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

  async sendChat(chatHistory = [], prompt, workspace = {}) {
    const model = process.env.OPEN_MODEL_PREF;
    if (!this.isValidChatModel(model))
      throw new Error(
        `OpenAI chat: ${model} is not valid for chat completion!`
      );

    const textResponse = await this.openai
      .createChatCompletion({
        model,
        temperature: Number(workspace?.openAiTemp ?? 0.7),
        n: 1,
        messages: [
          { role: "system", content: "" },
          ...chatHistory,
          { role: "user", content: prompt },
        ],
      })
      .then((json) => {
        const res = json.data;
        if (!res.hasOwnProperty("choices"))
          throw new Error("OpenAI chat: No results!");
        if (res.choices.length === 0)
          throw new Error("OpenAI chat: No results length!");
        return res.choices[0].message.content;
      });

    return textResponse;
  }
}

module.exports = {
  OpenAi,
};
