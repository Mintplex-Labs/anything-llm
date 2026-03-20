const {
  WorkspaceAgentInvocation,
} = require("../../../models/workspaceAgentInvocation");
const { AgentHandler } = require("../../agents");
const { safeJsonParse } = require("../../http");
const { editMessage, sendFormattedMessage } = require("../utils");
const { STREAM_EDIT_INTERVAL, MAX_MSG_LEN } = require("../constants");

const THOUGHT_FLUSH_INTERVAL_MS = 1500;

/**
 * Send a new message or edit an existing one (upsert pattern).
 * @param {import('../commands').BotContext} ctx
 * @param {number} chatId
 * @param {number|null} msgId - Existing message ID, or null to send new
 * @param {string} text
 * @param {object} [log]
 * @returns {Promise<number>} The message ID (new or existing)
 */
async function upsertMessage(bot, chatId, msgId, text, log) {
  if (!msgId) {
    const sent = await bot.sendMessage(chatId, text);
    return sent.message_id;
  }
  await editMessage(bot, chatId, msgId, text, log);
  return msgId;
}

/**
 * Run the agent pipeline for @agent messages and send the result to Telegram.
 * Creates a socket adapter so the existing AgentHandler/AIbitat system works
 * without a real WebSocket connection.
 * @param {import("../commands").BotContext} ctx
 * @param {number} chatId
 * @param {import('@prisma/client').workspaces} workspace
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

  if (!invocation)
    return await ctx.bot.sendMessage(
      chatId,
      "Failed to start agent. Try sending your message without @agent."
    );

  let finalResponse = "";
  const thoughts = [];
  const charts = [];
  const files = [];
  let thoughtMsgId = null;
  let lastThoughtText = "";

  // Streaming response state (similar to stream.js createStreamHandler)
  let streamingText = "";
  let responseMsgId = null;
  let responsePending = null;
  let lastEditTime = 0;
  let editTimer = null;
  let msgOffset = 0;

  const currentResponseText = () => streamingText.slice(msgOffset);
  const handleStreamChunk = (chunk) => {
    streamingText += chunk;

    // Handle message splitting when content exceeds Telegram's limit
    if (responseMsgId !== null && currentResponseText().length > MAX_MSG_LEN) {
      clearTimeout(editTimer);
      editTimer = null;
      editMessage(
        ctx.bot,
        chatId,
        responseMsgId,
        streamingText.slice(msgOffset, msgOffset + MAX_MSG_LEN),
        ctx.log,
        { format: true }
      ).catch(() => {});
      msgOffset += MAX_MSG_LEN;
      responseMsgId = null;
      responsePending = null;
    }

    // Send initial message if none exists yet
    if (responseMsgId === null && !responsePending) {
      responsePending = ctx.bot
        .sendMessage(chatId, currentResponseText() + " \u258d")
        .then((sent) => {
          responseMsgId = sent.message_id;
          lastEditTime = Date.now();
        })
        .catch(() => {
          responsePending = null;
        });
      return;
    }

    if (!responseMsgId) return;

    // Throttled message updates
    const now = Date.now();
    if (now - lastEditTime >= STREAM_EDIT_INTERVAL) {
      clearTimeout(editTimer);
      lastEditTime = now;
      editMessage(
        ctx.bot,
        chatId,
        responseMsgId,
        currentResponseText() + " \u258d",
        ctx.log
      ).catch(() => {});
    } else if (!editTimer) {
      editTimer = setTimeout(() => {
        lastEditTime = Date.now();
        editMessage(
          ctx.bot,
          chatId,
          responseMsgId,
          currentResponseText() + " \u258d",
          ctx.log
        ).catch(() => {});
        editTimer = null;
      }, STREAM_EDIT_INTERVAL);
    }
  };

  const socket = {
    send(data) {
      const parsed = safeJsonParse(data, null);
      if (!parsed) return;

      switch (parsed.type) {
        case "statusResponse":
          if (parsed.content) thoughts.push(parsed.content);
          return;
        case "rechartVisualize":
          if (parsed.content) charts.push(parsed.content);
          return;
        case "fileDownload":
          if (parsed.content) files.push(parsed.content);
          return;
        case "reportStreamEvent":
          const inner = parsed.content;
          if (!inner) return;
          // Handle streaming text chunks for snappy response updates
          if (inner.type === "textResponseChunk" && inner.content) {
            handleStreamChunk(inner.content);
            return;
          }
          if (inner.type === "fullTextResponse" && inner.content) {
            finalResponse = inner.content;
          }
          return;
        default:
          if (!parsed.from || parsed.from === "USER" || !parsed.content) return;
          finalResponse = parsed.content;
          break;
      }
    },
    close() {},
  };

  // Periodically flush thoughts as a single live-updating message
  let flushing = false;
  let thoughtFlushTimeout = null;

  const flushThoughts = async () => {
    if (flushing || thoughts.length === 0) {
      thoughtFlushTimeout = setTimeout(
        flushThoughts,
        THOUGHT_FLUSH_INTERVAL_MS
      );
      return;
    }
    const text = thoughts.map((t) => `⏳ ${t}`).join("\n");
    if (text === lastThoughtText) {
      thoughtFlushTimeout = setTimeout(
        flushThoughts,
        THOUGHT_FLUSH_INTERVAL_MS
      );
      return;
    }
    lastThoughtText = text;
    flushing = true;
    try {
      thoughtMsgId = await upsertMessage(
        ctx.bot,
        chatId,
        thoughtMsgId,
        text,
        ctx.log
      );
    } catch (err) {
      ctx.log?.error?.("Failed to update thought message:", err);
    } finally {
      flushing = false;
      thoughtFlushTimeout = setTimeout(
        flushThoughts,
        THOUGHT_FLUSH_INTERVAL_MS
      );
    }
  };

  thoughtFlushTimeout = setTimeout(flushThoughts, THOUGHT_FLUSH_INTERVAL_MS);

  const typingInterval = setInterval(() => {
    ctx.bot.sendChatAction(chatId, "typing").catch(() => {});
  }, 4000);

  try {
    const agentHandler = await new AgentHandler({
      uuid: invocation.uuid,
    }).init();
    await agentHandler.createAIbitat({ socket });

    // Telegram can't provide interactive feedback, so configure the agent to:
    // 1. Always interrupt after generating a response (triggers askForFeedback)
    // 2. Return "exit" on feedback request, which terminates the conversation
    // This prevents the agent from looping through multiple rounds.
    agentHandler.aibitat.defaultInterrupt = "ALWAYS";
    agentHandler.aibitat.maxRounds = 2;

    agentHandler.aibitat.askForFeedback = () => Promise.resolve("exit");
    agentHandler.aibitat.onError((_error, chat) => {
      if (!finalResponse && chat?.content) finalResponse = chat.content;
    });
    await agentHandler.startAgentCluster();
  } finally {
    clearInterval(typingInterval);
    clearTimeout(thoughtFlushTimeout);
    clearTimeout(editTimer);

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

  // Ensure the initial sendMessage has resolved before deciding how to deliver
  if (responsePending) await responsePending;

  if (finalResponse) {
    if (responseMsgId) {
      // Streaming message exists — replace it with the final formatted response
      await editMessage(
        ctx.bot,
        chatId,
        responseMsgId,
        finalResponse,
        ctx.log,
        {
          format: true,
        }
      ).catch(() => {});
    } else {
      await sendFormattedMessage(ctx.bot, chatId, finalResponse);
    }
  }
}

/**
 * Render a chart to a PNG buffer using chartjs-node-canvas.
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

module.exports = { handleAgentResponse };
