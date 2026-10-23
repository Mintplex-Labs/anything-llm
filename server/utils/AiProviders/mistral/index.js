const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
  LLMPerformanceMonitor,
} = require("../../helpers/chat/LLMPerformanceMonitor");
const {
  handleDefaultStreamResponseV2,
  formatChatHistory,
  extractReasoningContent,
} = require("../../helpers/chat/responses");
const {
  temperatureParam,
} = require("../../agents/aibitat/providers/helpers/tooled");
const { reasoningParams } = require("../../helpers/reasoningEffort");

class MistralLLM {
  constructor(embedder = null, modelPreference = null) {
    if (!process.env.MISTRAL_API_KEY)
      throw new Error("No Mistral API key was set.");

    this.className = "MistralLLM";
    const { OpenAI: OpenAIApi } = require("openai");
    this.openai = normalizeMistralClient(
      new OpenAIApi({
        baseURL: "https://api.mistral.ai/v1",
        apiKey: process.env.MISTRAL_API_KEY ?? null,
      })
    );
    this.model =
      modelPreference || process.env.MISTRAL_MODEL_PREF || "mistral-tiny";
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };

    this.embedder = embedder ?? new NativeEmbedder();
    this.log("Initialized with model:", this.model);
  }

  log(text, ...args) {
    console.log(`\x1b[36m[${this.className}]\x1b[0m ${text}`, ...args);
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

  static promptWindowLimit() {
    return 32000;
  }

  promptWindowLimit() {
    return 32000;
  }

  async isValidChatCompletionModel(_modelName = "") {
    return true;
  }

  /**
   * Returns the capabilities of the model from Mistral's models endpoint, which
   * also resolves model aliases. Reasoning models only toggle thinking on/off.
   * @returns {Promise<{tools: boolean, reasoning: boolean, reasoningOptions: string[], imageGeneration: boolean, vision: boolean}>}
   */
  async getModelCapabilities() {
    try {
      const { capabilities = {} } = await this.openai.models.retrieve(
        this.model
      );
      return {
        tools: capabilities.function_calling === true,
        reasoning: capabilities.reasoning === true,
        reasoningOptions: capabilities.reasoning === true ? ["off", "on"] : [],
        imageGeneration: false,
        vision: capabilities.vision === true,
      };
    } catch (error) {
      console.error("Mistral:getModelCapabilities", error.message);
      return {
        tools: false,
        reasoning: "unknown",
        reasoningOptions: [],
        imageGeneration: false,
        vision: false,
      };
    }
  }

  /**
   * Generates appropriate content array for a message + attachments.
   * @param {{userPrompt:string, attachments: import("../../helpers").Attachment[]}}
   * @returns {string|object[]}
   */
  #generateContent({ userPrompt, attachments = [] }) {
    if (!attachments.length) return userPrompt;

    const content = [{ type: "text", text: userPrompt }];
    for (let attachment of attachments) {
      content.push({
        type: "image_url",
        image_url: attachment.contentString,
      });
    }
    return content.flat();
  }

  /**
   * Construct the user prompt for this model.
   * @param {{attachments: import("../../helpers").Attachment[]}} param0
   * @returns
   */
  constructPrompt({
    systemPrompt = "",
    contextTexts = [],
    chatHistory = [],
    userPrompt = "",
    attachments = [], // This is the specific attachment for only this prompt
  }) {
    const prompt = {
      role: "system",
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

  /**
   * Prepends any reasoning from the response to the text response.
   * @param {{message: {content: string, reasoning_content?: string}}} choice
   * @returns {string}
   */
  #parseReasoningFromResponse({ message }) {
    const textResponse = message?.content ?? "";
    const reasoning = extractReasoningContent(message);
    if (!reasoning || reasoning.trim().length === 0) return textResponse;
    return `<think>${reasoning}</think>${textResponse}`;
  }

  async getChatCompletion(
    messages = null,
    { temperature = this.temperature, reasoningEffort = null } = {}
  ) {
    if (!(await this.isValidChatCompletionModel(this.model)))
      throw new Error(
        `Mistral chat: ${this.model} is not valid for chat completion!`
      );

    const result = await LLMPerformanceMonitor.measureAsyncFunction(
      this.openai.chat.completions
        .create({
          model: this.model,
          messages,
          ...temperatureParam(temperature),
          ...reasoningParams("mistral", reasoningEffort, this.model),
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
      textResponse: this.#parseReasoningFromResponse(result.output.choices[0]),
      metrics: {
        prompt_tokens: result.output.usage.prompt_tokens || 0,
        completion_tokens: result.output.usage.completion_tokens || 0,
        total_tokens: result.output.usage.total_tokens || 0,
        outputTps: result.output.usage.completion_tokens / result.duration,
        duration: result.duration,
        model: this.model,
        provider: this.className,
        timestamp: new Date(),
      },
    };
  }

  async streamGetChatCompletion(
    messages = null,
    { temperature = this.temperature, reasoningEffort = null } = {}
  ) {
    if (!(await this.isValidChatCompletionModel(this.model)))
      throw new Error(
        `Mistral chat: ${this.model} is not valid for chat completion!`
      );

    const measuredStreamRequest = await LLMPerformanceMonitor.measureStream({
      func: this.openai.chat.completions.create({
        model: this.model,
        stream: true,
        messages,
        ...temperatureParam(temperature),
        ...reasoningParams("mistral", reasoningEffort, this.model),
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

/**
 * Flattens Mistral content chunks into plain text and reasoning strings.
 * Reasoning models (e.g. mistral-large-4) return `content` as an array of
 * `{type: "thinking", thinking: [...]}` and `{type: "text", text}` chunks
 * instead of a string.
 * @param {string|object[]|null} content
 * @returns {{text: string, reasoning: string}}
 */
function flattenMistralContent(content) {
  if (!Array.isArray(content)) return { text: content ?? "", reasoning: "" };

  let text = "";
  let reasoning = "";
  for (const chunk of content) {
    if (typeof chunk === "string") text += chunk;
    else if (chunk?.type === "text") text += chunk.text ?? "";
    else if (chunk?.type === "thinking")
      reasoning += flattenMistralContent(chunk.thinking).text;
  }
  return { text, reasoning };
}

/**
 * Rewrites a streamed chunk with array content into OpenAI-style chunks with
 * string `content` and `reasoning_content`. A chunk carrying both reasoning and
 * text is split in two so the reasoning block is closed before the text starts.
 * @param {object} chunk
 * @returns {Generator<object>}
 */
function* normalizeMistralStreamChunk(chunk) {
  const choice = chunk?.choices?.[0];
  if (!Array.isArray(choice?.delta?.content)) return yield chunk;

  const { text, reasoning } = flattenMistralContent(choice.delta.content);
  const withDelta = (delta, isLast = true) => ({
    ...chunk,
    ...(isLast ? {} : { usage: null }),
    choices: [
      {
        ...choice,
        ...(isLast ? {} : { finish_reason: null }),
        delta: { ...choice.delta, ...delta },
      },
    ],
  });

  if (!reasoning) return yield withDelta({ content: text });
  if (!text)
    return yield withDelta({ content: "", reasoning_content: reasoning });
  yield withDelta({ content: "", reasoning_content: reasoning }, false);
  yield withDelta({ content: text });
}

/**
 * Patches `chat.completions.create` on an OpenAI client pointed at Mistral so
 * responses from reasoning models use string `content` plus `reasoning_content`,
 * the shape every downstream chat and agent handler expects.
 * @param {import("openai").OpenAI} client
 * @returns {import("openai").OpenAI}
 */
function normalizeMistralClient(client) {
  const completions = client.chat.completions;
  const create = completions.create.bind(completions);

  completions.create = async (body, ...args) => {
    const response = await create(body, ...args);

    if (body?.stream) {
      const iterate = response[Symbol.asyncIterator].bind(response);
      response[Symbol.asyncIterator] = async function* () {
        for await (const chunk of { [Symbol.asyncIterator]: iterate })
          yield* normalizeMistralStreamChunk(chunk);
      };
      return response;
    }

    for (const choice of response?.choices ?? []) {
      if (!Array.isArray(choice?.message?.content)) continue;
      const { text, reasoning } = flattenMistralContent(choice.message.content);
      choice.message.content = text;
      if (reasoning) choice.message.reasoning_content = reasoning;
    }
    return response;
  };
  return client;
}

module.exports = {
  MistralLLM,
  normalizeMistralClient,
};
