const {
  SlashCommandPresets,
} = require("../../../../../models/slashCommandsPresets");

/**
 * /help - Show all available commands, followed by the slash command presets
 * when any are saved. The bot only runs in single-user mode, so the presets
 * are the ones saved without a user.
 * @param {import("../index").BotContext} ctx
 * @param {number} chatId
 */
async function handleHelp(ctx, chatId) {
  const { BOT_COMMANDS } = require("../index");
  const lines = BOT_COMMANDS.map((c) => `/${c.command} - ${c.description}`);
  let text = `Available commands:\n\n${lines.join("\n")}`;

  const presets = await SlashCommandPresets.getUserPresets(null);
  if (presets.length > 0) {
    const presetLines = presets.map((p) =>
      p.description ? `${p.command} - ${p.description}` : p.command
    );
    text += `\n\nSlash commands:\n\n${presetLines.join("\n")}`;
  }

  await ctx.bot.sendMessage(chatId, text);
}

module.exports = { handleHelp };
