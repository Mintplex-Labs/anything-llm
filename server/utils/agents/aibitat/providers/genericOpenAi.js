const OpenAI = require("openai");
const Provider = require("./ai-provider.js");
const InheritMultiple = require("./helpers/classes.js");
const UnTooled = require("./helpers/untooled.js");

/**
 * The provider for the Generic OpenAI provider.
 * Since we cannot promise the generic provider even supports tool calling
 * which is nearly 100% likely it does not, we can just wrap it in untooled
 * which often is far better anyway.
 */
class GenericOpenAiProvider extends InheritMultiple([Provider, UnTooled]) {
  model;

  constructor(config = {}) {
    super();
    const { model = "gpt-3.5-turbo" } = config;
    const client = new OpenAI({
      baseURL: process.env.GENERIC_OPEN_AI_BASE_PATH,
      apiKey: process.env.GENERIC_OPEN_AI_API_KEY ?? null,
      maxRetries: 3,
    });

    this._client = client;
    this.model = model;
    this.verbose = true;
    this.maxTokens = process.env.GENERIC_OPEN_AI_MAX_TOKENS ?? 1024;
  }

  get client() {
    return this._client;
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
        const response = await this.client.chat.completions.create({
          model: this.model,
          messages: this.cleanMsgs(messages),
        });
        completion = response.choices[0].message;
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
   */
  getCost(_usage) {
    return 0;
  }
}

module.exports = GenericOpenAiProvider;
