const { v4: uuidv4 } = require("uuid");
const { DocumentManager } = require("../DocumentManager");
const { WorkspaceChats } = require("../../models/workspaceChats");
const { getVectorDbClass, getLLMProvider } = require("../helpers");
const { writeResponseChunk } = require("../helpers/chat/responses");
const {
  chatPrompt,
  sourceIdentifier,
  recentChatHistory,
  grepAllSlashCommands,
} = require("./index");
const {
  EphemeralAgentHandler,
  EphemeralEventListener,
} = require("../agents/ephemeral");
const { Telemetry } = require("../../models/telemetry");

// Simple toggle-able logger for tracing execution.
const LOG_ENABLED = process.env.DEBUG_CHAT_HANDLER === "true";
const debugLog = (...args) => {
  if (LOG_ENABLED) console.log("[ApiChatHandler]", ...args);
};

/**
 * @typedef ResponseObject
 * @property {string} id - uuid of response
 * @property {string} type - Type of response
 * @property {string|null} textResponse - full text response
 * @property {object[]} sources
 * @property {boolean} close
 * @property {string|null} error
 * @property {object} metrics
 */

/**
 * Handle synchronous chats with your workspace via the developer API endpoint
 * @param {{
 * workspace: import("@prisma/client").workspaces,
 * message:string,
 * mode: "chat"|"query",
 * user: import("@prisma/client").users|null,
 * thread: import("@prisma/client").workspace_threads|null,
 * sessionId: string|null,
 * attachments: { name: string; mime: string; contentString: string }[],
 * reset: boolean,
 * }} parameters
 * @returns {Promise<ResponseObject>}
 */
async function chatSync({
  workspace,
  message = null,
  mode = "chat",
  user = null,
  thread = null,
  sessionId = null,
  attachments = [],
  reset = false,
}) {
  const uuid = uuidv4();
  const chatMode = mode ?? "chat";

  if (reset) {
    await WorkspaceChats.markThreadHistoryInvalidV2({
      workspaceId: workspace.id,
      user_id: user?.id,
      thread_id: thread?.id,
      api_session_id: sessionId,
    });
    if (!message?.length) {
      return {
        id: uuid,
        type: "textResponse",
        textResponse: "Chat history was reset!",
        sources: [],
        close: true,
        error: null,
        metrics: {},
      };
    }
  }

  message = await grepAllSlashCommands(message);

  if (EphemeralAgentHandler.isAgentInvocation({ message })) {
    await Telemetry.sendTelemetry("agent_chat_started");
    const agentHandler = new EphemeralAgentHandler({
      uuid,
      workspace,
      prompt: message,
      userId: user?.id || null,
      threadId: thread?.id || null,
      sessionId,
    });
    const eventListener = new EphemeralEventListener();
    await agentHandler.init();
    await agentHandler.createAIbitat({ handler: eventListener });
    agentHandler.startAgentCluster();

    const { thoughts, textResponse } = await eventListener.waitForClose();
    await WorkspaceChats.new({
      workspaceId: workspace.id,
      prompt: String(message),
      response: {
        text: textResponse,
        sources: [],
        attachments,
        type: chatMode,
        thoughts,
      },
      include: false,
      apiSessionId: sessionId,
    });
    return {
      id: uuid,
      type: "textResponse",
      sources: [],
      close: true,
      error: null,
      textResponse,
      thoughts,
    };
  }

  const LLMConnector = getLLMProvider({
    provider: workspace?.chatProvider,
    model: workspace?.chatModel,
  });
  const VectorDb = getVectorDbClass();
  const messageLimit = workspace?.openAiHistory || 20;
  const hasVectorizedSpace = await VectorDb.hasNamespace(workspace.slug);
  const embeddingsCount = await VectorDb.namespaceCount(workspace.slug);

  if ((!hasVectorizedSpace || embeddingsCount === 0) && chatMode === "query") {
    const textResponse =
      workspace?.queryRefusalResponse ??
      "There is no relevant information in this workspace to answer your query.";
    await WorkspaceChats.new({
      workspaceId: workspace.id,
      prompt: String(message),
      response: {
        text: textResponse,
        sources: [],
        attachments,
        type: chatMode,
        metrics: {},
      },
      include: false,
      apiSessionId: sessionId,
    });
    return {
      id: uuid,
      type: "textResponse",
      sources: [],
      close: true,
      error: null,
      textResponse,
      metrics: {},
    };
  }

  let contextTexts = [];
  let sources = [];
  let pinnedDocIdentifiers = [];
  const { rawHistory, chatHistory } = await recentChatHistory({
    user,
    workspace,
    thread,
    messageLimit,
    apiSessionId: sessionId,
  });

  const documentManager = new DocumentManager({
    workspace,
    maxTokens: LLMConnector.promptWindowLimit(),
  });
  const pinnedDocs = await documentManager.pinnedDocs();
  pinnedDocs.forEach((doc) => {
    const { pageContent, ...metadata } = doc;
    pinnedDocIdentifiers.push(sourceIdentifier(doc));
    contextTexts.push(doc.pageContent);
    sources.push({
      text:
        pageContent.slice(0, 1_000) + "...continued on in source document...",
      ...metadata,
    });
  });

  const useHybrid =
    process.env.VECTOR_DB === "milvus" &&
    process.env.EMBEDDING_ENGINE === "hybrid";
  debugLog("Search strategy", { useHybrid });

  const vectorSearchResults =
    embeddingsCount !== 0
      ? await (useHybrid
          ? VectorDb.performHybridSearch({
              namespace: workspace.slug,
              input: message,
              LLMConnector,
              similarityThreshold: workspace?.similarityThreshold,
              topN: workspace?.topN,
              filterIdentifiers: pinnedDocIdentifiers,
              rerank: workspace?.vectorSearchMode === "rerank",
            })
          : VectorDb.performSimilaritySearch({
              namespace: workspace.slug,
              input: message,
              LLMConnector,
              similarityThreshold: workspace?.similarityThreshold,
              topN: workspace?.topN,
              filterIdentifiers: pinnedDocIdentifiers,
              rerank: workspace?.vectorSearchMode === "rerank",
            }))
      : {
          contextTexts: [],
          sources: [],
          message: null,
        };

  if (vectorSearchResults.message) {
    return {
      id: uuid,
      type: "abort",
      textResponse: null,
      sources: [],
      close: true,
      error: vectorSearchResults.message,
      metrics: {},
    };
  }

  const { fillSourceWindow } = require("../helpers/chat");
  const filledSources = fillSourceWindow({
    nDocs: workspace?.topN || 4,
    searchResults: vectorSearchResults.sources,
    history: rawHistory,
    filterIdentifiers: pinnedDocIdentifiers,
  });

  // [FIXED] This is the crucial change. We must combine the context from pinned docs,
  // the current vector search, and the historical search (fillSourceWindow).
  contextTexts = [
    ...contextTexts,
    ...vectorSearchResults.contextTexts,
    ...filledSources.contextTexts,
  ];
  sources = [...sources, ...vectorSearchResults.sources];
  debugLog(
    `Assembled ${contextTexts.length} total context chunks for LLM prompt.`
  );

  if (chatMode === "query" && contextTexts.length === 0) {
    const textResponse =
      workspace?.queryRefusalResponse ??
      "There is no relevant information in this workspace to answer your query.";
    await WorkspaceChats.new({
      workspaceId: workspace.id,
      prompt: message,
      response: {
        text: textResponse,
        sources: [],
        attachments,
        type: chatMode,
        metrics: {},
      },
      threadId: thread?.id || null,
      include: false,
      apiSessionId: sessionId,
      user,
    });
    return {
      id: uuid,
      type: "textResponse",
      sources: [],
      close: true,
      error: null,
      textResponse,
      metrics: {},
    };
  }

  const messages = await LLMConnector.compressMessages(
    {
      systemPrompt: await chatPrompt(workspace, user),
      userPrompt: message,
      contextTexts,
      chatHistory,
      attachments,
    },
    rawHistory
  );

  const { textResponse, metrics: performanceMetrics } =
    await LLMConnector.getChatCompletion(messages, {
      temperature: workspace?.openAiTemp ?? LLMConnector.defaultTemp,
    });

  if (!textResponse) {
    return {
      id: uuid,
      type: "abort",
      textResponse: null,
      sources: [],
      close: true,
      error: "No text completion could be completed with this input.",
      metrics: performanceMetrics,
    };
  }

  const { chat } = await WorkspaceChats.new({
    workspaceId: workspace.id,
    prompt: message,
    response: {
      text: textResponse,
      sources,
      attachments,
      type: chatMode,
      metrics: performanceMetrics,
    },
    threadId: thread?.id || null,
    apiSessionId: sessionId,
    user,
  });

  return {
    id: uuid,
    type: "textResponse",
    close: true,
    error: null,
    chatId: chat.id,
    textResponse,
    sources,
    metrics: performanceMetrics,
  };
}

/**
 * Handle streamable HTTP chunks for chats with your workspace via the developer API endpoint
 * @param {{
 * response: import("express").Response,
 * workspace: import("@prisma/client").workspaces,
 * message:string,
 * mode: "chat"|"query",
 * user: import("@prisma/client").users|null,
 * thread: import("@prisma/client").workspace_threads|null,
 * sessionId: string|null,
 * attachments: { name: string; mime: string; contentString: string }[],
 * reset: boolean,
 * }} parameters
 * @returns {Promise<VoidFunction>}
 */
async function streamChat({
  response,
  workspace,
  message = null,
  mode = "chat",
  user = null,
  thread = null,
  sessionId = null,
  attachments = [],
  reset = false,
}) {
  const uuid = uuidv4();
  const chatMode = mode ?? "chat";

  if (reset) {
    await WorkspaceChats.markThreadHistoryInvalidV2({
      workspaceId: workspace.id,
      user_id: user?.id,
      thread_id: thread?.id,
      api_session_id: sessionId,
    });
    if (!message?.length) {
      writeResponseChunk(response, {
        id: uuid,
        type: "textResponse",
        textResponse: "Chat history was reset!",
        sources: [],
        attachments: [],
        close: true,
        error: null,
        metrics: {},
      });
      return;
    }
  }

  message = await grepAllSlashCommands(message);

  if (EphemeralAgentHandler.isAgentInvocation({ message })) {
    await Telemetry.sendTelemetry("agent_chat_started");
    const agentHandler = new EphemeralAgentHandler({
      uuid,
      workspace,
      prompt: message,
      userId: user?.id || null,
      threadId: thread?.id || null,
      sessionId,
    });
    const eventListener = new EphemeralEventListener();
    await agentHandler.init();
    await agentHandler.createAIbitat({ handler: eventListener });
    agentHandler.startAgentCluster();

    const { thoughts, textResponse } = await eventListener.streamAgentEvents(
      response,
      uuid
    );
    await WorkspaceChats.new({
      workspaceId: workspace.id,
      prompt: String(message),
      response: {
        text: textResponse,
        sources: [],
        attachments,
        type: chatMode,
        thoughts,
      },
      include: true,
      threadId: thread?.id || null,
      apiSessionId: sessionId,
    });
    writeResponseChunk(response, {
      uuid,
      type: "finalizeResponseStream",
      textResponse,
      thoughts,
      close: true,
      error: false,
    });
    return;
  }

  const LLMConnector = getLLMProvider({
    provider: workspace?.chatProvider,
    model: workspace?.chatModel,
  });
  const VectorDb = getVectorDbClass();
  const messageLimit = workspace?.openAiHistory || 20;
  const hasVectorizedSpace = await VectorDb.hasNamespace(workspace.slug);
  const embeddingsCount = await VectorDb.namespaceCount(workspace.slug);

  if ((!hasVectorizedSpace || embeddingsCount === 0) && chatMode === "query") {
    const textResponse =
      workspace?.queryRefusalResponse ??
      "There is no relevant information in this workspace to answer your query.";
    writeResponseChunk(response, {
      id: uuid,
      type: "textResponse",
      textResponse,
      sources: [],
      attachments: [],
      close: true,
      error: null,
      metrics: {},
    });
    await WorkspaceChats.new({
      workspaceId: workspace.id,
      prompt: message,
      response: {
        text: textResponse,
        sources: [],
        attachments,
        type: chatMode,
        metrics: {},
      },
      threadId: thread?.id || null,
      apiSessionId: sessionId,
      include: false,
      user,
    });
    return;
  }

  let completeText;
  let metrics = {};
  let contextTexts = [];
  let sources = [];
  let pinnedDocIdentifiers = [];
  const { rawHistory, chatHistory } = await recentChatHistory({
    user,
    workspace,
    thread,
    messageLimit,
    apiSessionId: sessionId,
  });

  const documentManager = new DocumentManager({
    workspace,
    maxTokens: LLMConnector.promptWindowLimit(),
  });
  const pinnedDocs = await documentManager.pinnedDocs();
  pinnedDocs.forEach((doc) => {
    const { pageContent, ...metadata } = doc;
    pinnedDocIdentifiers.push(sourceIdentifier(doc));
    contextTexts.push(doc.pageContent);
    sources.push({
      text:
        pageContent.slice(0, 1_000) + "...continued on in source document...",
      ...metadata,
    });
  });

  const useHybrid =
    process.env.VECTOR_DB?.toLowerCase() === "milvus" &&
    process.env.EMBEDDING_ENGINE?.toLowerCase() === "hybrid";
  debugLog("Search strategy", { useHybrid });

  const vectorSearchResults =
    embeddingsCount !== 0
      ? await (useHybrid
          ? VectorDb.performHybridSearch({
              namespace: workspace.slug,
              input: message,
              LLMConnector,
              similarityThreshold: workspace?.similarityThreshold,
              topN: workspace?.topN,
              filterIdentifiers: pinnedDocIdentifiers,
              rerank: workspace?.vectorSearchMode === "rerank",
            })
          : VectorDb.performSimilaritySearch({
              namespace: workspace.slug,
              input: message,
              LLMConnector,
              similarityThreshold: workspace?.similarityThreshold,
              topN: workspace?.topN,
              filterIdentifiers: pinnedDocIdentifiers,
              rerank: workspace?.vectorSearchMode === "rerank",
            }))
      : {
          contextTexts: [],
          sources: [],
          message: null,
        };

  if (vectorSearchResults.message) {
    writeResponseChunk(response, {
      id: uuid,
      type: "abort",
      textResponse: null,
      sources: [],
      close: true,
      error: vectorSearchResults.message,
      metrics: {},
    });
    return;
  }

  const { fillSourceWindow } = require("../helpers/chat");
  const filledSources = fillSourceWindow({
    nDocs: workspace?.topN || 4,
    searchResults: vectorSearchResults.sources,
    history: rawHistory,
    filterIdentifiers: pinnedDocIdentifiers,
  });


  // [FIXED] This is the crucial change. We must combine the context from pinned docs,
  // the current vector search, and the historical search (fillSourceWindow).
  contextTexts = [
    ...contextTexts,
    ...vectorSearchResults.contextTexts,
    ...filledSources.contextTexts,
  ];
  sources = [...sources, ...vectorSearchResults.sources];
  debugLog(
    `Assembled ${contextTexts.length} total context chunks for LLM prompt.`
  );

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
      metrics: {},
    });

    await WorkspaceChats.new({
      workspaceId: workspace.id,
      prompt: message,
      response: {
        text: textResponse,
        sources: [],
        attachments,
        type: chatMode,
        metrics: {},
      },
      threadId: thread?.id || null,
      apiSessionId: sessionId,
      include: false,
      user,
    });
    return;
  }
  debugLog("--DEBUG LOG: CONTEXT LOGS", contextTexts);

  const messages = await LLMConnector.compressMessages(
    {
      systemPrompt: await chatPrompt(workspace, user),
      userPrompt: message,
      contextTexts,
      chatHistory,
      attachments,
    },
    rawHistory
  );

  if (LLMConnector.streamingEnabled() !== true) {
    console.log(
      `\x1b[31m[STREAMING DISABLED]\x1b[0m Streaming is not available for ${LLMConnector.constructor.name}. Will use regular chat method.`
    );
    const { textResponse, metrics: performanceMetrics } =
      await LLMConnector.getChatCompletion(messages, {
        temperature: workspace?.openAiTemp ?? LLMConnector.defaultTemp,
      });
    completeText = textResponse;
    metrics = performanceMetrics;
    writeResponseChunk(response, {
      uuid,
      sources,
      type: "textResponseChunk",
      textResponse: completeText,
      close: true,
      error: false,
      metrics,
    });
  } else {
    const stream = await LLMConnector.streamGetChatCompletion(messages, {
      temperature: workspace?.openAiTemp ?? LLMConnector.defaultTemp,
    });
    completeText = await LLMConnector.handleStream(response, stream, {
      uuid,
      sources,
    });
    metrics = stream.metrics;
  }

  if (completeText?.length > 0) {
    const { chat } = await WorkspaceChats.new({
      workspaceId: workspace.id,
      prompt: message,
      response: {
        text: completeText,
        sources,
        type: chatMode,
        metrics,
        attachments,
      },
      threadId: thread?.id || null,
      apiSessionId: sessionId,
      user,
    });

    writeResponseChunk(response, {
      uuid,
      type: "finalizeResponseStream",
      close: true,
      error: false,
      chatId: chat.id,
      metrics,
    });
    return;
  }

  writeResponseChunk(response, {
    uuid,
    type: "finalizeResponseStream",
    close: true,
    error: false,
  });
  return;
}

module.exports.ApiChatHandler = {
  chatSync,
  streamChat,
};
