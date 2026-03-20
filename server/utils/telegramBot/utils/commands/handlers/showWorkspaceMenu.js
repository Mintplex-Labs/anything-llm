const { Workspace } = require("../../../../../models/workspace");
const WORKSPACES_PER_PAGE = 8;

/**
 * Show the workspace selection inline keyboard with pagination.
 * @param {import("../index").BotContext} ctx
 * @param {number} chatId
 * @param {number} page - Current page (0-indexed)
 * @param {number|null} messageId - If provided, edits existing message instead of sending new one
 */
async function showWorkspaceMenu(ctx, chatId, page = 0, messageId = null) {
  const pageNum = typeof page === "number" && !isNaN(page) ? page : 0;
  const workspaces = await Workspace.where({});
  if (!workspaces.length) {
    await ctx.bot.sendMessage(
      chatId,
      "No workspaces found. Create one to get started!",
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "➕ Create Workspace", callback_data: "ws-create" }],
          ],
        },
      }
    );
    return;
  }

  const state = ctx.getState(chatId);
  const sortedWorkspaces = [...workspaces].sort((a, b) => {
    const aIsActive = a.slug === state.workspaceSlug;
    const bIsActive = b.slug === state.workspaceSlug;
    if (aIsActive && !bIsActive) return -1;
    if (!aIsActive && bIsActive) return 1;
    return 0;
  });

  const totalPages = Math.ceil(sortedWorkspaces.length / WORKSPACES_PER_PAGE);
  const safePage = Math.max(0, Math.min(pageNum, totalPages - 1));
  const startIdx = safePage * WORKSPACES_PER_PAGE;
  const pageWorkspaces = sortedWorkspaces.slice(
    startIdx,
    startIdx + WORKSPACES_PER_PAGE
  );

  const buttons = pageWorkspaces.map((ws) => {
    const isCurrent = ws.slug === state.workspaceSlug;
    return [
      {
        text: isCurrent ? `🟢 ${ws.name} (active)` : ws.name,
        callback_data: `ws:${ws.id}`,
      },
    ];
  });

  const navRow = [];
  if (safePage > 0) {
    navRow.push({ text: "← Prev", callback_data: `wspg:${safePage - 1}` });
  }
  if (safePage < totalPages - 1) {
    navRow.push({ text: "Next →", callback_data: `wspg:${safePage + 1}` });
  }
  if (navRow.length) buttons.push(navRow);

  const text =
    totalPages > 1
      ? `Select a workspace (${safePage + 1}/${totalPages}, ${sortedWorkspaces.length} total):`
      : "Select a workspace:";
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

module.exports = { showWorkspaceMenu };
