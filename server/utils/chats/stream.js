const { v4: uuidv4 } = require("uuid");
const { DocumentManager } = require("../DocumentManager");
const { WorkspaceChats } = require("../../models/workspaceChats");
const { getVectorDbClass, getLLMProvider, getRerankerProvider } = require("../helpers");
const { writeResponseChunk } = require("../helpers/chat/responses");
const { grepAgents } = require("./agents");
const { ApiChatHandler } = require("../../utils/chats/apiChatHandler");
const { WorkspaceUser } = require("../../models/workspaceUsers");
const { WorkspaceGroup } = require("../../models/workspaceGroups");
const { Group } = require("../../models/group");



// const { rerankTexts} = require("../custom/reranker.js")
const {
  grepCommand,
  VALID_COMMANDS,
  chatPrompt,
  recentChatHistory,
  sourceIdentifier,
} = require("./index");

const VALID_CHAT_MODE = ["chat", "query"];


// console.log("Reranker Object:", Reranker);


async function streamChatWithWorkspace(
  response,
  workspace,
  message,
  chatMode = "chat",
  user = null,
  thread = null,
  attachments = []
) {

  let effectiveQuestion = message;
  const uuid = uuidv4();
  const updatedMessage = await grepCommand(message, user);

  if (Object.keys(VALID_COMMANDS).includes(updatedMessage)) {
    const data = await VALID_COMMANDS[updatedMessage](
      workspace,
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
    workspace,
    thread,
  });
  if (isAgentChat) return;

  const LLMConnector = getLLMProvider({
    provider: workspace?.chatProvider,
    model: workspace?.chatModel,
  });
  const VectorDb = getVectorDbClass();

  const messageLimit = workspace?.openAiHistory || 20;
  const hasVectorizedSpace = await VectorDb.hasNamespace(workspace.slug);
  const embeddingsCount = await VectorDb.namespaceCount(workspace.slug);
  // User is trying to query-mode chat a workspace that has no data in it - so
  // we should exit early as no information can be found under these conditions.
  if ((!hasVectorizedSpace || embeddingsCount === 0) && chatMode === "query") {
    const textResponse =
      workspace?.queryRefusalResponse ??
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
      workspaceId: workspace.id,
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
    workspace: workspace,
    thread,
    messageLimit,
  });

  if (process.env.QUERY_REWRITER_ENABLED == 'true') {
    const lastQuestion = chatHistory.filter(item => item.role === 'user').pop()?.content || message;

    if (lastQuestion.toLowerCase() === message.toLowerCase()) {
      console.log("Last question is the same as the current message. Skipping query rewriting.");

    } else {
      const userPrompt = `FIRST QUESTION: ${lastQuestion}\nSECOND QUESTION: ${message}`;
      const rewriteRequest = LLMConnector.constructPrompt({
        systemPrompt: process.env.QUERY_REWRITER_PROMPT,
        contextTexts: [],
        chatHistory: [],
        userPrompt: userPrompt,
      });
      // console.dir(rewriteRequest, { depth: null, colors: true });

      effectiveQuestion = await LLMConnector.getChatCompletion(rewriteRequest, {
        temperature: workspace?.openAiTemp ?? LLMConnector.defaultTemp,
      });

      console.log("Rewritten question: ", effectiveQuestion)
    }

  }

  // Look for pinned documents and see if the user decided to use this feature. We will also do a vector search
  // as pinning is a supplemental tool but it should be used with caution since it can easily blow up a context window.
  // However we limit the maximum of appended context to 80% of its overall size, mostly because if it expands beyond this
  // it will undergo prompt compression anyway to make it work. If there is so much pinned that the context here is bigger than
  // what the model can support - it would get compressed anyway and that really is not the point of pinning. It is really best
  // suited for high-context models.
  await new DocumentManager({
    workspace,
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
      // ? await VectorDb.performSimilaritySearchMultiple({
      //     namespaces: workspaces,
      //     input: message,
      //     LLMConnector,
      //     similarityThreshold: workspaces[0]?.similarityThreshold, // this is fine since all workspaces will have same value for this attribute
      //     topN: workspaces[0]?.topN, // this is fine since all workspaces will have same value for this attribute
      //     filterIdentifiers: pinnedDocIdentifiers, 
      //   })
      ? await VectorDb.performSimilaritySearch({
        namespace: workspace.slug,
        input: effectiveQuestion,
        LLMConnector,
        similarityThreshold: workspace?.similarityThreshold,
        topN: workspace?.topN,
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

  if (process.env.RERANKER_PROVIDER != 'none' && vectorSearchResults.sources.length > process.env.RERANK_TOP_N_RESULTS) {
    // re-rank the sources using re-ranker endpoint
    const texts = vectorSearchResults.sources
      .filter(source => source.text) // Ensure source.text exists
      .map(source => source.text);
    const Reranker = getRerankerProvider()
    if (texts.length !== 0) {
      // Call re-ranker to get top results
      const rerankedResults = await Reranker.rerankTexts(texts, effectiveQuestion);

      // Extract indices of top-ranked results
      const topIndices = rerankedResults.map((result) => result.index);
      // Filter the sources and update `sources` directly using the indices
      vectorSearchResults.sources = vectorSearchResults.sources.filter((_, index) =>
        topIndices.includes(index)
      );
    }
    // console.log(`vectorSearchResults.sources.length: ${vectorSearchResults.sources.length}`)
  }

  const { fillSourceWindow } = require("../helpers/chat");
  const filledSources = fillSourceWindow({
    nDocs: workspace?.topN || 4,
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
      workspace?.queryRefusalResponse ??
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
      workspaceId: workspace.id,
      prompt: message,
      response: {
        text: textResponse,
        sources: [],
        type: chatMode,
        attachments,
      },
      threadId: thread?.id || null,
      include: false,
      rewrite_question: process.env.QUERY_REWRITER_ENABLED == 'true' ? effectiveQuestion : null,
      user: user,
    });
    return;
  }

  // Compress & Assemble message to ensure prompt passes token limit with room for response
  // and build system messages based on inputs and history.
  const messages = await LLMConnector.compressMessages(
    {
      systemPrompt: chatPrompt(workspace),
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
    completeText = await LLMConnector.handleStream(response, stream, {
      uuid,
      sources,
    });
  }

  if (completeText?.length > 0) {
    const { chat } = await WorkspaceChats.new({
      workspaceId: workspace.id,
      prompt: message,
      response: { text: completeText, sources, type: chatMode, attachments },
      threadId: thread?.id || null,
      rewrite_question: process.env.QUERY_REWRITER_ENABLED == 'true' ? effectiveQuestion : null,
      user: user,
    });

    writeResponseChunk(response, {
      uuid,
      type: "finalizeResponseStream",
      // rerankedTexts,
      close: true,
      error: false,
      chatId: chat.id,
    });
    return;
  }

  writeResponseChunk(response, {
    uuid,
    type: "finalizeResponseStream",
    // rerankedTexts,
    close: true,
    error: false,
  });
  return;
}

async function prismStreamChatWithWorkspace(
  response,
  workspace,
  message,
  chatMode = "chat",
  user = null,
  thread = null,
  attachments = [],
  userGroups
) {

  let effectiveQuestion = message;
  const uuid = uuidv4();
  const updatedMessage = await grepCommand(message, user);

  if (Object.keys(VALID_COMMANDS).includes(updatedMessage)) {
    const data = await VALID_COMMANDS[updatedMessage](
      workspace,
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
    workspace,
    thread,
  });
  if (isAgentChat) return;

  const LLMConnector = getLLMProvider({
    provider: workspace?.chatProvider,
    model: workspace?.chatModel,
  });
  const VectorDb = getVectorDbClass();

  const messageLimit = workspace?.openAiHistory || 20;
  const hasVectorizedSpace = await VectorDb.hasNamespace(workspace.slug);

  let embeddingsCount;
  let workspaces;

  if (workspace.slug == process.env.INTERNAL_WORKSPACE_NAME) {
    
    const userWorkspaces = await WorkspaceUser.getUserWorkspaces({ user_id: user?.id || null });

    const groupRecords = await Group.where({ groupname: { in: userGroups } });
    const groupIds = groupRecords.map(group => group.id);
    let groupWorkspaces;
    if (groupIds.length != 0) {
      groupWorkspaces = await WorkspaceGroup.getGroupWorkspaces({
        group_id: { in: groupIds }
      });
    }

    const userWorkspaceSlugs = userWorkspaces.map(ws => ws.workspaceSlug);
    const groupWorkspaceSlugs = groupWorkspaces.map(ws => ws.workspaceSlug);
    workspaces = [...new Set([...userWorkspaceSlugs, ...groupWorkspaceSlugs])];
    
    embeddingsCount = await VectorDb.namespaceCountWithWSNames(workspaces);
  } else {
    embeddingsCount = await VectorDb.namespaceCount(workspace.slug);
  }

  // User is trying to query-mode chat a workspace that has no data in it - so
  // we should exit early as no information can be found under these conditions.
  if ((!hasVectorizedSpace || embeddingsCount === 0) && chatMode === "query") {
    const textResponse =
      workspace?.queryRefusalResponse ??
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
      workspaceId: workspace.id,
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
    workspace: workspace,
    thread,
    messageLimit,
  });

  if (process.env.QUERY_REWRITER_ENABLED == 'true') {
    const lastQuestion = chatHistory.filter(item => item.role === 'user').pop()?.content || message;

    if (lastQuestion.toLowerCase() === message.toLowerCase()) {
      console.log("Last question is the same as the current message. Skipping query rewriting.");

    } else {
      const userPrompt = `FIRST QUESTION: ${lastQuestion}\nSECOND QUESTION: ${message}`;
      const rewriteRequest = LLMConnector.constructPrompt({
        systemPrompt: process.env.QUERY_REWRITER_PROMPT,
        contextTexts: [],
        chatHistory: [],
        userPrompt: userPrompt,
      });
      // console.dir(rewriteRequest, { depth: null, colors: true });

      effectiveQuestion = await LLMConnector.getChatCompletion(rewriteRequest, {
        temperature: workspace?.openAiTemp ?? LLMConnector.defaultTemp,
      });

      // console.log("Rewritten question: ", effectiveQuestion)
    }

  }

  // Look for pinned documents and see if the user decided to use this feature. We will also do a vector search
  // as pinning is a supplemental tool but it should be used with caution since it can easily blow up a context window.
  // However we limit the maximum of appended context to 80% of its overall size, mostly because if it expands beyond this
  // it will undergo prompt compression anyway to make it work. If there is so much pinned that the context here is bigger than
  // what the model can support - it would get compressed anyway and that really is not the point of pinning. It is really best
  // suited for high-context models.
  await new DocumentManager({
    workspace,
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

    let vectorSearchResults;


    if (workspace.slug == process.env.INTERNAL_WORKSPACE_NAME) {
      // Perform multi workspace searches if the environment variable is 'true'
      vectorSearchResults = embeddingsCount !== 0
        ? await ApiChatHandler.performSimilaritySearches(workspace, workspaces, effectiveQuestion, LLMConnector, pinnedDocIdentifiers, embeddingsCount,workspace?.topN)
        : {
          contextTexts: [],
          sources: [],
          message: null,
        };
    } else {
      // Perform a single workspace search if the environment variable is not 'true'
      vectorSearchResults = embeddingsCount !== 0
        ? await VectorDb.performSimilaritySearch({
          namespace: workspace.slug,
          input: effectiveQuestion,
          LLMConnector,
          similarityThreshold: workspace?.similarityThreshold,
          topN: workspace?.topN,
          filterIdentifiers: pinnedDocIdentifiers,
        })
        : {
          contextTexts: [],
          sources: [],
          message: null,
        };
    }

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

  if (process.env.RERANKER_PROVIDER != 'none' && vectorSearchResults.sources.length > process.env.RERANK_TOP_N_RESULTS) {
    // re-rank the sources using re-ranker endpoint
    const texts = vectorSearchResults.sources
      .filter(source => source.text) // Ensure source.text exists
      .map(source => source.text);
    const Reranker = getRerankerProvider()
    if (texts.length !== 0) {
      // Call re-ranker to get top results
      const rerankedResults = await Reranker.rerankTexts(texts, effectiveQuestion);

      // Extract indices of top-ranked results
      const topIndices = rerankedResults.map((result) => result.index);
      // Filter the sources and update `sources` directly using the indices
      vectorSearchResults.sources = vectorSearchResults.sources.filter((_, index) =>
        topIndices.includes(index)
      );
    }
    // console.log(`vectorSearchResults.sources.length: ${vectorSearchResults.sources.length}`)
  }

  const { fillSourceWindow } = require("../helpers/chat");
  const filledSources = fillSourceWindow({
    nDocs: workspace?.topN || 4,
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
      workspace?.queryRefusalResponse ??
      "There is no relevant information in this workspace to answer your query.";
    writeResponseChunk(response, {
      id: uuid,
      type: "textResponse",
      textResponse,
      sources: [],
      close: true,
      error: null,
    });
    console.dir(workspaces, {depth:null})
    await WorkspaceChats.new({
      workspaceId: workspace.id,
      prompt: message,
      response: {
        text: textResponse,
        sources: [],
        type: chatMode,
        attachments,
      },
      threadId: thread?.id || null,
      include: false,
      rewrite_question: process.env.QUERY_REWRITER_ENABLED == 'true' ? effectiveQuestion : null,
      user: user,
    });
    return;
  }

  // Compress & Assemble message to ensure prompt passes token limit with room for response
  // and build system messages based on inputs and history.
  const messages = await LLMConnector.compressMessages(
    {
      systemPrompt: chatPrompt(workspace),
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
    completeText = await LLMConnector.handleStream(response, stream, {
      uuid,
      sources,
    });
  }

  if (completeText?.length > 0) {
    const { chat } = await WorkspaceChats.new({
      workspaceId: workspace.id,
      prompt: message,
      response: { text: completeText, sources, type: chatMode, attachments },
      threadId: thread?.id || null,
      rewrite_question: process.env.QUERY_REWRITER_ENABLED == 'true' ? effectiveQuestion : null,
      user: user,
      multiple_workspaces: workspaces ? workspaces.join(",") : null,
    });

    writeResponseChunk(response, {
      uuid,
      type: "finalizeResponseStream",
      // rerankedTexts,
      close: true,
      error: false,
      chatId: chat.id,
    });
    return;
  }

  writeResponseChunk(response, {
    uuid,
    type: "finalizeResponseStream",
    // rerankedTexts,
    close: true,
    error: false,
  });
  return;
}

async function searchWithWorkspace(
  workspace,
  message,
) {
  const VectorDb = getVectorDbClass();

  const LLMConnector = getLLMProvider({
    provider: workspace?.chatProvider,
    model: workspace?.chatModel,
  });
  return VectorDb.fullTextSearch(
    LLMConnector,
    workspace.slug,
    message,
  )
}

module.exports = {
  VALID_CHAT_MODE,
  streamChatWithWorkspace,
  searchWithWorkspace,
  prismStreamChatWithWorkspace
};
