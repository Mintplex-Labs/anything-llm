const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
const Provider = require("./ai-provider.js");
const InheritMultiple = require("./helpers/classes.js");
const UnTooled = require("./helpers/untooled.js");

/**
 * The provider for the Azure OpenAI API.
 */
class AzureOpenAiProvider extends InheritMultiple([Provider, UnTooled]) {
  model;

  constructor(_config = {}) {
    super();
    const client = new OpenAIClient(
      process.env.AZURE_OPENAI_ENDPOINT,
      new AzureKeyCredential(process.env.AZURE_OPENAI_KEY)
    );
    this._client = client;
    this.model = process.env.OPEN_MODEL_PREF ?? "gpt-3.5-turbo";
    this.verbose = true;
  }

  get client() {
    return this._client;
  }

  async #handleFunctionCallChat({ messages = [] }) {
    return await this.client
      .getChatCompletions(this.model, messages, {
        temperature: 0,
      })
      .then((result) => {
        if (!result.hasOwnProperty("choices"))
          throw new Error("Azure OpenAI chat: No results!");
        if (result.choices.length === 0)
          throw new Error("Azure OpenAI chat: No results length!");
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
        const response = await this.client.getChatCompletions(
          this.model,
          this.cleanMsgs(messages),
          {
            temperature: 0.7,
          }
        );
        completion = response.choices[0].message;
      }
      return { result: completion.content, cost: 0 };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get the cost of the completion.
   * Stubbed since Azure OpenAI has no public cost basis.
   *
   * @param _usage The completion to get the cost for.
   * @returns The cost of the completion.
   */
  getCost(_usage) {
    return 0;
  }
}

module.exports = AzureOpenAiProvider;
