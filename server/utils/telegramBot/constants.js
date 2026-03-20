/**
 * Minimum interval between Telegram message edits (ms) to avoid rate limiting
 */
const STREAM_EDIT_INTERVAL = 600;

/**
 * Telegram messages cap at 4096 chars. We use 4000 to leave headroom
 * so we can finalize the current message and continue in a new one.
 */
const MAX_MSG_LEN = 4000;

/**
 * The cursor character to use for streaming responses.
 * Looks like a blinking block, but doesnt actually blink.
 */
const CURSOR_CHAR = " \u258d";

module.exports = {
  STREAM_EDIT_INTERVAL,
  MAX_MSG_LEN,
  CURSOR_CHAR,
};
