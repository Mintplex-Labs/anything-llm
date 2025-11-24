const OpenAI = require("openai");
const Provider = require("./ai-provider.js");
const { RetryError } = require("../error.js");
const { safeJsonParse } = require("../../../http");
const { v4 } = require("uuid");

/**
 * The agent provider for the Gemini provider.
 * We wrap Gemini in UnTooled because its tool-calling is not supported via the dedicated OpenAI API.
 */
class GeminiProvider extends Provider {
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

  get supportsToolCalling() {
    if (!this.model.startsWith("gemini")) return false;
    return true;
  }

  get supportsAgentStreaming() {
    // Tool call streaming results in a 400/503 error for all non-gemini models
    // using the compatible v1beta/openai/ endpoint
    if (!this.model.startsWith("gemini")) {
      this.providerLog(
        `Gemini: ${this.model} does not support tool call streaming.`
      );
      return false;
    }
    return true;
  }

  /**
   * Gemini specifcally will throw an error if the tool call's function name
   * starts with a non-alpha character. So we need to prefix the function names
   * with a valid prefix to ensure they are always valid and then strip them back
   * so they may properly be used in the tool call.
   *
   * So for all tools, we force the prefix to be gtc__ to avoid issues
   * Agent flows are already prefixed with flow__ but since we strip the prefix
   * anyway pre and post-reply, we do it anyway to ensure consistency across all tools.
   *
   * This specifically impacts the custom Agent Skills since they can be a short alphanumeric
   * and cant definitely start with a number. eg: '12xdaya31bas' -> invalid in gemini tools.
   *
   * Even if the tool is never called, if it is in the `tools` array and this prefix
   * patch is not applied, gemini will throw an error.
   *
   * This is undocumented by google, but it is the only way to ensure that tool calls
   * are valid.
   *
   * @param {string} functionName - The name of the function to prefix.
   * @param {'add' | 'strip'} action - The action to take.
   * @returns {string} The prefixed function name.
   * @returns {string} The prefix to use for tool call ids.
   */
  prefixToolCall(functionName, action = "add") {
    if (action === "add") return `gtc__${functionName}`;
    // must start with gtc__ to be valid and we only strip the first instance
    return functionName.startsWith("gtc__")
      ? functionName.split("gtc__")[1]
      : functionName;
  }

  /**
   * Format the messages to the Gemini API Responses format.
   * - Gemini has some loosely documented format for tool calls and it can change at any time.
   * - We need to map the function call to the correct id and Gemini will throw an error if it does not.
   * @param {any[]} messages - The messages to format.
   * @returns {OpenAI.OpenAI.Responses.ResponseInput[]} The formatted messages.
   */
  #formatMessages(messages) {
    let formattedMessages = [];
    messages.forEach((message) => {
      if (message.role === "function") {
        // If the message does not have an originalFunctionCall we cannot
        // map it to a function call id and Gemini will throw an error.
        // so if this does not carry over - log and skip
        if (!message.hasOwnProperty("originalFunctionCall")) {
          this.providerLog(
            "[Gemini.#formatMessages]: message did not pass back the originalFunctionCall. We need this to map the function call to the correct id.",
            { message: JSON.stringify(message, null, 2) }
          );
          return;
        }

        formattedMessages.push(
          {
            role: "assistant",
            tool_calls: [
              {
                type: "function",
                function: {
                  arguments: JSON.stringify(
                    message.originalFunctionCall.arguments
                  ),
                  name: message.originalFunctionCall.name,
                },
                id: message.originalFunctionCall.id,
              },
            ],
          },
          {
            role: "tool",
            tool_call_id: message.originalFunctionCall.id,
            content: message.content,
          }
        );
        return;
      }

      formattedMessages.push({
        role: message.role,
        content: message.content,
      });
    });

    return formattedMessages;
  }

  #formatFunctions(functions) {
    return functions.map((func) => ({
      type: "function",
      function: {
        name: this.prefixToolCall(func.name, "add"),
        description: func.description,
        parameters: func.parameters,
      },
    }));
  }

  async stream(messages, functions = [], eventHandler = null) {
    if (!this.supportsToolCalling)
      throw new Error(`Gemini: ${this.model} does not support tool calling.`);
    this.providerLog("Gemini.stream - will process this chat completion.");
    try {
      const msgUUID = v4();
      /** @type {OpenAI.OpenAI.Chat.ChatCompletion} */
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: this.#formatMessages(messages),
        stream: true,
        ...(Array.isArray(functions) && functions?.length > 0
          ? { tools: this.#formatFunctions(functions), tool_choice: "auto" }
          : {}),
      });

      const completion = {
        content: "",
        /** @type {null|{name: string, call_id: string, arguments: string|object}} */
        functionCall: null,
      };

      for await (const streamEvent of response) {
        /** @type {OpenAI.OpenAI.Chat.ChatCompletionChunk} */
        const chunk = streamEvent;
        const { content, tool_calls } = chunk?.choices?.[0]?.delta || {};

        if (content) {
          completion.content += content;
          eventHandler?.("reportStreamEvent", {
            type: "textResponseChunk",
            uuid: msgUUID,
            content,
          });
        }

        if (tool_calls) {
          const toolCall = tool_calls[0];
          completion.functionCall = {
            name: this.prefixToolCall(toolCall.function.name, "strip"),
            call_id: toolCall.id,
            arguments: toolCall.function.arguments,
          };
          eventHandler?.("reportStreamEvent", {
            type: "toolCallInvocation",
            uuid: `${msgUUID}:tool_call_invocation`,
            content: `Assembling Tool Call: ${completion.functionCall.name}(${completion.functionCall.arguments})`,
          });
        }
      }

      if (completion.functionCall) {
        completion.functionCall.arguments = safeJsonParse(
          completion.functionCall.arguments,
          {}
        );
        return {
          textResponse: completion.content,
          functionCall: {
            id: completion.functionCall.call_id,
            name: completion.functionCall.name,
            arguments: completion.functionCall.arguments,
          },
          cost: this.getCost(),
        };
      }

      return {
        textResponse: completion.content,
        functionCall: null,
        cost: this.getCost(),
      };
    } catch (error) {
      if (error instanceof OpenAI.AuthenticationError) throw error;
      if (
        error instanceof OpenAI.RateLimitError ||
        error instanceof OpenAI.InternalServerError ||
        error instanceof OpenAI.APIError // Also will catch AuthenticationError!!!
      ) {
        throw new RetryError(error.message);
      }

      throw error;
    }
  }

  /**
   * Create a completion based on the received messages.
   *
   * @param messages A list of messages to send to the Gemini API.
   * @param functions
   * @returns The completion.
   */
  async complete(messages, functions = []) {
    if (!this.supportsToolCalling)
      throw new Error(`Gemini: ${this.model} does not support tool calling.`);
    this.providerLog("Gemini.complete - will process this chat completion.");
    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        stream: false,
        messages: this.#formatMessages(messages),
        ...(Array.isArray(functions) && functions?.length > 0
          ? { tools: this.#formatFunctions(functions), tool_choice: "auto" }
          : {}),
      });

      /** @type {OpenAI.OpenAI.Chat.ChatCompletionMessage} */
      const completion = response.choices[0].message;
      const cost = this.getCost(response.usage);
      if (completion?.tool_calls?.length > 0) {
        const toolCall = completion.tool_calls[0];
        let functionArgs = safeJsonParse(toolCall.function.arguments, {});
        return {
          textResponse: null,
          functionCall: {
            name: this.prefixToolCall(toolCall.function.name, "strip"),
            arguments: functionArgs,
            id: toolCall.id,
          },
          cost,
        };
      }

      return {
        textResponse: completion.content,
        cost,
      };
    } catch (error) {
      // If invalid Auth error we need to abort because no amount of waiting
      // will make auth better.
      if (error instanceof OpenAI.AuthenticationError) throw error;

      if (
        error instanceof OpenAI.RateLimitError ||
        error instanceof OpenAI.InternalServerError ||
        error instanceof OpenAI.APIError // Also will catch AuthenticationError!!!
      ) {
        throw new RetryError(error.message);
      }

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

module.exports = GeminiProvider;
