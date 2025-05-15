const OpenAI = require("openai");
const Provider = require("./ai-provider.js");
const InheritMultiple = require("./helpers/classes.js");
const UnTooled = require("./helpers/untooled.js");
const {
  NO_SYSTEM_PROMPT_MODELS,
} = require("../../../AiProviders/gemini/index.js");
const { APIError } = require("../error.js");

/**
 * The agent provider for the Gemini provider.
 * We wrap Gemini in UnTooled because its tool-calling is not supported via the dedicated OpenAI API.
 */
class GeminiProvider extends InheritMultiple([Provider, UnTooled]) {
  model;

  constructor(config = {}) {
    const { model = "gemini-2.0-flash-lite" } = config;
    super();
    const client = new OpenAI({
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
      apiKey: process.env.GEMINI_API_KEY,
      maxRetries: 0,
    });

    this._client = client;
    this.model = model;
    this.verbose = true;
  }

  get client() {
    return this._client;
  }

  /**
   * Format the messages to the format required by the Gemini API since some models do not support system prompts.
   * @see {NO_SYSTEM_PROMPT_MODELS}
   * @param {import("openai").OpenAI.ChatCompletionMessage[]} messages
   * @returns {import("openai").OpenAI.ChatCompletionMessage[]}
   */
  formatMessages(messages) {
    if (!NO_SYSTEM_PROMPT_MODELS.includes(this.model)) return messages;

    // Replace the system message with a user/assistant message pair
    const formattedMessages = [];
    for (const message of messages) {
      if (message.role === "system") {
        formattedMessages.push({
          role: "user",
          content: message.content,
        });
        formattedMessages.push({
          role: "assistant",
          content: "Okay, I'll follow your instructions.",
        });
        continue;
      }
      formattedMessages.push(message);
    }
    return formattedMessages;
  }

  async #handleFunctionCallChat({ messages = [] }) {
    return await this.client.chat.completions
      .create({
        model: this.model,
        temperature: 0,
        messages: this.cleanMsgs(this.formatMessages(messages)),
      })
      .then((result) => {
        if (!result.hasOwnProperty("choices"))
          throw new Error("Gemini chat: No results!");
        if (result.choices.length === 0)
          throw new Error("Gemini chat: No results length!");
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
  async complete(messages, functions = []) {
    try {
      let completion;

      if (functions.length > 0) {
        const { toolCall, text } = await this.functionCall(
          this.cleanMsgs(this.formatMessages(messages)),
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
          messages: this.cleanMsgs(this.formatMessages(messages)),
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
    } catch (error) {
      throw new APIError(
        error?.message
          ? `${this.constructor.name} encountered an error while executing the request: ${error.message}`
          : "There was an error with the Gemini provider executing the request"
      );
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

module.exports = GeminiProvider;
