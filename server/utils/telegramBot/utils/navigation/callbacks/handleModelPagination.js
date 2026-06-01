const { showModelMenu } = require("../../commands/handlers/showModelMenu");

/**
 * Handle model menu pagination.
 * @param {object} params
 * @param {import("../../commands/index").BotContext} params.ctx
 * @param {number} params.chatId
 * @param {{id: string}} params.query
 * @param {number} params.messageId
 * @param {string} params.data
 */
async function handleModelPagination({
  ctx,
  chatId,
  query,
  messageId,
  data,
} = {}) {
  const page = parseInt(data.slice(6), 10);
  await showModelMenu(ctx, chatId, page, messageId);
  await ctx.bot.answerCallbackQuery(query.id);
}

module.exports = { handleModelPagination };
