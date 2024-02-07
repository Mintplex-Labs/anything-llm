const { chatPrompt } = require("../../chats");
const { handleDefaultStreamResponse } = require("../../chats/stream");

//  hybrid of openAi LLM chat completion for LMStudio
class LMStudioLLM {
  constructor(embedder = null, _modelPreference = null) {
    if (!process.env.LMSTUDIO_BASE_PATH)
      throw new Error("No LMStudio API Base Path was set.");

    const { Configuration, OpenAIApi } = require("openai");
    const config = new Configuration({
      basePath: process.env.LMSTUDIO_BASE_PATH?.replace(/\/+$/, ""), // here is the URL to your LMStudio instance
    });
    this.lmstudio = new OpenAIApi(config);
    // When using LMStudios inference server - the model param is not required so
    // we can stub it here. LMStudio can only run one model at a time.
    this.model = "model-placeholder";
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };

    if (!embedder)
      throw new Error(
        "INVALID LM STUDIO SETUP. No embedding engine has been set. Go to instance settings and set up an embedding interface to use LMStudio as your LLM."
      );
    this.embedder = embedder;
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

  async isSafe(_input = "") {
    // Not implemented so must be stubbed
    return { safe: true, reasons: [] };
  }

  async sendChat(chatHistory = [], prompt, workspace = {}, rawHistory = []) {
    if (!this.model)
      throw new Error(
        `LMStudio chat: ${this.model} is not valid or defined for chat completion!`
      );

    const textResponse = await this.lmstudio
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
          throw new Error("LMStudio chat: No results!");
        if (res.choices.length === 0)
          throw new Error("LMStudio chat: No results length!");
        return res.choices[0].message.content;
      })
      .catch((error) => {
        throw new Error(
          `LMStudio::createChatCompletion failed with: ${error.message}`
        );
      });

    return textResponse;
  }

  async streamChat(chatHistory = [], prompt, workspace = {}, rawHistory = []) {
    if (!this.model)
      throw new Error(
        `LMStudio chat: ${this.model} is not valid or defined for chat completion!`
      );

    const streamRequest = await this.lmstudio.createChatCompletion(
      {
        model: this.model,
        temperature: Number(workspace?.openAiTemp ?? this.defaultTemp),
        n: 1,
        stream: true,
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
    if (!this.model)
      throw new Error(
        `LMStudio chat: ${this.model} is not valid or defined model for chat completion!`
      );

    const { data } = await this.lmstudio.createChatCompletion({
      model: this.model,
      messages,
      temperature,
    });

    if (!data.hasOwnProperty("choices")) return null;
    return data.choices[0].message.content;
  }

  async streamGetChatCompletion(messages = null, { temperature = 0.7 }) {
    if (!this.model)
      throw new Error(
        `LMStudio chat: ${this.model} is not valid or defined model for chat completion!`
      );

    const streamRequest = await this.lmstudio.createChatCompletion(
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
  LMStudioLLM,
};
