/**
 * /abort - Kill any ongoing LLM worker for this chat.
 * @param {import("../index").BotContext} ctx
 * @param {number} chatId
 */
async function handleAbort(ctx, chatId) {
  const { TelegramBotService } = require("../../../index");
  const service = new TelegramBotService();
  const aborted = service.abortChat(chatId);

  if (aborted) await ctx.bot.sendMessage(chatId, "Response aborted by user.");
  else await ctx.bot.sendMessage(chatId, "No active response to abort.");
}

module.exports = { handleAbort };
