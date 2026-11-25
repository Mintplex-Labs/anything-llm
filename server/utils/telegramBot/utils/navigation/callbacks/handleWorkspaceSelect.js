const { showThreadMenu } = require("../../commands/handlers/showThreadMenu");

/**
 * Handle workspace selection - shows thread menu for selected workspace.
 * @param {object} params
 * @param {import("../../commands/index").BotContext} params.ctx
 * @param {number} params.chatId
 * @param {{id: string}} params.query
 * @param {number} params.messageId
 * @param {string} params.data
 */
async function handleWorkspaceSelect({
  ctx,
  chatId,
  query,
  messageId,
  data,
} = {}) {
  const workspaceId = parseInt(data.slice(3), 10);
  await showThreadMenu(ctx, chatId, workspaceId, 0, messageId);
  await ctx.bot.answerCallbackQuery(query.id);
}

module.exports = { handleWorkspaceSelect };
