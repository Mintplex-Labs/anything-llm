const {
  showWorkspaceMenu,
} = require("../../commands/handlers/showWorkspaceMenu");

/**
 * Handle workspace menu pagination.
 * @param {object} params
 * @param {import("../../commands/index").BotContext} params.ctx
 * @param {number} params.chatId
 * @param {{id: string}} params.query
 * @param {number} params.messageId
 * @param {string} params.data
 */
async function handleWorkspacePagination({
  ctx,
  chatId,
  query,
  messageId,
  data,
} = {}) {
  const page = parseInt(data.slice(5), 10);
  await showWorkspaceMenu(ctx, chatId, page, messageId);
  await ctx.bot.answerCallbackQuery(query.id);
}

module.exports = { handleWorkspacePagination };
