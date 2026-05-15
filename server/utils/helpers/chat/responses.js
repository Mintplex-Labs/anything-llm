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
  const {
    uuid = uuidv4(),
    sources = [],
    persistContext = null,
  } = responseProps;

  let hasUsageMetrics = false;
  let usage = {
    completion_tokens: 0,
  };
  let clientDisconnected = false;

  return new Promise(async (resolve) => {
    let fullText = "";

    // When the client disconnects (e.g. user switches thread), we stop writing
    // chunks to the response but let the LLM stream continue so we can persist
    // the complete response to the database in the background.
    const handleAbort = () => {
      clientDisconnected = true;
      stream?.endMeasurement(usage);
      // Do NOT resolve here — let the stream finish naturally so we get the
      // full text and can persist it via persistOrphanedStream below.
    };
    response.on("close", handleAbort);

    try {
      for await (const chunk of stream) {
        const message = chunk?.choices?.[0];
        const token = message?.delta?.content;

        if (
          chunk.hasOwnProperty("usage") &&
          !!chunk.usage &&
          Object.values(chunk.usage).length > 0
        ) {
          if (chunk.usage.hasOwnProperty("prompt_tokens")) {
            usage.prompt_tokens = Number(chunk.usage.prompt_tokens);
          }

          if (chunk.usage.hasOwnProperty("completion_tokens")) {
            hasUsageMetrics = true;
            usage.completion_tokens = Number(chunk.usage.completion_tokens);
          }
        }

        if (token) {
          fullText += token;
          if (!hasUsageMetrics) usage.completion_tokens++;
          // Only write to the response if the client is still connected.
          if (!clientDisconnected) {
            writeResponseChunk(response, {
              uuid,
              sources: [],
              type: "textResponseChunk",
              textResponse: token,
              close: false,
              error: false,
            });
          }
        }

        if (
          message?.hasOwnProperty("finish_reason") &&
          message.finish_reason !== "" &&
          message.finish_reason !== null
        ) {
          if (!clientDisconnected) {
            writeResponseChunk(response, {
              uuid,
              sources,
              type: "textResponseChunk",
              textResponse: "",
              close: true,
              error: false,
            });
          }
          response.removeListener("close", handleAbort);
          stream?.endMeasurement(usage);
          // If client disconnected, resolve empty so the main flow skips
          // persistence — persistOrphanedStream already handled it above.
          resolve(clientDisconnected ? "" : fullText);
          break;
        }
      }
    } catch (e) {
      console.log(`\x1b[43m\x1b[34m[STREAMING ERROR]\x1b[0m ${e.message}`);
      if (!clientDisconnected) {
        writeResponseChunk(response, {
          uuid,
          type: "abort",
          textResponse: null,
          sources: [],
          close: true,
          error: e.message,
        });
      }
      stream?.endMeasurement(usage);
      resolve(clientDisconnected ? "" : fullText);
    }

    // Stream finished. If the client disconnected, persist the full response
    // to the database in the background so it's not lost.
    if (clientDisconnected && fullText.length > 0 && persistContext) {
      persistOrphanedStream({
        uuid,
        text: fullText,
        sources,
        metrics: usage,
        ...persistContext,
      });
    }
  });
}

/**
 * Persists a complete streaming response to the database after the client
 * has disconnected (e.g. user switched threads while LLM was still generating).
 * This runs in the background — errors are logged but do not affect the user.
 */
async function persistOrphanedStream({
  uuid,
  text,
  sources,
  metrics,
  workspaceId,
  prompt,
  threadId,
  user,
  chatMode,
  attachments,
}) {
  if (!text || text.length === 0) return;
  try {
    const { WorkspaceChats } = require("../../../models/workspaceChats");
    await WorkspaceChats.new({
      workspaceId,
      prompt,
      response: { text, sources, type: chatMode, attachments, metrics },
      threadId,
      user,
    });
    console.log(
      `\x1b[32m[ORPHANED STREAM]\x1b[0m Persisted orphaned stream response for workspace ${workspaceId} (thread ${threadId}).`
    );
  } catch (e) {
    console.error(
      `\x1b[31m[ORPHANED STREAM]\x1b[0m Failed to persist orphaned stream: ${e.message}`
    );
  }
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
        ...(data?.outputs?.length > 0 ? { outputs: data.outputs } : {}),
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
  if (!response || !response.writable || response.destroyed) return;
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
  persistOrphanedStream,
  formatChatHistory,
  safeJSONStringify,
};
