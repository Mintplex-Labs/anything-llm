const { chatPrompt } = require("../../chats");

class LocalAiLLM {
  constructor(embedder = null) {
    if (!process.env.LOCAL_AI_BASE_PATH) throw new Error("No LocalAI Base Path was set.");

    const { Configuration, OpenAIApi } = require("openai");
    const config = new Configuration({
      apiKey: 'sk-12345',
      basePath: process.env.LOCAL_AI_BASE_PATH
    });
    this.openai = new OpenAIApi(config);
    this.model = process.env.LOCAL_AI_MODEL_PREF;
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };

    if (!embedder)
      throw new Error(
        "INVALID LOCAL AI SETUP. No embedding engine has been set. Go to instance settings and set up an embedding interface to use LocalAI as your LLM."
      );
    this.embedder = embedder;
  }

  // Ensure the user set a value for the token limit
  // and if undefined - assume 4096 window.
  promptWindowLimit() {
    const limit = process.env.LOCAL_AI_MODEL_TOKEN_LIMIT || 4096;
    if (!limit || isNaN(Number(limit)))
      throw new Error("No LMStudio token context limit was set.");
    return Number(limit);
  }

  async isValidChatCompletionModel(_ = "") {
    // Not implemented so must be stubbed
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

  async sendChat(chatHistory = [], prompt, workspace = {}, rawHistory = []) {
    const model = process.env.LOCAL_MODEL_PREF;
    if (!(await this.isValidChatCompletionModel(model)))
      throw new Error(
        `LocalAI chat: ${model} is not valid for chat completion!`
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
    if (!(await this.isValidChatCompletionModel(this.model)))
      throw new Error(
        `LocalAI chat: ${this.model} is not valid for chat completion!`
      );

    const { data } = await this.openai.createChatCompletion({
      model: this.model,
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

  async compressMessages(promptArgs = {}, rawHistory = []) {
    const { messageArrayCompressor } = require("../../helpers/chat");
    const messageArray = this.constructPrompt(promptArgs);
    return await messageArrayCompressor(this, messageArray, rawHistory);
  }
}

module.exports = {
  LocalAiLLM,
};
