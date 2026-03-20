const { Workspace } = require("../../../models/workspace");
const { WorkspaceChats } = require("../../../models/workspaceChats");
const { WorkspaceThread } = require("../../../models/workspaceThread");
const { isVerified } = require("./verification");
const {
  getCustomModels,
  SUPPORT_CUSTOM_MODELS,
} = require("../../helpers/customModels");
const { resolveWorkspaceProvider } = require("./index");
const {
  WORKSPACES_PER_PAGE,
  THREADS_PER_PAGE,
  MODELS_PER_PAGE,
} = require("../constants");

/**
 * Show the workspace selection inline keyboard with pagination.
 * @param {BotContext} ctx
 * @param {number} chatId
 * @param {number} page - Current page (0-indexed)
 * @param {number|null} messageId - If provided, edits existing message instead of sending new one
 */
async function showWorkspaceMenu(ctx, chatId, page = 0, messageId = null) {
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
  const safePage = Math.max(0, Math.min(page, totalPages - 1));
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

/**
 * Show the thread selection inline keyboard for a workspace with pagination.
 * @param {BotContext} ctx
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
  const safePage = Math.max(0, Math.min(page, totalPages - 1));
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

/**
 * Show the model selection inline keyboard with pagination.
 * @param {BotContext} ctx
 * @param {number} chatId
 * @param {number} page - Current page (0-indexed)
 * @param {number|null} messageId - If provided, edits existing message instead of sending new one
 */
async function showModelMenu(ctx, chatId, page = 0, messageId = null) {
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
  const safePage = Math.max(0, Math.min(page, totalPages - 1));
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

/**
 * Handle inline keyboard callback queries (workspace/thread selection).
 * @param {BotContext} ctx
 * @param {object} query - Telegram callback query object
 */
async function handleKeyboardQueryCallback(ctx, query) {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const data = query.data;

  if (!isVerified(ctx.config.approved_users, chatId)) {
    await ctx.bot.answerCallbackQuery(query.id, {
      text: "You are not approved.",
    });
    return;
  }

  try {
    if (data === "ws-create") {
      const botName = ctx.config.bot_username || "Bot";
      const wsName = `${botName} Workspace`;
      const { workspace, message: error } = await Workspace.new(wsName, null, {
        chatMode: "automatic",
      });
      if (error || !workspace) {
        await ctx.bot.answerCallbackQuery(query.id, {
          text: "Failed to create workspace.",
        });
        return;
      }

      ctx.setState(chatId, { workspaceSlug: workspace.slug, threadSlug: null });
      await ctx.bot.answerCallbackQuery(query.id, {
        text: "Workspace created!",
      });
      await ctx.bot.sendMessage(
        chatId,
        `Created and switched to "${workspace.name}". You can start chatting now!`
      );
      return;
    } else if (data.startsWith("wspg:")) {
      const page = parseInt(data.slice(5), 10);
      await showWorkspaceMenu(ctx, chatId, page, messageId);
      await ctx.bot.answerCallbackQuery(query.id);
    } else if (data.startsWith("ws:")) {
      const workspaceId = parseInt(data.slice(3), 10);
      await showThreadMenu(ctx, chatId, workspaceId, 0, messageId);
      await ctx.bot.answerCallbackQuery(query.id);
    } else if (data.startsWith("thpg:")) {
      const parts = data.slice(5).split(":");
      const workspaceId = parseInt(parts[0], 10);
      const page = parseInt(parts[1], 10);
      await showThreadMenu(ctx, chatId, workspaceId, page, messageId);
      await ctx.bot.answerCallbackQuery(query.id);
    } else if (data.startsWith("th:")) {
      const parts = data.slice(3).split(":");
      const workspaceId = parseInt(parts[0], 10);
      const threadId = parseInt(parts[1], 10);

      const workspace = await Workspace.get({ id: workspaceId });
      if (!workspace) {
        await ctx.bot.answerCallbackQuery(query.id, {
          text: "Workspace not found.",
        });
        return;
      }

      let threadSlug = null;
      let threadName = "Default";
      if (threadId !== 0) {
        const thread = await WorkspaceThread.get({ id: threadId });
        if (thread) {
          threadSlug = thread.slug;
          threadName = thread.name;
        }
      }

      ctx.setState(chatId, { workspaceSlug: workspace.slug, threadSlug });
      await ctx.bot.answerCallbackQuery(query.id, { text: "Switched!" });
      await ctx.bot.sendMessage(
        chatId,
        `Switched to "${workspace.name}" → ${threadName}`
      );
    } else if (data === "back:workspaces") {
      await showWorkspaceMenu(ctx, chatId, 0, messageId);
      await ctx.bot.answerCallbackQuery(query.id);
    } else if (data.startsWith("mdlpg:")) {
      const page = parseInt(data.slice(6), 10);
      await showModelMenu(ctx, chatId, page, messageId);
      await ctx.bot.answerCallbackQuery(query.id);
    } else if (data === "mdl:cancel") {
      await ctx.bot.deleteMessage(chatId, messageId);
      await ctx.bot.answerCallbackQuery(query.id, { text: "Cancelled" });
    } else if (data.startsWith("mdl:")) {
      const parts = data.slice(4).split(":");
      const workspaceId = parseInt(parts[0], 10);
      const modelIdPrefix = parts.slice(1).join(":");

      const workspace = await Workspace.get({ id: workspaceId });
      if (!workspace) {
        await ctx.bot.answerCallbackQuery(query.id, {
          text: "Workspace not found.",
        });
        return;
      }

      const { provider } = resolveWorkspaceProvider(workspace);
      const { models } = await getCustomModels(provider);
      const selectedModel = models?.find((m) => {
        const id = m.id || m.name;
        return id === modelIdPrefix || id.startsWith(modelIdPrefix);
      });

      if (!selectedModel) {
        await ctx.bot.answerCallbackQuery(query.id, {
          text: "Model not found.",
        });
        return;
      }

      const modelId = selectedModel.id || selectedModel.name;
      await Workspace.update(workspace.id, { chatModel: modelId });

      await ctx.bot.answerCallbackQuery(query.id, { text: "Model updated!" });
      await ctx.bot.deleteMessage(chatId, messageId);
      await ctx.bot.sendMessage(
        chatId,
        `Model changed to "${selectedModel.name || modelId}" in "${workspace.name}".`
      );
    }
  } catch (error) {
    ctx.log("Callback error:", error.message);
    await ctx.bot.answerCallbackQuery(query.id, {
      text: "Something went wrong.",
    });
  }
}

module.exports = {
  showWorkspaceMenu,
  showModelMenu,
  handleKeyboardQueryCallback,
};
