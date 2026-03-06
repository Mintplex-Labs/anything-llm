const OpenAI = require("openai");
const Provider = require("./ai-provider.js");
const { RetryError } = require("../error.js");
const { v4 } = require("uuid");
const { safeJsonParse } = require("../../../http");

/**
 * The agent provider for the OpenAI API.
 * By default, the model is set to 'gpt-3.5-turbo'.
 */
class OpenAIProvider extends Provider {
  model;
  constructor(config = {}) {
    const {
      options = {
        apiKey: process.env.OPEN_AI_KEY,
        maxRetries: 3,
      },
      model = "gpt-4o",
    } = config;

    const client = new OpenAI(options);

    super(client);

    this.model = model;
  }

  get supportsAgentStreaming() {
    return true;
  }

  /**
   * Format the messages to the OpenAI API Responses format.
   * - If the message is our internal `function` type, then we need to map it to a function call + output format
   * - Otherwise, map it to the input text format for user, system, and assistant messages
   *
   * @param {any[]} messages - The messages to format.
   * @returns {OpenAI.OpenAI.Responses.ResponseInput[]} The formatted messages.
   */
  #formatToResponsesInput(messages) {
    let formattedMessages = [];
    messages.forEach((message) => {
      if (message.role === "function") {
        // If the message does not have an originalFunctionCall we cannot
        // map it to a function call id and OpenAI will throw an error.
        // so if this does not carry over - log and skip
        if (!message.hasOwnProperty("originalFunctionCall")) {
          this.providerLog(
            "[OpenAI.#formatToResponsesInput]: message did not pass back the originalFunctionCall. We need this to map the function call to the correct id.",
            { message: JSON.stringify(message, null, 2) }
          );
          return;
        }

        formattedMessages.push(
          {
            type: "function_call",
            name: message.originalFunctionCall.name,
            call_id: message.originalFunctionCall.id,
            arguments: JSON.stringify(message.originalFunctionCall.arguments),
          },
          {
            type: "function_call_output",
            call_id: message.originalFunctionCall.id,
            output: message.content,
          }
        );
        return;
      }

      formattedMessages.push({
        role: message.role,
        content: [
          {
            type: message.role === "assistant" ? "output_text" : "input_text",
            text: message.content,
          },
        ],
      });
    });

    return formattedMessages;
  }

  /**
   * Format the functions to the OpenAI API Responses format.
   *
   * @param {any[]} functions - The functions to format.
   * @returns {{
   *   type: "function",
   *   name: string,
   *   description: string,
   *   parameters: object,
   *   strict: boolean,
   * }[]} The formatted functions.
   */
  #formatFunctions(functions) {
    return functions.map((func) => ({
      type: "function",
      name: func.name,
      description: func.description,
      parameters: func.parameters,
      strict: false,
    }));
  }

  /**
   * Stream a chat completion from the LLM with tool calling
   * Note: This using the OpenAI API Responses SDK and its implementation is specific to OpenAI models.
   * Do not re-use this code for providers that do not EXACTLY implement the OpenAI API Responses SDK.
   *
   * @param {any[]} messages - The messages to send to the LLM.
   * @param {any[]} functions - The functions to use in the LLM.
   * @param {function} eventHandler - The event handler to use to report stream events.
   * @returns {Promise<{ functionCall: any, textResponse: string }>} - The result of the chat completion.
   */
  async stream(messages, functions = [], eventHandler = null) {
    this.providerLog("OpenAI.stream - will process this chat completion.");
    try {
      const msgUUID = v4();

      /** @type {OpenAI.OpenAI.Responses.Response} */
      const response = await this.client.responses.create({
        model: this.model,
        input: this.#formatToResponsesInput(messages),
        stream: true,
        store: false,
        parallel_tool_calls: false,
        ...(Array.isArray(functions) && functions?.length > 0
          ? { tools: this.#formatFunctions(functions) }
          : {}),
      });

      const completion = {
        content: "",
        /** @type {null|{name: string, call_id: string, arguments: string|object}} */
        functionCall: null,
      };

      for await (const streamEvent of response) {
        /** @type {OpenAI.OpenAI.Responses.ResponseStreamEvent} */
        const chunk = streamEvent;

        if (chunk.type === "response.output_text.delta") {
          completion.content += chunk.delta;
          eventHandler?.("reportStreamEvent", {
            type: "textResponseChunk",
            uuid: msgUUID,
            content: chunk.delta,
          });
          continue;
        }

        if (
          chunk.type === "response.output_item.added" &&
          chunk.item.type === "function_call"
        ) {
          completion.functionCall = {
            name: chunk.item.name,
            call_id: chunk.item.call_id,
            arguments: chunk.item.arguments,
          };
          eventHandler?.("reportStreamEvent", {
            type: "toolCallInvocation",
            uuid: `${msgUUID}:tool_call_invocation`,
            content: `Assembling Tool Call: ${completion.functionCall.name}(${completion.functionCall.arguments})`,
          });
          continue;
        }

        if (chunk.type === "response.function_call_arguments.delta") {
          completion.functionCall.arguments += chunk.delta;
          eventHandler?.("reportStreamEvent", {
            type: "toolCallInvocation",
            uuid: `${msgUUID}:tool_call_invocation`,
            content: `Assembling Tool Call: ${completion.functionCall.name}(${completion.functionCall.arguments})`,
          });
          continue;
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
   * Create a completion based on the received messages.
   *
   * @param messages A list of messages to send to the OpenAI API.
   * @param functions
   * @returns The completion.
   */
  async complete(messages, functions = []) {
    this.providerLog("OpenAI.complete - will process this chat completion.");
    try {
      const completion = {
        content: "",
        functionCall: null,
      };

      /** @type {OpenAI.OpenAI.Responses.Response} */
      const response = await this.client.responses.create({
        model: this.model,
        stream: false,
        store: false,
        parallel_tool_calls: false,
        input: this.#formatToResponsesInput(messages),
        ...(Array.isArray(functions) && functions?.length > 0
          ? { tools: this.#formatFunctions(functions) }
          : {}),
      });

      for (const outputBlock of response.output) {
        // Grab intermediate text output if it exists
        // If no tools are used, this will be returned to the aibitat handler
        // Otherwise, this text will never be shown to the user
        if (outputBlock.type === "message") {
          if (outputBlock.content[0]?.type === "output_text") {
            completion.content = outputBlock.content[0].text;
          }
        }

        // Grab function call output if it exists
        if (outputBlock.type === "function_call") {
          completion.functionCall = {
            name: outputBlock.name,
            call_id: outputBlock.call_id,
            arguments: outputBlock.arguments,
          };
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
            // For OpenAI, the id is the call_id and we need it in followup requests
            // so we can match the function call output to its invocation in the message history.
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
  getCost() {
    return 0;
  }
}

module.exports = OpenAIProvider;
