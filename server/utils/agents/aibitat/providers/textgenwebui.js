const OpenAI = require("openai");
const Provider = require("./ai-provider.js");
const InheritMultiple = require("./helpers/classes.js");
const UnTooled = require("./helpers/untooled.js");
const { getFetchWithCustomTimeout } = require("../../../AiProviders/helpers");

/**
 * The agent provider for the Oobabooga provider.
 */
class TextWebGenUiProvider extends InheritMultiple([Provider, UnTooled]) {
  model;

  constructor(_config = {}) {
    super();
    const client = new OpenAI({
      baseURL: process.env.TEXT_GEN_WEB_UI_BASE_PATH,
      apiKey: process.env.TEXT_GEN_WEB_UI_API_KEY ?? null,
      maxRetries: 3,
      fetch: getFetchWithCustomTimeout(
        process.env.TEXT_GEN_WEB_UI_RESPONSE_TIMEOUT,
        TextWebGenUiProvider.slog
      ),
    });

    this._client = client;
    this.model = "text-generation-webui"; // text-web-gen-ui does not have a model pref, but we need a placeholder
    this.verbose = true;
  }

  get client() {
    return this._client;
  }

  static slog(text, ...args) {
    console.log(`\x1b[32m[TextWebGenUiProvider]\x1b[0m ${text}`, ...args);
  }

  get supportsAgentStreaming() {
    return true;
  }

  /**
   * Whether this provider supports native OpenAI-compatible tool calling.
   * Override in subclass and return true to use native tool calling instead of UnTooled.
   * @returns {boolean|Promise<boolean>}
   */
  supportsNativeToolCalling() {
    return false;
  }

  async #handleFunctionCallChat({ messages = [] }) {
    return await this.client.chat.completions
      .create({
        model: this.model,
        messages,
      })
      .then((result) => {
        if (!result.hasOwnProperty("choices"))
          throw new Error("Oobabooga chat: No results!");
        if (result.choices.length === 0)
          throw new Error("Oobabooga chat: No results length!");
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
   * Stubbed since KoboldCPP has no cost basis.
   */
  getCost(_usage) {
    return 0;
  }
}

module.exports = TextWebGenUiProvider;
