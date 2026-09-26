const OpenAI = require("openai");
const { RetryError } = require("../../error.js");
const { v4 } = require("uuid");
const { safeJsonParse } = require("../../../../http");
const {
  createWithReasoningSummaryFallback,
} = require("../../../../helpers/reasoningEffort");

/**
 * Shared OpenAI Responses API tool-calling utilities.
 * Mirrors the pattern of tooled.js but for providers that EXACTLY implement
 * the OpenAI Responses API (native OpenAI, OpenAI GPT models on Bedrock).
 * Do not use for providers that only implement Chat Completions.
 */

/**
 * Format aibitat messages to the OpenAI Responses API input format.
 * - Our internal `function` messages map to a function_call + function_call_output pair.
 * - All other messages map to input/output text, with image attachments as input_image.
 * @param {any[]} messages - Raw aibitat message history
 * @param {{providerLog?: function}} provider - Used to log skipped messages
 * @returns {OpenAI.OpenAI.Responses.ResponseInput} The formatted input
 */
function formatToResponsesInput(messages = [], provider = null) {
  const formattedMessages = [];
  messages.forEach((message) => {
    if (message.role === "function") {
      // Without an originalFunctionCall we cannot map it to a function call id
      // and the API will throw an error - so log and skip.
      if (!message.hasOwnProperty("originalFunctionCall")) {
        provider?.providerLog?.(
          "[formatToResponsesInput]: message did not pass back the originalFunctionCall. We need this to map the function call to the correct id.",
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

    const content = [
      {
        type: message.role === "assistant" ? "output_text" : "input_text",
        text: message.content,
      },
    ];

    if (message.attachments && message.attachments.length > 0) {
      for (const attachment of message.attachments) {
        content.push({
          type: "input_image",
          image_url: attachment.contentString,
        });
      }
    }

    formattedMessages.push({ role: message.role, content });
  });

  return formattedMessages;
}

/**
 * Format aibitat functions to the OpenAI Responses API tool format.
 * @param {any[]} functions
 * @returns {{type: "function", name: string, description: string, parameters: object, strict: boolean}[]}
 */
function formatResponsesTools(functions = []) {
  return functions.map((func) => ({
    type: "function",
    name: func.name,
    description: func.description,
    parameters: func.parameters,
    strict: false,
  }));
}

/**
 * Build the shared request body for a Responses API call.
 * @returns {object}
 */
function buildRequest(model, messages, functions, provider) {
  return {
    model,
    input: formatToResponsesInput(messages, provider),
    store: false,
    parallel_tool_calls: false,
    ...(Array.isArray(functions) && functions?.length > 0
      ? { tools: formatResponsesTools(functions) }
      : {}),
    ...(provider?.reasoningConfig ?? {}),
  };
}

/**
 * Normalize the collected completion into the aibitat provider result shape.
 * @returns {{textResponse: string, functionCall: null|{id: string, name: string, arguments: object}}}
 */
function toResult(completion) {
  if (!completion.functionCall)
    return { textResponse: completion.content, functionCall: null };
  return {
    textResponse: completion.content,
    functionCall: {
      id: completion.functionCall.call_id,
      name: completion.functionCall.name,
      arguments: safeJsonParse(completion.functionCall.arguments, {}),
    },
  };
}

/**
 * Rethrow SDK errors so the agent retries recoverable API failures.
 * Authentication errors and non-API errors are rethrown as-is.
 * @param {Error} error
 */
function handleResponsesError(error) {
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

/**
 * Stream a Responses API completion with native tool calling.
 * @param {OpenAI.OpenAI} client
 * @param {string} model
 * @param {any[]} messages
 * @param {any[]} functions
 * @param {function|null} eventHandler - Reports stream events to the client
 * @param {{provider: import("../ai-provider")}} options
 * @returns {Promise<{textResponse: string, functionCall: any, cost: number, uuid: string}>}
 */
async function responsesTooledStream(
  client,
  model,
  messages,
  functions = [],
  eventHandler = null,
  options = {}
) {
  const { provider } = options;
  provider?.resetUsage?.();

  try {
    const msgUUID = v4();
    const response = await createWithReasoningSummaryFallback(
      (body) => client.responses.create(body),
      { ...buildRequest(model, messages, functions, provider), stream: true }
    );

    const completion = {
      content: "",
      /** @type {null|{name: string, call_id: string, arguments: string}} */
      functionCall: null,
    };
    // Reasoning summaries stream before the answer and are shown as a
    // <think> block, the same way tooled.js streams reasoning.
    let reasoningText = "";
    const reportText = (content) =>
      eventHandler?.("reportStreamEvent", {
        type: "textResponseChunk",
        uuid: msgUUID,
        content,
      });
    const closeReasoning = () => {
      if (reasoningText.length > 0 && !completion.content)
        reportText("</think>");
    };

    for await (const chunk of response) {
      if (chunk.type === "response.reasoning_summary_text.delta") {
        if (!chunk.delta) continue;
        reportText(
          reasoningText.length === 0 ? `<think>${chunk.delta}` : chunk.delta
        );
        reasoningText += chunk.delta;
        continue;
      }

      if (
        chunk.type === "response.reasoning_summary_part.done" &&
        reasoningText.length > 0 &&
        !completion.content
      ) {
        reportText("\n\n");
        reasoningText += "\n\n";
        continue;
      }

      if (chunk.type === "response.output_text.delta") {
        closeReasoning();
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

      if (chunk.type === "response.completed") {
        if (chunk.response?.usage)
          provider?.recordUsage?.(chunk.response.usage);
        continue;
      }
    }

    closeReasoning();
    const result = toResult(completion);
    if (reasoningText.trim().length > 0 && !result.functionCall)
      result.textResponse = `<think>${reasoningText.trim()}</think>${result.textResponse}`;
    return {
      ...result,
      cost: provider?.getCost?.() ?? 0,
      uuid: msgUUID,
    };
  } catch (error) {
    handleResponsesError(error);
  }
}

/**
 * Create a non-streaming Responses API completion with native tool calling.
 * @param {OpenAI.OpenAI} client
 * @param {string} model
 * @param {any[]} messages
 * @param {any[]} functions
 * @param {{provider: import("../ai-provider")}} options
 * @returns {Promise<{textResponse: string, functionCall: any, cost: number, usage: object}>}
 */
async function responsesTooledComplete(
  client,
  model,
  messages,
  functions = [],
  options = {}
) {
  const { provider } = options;
  provider?.resetUsage?.();

  try {
    const completion = { content: "", functionCall: null };
    const response = await createWithReasoningSummaryFallback(
      (body) => client.responses.create(body),
      { ...buildRequest(model, messages, functions, provider), stream: false }
    );

    if (response.usage) provider?.recordUsage?.(response.usage);
    for (const outputBlock of response.output) {
      if (
        outputBlock.type === "message" &&
        outputBlock.content[0]?.type === "output_text"
      ) {
        completion.content = outputBlock.content[0].text;
      }

      if (outputBlock.type === "function_call") {
        completion.functionCall = {
          name: outputBlock.name,
          call_id: outputBlock.call_id,
          arguments: outputBlock.arguments,
        };
      }
    }

    return {
      ...toResult(completion),
      cost: provider?.getCost?.() ?? 0,
      usage: provider?.getUsage?.() ?? {},
    };
  } catch (error) {
    handleResponsesError(error);
  }
}

module.exports = {
  formatToResponsesInput,
  formatResponsesTools,
  handleResponsesError,
  responsesTooledStream,
  responsesTooledComplete,
};
