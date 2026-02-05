const OpenAI = require("openai");
const Provider = require("./ai-provider.js");
const InheritMultiple = require("./helpers/classes.js");
const UnTooled = require("./helpers/untooled.js");
const { PrivatemodeLLM } = require("../../../AiProviders/privatemode/index.js");

/**
 * The agent provider for the Privatemodel provider.
 * @extends {Provider}
 * @extends {UnTooled}
 */
class PrivatemodelProvider extends InheritMultiple([Provider, UnTooled]) {
  model;

  constructor(config = {}) {
    const { model = process.env.PRIVATEMODE_LLM_MODEL_PREF } = config;
    super();
    const client = new OpenAI({
      baseURL: PrivatemodeLLM.parseBasePath(
        process.env.PRIVATEMODE_LLM_BASE_PATH
      ),
      apiKey: null,
      maxRetries: 3,
    });

    this._client = client;
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
    return await this.client.chat.completions
      .create({
        model: this.model,
        messages,
        user: this.executingUserId,
      })
      .then((result) => {
        if (!result.hasOwnProperty("choices"))
          throw new Error("Privatemodel chat: No results!");
        if (result.choices.length === 0)
          throw new Error("Privatemodel chat: No results length!");
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
      user: this.executingUserId,
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
   * Stubbed since Privatemodel has no cost basis.
   */
  getCost(_usage) {
    return 0;
  }
}

module.exports = PrivatemodelProvider;
