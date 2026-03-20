const { WorkspaceChats } = require("../../../models/workspaceChats");
const { getLLMProvider, getVectorDbClass } = require("../../helpers");
const { DocumentManager } = require("../../DocumentManager");
const {
  sourceIdentifier,
  recentChatHistory,
  chatPrompt,
} = require("../../chats");
const { AgentHandler } = require("../../agents");
const { STREAM_EDIT_INTERVAL, MAX_MSG_LEN } = require("../constants");
const { editMessage, sendFormattedMessage } = require("../utils");
const { sendVoiceResponse } = require("../utils/media");
const { safeJsonParse } = require("../../http");
const { handleAgentResponse } = require("./agent");

/**
 * Stream a response to Telegram by running the full RAG pipeline.
 * Uses the same pipeline as the web UI (RAG, pinned docs, etc.)
 * and stores chats with thread_id so they appear in the AnythingLLM UI.
 * @param {object} context - The context object.
 * @param {import("../commands").BotContext} context.ctx - The bot object.
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

  // Start typing indicator renewal for traditional chat, agent has its own typing indicator.
  const typingInterval = setInterval(() => {
    ctx.bot.sendChatAction(chatId, "typing").catch(() => {});
  }, 4000);
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

  const { fillSourceWindow } = require("../../helpers/chat");
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
  let messagePending = null;
  let lastEditTime = 0;
  let editTimer = null;
  let msgOffset = 0;

  const currentText = () => completeText.slice(msgOffset);

  const flushEdit = async (final = false) => {
    if (messagePending) await messagePending;
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
          messagePending = null;
        }

        if (messageId === null && !messagePending && !voiceResponse) {
          messagePending = ctx.bot
            .sendMessage(chatId, currentText() + " \u258d")
            .then((sent) => {
              messageId = sent.message_id;
              lastEditTime = Date.now();
            })
            .catch(() => {
              messagePending = null;
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
