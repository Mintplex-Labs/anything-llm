// Minimum interval between Telegram message edits (ms) to avoid rate limiting
const STREAM_EDIT_INTERVAL = 600;
// Number of recent messages to show when switching context
const HISTORY_PREVIEW_COUNT = 10;

const BOT_COMMANDS = [
  { command: "switch", description: "Switch workspace or thread" },
  { command: "new", description: "Start a new thread" },
  { command: "resume", description: "Clear chat and resume last conversation" },
  { command: "status", description: "Show current workspace and model" },
  { command: "reset", description: "Clear chat history in current thread" },
  { command: "clear", description: "Clear all messages in this Telegram chat" },
  { command: "help", description: "Show available commands" },
];

module.exports = { STREAM_EDIT_INTERVAL, HISTORY_PREVIEW_COUNT, BOT_COMMANDS };
