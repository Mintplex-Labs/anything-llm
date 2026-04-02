// Suppress deprecated content-type warning when sending files via the Telegram bot API.
// https://github.com/yagop/node-telegram-bot-api/blob/master/doc/usage.md#file-options-metadata
process.env.NTBA_FIX_350 = 1;
const TelegramBot = require("node-telegram-bot-api");
const { log, conclude } = require("./helpers/index.js");
const { Workspace } = require("../models/workspace");
const { WorkspaceThread } = require("../models/workspaceThread");
const { streamResponse } = require("../utils/telegramBot/chat/stream");

process.on("message", async (payload) => {
  // Ignore tool approval responses - these are handled by http-socket plugin
  if (payload?.type === "toolApprovalResponse") return;

  const {
    botToken,
    chatId,
    workspaceSlug,
    threadSlug,
    message,
    attachments = [],
    voiceResponse = false,
  } = payload;

  try {
    const bot = new TelegramBot(botToken, { polling: false });
    const ctx = {
      bot,
      log: (text, ...args) =>
        log(args.length ? `${text} ${args.join(" ")}` : text),
    };

    const workspace = await Workspace.get({ slug: workspaceSlug });
    if (!workspace) {
      await bot.sendMessage(
        chatId,
        "No workspace configured. Use /switch to select one."
      );
      conclude();
      return;
    }

    const thread = threadSlug
      ? await WorkspaceThread.get({ slug: threadSlug })
      : null;

    await streamResponse({
      ctx,
      chatId,
      workspace,
      thread,
      message,
      attachments,
      voiceResponse,
    });
  } catch (error) {
    log(`Telegram chat error: ${error.message}`);
    try {
      const bot = new TelegramBot(botToken, { polling: false });
      await bot.sendMessage(
        chatId,
        "Sorry, something went wrong. Please try again."
      );
    } catch {}
  } finally {
    conclude();
  }
});
