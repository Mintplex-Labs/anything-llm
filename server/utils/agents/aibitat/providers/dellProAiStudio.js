const OpenAI = require("openai");
const Provider = require("./ai-provider.js");
const InheritMultiple = require("./helpers/classes.js");
const UnTooled = require("./helpers/untooled.js");
const {
  DellProAiStudioLLM,
} = require("../../../AiProviders/dellProAiStudio/index.js");

/**
 * The agent provider for Dell Pro AI Studio.
 */
class DellProAiStudioProvider extends InheritMultiple([Provider, UnTooled]) {
  model;

  /**
   *
   * @param {{model?: string}} config
   */
  constructor(config = {}) {
    super();
    const model = config?.model || process.env.DPAIS_LLM_MODEL_PREF;
    const client = new OpenAI({
      baseURL: DellProAiStudioLLM.parseBasePath(), // Will use process.env.DPAIS_LLM_BASE_PATH if not provided
      apiKey: null,
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
      })
      .then((result) => {
        if (!result.hasOwnProperty("choices"))
          throw new Error("DellProAiStudio chat: No results!");
        if (result.choices.length === 0)
          throw new Error("DellProAiStudio chat: No results length!");
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
   * Stubbed since LMStudio has no cost basis.
   */
  getCost(_usage) {
    return 0;
  }
}

module.exports = DellProAiStudioProvider;
