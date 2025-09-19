const OpenAI = require("openai");
const Provider = require("./ai-provider.js");
const InheritMultiple = require("./helpers/classes.js");
const UnTooled = require("./helpers/untooled.js");
const { normalizeBaseUrl } = require("../../../helpers/url");

/**
 * The agent provider for Foundry Local.
 */
class FoundryProvider extends InheritMultiple([Provider, UnTooled]) {
  // The `model` parameter is referring to the alias of the
  // model since Foundry Local automatically chooses the best
  // model to use.
  // In order to use the OpenAI API we need to get the model id
  model;
  modelId = null;

  constructor(config = {}) {
    super();
    const model =
      config?.model || process.env.FOUNDRY_MODEL_PREF || "phi-3.5-mini";

    const base = process.env.FOUNDRY_BASE_PATH;
    const normalizedBase = normalizeBaseUrl(base);
    const baseURL = `${normalizedBase}/v1`;

    const client = new OpenAI({
      baseURL: baseURL,
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

  async #loadModel() {
    if (this.modelId) {
      return this.modelId;
    }

    // Get actual model id from Foundry SDK
    const { FoundryLocalManager } = require("foundry-local-sdk");
    const manager = new FoundryLocalManager();

    await manager.init();
    const sdkModelInfo = await manager.loadModel(this.model);
    this.modelId = sdkModelInfo.id;

    return this.modelId;
  }

  async #handleFunctionCallChat({ messages = [] }) {
    const modelId = await this.#loadModel();
    return await this.client.chat.completions
      .create({
        model: modelId,
        temperature: 0,
        messages,
      })
      .then((result) => {
        if (!Object.prototype.hasOwnProperty.call(result, "choices"))
          throw new Error("Foundry chat: No results!");
        if (result.choices.length === 0)
          throw new Error("Foundry chat: No results length!");
        return result.choices[0].message.content;
      })
      .catch(() => {
        return null;
      });
  }

  /**
   * Create a completion based on the received messages.
   *
   * @param messages A list of messages to send to the API.
   * @param functions
   * @returns The completion.
   */
  async complete(messages, functions = []) {
    let completion;
    if (functions.length > 0) {
      const { toolCall, text } = await this.functionCall(
        messages,
        functions,
        this.#handleFunctionCallChat.bind(this)
      );

      if (toolCall !== null) {
        this.providerLog(`Valid tool call found - running ${toolCall.name}.`);
        this.deduplicator.trackRun(toolCall.name, toolCall.arguments);
        return {
          result: null,
          functionCall: {
            name: toolCall.name,
            arguments: toolCall.arguments,
          },
          cost: 0,
        };
      }
      completion = { content: text };
    }

    if (!completion?.content) {
      this.providerLog("Will assume chat completion without tool call inputs.");
      const modelId = await this.#loadModel();

      const response = await this.client.chat.completions.create({
        model: modelId,
        messages: this.cleanMsgs(messages),
      });
      completion = response.choices[0].message;
    }

    // Reset deduplicator for new chat interactions
    this.deduplicator.reset("runs");
    return {
      result: completion.content,
      cost: 0,
    };
  }

  /**
   * Get the cost of the completion.
   * Foundry Local runs locally so no cost.
   */
  getCost() {
    return 0;
  }
}

module.exports = FoundryProvider;
