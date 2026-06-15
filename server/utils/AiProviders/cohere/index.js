const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const { MODEL_MAP } = require("../modelMap");
const {
  LLMPerformanceMonitor,
} = require("../../helpers/chat/LLMPerformanceMonitor");
const {
  handleDefaultStreamResponseV2,
} = require("../../helpers/chat/responses");

class CohereLLM {
  constructor(embedder = null, modelPreference = null) {
    const { OpenAI: OpenAIApi } = require("openai");
    if (!process.env.COHERE_API_KEY)
      throw new Error("No Cohere API key was set.");
    this.className = "CohereLLM";

    // Cohere exposes an OpenAI-compatible API which lets us reuse the OpenAI SDK
    // across the app instead of the cohere-ai package. https://docs.cohere.com/docs/compatibility-api
    this.openai = new OpenAIApi({
      baseURL: "https://api.cohere.ai/compatibility/v1",
      apiKey: process.env.COHERE_API_KEY,
    });
    this.model = modelPreference || process.env.COHERE_MODEL_PREF;
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };

    this.embedder = embedder ?? new NativeEmbedder();
    this.defaultTemp = 0.7;
    this.#log(
      `Initialized with model ${this.model}. ctx: ${this.promptWindowLimit()}`
    );
  }

  #log(text, ...args) {
    console.log(`\x1b[32m[${this.className}]\x1b[0m ${text}`, ...args);
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
    return "streamGetChatCompletion" in this;
  }

  static promptWindowLimit(modelName) {
    return MODEL_MAP.get("cohere", modelName) ?? 4_096;
  }

  promptWindowLimit() {
    return MODEL_MAP.get("cohere", this.model) ?? 4_096;
  }

  async isValidChatCompletionModel() {
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

  async getChatCompletion(messages = null, { temperature = 0.7 }) {
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

    const promptTokens = result.output.usage?.prompt_tokens || 0;
    const completionTokens = result.output.usage?.completion_tokens || 0;
    return {
      textResponse: result.output.choices[0].message.content,
      metrics: {
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        total_tokens: promptTokens + completionTokens,
        outputTps: completionTokens / result.duration,
        duration: result.duration,
        model: this.model,
        provider: this.className,
        timestamp: new Date(),
      },
    };
  }

  async streamGetChatCompletion(messages = null, { temperature = 0.7 }) {
    const measuredStreamRequest = await LLMPerformanceMonitor.measureStream({
      func: this.openai.chat.completions.create({
        model: this.model,
        stream: true,
        stream_options: { include_usage: true },
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

  /**
   * Returns the capabilities of the model by querying Cohere's models endpoint.
   * A model supports tool calling when its `features` array includes `tools` or `tool_choice`.
   * The OpenAI-compatible route does not expose this, so we hit the native REST API.
   * @returns {Promise<{tools: boolean}>}
   */
  async getModelCapabilities() {
    try {
      const features = await fetch(
        `https://api.cohere.com/v1/models/${this.model}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${process.env.COHERE_API_KEY}` },
        }
      )
        .then((res) => {
          if (!res.ok)
            throw new Error(`Cohere:getModelCapabilities - ${res.statusText}`);
          return res.json();
        })
        .then((data) => data?.features || []);

      return {
        tools: features.includes("tools") || features.includes("tool_choice"),
      };
    } catch (error) {
      console.error("Cohere:getModelCapabilities", error.message);
      return { tools: false };
    }
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
  CohereLLM,
};
