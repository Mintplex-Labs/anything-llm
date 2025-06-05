const { v4 } = require("uuid");
const {
  formatChatHistory,
  handleDefaultStreamResponseV2,
} = require("../../helpers/chat/responses");
const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const { MODEL_MAP } = require("../modelMap");
const {
  LLMPerformanceMonitor,
} = require("../../helpers/chat/LLMPerformanceMonitor");

class BurnCloudLLM {
  constructor(embedder = null, modelPreference = null) {
    if (!process.env.BURNCLOUD_API_KEY)
      throw new Error("No BurnCloud API key was set.");

    // Initialize BurnCloud client (using OpenAI-compatible interface)
    const { OpenAI } = require("openai");
    const burncloud = new OpenAI({
      apiKey: process.env.BURNCLOUD_API_KEY,
      baseURL: process.env.BURNCLOUD_BASE_URL || "https://ai.burncloud.com/v1",
    });
    
    this.burncloud = burncloud;
    this.model =
      modelPreference ||
      process.env.BURNCLOUD_MODEL_PREF ||
      "claude-3-5-sonnet-20241022";
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };

    this.embedder = embedder ?? new NativeEmbedder();
    this.defaultTemp = 0.7;
    this.log(`Initialized with ${this.model}`);
  }

  log(text, ...args) {
    console.log(`\x1b[36m[BurnCloudLLM]\x1b[0m ${text}`, ...args);
  }

  streamingEnabled() {
    return "streamGetChatCompletion" in this;
  }

  static promptWindowLimit(modelName) {
    // Map different model families to their context windows
    if (modelName?.includes("claude-sonnet-4")) return 200000;
    if (modelName?.includes("claude-3-7-sonnet")) return 200000;
    if (modelName?.includes("claude-3-5-sonnet")) return 200000;
    if (modelName?.includes("gpt-4o")) return 128000;
    if (modelName?.includes("gpt-4")) return 128000;
    if (modelName?.includes("o1")) return 200000;
    if (modelName?.includes("gemini-2.5-pro")) return 2000000;
    if (modelName?.includes("deepseek")) return 64000;
    return 100000; // Default fallback
  }

  promptWindowLimit() {
    return BurnCloudLLM.promptWindowLimit(this.model);
  }

  isValidChatCompletionModel(_modelName = "") {
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
      content: `${systemPrompt}${
        contextTexts.length > 0
          ? `\n\nContext:\n${contextTexts
              .map((text, i) => {
                return `[CONTEXT ${i}]:\n${text}\n[END CONTEXT ${i}]\n\n`;
              })
              .join("")}`
          : ""
      }`,
    };
    return [prompt, ...chatHistory, { role: "user", content: userPrompt }];
  }

  async getChatCompletion(messages = null, { temperature = 0.7 } = {}) {
    try {
      const result = await LLMPerformanceMonitor.measureAsyncFunction(
        this.burncloud.chat.completions.create({
          model: this.model,
          messages: this.#convertToOpenAIFormat(messages),
          temperature: Number(temperature ?? this.defaultTemp),
          max_tokens: 4096,
        })
      );

      const choice = result.output.choices?.[0];
      if (!choice) throw new Error("No valid completion response");

      const promptTokens = result.output.usage?.prompt_tokens || 0;
      const completionTokens = result.output.usage?.completion_tokens || 0;
      
      return {
        textResponse: choice.message?.content || "",
        metrics: {
          prompt_tokens: promptTokens,
          completion_tokens: completionTokens,
          total_tokens: promptTokens + completionTokens,
          outputTps: completionTokens / result.duration,
          duration: result.duration,
        },
      };
    } catch (error) {
      console.log(error);
      return { textResponse: error.message, metrics: {} };
    }
  }

  async streamGetChatCompletion(messages = null, { temperature = 0.7 } = {}) {
    const measuredStreamRequest = await LLMPerformanceMonitor.measureStream(
      this.burncloud.chat.completions.create({
        model: this.model,
        messages: this.#convertToOpenAIFormat(messages),
        temperature: Number(temperature ?? this.defaultTemp),
        max_tokens: 4096,
        stream: true,
      }),
      messages,
      false
    );

    return measuredStreamRequest;
  }

  /**
   * Convert messages to OpenAI format
   * @param {Array} messages - The messages array
   * @returns {Array} - OpenAI formatted messages
   */
  #convertToOpenAIFormat(messages = []) {
    if (!Array.isArray(messages) || messages.length === 0) return [];
    
    // Handle system message separately for Anthropic-style models
    const systemMessage = messages.find(msg => msg.role === "system");
    const otherMessages = messages.filter(msg => msg.role !== "system");
    
    const formattedMessages = otherMessages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // For OpenAI format, system message goes first
    if (systemMessage) {
      return [
        { role: "system", content: systemMessage.content },
        ...formattedMessages
      ];
    }
    
    return formattedMessages;
  }

  /**
   * Handles the stream response from the BurnCloud API.
   * @param {Object} response - the response object
   * @param {import('../../helpers/chat/LLMPerformanceMonitor').MonitoredStream} stream - the stream response from the BurnCloud API w/tracking
   * @param {Object} responseProps - the response properties
   * @returns {Promise<string>}
   */
  handleStream(response, stream, responseProps) {
    return handleDefaultStreamResponseV2(response, stream, responseProps);
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
  BurnCloudLLM,
}; 