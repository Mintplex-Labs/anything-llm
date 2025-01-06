const { v4: uuidv4 } = require("uuid");
const { DocumentManager } = require("../DocumentManager");
const { WorkspaceChats } = require("../../models/workspaceChats");
const { getVectorDbClass, getLLMProvider } = require("../helpers");
const { writeResponseChunk } = require("../helpers/chat/responses");
const { grepAgents } = require("./agents");
const { rerankTexts} = require("../custom/reranker.js")
const {
  grepCommand,
  VALID_COMMANDS,
  chatPrompt,
  recentChatHistory,
  sourceIdentifier,
} = require("./index");

const VALID_CHAT_MODE = ["chat", "query"];

async function streamChatWithWorkspace(
  response,
  workspaces,
  message,
  chatMode = "chat",
  user = null,
  thread = null,
  attachments = []
) {
  let rerankedTexts = null
  // console.log(`message: ${message}`)
  const uuid = uuidv4();
  const updatedMessage = await grepCommand(message, user);

  if (Object.keys(VALID_COMMANDS).includes(updatedMessage)) {
    const data = await VALID_COMMANDS[updatedMessage](
      workspaces,
      message,
      uuid,
      user,
      thread
    );
    writeResponseChunk(response, data);
    return;
  }

  // If is agent enabled chat we will exit this flow early.
  const isAgentChat = await grepAgents({
    uuid,
    response,
    message,
    user,
    workspaces,
    thread,
  });
  if (isAgentChat) return;

  const LLMConnector = getLLMProvider({
    provider: workspaces[0]?.chatProvider, // this is fine since all workspaces will have same value for this attribute
    model: workspaces[0]?.chatModel, // this is fine since all workspaces will have same value for this attribute
  });
  const VectorDb = getVectorDbClass();

  const messageLimit = workspaces[0]?.openAiHistory || 20; // this is fine since all workspaces will have same value for this attribute
  const hasVectorizedSpace = await VectorDb.hasNamespaces(workspaces);
  const embeddingsCount = await VectorDb.namespaceCountMultiple(workspaces);

  // User is trying to query-mode chat a workspace that has no data in it - so
  // we should exit early as no information can be found under these conditions.
  if ((!hasVectorizedSpace || embeddingsCount === 0) && chatMode === "query") {
    const textResponse =
      workspaces[0]?.queryRefusalResponse ?? // this is fine since all workspaces will have same value for this attribute
      "There is no relevant information in this workspace to answer your query.";
    writeResponseChunk(response, {
      id: uuid,
      type: "textResponse",
      textResponse,
      sources: [],
      attachments,
      close: true,
      error: null,
    });
    await WorkspaceChats.new({
      workspaceId: -1, // i can put -1 here. the table needs a numberic id and there is no foreign key relation with workspaces table. workspaces[0].id
      prompt: message,
      response: {
        text: textResponse,
        sources: [],
        type: chatMode,
        attachments,
      },
      threadId: thread?.id || null,
      include: false,
      user,
    });
    return;
  }

  // If we are here we know that we are in a workspace that is:
  // 1. Chatting in "chat" mode and may or may _not_ have embeddings
  // 2. Chatting in "query" mode and has at least 1 embedding
  let completeText;
  let contextTexts = [];
  let sources = [];
  let pinnedDocIdentifiers = [];
  const { rawHistory, chatHistory } = await recentChatHistory({
    user,
    // workspace: workspaces[0], // in the recentChatHistory method I have
    thread,
    messageLimit,
  });

  // Look for pinned documents and see if the user decided to use this feature. We will also do a vector search
  // as pinning is a supplemental tool but it should be used with caution since it can easily blow up a context window.
  // However we limit the maximum of appended context to 80% of its overall size, mostly because if it expands beyond this
  // it will undergo prompt compression anyway to make it work. If there is so much pinned that the context here is bigger than
  // what the model can support - it would get compressed anyway and that really is not the point of pinning. It is really best
  // suited for high-context models.
  await new DocumentManager({
    workspaces,
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

  let vectorSearchResults =
    embeddingsCount !== 0
      ? await VectorDb.performSimilaritySearchMultiple({
          namespaces: workspaces,
          input: message,
          LLMConnector,
          similarityThreshold: workspaces[0]?.similarityThreshold, // this is fine since all workspaces will have same value for this attribute
          topN: workspaces[0]?.topN, // this is fine since all workspaces will have same value for this attribute
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
      error: vectorSearchResults.message,
    });
    return;
  }

  // re-rank the sources using re-ranker endpoint
  const texts = vectorSearchResults.sources
            .filter(source => source.text) // Ensure source.text exists
            .map(source => source.text);

  if (texts.length !== 0) {
     // Call re-ranker to get top results
    const rerankedResults = await rerankTexts(texts, message);
    // Extract only the text values from reranked results for comparison
    const rerankedTexts = rerankedResults.map(result => result.text);

    // Filter the sources and update `sources` directly
    vectorSearchResults.sources = vectorSearchResults.sources.filter(source => 
      rerankedTexts.includes(source.text)
    );
    throw new Error('No valid texts found in vectorSearchResults.sources');
  }



  const { fillSourceWindow } = require("../helpers/chat");
  const filledSources = fillSourceWindow({
    nDocs: workspaces[0]?.topN || 4, // this is fine since all workspaces will have same value for this attribute
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

  // If in query mode and no context chunks are found from search, backfill, or pins -  do not
  // let the LLM try to hallucinate a response or use general knowledge and exit early
  if (chatMode === "query" && contextTexts.length === 0) {
    const textResponse =
      workspaces[0]?.queryRefusalResponse ?? // this is fine since all workspaces will have same value for this attribute
      "There is no relevant information in this workspace to answer your query.";
    writeResponseChunk(response, {
      id: uuid,
      type: "textResponse",
      textResponse,
      sources: [],
      close: true,
      error: null,
    });

    await WorkspaceChats.new({
      workspaceId: -1, // i can put -1 here. the table needs a numberic id and there is no foreign key relation with workspaces table. workspaces[0].id
      prompt: message,
      response: {
        text: textResponse,
        sources: [],
        type: chatMode,
        attachments,
      },
      threadId: thread?.id || null,
      include: false,
      user,
    });
    return;
  }

  // Compress & Assemble message to ensure prompt passes token limit with room for response
  // and build system messages based on inputs and history.
  const messages = await LLMConnector.compressMessages(
    {
      systemPrompt: chatPrompt(workspaces[0]), // this is fine since all workspaces will have same value for this attribute
      userPrompt: updatedMessage,
      contextTexts,
      chatHistory,
      attachments,
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
      temperature: workspaces[0]?.openAiTemp ?? LLMConnector.defaultTemp, // this is fine since all workspaces will have same value for this attribute
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
      temperature: workspaces[0]?.openAiTemp ?? LLMConnector.defaultTemp, // this is fine since all workspaces will have same value for this attribute
    });
    completeText = await LLMConnector.handleStream(response, stream, {
      uuid,
      sources,
    });
  }

  if (completeText?.length > 0) {
    const { chat } = await WorkspaceChats.new({
      workspaceId: -1, // i can put -1 here. the table needs a numberic id and there is no foreign key relation with workspaces table. workspaces[0].id
      prompt: message,
      response: { text: completeText, sources, type: chatMode, attachments },
      threadId: thread?.id || null,
      user,
    });

    writeResponseChunk(response, {
      uuid,
      type: "finalizeResponseStream",
      rerankedTexts,
      close: true,
      error: false,
      chatId: chat.id,
    });
    return;
  }

  writeResponseChunk(response, {
    uuid,
    type: "finalizeResponseStream",
    rerankedTexts,
    close: true,
    error: false,
  });
  return;
}

module.exports = {
  VALID_CHAT_MODE,
  streamChatWithWorkspace,
};
