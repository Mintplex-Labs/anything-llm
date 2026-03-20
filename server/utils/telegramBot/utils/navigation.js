const { Workspace } = require("../../../models/workspace");
const { WorkspaceChats } = require("../../../models/workspaceChats");
const { WorkspaceThread } = require("../../../models/workspaceThread");
const { isVerified } = require("./verification");

/**
 * Show the workspace selection inline keyboard.
 * @param {BotContext} ctx
 * @param {number} chatId
 * @param {number|null} messageId - If provided, edits existing message instead of sending new one
 */
async function showWorkspaceMenu(ctx, chatId, messageId = null) {
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
  const buttons = workspaces.map((ws) => {
    const isCurrent = ws.slug === state.workspaceSlug;
    return [
      {
        text: isCurrent ? `🟢 ${ws.name} (active)` : ws.name,
        callback_data: `ws:${ws.id}`,
      },
    ];
  });

  const opts = {
    reply_markup: { inline_keyboard: buttons },
  };

  if (messageId) {
    await ctx.bot.editMessageText("Select a workspace:", {
      chat_id: chatId,
      message_id: messageId,
      ...opts,
    });
  } else {
    await ctx.bot.sendMessage(chatId, "Select a workspace:", opts);
  }
}

/**
 * Show the thread selection inline keyboard for a workspace.
 * @param {BotContext} ctx
 * @param {number} chatId
 * @param {number} workspaceId - must be ID, not slug due to 69-byte limit on callback data
 * @param {number|null} messageId
 */
async function showThreadMenu(ctx, chatId, workspaceId, messageId = null) {
  const workspace = await Workspace.get({ id: workspaceId });
  if (!workspace) return;

  const threads = await WorkspaceThread.where(
    { workspace_id: workspace.id, user_id: null },
    null,
    { createdAt: "desc" }
  );

  const state = ctx.getState(chatId);
  const defaultThreadChatCount = await WorkspaceChats.count({
    workspaceId: workspace.id,
    thread_id: null,
  });
  let defaultThreadText =
    defaultThreadChatCount > 0 ? "🟢 Default (active)" : "Default";
  if (defaultThreadChatCount > 0)
    defaultThreadText += ` - ${defaultThreadChatCount} chats`;
  const buttons = [
    [
      {
        text: defaultThreadText,
        callback_data: `th:${workspace.id}:0`,
      },
    ],
  ];

  for (const thread of threads) {
    const threadChatCount = await WorkspaceChats.count({
      workspaceId: workspace.id,
      thread_id: thread.id,
    });

    const isCurrent = thread.slug === state.threadSlug;
    let threadText = isCurrent ? `🟢 ${thread.name} (active)` : thread.name;
    if (threadChatCount > 0) threadText += ` - ${threadChatCount} chats`;
    buttons.push([
      {
        text: threadText,
        callback_data: `th:${workspace.id}:${thread.id}`,
      },
    ]);
  }

  buttons.push([
    {
      text: "← Back to workspaces",
      callback_data: "back:workspaces",
    },
  ]);

  const text = `"${workspace.name}" — Select a thread:`;
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
      const { workspace, message: error } = await Workspace.new(wsName);
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
    } else if (data.startsWith("ws:")) {
      const workspaceId = parseInt(data.slice(3), 10);
      await showThreadMenu(ctx, chatId, workspaceId, messageId);
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
      await showWorkspaceMenu(ctx, chatId, messageId);
      await ctx.bot.answerCallbackQuery(query.id);
    }
  } catch (error) {
    ctx.log("Callback error:", error.message);
    await ctx.bot.answerCallbackQuery(query.id, {
      text: "Something went wrong.",
    });
  }
}

module.exports = { showWorkspaceMenu, handleKeyboardQueryCallback };
