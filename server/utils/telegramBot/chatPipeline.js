const { WorkspaceChats } = require("../../models/workspaceChats");
const {
  WorkspaceAgentInvocation,
} = require("../../models/workspaceAgentInvocation");
const { getLLMProvider, getVectorDbClass } = require("../helpers");
const { DocumentManager } = require("../DocumentManager");
const { sourceIdentifier, recentChatHistory, chatPrompt } = require("../chats");
const { AgentHandler } = require("../agents");
const { STREAM_EDIT_INTERVAL, MAX_MSG_LEN } = require("./constants");
const { editMessage, sendFormattedMessage } = require("./chatActions");
const { sendVoiceResponse } = require("./mediaHandlers");
const { safeJsonParse } = require("../http");

/**
 * Stream a response to Telegram by running the full RAG pipeline.
 * Uses the same pipeline as the web UI (RAG, pinned docs, etc.)
 * and stores chats with thread_id so they appear in the AnythingLLM UI.
 * @param {object} context - The context object.
 * @param {import("./commands").BotContext} context.ctx - The bot object.
 * @param {number} context.chatId - The chat ID.
 * @param {import('@prisma/client').workspaces} context.workspace - The workspace object.
 * @param {object|null} context.thread - The thread object.
 * @param {string} context.message - The message to send.
 * @param {array} context.attachments - The attachments to send.
 * @param {boolean} context.voiceResponse - Whether to send the response as voice.
 */
async function streamResponse({
  ctx = null,
  chatId = null,
  workspace = null,
  thread = null,
  message = "",
  attachments = [],
  voiceResponse = false,
}) {
  if (!ctx?.bot || !chatId || !workspace || !message)
    throw new Error("Invalid context or missing required parameters!");

  await ctx.bot.sendChatAction(chatId, "typing");
  const typingInterval = setInterval(() => {
    ctx.bot.sendChatAction(chatId, "typing").catch(() => {});
  }, 4000);

  // Handle @agent invocations via the agent pipeline
  if (
    await AgentHandler.isAgentInvocation({
      message,
      workspace,
      chatMode: workspace.chatMode ?? "chat",
    })
  ) {
    return await handleAgentResponse(ctx, chatId, workspace, thread, message);
  }

  const chatMode = workspace.chatMode || "chat";
  const LLMConnector = getLLMProvider({
    provider: workspace?.chatProvider,
    model: workspace?.chatModel,
  });
  const VectorDb = getVectorDbClass();
  const messageLimit = workspace?.openAiHistory || 20;
  const hasVectorizedSpace = await VectorDb.hasNamespace(workspace.slug);
  const embeddingsCount = await VectorDb.namespaceCount(workspace.slug);

  if ((!hasVectorizedSpace || embeddingsCount === 0) && chatMode === "query") {
    await ctx.bot.sendMessage(
      chatId,
      workspace?.queryRefusalResponse ??
        "There is no relevant information in this workspace to answer your query."
    );
    return;
  }

  const { rawHistory, chatHistory } = await recentChatHistory({
    user: null,
    workspace,
    thread,
    messageLimit,
    apiSessionId: null,
  });

  let contextTexts = [];
  let sources = [];
  let pinnedDocIdentifiers = [];

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

  const vectorSearchResults =
    embeddingsCount !== 0
      ? await VectorDb.performSimilaritySearch({
          namespace: workspace.slug,
          input: message,
          LLMConnector,
          similarityThreshold: workspace?.similarityThreshold,
          topN: workspace?.topN,
          filterIdentifiers: pinnedDocIdentifiers,
          rerank: workspace?.vectorSearchMode === "rerank",
        })
      : { contextTexts: [], sources: [], message: null };

  if (vectorSearchResults.message) {
    await ctx.bot.sendMessage(
      chatId,
      "Vector search failed. Please try again."
    );
    return;
  }

  const { fillSourceWindow } = require("../helpers/chat");
  const filledSources = fillSourceWindow({
    nDocs: workspace?.topN || 4,
    searchResults: vectorSearchResults.sources,
    history: rawHistory,
    filterIdentifiers: pinnedDocIdentifiers,
  });

  contextTexts = [...contextTexts, ...filledSources.contextTexts];
  sources = [...sources, ...vectorSearchResults.sources];

  if (chatMode === "query" && contextTexts.length === 0) {
    await ctx.bot.sendMessage(
      chatId,
      workspace?.queryRefusalResponse ??
        "There is no relevant information in this workspace to answer your query."
    );
    return;
  }

  const messages = await LLMConnector.compressMessages(
    {
      systemPrompt: await chatPrompt(workspace),
      userPrompt: message,
      contextTexts,
      chatHistory,
      attachments,
    },
    rawHistory
  );

  let completeText = "";
  let metrics = {};

  try {
    if (LLMConnector.streamingEnabled() === true) {
      const stream = await LLMConnector.streamGetChatCompletion(messages, {
        temperature: workspace?.openAiTemp ?? LLMConnector.defaultTemp,
      });

      const { responseHandler, flushEdit } = createStreamHandler({
        ctx,
        chatId,
        voiceResponse,
      });

      completeText = await LLMConnector.handleStream(responseHandler, stream, {
        uuid: chatId.toString(),
      });

      if (!voiceResponse) await flushEdit(true);
      metrics = stream.metrics || {};
    } else {
      const { textResponse, metrics: performanceMetrics } =
        await LLMConnector.getChatCompletion(messages, {
          temperature: workspace?.openAiTemp ?? LLMConnector.defaultTemp,
          user: null,
        });
      completeText = textResponse;
      metrics = performanceMetrics || {};
      if (!voiceResponse && completeText?.length > 0)
        await sendFormattedMessage(ctx.bot, chatId, completeText);
    }
  } finally {
    clearInterval(typingInterval);
  }

  if (!completeText?.length) {
    await ctx.bot.sendMessage(chatId, "No response generated.");
  } else {
    await WorkspaceChats.new({
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
    });

    if (!voiceResponse) return;
    const ttsSent = await sendVoiceResponse(ctx.bot, chatId, completeText);
    if (!ttsSent) await ctx.bot.sendMessage(chatId, completeText);
  }
}

/**
 * Run the agent pipeline for @agent messages and send the result to Telegram.
 * Creates a socket adapter so the existing AgentHandler/AIbitat system works
 * without a real WebSocket connection.
 * @param {BotContext} ctx
 * @param {number} chatId
 * @param {import('../../prisma').workspaces} workspace
 * @param {object|null} thread
 * @param {string} message
 */
async function handleAgentResponse(ctx, chatId, workspace, thread, message) {
  const { invocation } = await WorkspaceAgentInvocation.new({
    prompt: message,
    workspace,
    user: null,
    thread,
  });

  if (!invocation) {
    await ctx.bot.sendMessage(
      chatId,
      "Failed to start agent. Try sending your message without @agent."
    );
    return;
  }

  let finalResponse = "";
  const thoughts = [];
  const charts = [];
  const files = [];
  let thoughtMsgId = null;
  let lastThoughtText = "";

  const socket = {
    send(data) {
      const parsed = JSON.parse(data);

      // Introspection / thinking updates
      if (parsed.type === "statusResponse" && parsed.content) {
        thoughts.push(parsed.content);
        return;
      }

      // Chart visualization
      if (parsed.type === "rechartVisualize" && parsed.content) {
        charts.push(parsed.content);
        return;
      }

      // File download
      if (parsed.type === "fileDownload" && parsed.content) {
        files.push(parsed.content);
        return;
      }

      // Streaming agent response
      if (parsed.type === "reportStreamEvent") {
        const inner = parsed.content;
        if (inner?.type === "fullTextResponse" && inner?.content) {
          finalResponse = inner.content;
        }
        return;
      }

      // Non-streaming agent response (fallback)
      if (parsed.from && parsed.from !== "USER" && parsed.content) {
        finalResponse = parsed.content;
      }
    },
    close() {},
  };

  // Periodically flush thoughts as a single live-updating message
  const thoughtFlush = setInterval(async () => {
    if (thoughts.length === 0) return;
    const text = thoughts.map((t) => `⏳ ${t}`).join("\n");
    if (text === lastThoughtText) return;
    lastThoughtText = text;
    try {
      if (!thoughtMsgId) {
        const sent = await ctx.bot.sendMessage(chatId, text);
        thoughtMsgId = sent.message_id;
      } else {
        await editMessage(ctx.bot, chatId, thoughtMsgId, text, ctx.log);
      }
    } catch {}
  }, 1500);

  const typingInterval = setInterval(() => {
    ctx.bot.sendChatAction(chatId, "typing").catch(() => {});
  }, 4000);

  try {
    const agentHandler = await new AgentHandler({
      uuid: invocation.uuid,
    }).init();
    await agentHandler.createAIbitat({ socket });
    // End on interrupts. Telegram can't provide interactive feedback and
    // auto-continuing would accumulate tool results across cycles, risking token limits.
    socket.askForFeedback = () => Promise.resolve("exit");
    agentHandler.aibitat.onError((_error, chat) => {
      if (!finalResponse && chat?.content) finalResponse = chat.content;
    });
    await agentHandler.startAgentCluster();
  } finally {
    clearInterval(typingInterval);
    clearInterval(thoughtFlush);
    // Close the invocation via the main process's DB connection since
    // child processes (Bree jobs) can't share the SQLite connection pool.
    if (typeof process.send === "function") {
      process.send({ type: "closeInvocation", uuid: invocation.uuid });
    } else {
      try {
        await WorkspaceAgentInvocation.close(invocation.uuid);
      } catch {}
    }
  }

  // Final thought update, mark as completed
  if (thoughtMsgId && thoughts.length > 0) {
    const doneText = thoughts.map((t) => `✓ ${t}`).join("\n");
    await editMessage(ctx.bot, chatId, thoughtMsgId, doneText, ctx.log);
  }

  // Send charts as locally rendered images
  for (const chart of charts) {
    try {
      const buffer = await renderChartToBuffer(chart);
      await ctx.bot.sendPhoto(
        chatId,
        buffer,
        { caption: chart.title },
        {
          filename: "chart.png",
          contentType: "image/png",
          knownLength: buffer.length,
        }
      );
    } catch {
      await ctx.bot.sendMessage(
        chatId,
        `${chart.title}: failed to render chart.`
      );
    }
  }

  // Send files as Telegram documents
  for (const file of files) {
    try {
      const base64Data = file.b64Content.split(",")[1];
      const buffer = Buffer.from(base64Data, "base64");
      await ctx.bot.sendDocument(
        chatId,
        buffer,
        {},
        {
          filename: file.filename,
          contentType: "application/octet-stream",
        }
      );
    } catch {}
  }

  if (finalResponse) {
    await sendFormattedMessage(ctx.bot, chatId, finalResponse);
  } else if (charts.length === 0 && files.length === 0) {
    await ctx.bot.sendMessage(
      chatId,
      "Agent completed but no response was generated."
    );
  }
}

/**
 * Render a Recharts dataset locally as a PNG buffer using chartjs-node-canvas.
 * @param {object} chart - { type, title, dataset }
 * @returns {Promise<Buffer>}
 */
async function renderChartToBuffer(chart) {
  const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
  const canvas = new ChartJSNodeCanvas({ width: 600, height: 400 });

  const data = JSON.parse(chart.dataset);
  const labels = data.map((d) => d.name);
  const valueKey = Object.keys(data[0]).find((k) => k !== "name");
  const values = data.map((d) => d[valueKey]);

  const config = {
    type: chart.type === "area" ? "line" : chart.type,
    data: {
      labels,
      datasets: [
        {
          label: chart.title,
          data: values,
          fill: chart.type === "area",
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.2)",
        },
      ],
    },
    options: {
      plugins: { title: { display: true, text: chart.title } },
    },
  };

  return await canvas.renderToBuffer(config);
}

/**
 * Create a stream response handler for editing Telegram messages as tokens arrive.
 * Manages message splitting when content exceeds Telegram's length limit.
 * @param {object} options
 * @param {import("./commands").BotContext} options.ctx - Bot context
 * @param {number} options.chatId - Telegram chat ID
 * @param {boolean} options.voiceResponse - Whether response will be sent as voice
 * @returns {{ responseHandler: object, flushEdit: function }}
 */
function createStreamHandler({ ctx, chatId, voiceResponse }) {
  let completeText = "";
  let messageId = null;
  let messagePending = false;
  let lastEditTime = 0;
  let editTimer = null;
  let msgOffset = 0;

  const currentText = () => completeText.slice(msgOffset);

  const flushEdit = async (final = false) => {
    if (!messageId) return;
    clearTimeout(editTimer);
    editTimer = null;
    const text = currentText();
    const display = final ? text : text + " \u258d";
    await editMessage(ctx.bot, chatId, messageId, display, ctx.log, {
      format: final,
    }).catch(() => {});
  };

  const responseHandler = {
    on: () => {},
    removeListener: () => {},
    write: (data) => {
      const match = data.match(/^data: (.+)\n\n$/s);
      if (!match) return;
      const parsed = safeJsonParse(match[1], null);
      if (!parsed) return;

      if (parsed.textResponse && !parsed.close) {
        completeText += parsed.textResponse;

        if (messageId !== null && currentText().length > MAX_MSG_LEN) {
          clearTimeout(editTimer);
          editTimer = null;
          editMessage(
            ctx.bot,
            chatId,
            messageId,
            completeText.slice(msgOffset, msgOffset + MAX_MSG_LEN),
            ctx.log,
            { format: true }
          ).catch(() => {});
          msgOffset += MAX_MSG_LEN;
          messageId = null;
          messagePending = false;
        }

        if (messageId === null && !messagePending && !voiceResponse) {
          messagePending = true;
          ctx.bot
            .sendMessage(chatId, currentText() + " \u258d")
            .then((sent) => {
              messageId = sent.message_id;
              lastEditTime = Date.now();
            })
            .catch(() => {
              messagePending = false;
            });
          return;
        }

        if (!messageId) return;

        const now = Date.now();
        if (now - lastEditTime >= STREAM_EDIT_INTERVAL) {
          clearTimeout(editTimer);
          lastEditTime = now;
          editMessage(
            ctx.bot,
            chatId,
            messageId,
            currentText() + " \u258d",
            ctx.log
          ).catch(() => {});
        } else if (!editTimer) {
          editTimer = setTimeout(() => {
            lastEditTime = Date.now();
            editMessage(
              ctx.bot,
              chatId,
              messageId,
              currentText() + " \u258d",
              ctx.log
            ).catch(() => {});
            editTimer = null;
          }, STREAM_EDIT_INTERVAL);
        }
      }
    },
  };

  return { responseHandler, flushEdit };
}

module.exports = { streamResponse };
