const { showThreadMenu } = require("../../commands/handlers/showThreadMenu");

/**
 * Handle thread menu pagination.
 * @param {object} params
 * @param {import("../../commands/index").BotContext} params.ctx
 * @param {number} params.chatId
 * @param {{id: string}} params.query
 * @param {number} params.messageId
 * @param {string} params.data
 */
async function handleThreadPagination({
  ctx,
  chatId,
  query,
  messageId,
  data,
} = {}) {
  const parts = data.slice(5).split(":");
  const workspaceId = parseInt(parts[0], 10);
  const page = parseInt(parts[1], 10);
  await showThreadMenu(ctx, chatId, workspaceId, page, messageId);
  await ctx.bot.answerCallbackQuery(query.id);
}

module.exports = { handleThreadPagination };
