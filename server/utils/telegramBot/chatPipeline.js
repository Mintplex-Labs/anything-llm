const { WorkspaceChats } = require("../../models/workspaceChats");
const {
  WorkspaceAgentInvocation,
} = require("../../models/workspaceAgentInvocation");
const { getLLMProvider, getVectorDbClass } = require("../helpers");
const { DocumentManager } = require("../DocumentManager");
const { sourceIdentifier, recentChatHistory, chatPrompt } = require("../chats");
const { AgentHandler } = require("../agents");
const { v4: uuidv4 } = require("uuid");
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

      // Stream state for Telegram message editing
      let messageId = null;
      let messagePending = false; // Prevents race condition on first message
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

      const stubbedResponse = {
        on: () => {},
        removeListener: () => {},
        write: (data) => {
          const match = data.match(/^data: (.+)\n\n$/s);
          if (!match) return;
          const parsed = safeJsonParse(match[1], null);
          if (!parsed) return;

          if (parsed.textResponse && !parsed.close) {
            completeText += parsed.textResponse;

            // Handle message length limit - split into new message
            if (messageId !== null && currentText().length > MAX_MSG_LEN) {
              clearTimeout(editTimer);
              editTimer = null;
              // Format the completed first message before moving on
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

            // Send first message when first token arrives (or after split)
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

            // Skip edits until we have a messageId
            if (!messageId) return;

            // Throttled editing to avoid Telegram rate limits
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

      completeText = await LLMConnector.handleStream(stubbedResponse, stream, {
        uuid: chatId.toString(),
      });

      // Final edit with formatting after stream completes
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
 * Read through a stream and return the full text without sending any messages.
 * Used when the response will be sent as voice instead of text.
 * @param {AsyncIterable} stream
 * @param {object} LLMConnector
 * @returns {Promise<string>}
 */
async function collectStreamText(stream, LLMConnector) {
  let fullText = "";
  try {
    if (typeof stream[Symbol.asyncIterator] === "function") {
      for await (const chunk of stream) {
        const token = extractToken(chunk);
        if (token) fullText += token;
      }
    } else {
      fullText = await LLMConnector.handleStream(
        { write: () => {}, on: () => {}, removeListener: () => {} },
        stream,
        { uuid: uuidv4() }
      );
    }
  } catch (error) {
    console.log("[TelegramBot] Stream error:", error.message);
  }
  return fullText;
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
  // Telegram caps messages at 4096 chars. We track where in fullText the
  // current message starts and split into a new message when it fills up.
  let msgOffset = 0;
  const currentText = () => fullText.slice(msgOffset);

  try {
    if (typeof stream[Symbol.asyncIterator] === "function") {
      for await (const chunk of stream) {
        console.log("chunk", JSON.stringify(chunk, null, 2));
        const token = extractToken(chunk);
        if (!token) continue;

        fullText += token;

        // Current message hit the limit, finalize it and start a new one
        if (messageId !== null && currentText().length > MAX_MSG_LEN) {
          clearTimeout(editTimer);
          editTimer = null;
          await editMessage(
            ctx.bot,
            chatId,
            messageId,
            fullText.slice(msgOffset, msgOffset + MAX_MSG_LEN),
            ctx.log
          );
          msgOffset += MAX_MSG_LEN;
          messageId = null;
        }

        // Send the first message when the first token arrives (or after a split)
        if (messageId === null) {
          const sent = await ctx.bot.sendMessage(
            chatId,
            currentText() + " \u258d"
          );
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
    } else {
      // Some providers don't return an async iterable. handleStream expects
      // an Express-like response object to write to, so we pass a no-op one
      // since we only need the final text back.
      ctx.log(`Using fallback stream for ${LLMConnector.constructor.name}`);
      fullText = await LLMConnector.handleStream(
        { write: () => {}, on: () => {}, removeListener: () => {} },
        stream,
        { uuid: uuidv4() }
      );
    }
  } catch (error) {
    ctx.log("Stream error:", error.message);
  }

  clearTimeout(editTimer);

  // Final edit to remove the cursor and show the complete text with formatting
  if (messageId && currentText().length > 0) {
    await editMessage(ctx.bot, chatId, messageId, currentText(), ctx.log, {
      format: true,
    });
  } else if (!messageId && fullText.length > 0) {
    // Fallback path, split into chunks if needed
    for (let i = 0; i < fullText.length; i += MAX_MSG_LEN) {
      await sendFormattedMessage(
        ctx.bot,
        chatId,
        fullText.slice(i, i + MAX_MSG_LEN)
      );
    }
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
  // Ollama Response Chunk
  if (chunk?.message?.content) return chunk.message.content;

  // OpenAI Chat Completions Response Chunk
  if (chunk?.choices?.[0]?.delta?.content)
    return chunk.choices[0].delta.content;

  // OpenAI Responses API Response Chunk
  if (chunk?.type === "response.output_text.delta") return chunk.delta;

  // Anthropic Response Chunk
  if (chunk?.type === "content_block_delta" && chunk?.delta?.text)
    return chunk.delta.text;

  // Generic String Response Chunk
  if (typeof chunk === "string") return chunk;
  return null;
}

module.exports = { streamResponse };
