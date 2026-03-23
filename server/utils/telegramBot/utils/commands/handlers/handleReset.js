const { Workspace } = require("../../../../../models/workspace");
const { WorkspaceThread } = require("../../../../../models/workspaceThread");
const { WorkspaceChats } = require("../../../../../models/workspaceChats");

/**
 * /reset - Clears LLM chat history context.
 * @param {import("../index").BotContext} ctx
 * @param {number} chatId
 */
async function handleReset(ctx, chatId) {
  const state = ctx.getState(chatId);
  const workspace = await Workspace.get({ slug: state.workspaceSlug });
  if (!workspace) return;

  const thread = state.threadSlug
    ? await WorkspaceThread.get({ slug: state.threadSlug })
    : null;

  await WorkspaceChats.markThreadHistoryInvalidV2({
    workspaceId: workspace.id,
    user_id: null,
    thread_id: thread?.id || null,
    api_session_id: null,
  });

  await ctx.bot.sendMessage(
    chatId,
    "Chat history has been cleared for the LLM. Previous messages still appear above but won't be used as context."
  );
}

module.exports = { handleReset };
