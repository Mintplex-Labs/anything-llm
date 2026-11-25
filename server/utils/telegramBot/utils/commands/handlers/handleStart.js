const { Workspace } = require("../../../../../models/workspace");

/**
 * /start - Welcome message with current workspace info.
 * @param {import("../index").BotContext} ctx
 * @param {number} chatId
 */
async function handleStart(ctx, chatId) {
  const state = ctx.getState(chatId);
  const workspace = await Workspace.get({ slug: state.workspaceSlug });
  const name = workspace?.name || state.workspaceSlug;

  await ctx.bot.sendMessage(
    chatId,
    `Welcome to AnythingLLM!\n\nYour messages go to the "${name}" workspace. Use /switch to change workspaces or threads, and /help to see all commands.`
  );
}

module.exports = { handleStart };
