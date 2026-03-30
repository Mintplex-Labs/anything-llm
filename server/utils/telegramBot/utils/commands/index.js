/**
 * All command handler functions receive a `ctx` object:
 * @typedef {object} BotContext
 * @property {import('node-telegram-bot-api')} bot - The bot object.
 * @property {object} config - The bot configuration.
 * @property {(chatId: number) => { workspaceSlug: string, threadSlug: string | null }} getState - Get state for a chat.
 * @property {(chatId: number, updates: object) => void} setState - Update state for a chat.
 * @property {(text: string, ...args: any[]) => void} log - Log a message.
 */

/**
 * @typedef {object} BotCommandConfig
 * @property {string} command - The command name.
 * @property {string} description - The command description.
 * @property {boolean} skipAutoSetup - Whether to skip automatic setup.
 * @property {() => (ctx: BotContext, chatId: number, messageText?: string) => Promise<void>} initHandler - The handler function to initialize the command.
 */

const BASE_COMMAND = {
  skipAutoSetup: false,
  initHandler: () => {
    throw new Error("Not implemented");
  },
};

/**
 * @type {BotCommandConfig[]}
 */
const BOT_COMMANDS = [
  {
    ...BASE_COMMAND,
    command: "start",
    description: "Start the bot",
    initHandler: () => {
      const { handleStart } = require("./handlers/handleStart");
      return handleStart;
    },
  },
  {
    ...BASE_COMMAND,
    command: "switch",
    description: "Switch workspace or thread",
    initHandler: () => {
      const { showWorkspaceMenu } = require("./handlers/showWorkspaceMenu");
      return showWorkspaceMenu;
    },
  },
  {
    ...BASE_COMMAND,
    command: "model",
    description: "Change the LLM model",
    initHandler: () => {
      const { showModelMenu } = require("./handlers/showModelMenu");
      return showModelMenu;
    },
  },
  {
    ...BASE_COMMAND,
    command: "new",
    description: "Start a new thread",
    initHandler: () => {
      const { handleNewThread } = require("./handlers/handleNewThread");
      return handleNewThread;
    },
  },
  {
    ...BASE_COMMAND,
    command: "history",
    description: "Show recent messages (e.g. /history 25)",
    skipAutoSetup: true,
    initHandler: () => {
      const { handleHistory } = require("./handlers/handleHistory");
      return handleHistory;
    },
  },
  {
    ...BASE_COMMAND,
    command: "status",
    description: "Show current workspace and model",
    initHandler: () => {
      const { handleStatus } = require("./handlers/handleStatus");
      return handleStatus;
    },
  },
  {
    ...BASE_COMMAND,
    command: "reset",
    description: "Clear chat history in current thread",
    initHandler: () => {
      const { handleReset } = require("./handlers/handleReset");
      return handleReset;
    },
  },
  {
    ...BASE_COMMAND,
    command: "help",
    description: "Show available commands",
    initHandler: () => {
      const { handleHelp } = require("./handlers/handleHelp");
      return handleHelp;
    },
  },
  {
    ...BASE_COMMAND,
    command: "proof",
    description: "Show citations for the last reply",
    initHandler: () => {
      const { handleProof } = require("./handlers/handleProof");
      return handleProof;
    },
  },
  {
    ...BASE_COMMAND,
    command: "abort",
    description: "Stop the current response",
    initHandler: () => {
      const { handleAbort } = require("./handlers/handleAbort");
      return handleAbort;
    },
  },
];

module.exports = {
  BOT_COMMANDS,
};
