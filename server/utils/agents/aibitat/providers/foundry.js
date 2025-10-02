const OpenAI = require("openai");
const Provider = require("./ai-provider.js");
const InheritMultiple = require("./helpers/classes.js");
const UnTooled = require("./helpers/untooled.js");
const {
  parseFoundryBasePath,
  FoundryLLM,
} = require("../../../AiProviders/foundry/index.js");

/**
 * The agent provider for the Foundry provider.
 * Uses untooled because it doesn't support tool calling.
 */
class FoundryProvider extends InheritMultiple([Provider, UnTooled]) {
  model;

  constructor(config = {}) {
    const { model = process.env.FOUNDRY_MODEL_PREF } = config;
    super();
    const client = new OpenAI({
      baseURL: parseFoundryBasePath(process.env.FOUNDRY_BASE_PATH),
      apiKey: null,
      maxRetries: 3,
    });

    this._client = client;
    this.model = model;
    this.verbose = true;
  }

  /**
   * Get the client.
   * @returns {OpenAI.OpenAI}
   */
  get client() {
    return this._client;
  }

  get supportsAgentStreaming() {
    return true;
  }

  async #handleFunctionCallChat({ messages = [] }) {
    await FoundryLLM.cacheContextWindows();
    return await this.client.chat.completions
      .create({
        model: this.model,
        messages,
        max_completion_tokens: FoundryLLM.promptWindowLimit(this.model),
      })
      .then((result) => {
        if (!result.hasOwnProperty("choices"))
          throw new Error("Microsoft Foundry Local chat: No results!");
        if (result.choices.length === 0)
          throw new Error("Microsoft Foundry Local chat: No results length!");
        return result.choices[0].message.content;
      })
      .catch((_) => {
        return null;
      });
  }

  async #handleFunctionCallStream({ messages = [] }) {
    await FoundryLLM.cacheContextWindows();
    return await this.client.chat.completions.create({
      model: this.model,
      stream: true,
      messages,
      max_completion_tokens: FoundryLLM.promptWindowLimit(this.model),
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
   */
  getCost(_usage) {
    return 0;
  }
}

module.exports = FoundryProvider;
