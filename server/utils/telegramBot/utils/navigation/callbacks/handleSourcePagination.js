const { showSourcesMenu } = require("../../commands/handlers/handleProof");

/**
 * Handle source pagination - navigates between source pages.
 * @param {object} params
 * @param {import("../../commands/index").BotContext} params.ctx
 * @param {number} params.chatId
 * @param {{id: string}} params.query
 * @param {number} params.messageId
 * @param {string} params.data
 */
async function handleSourcePagination({
  ctx,
  chatId,
  query,
  messageId,
  data,
} = {}) {
  const page = parseInt(data.slice(6), 10);
  await showSourcesMenu(ctx, chatId, page, messageId);
  await ctx.bot.answerCallbackQuery(query.id);
}

module.exports = { handleSourcePagination };
