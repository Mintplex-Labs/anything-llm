const OpenAI = require("openai");
const Provider = require("./ai-provider.js");
const InheritMultiple = require("./helpers/classes.js");
const UnTooled = require("./helpers/untooled.js");
const { tooledStream, tooledComplete } = require("./helpers/tooled.js");
const { RetryError } = require("../error.js");
const { toValidNumber } = require("../../../http/index.js");
const { VertexLLM } = require("../../../AiProviders/vertex");

class VertexProvider extends InheritMultiple([Provider, UnTooled]) {
  model;

  constructor(config = {}) {
    super();
    const { model = "gemini-2.5-flash" } = config;
    // Vertex only accepts the API key via `x-goog-api-key` and rejects any
    // request that also carries an Authorization header, so the SDK's own
    // bearer header must be removed (a null default header deletes it).
    const client = new OpenAI({
      baseURL: VertexLLM.openaiBaseURL(),
      apiKey: "anythingllm",
      defaultHeaders: {
        Authorization: null,
        "x-goog-api-key": process.env.VERTEX_AI_LLM_API_KEY ?? null,
      },
    });

    this.providerTag = "vertex";
    this._client = client;
    this.model = model;
    this.verbose = true;
    this.maxTokens = process.env.VERTEX_AI_LLM_MAX_TOKENS
      ? toValidNumber(process.env.VERTEX_AI_LLM_MAX_TOKENS, 1024)
      : 1024;
  }

  get client() {
    return this._client;
  }

  get supportsAgentStreaming() {
    return true;
  }

  get #apiModelId() {
    return VertexLLM.apiModelId(this.model);
  }

  async #handleFunctionCallChat({ messages = [] }) {
    return await this.client.chat.completions
      .create({
        model: this.#apiModelId,
        temperature: this.temperature,
        messages,
        max_tokens: this.maxTokens,
      })
      .then((result) => {
        if (!result.hasOwnProperty("choices"))
          throw new Error("Vertex AI chat: No results!");
        if (result.choices.length === 0)
          throw new Error("Vertex AI chat: No results length!");
        return result.choices[0].message.content;
      })
      .catch((_) => {
        return null;
      });
  }

  async #handleFunctionCallStream({ messages = [] }) {
    return await this.client.chat.completions.create({
      model: this.#apiModelId,
      temperature: this.temperature,
      stream: true,
      messages,
    });
  }

  async stream(messages, functions = [], eventHandler = null) {
    const useNative = this.supportsNativeToolCalling();

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
        this.#apiModelId,
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

  async complete(messages, functions = []) {
    const useNative = this.supportsNativeToolCalling();

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
        this.#apiModelId,
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

module.exports = VertexProvider;
