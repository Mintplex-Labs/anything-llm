const { OpenAI: OpenAIApi } = require("openai");
const {
  handleDefaultStreamResponseV2,
} = require("../../helpers/chat/responses");
const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
  LLMPerformanceMonitor,
} = require("../../helpers/chat/LLMPerformanceMonitor");
const {
  buildAnthropicParams,
  handleAnthropicChatStream,
} = require("./anthropicChat");

class AWSBedrockLLM {
  noSystemPromptModels = [
    "amazon.titan-text-express-v1",
    "amazon.titan-text-lite-v1",
    "cohere.command-text-v14",
    "cohere.command-light-text-v14",
    "us.deepseek.r1-v1:0",
  ];

  noTemperatureModels = [
    "anthropic.claude-opus-4-7",
    "anthropic.claude-opus-4-8",
    "anthropic.claude-sonnet-5",
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

    if (this.model?.includes("anthropic")) {
      const AnthropicAI = require("@anthropic-ai/sdk");
      this.anthropic = new AnthropicAI({
        apiKey: process.env.AWS_BEDROCK_LLM_API_KEY,
        baseURL: `https://bedrock-mantle.${this.region}.api.aws/anthropic`,
        defaultHeaders: { "anthropic-version": "2023-06-01" },
      });
    }

    this.embedder = embedder ?? new NativeEmbedder();
    this.defaultTemp = 0.7;
    this.#log(
      `Initialized with model: ${this.model}. Region: ${this.region}. Context Window: ${contextWindowLimit}.`
    );
  }

  get #isAnthropic() {
    return !!this.anthropic;
  }

  get #maxTokens() {
    return Number(process.env.AWS_BEDROCK_LLM_MAX_TOKENS) || 4096;
  }

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

  // --- Chat completions ---

  async getChatCompletion(messages = null, { temperature }) {
    if (!messages?.length)
      throw new Error(
        "AWSBedrock::getChatCompletion requires a non-empty messages array."
      );

    if (this.#isAnthropic) {
      return this.#anthropicChatCompletion(messages, temperature);
    }

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
      metrics: this.#buildMetrics(response.usage, result.duration),
    };
  }

  async streamGetChatCompletion(messages = null, { temperature }) {
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error(
        "AWSBedrock::streamGetChatCompletion requires a non-empty messages array."
      );
    }

    if (this.#isAnthropic) {
      const params = buildAnthropicParams({
        model: this.model,
        maxTokens: this.#maxTokens,
        messages,
        temperature: this.temperatureParam(temperature),
      });
      const stream = this.anthropic.messages.stream(params);
      return await LLMPerformanceMonitor.measureStream({
        func: stream,
        messages,
        runPromptTokenCalculation: false,
        modelTag: this.model,
        provider: this.className,
      });
    }

    const stream = await this.openai.chat.completions.create({
      model: this.model,
      messages,
      temperature: this.temperatureParam(temperature),
      stream: true,
    });
    return await LLMPerformanceMonitor.measureStream({
      func: stream,
      messages,
      modelTag: this.model,
      provider: this.className,
      runPromptTokenCalculation: true,
    });
  }

  handleStream(response, stream, responseProps) {
    if (this.#isAnthropic)
      return handleAnthropicChatStream(response, stream, responseProps);
    return handleDefaultStreamResponseV2(response, stream, responseProps);
  }

  // --- Anthropic non-streaming completion ---

  async #anthropicChatCompletion(messages, temperature) {
    const params = buildAnthropicParams({
      model: this.model,
      maxTokens: this.#maxTokens,
      messages,
      temperature: this.temperatureParam(temperature),
    });
    const result = await LLMPerformanceMonitor.measureAsyncFunction(
      this.anthropic.messages
        .stream(params)
        .finalMessage()
        .catch((e) => {
          this.#log(`Bedrock API Error (getChatCompletion): ${e.message}`, e);
          throw new Error(`AWSBedrock::getChatCompletion failed. ${e.message}`);
        })
    );

    const response = result.output;
    const promptTokens = response.usage?.input_tokens ?? 0;
    const completionTokens = response.usage?.output_tokens ?? 0;

    return {
      textResponse: response.content[0]?.text ?? null,
      metrics: this.#buildMetrics(
        {
          prompt_tokens: promptTokens,
          completion_tokens: completionTokens,
          total_tokens: promptTokens + completionTokens,
        },
        result.duration,
        completionTokens
      ),
    };
  }

  #buildMetrics(usage = {}, duration = 0, completionTokensOverride = null) {
    const completionTokens =
      completionTokensOverride ?? usage?.completion_tokens ?? 0;
    return {
      prompt_tokens: usage?.prompt_tokens ?? 0,
      completion_tokens: completionTokens,
      total_tokens: usage?.total_tokens ?? 0,
      outputTps:
        completionTokens && duration ? completionTokens / (duration / 1000) : 0,
      duration,
      model: this.model,
      provider: this.className,
      timestamp: new Date(),
    };
  }

  // --- Embeddings ---

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
