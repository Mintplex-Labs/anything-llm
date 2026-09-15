const { Workspace } = require("../../models/workspace");
const { WorkspaceThread } = require("../../models/workspaceThread");
const { WorkspaceChats } = require("../../models/workspaceChats");
const { getBaseLLMProviderModel } = require("../helpers");

const COMMANDS = Object.freeze([
  "workspace",
  "thread",
  "new",
  "reset",
  "status",
  "help",
]);

function parseLarkCommand(text) {
  if (typeof text !== "string") return null;
  const match = text.trim().match(/^\/([a-z]+)(?:\s+([\s\S]*))?$/i);
  if (!match) return null;
  const name = match[1].toLowerCase();
  if (!COMMANDS.includes(name)) return null;
  return { name, args: (match[2] || "").trim() };
}

function sendText(channel, chatId, text, replyOptions) {
  return channel.send(chatId, { text }, replyOptions);
}

async function updateChannelState(stateStore, userId, updates) {
  try {
    await stateStore.set(userId, updates);
    return true;
  } catch {
    return false;
  }
}

async function activeWorkspace(state) {
  if (!state.workspaceSlug) return null;
  return Workspace.get({ slug: state.workspaceSlug });
}

async function activeThread(state, workspace) {
  if (!state.threadSlug) return null;
  return WorkspaceThread.get({
    slug: state.threadSlug,
    workspace_id: workspace.id,
  });
}

function numberedList(records) {
  return records.map(
    (record, index) => `${index + 1}. ${record.name} (\`${record.slug}\`)`
  );
}

async function handleWorkspace({
  args,
  userId,
  chatId,
  stateStore,
  channel,
  replyOptions,
}) {
  if (!args) {
    const workspaces = await Workspace.where({});
    const lines = ["Available workspaces:", ...numberedList(workspaces)];
    if (workspaces.length === 0) lines.push("No workspaces available.");
    lines.push("", "Usage: /workspace <slug>");
    return sendText(channel, chatId, lines.join("\n"), replyOptions);
  }

  const workspace = await Workspace.get({ slug: args });
  if (!workspace)
    return sendText(channel, chatId, "Workspace not found.", replyOptions);
  const updated = await updateChannelState(stateStore, userId, {
    workspaceSlug: workspace.slug,
    threadSlug: null,
  });
  if (!updated)
    return sendText(
      channel,
      chatId,
      "Unable to update channel state.",
      replyOptions
    );
  return sendText(
    channel,
    chatId,
    `Workspace set to "${workspace.name}".`,
    replyOptions
  );
}

async function handleThread({
  args,
  userId,
  chatId,
  stateStore,
  channel,
  state,
  replyOptions,
}) {
  const workspace = await activeWorkspace(state);
  if (!workspace)
    return sendText(channel, chatId, "No workspace configured.", replyOptions);

  if (!args) {
    const threads = await WorkspaceThread.where({ workspace_id: workspace.id });
    const lines = [`Threads in "${workspace.name}":`, ...numberedList(threads)];
    if (threads.length === 0) lines.push("No threads available.");
    lines.push("", "Usage: /thread <slug>");
    return sendText(channel, chatId, lines.join("\n"), replyOptions);
  }

  const thread = await WorkspaceThread.get({
    slug: args,
    workspace_id: workspace.id,
  });
  if (!thread)
    return sendText(channel, chatId, "Thread not found.", replyOptions);
  const updated = await updateChannelState(stateStore, userId, {
    threadSlug: thread.slug,
  });
  if (!updated)
    return sendText(
      channel,
      chatId,
      "Unable to update channel state.",
      replyOptions
    );
  return sendText(
    channel,
    chatId,
    `Thread set to "${thread.name}".`,
    replyOptions
  );
}

async function handleNew({
  args,
  userId,
  chatId,
  stateStore,
  channel,
  state,
  replyOptions,
}) {
  const workspace = await activeWorkspace(state);
  if (!workspace)
    return sendText(channel, chatId, "No workspace configured.", replyOptions);
  const name = args || "Lark Thread";
  const { thread, message } = await WorkspaceThread.new(workspace, null, {
    name,
  });
  if (message || !thread)
    return sendText(channel, chatId, "Failed to create thread.", replyOptions);
  const updated = await updateChannelState(stateStore, userId, {
    threadSlug: thread.slug,
  });
  if (!updated)
    return sendText(
      channel,
      chatId,
      "Unable to update channel state.",
      replyOptions
    );
  return sendText(
    channel,
    chatId,
    `New thread "${thread.name}" created and selected.`,
    replyOptions
  );
}

async function handleReset({ chatId, channel, state, replyOptions }) {
  const workspace = await activeWorkspace(state);
  if (!workspace)
    return sendText(channel, chatId, "No workspace configured.", replyOptions);
  const thread = await activeThread(state, workspace);
  if (state.threadSlug && !thread)
    return sendText(channel, chatId, "Thread not found.", replyOptions);
  await WorkspaceChats.markThreadHistoryInvalidV2({
    workspaceId: workspace.id,
    user_id: null,
    thread_id: thread?.id || null,
    api_session_id: null,
  });
  return sendText(
    channel,
    chatId,
    "Chat history cleared. Previous messages remain visible but will not be used as context.",
    replyOptions
  );
}

async function handleStatus({ chatId, channel, state, replyOptions }) {
  const workspace = await activeWorkspace(state);
  if (!workspace)
    return sendText(channel, chatId, "No workspace configured.", replyOptions);
  const thread = await activeThread(state, workspace);
  const provider =
    workspace.agentProvider ??
    workspace.chatProvider ??
    process.env.LLM_PROVIDER;
  const model =
    workspace.agentModel ??
    workspace.chatModel ??
    getBaseLLMProviderModel({ provider }) ??
    "Default";
  return sendText(
    channel,
    chatId,
    `Workspace: ${workspace.name}\nThread: ${thread?.name || "Default"}\nModel: ${model}`,
    replyOptions
  );
}

function handleHelp({ chatId, channel, replyOptions }) {
  return sendText(
    channel,
    chatId,
    [
      "Available commands:",
      "/workspace [slug] — list or select a workspace",
      "/thread [slug] — list or select a thread",
      "/new [name] — create and select a thread",
      "/reset — clear active chat context",
      "/status — show active workspace, thread, and model",
      "/help — show this help",
    ].join("\n"),
    replyOptions
  );
}

async function handleLarkCommand({
  command,
  args = "",
  userId,
  chatId,
  stateStore,
  channel,
  message,
}) {
  const replyOptions =
    message?.chatType === "group" && message?.messageId
      ? { replyTo: message.messageId }
      : {};
  const state = stateStore.get(userId);
  if (!state) return sendText(channel, chatId, "Access denied.", replyOptions);
  const input = {
    args: String(args).trim(),
    userId,
    chatId,
    stateStore,
    channel,
    state,
    replyOptions,
  };
  switch (String(command).toLowerCase()) {
    case "workspace":
      return handleWorkspace(input);
    case "thread":
      return handleThread(input);
    case "new":
      return handleNew(input);
    case "reset":
      return handleReset(input);
    case "status":
      return handleStatus(input);
    case "help":
      return handleHelp(input);
    default:
      return sendText(
        channel,
        chatId,
        "Unknown command. Use /help.",
        replyOptions
      );
  }
}

module.exports = { parseLarkCommand, handleLarkCommand };
