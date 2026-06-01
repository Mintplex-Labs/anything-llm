/**
 * /help - Show all available commands.
 * @param {import("../index").BotContext} ctx
 * @param {number} chatId
 */
async function handleHelp(ctx, chatId) {
  const { BOT_COMMANDS } = require("../index");
  const lines = BOT_COMMANDS.map((c) => `/${c.command} - ${c.description}`);
  await ctx.bot.sendMessage(
    chatId,
    `Available commands:\n\n${lines.join("\n")}`
  );
}

module.exports = { handleHelp };
