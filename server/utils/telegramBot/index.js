const TelegramBot = require("node-telegram-bot-api");
const { ExternalConnector } = require("../../models/externalConnector");
const { Workspace } = require("../../models/workspace");
const { WorkspaceThread } = require("../../models/workspaceThread");
const { MessageQueue } = require("../connectorMessageQueue");
const { BOT_COMMANDS } = require("./constants");
const { decryptToken } = require("./encryption");
const {
  isVerified,
  sendPairingRequest,
  approveUser,
  denyUser,
  revokeUser,
} = require("./verification");
const {
  handleStart,
  handleHelp,
  handleStatus,
  handleReset,
  handleClear,
  handleResume,
  handleNewThread,
} = require("./commands");
const { showWorkspaceMenu, handleCallback } = require("./navigation");
const { streamResponse } = require("./chatPipeline");

class TelegramBotService {
  static _instance = null;
  #bot = null;
  #config = null;
  #queue = new MessageQueue();
  // Per-chat state: { workspaceSlug, threadSlug }
  #chatState = new Map();
  // Pending pairing requests: chatId -> { code, telegramUsername, firstName }
  #pendingPairings = new Map();

  constructor() {
    if (TelegramBotService._instance) return TelegramBotService._instance;
    TelegramBotService._instance = this;
  }

  get isRunning() {
    return this.#bot !== null;
  }

  get pendingPairings() {
    const pairings = [];
    for (const [chatId, data] of this.#pendingPairings) {
      pairings.push({ chatId: String(chatId), ...data });
    }
    return pairings;
  }

  #log(text, ...args) {
    console.log(`\x1b[35m[TelegramBot]\x1b[0m ${text}`, ...args);
  }

  async start(config) {
    if (this.#bot) await this.stop();
    this.#config = config;
    this.#bot = new TelegramBot(config.bot_token, { polling: true });
    this.#setupHandlers();
    await this.#registerCommands();
    this.#log(`Started polling as @${config.bot_username || "unknown"}`);
  }

  async stop() {
    if (!this.#bot) return;
    try {
      await this.#bot.stopPolling();
    } catch {
      // Polling may already be stopped
    }
    this.#bot = null;
    this.#config = null;
    this.#queue.clear();
    this.#chatState.clear();
    this.#pendingPairings.clear();
    this.#log("Stopped");
  }

  async #registerCommands() {
    try {
      await this.#bot.setMyCommands(BOT_COMMANDS);
    } catch (error) {
      this.#log("Failed to register commands:", error.message);
    }
  }

  #getState(chatId) {
    if (!this.#chatState.has(chatId)) {
      this.#chatState.set(chatId, {
        workspaceSlug: this.#config.default_workspace,
        threadSlug: null,
      });
    }
    return this.#chatState.get(chatId);
  }

  #setState(chatId, updates) {
    const state = this.#getState(chatId);
    Object.assign(state, updates);
  }

  /**
   * Build a context object that handler modules use to access
   * the bot instance, config, and state helpers.
   */
  #createContext() {
    return {
      bot: this.#bot,
      config: this.#config,
      getState: (chatId) => this.#getState(chatId),
      setState: (chatId, updates) => this.#setState(chatId, updates),
      log: (text, ...args) => this.#log(text, ...args),
    };
  }

  async approveUser(chatId) {
    await approveUser(this.#bot, chatId, this.#config, this.#pendingPairings);
  }

  async denyUser(chatId) {
    await denyUser(this.#bot, chatId, this.#pendingPairings);
  }

  async revokeUser(chatId) {
    await revokeUser(chatId, this.#config);
  }

  #setupHandlers() {
    const ctx = this.#createContext();
    const guard = (msg, handler) => {
      if (!isVerified(this.#config.approved_users, msg.chat.id)) {
        sendPairingRequest(this.#bot, msg, this.#pendingPairings);
        return;
      }
      handler();
    };

    this.#bot.onText(/\/start/, (msg) => {
      if (!isVerified(this.#config.approved_users, msg.chat.id)) {
        sendPairingRequest(this.#bot, msg, this.#pendingPairings);
        return;
      }
      handleStart(ctx, msg.chat.id);
    });

    this.#bot.onText(/\/help/, (msg) =>
      guard(msg, () => handleHelp(ctx, msg.chat.id))
    );
    this.#bot.onText(/\/status/, (msg) =>
      guard(msg, () => handleStatus(ctx, msg.chat.id))
    );
    this.#bot.onText(/\/switch/, (msg) =>
      guard(msg, () => showWorkspaceMenu(ctx, msg.chat.id))
    );
    this.#bot.onText(/\/new/, (msg) =>
      guard(msg, () => handleNewThread(ctx, msg.chat.id))
    );
    this.#bot.onText(/\/reset/, (msg) =>
      guard(msg, () => handleReset(ctx, msg.chat.id))
    );
    this.#bot.onText(/\/clear/, (msg) =>
      guard(msg, () => handleClear(ctx, msg.chat.id))
    );
    this.#bot.onText(/\/resume/, (msg) =>
      guard(msg, () => handleResume(ctx, msg.chat.id))
    );

    this.#bot.on("callback_query", (query) => handleCallback(ctx, query));

    this.#bot.on("message", (msg) => {
      if (msg.text?.startsWith("/")) return;
      guard(msg, () => this.#handleMessage(ctx, msg));
    });

    this.#bot.on("polling_error", (error) => {
      this.#log("Polling error:", error.message);
    });
  }

  #handleMessage(ctx, msg) {
    if (!msg.text) return;
    const chatId = msg.chat.id;

    this.#queue.enqueue(chatId, async () => {
      const state = this.#getState(chatId);
      const workspace = await Workspace.get({ slug: state.workspaceSlug });
      if (!workspace) {
        await ctx.bot.sendMessage(
          chatId,
          "No workspace configured. Use /switch to select one."
        );
        return;
      }

      const thread = state.threadSlug
        ? await WorkspaceThread.get({ slug: state.threadSlug })
        : null;

      try {
        await streamResponse(ctx, chatId, workspace, thread, msg.text);
      } catch (error) {
        this.#log("Chat error:", error.message);
        await ctx.bot.sendMessage(
          chatId,
          "Sorry, something went wrong. Please try again."
        );
      }
    });
  }

  /**
   * Verify a bot token with the Telegram API without starting polling.
   */
  static async verifyToken(token) {
    try {
      const bot = new TelegramBot(token, { polling: false });
      const me = await bot.getMe();
      return { valid: true, username: me.username, error: null };
    } catch (error) {
      return { valid: false, username: null, error: error.message };
    }
  }

  /**
   * Boot the bot from database config on server startup.
   * Decrypts the stored bot token before starting.
   */
  static async bootIfActive() {
    try {
      const connector = await ExternalConnector.get("telegram");
      if (!connector || !connector.active || !connector.config?.bot_token)
        return;

      const config = { ...connector.config };
      config.bot_token = decryptToken(config.bot_token);

      const service = new TelegramBotService();
      await service.start(config);
    } catch (error) {
      console.error("[TelegramBot] Failed to boot:", error.message);
    }
  }
}

module.exports = { TelegramBotService };
