const { WorkspaceChats } = require("../../models/workspaceChats");
const { getLLMProvider, getVectorDbClass } = require("../helpers");
const { DocumentManager } = require("../DocumentManager");
const { sourceIdentifier, recentChatHistory, chatPrompt } = require("../chats");
const { v4: uuidv4 } = require("uuid");
const { STREAM_EDIT_INTERVAL } = require("./constants");
const { editMessage } = require("./chatActions");

/**
 * Stream a response to Telegram by running the full RAG pipeline.
 * Uses the same pipeline as the web UI (RAG, pinned docs, etc.)
 * and stores chats with thread_id so they appear in the AnythingLLM UI.
 * @param {BotContext} ctx
 * @param {number} chatId
 * @param {object} workspace
 * @param {object|null} thread
 * @param {string} message
 */
async function streamResponse(ctx, chatId, workspace, thread, message) {
  // Show typing indicator while we prepare the response
  await ctx.bot.sendChatAction(chatId, "typing");

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

  // Keep typing indicator alive while LLM prepares the stream
  const typingInterval = setInterval(() => {
    ctx.bot.sendChatAction(chatId, "typing").catch(() => {});
  }, 4000);

  const messages = await LLMConnector.compressMessages(
    {
      systemPrompt: await chatPrompt(workspace, null),
      userPrompt: message,
      contextTexts,
      chatHistory,
      attachments: [],
    },
    rawHistory
  );

  let completeText = "";
  let metrics = {};

  try {
    if (LLMConnector.streamingEnabled() === true) {
      const stream = await LLMConnector.streamGetChatCompletion(messages, {
        temperature: workspace?.openAiTemp ?? LLMConnector.defaultTemp,
        user: null,
      });

      completeText = await handleStreamToTelegram(
        ctx,
        chatId,
        stream,
        LLMConnector
      );
      metrics = stream.metrics || {};
    } else {
      const { textResponse, metrics: performanceMetrics } =
        await LLMConnector.getChatCompletion(messages, {
          temperature: workspace?.openAiTemp ?? LLMConnector.defaultTemp,
          user: null,
        });
      completeText = textResponse;
      metrics = performanceMetrics || {};

      if (completeText?.length > 0) {
        await ctx.bot.sendMessage(chatId, completeText);
      }
    }
  } finally {
    clearInterval(typingInterval);
  }

  if (!completeText?.length) {
    await ctx.bot.sendMessage(chatId, "No response generated.");
  }

  if (completeText?.length > 0) {
    await WorkspaceChats.new({
      workspaceId: workspace.id,
      prompt: message,
      response: {
        text: completeText,
        sources,
        type: chatMode,
        metrics,
        attachments: [],
      },
      threadId: thread?.id || null,
      apiSessionId: null,
      user: null,
    });
  }
}

/**
 * Handle a stream from an LLM provider by periodically editing a Telegram message.
 * Waits for the first chunk before sending any message (typing indicator shows until then).
 * @param {BotContext} ctx
 * @param {number} chatId
 * @param {AsyncIterable} stream
 * @param {object} LLMConnector
 * @returns {Promise<string>} The complete response text.
 */
async function handleStreamToTelegram(ctx, chatId, stream, LLMConnector) {
  let fullText = "";
  let messageId = null;
  let lastEditTime = 0;
  let editTimer = null;

  const mockResponse = {
    write: () => {},
    on: () => {},
    removeListener: () => {},
  };

  try {
    if (typeof stream[Symbol.asyncIterator] === "function") {
      for await (const chunk of stream) {
        const token = extractToken(chunk);
        if (!token) continue;

        fullText += token;

        // Send the first message when the first token arrives
        if (messageId === null) {
          const sent = await ctx.bot.sendMessage(chatId, fullText + " \u258d");
          messageId = sent.message_id;
          lastEditTime = Date.now();
          continue;
        }

        const now = Date.now();
        if (now - lastEditTime >= STREAM_EDIT_INTERVAL) {
          clearTimeout(editTimer);
          lastEditTime = now;
          editMessage(
            ctx.bot,
            chatId,
            messageId,
            fullText + " \u258d",
            ctx.log
          ).catch(() => {});
        } else if (!editTimer) {
          editTimer = setTimeout(() => {
            lastEditTime = Date.now();
            editMessage(
              ctx.bot,
              chatId,
              messageId,
              fullText + " \u258d",
              ctx.log
            ).catch(() => {});
            editTimer = null;
          }, STREAM_EDIT_INTERVAL);
        }
      }
    } else {
      ctx.log(`Using fallback stream for ${LLMConnector.constructor.name}`);
      fullText = await LLMConnector.handleStream(mockResponse, stream, {
        uuid: uuidv4(),
      });
    }
  } catch (error) {
    ctx.log("Stream error:", error.message);
  }

  clearTimeout(editTimer);

  // Final edit to remove the cursor and show the complete text
  if (messageId && fullText.length > 0) {
    await editMessage(ctx.bot, chatId, messageId, fullText, ctx.log);
  } else if (!messageId && fullText.length > 0) {
    // Fallback stream path — never created a message via streaming
    await ctx.bot.sendMessage(chatId, fullText);
  }

  return fullText;
}

/**
 * Extract a text token from various LLM streaming chunk formats.
 * Supports OpenAI Responses API, Chat Completions, Anthropic, and generic strings.
 * @param {object|string} chunk
 * @returns {string|null}
 */
function extractToken(chunk) {
  if (chunk?.type === "response.output_text.delta") return chunk.delta;
  if (chunk?.choices?.[0]?.delta?.content)
    return chunk.choices[0].delta.content;
  if (chunk?.type === "content_block_delta" && chunk?.delta?.text)
    return chunk.delta.text;
  if (typeof chunk === "string") return chunk;
  return null;
}

module.exports = { streamResponse };
