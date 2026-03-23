const {
  showWorkspaceMenu,
} = require("../../commands/handlers/showWorkspaceMenu");

/**
 * Handle back navigation to workspace menu.
 * @param {object} params
 * @param {import("../../commands/index").BotContext} params.ctx
 * @param {number} params.chatId
 * @param {{id: string}} params.query
 * @param {number} params.messageId
 */
async function handleBackWorkspaces({ ctx, chatId, query, messageId } = {}) {
  await showWorkspaceMenu(ctx, chatId, 0, messageId);
  await ctx.bot.answerCallbackQuery(query.id);
}

module.exports = { handleBackWorkspaces };
