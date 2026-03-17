const { Workspace } = require("../../models/workspace");
const { WorkspaceThread } = require("../../models/workspaceThread");
const { WorkspaceChats } = require("../../models/workspaceChats");
const { BOT_COMMANDS } = require("./constants");
const { clearTelegramChat, sendHistoryPreview } = require("./chatActions");
const { showWorkspaceMenu } = require("./navigation");

/**
 * All command handler functions receive a `ctx` object:
 * @typedef {object} BotContext
 * @property {TelegramBot} bot
 * @property {object} config
 * @property {function} getState - (chatId) => { workspaceSlug, threadSlug }
 * @property {function} setState - (chatId, updates) => void
 * @property {function} log - (text, ...args) => void
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

  const parts = [`Workspace: ${workspace.name}`];
  parts.push(`Chat Mode: ${workspace.chatMode || "chat"}`);
  if (workspace.chatProvider) parts.push(`Provider: ${workspace.chatProvider}`);
  if (workspace.chatModel) parts.push(`Model: ${workspace.chatModel}`);

  if (state.threadSlug) {
    const thread = await WorkspaceThread.get({ slug: state.threadSlug });
    if (thread) parts.push(`Thread: ${thread.name}`);
  } else {
    parts.push("Thread: Main");
  }

  await ctx.bot.sendMessage(chatId, parts.join("\n"));
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

/** /clear - deletes Telegram messages */
async function handleClear(ctx, chatId) {
  await clearTelegramChat(ctx.bot, chatId);

  const state = ctx.getState(chatId);
  const workspace = await Workspace.get({ slug: state.workspaceSlug });
  const name = workspace?.name || state.workspaceSlug;

  let threadInfo = "Main";
  if (state.threadSlug) {
    const thread = await WorkspaceThread.get({ slug: state.threadSlug });
    if (thread) threadInfo = thread.name;
  }

  await ctx.bot.sendMessage(
    chatId,
    `Chat cleared.\n\nWorkspace: ${name}\nThread: ${threadInfo}\n\nYour chat history in AnythingLLM is unchanged. Send a message to continue.`
  );
}

/** /resume - clears chat and shows history for last conversation */
async function handleResume(ctx, chatId) {
  await clearTelegramChat(ctx.bot, chatId);

  const state = ctx.getState(chatId);
  const workspace = await Workspace.get({ slug: state.workspaceSlug });
  const name = workspace?.name || state.workspaceSlug;

  let threadInfo = "Main";
  if (state.threadSlug) {
    const thread = await WorkspaceThread.get({ slug: state.threadSlug });
    if (thread) threadInfo = thread.name;
  }

  await ctx.bot.sendMessage(chatId, `Resuming "${name}" → ${threadInfo}`);
  await sendHistoryPreview(ctx.bot, chatId, workspace, state.threadSlug);
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

const COMMAND_HANDLERS = {
  start: handleStart,
  help: handleHelp,
  status: handleStatus,
  switch: showWorkspaceMenu,
  new: handleNewThread,
  reset: handleReset,
  clear: handleClear,
  resume: handleResume,
};

module.exports = { COMMAND_HANDLERS };
