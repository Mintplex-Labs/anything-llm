const { v4: uuidv4 } = require("uuid");
const { getVectorDbClass, getLLMProvider } = require("../helpers");
const { chatPrompt, convertToPromptHistory } = require(".");
const { writeResponseChunk } = require("./stream");
const { EmbedChats } = require("../../models/embedChats");

async function streamChatWithForEmbed(
  response,
  /** @type {import("@prisma/client").embed_configs & {workspace?: import("@prisma/client").workspaces}} */
  embed,
  /** @type {String} */
  message,
  /** @type {String} */
  sessionId,
  { promptOverride, modelOverride, temperatureOverride }
) {
  const chatMode = embed.chat_mode;
  const chatModel = embed.allow_model_override ? modelOverride : null;

  // If there are overrides in request & they are permitted, override the default workspace ref information.
  if (embed.allow_prompt_override)
    embed.workspace.openAiPrompt = promptOverride;
  if (embed.allow_temperature_override)
    embed.workspace.openAiTemp = parseFloat(temperatureOverride);

  const uuid = uuidv4();
  const LLMConnector = getLLMProvider(chatModel ?? embed.workspace?.chatModel);
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

  const messageLimit = 20;
  const hasVectorizedSpace = await VectorDb.hasNamespace(embed.workspace.slug);
  const embeddingsCount = await VectorDb.namespaceCount(embed.workspace.slug);
  if (!hasVectorizedSpace || embeddingsCount === 0) {
    if (chatMode === "query") {
      writeResponseChunk(response, {
        id: uuid,
        type: "textResponse",
        textResponse:
          "I do not have enough information to answer that. Try another question.",
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
      sessionId,
      message,
      embed,
      messageLimit,
      LLMConnector,
    });
  }

  let completeText;
  const { rawHistory, chatHistory } = await recentEmbedChatHistory(
    sessionId,
    embed,
    messageLimit,
    chatMode
  );
  const {
    contextTexts = [],
    sources = [],
    message: error,
  } = await VectorDb.performSimilaritySearch({
    namespace: embed.workspace.slug,
    input: message,
    LLMConnector,
    similarityThreshold: embed.workspace?.similarityThreshold,
    topN: embed.workspace?.topN,
  });

  // Failed similarity search.
  if (!!error) {
    writeResponseChunk(response, {
      id: uuid,
      type: "abort",
      textResponse: null,
      sources: [],
      close: true,
      error: "Failed to connect to vector database provider.",
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
      systemPrompt: chatPrompt(embed.workspace),
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
      temperature: embed.workspace?.openAiTemp ?? LLMConnector.defaultTemp,
    });
    writeResponseChunk(response, {
      uuid,
      sources: [],
      type: "textResponseChunk",
      textResponse: completeText,
      close: true,
      error: false,
    });
  } else {
    const stream = await LLMConnector.streamGetChatCompletion(messages, {
      temperature: embed.workspace?.openAiTemp ?? LLMConnector.defaultTemp,
    });
    completeText = await LLMConnector.handleStream(response, stream, {
      uuid,
      sources: [],
    });
  }

  await EmbedChats.new({
    embedId: embed.id,
    prompt: message,
    response: { text: completeText, type: chatMode },
    connection_information: response.locals.connection
      ? { ...response.locals.connection }
      : {},
    sessionId,
  });
  return;
}

// On query we don't return message history. All other chat modes and when chatting
// with no embeddings we return history.
async function recentEmbedChatHistory(
  sessionId,
  embed,
  messageLimit = 20,
  chatMode = null
) {
  if (chatMode === "query") return [];
  const rawHistory = (
    await EmbedChats.forEmbedByUser(embed.id, sessionId, messageLimit, {
      id: "desc",
    })
  ).reverse();
  return { rawHistory, chatHistory: convertToPromptHistory(rawHistory) };
}

async function streamEmptyEmbeddingChat({
  response,
  uuid,
  sessionId,
  message,
  embed,
  messageLimit,
  LLMConnector,
}) {
  let completeText;
  const { rawHistory, chatHistory } = await recentEmbedChatHistory(
    sessionId,
    embed,
    messageLimit
  );

  if (LLMConnector.streamingEnabled() !== true) {
    console.log(
      `\x1b[31m[STREAMING DISABLED]\x1b[0m Streaming is not available for ${LLMConnector.constructor.name}. Will use regular chat method.`
    );
    completeText = await LLMConnector.sendChat(
      chatHistory,
      message,
      embed.workspace,
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
  }

  const stream = await LLMConnector.streamChat(
    chatHistory,
    message,
    embed.workspace,
    rawHistory
  );
  completeText = await LLMConnector.handleStream(response, stream, {
    uuid,
    sources: [],
  });

  await EmbedChats.new({
    embedId: embed.id,
    prompt: message,
    response: { text: completeText, type: "chat" },
    connection_information: response.locals.connection
      ? { ...response.locals.connection }
      : {},
    sessionId,
  });
  return;
}

module.exports = {
  streamChatWithForEmbed,
};
