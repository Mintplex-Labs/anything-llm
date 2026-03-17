// Suppress deprecated content-type warning when sending files via the Telegram bot API.
// https://github.com/yagop/node-telegram-bot-api/blob/master/doc/usage.md#sending-files
process.env.NTBA_FIX_350 = 1;
const TelegramBot = require("node-telegram-bot-api");
const { ExternalConnector } = require("../../models/externalConnector");
const { MessageQueue } = require("../connectorMessageQueue");
const { BackgroundService } = require("../BackgroundWorkers");
const { BOT_COMMANDS } = require("./constants");
const { decryptToken } = require("./encryption");
const {
  WorkspaceAgentInvocation,
} = require("../../models/workspaceAgentInvocation");
const {
  isVerified,
  sendPairingRequest,
  approveUser,
  denyUser,
  revokeUser,
} = require("./verification");
const { COMMAND_HANDLERS } = require("./commands");
const { handleCallback } = require("./navigation");

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

    // Register all commands
    for (const [command, handler] of Object.entries(COMMAND_HANDLERS)) {
      this.#bot.onText(new RegExp(`\\/${command}`), (msg) =>
        guard(msg, () => handler(ctx, msg.chat.id))
      );
    }

    // Register callback queries, used for workspace/thread selection interactive menus
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
      try {
        const bgService = new BackgroundService();
        // Collect the invocation UUID from the child so we can close it
        // after exit, when the child's SQLite lock is released.
        let invocationUuid = null;
        await bgService.runJob(
          "handle-telegram-chat",
          {
            botToken: this.#config.bot_token,
            chatId,
            workspaceSlug: state.workspaceSlug,
            threadSlug: state.threadSlug,
            message: msg.text,
          },
          {
            onMessage: (msg) => {
              if (msg?.type === "closeInvocation") invocationUuid = msg.uuid;
            },
          }
        );

        // We do this here to avoid creating another instance of a prisma connection
        // in the background worker.
        if (invocationUuid)
          await WorkspaceAgentInvocation.close(invocationUuid);
      } catch (error) {
        this.#log("Chat worker error:", error.message);
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
      if (!config.bot_token) {
        console.error(
          "[TelegramBot] Failed to decrypt bot token. Re-connect to fix."
        );
        return;
      }

      const service = new TelegramBotService();
      await service.start(config);
    } catch (error) {
      console.error("[TelegramBot] Failed to boot:", error.message);
    }
  }
}

module.exports = { TelegramBotService };
