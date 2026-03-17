// Minimum interval between Telegram message edits (ms) to avoid rate limiting
const STREAM_EDIT_INTERVAL = 600;
// Telegram messages cap at 4096 chars. We use 4000 to leave headroom
// so we can finalize the current message and continue in a new one.
const MAX_MSG_LEN = 4000;
const BOT_COMMANDS = [
  { command: "switch", description: "Switch workspace or thread" },
  { command: "new", description: "Start a new thread" },
  {
    command: "history",
    description: "Show recent messages (e.g. /history 25)",
  },
  { command: "resume", description: "Show current workspace and thread" },
  { command: "status", description: "Show current workspace and model" },
  { command: "reset", description: "Clear chat history in current thread" },
  { command: "clear", description: "Clear all messages in this Telegram chat" },
  { command: "help", description: "Show available commands" },
];

module.exports = { STREAM_EDIT_INTERVAL, MAX_MSG_LEN, BOT_COMMANDS };
