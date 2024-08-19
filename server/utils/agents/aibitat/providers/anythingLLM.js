const {
  AnythingLLMOllama,
} = require("../../../AiProviders/anythingLLM/index.js");
const Provider = require("./ai-provider.js");
const InheritMultiple = require("./helpers/classes.js");
const UnTooled = require("./helpers/untooled.js");
const { Ollama } = require("ollama");

/**
 * The provider for the AnythingLLM x Ollama provider.
 */
class AnythingLLMOllamaProvider extends InheritMultiple([Provider, UnTooled]) {
  model;

  constructor(config = {}) {
    const {
      // options = {},
      model = null,
    } = config;
    super();
    this._client = new Ollama({
      host: `http://127.0.0.1:${process.env.ANYTHING_LLM_OLLAMA_PORT}`,
    });
    this.model = model;
    this.verbose = true;
  }

  get client() {
    return this._client;
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

  /**
   * Create a completion based on the received messages.
   *
   * @param messages A list of messages to send to the API.
   * @param functions
   * @returns The completion.
   */
  async complete(messages, functions = null) {
    try {
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
        this.providerLog(
          "Will assume chat completion without tool call inputs."
        );
        const response = await this.client.chat({
          model: this.model,
          messages: this.cleanMsgs(messages),
          options: {
            use_mlock: true,
            temperature: 0.5,
          },
        });
        completion = response.message;
      }

      return {
        result: completion.content,
        cost: 0,
      };
    } catch (error) {
      throw error;
    }
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

module.exports = AnythingLLMOllamaProvider;
