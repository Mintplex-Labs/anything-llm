const { Workspace } = require("../../models/workspace");
const { WorkspaceThread } = require("../../models/workspaceThread");
const { WorkspaceChats } = require("../../models/workspaceChats");
const { convertToChatHistory } = require("../helpers/chat/responses");
const { BOT_COMMANDS } = require("./constants");
const { sendBatchedMessages } = require("./chatActions");
const { showWorkspaceMenu } = require("./navigation");

/**
 * All command handler functions receive a `ctx` object:
 * @typedef {object} BotContext
 * @property {import('node-telegram-bot-api')} bot - The bot object.
 * @property {object} config - The bot configuration.
 * @property {(chatId: number) => { workspaceSlug: string, threadSlug: string | null }} getState - Get state for a chat.
 * @property {(chatId: number, updates: object) => void} setState - Update state for a chat.
 * @property {(text: string, ...args: any[]) => void} log - Log a message.
 */

/** /start */
async function handleStart(ctx, chatId) {
  const state = ctx.getState(chatId);
  const workspace = await Workspace.get({ slug: state.workspaceSlug });
  const name = workspace?.name || state.workspaceSlug;

  await ctx.bot.sendMessage(
    chatId,
    `Welcome to AnythingLLM!\n\nYour messages go to the "${name}" workspace. Use /switch to change workspaces or threads, and /help to see all commands.`
  );
}

/** /help */
async function handleHelp(ctx, chatId) {
  const lines = BOT_COMMANDS.map((c) => `/${c.command} - ${c.description}`);
  await ctx.bot.sendMessage(
    chatId,
    `Available commands:\n\n${lines.join("\n")}`
  );
}

/** /status */
async function handleStatus(ctx, chatId) {
  const state = ctx.getState(chatId);
  const workspace = await Workspace.get({ slug: state.workspaceSlug });
  if (!workspace) {
    await ctx.bot.sendMessage(chatId, "No workspace configured.");
    return;
  }

  let threadName = "Default";
  if (state.threadSlug) {
    const thread = await WorkspaceThread.get({ slug: state.threadSlug });
    if (thread) threadName = thread.name;
  }

  const lines = [`<b>${workspace.name}</b>`, `<i>${threadName}</i>`];

  const { getBaseLLMProviderModel } = require("../helpers");
  const AIbitat = require("../agents/aibitat");
  const provider =
    workspace?.agentProvider ??
    workspace?.chatProvider ??
    process.env.LLM_PROVIDER;
  const model =
    workspace?.agentModel ??
    workspace?.chatModel ??
    getBaseLLMProviderModel({ provider });
  const agentConfig = { provider, model };
  const agentProvider = new AIbitat(agentConfig).getProviderForConfig(
    agentConfig
  );
  const nativeToolCalling = await agentProvider.supportsNativeToolCalling?.();

  lines.push(`<b>Chat Mode:</b> ${workspace.chatMode ?? "chat"}`);
  lines.push(`--------------------------------`);
  lines.push(`<b>Provider:</b> ${provider}`);
  lines.push(`<b>Model:</b> ${model}`);
  lines.push(
    `<b>Native Tool Calling:</b> ${nativeToolCalling ? "Enabled" : "Disabled"}`
  );

  await ctx.bot.sendMessage(chatId, lines.join("\n"), {
    parse_mode: "HTML",
  });
}

/** /reset - clears LLM chat history context */
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

/** /resume - finds the most recent conversation and switches to it */
async function handleResume(ctx, chatId) {
  const latestChat = await WorkspaceChats.get(
    { user_id: null, api_session_id: null, include: true },
    null,
    { id: "desc" }
  );

  if (!latestChat) {
    await ctx.bot.sendMessage(chatId, "No recent conversations found.");
    return;
  }

  const workspace = await Workspace.get({ id: latestChat.workspaceId });
  if (!workspace) {
    await ctx.bot.sendMessage(chatId, "No recent conversations found.");
    return;
  }

  let threadSlug = null;
  let threadName = "Default";
  if (latestChat.thread_id) {
    const thread = await WorkspaceThread.get({ id: latestChat.thread_id });
    if (thread) {
      threadSlug = thread.slug;
      threadName = thread.name;
    }
  }

  ctx.setState(chatId, { workspaceSlug: workspace.slug, threadSlug });

  await ctx.bot.sendMessage(
    chatId,
    `Resumed "${workspace.name}" → ${threadName}\n\nUse /history to view recent messages.`
  );
}

/** /new - creates a new thread */
async function handleNewThread(ctx, chatId) {
  const state = ctx.getState(chatId);
  const workspace = await Workspace.get({ slug: state.workspaceSlug });
  if (!workspace) {
    await ctx.bot.sendMessage(chatId, "No workspace configured.");
    return;
  }

  const { thread, message: error } = await WorkspaceThread.new(
    workspace,
    null,
    { name: "Telegram Thread" }
  );

  if (error || !thread) {
    await ctx.bot.sendMessage(chatId, "Failed to create thread.");
    return;
  }

  ctx.setState(chatId, { threadSlug: thread.slug });
  await ctx.bot.sendMessage(
    chatId,
    `New thread created in "${workspace.name}". Your messages will now go here.`
  );
}

const DEFAULT_HISTORY_COUNT = 10;
const MAX_HISTORY_COUNT = 50;

/** Escape HTML special characters so Telegram doesn't try to parse them as tags. */
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * /history [count] - show recent chat history
 * @param {BotContext} ctx
 * @param {number} chatId
 * @param {string} [messageText] - full message text to parse count from
 */
async function handleHistory(ctx, chatId, messageText = "") {
  const state = ctx.getState(chatId);
  const workspace = await Workspace.get({ slug: state.workspaceSlug });
  if (!workspace) {
    await ctx.bot.sendMessage(chatId, "No workspace configured.");
    return;
  }

  const match = messageText.match(/\/history\s+(\d+)/);
  const count = match
    ? Math.min(parseInt(match[1], 10), MAX_HISTORY_COUNT)
    : DEFAULT_HISTORY_COUNT;

  const thread = state.threadSlug
    ? await WorkspaceThread.get({ slug: state.threadSlug })
    : null;

  const rawChats = await WorkspaceChats.where(
    {
      workspaceId: workspace.id,
      user_id: null,
      thread_id: thread?.id || null,
      api_session_id: null,
      include: true,
    },
    count,
    { id: "desc" }
  );

  if (!rawChats.length) {
    await ctx.bot.sendMessage(chatId, "No messages yet in this thread.");
    return;
  }

  const history = convertToChatHistory(rawChats.reverse());

  const exchanges = [];
  for (let i = 0; i < history.length; i++) {
    const entry = history[i];
    if (entry.role === "user") {
      let block = `<b>You:</b> ${escapeHtml(entry.content || "")}`;
      if (i + 1 < history.length && history[i + 1].role === "assistant") {
        block += `\n\n<b>AI:</b> ${escapeHtml(history[i + 1].content || "")}`;
        i++;
      }
      exchanges.push(block);
    } else if (entry.role === "assistant") {
      exchanges.push(`<b>AI:</b> ${escapeHtml(entry.content || "")}`);
    }
  }

  if (!exchanges.length) return;

  const threadName = thread?.name || "Default";
  const header = `<b>${workspace.name} → ${threadName}</b>\nLast ${exchanges.length} message(s)\n\n`;

  await sendBatchedMessages(ctx.bot, chatId, exchanges, {
    header,
    separator: "\n\n———\n\n",
    sendOptions: { parse_mode: "HTML" },
  });
}

const COMMAND_HANDLERS = {
  start: handleStart,
  help: handleHelp,
  status: handleStatus,
  switch: showWorkspaceMenu,
  new: handleNewThread,
  reset: handleReset,
  resume: handleResume,
  history: handleHistory,
};

module.exports = { COMMAND_HANDLERS };
