const { Workspace } = require("../../../../../models/workspace");
const { WorkspaceChats } = require("../../../../../models/workspaceChats");
const { WorkspaceThread } = require("../../../../../models/workspaceThread");
const THREADS_PER_PAGE = 8;

/**
 * Show the thread selection inline keyboard for a workspace with pagination.
 * @param {import("../index").BotContext} ctx
 * @param {number} chatId
 * @param {number} workspaceId - must be ID, not slug due to 64-byte limit on callback data
 * @param {number} page - Current page (0-indexed)
 * @param {number|null} messageId
 */
async function showThreadMenu(
  ctx,
  chatId,
  workspaceId,
  page = 0,
  messageId = null
) {
  const pageNum = typeof page === "number" && !isNaN(page) ? page : 0;
  const workspace = await Workspace.get({ id: workspaceId });
  if (!workspace) return;

  const threads = await WorkspaceThread.where({
    workspace_id: workspace.id,
  });

  const state = ctx.getState(chatId);

  const allItems = [];

  const defaultThreadChatCount = await WorkspaceChats.count({
    workspaceId: workspace.id,
    thread_id: null,
  });
  const isDefaultActive = !state.threadSlug;
  let defaultThreadText = isDefaultActive ? "🟢 Default (active)" : "Default";
  if (defaultThreadChatCount > 0)
    defaultThreadText += ` - ${defaultThreadChatCount} chats`;

  allItems.push({
    text: defaultThreadText,
    callback_data: `th:${workspace.id}:0`,
    isActive: isDefaultActive,
  });

  for (const thread of threads) {
    const threadChatCount = await WorkspaceChats.count({
      workspaceId: workspace.id,
      thread_id: thread.id,
    });

    const isCurrent = thread.slug === state.threadSlug;
    let threadText = isCurrent ? `🟢 ${thread.name} (active)` : thread.name;
    if (threadChatCount > 0) threadText += ` - ${threadChatCount} chats`;
    allItems.push({
      text: threadText,
      callback_data: `th:${workspace.id}:${thread.id}`,
      isActive: isCurrent,
    });
  }

  allItems.sort((a, b) => {
    if (a.isActive && !b.isActive) return -1;
    if (!a.isActive && b.isActive) return 1;
    return 0;
  });

  const totalPages = Math.ceil(allItems.length / THREADS_PER_PAGE);
  const safePage = Math.max(0, Math.min(pageNum, totalPages - 1));
  const startIdx = safePage * THREADS_PER_PAGE;
  const pageItems = allItems.slice(startIdx, startIdx + THREADS_PER_PAGE);

  const buttons = pageItems.map((item) => [
    { text: item.text, callback_data: item.callback_data },
  ]);

  const navRow = [];
  if (safePage > 0) {
    navRow.push({
      text: "← Prev",
      callback_data: `thpg:${workspaceId}:${safePage - 1}`,
    });
  }
  if (safePage < totalPages - 1) {
    navRow.push({
      text: "Next →",
      callback_data: `thpg:${workspaceId}:${safePage + 1}`,
    });
  }
  if (navRow.length) buttons.push(navRow);

  buttons.push([
    {
      text: "← Back to workspaces",
      callback_data: "back:workspaces",
    },
  ]);

  const text =
    totalPages > 1
      ? `"${workspace.name}" — Select a thread (${safePage + 1}/${totalPages}, ${allItems.length} total):`
      : `"${workspace.name}" — Select a thread:`;
  const opts = {
    reply_markup: { inline_keyboard: buttons },
  };

  if (messageId) {
    await ctx.bot.editMessageText(text, {
      chat_id: chatId,
      message_id: messageId,
      ...opts,
    });
  } else {
    await ctx.bot.sendMessage(chatId, text, opts);
  }
}

module.exports = { showThreadMenu };
