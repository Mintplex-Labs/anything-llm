const OpenAI = require("openai");
const Provider = require("./ai-provider.js");
const InheritMultiple = require("./helpers/classes.js");
const UnTooled = require("./helpers/untooled.js");

/**
 * The agent provider for the Novita AI provider.
 */
class NovitaProvider extends InheritMultiple([Provider, UnTooled]) {
  model;

  constructor(config = {}) {
    const { model = "gryphe/mythomax-l2-13b" } = config;
    super();
    const client = new OpenAI({
      baseURL: "https://api.novita.ai/v3/openai",
      apiKey: process.env.NOVITA_LLM_API_KEY,
      maxRetries: 3,
      defaultHeaders: {
        "HTTP-Referer": "https://anythingllm.com",
        "X-Novita-Source": "anythingllm",
      },
    });

    this._client = client;
    this.model = model;
    this.verbose = true;
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
      })
      .then((result) => {
        if (!result.hasOwnProperty("choices"))
          throw new Error("Novita chat: No results!");
        if (result.choices.length === 0)
          throw new Error("Novita chat: No results length!");
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
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: this.cleanMsgs(messages),
      });
      completion = response.choices[0].message;
    }

    // The UnTooled class inherited Deduplicator is mostly useful to prevent the agent
    // from calling the exact same function over and over in a loop within a single chat exchange
    // _but_ we should enable it to call previously used tools in a new chat interaction.
    this.deduplicator.reset("runs");
    return {
      result: completion.content,
      cost: 0,
    };
  }

  /**
   * Get the cost of the completion.
   *
   * @param _usage The completion to get the cost for.
   * @returns The cost of the completion.
   * Stubbed since Novita AI has no cost basis.
   */
  getCost() {
    return 0;
  }
}

module.exports = NovitaProvider;
