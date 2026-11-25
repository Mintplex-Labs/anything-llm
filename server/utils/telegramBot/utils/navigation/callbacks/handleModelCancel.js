/**
 * Handle model selection cancellation.
 * @param {object} params
 * @param {import("../../commands/index").BotContext} params.ctx
 * @param {number} params.chatId
 * @param {{id: string}} params.query
 * @param {number} params.messageId
 */
async function handleModelCancel({ ctx, chatId, query, messageId } = {}) {
  await ctx.bot.deleteMessage(chatId, messageId);
  await ctx.bot.answerCallbackQuery(query.id, { text: "Cancelled" });
}

module.exports = { handleModelCancel };
