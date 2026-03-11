const TelegramBot = require("node-telegram-bot-api");
const { ExternalConnector } = require("../../models/externalConnector");
const { Workspace } = require("../../models/workspace");
const { WorkspaceThread } = require("../../models/workspaceThread");
const { WorkspaceChats } = require("../../models/workspaceChats");
const { MessageQueue } = require("../connectorMessageQueue");
const { getLLMProvider, getVectorDbClass } = require("../helpers");
const { DocumentManager } = require("../DocumentManager");
const { sourceIdentifier, recentChatHistory, chatPrompt } = require("../chats");
const { v4: uuidv4 } = require("uuid");
const { convertToChatHistory } = require("../helpers/chat/responses");

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

/**
 * Generate a 6-digit pairing code from a chat ID.
 * Deterministic so the same chat ID always produces the same code.
 * @param {number|string} chatId
 * @returns {string}
 */
function generatePairingCode(chatId) {
  const num = Math.abs(Number(chatId));
  const hash = ((num * 2654435761) >>> 0) % 1000000;
  return String(hash).padStart(6, "0");
}

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

  /**
   * Start the bot with the given config.
   * @param {object} config
   */
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

  // ─── User verification ──────────────────────────────────────

  #isVerified(chatId) {
    const approvedUsers = this.#config.approved_users || [];
    return approvedUsers.some(
      (u) => (typeof u === "string" ? u : u.chatId) === String(chatId)
    );
  }

  async #sendPairingRequest(msg) {
    const chatId = msg.chat.id;
    const code = generatePairingCode(chatId);
    const firstName = msg.from?.first_name || "Unknown";
    const username = msg.from?.username || null;

    this.#pendingPairings.set(chatId, {
      code,
      telegramUsername: username,
      firstName,
      requestedAt: new Date().toISOString(),
    });

    await this.#bot.sendMessage(
      chatId,
      [
        "You need to be approved before using this bot.",
        "",
        `Your pairing code is: ${code}`,
        "",
        "Ask the AnythingLLM admin to go to Settings → Connections → Telegram and approve your request.",
        "",
        "Make sure the pairing code shown here matches what is displayed in the settings page. This ensures no one else is trying to connect on your behalf.",
      ].join("\n")
    );
  }

  /**
   * Approve a pending user by their chat ID.
   * Called from the API when the admin approves in the settings UI.
   */
  async approveUser(chatId) {
    const approved = this.#config.approved_users || [];
    const alreadyApproved = approved.some(
      (u) => (typeof u === "string" ? u : u.chatId) === String(chatId)
    );

    if (!alreadyApproved) {
      const pending = this.#pendingPairings.get(Number(chatId));
      approved.push({
        chatId: String(chatId),
        username: pending?.telegramUsername || null,
        firstName: pending?.firstName || null,
      });
      this.#config.approved_users = approved;
      await ExternalConnector.updateConfig("telegram", {
        approved_users: approved,
      });
    }
    this.#pendingPairings.delete(Number(chatId));

    // Notify the user
    if (this.#bot) {
      try {
        await this.#bot.sendMessage(
          chatId,
          "You've been approved! Send a message to start chatting."
        );
      } catch {
        // User may have blocked bot
      }
    }
  }

  /**
   * Deny a pending user by their chat ID.
   */
  async denyUser(chatId) {
    this.#pendingPairings.delete(Number(chatId));

    if (this.#bot) {
      try {
        await this.#bot.sendMessage(chatId, "Your access request was denied.");
      } catch {
        // User may have blocked bot
      }
    }
  }

  /**
   * Revoke an already-approved user.
   */
  async revokeUser(chatId) {
    const approved = (this.#config.approved_users || []).filter(
      (u) => (typeof u === "string" ? u : u.chatId) !== String(chatId)
    );
    this.#config.approved_users = approved;
    await ExternalConnector.updateConfig("telegram", {
      approved_users: approved,
    });
  }

  // ─── Handler setup ──────────────────────────────────────────

  #setupHandlers() {
    this.#bot.onText(/\/start/, (msg) => this.#handleStart(msg));
    this.#bot.onText(/\/help/, (msg) =>
      this.#guardedHandler(msg, () => this.#handleHelp(msg))
    );
    this.#bot.onText(/\/status/, (msg) =>
      this.#guardedHandler(msg, () => this.#handleStatus(msg))
    );
    this.#bot.onText(/\/switch/, (msg) =>
      this.#guardedHandler(msg, () => this.#handleSwitch(msg))
    );
    this.#bot.onText(/\/new/, (msg) =>
      this.#guardedHandler(msg, () => this.#handleNewThread(msg))
    );
    this.#bot.onText(/\/reset/, (msg) =>
      this.#guardedHandler(msg, () => this.#handleReset(msg))
    );
    this.#bot.onText(/\/clear/, (msg) =>
      this.#guardedHandler(msg, () => this.#handleClear(msg))
    );
    this.#bot.onText(/\/resume/, (msg) =>
      this.#guardedHandler(msg, () => this.#handleResume(msg))
    );

    this.#bot.on("callback_query", (query) => this.#handleCallback(query));

    this.#bot.on("message", (msg) => {
      if (msg.text?.startsWith("/")) return;
      this.#guardedHandler(msg, () => this.#handleMessage(msg));
    });

    this.#bot.on("polling_error", (error) => {
      this.#log("Polling error:", error.message);
    });
  }

  /**
   * Wraps command handlers with verification check.
   * If the user is not verified, sends a pairing request instead.
   */
  async #guardedHandler(msg, handler) {
    if (!this.#isVerified(msg.chat.id)) {
      await this.#sendPairingRequest(msg);
      return;
    }
    await handler();
  }

  // ─── Chat state helpers ─────────────────────────────────────

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

  // ─── Command handlers ──────────────────────────────────────

  async #handleStart(msg) {
    const chatId = msg.chat.id;

    if (!this.#isVerified(chatId)) {
      await this.#sendPairingRequest(msg);
      return;
    }

    const state = this.#getState(chatId);
    const workspace = await Workspace.get({ slug: state.workspaceSlug });
    const name = workspace?.name || state.workspaceSlug;

    await this.#bot.sendMessage(
      chatId,
      `Welcome to AnythingLLM!\n\nYour messages go to the "${name}" workspace. Use /switch to change workspaces or threads, and /help to see all commands.`
    );
  }

  async #handleHelp(msg) {
    const lines = BOT_COMMANDS.map((c) => `/${c.command} - ${c.description}`);
    await this.#bot.sendMessage(
      msg.chat.id,
      `Available commands:\n\n${lines.join("\n")}`
    );
  }

  async #handleStatus(msg) {
    const state = this.#getState(msg.chat.id);
    const workspace = await Workspace.get({ slug: state.workspaceSlug });
    if (!workspace) {
      await this.#bot.sendMessage(msg.chat.id, "No workspace configured.");
      return;
    }

    const parts = [`Workspace: ${workspace.name}`];
    parts.push(`Chat Mode: ${workspace.chatMode || "chat"}`);
    if (workspace.chatProvider)
      parts.push(`Provider: ${workspace.chatProvider}`);
    if (workspace.chatModel) parts.push(`Model: ${workspace.chatModel}`);

    if (state.threadSlug) {
      const thread = await WorkspaceThread.get({ slug: state.threadSlug });
      if (thread) parts.push(`Thread: ${thread.name}`);
    } else {
      parts.push("Thread: Main");
    }

    await this.#bot.sendMessage(msg.chat.id, parts.join("\n"));
  }

  async #handleReset(msg) {
    const chatId = msg.chat.id;
    const state = this.#getState(chatId);
    const workspace = await Workspace.get({ slug: state.workspaceSlug });
    if (!workspace) return;

    const thread = state.threadSlug
      ? await WorkspaceThread.get({ slug: state.threadSlug })
      : null;

    await WorkspaceChats.markThreadHistoryInvalidV2({
      workspaceId: workspace.id,
      user_id: null,
      thread_id: thread?.id || null,
      api_session_id: null,
    });

    await this.#bot.sendMessage(
      chatId,
      "Chat history has been cleared for the LLM. Previous messages still appear above but won't be used as context."
    );
  }

  async #handleClear(msg) {
    const chatId = msg.chat.id;
    await this.#clearTelegramChat(chatId);

    const state = this.#getState(chatId);
    const workspace = await Workspace.get({ slug: state.workspaceSlug });
    const name = workspace?.name || state.workspaceSlug;

    let threadInfo = "Main";
    if (state.threadSlug) {
      const thread = await WorkspaceThread.get({ slug: state.threadSlug });
      if (thread) threadInfo = thread.name;
    }

    await this.#bot.sendMessage(
      chatId,
      `Chat cleared.\n\nWorkspace: ${name}\nThread: ${threadInfo}\n\nYour chat history in AnythingLLM is unchanged. Send a message to continue.`
    );
  }

  async #handleResume(msg) {
    const chatId = msg.chat.id;
    await this.#clearTelegramChat(chatId);

    const state = this.#getState(chatId);
    const workspace = await Workspace.get({ slug: state.workspaceSlug });
    const name = workspace?.name || state.workspaceSlug;

    let threadInfo = "Main";
    if (state.threadSlug) {
      const thread = await WorkspaceThread.get({ slug: state.threadSlug });
      if (thread) threadInfo = thread.name;
    }

    await this.#bot.sendMessage(chatId, `Resuming "${name}" → ${threadInfo}`);
    await this.#sendHistoryPreview(chatId, workspace, state.threadSlug);
  }

  /**
   * Delete recent messages from a Telegram chat.
   * Telegram doesn't let bots bulk-delete in private chats,
   * so we delete messages one by one going backwards.
   */
  async #clearTelegramChat(chatId) {
    const marker = await this.#bot.sendMessage(chatId, "Clearing...");
    const msgId = marker.message_id;

    // Try to delete the last 100 messages (Telegram limits to 48hr old messages)
    for (let i = msgId; i > Math.max(msgId - 100, 0); i--) {
      try {
        await this.#bot.deleteMessage(chatId, i);
      } catch {
        // Message doesn't exist or is too old — skip
      }
    }
  }

  // ─── Workspace/Thread switching ─────────────────────────────

  async #handleSwitch(msg) {
    await this.#showWorkspaceMenu(msg.chat.id);
  }

  async #showWorkspaceMenu(chatId, messageId = null) {
    const workspaces = await Workspace.where({});
    if (!workspaces.length) {
      await this.#bot.sendMessage(chatId, "No workspaces found.");
      return;
    }

    const state = this.#getState(chatId);
    const buttons = workspaces.map((ws) => {
      const isCurrent = ws.slug === state.workspaceSlug;
      return [
        {
          text: `${isCurrent ? "● " : ""}${ws.name}`,
          callback_data: `ws:${ws.slug}`,
        },
      ];
    });

    const opts = {
      reply_markup: { inline_keyboard: buttons },
    };

    if (messageId) {
      await this.#bot.editMessageText("Select a workspace:", {
        chat_id: chatId,
        message_id: messageId,
        ...opts,
      });
    } else {
      await this.#bot.sendMessage(chatId, "Select a workspace:", opts);
    }
  }

  async #showThreadMenu(chatId, workspaceSlug, messageId = null) {
    const workspace = await Workspace.get({ slug: workspaceSlug });
    if (!workspace) return;

    const threads = await WorkspaceThread.where(
      { workspace_id: workspace.id, user_id: null },
      null,
      { createdAt: "desc" }
    );

    const state = this.#getState(chatId);
    const buttons = [
      [
        {
          text: `${!state.threadSlug ? "● " : ""}Main`,
          callback_data: `th:${workspaceSlug}:main`,
        },
      ],
    ];

    for (const thread of threads) {
      const isCurrent = thread.slug === state.threadSlug;
      buttons.push([
        {
          text: `${isCurrent ? "● " : ""}${thread.name}`,
          callback_data: `th:${workspaceSlug}:${thread.slug}`,
        },
      ]);
    }

    buttons.push([
      {
        text: "← Back to workspaces",
        callback_data: "back:workspaces",
      },
    ]);

    const text = `"${workspace.name}" — Select a thread:`;
    const opts = {
      reply_markup: { inline_keyboard: buttons },
    };

    if (messageId) {
      await this.#bot.editMessageText(text, {
        chat_id: chatId,
        message_id: messageId,
        ...opts,
      });
    } else {
      await this.#bot.sendMessage(chatId, text, opts);
    }
  }

  async #handleCallback(query) {
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;
    const data = query.data;

    if (!this.#isVerified(chatId)) {
      await this.#bot.answerCallbackQuery(query.id, {
        text: "You are not approved.",
      });
      return;
    }

    try {
      if (data.startsWith("ws:")) {
        const workspaceSlug = data.slice(3);
        await this.#showThreadMenu(chatId, workspaceSlug, messageId);
        await this.#bot.answerCallbackQuery(query.id);
      } else if (data.startsWith("th:")) {
        const parts = data.slice(3).split(":");
        const workspaceSlug = parts[0];
        const threadSlug = parts[1] === "main" ? null : parts[1];

        this.#setState(chatId, { workspaceSlug, threadSlug });
        await this.#bot.answerCallbackQuery(query.id, { text: "Switched!" });

        // Clear old messages so the chat isn't confusing
        await this.#clearTelegramChat(chatId);

        const workspace = await Workspace.get({ slug: workspaceSlug });
        let threadName = "Main";
        if (threadSlug) {
          const thread = await WorkspaceThread.get({ slug: threadSlug });
          threadName = thread?.name || threadSlug;
        }

        await this.#bot.sendMessage(
          chatId,
          `Switched to "${workspace?.name}" → ${threadName}`
        );

        // Send history preview as separate messages so nothing gets cut off
        await this.#sendHistoryPreview(chatId, workspace, threadSlug);
      } else if (data === "back:workspaces") {
        await this.#showWorkspaceMenu(chatId, messageId);
        await this.#bot.answerCallbackQuery(query.id);
      }
    } catch (error) {
      this.#log("Callback error:", error.message);
      await this.#bot.answerCallbackQuery(query.id, {
        text: "Something went wrong.",
      });
    }
  }

  /**
   * Send recent chat history as separate messages so nothing gets cut off.
   * Groups exchanges into batches that fit within Telegram's 4096 char limit.
   */
  async #sendHistoryPreview(chatId, workspace, threadSlug) {
    if (!workspace) return;

    const thread = threadSlug
      ? await WorkspaceThread.get({ slug: threadSlug })
      : null;

    const rawChats = await WorkspaceChats.where(
      {
        workspaceId: workspace.id,
        user_id: null,
        thread_id: thread?.id || null,
        api_session_id: null,
        include: true,
      },
      HISTORY_PREVIEW_COUNT,
      { id: "desc" }
    );

    if (!rawChats.length) {
      await this.#bot.sendMessage(
        chatId,
        "No messages yet. Send a message to start chatting."
      );
      return;
    }

    const history = convertToChatHistory(rawChats.reverse());
    const separator = "\n━━━━━━━━━━━━━━━━━━━━\n";

    // Build individual exchange blocks (user + assistant pairs)
    const exchanges = [];
    for (let i = 0; i < history.length; i++) {
      const entry = history[i];
      if (entry.role === "user") {
        let block = `You: ${entry.content || ""}`;
        // Attach the assistant response if it immediately follows
        if (i + 1 < history.length && history[i + 1].role === "assistant") {
          block += `\n\nAI: ${history[i + 1].content || ""}`;
          i++;
        }
        exchanges.push(block);
      } else if (entry.role === "assistant") {
        exchanges.push(`AI: ${entry.content || ""}`);
      }
    }

    if (!exchanges.length) return;

    // Batch exchanges into messages that fit under Telegram's 4096 char limit
    const MAX_MSG_LEN = 4000; // leave some buffer
    const header = "━━━ Recent History ━━━\n";
    let currentMsg = header;

    for (let i = 0; i < exchanges.length; i++) {
      const block = exchanges[i];
      const addition = (i === 0 ? "" : separator) + block;

      if (currentMsg.length + addition.length > MAX_MSG_LEN) {
        // Send what we have so far
        await this.#bot.sendMessage(chatId, currentMsg.trim());
        currentMsg = block;
      } else {
        currentMsg += addition;
      }
    }

    // Send the remaining batch
    if (currentMsg.trim()) {
      await this.#bot.sendMessage(chatId, currentMsg.trim());
    }
  }

  async #handleNewThread(msg) {
    const chatId = msg.chat.id;
    const state = this.#getState(chatId);
    const workspace = await Workspace.get({ slug: state.workspaceSlug });
    if (!workspace) {
      await this.#bot.sendMessage(chatId, "No workspace configured.");
      return;
    }

    const { thread, message: error } = await WorkspaceThread.new(
      workspace,
      null,
      { name: "Telegram Thread" }
    );

    if (error || !thread) {
      await this.#bot.sendMessage(chatId, "Failed to create thread.");
      return;
    }

    this.#setState(chatId, { threadSlug: thread.slug });
    await this.#bot.sendMessage(
      chatId,
      `New thread created in "${workspace.name}". Your messages will now go here.`
    );
  }

  // ─── Message handling with streaming ────────────────────────

  async #handleMessage(msg) {
    if (!msg.text) return;
    const chatId = msg.chat.id;

    this.#queue.enqueue(chatId, async () => {
      const state = this.#getState(chatId);
      const workspace = await Workspace.get({ slug: state.workspaceSlug });
      if (!workspace) {
        await this.#bot.sendMessage(
          chatId,
          "No workspace configured. Use /switch to select one."
        );
        return;
      }

      const thread = state.threadSlug
        ? await WorkspaceThread.get({ slug: state.threadSlug })
        : null;

      try {
        await this.#streamResponse(chatId, workspace, thread, msg.text);
      } catch (error) {
        this.#log("Chat error:", error.message);
        await this.#bot.sendMessage(
          chatId,
          "Sorry, something went wrong. Please try again."
        );
      }
    });
  }

  /**
   * Stream a response to Telegram by progressively editing a message.
   * Uses the same pipeline as the web UI (RAG, pinned docs, etc.)
   * and stores chats with thread_id so they appear in the AnythingLLM UI.
   */
  async #streamResponse(chatId, workspace, thread, message) {
    // Show typing indicator while we prepare the response
    await this.#bot.sendChatAction(chatId, "typing");

    const chatMode = workspace.chatMode || "chat";
    const LLMConnector = getLLMProvider({
      provider: workspace?.chatProvider,
      model: workspace?.chatModel,
    });
    const VectorDb = getVectorDbClass();
    const messageLimit = workspace?.openAiHistory || 20;
    const hasVectorizedSpace = await VectorDb.hasNamespace(workspace.slug);
    const embeddingsCount = await VectorDb.namespaceCount(workspace.slug);

    if (
      (!hasVectorizedSpace || embeddingsCount === 0) &&
      chatMode === "query"
    ) {
      await this.#bot.sendMessage(
        chatId,
        workspace?.queryRefusalResponse ??
          "There is no relevant information in this workspace to answer your query."
      );
      return;
    }

    const { rawHistory, chatHistory } = await recentChatHistory({
      user: null,
      workspace,
      thread,
      messageLimit,
      apiSessionId: null,
    });

    let contextTexts = [];
    let sources = [];
    let pinnedDocIdentifiers = [];

    await new DocumentManager({
      workspace,
      maxTokens: LLMConnector.promptWindowLimit(),
    })
      .pinnedDocs()
      .then((pinnedDocs) => {
        pinnedDocs.forEach((doc) => {
          const { pageContent, ...metadata } = doc;
          pinnedDocIdentifiers.push(sourceIdentifier(doc));
          contextTexts.push(doc.pageContent);
          sources.push({
            text:
              pageContent.slice(0, 1_000) +
              "...continued on in source document...",
            ...metadata,
          });
        });
      });

    const vectorSearchResults =
      embeddingsCount !== 0
        ? await VectorDb.performSimilaritySearch({
            namespace: workspace.slug,
            input: message,
            LLMConnector,
            similarityThreshold: workspace?.similarityThreshold,
            topN: workspace?.topN,
            filterIdentifiers: pinnedDocIdentifiers,
            rerank: workspace?.vectorSearchMode === "rerank",
          })
        : { contextTexts: [], sources: [], message: null };

    if (vectorSearchResults.message) {
      await this.#bot.sendMessage(
        chatId,
        "Vector search failed. Please try again."
      );
      return;
    }

    const { fillSourceWindow } = require("../helpers/chat");
    const filledSources = fillSourceWindow({
      nDocs: workspace?.topN || 4,
      searchResults: vectorSearchResults.sources,
      history: rawHistory,
      filterIdentifiers: pinnedDocIdentifiers,
    });

    contextTexts = [...contextTexts, ...filledSources.contextTexts];
    sources = [...sources, ...vectorSearchResults.sources];

    if (chatMode === "query" && contextTexts.length === 0) {
      await this.#bot.sendMessage(
        chatId,
        workspace?.queryRefusalResponse ??
          "There is no relevant information in this workspace to answer your query."
      );
      return;
    }

    // Keep typing indicator alive while LLM prepares the stream
    const typingInterval = setInterval(() => {
      this.#bot.sendChatAction(chatId, "typing").catch(() => {});
    }, 4000);

    const messages = await LLMConnector.compressMessages(
      {
        systemPrompt: await chatPrompt(workspace, null),
        userPrompt: message,
        contextTexts,
        chatHistory,
        attachments: [],
      },
      rawHistory
    );

    let completeText = "";
    let metrics = {};

    try {
      if (LLMConnector.streamingEnabled() === true) {
        const stream = await LLMConnector.streamGetChatCompletion(messages, {
          temperature: workspace?.openAiTemp ?? LLMConnector.defaultTemp,
          user: null,
        });

        completeText = await this.#handleStreamToTelegram(
          chatId,
          stream,
          LLMConnector
        );
        metrics = stream.metrics || {};
      } else {
        const { textResponse, metrics: performanceMetrics } =
          await LLMConnector.getChatCompletion(messages, {
            temperature: workspace?.openAiTemp ?? LLMConnector.defaultTemp,
            user: null,
          });
        completeText = textResponse;
        metrics = performanceMetrics || {};

        if (completeText?.length > 0) {
          await this.#bot.sendMessage(chatId, completeText);
        }
      }
    } finally {
      clearInterval(typingInterval);
    }

    if (!completeText?.length) {
      await this.#bot.sendMessage(chatId, "No response generated.");
    }

    if (completeText?.length > 0) {
      await WorkspaceChats.new({
        workspaceId: workspace.id,
        prompt: message,
        response: {
          text: completeText,
          sources,
          type: chatMode,
          metrics,
          attachments: [],
        },
        threadId: thread?.id || null,
        apiSessionId: null,
        user: null,
      });
    }
  }

  /**
   * Handle a stream from an LLM provider by periodically editing a Telegram message.
   * Waits for the first chunk before sending any message (typing indicator shows until then).
   * @returns {Promise<string>} The complete response text.
   */
  async #handleStreamToTelegram(chatId, stream, LLMConnector) {
    let fullText = "";
    let messageId = null;
    let lastEditTime = 0;
    let editTimer = null;

    const mockResponse = {
      write: () => {},
      on: () => {},
      removeListener: () => {},
    };

    try {
      if (typeof stream[Symbol.asyncIterator] === "function") {
        for await (const chunk of stream) {
          const token = this.#extractToken(chunk);
          if (!token) continue;

          fullText += token;

          // Send the first message when the first token arrives
          if (messageId === null) {
            const sent = await this.#bot.sendMessage(
              chatId,
              fullText + " \u258d"
            );
            messageId = sent.message_id;
            lastEditTime = Date.now();
            continue;
          }

          const now = Date.now();
          if (now - lastEditTime >= STREAM_EDIT_INTERVAL) {
            clearTimeout(editTimer);
            lastEditTime = now;
            this.#editMessage(chatId, messageId, fullText + " \u258d").catch(
              () => {}
            );
          } else if (!editTimer) {
            editTimer = setTimeout(() => {
              lastEditTime = Date.now();
              this.#editMessage(chatId, messageId, fullText + " \u258d").catch(
                () => {}
              );
              editTimer = null;
            }, STREAM_EDIT_INTERVAL);
          }
        }
      } else {
        this.#log(`Using fallback stream for ${LLMConnector.constructor.name}`);
        fullText = await LLMConnector.handleStream(mockResponse, stream, {
          uuid: uuidv4(),
        });
      }
    } catch (error) {
      this.#log("Stream error:", error.message);
    }

    clearTimeout(editTimer);

    // Final edit to remove the cursor and show the complete text
    if (messageId && fullText.length > 0) {
      await this.#editMessage(chatId, messageId, fullText);
    } else if (!messageId && fullText.length > 0) {
      // Fallback stream path — never created a message via streaming
      await this.#bot.sendMessage(chatId, fullText);
    }

    return fullText;
  }

  #extractToken(chunk) {
    if (chunk?.type === "response.output_text.delta") return chunk.delta;
    if (chunk?.choices?.[0]?.delta?.content)
      return chunk.choices[0].delta.content;
    if (chunk?.type === "content_block_delta" && chunk?.delta?.text)
      return chunk.delta.text;
    if (typeof chunk === "string") return chunk;
    return null;
  }

  async #editMessage(chatId, messageId, text) {
    if (!text || !this.#bot) return;
    const truncated = text.length > 4096 ? text.slice(0, 4090) + "\n..." : text;

    try {
      await this.#bot.editMessageText(truncated, {
        chat_id: chatId,
        message_id: messageId,
      });
    } catch (error) {
      if (!error.message?.includes("message is not modified")) {
        this.#log("Edit error:", error.message);
      }
    }
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
   */
  static async bootIfActive() {
    try {
      const connector = await ExternalConnector.get("telegram");
      if (!connector || !connector.active || !connector.config?.bot_token)
        return;

      const service = new TelegramBotService();
      await service.start(connector.config);
    } catch (error) {
      console.error("[TelegramBot] Failed to boot:", error.message);
    }
  }
}

module.exports = { TelegramBotService };
