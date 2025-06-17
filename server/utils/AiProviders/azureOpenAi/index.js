const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
  formatChatHistory,
  handleDefaultStreamResponseV2,
} = require("../../helpers/chat/responses");
const {
  LLMPerformanceMonitor,
} = require("../../helpers/chat/LLMPerformanceMonitor");

class AzureOpenAiLLM {
  constructor(embedder = null, modelPreference = null) {
    const { AzureOpenAI } = require("openai");
    if (!process.env.AZURE_OPENAI_ENDPOINT)
      throw new Error("No Azure API endpoint was set.");
    if (!process.env.AZURE_OPENAI_KEY)
      throw new Error("No Azure API key was set.");

    this.apiVersion = "2024-12-01-preview";
    this.openai = new AzureOpenAI({
      apiKey: process.env.AZURE_OPENAI_KEY,
      apiVersion: this.apiVersion,
      endpoint: process.env.AZURE_OPENAI_ENDPOINT,
    });
    this.model = modelPreference ?? process.env.OPEN_MODEL_PREF;
    this.isOTypeModel =
      process.env.AZURE_OPENAI_MODEL_TYPE === "reasoning" || false;
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };

    this.embedder = embedder ?? new NativeEmbedder();
    this.defaultTemp = 0.7;
    this.#log(
      `Initialized. Model "${this.model}" @ ${this.promptWindowLimit()} tokens.\nAPI-Version: ${this.apiVersion}.\nModel Type: ${this.isOTypeModel ? "reasoning" : "default"}`
    );
  }

  #log(text, ...args) {
    console.log(`\x1b[32m[AzureOpenAi]\x1b[0m ${text}`, ...args);
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
    // Streaming of reasoning models is not supported
    if (this.isOTypeModel) {
      this.#log(
        "Streaming will be disabled. AZURE_OPENAI_MODEL_TYPE is set to 'reasoning'."
      );
      return false;
    }
    return "streamGetChatCompletion" in this;
  }

  static promptWindowLimit(_modelName) {
    return !!process.env.AZURE_OPENAI_TOKEN_LIMIT
      ? Number(process.env.AZURE_OPENAI_TOKEN_LIMIT)
      : 4096;
  }

  // Sure the user selected a proper value for the token limit
  // could be any of these https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/models#gpt-4-models
  // and if undefined - assume it is the lowest end.
  promptWindowLimit() {
    return !!process.env.AZURE_OPENAI_TOKEN_LIMIT
      ? Number(process.env.AZURE_OPENAI_TOKEN_LIMIT)
      : 4096;
  }

  isValidChatCompletionModel(_modelName = "") {
    // The Azure user names their "models" as deployments and they can be any name
    // so we rely on the user to put in the correct deployment as only they would
    // know it.
    return true;
  }

  /**
   * Generates appropriate content array for a message + attachments.
   * @param {{userPrompt:string, attachments: import("../../helpers").Attachment[]}}
   * @returns {string|object[]}
   */
  #generateContent({ userPrompt, attachments = [] }) {
    if (!attachments.length) {
      return userPrompt;
    }

    const content = [{ type: "text", text: userPrompt }];
    for (let attachment of attachments) {
      content.push({
        type: "image_url",
        image_url: {
          url: attachment.contentString,
        },
      });
    }
    return content.flat();
  }

  constructPrompt({
    systemPrompt = "",
    contextTexts = [],
    chatHistory = [],
    userPrompt = "",
    attachments = [], // This is the specific attachment for only this prompt
  }) {
    const prompt = {
      role: this.isOTypeModel ? "user" : "system",
      content: `${systemPrompt}${this.#appendContext(contextTexts)}`,
    };
    return [
      prompt,
      ...formatChatHistory(chatHistory, this.#generateContent),
      {
        role: "user",
        content: this.#generateContent({ userPrompt, attachments }),
      },
    ];
  }

  async getChatCompletion(messages = [], { temperature = 0.7 }) {
    if (!this.model)
      throw new Error(
        "No OPEN_MODEL_PREF ENV defined. This must the name of a deployment on your Azure account for an LLM chat model like GPT-3.5."
      );

    const result = await LLMPerformanceMonitor.measureAsyncFunction(
      this.openai.chat.completions.create({
        messages,
        model: this.model,
        ...(this.isOTypeModel ? {} : { temperature }),
      })
    );

    if (
      !result.output.hasOwnProperty("choices") ||
      result.output.choices.length === 0
    )
      return null;

    return {
      textResponse: result.output.choices[0].message.content,
      metrics: {
        prompt_tokens: result.output.usage.prompt_tokens || 0,
        completion_tokens: result.output.usage.completion_tokens || 0,
        total_tokens: result.output.usage.total_tokens || 0,
        outputTps: result.output.usage.completion_tokens / result.duration,
        duration: result.duration,
      },
    };
  }

  async streamGetChatCompletion(messages = [], { temperature = 0.7 }) {
    if (!this.model)
      throw new Error(
        "No OPEN_MODEL_PREF ENV defined. This must the name of a deployment on your Azure account for an LLM chat model like GPT-3.5."
      );

    const measuredStreamRequest = await LLMPerformanceMonitor.measureStream(
      await this.openai.chat.completions.create({
        messages,
        model: this.model,
        ...(this.isOTypeModel ? {} : { temperature }),
        n: 1,
        stream: true,
      }),
      messages
    );

    return measuredStreamRequest;
  }

  handleStream(response, stream, responseProps) {
    return handleDefaultStreamResponseV2(response, stream, responseProps);
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
  AzureOpenAiLLM,
};
