const { MAX_MSG_LEN } = require("./constants");

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
      // Message doesn't exist or is too old, skip
    }
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

/**
 * Send a list of text blocks as batched Telegram messages that
 * stay under the 4096 char limit. Blocks are joined with the
 * given separator and split into new messages when they'd overflow.
 * @param {TelegramBot} bot
 * @param {number} chatId
 * @param {string[]} blocks - individual text blocks to send
 * @param {object} [opts]
 * @param {string} [opts.header] - text prepended to the first message
 * @param {string} [opts.separator] - string between blocks (default "\n\n")
 * @param {object} [opts.sendOptions] - extra options passed to sendMessage (e.g. parse_mode)
 */
async function sendBatchedMessages(bot, chatId, blocks, opts = {}) {
  const { header = "", separator = "\n\n", sendOptions = {} } = opts;
  if (!blocks.length) return;

  let currentMsg = header;

  for (let i = 0; i < blocks.length; i++) {
    const addition = (i === 0 ? "" : separator) + blocks[i];

    if (currentMsg.length + addition.length > MAX_MSG_LEN) {
      await bot.sendMessage(chatId, currentMsg.trim(), sendOptions);
      currentMsg = blocks[i];
    } else {
      currentMsg += addition;
    }
  }

  if (currentMsg.trim()) {
    await bot.sendMessage(chatId, currentMsg.trim(), sendOptions);
  }
}

module.exports = { clearTelegramChat, editMessage, sendBatchedMessages };
