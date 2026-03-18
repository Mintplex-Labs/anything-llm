// Suppress deprecated content-type warning when sending files via the Telegram bot API.
// https://github.com/yagop/node-telegram-bot-api/blob/master/doc/usage.md#sending-files
process.env.NTBA_FIX_350 = 1;
const TelegramBot = require("node-telegram-bot-api");
const {
  ExternalCommunicationConnector,
} = require("../../models/externalCommunicationConnector");
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
const {
  downloadTelegramFile,
  transcribeAudio,
  photoToAttachment,
} = require("./mediaHandlers");

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

    // Restore per-user workspace/thread state from saved config
    for (const user of config.approved_users || []) {
      if (user.active_workspace) {
        this.#chatState.set(Number(user.chatId), {
          workspaceSlug: user.active_workspace,
          threadSlug: user.active_thread || null,
        });
      }
    }

    this.#setupHandlers();
    await this.#registerCommands();
    this.#log(`Started polling as @${config.bot_username || "unknown"}`);
  }

  updateConfig(updates) {
    if (!this.#config) return;
    Object.assign(this.#config, updates);
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
    this.#persistChatState(chatId, state);
  }

  async #persistChatState(chatId, state) {
    const approved = (this.#config.approved_users || []).map((u) => {
      if (String(u.chatId) === String(chatId)) {
        return {
          ...u,
          active_workspace: state.workspaceSlug,
          active_thread: state.threadSlug,
        };
      }
      return u;
    });
    this.#config.approved_users = approved;
    await ExternalCommunicationConnector.updateConfig("telegram", {
      approved_users: approved,
    });
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

    // Register all commands (history is registered separately below)
    for (const [command, handler] of Object.entries(COMMAND_HANDLERS)) {
      if (command === "history") continue;
      this.#bot.onText(new RegExp(`\\/${command}`), (msg) =>
        guard(msg, () => handler(ctx, msg.chat.id))
      );
    }

    // Register /history separately so we can pass the message text for argument parsing
    // Ex: /history 25 shows last 25 messages
    this.#bot.onText(/\/history(.*)/, (msg) =>
      guard(msg, () => COMMAND_HANDLERS.history(ctx, msg.chat.id, msg.text))
    );

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

  async #runChatJob(ctx, chatId, payload) {
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
          ...payload,
        },
        {
          onMessage: (msg) => {
            if (msg?.type === "closeInvocation") invocationUuid = msg.uuid;
          },
        }
      );

      // We do this here to avoid creating another instance of a prisma connection
      // in the background worker.
      if (invocationUuid) await WorkspaceAgentInvocation.close(invocationUuid);
    } catch (error) {
      this.#log("Chat worker error:", error.message);
      await ctx.bot.sendMessage(
        chatId,
        "Sorry, something went wrong. Please try again."
      );
    }
  }

  #shouldVoiceRespond(isVoiceMessage) {
    const mode = this.#config.voice_response_mode || "text_only";
    if (mode === "always_voice") return true;
    if (mode === "mirror" && isVoiceMessage) return true;
    return false;
  }

  #handleMessage(ctx, msg) {
    const chatId = msg.chat.id;

    // Voice messages: transcribe then send to LLM
    if (msg.voice || msg.audio) {
      this.#queue.enqueue(chatId, async () => {
        try {
          const fileId = (msg.voice || msg.audio).file_id;
          await ctx.bot.sendChatAction(chatId, "typing");
          const audioBuffer = await downloadTelegramFile(ctx.bot, fileId);
          const transcription = await transcribeAudio(audioBuffer);
          if (!transcription?.trim()) {
            await ctx.bot.sendMessage(
              chatId,
              "Could not transcribe the voice message."
            );
            return;
          }
          await this.#runChatJob(ctx, chatId, {
            message: transcription,
            voiceResponse: this.#shouldVoiceRespond(true),
          });
        } catch (error) {
          this.#log("Voice handling error:", error.message);
          const isConfigError =
            error.message.includes("transcription") ||
            error.message.includes("Whisper") ||
            error.message.includes("OpenAI");
          await ctx.bot.sendMessage(
            chatId,
            isConfigError
              ? error.message
              : "Failed to process voice message. Please try again."
          );
        }
      });
      return;
    }

    // Photo messages: extract image and send to LLM with vision
    if (msg.photo) {
      this.#queue.enqueue(chatId, async () => {
        try {
          await ctx.bot.sendChatAction(chatId, "typing");
          const attachment = await photoToAttachment(ctx.bot, msg.photo);
          await this.#runChatJob(ctx, chatId, {
            message: msg.caption || "Describe this image.",
            attachments: [attachment],
            voiceResponse: this.#shouldVoiceRespond(false),
          });
        } catch (error) {
          this.#log("Photo handling error:", error.message);
          await ctx.bot.sendMessage(
            chatId,
            "Failed to process the image. Please try again."
          );
        }
      });
      return;
    }

    if (!msg.text) return;
    this.#queue.enqueue(chatId, async () => {
      await this.#runChatJob(ctx, chatId, {
        message: msg.text,
        voiceResponse: this.#shouldVoiceRespond(false),
      });
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
      const { SystemSettings } = require("../../models/systemSettings");
      if (await SystemSettings.isMultiUserMode()) {
        console.log(
          "[TelegramBot] Disabled in multi-user mode. Skipping boot."
        );
        return;
      }

      const connector = await ExternalCommunicationConnector.get("telegram");
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
