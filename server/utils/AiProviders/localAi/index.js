//  hybrid of openAi embedder and openAI API for localAI
class LocalAiLLM {
  constructor(embedder = null) {
    if (!process.env.LOCALAI_BASE_PATH)
      throw new Error("No LocalAI API Base Path was set.");

    const { Configuration, OpenAIApi } = require("openai");
    const basePath = process.env.LOCALAI_BASE_PATH; // ex: "https://api.openai.com/v1"

    const config = new Configuration({
      // apiKey: process.env.LOCALAI_API_KEY, // currently not used
      basePath: basePath.replace(/\/+$/, ""), // here is the URL to your localAI instance
    });
    this.openai = new OpenAIApi(config);

    if (!embedder)
      throw new Error(
        "INVALID LOCALAI SETUP. No embedding engine has been set. Go to instance settings and set up an embedding interface to use LocalAI as your LLM."
      );
    this.embedder = embedder;
  }

  async isValidChatCompletionModel(modelName = "") {
    // LocalAi may be anything. The user must do it correctly.
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

  async isSafe(_input = "") {
    // Not implemented so must be stubbed
    return { safe: true, reasons: [] };
  }

  async sendChat(chatHistory = [], prompt, workspace = {}) {
    const model = "model-name-stub"; // TODO: get model name from API
    if (!model)
      throw new Error(
        `LocalAI chat: ${model} is not valid for chat completion!`
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
          throw new Error("LocalAI chat: No results!");
        if (res.choices.length === 0)
          throw new Error("LocalAI chat: No results length!");
        return res.choices[0].message.content;
      })
      .catch((error) => {
        throw new Error(
          `LocalAI::createChatCompletion failed with: ${error.message}`
        );
      });

    return textResponse;
  }

  async getChatCompletion(messages = null, { temperature = 0.7 }) {
    const model = "model-name-stub"; // TODO: get model name from API
    if (!model)
      throw new Error(
        `LocalAI chat: ${model} is not valid for chat completion!`
      );

    const { data } = await this.openai.createChatCompletion({
      model,
      messages,
      temperature,
    });

    if (!data.hasOwnProperty("choices")) return null;
    return data.choices[0].message.content;
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
  LocalAiLLM,
};
