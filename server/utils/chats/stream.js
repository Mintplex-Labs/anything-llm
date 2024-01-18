const { v4: uuidv4 } = require("uuid");
const { WorkspaceChats } = require("../../models/workspaceChats");
const { getVectorDbClass, getLLMProvider } = require("../helpers");
const {
  grepCommand,
  recentChatHistory,
  VALID_COMMANDS,
  chatPrompt,
} = require(".");

const VALID_CHAT_MODE = ["chat", "query"];
function writeResponseChunk(response, data) {
  response.write(`data: ${JSON.stringify(data)}\n\n`);
  return;
}

async function streamChatWithWorkspace(
  response,
  workspace,
  message,
  chatMode = "chat",
  user = null
) {
  const uuid = uuidv4();
  const command = grepCommand(message);

  if (!!command && Object.keys(VALID_COMMANDS).includes(command)) {
    const data = await VALID_COMMANDS[command](workspace, message, uuid, user);
    writeResponseChunk(response, data);
    return;
  }

  const LLMConnector = getLLMProvider(workspace?.chatModel);
  const VectorDb = getVectorDbClass();
  const { safe, reasons = [] } = await LLMConnector.isSafe(message);
  if (!safe) {
    writeResponseChunk(response, {
      id: uuid,
      type: "abort",
      textResponse: null,
      sources: [],
      close: true,
      error: `This message was moderated and will not be allowed. Violations for ${reasons.join(
        ", "
      )} found.`,
    });
    return;
  }

  const messageLimit = workspace?.openAiHistory || 20;
  const hasVectorizedSpace = await VectorDb.hasNamespace(workspace.slug);
  const embeddingsCount = await VectorDb.namespaceCount(workspace.slug);
  if (!hasVectorizedSpace || embeddingsCount === 0) {
    if (chatMode === "query") {
      writeResponseChunk(response, {
        id: uuid,
        type: "textResponse",
        textResponse:
          "There is no relevant information in this workspace to answer your query.",
        sources: [],
        close: true,
        error: null,
      });
      return;
    }

    // If there are no embeddings - chat like a normal LLM chat interface.
    return await streamEmptyEmbeddingChat({
      response,
      uuid,
      user,
      message,
      workspace,
      messageLimit,
      LLMConnector,
    });
  }

  let completeText;
  const { rawHistory, chatHistory } = await recentChatHistory(
    user,
    workspace,
    messageLimit,
    chatMode
  );
  const {
    contextTexts = [],
    sources = [],
    message: error,
  } = await VectorDb.performSimilaritySearch({
    namespace: workspace.slug,
    input: message,
    LLMConnector,
    similarityThreshold: workspace?.similarityThreshold,
    topN: workspace?.topN,
  });

  // Failed similarity search.
  if (!!error) {
    writeResponseChunk(response, {
      id: uuid,
      type: "abort",
      textResponse: null,
      sources: [],
      close: true,
      error,
    });
    return;
  }

  // If in query mode and no sources are found, do not
  // let the LLM try to hallucinate a response or use general knowledge
  if (chatMode === "query" && sources.length === 0) {
    writeResponseChunk(response, {
      id: uuid,
      type: "textResponse",
      textResponse:
        "There is no relevant information in this workspace to answer your query.",
      sources: [],
      close: true,
      error: null,
    });
    return;
  }

  // Compress message to ensure prompt passes token limit with room for response
  // and build system messages based on inputs and history.
  const messages = await LLMConnector.compressMessages(
    {
      systemPrompt: chatPrompt(workspace),
      userPrompt: message,
      contextTexts,
      chatHistory,
    },
    rawHistory
  );

  // If streaming is not explicitly enabled for connector
  // we do regular waiting of a response and send a single chunk.
  if (LLMConnector.streamingEnabled() !== true) {
    console.log(
      `\x1b[31m[STREAMING DISABLED]\x1b[0m Streaming is not available for ${LLMConnector.constructor.name}. Will use regular chat method.`
    );
    completeText = await LLMConnector.getChatCompletion(messages, {
      temperature: workspace?.openAiTemp ?? LLMConnector.defaultTemp,
    });
    writeResponseChunk(response, {
      uuid,
      sources,
      type: "textResponseChunk",
      textResponse: completeText,
      close: true,
      error: false,
    });
  } else {
    const stream = await LLMConnector.streamGetChatCompletion(messages, {
      temperature: workspace?.openAiTemp ?? LLMConnector.defaultTemp,
    });
    completeText = await handleStreamResponses(response, stream, {
      uuid,
      sources,
    });
  }

  await WorkspaceChats.new({
    workspaceId: workspace.id,
    prompt: message,
    response: { text: completeText, sources, type: chatMode },
    user,
  });
  return;
}

async function streamEmptyEmbeddingChat({
  response,
  uuid,
  user,
  message,
  workspace,
  messageLimit,
  LLMConnector,
}) {
  let completeText;
  const { rawHistory, chatHistory } = await recentChatHistory(
    user,
    workspace,
    messageLimit
  );

  // If streaming is not explicitly enabled for connector
  // we do regular waiting of a response and send a single chunk.
  if (LLMConnector.streamingEnabled() !== true) {
    console.log(
      `\x1b[31m[STREAMING DISABLED]\x1b[0m Streaming is not available for ${LLMConnector.constructor.name}. Will use regular chat method.`
    );
    completeText = await LLMConnector.sendChat(
      chatHistory,
      message,
      workspace,
      rawHistory
    );
    writeResponseChunk(response, {
      uuid,
      type: "textResponseChunk",
      textResponse: completeText,
      sources: [],
      close: true,
      error: false,
    });
  } else {
    const stream = await LLMConnector.streamChat(
      chatHistory,
      message,
      workspace,
      rawHistory
    );
    completeText = await handleStreamResponses(response, stream, {
      uuid,
      sources: [],
    });
  }

  await WorkspaceChats.new({
    workspaceId: workspace.id,
    prompt: message,
    response: { text: completeText, sources: [], type: "chat" },
    user,
  });
  return;
}

// TODO: Refactor this implementation
function handleStreamResponses(response, stream, responseProps) {
  const { uuid = uuidv4(), sources = [] } = responseProps;

  // Gemini likes to return a stream asyncIterator which will
  // be a totally different object than other models.
  if (stream?.type === "geminiStream") {
    return new Promise(async (resolve) => {
      let fullText = "";
      for await (const chunk of stream.stream) {
        fullText += chunk.text();
        writeResponseChunk(response, {
          uuid,
          sources: [],
          type: "textResponseChunk",
          textResponse: chunk.text(),
          close: false,
          error: false,
        });
      }

      writeResponseChunk(response, {
        uuid,
        sources,
        type: "textResponseChunk",
        textResponse: "",
        close: true,
        error: false,
      });
      resolve(fullText);
    });
  }

  if (stream?.type === "azureStream") {
    return new Promise(async (resolve) => {
      let fullText = "";
      for await (const event of stream.stream) {
        for (const choice of event.choices) {
          const delta = choice.delta?.content;
          if (!delta) continue;
          writeResponseChunk(response, {
            uuid,
            sources: [],
            type: "textResponseChunk",
            textResponse: delta,
            close: false,
            error: false,
          });
        }
      }

      writeResponseChunk(response, {
        uuid,
        sources,
        type: "textResponseChunk",
        textResponse: "",
        close: true,
        error: false,
      });
      resolve(fullText);
    });
  }

  if (stream.type === "togetherAiStream") {
    return new Promise((resolve) => {
      let fullText = "";
      let chunk = "";
      stream.stream.data.on("data", (data) => {
        const lines = data
          ?.toString()
          ?.split("\n")
          .filter((line) => line.trim() !== "");

        for (const line of lines) {
          let validJSON = false;
          const message = chunk + line.replace(/^data: /, "");

          if (message !== "[DONE]") {
            // JSON chunk is incomplete and has not ended yet
            // so we need to stitch it together. You would think JSON
            // chunks would only come complete - but they don't!
            try {
              JSON.parse(message);
              validJSON = true;
            } catch {}

            if (!validJSON) {
              // It can be possible that the chunk decoding is running away
              // and the message chunk fails to append due to string length.
              // In this case abort the chunk and reset so we can continue.
              // ref: https://github.com/Mintplex-Labs/anything-llm/issues/416
              try {
                chunk += message;
              } catch (e) {
                console.error(`Chunk appending error`, e);
                chunk = "";
              }
              continue;
            } else {
              chunk = "";
            }
          }

          if (message == "[DONE]") {
            writeResponseChunk(response, {
              uuid,
              sources,
              type: "textResponseChunk",
              textResponse: "",
              close: true,
              error: false,
            });
            resolve(fullText);
          } else {
            let finishReason = null;
            let token = "";
            try {
              const json = JSON.parse(message);
              token = json?.choices?.[0]?.delta?.content;
              finishReason = json?.choices?.[0]?.finish_reason || null;
            } catch {
              continue;
            }

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

            if (finishReason !== null) {
              writeResponseChunk(response, {
                uuid,
                sources,
                type: "textResponseChunk",
                textResponse: "",
                close: true,
                error: false,
              });
              resolve(fullText);
            }
          }
        }
      });
    });
  }

  // If stream is not a regular OpenAI Stream (like if using native model, Ollama, or most LangChain interfaces)
  // we can just iterate the stream content instead.
  if (!stream.hasOwnProperty("data")) {
    return new Promise(async (resolve) => {
      let fullText = "";
      for await (const chunk of stream) {
        if (chunk === undefined)
          throw new Error(
            "Stream returned undefined chunk. Aborting reply - check model provider logs."
          );

        const content = chunk.hasOwnProperty("content") ? chunk.content : chunk;
        fullText += content;
        writeResponseChunk(response, {
          uuid,
          sources: [],
          type: "textResponseChunk",
          textResponse: content,
          close: false,
          error: false,
        });
      }

      writeResponseChunk(response, {
        uuid,
        sources,
        type: "textResponseChunk",
        textResponse: "",
        close: true,
        error: false,
      });
      resolve(fullText);
    });
  }

  return new Promise((resolve) => {
    let fullText = "";
    let chunk = "";
    stream.data.on("data", (data) => {
      const lines = data
        ?.toString()
        ?.split("\n")
        .filter((line) => line.trim() !== "");

      for (const line of lines) {
        let validJSON = false;
        const message = chunk + line.replace(/^data: /, "");

        // JSON chunk is incomplete and has not ended yet
        // so we need to stitch it together. You would think JSON
        // chunks would only come complete - but they don't!
        try {
          JSON.parse(message);
          validJSON = true;
        } catch {}

        if (!validJSON) {
          // It can be possible that the chunk decoding is running away
          // and the message chunk fails to append due to string length.
          // In this case abort the chunk and reset so we can continue.
          // ref: https://github.com/Mintplex-Labs/anything-llm/issues/416
          try {
            chunk += message;
          } catch (e) {
            console.error(`Chunk appending error`, e);
            chunk = "";
          }
          continue;
        } else {
          chunk = "";
        }

        if (message == "[DONE]") {
          writeResponseChunk(response, {
            uuid,
            sources,
            type: "textResponseChunk",
            textResponse: "",
            close: true,
            error: false,
          });
          resolve(fullText);
        } else {
          let finishReason = null;
          let token = "";
          try {
            const json = JSON.parse(message);
            token = json?.choices?.[0]?.delta?.content;
            finishReason = json?.choices?.[0]?.finish_reason || null;
          } catch {
            continue;
          }

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

          if (finishReason !== null) {
            writeResponseChunk(response, {
              uuid,
              sources,
              type: "textResponseChunk",
              textResponse: "",
              close: true,
              error: false,
            });
            resolve(fullText);
          }
        }
      }
    });
  });
}

module.exports = {
  VALID_CHAT_MODE,
  streamChatWithWorkspace,
  writeResponseChunk,
};
