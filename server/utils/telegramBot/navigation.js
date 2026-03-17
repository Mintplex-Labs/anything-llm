const { Workspace } = require("../../models/workspace");
const { WorkspaceThread } = require("../../models/workspaceThread");
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
    await ctx.bot.sendMessage(chatId, "No workspaces found.");
    return;
  }

  const state = ctx.getState(chatId);
  const buttons = workspaces.map((ws) => {
    const isCurrent = ws.slug === state.workspaceSlug;
    return [
      {
        text: isCurrent ? `🟢 ${ws.name} (active)` : ws.name,
        callback_data: `ws:${ws.slug}`,
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
 * @param {string} workspaceSlug
 * @param {number|null} messageId
 */
async function showThreadMenu(ctx, chatId, workspaceSlug, messageId = null) {
  const workspace = await Workspace.get({ slug: workspaceSlug });
  if (!workspace) return;

  const threads = await WorkspaceThread.where(
    { workspace_id: workspace.id, user_id: null },
    null,
    { createdAt: "desc" }
  );

  const state = ctx.getState(chatId);
  const buttons = [
    [
      {
        text: !state.threadSlug ? "🟢 Default (active)" : "Default",
        callback_data: `th:${workspaceSlug}:main`,
      },
    ],
  ];

  for (const thread of threads) {
    const isCurrent = thread.slug === state.threadSlug;
    buttons.push([
      {
        text: isCurrent ? `🟢 ${thread.name} (active)` : thread.name,
        callback_data: `th:${workspaceSlug}:${thread.slug}`,
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
async function handleCallback(ctx, query) {
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
    if (data.startsWith("ws:")) {
      const workspaceSlug = data.slice(3);
      await showThreadMenu(ctx, chatId, workspaceSlug, messageId);
      await ctx.bot.answerCallbackQuery(query.id);
    } else if (data.startsWith("th:")) {
      const parts = data.slice(3).split(":");
      const workspaceSlug = parts[0];
      const threadSlug = parts[1] === "main" ? null : parts[1];

      ctx.setState(chatId, { workspaceSlug, threadSlug });
      await ctx.bot.answerCallbackQuery(query.id, { text: "Switched!" });

      const workspace = await Workspace.get({ slug: workspaceSlug });
      let threadName = "Default";
      if (threadSlug) {
        const thread = await WorkspaceThread.get({ slug: threadSlug });
        threadName = thread?.name || threadSlug;
      }

      await ctx.bot.sendMessage(
        chatId,
        `Switched to "${workspace?.name}" → ${threadName}`
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

module.exports = { showWorkspaceMenu, showThreadMenu, handleCallback };
