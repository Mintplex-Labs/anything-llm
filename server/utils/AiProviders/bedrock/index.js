const { OpenAI: OpenAIApi } = require("openai");
const {
  handleDefaultStreamResponseV2,
} = require("../../helpers/chat/responses");
const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
  LLMPerformanceMonitor,
} = require("../../helpers/chat/LLMPerformanceMonitor");

class AWSBedrockLLM {
  /**
   * List of Bedrock models observed to not support system prompts when using the Converse API.
   * @type {string[]}
   */
  noSystemPromptModels = [
    "amazon.titan-text-express-v1",
    "amazon.titan-text-lite-v1",
    "cohere.command-text-v14",
    "cohere.command-light-text-v14",
    "us.deepseek.r1-v1:0",
    // Add other models here if identified
  ];

  /**
   * List of Bedrock models observed to not support the `temperature` inference parameter.
   * @type {string[]}
   */
  noTemperatureModels = [
    "anthropic.claude-opus-4-7",
    "anthropic.claude-opus-4-8",
    // Add other models here if identified
  ];

  constructor(embedder = null, modelPreference = null) {
    if (!process.env.AWS_BEDROCK_LLM_API_KEY)
      throw new Error("AWS_BEDROCK_LLM_API_KEY is required for AWS Bedrock.");
    if (!process.env.AWS_BEDROCK_LLM_REGION)
      throw new Error("AWS_BEDROCK_LLM_REGION is required for AWS Bedrock.");

    this.className = "AWSBedrockLLM";
    this.model =
      modelPreference || process.env.AWS_BEDROCK_LLM_MODEL_PREFERENCE;
    this.region = process.env.AWS_BEDROCK_LLM_REGION;

    const contextWindowLimit = this.promptWindowLimit();
    this.limits = {
      history: Math.floor(contextWindowLimit * 0.15),
      system: Math.floor(contextWindowLimit * 0.15),
      user: Math.floor(contextWindowLimit * 0.7),
    };

    this.openai = new OpenAIApi({
      apiKey: process.env.AWS_BEDROCK_LLM_API_KEY,
      baseURL: `https://bedrock-mantle.${this.region}.api.aws/v1`,
    });

    this.embedder = embedder ?? new NativeEmbedder();
    this.defaultTemp = 0.7;
    this.#log(
      `Initialized with model: ${this.model}. Region: ${this.region}. Context Window: ${contextWindowLimit}.`
    );
  }

  /**
   * Gets the temperature configuration for the AWS Bedrock LLM.
   * @param {number} temperature - The temperature to use.
   * @returns {number|undefined} The temperature value or undefined if not supported.
   */
  temperatureParam(temperature = this.defaultTemp) {
    if (typeof temperature !== "number") return undefined;
    if (this.noTemperatureModels.some((model) => this.model.includes(model)))
      return undefined;
    return parseFloat(temperature);
  }

  #appendContext(contextTexts = []) {
    if (!contextTexts?.length) return "";
    return (
      "\nContext:\n" +
      contextTexts
        .map((text, i) => `[CONTEXT ${i}]:\n${text}\n[END CONTEXT ${i}]\n\n`)
        .join("")
    );
  }

  #log(text, ...args) {
    console.log(`\x1b[32m[AWSBedrock]\x1b[0m ${text}`, ...args);
  }

  static #slog(text, ...args) {
    console.log(`\x1b[32m[AWSBedrock]\x1b[0m ${text}`, ...args);
  }

  streamingEnabled() {
    if (!!process.env.AWS_BEDROCK_STREAMING_DISABLED) return false;
    return "streamGetChatCompletion" in this;
  }

  static promptWindowLimit() {
    const limit = process.env.AWS_BEDROCK_LLM_MODEL_TOKEN_LIMIT ?? 8191;
    const numericLimit = Number(limit);
    if (isNaN(numericLimit) || numericLimit <= 0) {
      this.#slog(
        `Invalid AWS_BEDROCK_LLM_MODEL_TOKEN_LIMIT: "${limit}". Returning default 8191.`
      );
      return 8191;
    }
    return numericLimit;
  }

  promptWindowLimit() {
    return AWSBedrockLLM.promptWindowLimit();
  }

  async isValidChatCompletionModel(_modelName = "") {
    return true;
  }

  /**
   * Constructs the complete message array in the OpenAI chat format.
   */
  constructPrompt({
    systemPrompt = "",
    contextTexts = [],
    chatHistory = [],
    userPrompt = "",
    attachments = [],
  }) {
    const systemMessageContent = `${systemPrompt}${this.#appendContext(contextTexts)}`;
    let messages = [];

    if (this.noSystemPromptModels.includes(this.model)) {
      if (systemMessageContent.trim().length > 0) {
        this.#log(
          `Model ${this.model} doesn't support system prompts; simulating.`
        );
        messages.push(
          { role: "user", content: systemMessageContent },
          { role: "assistant", content: "Okay." }
        );
      }
    } else if (systemMessageContent.trim().length > 0) {
      messages.push({ role: "system", content: systemMessageContent });
    }

    messages = messages.concat(
      chatHistory.map((msg) => {
        const content = this.#formatMessageContent(
          msg.content,
          msg.attachments
        );
        return { role: msg.role, content };
      })
    );

    const userContent = this.#formatMessageContent(userPrompt, attachments);
    messages.push({ role: "user", content: userContent });

    return messages;
  }

  /**
   * Formats message content with optional image attachments for the OpenAI API format.
   * @param {string} text - The text content.
   * @param {Array} attachments - Optional image attachments.
   * @returns {string|Array} Plain string or multimodal content array.
   */
  #formatMessageContent(text, attachments = []) {
    if (!Array.isArray(attachments) || attachments.length === 0) return text;

    const content = [{ type: "text", text }];
    for (const attachment of attachments) {
      if (!attachment?.contentString || !attachment?.mime) continue;
      content.push({
        type: "image_url",
        image_url: { url: attachment.contentString },
      });
    }
    return content;
  }

  async getChatCompletion(messages = null, { temperature }) {
    if (!messages?.length)
      throw new Error(
        "AWSBedrock::getChatCompletion requires a non-empty messages array."
      );

    const result = await LLMPerformanceMonitor.measureAsyncFunction(
      this.openai.chat.completions
        .create({
          model: this.model,
          messages,
          temperature: this.temperatureParam(temperature),
        })
        .catch((e) => {
          this.#log(`Bedrock API Error (getChatCompletion): ${e.message}`, e);
          throw new Error(`AWSBedrock::getChatCompletion failed. ${e.message}`);
        })
    );

    const response = result.output;
    if (!response?.choices?.[0]?.message) {
      this.#log("Bedrock response missing expected structure.", response);
      return null;
    }

    return {
      textResponse: response.choices[0].message.content,
      metrics: {
        prompt_tokens: response.usage?.prompt_tokens ?? 0,
        completion_tokens: response.usage?.completion_tokens ?? 0,
        total_tokens: response.usage?.total_tokens ?? 0,
        outputTps:
          response.usage?.completion_tokens && result.duration
            ? response.usage.completion_tokens / (result.duration / 1000)
            : 0,
        duration: result.duration,
        model: this.model,
        provider: this.className,
        timestamp: new Date(),
      },
    };
  }

  async streamGetChatCompletion(messages = null, { temperature }) {
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error(
        "AWSBedrock::streamGetChatCompletion requires a non-empty messages array."
      );
    }

    const stream = await this.openai.chat.completions.create({
      model: this.model,
      messages,
      temperature: this.temperatureParam(temperature),
      stream: true,
    });
    const measuredStreamRequest = await LLMPerformanceMonitor.measureStream({
      func: stream,
      messages,
      modelTag: this.model,
      provider: this.className,
      // AWS OpenAI SDK does not return usage - even with include_usage set to true
      // when streaming, so we need to calculate it manually (it will be wrong but its better than nothing)
      runPromptTokenCalculation: true,
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
  AWSBedrockLLM,
};
