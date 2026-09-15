const { randomUUID } = require("node:crypto");
const { Workspace } = require("../models/workspace");
const { WorkspaceThread } = require("../models/workspaceThread");
const { WorkspaceChats } = require("../models/workspaceChats");
const {
  getVectorDbClass,
  resolveProviderConnector,
} = require("../utils/helpers");
const { addChatCostToMetrics } = require("../utils/helpers/modelPricing");
const { DocumentManager } = require("../utils/DocumentManager");
const {
  sourceIdentifier,
  recentChatHistory,
  chatPrompt,
} = require("../utils/chats");
const { fillSourceWindow } = require("../utils/helpers/chat");
const { AgentHandler } = require("../utils/agents");
const { EphemeralAgentHandler } = require("../utils/agents/ephemeral");

async function ragResponse(
  {
    workspace,
    thread,
    message,
    attachments,
    conversationId,
    rawHistory,
    chatHistory,
  },
  emit,
  onGenerationStart
) {
  const { connector, routingMetadata } = await resolveProviderConnector({
    workspace,
    prompt: message,
    thread,
    attachments,
  });
  const VectorDb = getVectorDbClass();
  const embeddingsCount = await VectorDb.namespaceCount(workspace.slug);
  const pinnedDocs = await new DocumentManager({
    workspace,
    maxTokens: connector.promptWindowLimit(),
  }).pinnedDocs();
  const pinnedDocIdentifiers = pinnedDocs.map(sourceIdentifier);
  const pinnedSources = pinnedDocs.map(({ pageContent, ...metadata }) => ({
    text: pageContent.slice(0, 1000) + "...continued on in source document...",
    ...metadata,
  }));
  const search =
    embeddingsCount !== 0
      ? await VectorDb.performSimilaritySearch({
          namespace: workspace.slug,
          input: message,
          LLMConnector: connector,
          similarityThreshold: workspace.similarityThreshold,
          topN: workspace.topN,
          filterIdentifiers: pinnedDocIdentifiers,
          rerank: workspace.vectorSearchMode === "rerank",
        })
      : { sources: [], contextTexts: [] };
  if (search.message)
    throw new Error("Vector search failed. Please try again.");
  const filled = fillSourceWindow({
    nDocs: workspace.topN || 4,
    searchResults: search.sources,
    history: rawHistory,
    filterIdentifiers: pinnedDocIdentifiers,
  });
  const messages = await connector.compressMessages(
    {
      systemPrompt: await chatPrompt(workspace),
      userPrompt: message,
      contextTexts: [
        ...pinnedDocs.map((doc) => doc.pageContent),
        ...filled.contextTexts,
      ],
      chatHistory,
      attachments,
    },
    rawHistory
  );
  onGenerationStart();
  let text, metrics;
  if (connector.streamingEnabled() === true) {
    const stream = await connector.streamGetChatCompletion(messages, {
      temperature: workspace.openAiTemp ?? connector.defaultTemp,
    });
    const handler = {
      on() {},
      removeListener() {},
      write(data) {
        const match = String(data).match(/^data: (.+)\n\n$/s);
        if (!match) return;
        try {
          const parsed = JSON.parse(match[1]);
          if (parsed.textResponse && !parsed.close)
            emit({ type: "textChunk", text: parsed.textResponse });
        } catch {}
      },
    };
    text = await connector.handleStream(handler, stream, {
      uuid: conversationId,
    });
    metrics = stream.metrics || {};
  } else {
    const response = await connector.getChatCompletion(messages, {
      temperature: workspace.openAiTemp ?? connector.defaultTemp,
      user: null,
    });
    text = response.textResponse;
    metrics = response.metrics || {};
  }
  return {
    text,
    sources: [...pinnedSources, ...search.sources],
    type: workspace.chatMode || "chat",
    metrics: addChatCostToMetrics(metrics, {
      routingMetadata,
      workspace,
      connector,
    }),
    attachments,
  };
}

async function agentResponse(
  { workspace, thread, message, attachments },
  emit,
  requestToolApproval
) {
  let text = "",
    streamed = "",
    metrics = {},
    failure = null;
  const sources = [],
    artifacts = [];
  const handler = {
    send(data) {
      let parsed;
      try {
        parsed = JSON.parse(data);
      } catch {
        return;
      }
      if (parsed.type === "wssFailure") {
        failure = new Error(parsed.content);
        return;
      }
      if (parsed.type === "statusResponse") {
        if (parsed.content) emit({ type: "status", text: parsed.content });
        return;
      }
      if (["rechartVisualize", "fileDownloadCard"].includes(parsed.type)) {
        if (parsed.content)
          artifacts.push({
            kind: parsed.type === "rechartVisualize" ? "chart" : "file",
            ...parsed.content,
          });
        return;
      }
      if (
        ["imageGenerationCard", "imageGenerationPending"].includes(parsed.type)
      )
        return;
      if (parsed.type === "reportStreamEvent") {
        const inner = parsed.content;
        if (inner?.type === "textResponseChunk" && inner.content) {
          streamed += inner.content;
          emit({ type: "textChunk", text: inner.content });
        }
        if (inner?.type === "fullTextResponse" && inner.content)
          text = inner.content;
        if (inner?.type === "usageMetrics" && inner.metrics)
          metrics = inner.metrics;
        if (inner?.type === "citations" && inner.citations)
          sources.push(...inner.citations);
        return;
      }
      if (parsed.from && parsed.from !== "USER" && parsed.content)
        text = parsed.content;
    },
    close() {
      emit({ type: "closeInvocation" });
    },
  };
  const agent = await new EphemeralAgentHandler({
    uuid: randomUUID(),
    workspace,
    prompt: message,
    userId: null,
    threadId: thread?.id || null,
    attachments,
  }).init();
  await agent.createAIbitat({ handler, requestToolApproval });
  agent.aibitat.maxRounds = 2;
  await agent.startAgentCluster();
  if (failure) throw failure;
  for (const file of artifacts) await emit({ type: "artifact", file });
  const outputs = agent.aibitat?._pendingOutputs ?? [];
  return {
    text: text || streamed,
    sources,
    type: "chat",
    metrics,
    attachments,
    agent: true,
    ...(outputs.length ? { outputs } : {}),
  };
}

/** Runs the shared pipeline. This is the sole owner of chat persistence. */
async function runExternalChannelChat(
  payload,
  emit,
  { requestToolApproval } = {}
) {
  const {
    workspaceSlug,
    threadSlug,
    message,
    attachments = [],
    conversationId,
  } = payload;
  let failureMessage = "Sorry, something went wrong. Please try again.";
  try {
    const workspace = await Workspace.get({ slug: workspaceSlug });
    if (!workspace)
      throw new Error("No workspace configured. Use /switch to select one.");
    if (!message)
      throw new Error("Invalid context or missing required parameters!");
    const thread = threadSlug
      ? await WorkspaceThread.get({ slug: threadSlug })
      : null;
    await emit({ type: "ready" });
    const { rawHistory, chatHistory } = await recentChatHistory({
      workspace,
      thread,
      messageLimit: workspace.openAiHistory || 20,
    });
    const chatMode = workspace.chatMode || "chat";
    const agenticHistory =
      chatMode === "chat" &&
      chatHistory.some(
        (entry) => entry.role === "user" && entry.content.startsWith("@agent")
      );
    const agentic =
      agenticHistory ||
      (await AgentHandler.isAgentInvocation({
        message,
        workspace,
        chatMode: workspace.chatMode ?? "automatic",
      }));
    const context = {
      workspace,
      thread,
      message,
      attachments,
      conversationId,
      rawHistory,
      chatHistory,
    };
    const result = agentic
      ? await agentResponse(context, emit, requestToolApproval)
      : await ragResponse(context, emit, () => {
          failureMessage = "An error occurred while streaming the response.";
        });
    if (result.text?.length) {
      const { agent: _agent, ...response } = result;
      await WorkspaceChats.new({
        workspaceId: workspace.id,
        prompt: message,
        response,
        threadId: thread?.id || null,
      });
    } else if (!agentic) throw new Error("No response generated.");
    await emit({ type: "complete", result });
  } catch (error) {
    const publicErrors = [
      "No workspace configured. Use /switch to select one.",
      "Vector search failed. Please try again.",
      "No response generated.",
    ];
    await emit({
      type: "failed",
      message: publicErrors.includes(error.message)
        ? error.message
        : failureMessage,
    });
  }
}

/** IPC approval bridge; pending listeners are removed on response or timeout. */
function createApprovalRequester(emit, ipc = process) {
  return (request) =>
    new Promise((resolve) => {
      const requestId = randomUUID();
      const timeoutMs = 120000;
      const finish = (result) => {
        clearTimeout(timer);
        ipc.removeListener("message", receive);
        resolve(result);
      };
      const receive = (event) => {
        if (
          event?.type === "toolApprovalResponse" &&
          event.requestId === requestId
        )
          finish({
            approved: event.approved === true,
            message:
              event.message ||
              (event.approved
                ? "User approved the tool execution."
                : "Tool call was rejected by the user."),
          });
      };
      const timer = setTimeout(
        () =>
          finish({
            approved: false,
            message:
              "Tool approval request timed out. User did not respond in time.",
          }),
        timeoutMs
      );
      ipc.on("message", receive);
      Promise.resolve()
        .then(() =>
          emit({
            ...request,
            type: "toolApprovalRequest",
            requestId,
            timeoutMs,
          })
        )
        .catch(() =>
          finish({
            approved: false,
            message: "Could not request tool approval.",
          })
        );
    });
}

if (require.main === module) {
  const { parentPort } = require("node:worker_threads");
  const emit = (event) =>
    parentPort
      ? parentPort.postMessage({ ...event, silent: true })
      : process.send({ ...event, silent: true });
  const { conclude } = require("./helpers");
  let started = false;
  process.on("message", async (payload) => {
    if (started || payload?.type === "toolApprovalResponse") return;
    started = true;
    try {
      await runExternalChannelChat(payload, emit, {
        requestToolApproval: createApprovalRequester(emit),
      });
    } finally {
      conclude();
    }
  });
}

module.exports = { runExternalChannelChat, createApprovalRequester };
