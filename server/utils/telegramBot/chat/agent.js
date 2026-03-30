const { v4: uuidv4 } = require("uuid");
const { EphemeralAgentHandler } = require("../../agents/ephemeral");
const { WorkspaceChats } = require("../../../models/workspaceChats");
const { safeJsonParse } = require("../../http");
const {
  editMessage,
  sendFormattedMessage,
  upsertMessage,
} = require("../utils");
const { escapeHTML } = require("../utils/format");
const { sendVoiceResponse } = require("../utils/media");
const {
  STREAM_EDIT_INTERVAL,
  MAX_MSG_LEN,
  CURSOR_CHAR,
} = require("../constants");

const THOUGHT_FLUSH_INTERVAL_MS = 1500;

/**
 * Run the agent pipeline for @agent messages and send the result to Telegram.
 * Uses EphemeralAgentHandler to avoid creating a DB invocation record per call.
 * @param {import("../commands").BotContext} ctx
 * @param {number} chatId
 * @param {import('@prisma/client').workspaces} workspace
 * @param {object|null} thread
 * @param {string} message
 * @param {boolean} voiceResponse - Whether to send the response as voice audio
 * @param {Array<{name: string, mime: string, contentString: string}>} attachments - Image/file attachments for multimodal support
 */
async function handleAgentResponse(
  ctx,
  chatId,
  workspace,
  thread,
  message,
  voiceResponse = false,
  attachments = []
) {
  let finalResponse = "";
  let metrics = {};
  const sources = [];
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
        .sendMessage(chatId, currentResponseText() + CURSOR_CHAR)
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
        currentResponseText() + CURSOR_CHAR,
        ctx.log
      ).catch(() => {});
    } else if (!editTimer) {
      editTimer = setTimeout(() => {
        lastEditTime = Date.now();
        editMessage(
          ctx.bot,
          chatId,
          responseMsgId,
          currentResponseText() + CURSOR_CHAR,
          ctx.log
        ).catch(() => {});
        editTimer = null;
      }, STREAM_EDIT_INTERVAL);
    }
  };

  const handler = {
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
          if (inner.type === "textResponseChunk" && inner.content) {
            handleStreamChunk(inner.content);
            return;
          }
          if (inner.type === "fullTextResponse" && inner.content) {
            finalResponse = inner.content;
            return;
          }
          if (inner.type === "usageMetrics" && inner.metrics) {
            metrics = inner.metrics;
            return;
          }
          if (inner.type === "citations" && inner.citations) {
            sources.push(...inner.citations);
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

  const formatThoughtsAsBlockquote = (thoughtList, done = false) => {
    const header = done
      ? "✓ <b>Agent completed:</b>"
      : "🤔 <b>Agent is thinking:</b>";
    const icon = done ? "✓" : "⏳";
    const content = thoughtList
      .map((t) => `${icon} ${escapeHTML(t)}`)
      .join("\n");
    const fullContent = `${header}\n${content}`;
    const tag =
      fullContent.length > 200 ? "blockquote expandable" : "blockquote";
    return `<${tag}>${fullContent}</${tag.split(" ")[0]}>`;
  };

  const flushThoughts = async () => {
    if (flushing || thoughts.length === 0) {
      thoughtFlushTimeout = setTimeout(
        flushThoughts,
        THOUGHT_FLUSH_INTERVAL_MS
      );
      return;
    }
    const text = formatThoughtsAsBlockquote(thoughts, false);
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
        ctx.log,
        { html: true, disableLinkPreview: true }
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
    const agentHandler = await new EphemeralAgentHandler({
      uuid: uuidv4(),
      workspace,
      prompt: message,
      userId: null,
      threadId: thread?.id || null,
      attachments,
    }).init();
    await agentHandler.createAIbitat({ handler, telegramChatId: chatId });

    // httpSocket terminates after the first agent message, but cap rounds
    // as a safety net so the agent can't loop indefinitely.
    agentHandler.aibitat.maxRounds = 2;

    await agentHandler.startAgentCluster();
  } finally {
    clearInterval(typingInterval);
    clearTimeout(thoughtFlushTimeout);
    clearTimeout(editTimer);
  }

  // Final thought update, mark as completed
  if (thoughtMsgId && thoughts.length > 0) {
    const doneText = formatThoughtsAsBlockquote(thoughts, true);
    await editMessage(ctx.bot, chatId, thoughtMsgId, doneText, ctx.log, {
      html: true,
      disableLinkPreview: true,
    });
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

  // Fall back to the accumulated streamed text when no explicit
  // fullTextResponse event was received (e.g. audio/voice messages).
  const responseText = finalResponse || streamingText;

  if (responseText) {
    await WorkspaceChats.new({
      workspaceId: workspace.id,
      prompt: message,
      response: {
        text: responseText,
        sources,
        type: "chat",
        metrics,
        attachments,
      },
      threadId: thread?.id || null,
    });

    // Always deliver text response first
    if (responseMsgId) {
      await editMessage(
        ctx.bot,
        chatId,
        responseMsgId,
        finalResponse || currentResponseText(),
        ctx.log,
        {
          format: true,
        }
      ).catch(() => {});
    } else {
      await sendFormattedMessage(ctx.bot, chatId, responseText);
    }

    // Send voice as an additional attachment if requested
    if (voiceResponse) {
      ctx.log?.info?.(`Generating voice response for ${chatId}`);
      await sendVoiceResponse(ctx.bot, chatId, responseText);
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
