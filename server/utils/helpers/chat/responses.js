const { v4: uuidv4 } = require("uuid");
const moment = require("moment");

function clientAbortedHandler(resolve, fullText) {
  console.log(
    "\x1b[43m\x1b[34m[STREAM ABORTED]\x1b[0m Client requested to abort stream. Exiting LLM stream handler early."
  );
  resolve(fullText);
  return;
}

/**
 * Handles the default stream response for a chat.
 * @param {import("express").Response} response
 * @param {import('./LLMPerformanceMonitor').MonitoredStream} stream
 * @param {Object} responseProps
 * @returns {Promise<string>}
 */
function handleDefaultStreamResponseV2(response, stream, responseProps) {
  const { uuid = uuidv4(), sources = [] } = responseProps;

  // Why are we doing this?
  // OpenAI do enable the usage metrics in the stream response but:
  // 1. This parameter is not available in our current API version (TODO: update)
  // 2. The usage metrics are not available in _every_ provider that uses this function
  // 3. We need to track the usage metrics for every provider that uses this function - not just OpenAI
  // Other keys are added by the LLMPerformanceMonitor.measureStream method
  let hasUsageMetrics = false;
  let usage = {
    // prompt_tokens can be in this object if the provider supports it - otherwise we manually count it
    // When the stream is created in the LLMProviders `streamGetChatCompletion` `LLMPerformanceMonitor.measureStream` call.
    completion_tokens: 0,
  };

  return new Promise(async (resolve) => {
    let fullText = "";

    // Establish listener to early-abort a streaming response
    // in case things go sideways or the user does not like the response.
    // We preserve the generated text but continue as if chat was completed
    // to preserve previously generated content.
    const handleAbort = () => {
      stream?.endMeasurement(usage);
      clientAbortedHandler(resolve, fullText);
    };
    response.on("close", handleAbort);

    // Now handle the chunks from the streamed response and append to fullText.
    try {
      for await (const chunk of stream) {
        const message = chunk?.choices?.[0];
        const token = message?.delta?.content;

        // If we see usage metrics in the chunk, we can use them directly
        // instead of estimating them, but we only want to assign values if
        // the response object is the exact same key:value pair we expect.
        if (
          chunk.hasOwnProperty("usage") && // exists
          !!chunk.usage && // is not null
          Object.values(chunk.usage).length > 0 // has values
        ) {
          if (chunk.usage.hasOwnProperty("prompt_tokens")) {
            usage.prompt_tokens = Number(chunk.usage.prompt_tokens);
          }

          if (chunk.usage.hasOwnProperty("completion_tokens")) {
            hasUsageMetrics = true; // to stop estimating counter
            usage.completion_tokens = Number(chunk.usage.completion_tokens);
          }
        }

        if (token) {
          fullText += token;
          // If we never saw a usage metric, we can estimate them by number of completion chunks
          if (!hasUsageMetrics) usage.completion_tokens++;
          writeResponseChunk(response, {
            uuid,
            sources: [],
            type: "textResponseChunk",
            textResponse: token,
            close: false,
            error: false,
          });
        }

        // LocalAi returns '' and others return null on chunks - the last chunk is not "" or null.
        // Either way, the key `finish_reason` must be present to determine ending chunk.
        if (
          message?.hasOwnProperty("finish_reason") && // Got valid message and it is an object with finish_reason
          message.finish_reason !== "" &&
          message.finish_reason !== null
        ) {
          writeResponseChunk(response, {
            uuid,
            sources,
            type: "textResponseChunk",
            textResponse: "",
            close: true,
            error: false,
          });
          response.removeListener("close", handleAbort);
          stream?.endMeasurement(usage);
          resolve(fullText);
          break; // Break streaming when a valid finish_reason is first encountered
        }
      }
    } catch (e) {
      console.log(`\x1b[43m\x1b[34m[STREAMING ERROR]\x1b[0m ${e.message}`);
      writeResponseChunk(response, {
        uuid,
        type: "abort",
        textResponse: null,
        sources: [],
        close: true,
        error: e.message,
      });
      stream?.endMeasurement(usage);
      resolve(fullText); // Return what we currently have - if anything.
    }
  });
}

function convertToChatHistory(history = []) {
  const formattedHistory = [];
  for (const record of history) {
    const { prompt, response, createdAt, feedbackScore = null, id } = record;
    const data = JSON.parse(response);

    // In the event that a bad response was stored - we should skip its entire record
    // because it was likely an error and cannot be used in chats and will fail to render on UI.
    if (typeof prompt !== "string") {
      console.log(
        `[convertToChatHistory] ChatHistory #${record.id} prompt property is not a string - skipping record.`
      );
      continue;
    } else if (typeof data.text !== "string") {
      console.log(
        `[convertToChatHistory] ChatHistory #${record.id} response.text property is not a string - skipping record.`
      );
      continue;
    }

    formattedHistory.push([
      {
        role: "user",
        content: prompt,
        sentAt: moment(createdAt).unix(),
        attachments: data?.attachments ?? [],
        chatId: id,
      },
      {
        type: data?.type || "chart",
        role: "assistant",
        content: data.text,
        sources: data.sources || [],
        chatId: id,
        sentAt: moment(createdAt).unix(),
        feedbackScore,
        metrics: data?.metrics || {},
      },
    ]);
  }

  return formattedHistory.flat();
}

/**
 * Converts a chat history to a prompt history.
 * @param {Object[]} history - The chat history to convert
 * @returns {{role: string, content: string, attachments?: import("..").Attachment}[]}
 */
function convertToPromptHistory(history = []) {
  const formattedHistory = [];
  for (const record of history) {
    const { prompt, response } = record;
    const data = JSON.parse(response);

    // In the event that a bad response was stored - we should skip its entire record
    // because it was likely an error and cannot be used in chats and will fail to render on UI.
    if (typeof prompt !== "string") {
      console.log(
        `[convertToPromptHistory] ChatHistory #${record.id} prompt property is not a string - skipping record.`
      );
      continue;
    } else if (typeof data.text !== "string") {
      console.log(
        `[convertToPromptHistory] ChatHistory #${record.id} response.text property is not a string - skipping record.`
      );
      continue;
    }

    formattedHistory.push([
      {
        role: "user",
        content: prompt,
        // if there are attachments, add them as a property to the user message so we can reuse them in chat history later if supported by the llm.
        ...(data?.attachments?.length > 0
          ? { attachments: data?.attachments }
          : {}),
      },
      {
        role: "assistant",
        content: data.text,
      },
    ]);
  }
  return formattedHistory.flat();
}

/**
 * Safely stringifies any object containing BigInt values
 * @param {*} obj - Anything to stringify that might contain BigInt values
 * @returns {string} JSON string with BigInt values converted to strings
 */
function safeJSONStringify(obj) {
  return JSON.stringify(obj, (_, value) => {
    if (typeof value === "bigint") return value.toString();
    return value;
  });
}

function writeResponseChunk(response, data) {
  response.write(`data: ${safeJSONStringify(data)}\n\n`);
  return;
}

/**
 * Formats the chat history to re-use attachments in the chat history
 * that might have existed in the conversation earlier.
 * @param {{role:string, content:string, attachments?: Object[]}[]} chatHistory
 * @param {function} formatterFunction - The function to format the chat history from the llm provider
 * @param {('asProperty'|'spread')} mode - "asProperty" or "spread". Determines how the content is formatted in the message object.
 * @returns {object[]}
 */
function formatChatHistory(
  chatHistory = [],
  formatterFunction,
  mode = "asProperty"
) {
  return chatHistory.map((historicalMessage) => {
    if (
      historicalMessage?.role !== "user" || // Only user messages can have attachments
      !historicalMessage?.attachments || // If there are no attachments, we can skip this
      !historicalMessage.attachments.length // If there is an array but it is empty, we can skip this
    )
      return historicalMessage;

    // Some providers, like Ollama, expect the content to be embedded in the message object.
    if (mode === "spread") {
      return {
        role: historicalMessage.role,
        ...formatterFunction({
          userPrompt: historicalMessage.content,
          attachments: historicalMessage.attachments,
        }),
      };
    }

    // Most providers expect the content to be a property of the message object formatted like OpenAI models.
    return {
      role: historicalMessage.role,
      content: formatterFunction({
        userPrompt: historicalMessage.content,
        attachments: historicalMessage.attachments,
      }),
    };
  });
}

module.exports = {
  handleDefaultStreamResponseV2,
  convertToChatHistory,
  convertToPromptHistory,
  writeResponseChunk,
  clientAbortedHandler,
  formatChatHistory,
  safeJSONStringify,
};
