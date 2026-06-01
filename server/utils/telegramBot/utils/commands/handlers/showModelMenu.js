const { Workspace } = require("../../../../../models/workspace");
const { resolveWorkspaceProvider } = require("../../index");
const {
  getCustomModels,
  SUPPORT_CUSTOM_MODELS,
} = require("../../../../helpers/customModels");
const MODELS_PER_PAGE = 8;

/**
 * Show the model selection inline keyboard with pagination.
 * @param {import("../index").BotContext} ctx
 * @param {number} chatId
 * @param {number} page - Current page (0-indexed)
 * @param {number|null} messageId - If provided, edits existing message instead of sending new one
 */
async function showModelMenu(ctx, chatId, page = 0, messageId = null) {
  const pageNum = typeof page === "number" && !isNaN(page) ? page : 0;
  const state = ctx.getState(chatId);
  const workspace = await Workspace.get({ slug: state.workspaceSlug });
  if (!workspace) {
    await ctx.bot.sendMessage(
      chatId,
      "No workspace configured. Use /switch to select a workspace."
    );
    return;
  }

  const { provider, model: currentModel } = resolveWorkspaceProvider(workspace);
  if (!SUPPORT_CUSTOM_MODELS.includes(provider)) {
    await ctx.bot.sendMessage(
      chatId,
      `The "${provider}" provider does not support model selection via API.`
    );
    return;
  }

  const { models, error } = await getCustomModels(provider);
  if (error || !models?.length) {
    await ctx.bot.sendMessage(
      chatId,
      error || `No models available for "${provider}".`
    );
    return;
  }

  const sortedModels = [...models].sort((a, b) => {
    const aId = a.id || a.name;
    const bId = b.id || b.name;
    const aIsActive = aId === currentModel;
    const bIsActive = bId === currentModel;
    if (aIsActive && !bIsActive) return -1;
    if (!aIsActive && bIsActive) return 1;
    return 0;
  });

  const totalPages = Math.ceil(sortedModels.length / MODELS_PER_PAGE);
  const safePage = Math.max(0, Math.min(pageNum, totalPages - 1));
  const startIdx = safePage * MODELS_PER_PAGE;
  const pageModels = sortedModels.slice(startIdx, startIdx + MODELS_PER_PAGE);

  const buttons = pageModels.map((m) => {
    const modelId = m.id || m.name;
    const displayName = m.name || m.id;
    const isActive = modelId === currentModel;
    return [
      {
        text: isActive ? `🟢 ${displayName} (active)` : displayName,
        callback_data: `mdl:${workspace.id}:${modelId.slice(0, 40)}`,
      },
    ];
  });

  const navRow = [];
  if (safePage > 0) {
    navRow.push({ text: "← Prev", callback_data: `mdlpg:${safePage - 1}` });
  }
  if (safePage < totalPages - 1) {
    navRow.push({ text: "Next →", callback_data: `mdlpg:${safePage + 1}` });
  }
  if (navRow.length) buttons.push(navRow);

  buttons.push([{ text: "✕ Cancel", callback_data: "mdl:cancel" }]);

  const text = `"${workspace.name}" — Select a model (${safePage + 1}/${totalPages}, ${sortedModels.length} total):`;
  const opts = { reply_markup: { inline_keyboard: buttons } };

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

module.exports = { showModelMenu };
