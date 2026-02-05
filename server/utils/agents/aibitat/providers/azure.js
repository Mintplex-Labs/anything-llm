const { OpenAI } = require("openai");
const { AzureOpenAiLLM } = require("../../../AiProviders/azureOpenAi");
const Provider = require("./ai-provider.js");
const { RetryError } = require("../error.js");
const { v4 } = require("uuid");
const { safeJsonParse } = require("../../../http");

/**
 * The agent provider for the Azure OpenAI API.
 * Uses the tool calling format (not legacy function calling) for compatibility
 * with newer Azure OpenAI models.
 */
class AzureOpenAiProvider extends Provider {
  model;

  constructor(config = { model: null }) {
    const client = new OpenAI({
      apiKey: process.env.AZURE_OPENAI_KEY,
      baseURL: AzureOpenAiLLM.formatBaseUrl(process.env.AZURE_OPENAI_ENDPOINT),
    });
    super(client);
    this.model = config.model ?? process.env.OPEN_MODEL_PREF;
    this.verbose = true;
  }

  get supportsAgentStreaming() {
    return true;
  }

  /**
   * Convert legacy function definitions to the tools format.
   * @param {Array} functions - Legacy function definitions
   * @returns {Array} Tools in the new format
   */
  #formatFunctionsToTools(functions) {
    if (!Array.isArray(functions) || functions.length === 0) return [];
    return functions.map((func) => ({
      type: "function",
      function: {
        name: func.name,
        description: func.description,
        parameters: func.parameters,
      },
    }));
  }

  /**
   * Format messages to use tool calling format instead of legacy function format.
   * Converts role: "function" messages to role: "tool" messages.
   * @param {Array} messages - Messages array that may contain legacy function messages
   * @returns {Array} Messages formatted for tool calling
   */
  #formatMessagesForTools(messages) {
    const formattedMessages = [];

    for (const message of messages) {
      if (message.role === "function") {
        // Convert legacy function result to tool result format
        // We need the tool_call_id from the originalFunctionCall
        if (message.originalFunctionCall?.id) {
          // First, add the assistant message with the tool_call if not already present
          // Check if previous message already has this tool call
          const prevMsg = formattedMessages[formattedMessages.length - 1];
          if (!prevMsg || prevMsg.role !== "assistant" || !prevMsg.tool_calls) {
            formattedMessages.push({
              role: "assistant",
              content: null,
              tool_calls: [
                {
                  id: message.originalFunctionCall.id,
                  type: "function",
                  function: {
                    name: message.originalFunctionCall.name,
                    arguments:
                      typeof message.originalFunctionCall.arguments === "string"
                        ? message.originalFunctionCall.arguments
                        : JSON.stringify(
                            message.originalFunctionCall.arguments
                          ),
                  },
                },
              ],
            });
          }
          // Add the tool result
          formattedMessages.push({
            role: "tool",
            tool_call_id: message.originalFunctionCall.id,
            content:
              typeof message.content === "string"
                ? message.content
                : JSON.stringify(message.content),
          });
        } else {
          // Fallback: generate a tool_call_id if not present
          const toolCallId = `call_${v4()}`;
          formattedMessages.push({
            role: "assistant",
            content: null,
            tool_calls: [
              {
                id: toolCallId,
                type: "function",
                function: {
                  name: message.name,
                  arguments: "{}",
                },
              },
            ],
          });
          formattedMessages.push({
            role: "tool",
            tool_call_id: toolCallId,
            content:
              typeof message.content === "string"
                ? message.content
                : JSON.stringify(message.content),
          });
        }
      } else {
        formattedMessages.push(message);
      }
    }

    return formattedMessages;
  }

  /**
   * Stream a chat completion from the LLM with tool calling.
   * Uses the tool calling format instead of legacy function calling.
   *
   * @param {any[]} messages - The messages to send to the LLM.
   * @param {any[]} functions - The functions to use in the LLM.
   * @param {function} eventHandler - The event handler to use to report stream events.
   * @returns {Promise<{ functionCall: any, textResponse: string }>} - The result of the chat completion.
   */
  async stream(messages, functions = [], eventHandler = null) {
    this.providerLog("Provider.stream - will process this chat completion.");
    const msgUUID = v4();

    try {
      const formattedMessages = this.#formatMessagesForTools(messages);
      const tools = this.#formatFunctionsToTools(functions);

      const stream = await this.client.chat.completions.create({
        model: this.model,
        stream: true,
        messages: formattedMessages,
        ...(tools.length > 0 ? { tools } : {}),
      });

      const result = {
        functionCall: null,
        textResponse: "",
      };

      // For accumulating tool calls during streaming
      let currentToolCall = null;

      for await (const chunk of stream) {
        if (!chunk?.choices?.[0]) continue;
        const choice = chunk.choices[0];

        if (choice.delta?.content) {
          result.textResponse += choice.delta.content;
          eventHandler?.("reportStreamEvent", {
            type: "textResponseChunk",
            uuid: msgUUID,
            content: choice.delta.content,
          });
        }

        // Handle tool calls (new format)
        if (choice.delta?.tool_calls) {
          for (const toolCall of choice.delta.tool_calls) {
            if (toolCall.id) {
              // New tool call starting
              currentToolCall = {
                id: toolCall.id,
                name: toolCall.function?.name || "",
                arguments: toolCall.function?.arguments || "",
              };
            } else if (currentToolCall) {
              // Continuation of existing tool call
              if (toolCall.function?.name) {
                currentToolCall.name += toolCall.function.name;
              }
              if (toolCall.function?.arguments) {
                currentToolCall.arguments += toolCall.function.arguments;
              }
            }

            if (currentToolCall) {
              eventHandler?.("reportStreamEvent", {
                uuid: `${msgUUID}:tool_call_invocation`,
                type: "toolCallInvocation",
                content: `Assembling Tool Call: ${currentToolCall.name}(${currentToolCall.arguments})`,
              });
            }
          }
        }
      }

      // Set the function call result if we have a tool call
      if (currentToolCall) {
        result.functionCall = {
          id: currentToolCall.id,
          name: currentToolCall.name,
          arguments: safeJsonParse(currentToolCall.arguments, {}),
        };
      }

      return {
        textResponse: result.textResponse,
        functionCall: result.functionCall,
      };
    } catch (error) {
      console.error(error.message, error);

      // If invalid Auth error we need to abort because no amount of waiting
      // will make auth better.
      if (error instanceof OpenAI.AuthenticationError) throw error;

      if (
        error instanceof OpenAI.RateLimitError ||
        error instanceof OpenAI.InternalServerError ||
        error instanceof OpenAI.APIError
      ) {
        throw new RetryError(error.message);
      }

      throw error;
    }
  }

  /**
   * Create a completion based on the received messages.
   * Uses the tool calling format instead of legacy function calling.
   *
   * @param messages A list of messages to send to the OpenAI API.
   * @param functions
   * @returns The completion.
   */
  async complete(messages, functions = []) {
    try {
      const formattedMessages = this.#formatMessagesForTools(messages);
      const tools = this.#formatFunctionsToTools(functions);

      const response = await this.client.chat.completions.create({
        model: this.model,
        stream: false,
        messages: formattedMessages,
        ...(tools.length > 0 ? { tools } : {}),
      });

      // Right now, we only support one completion,
      // so we just take the first one in the list
      const completion = response.choices[0].message;
      const cost = this.getCost(response.usage);

      // Handle tool calls (new format)
      if (completion.tool_calls && completion.tool_calls.length > 0) {
        const toolCall = completion.tool_calls[0];
        let functionArgs = {};
        try {
          functionArgs = JSON.parse(toolCall.function.arguments);
        } catch (error) {
          // Call the complete function again in case of JSON error
          const toolCallId = toolCall.id;
          return this.complete(
            [
              ...messages,
              {
                role: "function",
                name: toolCall.function.name,
                content: error?.message,
                originalFunctionCall: {
                  id: toolCallId,
                  name: toolCall.function.name,
                  arguments: toolCall.function.arguments,
                },
              },
            ],
            functions
          );
        }

        return {
          textResponse: null,
          functionCall: {
            id: toolCall.id,
            name: toolCall.function.name,
            arguments: functionArgs,
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
