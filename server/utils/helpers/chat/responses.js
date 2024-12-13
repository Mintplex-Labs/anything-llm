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
 * @param {import("openai/streaming").Stream<import("openai").OpenAI.ChatCompletionChunk> & {endMeasurement?: (usage: object) => {duration: number}}} stream
 * @param {Object} responseProps
 * @returns {Promise<string>}
 */
function handleDefaultStreamResponseV2(response, stream, responseProps) {
  const { uuid = uuidv4(), sources = [] } = responseProps;

  // Why are we doing this?
  // OpenAI do enable the usage metrics in the stream response but:
  // 1. This parameter is not available in our current API version (TODO: update)
  // 2. The usage metrics are not availale in _every_ provider that uses this function
  // 3. We need to track the usage metrics for every provider that uses this function - not just OpenAI
  let usage = {
    // Other keys are added by the LLMPerformanceMonitor.measureStream method
    // we only need to track the completion tokens
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

        if (token) {
          fullText += token;
          usage.completion_tokens++;
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
      { role: "user", content: prompt },
      { role: "assistant", content: data.text },
    ]);
  }
  return formattedHistory.flat();
}

function writeResponseChunk(response, data) {
  response.write(`data: ${JSON.stringify(data)}\n\n`);
  return;
}

module.exports = {
  handleDefaultStreamResponseV2,
  convertToChatHistory,
  convertToPromptHistory,
  writeResponseChunk,
  clientAbortedHandler,
};
