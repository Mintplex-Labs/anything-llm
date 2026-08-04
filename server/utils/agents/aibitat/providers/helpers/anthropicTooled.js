const Anthropic = require("@anthropic-ai/sdk");
const { RetryError } = require("../../error.js");
const { v4 } = require("uuid");
const { safeJsonParse } = require("../../../../http");
const { dereferenceSchema } = require("./dereferenceSchema");

/**
 * Shared Anthropic Messages API tool-calling utilities.
 * Mirrors the pattern of tooled.js but for providers that route through
 * the Anthropic SDK (native Anthropic, Bedrock via bedrock-mantle, etc.).
 */

function parseDataUrl(dataUrl) {
  if (!dataUrl || !dataUrl.startsWith("data:")) return null;
  const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!matches) return null;
  return { mediaType: matches[1], data: matches[2] };
}

/**
 * Convert aibitat message history to Anthropic Messages API format.
 * Extracts the system prompt, converts function roles to tool_result,
 * handles image attachments, and merges consecutive same-role messages.
 * @param {Array} messages - Raw aibitat message history
 * @returns {[string, Array]} Tuple of [systemPrompt, processedMessages]
 */
function prepareAnthropicMessages(messages = []) {
  let systemPrompt =
    "You are a helpful ai assistant who can assist the user and use tools available to help answer the users prompts and questions.";
  const chatMessages = messages.filter((msg) => {
    if (msg.role === "system") {
      systemPrompt = msg.content;
      return false;
    }
    return true;
  });

  const processedMessages = chatMessages.reduce(
    (processedMessages, message, index) => {
      if (message.role === "function") {
        const prevMessage = chatMessages[index - 1];
        if (prevMessage?.role === "assistant") {
          const toolUse = prevMessage.content.find(
            (item) => item.type === "tool_use"
          );
          if (toolUse) {
            processedMessages.push({
              role: "user",
              content: [
                {
                  type: "tool_result",
                  tool_use_id: toolUse.id,
                  content: message.content
                    ? String(message.content)
                    : "Tool executed successfully.",
                },
              ],
            });
          }
        }
        return processedMessages;
      }

      let content = Array.isArray(message.content)
        ? message.content
        : [{ type: "text", text: message.content }];
      content = content.filter(
        (item) =>
          item.type !== "text" || (item.text && item.text.trim().length > 0)
      );

      if (message.attachments && message.attachments.length > 0) {
        for (const attachment of message.attachments) {
          const parsed = parseDataUrl(attachment.contentString);
          if (parsed) {
            content.push({
              type: "image",
              source: {
                type: "base64",
                media_type: parsed.mediaType,
                data: parsed.data,
              },
            });
          }
        }
      }

      if (content.length === 0) return processedMessages;

      if (
        message.role === "assistant" &&
        content.some((item) => item.type === "tool_use") &&
        !content.some((item) => item.type === "text")
      ) {
        content.unshift({
          type: "text",
          text: "I'll use a tool to help answer this question.",
        });
      }

      const lastMessage = processedMessages[processedMessages.length - 1];
      if (lastMessage && lastMessage.role === message.role) {
        lastMessage.content.push(...content);
      } else {
        const { attachments: _, ...restOfMessage } = message;
        processedMessages.push({ ...restOfMessage, content });
      }

      return processedMessages;
    },
    []
  );

  if (processedMessages.length > 0 && processedMessages[0].role !== "user") {
    processedMessages.shift();
  }

  return [systemPrompt, processedMessages];
}

/**
 * Convert aibitat function definitions to Anthropic tools format.
 * @param {Array} functions - Aibitat function definitions
 * @returns {Array} Anthropic-formatted tool definitions
 */
function formatAnthropicTools(functions = []) {
  return functions.map((func) => {
    const { name, description, parameters, required } = func;
    const { type, properties } = dereferenceSchema(parameters);
    return {
      name,
      description,
      input_schema: { type, properties, required },
    };
  });
}

function handleAnthropicError(error) {
  if (error instanceof Anthropic.AuthenticationError) throw error;
  if (
    error instanceof Anthropic.RateLimitError ||
    error instanceof Anthropic.InternalServerError ||
    error instanceof Anthropic.APIError
  ) {
    throw new RetryError(error.message);
  }
  throw error;
}

/**
 * Stream a chat completion using the Anthropic Messages API with native tool calling.
 *
 * @param {import("@anthropic-ai/sdk").default} client - Anthropic SDK client
 * @param {string} model - Model identifier
 * @param {number} maxTokens - Maximum output tokens
 * @param {Array} messages - Raw aibitat message history
 * @param {Array} functions - Aibitat function definitions
 * @param {function|null} eventHandler - Stream event handler
 * @param {{provider?: object, systemPromptBuilder?: function, extraCreateOptions?: object}} options
 * @returns {Promise<{textResponse: string, functionCall: object|null, cost: number, uuid: string, usage: object|null}>}
 */
async function anthropicTooledStream(
  client,
  model,
  maxTokens,
  messages,
  functions = [],
  eventHandler = null,
  options = {}
) {
  const { provider, systemPromptBuilder, extraCreateOptions } = options;
  if (provider?.resetUsage) provider.resetUsage();

  try {
    const msgUUID = v4();
    const [systemPrompt, chats] = prepareAnthropicMessages(messages);
    const response = await client.messages.create(
      {
        model,
        max_tokens: maxTokens,
        system: systemPromptBuilder
          ? systemPromptBuilder(systemPrompt)
          : systemPrompt,
        messages: chats,
        stream: true,
        ...(Array.isArray(functions) && functions?.length > 0
          ? { tools: formatAnthropicTools(functions) }
          : {}),
      },
      extraCreateOptions
    );

    const result = { functionCall: null, textResponse: "" };
    const usage = { input_tokens: 0, output_tokens: 0 };

    for await (const chunk of response) {
      if (chunk.type === "message_start" && chunk.message?.usage) {
        usage.input_tokens = chunk.message.usage.input_tokens || 0;
      }

      if (chunk.type === "message_delta" && chunk.usage) {
        usage.output_tokens = chunk.usage.output_tokens || 0;
      }

      if (chunk.type === "content_block_start") {
        if (chunk.content_block.type === "text") {
          result.textResponse += chunk.content_block.text;
          eventHandler?.("reportStreamEvent", {
            type: "textResponseChunk",
            uuid: msgUUID,
            content: chunk.content_block.text,
          });
        }

        if (chunk.content_block.type === "tool_use") {
          result.functionCall = {
            id: chunk.content_block.id,
            name: chunk.content_block.name,
            arguments: "",
          };
          eventHandler?.("reportStreamEvent", {
            type: "toolCallInvocation",
            uuid: `${msgUUID}:tool_call_invocation`,
            content: `Assembling Tool Call: ${result.functionCall.name}(${result.functionCall.arguments})`,
          });
        }
      }

      if (chunk.type === "content_block_delta") {
        if (chunk.delta.type === "text_delta") {
          result.textResponse += chunk.delta.text;
          eventHandler?.("reportStreamEvent", {
            type: "textResponseChunk",
            uuid: msgUUID,
            content: chunk.delta.text,
          });
        }

        if (chunk.delta.type === "input_json_delta") {
          result.functionCall.arguments += chunk.delta.partial_json;
          eventHandler?.("reportStreamEvent", {
            type: "toolCallInvocation",
            uuid: `${msgUUID}:tool_call_invocation`,
            content: `Assembling Tool Call: ${result.functionCall.name}(${result.functionCall.arguments})`,
          });
        }
      }
    }

    if (provider?.recordUsage) provider.recordUsage(usage);

    if (result.functionCall) {
      result.functionCall.arguments = safeJsonParse(
        result.functionCall.arguments,
        {}
      );
      messages.push({
        role: "assistant",
        content: [
          { type: "text", text: result.textResponse },
          {
            type: "tool_use",
            id: result.functionCall.id,
            name: result.functionCall.name,
            input: result.functionCall.arguments,
          },
        ],
      });
      return {
        textResponse: result.textResponse,
        functionCall: {
          name: result.functionCall.name,
          arguments: result.functionCall.arguments,
        },
        cost: 0,
        uuid: msgUUID,
        usage: provider?.getUsage ? provider.getUsage() : null,
      };
    }

    return {
      textResponse: result.textResponse,
      functionCall: null,
      cost: 0,
      uuid: msgUUID,
      usage: provider?.getUsage ? provider.getUsage() : null,
    };
  } catch (error) {
    handleAnthropicError(error);
  }
}

/**
 * Non-streaming chat completion using the Anthropic Messages API with native tool calling.
 *
 * @param {import("@anthropic-ai/sdk").default} client - Anthropic SDK client
 * @param {string} model - Model identifier
 * @param {number} maxTokens - Maximum output tokens
 * @param {Array} messages - Raw aibitat message history
 * @param {Array} functions - Aibitat function definitions
 * @param {{provider?: object, systemPromptBuilder?: function, extraCreateOptions?: object}} options
 * @returns {Promise<{textResponse?: string, result?: null, functionCall?: object, cost: number, usage: object|null}>}
 */
async function anthropicTooledComplete(
  client,
  model,
  maxTokens,
  messages,
  functions = [],
  options = {}
) {
  const { provider, systemPromptBuilder, extraCreateOptions } = options;
  if (provider?.resetUsage) provider.resetUsage();

  try {
    const [systemPrompt, chats] = prepareAnthropicMessages(messages);
    const response = await client.messages.create(
      {
        model,
        max_tokens: maxTokens,
        system: systemPromptBuilder
          ? systemPromptBuilder(systemPrompt)
          : systemPrompt,
        messages: chats,
        stream: false,
        ...(Array.isArray(functions) && functions?.length > 0
          ? { tools: formatAnthropicTools(functions) }
          : {}),
      },
      extraCreateOptions
    );

    if (provider?.recordUsage && response.usage)
      provider.recordUsage(response.usage);

    if (response.stop_reason === "tool_use") {
      const toolCall = response.content.find((res) => res.type === "tool_use");
      let thought = response.content.find((res) => res.type === "text");
      thought =
        thought?.text?.length > 0
          ? {
              role: "assistant",
              content: [{ type: "text", text: thought.text }, { ...toolCall }],
            }
          : {
              role: "assistant",
              content: [
                {
                  type: "text",
                  text: `Okay, im going to use ${toolCall.name} to help me.`,
                },
                { ...toolCall },
              ],
            };

      messages.push(thought);

      return {
        result: null,
        functionCall: {
          name: toolCall.name,
          arguments: toolCall.input,
        },
        cost: 0,
        usage: provider?.getUsage ? provider.getUsage() : null,
      };
    }

    const completion = response.content.find((msg) => msg.type === "text");
    return {
      textResponse:
        completion?.text ??
        "The model failed to complete the task and return back a valid response.",
      cost: 0,
      usage: provider?.getUsage ? provider.getUsage() : null,
    };
  } catch (error) {
    handleAnthropicError(error);
  }
}

module.exports = {
  parseDataUrl,
  prepareAnthropicMessages,
  formatAnthropicTools,
  handleAnthropicError,
  anthropicTooledStream,
  anthropicTooledComplete,
};
