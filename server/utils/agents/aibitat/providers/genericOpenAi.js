const OpenAI = require("openai");
const Provider = require("./ai-provider.js");
const InheritMultiple = require("./helpers/classes.js");
const UnTooled = require("./helpers/untooled.js");
const { tooledStream, tooledComplete } = require("./helpers/tooled.js");
const { RetryError } = require("../error.js");
const { toValidNumber } = require("../../../http/index.js");
const { getAnythingLLMUserAgent } = require("../../../../endpoints/utils");
const { GenericOpenAiLLM } = require("../../../AiProviders/genericOpenAi");
const { attachmentToContentBlock } = require("../../../helpers/attachments");

/**
 * The agent provider for the Generic OpenAI provider.
 * Uses native OpenAI-compatible tool calling by default and falls back to
 * the UnTooled prompt-based approach when native tool calling is disabled
 * via PROVIDER_DISABLE_NATIVE_TOOL_CALLING.
 */
class GenericOpenAiProvider extends InheritMultiple([Provider, UnTooled]) {
  model;

  constructor(config = {}) {
    super();
    this.providerTag = "generic-openai";
    const { model = "gpt-4.1-nano" } = config;
    const client = new OpenAI({
      baseURL: process.env.GENERIC_OPEN_AI_BASE_PATH,
      apiKey: process.env.GENERIC_OPEN_AI_API_KEY ?? null,
      defaultHeaders: {
        "User-Agent": getAnythingLLMUserAgent(),
        ...GenericOpenAiLLM.parseCustomHeaders(),
      },
    });

    this._client = client;
    this.model = model;
    this.verbose = true;
    this._supportsToolCalling = null;
    this.maxTokens = process.env.GENERIC_OPEN_AI_MAX_TOKENS
      ? toValidNumber(process.env.GENERIC_OPEN_AI_MAX_TOKENS, 1024)
      : 1024;
  }

  get client() {
    return this._client;
  }

  /**
   * Generic OpenAI backends follow the OpenAI multimodal schema, so audio
   * attachments must be sent as `input_audio` blocks rather than `image_url`.
   * Mirrors the audio handling in the GenericOpenAi chat provider; images and
   * all other attachments keep the inherited `image_url` behavior.
   * @param {Object} message - The message to format
   * @returns {Object} - Message formatted for the API
   */
  formatMessageWithAttachments(message) {
    if (!message.attachments || message.attachments.length === 0)
      return message;

    const content = [{ type: "text", text: message.content }];
    for (const attachment of message.attachments) {
      content.push(attachmentToContentBlock(attachment));
    }

    const { attachments: _, ...rest } = message;
    return { ...rest, content };
  }

  get supportsAgentStreaming() {
    // Honor streaming being disabled via ENV via user preference.
    if (process.env.GENERIC_OPENAI_STREAMING_DISABLED === "true") return false;
    return true;
  }

  async #handleFunctionCallChat({ messages = [] }) {
    return await this.client.chat.completions
      .create({
        model: this.model,
        temperature: 0,
        messages,
        max_tokens: this.maxTokens,
      })
      .then((result) => {
        if (!result.hasOwnProperty("choices"))
          throw new Error("Generic OpenAI chat: No results!");
        if (result.choices.length === 0)
          throw new Error("Generic OpenAI chat: No results length!");
        return result.choices[0].message.content;
      })
      .catch((_) => {
        return null;
      });
  }

  async #handleFunctionCallStream({ messages = [] }) {
    return await this.client.chat.completions.create({
      model: this.model,
      stream: true,
      messages,
    });
  }

  /**
   * Stream a chat completion with tool calling support.
   * Uses native tool calling when supported, otherwise falls back to UnTooled.
   */
  async stream(messages, functions = [], eventHandler = null) {
    const useNative = await this.supportsNativeToolCalling();

    if (!useNative) {
      return await UnTooled.prototype.stream.call(
        this,
        messages,
        functions,
        this.#handleFunctionCallStream.bind(this),
        eventHandler
      );
    }

    this.providerLog(
      "Provider.stream (tooled) - will process this chat completion."
    );

    try {
      return await tooledStream(
        this.client,
        this.model,
        messages,
        functions,
        eventHandler,
        { provider: this }
      );
    } catch (error) {
      console.error(error.message, error);
      if (error instanceof OpenAI.AuthenticationError) throw error;
      if (
        error instanceof OpenAI.RateLimitError ||
        error instanceof OpenAI.InternalServerError ||
        error instanceof OpenAI.APIError
      ) {
        throw new RetryError(error.message);
      }
      throw error;
    }
  }

  /**
   * Create a non-streaming completion with tool calling support.
   * Uses native tool calling when supported, otherwise falls back to UnTooled.
   */
  async complete(messages, functions = []) {
    const useNative = await this.supportsNativeToolCalling();

    if (!useNative) {
      return await UnTooled.prototype.complete.call(
        this,
        messages,
        functions,
        this.#handleFunctionCallChat.bind(this)
      );
    }

    try {
      const result = await tooledComplete(
        this.client,
        this.model,
        messages,
        functions,
        this.getCost.bind(this),
        { provider: this }
      );

      if (result.retryWithError) {
        return this.complete([...messages, result.retryWithError], functions);
      }

      return result;
    } catch (error) {
      if (error instanceof OpenAI.AuthenticationError) throw error;
      if (
        error instanceof OpenAI.RateLimitError ||
        error instanceof OpenAI.InternalServerError ||
        error instanceof OpenAI.APIError
      ) {
        throw new RetryError(error.message);
      }
      throw error;
    }
  }

  /**
   * Get the cost of the completion.
   *
   * @param _usage The completion to get the cost for.
   * @returns The cost of the completion.
   */
  getCost(_usage) {
    return 0;
  }
}

module.exports = GenericOpenAiProvider;
