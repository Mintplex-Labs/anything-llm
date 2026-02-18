const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
  handleDefaultStreamResponseV2,
} = require("../../helpers/chat/responses");
const {
  LLMPerformanceMonitor,
} = require("../../helpers/chat/LLMPerformanceMonitor");

/**
 * ModelsLab LLM provider for AnythingLLM.
 *
 * ModelsLab provides uncensored, cost-effective AI language models via an
 * OpenAI-compatible API endpoint. Supports Llama 3.1 8B and 70B uncensored
 * variants with 128K context windows.
 *
 * Environment variables:
 *   MODELSLAB_API_KEY      - Your ModelsLab API key (required)
 *   MODELSLAB_MODEL_PREF   - Model identifier (default: llama-3.1-8b-uncensored)
 *
 * Get your API key at: https://modelslab.com
 * API docs: https://docs.modelslab.com
 */

// Static model catalogue — avoids live API calls on every request.
const MODELSLAB_MODELS = {
  "llama-3.1-8b-uncensored": {
    id: "llama-3.1-8b-uncensored",
    name: "Llama 3.1 8B Uncensored",
    organization: "ModelsLab",
    maxLength: 131072,
  },
  "llama-3.1-70b-uncensored": {
    id: "llama-3.1-70b-uncensored",
    name: "Llama 3.1 70B Uncensored",
    organization: "ModelsLab",
    maxLength: 131072,
  },
};

const MODELSLAB_BASE_URL = "https://modelslab.com/uncensored-chat/v1";
const DEFAULT_MODEL = "llama-3.1-8b-uncensored";

class ModelsLabLLM {
  constructor(embedder = null, modelPreference = null) {
    if (!process.env.MODELSLAB_API_KEY)
      throw new Error(
        "No ModelsLab API key was set. Please set MODELSLAB_API_KEY in your environment. " +
        "Get your key at https://modelslab.com"
      );

    const { OpenAI: OpenAIApi } = require("openai");
    this.className = "ModelsLabLLM";
    this.openai = new OpenAIApi({
      baseURL: MODELSLAB_BASE_URL,
      apiKey: process.env.MODELSLAB_API_KEY,
    });
    this.model =
      modelPreference ||
      process.env.MODELSLAB_MODEL_PREF ||
      DEFAULT_MODEL;

    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };

    this.embedder = embedder ?? new NativeEmbedder();
    this.defaultTemp = 0.7;
    this.log(
      `Initialized ${this.model} with context window ${this.promptWindowLimit()}`
    );
  }

  log(text, ...args) {
    console.log(`\x1b[35m[${this.className}]\x1b[0m ${text}`, ...args);
  }

  #appendContext(contextTexts = []) {
    if (!contextTexts || !contextTexts.length) return "";
    return (
      "\nContext:\n" +
      contextTexts
        .map((text, i) => `[CONTEXT ${i}]:\n${text}\n[END CONTEXT ${i}]\n\n`)
        .join("")
    );
  }

  #generateContent({ userPrompt, attachments = [] }) {
    if (!attachments.length) return userPrompt;

    const content = [{ type: "text", text: userPrompt }];
    for (const attachment of attachments) {
      content.push({
        type: "image_url",
        image_url: { url: attachment.contentString },
      });
    }
    return content.flat();
  }

  streamingEnabled() {
    return "streamGetChatCompletion" in this;
  }

  static promptWindowLimit(modelName) {
    const model = MODELSLAB_MODELS[modelName] ?? MODELSLAB_MODELS[DEFAULT_MODEL];
    return model.maxLength;
  }

  promptWindowLimit() {
    const model = MODELSLAB_MODELS[this.model] ?? MODELSLAB_MODELS[DEFAULT_MODEL];
    return model.maxLength;
  }

  // Returns list of available models for the UI model selector.
  static async getModelsListing() {
    return Object.values(MODELSLAB_MODELS).map((m) => ({
      id: m.id,
      name: m.name,
      organization: m.organization,
      maxLength: m.maxLength,
    }));
  }

  async isValidChatCompletionModel(modelName = "") {
    return Object.keys(MODELSLAB_MODELS).includes(modelName);
  }

  constructPrompt({
    systemPrompt = "",
    contextTexts = [],
    chatHistory = [],
    userPrompt = "",
    attachments = [],
  }) {
    const prompt = {
      role: "system",
      content: `${systemPrompt}${this.#appendContext(contextTexts)}`,
    };
    return [
      prompt,
      ...chatHistory,
      {
        role: "user",
        content: this.#generateContent({ userPrompt, attachments }),
      },
    ];
  }

  async getChatCompletion(messages = null, { temperature = 0.7 }) {
    if (!(await this.isValidChatCompletionModel(this.model)))
      throw new Error(
        `ModelsLab: "${this.model}" is not a valid model. Valid models: ${Object.keys(MODELSLAB_MODELS).join(", ")}`
      );

    const result = await LLMPerformanceMonitor.measureAsyncFunction(
      this.openai.chat.completions
        .create({
          model: this.model,
          messages,
          temperature,
        })
        .catch((e) => {
          throw new Error(e.message);
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
        prompt_tokens: result.output.usage?.prompt_tokens || 0,
        completion_tokens: result.output.usage?.completion_tokens || 0,
        total_tokens: result.output.usage?.total_tokens || 0,
        outputTps: result.output.usage?.completion_tokens / result.duration,
        duration: result.duration,
        model: this.model,
        provider: this.className,
        timestamp: new Date(),
      },
    };
  }

  async streamGetChatCompletion(messages = null, { temperature = 0.7 }) {
    if (!(await this.isValidChatCompletionModel(this.model)))
      throw new Error(
        `ModelsLab: "${this.model}" is not a valid model for streaming.`
      );

    const measuredStreamRequest = await LLMPerformanceMonitor.measureStream({
      func: this.openai.chat.completions.create({
        model: this.model,
        stream: true,
        messages,
        temperature,
      }),
      messages,
      runPromptTokenCalculation: false,
      modelTag: this.model,
      provider: this.className,
    });
    return measuredStreamRequest;
  }

  handleStream(response, stream, responseProps) {
    return handleDefaultStreamResponseV2(response, stream, responseProps);
  }

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
  ModelsLabLLM,
};
