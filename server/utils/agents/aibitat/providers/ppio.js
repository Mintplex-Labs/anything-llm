const OpenAI = require("openai");
const Provider = require("./ai-provider.js");
const InheritMultiple = require("./helpers/classes.js");
const UnTooled = require("./helpers/untooled.js");

/**
 * The agent provider for the PPIO AI provider.
 */
class PPIOProvider extends InheritMultiple([Provider, UnTooled]) {
  model;

  constructor(config = {}) {
    const { model = "qwen/qwen2.5-32b-instruct" } = config;
    super();
    const client = new OpenAI({
      baseURL: "https://api.ppinfra.com/v3/openai",
      apiKey: process.env.PPIO_API_KEY,
      maxRetries: 3,
      defaultHeaders: {
        "HTTP-Referer": "https://anythingllm.com",
        "X-API-Source": "anythingllm",
      },
    });

    this._client = client;
    this.model = model;
    this.verbose = true;
  }

  get client() {
    return this._client;
  }

  get supportsAgentStreaming() {
    return false;
  }

  async #handleFunctionCallChat({ messages = [] }) {
    return await this.client.chat.completions
      .create({
        model: this.model,
        messages,
      })
      .then((result) => {
        if (!Object.prototype.hasOwnProperty.call(result, "choices"))
          throw new Error("PPIO chat: No results!");
        if (result.choices.length === 0)
          throw new Error("PPIO chat: No results length!");
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

  async stream(messages, functions = [], eventHandler = null) {
    return await UnTooled.prototype.stream.call(
      this,
      messages,
      functions,
      this.#handleFunctionCallStream.bind(this),
      eventHandler
    );
  }

  async complete(messages, functions = []) {
    return await UnTooled.prototype.complete.call(
      this,
      messages,
      functions,
      this.#handleFunctionCallChat.bind(this)
    );
  }

  /**
   * Get the cost of the completion.
   *
   * @param _usage The completion to get the cost for.
   * @returns The cost of the completion.
   * Stubbed since PPIO has no cost basis.
   */
  getCost() {
    return 0;
  }
}

module.exports = PPIOProvider;
