const { v4: uuidv4 } = require("uuid");
const { WorkspaceChats } = require("../../models/workspaceChats");
const { getVectorDbClass, getLLMProvider } = require("../helpers");
const {
  grepCommand,
  recentChatHistory,
  VALID_COMMANDS,
  chatPrompt,
} = require(".");

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

  const LLMConnector = getLLMProvider();
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
      temperature: workspace?.openAiTemp ?? 0.7,
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
      temperature: workspace?.openAiTemp ?? 0.7,
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

function handleStreamResponses(response, stream, responseProps) {
  const { uuid = uuidv4(), sources = [] } = responseProps;
  return new Promise((resolve) => {
    let fullText = "";
    let chunk = "";
    stream.data.on("data", (data) => {
      const lines = data
        ?.toString()
        ?.split("\n")
        .filter((line) => line.trim() !== "");

      for (const line of lines) {
        const message = chunk + line.replace(/^data: /, "");

        // JSON chunk is incomplete and has not ended yet
        // so we need to stitch it together. You would think JSON
        // chunks would only come complete - but they don't!
        if (message.slice(-3) !== "}]}") {
          chunk += message;
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
          let finishReason;
          let token = "";
          try {
            const json = JSON.parse(message);
            token = json?.choices?.[0]?.delta?.content;
            finishReason = json?.choices?.[0]?.finish_reason;
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
  streamChatWithWorkspace,
  writeResponseChunk,
};
