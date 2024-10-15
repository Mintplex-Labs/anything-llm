const { v4: uuidv4 } = require("uuid");
const { getVectorDbClass, getLLMProvider } = require("../helpers");
const { chatPrompt, sourceIdentifier } = require("./index");
const { EmbedChats } = require("../../models/embedChats");
const {
  convertToPromptHistory,
  writeResponseChunk,
} = require("../helpers/chat/responses");
const { DocumentManager } = require("../DocumentManager");

async function streamChatWithForEmbed(
  response,
  /** @type {import("@prisma/client").embed_configs & {workspace?: import("@prisma/client").workspaces}} */
  embed,
  /** @type {String} */
  message,
  /** @type {String} */
  sessionId,
  { promptOverride, modelOverride, temperatureOverride, username }
) {
  const chatMode = embed.chat_mode;
  const chatModel = embed.allow_model_override ? modelOverride : null;

  // If there are overrides in request & they are permitted, override the default workspace ref information.
  if (embed.allow_prompt_override)
    embed.workspace.openAiPrompt = promptOverride;
  if (embed.allow_temperature_override)
    embed.workspace.openAiTemp = parseFloat(temperatureOverride);

  const uuid = uuidv4();
  const LLMConnector = getLLMProvider({
    provider: embed?.workspace?.chatProvider,
    model: chatModel ?? embed.workspace?.chatModel,
  });
  const VectorDb = getVectorDbClass();

  const messageLimit = 20;
  const hasVectorizedSpace = await VectorDb.hasNamespace(embed.workspace.slug);
  const embeddingsCount = await VectorDb.namespaceCount(embed.workspace.slug);

  // User is trying to query-mode chat a workspace that has no data in it - so
  // we should exit early as no information can be found under these conditions.
  if ((!hasVectorizedSpace || embeddingsCount === 0) && chatMode === "query") {
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

  let completeText;
  let contextTexts = [];
  let sources = [];
  let pinnedDocIdentifiers = [];
  const { rawHistory, chatHistory } = await recentEmbedChatHistory(
    sessionId,
    embed,
    messageLimit
  );

  // See stream.js comment for more information on this implementation.
  await new DocumentManager({
    workspace: embed.workspace,
    maxTokens: LLMConnector.promptWindowLimit(),
  })
    .pinnedDocs()
    .then((pinnedDocs) => {
      pinnedDocs.forEach((doc) => {
        const { pageContent, ...metadata } = doc;
        pinnedDocIdentifiers.push(sourceIdentifier(doc));
        contextTexts.push(doc.pageContent);
        sources.push({
          text:
            pageContent.slice(0, 1_000) +
            "...continued on in source document...",
          ...metadata,
        });
      });
    });

  const vectorSearchResults =
    embeddingsCount !== 0
      ? await VectorDb.performSimilaritySearch({
          namespace: embed.workspace.slug,
          input: message,
          LLMConnector,
          similarityThreshold: embed.workspace?.similarityThreshold,
          topN: embed.workspace?.topN,
          filterIdentifiers: pinnedDocIdentifiers,
        })
      : {
          contextTexts: [],
          sources: [],
          message: null,
        };

  // Failed similarity search if it was run at all and failed.
  if (!!vectorSearchResults.message) {
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

  const { fillSourceWindow } = require("../helpers/chat");
  const filledSources = fillSourceWindow({
    nDocs: embed.workspace?.topN || 4,
    searchResults: vectorSearchResults.sources,
    history: rawHistory,
    filterIdentifiers: pinnedDocIdentifiers,
  });

  // Why does contextTexts get all the info, but sources only get current search?
  // This is to give the ability of the LLM to "comprehend" a contextual response without
  // populating the Citations under a response with documents the user "thinks" are irrelevant
  // due to how we manage backfilling of the context to keep chats with the LLM more correct in responses.
  // If a past citation was used to answer the question - that is visible in the history so it logically makes sense
  // and does not appear to the user that a new response used information that is otherwise irrelevant for a given prompt.
  // TLDR; reduces GitHub issues for "LLM citing document that has no answer in it" while keep answers highly accurate.
  contextTexts = [...contextTexts, ...filledSources.contextTexts];
  sources = [...sources, ...vectorSearchResults.sources];

  // If in query mode and no sources are found in current search or backfilled from history, do not
  // let the LLM try to hallucinate a response or use general knowledge
  if (chatMode === "query" && contextTexts.length === 0) {
    writeResponseChunk(response, {
      id: uuid,
      type: "textResponse",
      textResponse:
        embed.workspace?.queryRefusalResponse ??
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
    response: { text: completeText, type: chatMode, sources },
    connection_information: response.locals.connection
      ? {
          ...response.locals.connection,
          username: !!username ? String(username) : null,
        }
      : { username: !!username ? String(username) : null },
    sessionId,
  });
  return;
}

/**
 * @param {string} sessionId the session id of the user from embed widget
 * @param {Object} embed the embed config object
 * @param {Number} messageLimit the number of messages to return
 * @returns {Promise<{rawHistory: import("@prisma/client").embed_chats[], chatHistory: {role: string, content: string}[]}>
 */
async function recentEmbedChatHistory(sessionId, embed, messageLimit = 20) {
  const rawHistory = (
    await EmbedChats.forEmbedByUser(embed.id, sessionId, messageLimit, {
      id: "desc",
    })
  ).reverse();
  return { rawHistory, chatHistory: convertToPromptHistory(rawHistory) };
}

module.exports = {
  streamChatWithForEmbed,
};
