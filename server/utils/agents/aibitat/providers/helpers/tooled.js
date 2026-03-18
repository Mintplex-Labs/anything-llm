const { v4 } = require("uuid");
const { safeJsonParse } = require("../../../../http");

/**
 * Shared native OpenAI-compatible tool calling utilities.
 * Any provider with an OpenAI-compatible client can use these functions
 * instead of the UnTooled prompt-based approach when the model supports
 * native tool calling.
 *
 * Usage in a provider:
 *   const { tooledStream, tooledComplete } = require("./helpers/tooled.js");
 *
 *   async stream(messages, functions, eventHandler) {
 *     if (functions.length > 0 && await this.supportsNativeToolCalling()) {
 *       return tooledStream(this.client, this.model, messages, functions, eventHandler);
 *     }
 *     // ... fallback to UnTooled ...
 *   }
 */

/**
 * Convert aibitat function definitions to the OpenAI tools format.
 * @param {Array<{name: string, description: string, parameters: object}>} functions
 * @returns {Array<{type: "function", function: {name: string, description: string, parameters: object}}>}
 */
function formatFunctionsToTools(functions) {
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
 * Format message content with attachments (images) for multimodal support.
 * Transforms a message with attachments into the OpenAI-compatible format.
 * @param {Object} message - The message to format
 * @returns {Object} Message with content formatted for the API
 */
function formatMessageWithAttachments(message) {
  if (!message.attachments || message.attachments.length === 0) {
    return message;
  }

  // Transform message with attachments into multimodal format
  const content = [{ type: "text", text: message.content }];
  for (const attachment of message.attachments) {
    content.push({
      type: "image_url",
      image_url: {
        url: attachment.contentString,
      },
    });
  }

  // Return message without attachments property, with content as array
  const { attachments: _, ...rest } = message;
  return {
    ...rest,
    content,
  };
}

/**
 * Convert the aibitat message history (which uses role:"function" with
 * `originalFunctionCall` metadata) into the OpenAI tool-calling message
 * format (assistant `tool_calls` + role:"tool" pairs).
 * Also handles image attachments for multimodal support.
 * @param {Array} messages
 * @param {{injectReasoningContent?: boolean}} options
 *   - injectReasoningContent: when true, ensures every assistant message has
 *     a `reasoning_content` field (required by DeepSeek thinking-mode models).
 * @returns {Array} Messages formatted for the OpenAI tools API
 */
function formatMessagesForTools(messages, options = {}) {
  const formattedMessages = [];
  const { injectReasoningContent = false } = options;

  for (const message of messages) {
    if (message.role === "function") {
      if (message.originalFunctionCall?.id) {
        const prevMsg = formattedMessages[formattedMessages.length - 1];
        if (!prevMsg || prevMsg.role !== "assistant" || !prevMsg.tool_calls) {
          formattedMessages.push({
            role: "assistant",
            content: null,
            ...(injectReasoningContent ? { reasoning_content: "" } : {}),
            tool_calls: [
              {
                id: message.originalFunctionCall.id,
                type: "function",
                function: {
                  name: message.originalFunctionCall.name,
                  arguments:
                    typeof message.originalFunctionCall.arguments === "string"
                      ? message.originalFunctionCall.arguments
                      : JSON.stringify(message.originalFunctionCall.arguments),
                },
              },
            ],
          });
        }
        formattedMessages.push({
          role: "tool",
          tool_call_id: message.originalFunctionCall.id,
          content:
            typeof message.content === "string"
              ? message.content
              : JSON.stringify(message.content),
        });
      } else {
        const toolCallId = `call_${v4()}`;
        formattedMessages.push({
          role: "assistant",
          content: null,
          ...(injectReasoningContent ? { reasoning_content: "" } : {}),
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
    } else if (
      injectReasoningContent &&
      message.role === "assistant" &&
      !("reasoning_content" in message)
    ) {
      formattedMessages.push(
        formatMessageWithAttachments({ ...message, reasoning_content: "" })
      );
    } else {
      formattedMessages.push(formatMessageWithAttachments(message));
    }
  }

  return formattedMessages;
}

/**
 * Stream a chat completion using native OpenAI-compatible tool calling.
 * Handles parallel tool calls by tracking each tool call by its streaming
 * index, then returning only the first one for the agent framework to process.
 *
 * @param {import("openai").OpenAI} client - OpenAI-compatible client
 * @param {string} model - Model identifier
 * @param {Array} messages - Raw aibitat message history
 * @param {Array} functions - Aibitat function definitions
 * @param {function|null} eventHandler - Stream event handler
 * @param {{injectReasoningContent?: boolean, provider?: object}} options - Provider-specific options
 *   - provider: If passed, automatically handles usage tracking via provider.resetUsage()/recordUsage()
 * @returns {Promise<{textResponse: string, functionCall: object|null, uuid: string, usage: object|null}>}
 */
async function tooledStream(
  client,
  model,
  messages,
  functions = [],
  eventHandler = null,
  options = {}
) {
  const { provider, ...formatOptions } = options;

  // Auto-reset usage if provider is passed
  if (provider?.resetUsage) {
    try {
      provider.resetUsage();
    } catch {}
  }

  const msgUUID = v4();
  const formattedMessages = formatMessagesForTools(messages, formatOptions);
  const tools = formatFunctionsToTools(functions);

  const stream = await client.chat.completions.create({
    model,
    stream: true,
    stream_options: { include_usage: true },
    messages: formattedMessages,
    ...(tools.length > 0 ? { tools } : {}),
  });

  const result = {
    functionCall: null,
    textResponse: "",
  };

  const toolCallsByIndex = {};
  let usage = null;

  for await (const chunk of stream) {
    // Capture usage from final chunk (some providers send usage after finish_reason)
    if (chunk?.usage) {
      usage = chunk.usage;
    }

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

    if (choice.delta?.tool_calls) {
      for (const toolCall of choice.delta.tool_calls) {
        const idx = toolCall.index ?? 0;

        if (toolCall.id) {
          toolCallsByIndex[idx] = {
            id: toolCall.id,
            name: toolCall.function?.name || "",
            arguments: toolCall.function?.arguments || "",
          };
        } else if (toolCallsByIndex[idx]) {
          if (toolCall.function?.name) {
            toolCallsByIndex[idx].name += toolCall.function.name;
          }
          if (toolCall.function?.arguments) {
            toolCallsByIndex[idx].arguments += toolCall.function.arguments;
          }
        }

        if (toolCallsByIndex[idx]) {
          eventHandler?.("reportStreamEvent", {
            uuid: `${msgUUID}:tool_call_invocation`,
            type: "toolCallInvocation",
            content: `Assembling Tool Call: ${toolCallsByIndex[idx].name}(${toolCallsByIndex[idx].arguments})`,
          });
        }
      }
    }
  }

  // Auto-record usage if provider is passed and usage is available
  if (provider?.recordUsage && usage) {
    try {
      provider.recordUsage(usage);
    } catch {}
  }

  const toolCallIndices = Object.keys(toolCallsByIndex).map(Number);
  if (toolCallIndices.length > 0) {
    const firstToolCall = toolCallsByIndex[Math.min(...toolCallIndices)];
    result.functionCall = {
      id: firstToolCall.id,
      name: firstToolCall.name,
      arguments: safeJsonParse(firstToolCall.arguments, {}),
    };
  }

  return {
    textResponse: result.textResponse,
    functionCall: result.functionCall,
    uuid: msgUUID,
    usage,
  };
}

/**
 * Non-streaming chat completion using native OpenAI-compatible tool calling.
 * Returns the first tool call if the model requests any, otherwise the text response.
 *
 * @param {import("openai").OpenAI} client - OpenAI-compatible client
 * @param {string} model - Model identifier
 * @param {Array} messages - Raw aibitat message history
 * @param {Array} functions - Aibitat function definitions
 * @param {function} getCostFn - Provider's getCost function
 * @param {{injectReasoningContent?: boolean, provider?: object}} options - Provider-specific options
 *   - provider: If passed, automatically handles usage tracking via provider.resetUsage()/recordUsage()
 * @returns {Promise<{textResponse: string|null, functionCall: object|null, cost: number, usage: object|null}>}
 */
async function tooledComplete(
  client,
  model,
  messages,
  functions = [],
  getCostFn = () => 0,
  options = {}
) {
  const { provider, ...formatOptions } = options;

  // Auto-reset usage if provider is passed
  if (provider?.resetUsage) {
    try {
      provider.resetUsage();
    } catch {}
  }

  const formattedMessages = formatMessagesForTools(messages, formatOptions);
  const tools = formatFunctionsToTools(functions);

  const response = await client.chat.completions.create({
    model,
    stream: false,
    messages: formattedMessages,
    ...(tools.length > 0 ? { tools } : {}),
  });

  const completion = response.choices[0].message;
  const cost = getCostFn(response.usage);
  const usage = response.usage || null;

  // Auto-record usage if provider is passed and usage is available
  if (provider?.recordUsage && usage) {
    try {
      provider.recordUsage(usage);
    } catch {}
  }

  if (completion.tool_calls && completion.tool_calls.length > 0) {
    const toolCall = completion.tool_calls[0];
    const functionArgs = safeJsonParse(toolCall.function.arguments, null);

    if (functionArgs === null) {
      return {
        textResponse: null,
        retryWithError: {
          role: "function",
          name: toolCall.function.name,
          content: `Failed to parse tool call arguments as JSON. Raw arguments: ${toolCall.function.arguments}`,
          originalFunctionCall: {
            id: toolCall.id,
            name: toolCall.function.name,
            arguments: toolCall.function.arguments,
          },
        },
        cost,
        usage,
      };
    }

    return {
      textResponse: null,
      functionCall: {
        id: toolCall.id,
        name: toolCall.function.name,
        arguments: functionArgs,
      },
      cost,
      usage,
    };
  }

  return {
    textResponse: completion.content,
    cost,
    usage,
  };
}

module.exports = {
  formatFunctionsToTools,
  formatMessagesForTools,
  tooledStream,
  tooledComplete,
};
