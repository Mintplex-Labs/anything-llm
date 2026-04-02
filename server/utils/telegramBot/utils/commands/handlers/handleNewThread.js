const { Workspace } = require("../../../../../models/workspace");
const { WorkspaceThread } = require("../../../../../models/workspaceThread");

/**
 * /new - Creates a new thread in the current workspace.
 * @param {import("../index").BotContext} ctx
 * @param {number} chatId
 */
async function handleNewThread(ctx, chatId) {
  const state = ctx.getState(chatId);
  const workspace = await Workspace.get({ slug: state.workspaceSlug });
  if (!workspace) {
    await ctx.bot.sendMessage(chatId, "No workspace configured.");
    return;
  }

  const { thread, message: error } = await WorkspaceThread.new(
    workspace,
    null,
    { name: "Telegram Thread" }
  );

  if (error || !thread) {
    await ctx.bot.sendMessage(chatId, "Failed to create thread.");
    return;
  }

  ctx.setState(chatId, { threadSlug: thread.slug });
  await ctx.bot.sendMessage(
    chatId,
    `New thread created in "${workspace.name}". Your messages will now go here.`
  );
}

module.exports = { handleNewThread };
