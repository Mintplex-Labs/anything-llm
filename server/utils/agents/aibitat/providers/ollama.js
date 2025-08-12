const Provider = require("./ai-provider.js");
const InheritMultiple = require("./helpers/classes.js");
const UnTooled = require("./helpers/untooled.js");
const { Ollama } = require("ollama");

/**
 * The agent provider for the Ollama provider.
 */
class OllamaProvider extends InheritMultiple([Provider, UnTooled]) {
  model;

  constructor(config = {}) {
    const {
      // options = {},
      model = null,
    } = config;

    super();
    const headers = process.env.OLLAMA_AUTH_TOKEN
      ? { Authorization: `Bearer ${process.env.OLLAMA_AUTH_TOKEN}` }
      : {};
    this._client = new Ollama({
      host: process.env.OLLAMA_BASE_PATH,
      headers: headers,
    });
    this.model = model;
    this.verbose = true;
  }

  get client() {
    return this._client;
  }

  get supportsAgentStreaming() {
    return true;
  }

  async #handleFunctionCallChat({ messages = [] }) {
    const response = await this.client.chat({
      model: this.model,
      messages,
      options: {
        temperature: 0,
      },
    });
    return response?.message?.content || null;
  }

  async #handleFunctionCallStream({ messages = [] }) {
    return await this.client.chat({
      model: this.model,
      messages,
      stream: true,
      options: {
        temperature: 0,
      },
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
   * Stubbed since LMStudio has no cost basis.
   */
  getCost(_usage) {
    return 0;
  }
}

module.exports = OllamaProvider;
