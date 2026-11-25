const { showSourcesMenu } = require("../../commands/handlers/handleProof");

/**
 * Handle back to sources - returns to the sources menu.
 * @param {object} params
 * @param {import("../../commands/index").BotContext} params.ctx
 * @param {number} params.chatId
 * @param {{id: string}} params.query
 * @param {number} params.messageId
 */
async function handleBackSources({ ctx, chatId, query, messageId } = {}) {
  await showSourcesMenu(ctx, chatId, 0, messageId);
  await ctx.bot.answerCallbackQuery(query.id);
}

module.exports = { handleBackSources };
