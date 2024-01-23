const { v4 } = require("uuid");
const { chatPrompt } = require("../../chats");

class AnthropicLLM {
  constructor(embedder = null, modelPreference = null) {
    if (!process.env.ANTHROPIC_API_KEY)
      throw new Error("No Anthropic API key was set.");

    // Docs: https://www.npmjs.com/package/@anthropic-ai/sdk
    const AnthropicAI = require("@anthropic-ai/sdk");
    const anthropic = new AnthropicAI({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    this.anthropic = anthropic;
    this.model =
      modelPreference || process.env.ANTHROPIC_MODEL_PREF || "claude-2";
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };

    if (!embedder)
      throw new Error(
        "INVALID ANTHROPIC SETUP. No embedding engine has been set. Go to instance settings and set up an embedding interface to use Anthropic as your LLM."
      );
    this.embedder = embedder;
    this.answerKey = v4().split("-")[0];
    this.defaultTemp = 0.7;
  }

  streamingEnabled() {
    return "streamChat" in this && "streamGetChatCompletion" in this;
  }

  promptWindowLimit() {
    switch (this.model) {
      case "claude-instant-1":
        return 72_000;
      case "claude-2":
        return 100_000;
      default:
        return 72_000; // assume a claude-instant-1 model
    }
  }

  isValidChatCompletionModel(modelName = "") {
    const validModels = ["claude-2", "claude-instant-1"];
    return validModels.includes(modelName);
  }

  // Moderation can be done with Anthropic, but its not really "exact" so we skip it
  // https://docs.anthropic.com/claude/docs/content-moderation
  async isSafe(_input = "") {
    // Not implemented so must be stubbed
    return { safe: true, reasons: [] };
  }

  constructPrompt({
    systemPrompt = "",
    contextTexts = [],
    chatHistory = [],
    userPrompt = "",
  }) {
    return `\n\nHuman: Please read question supplied within the <question> tags. Using all information generate an answer to the question and output it within <${
      this.answerKey
    }> tags. Previous conversations can be used within the <history> tags and can be used to influence the output. Content between the <system> tag is additional information and instruction that will impact how answers are formatted or responded to. Additional contextual information retrieved to help answer the users specific query is available to use for answering and can be found between <context> tags. When no <context> tags may are present use the knowledge available and in the conversation to answer. When one or more <context> tags are available you will use those to help answer the question or augment pre-existing knowledge. You should never say "Based on the provided context" or other phrasing that is not related to the user question.
    <system>${systemPrompt}</system>
    ${contextTexts
      .map((text, i) => {
        return `<context>${text}</context>\n`;
      })
      .join("")}
    <history>${chatHistory.map((history) => {
      switch (history.role) {
        case "assistant":
          return `\n\nAssistant: ${history.content}`;
        case "user":
          return `\n\nHuman: ${history.content}`;
        default:
          return "\n";
      }
    })}</history>
    <question>${userPrompt}</question>
    \n\nAssistant:`;
  }

  async sendChat(chatHistory = [], prompt, workspace = {}, rawHistory = []) {
    if (!this.isValidChatCompletionModel(this.model))
      throw new Error(
        `Anthropic chat: ${this.model} is not valid for chat completion!`
      );

    const compressedPrompt = await this.compressMessages(
      {
        systemPrompt: chatPrompt(workspace),
        userPrompt: prompt,
        chatHistory,
      },
      rawHistory
    );
    const { content, error } = await this.anthropic.completions
      .create({
        model: this.model,
        max_tokens_to_sample: 300,
        prompt: compressedPrompt,
      })
      .then((res) => {
        const { completion } = res;
        const re = new RegExp(
          "(?:<" + this.answerKey + ">)([\\s\\S]*)(?:</" + this.answerKey + ">)"
        );
        const response = completion.match(re)?.[1]?.trim();
        if (!response)
          throw new Error("Anthropic: No response could be parsed.");
        return { content: response, error: null };
      })
      .catch((e) => {
        return { content: null, error: e.message };
      });

    if (error) throw new Error(error);
    return content;
  }

  async getChatCompletion(prompt = "", _opts = {}) {
    if (!this.isValidChatCompletionModel(this.model))
      throw new Error(
        `Anthropic chat: ${this.model} is not valid for chat completion!`
      );

    const { content, error } = await this.anthropic.completions
      .create({
        model: this.model,
        max_tokens_to_sample: 300,
        prompt,
      })
      .then((res) => {
        const { completion } = res;
        const re = new RegExp(
          "(?:<" + this.answerKey + ">)([\\s\\S]*)(?:</" + this.answerKey + ">)"
        );
        const response = completion.match(re)?.[1]?.trim();
        if (!response)
          throw new Error("Anthropic: No response could be parsed.");
        return { content: response, error: null };
      })
      .catch((e) => {
        return { content: null, error: e.message };
      });

    if (error) throw new Error(error);
    return content;
  }

  async compressMessages(promptArgs = {}, rawHistory = []) {
    const { messageStringCompressor } = require("../../helpers/chat");
    const compressedPrompt = await messageStringCompressor(
      this,
      promptArgs,
      rawHistory
    );
    return compressedPrompt;
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
  AnthropicLLM,
};
