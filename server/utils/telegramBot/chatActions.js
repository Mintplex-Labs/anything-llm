const { WorkspaceThread } = require("../../models/workspaceThread");
const { WorkspaceChats } = require("../../models/workspaceChats");
const { convertToChatHistory } = require("../helpers/chat/responses");
const { HISTORY_PREVIEW_COUNT } = require("./constants");

/**
 * Delete recent messages from a Telegram chat.
 * Telegram doesn't let bots bulk-delete in private chats,
 * so we delete messages one by one going backwards.
 * @param {TelegramBot} bot
 * @param {number} chatId
 */
async function clearTelegramChat(bot, chatId) {
  const marker = await bot.sendMessage(chatId, "Clearing...");
  const msgId = marker.message_id;

  // Try to delete the last 100 messages (Telegram limits to 48hr old messages)
  for (let i = msgId; i > Math.max(msgId - 100, 0); i--) {
    try {
      await bot.deleteMessage(chatId, i);
    } catch {
      // Message doesn't exist or is too old — skip
    }
  }
}

/**
 * Send recent chat history as separate messages so nothing gets cut off.
 * Groups exchanges into batches that fit within Telegram's 4096 char limit.
 * @param {TelegramBot} bot
 * @param {number} chatId
 * @param {object} workspace
 * @param {string|null} threadSlug
 */
async function sendHistoryPreview(bot, chatId, workspace, threadSlug) {
  if (!workspace) return;

  const thread = threadSlug
    ? await WorkspaceThread.get({ slug: threadSlug })
    : null;

  const rawChats = await WorkspaceChats.where(
    {
      workspaceId: workspace.id,
      user_id: null,
      thread_id: thread?.id || null,
      api_session_id: null,
      include: true,
    },
    HISTORY_PREVIEW_COUNT,
    { id: "desc" }
  );

  if (!rawChats.length) {
    await bot.sendMessage(
      chatId,
      "No messages yet. Send a message to start chatting."
    );
    return;
  }

  const history = convertToChatHistory(rawChats.reverse());
  const separator = "\n━━━━━━━━━━━━━━━━━━━━\n";

  // Build individual exchange blocks (user + assistant pairs)
  const exchanges = [];
  for (let i = 0; i < history.length; i++) {
    const entry = history[i];
    if (entry.role === "user") {
      let block = `You: ${entry.content || ""}`;
      // Attach the assistant response if it immediately follows
      if (i + 1 < history.length && history[i + 1].role === "assistant") {
        block += `\n\nAI: ${history[i + 1].content || ""}`;
        i++;
      }
      exchanges.push(block);
    } else if (entry.role === "assistant") {
      exchanges.push(`AI: ${entry.content || ""}`);
    }
  }

  if (!exchanges.length) return;

  // Batch exchanges into messages that fit under Telegram's 4096 char limit
  const MAX_MSG_LEN = 4000;
  const header = "━━━ Recent History ━━━\n";
  let currentMsg = header;

  for (let i = 0; i < exchanges.length; i++) {
    const block = exchanges[i];
    const addition = (i === 0 ? "" : separator) + block;

    if (currentMsg.length + addition.length > MAX_MSG_LEN) {
      await bot.sendMessage(chatId, currentMsg.trim());
      currentMsg = block;
    } else {
      currentMsg += addition;
    }
  }

  if (currentMsg.trim()) {
    await bot.sendMessage(chatId, currentMsg.trim());
  }
}

/**
 * Edit a Telegram message with truncation to stay under the 4096 char limit.
 * @param {TelegramBot} bot
 * @param {number} chatId
 * @param {number} messageId
 * @param {string} text
 * @param {function} log
 */
async function editMessage(bot, chatId, messageId, text, log) {
  if (!text || !bot) return;
  const truncated = text.length > 4096 ? text.slice(0, 4090) + "\n..." : text;

  try {
    await bot.editMessageText(truncated, {
      chat_id: chatId,
      message_id: messageId,
    });
  } catch (error) {
    if (!error.message?.includes("message is not modified")) {
      log("Edit error:", error.message);
    }
  }
}

module.exports = { clearTelegramChat, sendHistoryPreview, editMessage };
