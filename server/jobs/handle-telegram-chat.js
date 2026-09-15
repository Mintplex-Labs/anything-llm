// Telegram presentation stays in this adapter; the shared pipeline owns inference.
process.env.NTBA_FIX_350 = 1;
const TelegramBot = require("node-telegram-bot-api");
const { createStreamHandler } = require("../utils/telegramBot/chat/stream");
const {
  createThoughtHandler,
  sendFilesAsTelegramDocuments,
  renderChartToBuffer,
} = require("../utils/telegramBot/chat/agent");
const { sendFormattedMessage } = require("../utils/telegramBot/utils");
const { sendVoiceResponse } = require("../utils/telegramBot/utils/media");
const {
  runExternalChannelChat,
  createApprovalRequester,
} = require("./handle-external-channel-chat");

function createTelegramTransport(
  ctx,
  chatId,
  { voiceResponse = false, requestToolApproval } = {}
) {
  const stream = createStreamHandler({ ctx, chatId });
  let thoughts = null,
    typing = null,
    streamed = false;
  const files = [],
    charts = [];
  const dispose = () => {
    clearInterval(typing);
    stream.dispose();
    thoughts?.dispose();
  };
  return {
    async start() {
      await ctx.bot.sendChatAction(chatId, "typing");
      typing = setInterval(
        () => ctx.bot.sendChatAction(chatId, "typing").catch(() => {}),
        4000
      );
    },
    async append(text) {
      streamed = true;
      stream.responseHandler.write(
        `data: ${JSON.stringify({ textResponse: text })}\n\n`
      );
    },
    async status(text) {
      thoughts ||= createThoughtHandler(ctx, chatId);
      thoughts.append(text);
    },
    async artifact(file) {
      (file.kind === "chart" ? charts : files).push(file);
    },
    async complete(result) {
      try {
        await thoughts?.complete();
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
        if (streamed) await stream.flushEdit(true, result.text);
        else if (result.text)
          await sendFormattedMessage(ctx.bot, chatId, result.text);
        if (voiceResponse && result.text)
          await sendVoiceResponse(ctx.bot, chatId, result.text);
        if (files.length)
          await sendFilesAsTelegramDocuments(ctx, chatId, files);
      } finally {
        dispose();
      }
    },
    async fail(message) {
      dispose();
      await ctx.bot.sendMessage(chatId, message);
    },
    async requestToolApproval(request) {
      if (requestToolApproval) return requestToolApproval(request);
      return {
        approved: false,
        message:
          "Tool approval is not available in this context. Operation denied.",
      };
    },
    dispose,
  };
}

if (require.main === module) {
  const { log, conclude } = require("./helpers");
  const { parentPort } = require("node:worker_threads");
  const { EVENT_METHODS } = require("../utils/externalChannels/chat");
  const send = (event) =>
    parentPort ? parentPort.postMessage(event) : process.send(event);
  let started = false;
  process.on("message", async (payload) => {
    if (started || payload?.type === "toolApprovalResponse") return;
    started = true;
    const { botToken, chatId, voiceResponse = false } = payload;
    const ctx = {
      bot: new TelegramBot(botToken, { polling: false }),
      log: (text, ...args) =>
        log(args.length ? `${text} ${args.join(" ")}` : text),
    };
    const relayApproval = createApprovalRequester((event) =>
      send({ ...event, chatId })
    );
    const transport = createTelegramTransport(ctx, chatId, {
      voiceResponse,
      requestToolApproval: relayApproval,
    });
    let deliveries = Promise.resolve();
    const emit = (event) => {
      if (event.type === "closeInvocation") {
        send(event);
        return;
      }
      const method = EVENT_METHODS[event.type];
      if (!method) return;
      deliveries = deliveries.then(() =>
        transport[method](
          event.text ?? event.file ?? event.result ?? event.message
        )
      );
      return deliveries;
    };
    try {
      await runExternalChannelChat(
        { ...payload, conversationId: `telegram:${chatId}` },
        emit,
        {
          requestToolApproval: (request) =>
            transport.requestToolApproval(request),
        }
      );
      await deliveries;
    } catch (error) {
      log(`Telegram chat error: ${error.message}`);
      try {
        await transport.fail("Sorry, something went wrong. Please try again.");
      } catch {}
    } finally {
      transport.dispose();
      conclude();
    }
  });
}

module.exports = { createTelegramTransport };
