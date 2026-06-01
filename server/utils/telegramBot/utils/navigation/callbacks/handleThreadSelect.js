const { Workspace } = require("../../../../../models/workspace");
const { WorkspaceThread } = require("../../../../../models/workspaceThread");

/**
 * Handle thread selection - sets active workspace and thread.
 * @param {object} params
 * @param {import("../../commands/index").BotContext} params.ctx
 * @param {number} params.chatId
 * @param {{id: string}} params.query
 * @param {string} params.data
 */
async function handleThreadSelect({ ctx, chatId, query, data } = {}) {
  const parts = data.slice(3).split(":");
  const workspaceId = parseInt(parts[0], 10);
  const threadId = parseInt(parts[1], 10);

  const workspace = await Workspace.get({ id: workspaceId });
  if (!workspace) {
    await ctx.bot.answerCallbackQuery(query.id, {
      text: "Workspace not found.",
    });
    return;
  }

  let threadSlug = null;
  let threadName = "Default";
  if (threadId !== 0) {
    const thread = await WorkspaceThread.get({ id: threadId });
    if (thread) {
      threadSlug = thread.slug;
      threadName = thread.name;
    }
  }

  ctx.setState(chatId, { workspaceSlug: workspace.slug, threadSlug });
  await ctx.bot.answerCallbackQuery(query.id, { text: "Switched!" });
  await ctx.bot.sendMessage(
    chatId,
    `Switched to "${workspace.name}" → ${threadName}`
  );
}

module.exports = { handleThreadSelect };
