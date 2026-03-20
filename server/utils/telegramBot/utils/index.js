const { MAX_MSG_LEN } = require("../constants");
const { markdownToTelegram } = require("../utils/format");
const { EncryptionManager } = require("../../EncryptionManager");

const ENCRYPTED_PREFIX = "enc:";

/**
 * Delete recent messages from a Telegram chat.
 * Telegram doesn't let bots bulk-delete in private chats,
 * so we delete messages one by one going backwards.
 * @param {import("../commands").BotContext} ctx
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
 * @param {import("../commands").BotContext} ctx
 * @param {number} chatId
 * @param {number} messageId
 * @param {string} text
 * @param {function} log
 * @param {object} [opts]
 * @param {boolean} [opts.format=false] - Whether to format markdown as HTML
 */
async function editMessage(bot, chatId, messageId, text, log, opts = {}) {
  if (!text || !bot) return;
  const { format = false } = opts;

  let finalText = text;
  let parseMode = undefined;

  if (format) {
    try {
      finalText = markdownToTelegram(text);
      parseMode = "HTML";
    } catch {
      finalText = text;
    }
  }

  const truncated =
    finalText.length > 4096 ? finalText.slice(0, 4090) + "\n..." : finalText;

  try {
    await bot.editMessageText(truncated, {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: parseMode,
    });
  } catch (error) {
    if (!error.message?.includes("message is not modified")) {
      log("Edit error:", error.message);
    }
    // If HTML parsing failed, retry without formatting
    if (parseMode && error.message?.includes("parse")) {
      try {
        const plainTruncated =
          text.length > 4096 ? text.slice(0, 4090) + "\n..." : text;
        await bot.editMessageText(plainTruncated, {
          chat_id: chatId,
          message_id: messageId,
        });
      } catch {}
    }
  }
}

/**
 * Send a formatted message to Telegram with markdown converted to HTML.
 * Falls back to plain text if HTML parsing fails.
 * @param {TelegramBot} bot
 * @param {number} chatId
 * @param {string} text
 * @param {object} [opts]
 * @param {boolean} [opts.format=true] - Whether to format markdown as HTML
 * @returns {Promise<object>} The sent message object
 */
async function sendFormattedMessage(bot, chatId, text, opts = {}) {
  const { format = true } = opts;

  if (!format) {
    return bot.sendMessage(chatId, text);
  }

  try {
    const formatted = markdownToTelegram(text);
    return await bot.sendMessage(chatId, formatted, { parse_mode: "HTML" });
  } catch (error) {
    // If HTML parsing failed, retry without formatting
    if (error.message?.includes("parse") || error.message?.includes("can't")) {
      return bot.sendMessage(chatId, text);
    }
    throw error;
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

/**
 * Encrypt a bot token for safe storage in the database.
 * @param {string} token
 * @returns {string|null}
 */
function encryptToken(token) {
  if (!token) return null;
  const manager = new EncryptionManager();
  const encrypted = manager.encrypt(token);
  return encrypted ? ENCRYPTED_PREFIX + encrypted : null;
}

/**
 * Decrypt an encrypted bot token from the database.
 * Returns plaintext tokens as-is for backward compatibility.
 * @param {string} encryptedToken
 * @returns {string|null}
 */
function decryptToken(encryptedToken) {
  if (!encryptedToken) return null;
  if (!encryptedToken.startsWith(ENCRYPTED_PREFIX)) return encryptedToken;
  const manager = new EncryptionManager();
  return manager.decrypt(encryptedToken.slice(ENCRYPTED_PREFIX.length));
}

module.exports = {
  clearTelegramChat,
  editMessage,
  sendBatchedMessages,
  sendFormattedMessage,
  encryptToken,
  decryptToken,
};
