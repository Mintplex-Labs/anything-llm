const {
  STREAM_EDIT_INTERVAL,
  MAX_MSG_LEN,
  CURSOR_CHAR,
} = require("../constants");
const { editMessage } = require("../utils");
const { safeJsonParse } = require("../../http");

function parseSSEChunk(data) {
  const match = data.match(/^data: (.+)\n\n$/s);
  if (!match) return null;
  const parsed = safeJsonParse(match[1], null);
  if (!parsed || !parsed.textResponse || parsed.close) return null;
  return parsed.textResponse;
}

/**
 * Create a stream response handler for editing Telegram messages as tokens arrive.
 * Manages message splitting when content exceeds Telegram's length limit.
 * @param {object} options
 * @param {import("./commands").BotContext} options.ctx - Bot context
 * @param {number} options.chatId - Telegram chat ID
 * @returns {{ responseHandler: object, flushEdit: function }}
 */
function createStreamHandler({ ctx, chatId }) {
  let completeText = "";
  let messageId = null;
  let messagePending = null;
  let lastEditTime = 0;
  let editTimer = null;
  let msgOffset = 0;

  const currentText = () => completeText.slice(msgOffset);

  /**
   * Finalize the current message and reset state when accumulated text
   * exceeds Telegram's max message length.
   */
  function splitMessageIfOverflow() {
    if (messageId === null || currentText().length <= MAX_MSG_LEN) return;
    clearTimeout(editTimer);
    editTimer = null;
    editMessage(
      ctx.bot,
      chatId,
      messageId,
      completeText.slice(msgOffset, msgOffset + MAX_MSG_LEN),
      ctx.log,
      { format: true }
    ).catch(() => {});
    msgOffset += MAX_MSG_LEN;
    messageId = null;
    messagePending = null;
  }

  /**
   * Send a new Telegram message when none exists yet.
   * @returns {boolean} true if a new message was initiated (caller should skip edit).
   */
  function startNewMessageIfNeeded() {
    if (messageId !== null || messagePending) return false;
    messagePending = ctx.bot
      .sendMessage(chatId, currentText().slice(0, MAX_MSG_LEN) + CURSOR_CHAR)
      .then((sent) => {
        messageId = sent.message_id;
        lastEditTime = Date.now();
      })
      .catch(() => {
        messagePending = null;
      });
    return true;
  }

  /**
   * Throttle edits to the current message so we don't exceed Telegram rate limits.
   */
  function scheduleThrottledEdit() {
    if (!messageId) return;

    const now = Date.now();
    if (now - lastEditTime >= STREAM_EDIT_INTERVAL) {
      clearTimeout(editTimer);
      lastEditTime = now;
      editMessage(
        ctx.bot,
        chatId,
        messageId,
        currentText() + CURSOR_CHAR,
        ctx.log
      ).catch(() => {});
    } else if (!editTimer) {
      editTimer = setTimeout(() => {
        lastEditTime = Date.now();
        editMessage(
          ctx.bot,
          chatId,
          messageId,
          currentText() + CURSOR_CHAR,
          ctx.log
        ).catch(() => {});
        editTimer = null;
      }, STREAM_EDIT_INTERVAL);
    }
  }

  const flushEdit = async (final = false, finalText = null) => {
    if (messagePending) await messagePending;
    if (final && typeof finalText === "string") completeText = finalText;
    // A provider can emit a large last chunk before the first send resolves.
    // Drain every remaining page at completion, even if no further token arrives.
    while (final && currentText().length > MAX_MSG_LEN) {
      if (!messageId) {
        startNewMessageIfNeeded();
        await messagePending;
      }
      if (!messageId) break;
      await editMessage(
        ctx.bot,
        chatId,
        messageId,
        currentText().slice(0, MAX_MSG_LEN),
        ctx.log,
        { format: true }
      );
      msgOffset += MAX_MSG_LEN;
      messageId = null;
      messagePending = null;
    }
    if (final && !messageId && currentText()) {
      startNewMessageIfNeeded();
      await messagePending;
    }
    if (!messageId) return;
    clearTimeout(editTimer);
    editTimer = null;
    const text = currentText();
    const display = final ? text : text + CURSOR_CHAR;
    await editMessage(ctx.bot, chatId, messageId, display, ctx.log, {
      format: final,
    }).catch(() => {});
  };

  const responseHandler = {
    on: () => {},
    removeListener: () => {},
    write: (data) => {
      const token = parseSSEChunk(data);
      if (!token) return;

      completeText += token;
      splitMessageIfOverflow();
      if (!startNewMessageIfNeeded()) scheduleThrottledEdit();
    },
  };

  return { responseHandler, flushEdit, dispose: () => clearTimeout(editTimer) };
}

module.exports = { createStreamHandler };
