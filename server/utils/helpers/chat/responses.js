const { v4: uuidv4 } = require("uuid");
const moment = require("moment");

function clientAbortedHandler(resolve, fullText) {
  console.log(
    "\x1b[43m\x1b[34m[STREAM ABORTED]\x1b[0m Client requested to abort stream. Exiting LLM stream handler early."
  );
  resolve(fullText);
  return;
}

function handleDefaultStreamResponseV2(response, stream, responseProps) {
  const { uuid = uuidv4(), sources = [] } = responseProps;

  return new Promise(async (resolve) => {
    let fullText = "";

    // Establish listener to early-abort a streaming response
    // in case things go sideways or the user does not like the response.
    // We preserve the generated text but continue as if chat was completed
    // to preserve previously generated content.
    const handleAbort = () => clientAbortedHandler(resolve, fullText);
    response.on("close", handleAbort);

    for await (const chunk of stream) {
      const message = chunk?.choices?.[0];
      const token = message?.delta?.content;

      if (token) {
        fullText += token;
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
        resolve(fullText);
        break; // Break streaming when a valid finish_reason is first encountered
      }
    }
  });
}

function convertToChatHistory(history = []) {
  const formattedHistory = [];
  history.forEach((history) => {
    const { prompt, response, createdAt, feedbackScore = null, id } = history;
    const data = JSON.parse(response);
    formattedHistory.push([
      {
        role: "user",
        content: prompt,
        sentAt: moment(createdAt).unix(),
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
      },
    ]);
  });

  return formattedHistory.flat();
}

function convertToPromptHistory(history = []) {
  const formattedHistory = [];
  history.forEach((history) => {
    const { prompt, response } = history;
    const data = JSON.parse(response);
    formattedHistory.push([
      { role: "user", content: prompt },
      { role: "assistant", content: data.text },
    ]);
  });
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
