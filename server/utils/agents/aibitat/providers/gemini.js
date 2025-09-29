const OpenAI = require("openai");
const Provider = require("./ai-provider.js");
const InheritMultiple = require("./helpers/classes.js");
const UnTooled = require("./helpers/untooled.js");
const {
  NO_SYSTEM_PROMPT_MODELS,
} = require("../../../AiProviders/gemini/index.js");
const { APIError } = require("../error.js");
const { v4 } = require("uuid");
const { safeJsonParse } = require("../../../http");

/**
 * The agent provider for the Gemini provider.
 * We wrap Gemini in UnTooled because its tool-calling is not supported via the dedicated OpenAI API.
 */
class GeminiProvider extends InheritMultiple([Provider, UnTooled]) {
  model;

  constructor(config = {}) {
    const { model = "gemini-2.0-flash-lite" } = config;
    super();
    this.className = "GeminiProvider";
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

  get supportsAgentStreaming() {
    return false;
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
   * Streaming for Gemini only supports `tools` and not `functions`, so
   * we need to apply some transformations to the messages and functions.
   *
   * @see {functionFormatFunctions}
   * @param {*} messages
   * @param {*} functions
   * @param {*} eventHandler
   * @returns
   */
  async stream(messages, functions = [], eventHandler = null) {
    const msgUUID = v4();
    const stream = await this.client.chat.completions.create({
      model: this.model,
      stream: true,
      messages: this.cleanMsgs(this.formatMessages(messages)),
      ...(Array.isArray(functions) && functions?.length > 0
        ? {
            tools: this.functionFormatFunctions(functions),
            tool_choice: "auto",
          }
        : {}),
    });

    const result = {
      functionCall: null,
      textResponse: "",
    };

    for await (const chunk of stream) {
      if (!chunk?.choices?.[0]) continue; // Skip if no choices
      const choice = chunk.choices[0];

      if (choice.delta?.content) {
        result.textResponse += choice.delta.content;
        eventHandler?.("reportStreamEvent", {
          type: "textResponseChunk",
          uuid: msgUUID,
          content: choice.delta.content,
        });
      }

      if (choice.delta?.tool_calls && choice.delta.tool_calls.length > 0) {
        const toolCall = choice.delta.tool_calls[0];
        if (result.functionCall)
          result.functionCall.arguments += toolCall.function.arguments;
        else {
          result.functionCall = {
            name: toolCall.function.name,
            arguments: toolCall.function.arguments,
          };
        }

        eventHandler?.("reportStreamEvent", {
          uuid: `${msgUUID}:tool_call_invocation`,
          type: "toolCallInvocation",
          content: `Assembling Tool Call: ${result.functionCall.name}(${result.functionCall.arguments})`,
        });
      }
    }

    // If there are arguments, parse them as json so that the tools can use them
    if (!!result.functionCall?.arguments)
      result.functionCall.arguments = safeJsonParse(
        result.functionCall.arguments,
        {}
      );
    return result;
  }

  /**
   * Create a completion based on the received messages.
   *
   * TODO: see stream() - tool_calls are now supported, so we can use that instead of Untooled
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
        textResponse: completion.content,
        cost: 0,
      };
    } catch (error) {
      throw new APIError(
        error?.message
          ? `${this.className} encountered an error while executing the request: ${error.message}`
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
