const { createLarkChannel, LoggerLevel } = require("@larksuiteoapi/node-sdk");
const {
  ExternalCommunicationConnector,
} = require("../../models/externalCommunicationConnector");
const { SystemSettings } = require("../../models/systemSettings");
const { decryptConnectorSecret } = require("../externalChannels/credentials");
const { domainForPlatform, sanitizedError } = require("./config");
const { randomUUID } = require("node:crypto");
const { PairingAccess } = require("../externalChannels/access");
const { ChannelStateStore } = require("../externalChannels/state");
const { KeyedSerialExecutor } = require("../externalChannels/messageQueue");
const { ExternalChannelChatRunner } = require("../externalChannels/chat");
const { parseLarkCommand, handleLarkCommand } = require("./commands");
const { createLarkTransport } = require("./transport");
const {
  normalizeLarkAttachments,
  SUPPORTED_TYPES,
  publicAttachmentError,
} = require("./attachments");

const MESSAGE_WINDOW_MS = 10 * 60 * 1000;
const PUBLIC_FAILURE = "Sorry, something went wrong. Please try again.";

// SDK diagnostics can contain HTTP bodies and credentials. Use only the
// sanitized public error events below for application logging.
const SDK_LOGGER = Object.freeze({
  error() {},
  warn() {},
  info() {},
  debug() {},
  trace() {},
});

class LarkChannelService {
  static #instance = null;
  #session = null;
  #generation = 0;
  #connectionState = "disconnected";
  #lastError = null;

  constructor() {
    if (LarkChannelService.#instance) return LarkChannelService.#instance;
    LarkChannelService.#instance = this;
  }

  get status() {
    const identity = this.#session?.connected
      ? this.#session.channel.botIdentity
      : null;
    return {
      connected: this.#connectionState === "connected",
      connection_state: this.#connectionState,
      bot_name: identity?.name || null,
      bot_open_id: identity?.openId || null,
      last_error: this.#lastError ? { ...this.#lastError } : null,
    };
  }

  async start(config) {
    const generation = ++this.#generation;
    const previous = this.#session;
    this.#session = null;
    await this.#dispose(previous);
    if (generation !== this.#generation) return this.status;

    this.#connectionState = "connecting";
    this.#lastError = null;
    let session;
    try {
      const channel = createLarkChannel({
        appId: config.app_id,
        appSecret: config.app_secret,
        domain: domainForPlatform(config.platform),
        transport: "websocket",
        loggerLevel: LoggerLevel.warn,
        logger: SDK_LOGGER,
        policy: {
          requireMention: true,
          dmMode: "open",
          respondToMentionAll: false,
        },
        includeRawInMessage: false,
        includeRawEvent: false,
        // The SDK otherwise queues card actions behind the message awaiting
        // their approval. Message ordering belongs to our keyed executor.
        safety: { chatQueue: { enabled: false } },
      });
      session = {
        channel,
        config,
        connected: false,
        access: new PairingAccess({ connectorType: "lark" }),
        state: new ChannelStateStore({ connectorType: "lark", config }),
        executor: new KeyedSerialExecutor(),
        mutations: new KeyedSerialExecutor(),
        runner: new ExternalChannelChatRunner(),
        controller: new AbortController(),
        seen: new Map(),
        active: new Set(),
        work: new Set(),
        approvals: new Map(),
        revoked: new Set(),
        accessVersions: new Map(),
        turns: new Map(),
      };
      this.#session = session;
      this.#registerEvents(session);
      session.connectPromise = channel.connect();
      await session.connectPromise;
      session.connected = true;
      if (generation !== this.#generation) {
        await this.#dispose(session);
        return this.status;
      }
      this.#connectionState = "connected";
      return this.status;
    } catch (error) {
      const safe = sanitizedError(error);
      if (generation === this.#generation) {
        this.#session = null;
        this.#connectionState = "failed";
        this.#recordError(safe);
      }
      await this.#dispose(session);
      // Never forward SDK error messages, causes, contexts, or HTTP responses.
      throw Object.assign(new Error(safe.category), { code: safe.category });
    }
  }

  #registerEvents(session) {
    session.unsubscribe = session.channel.on({
      message: (message) => this.#receiveMessage(session, message),
      cardAction: (event) => this.#receiveCardAction(session, event),
      reconnecting: () => {
        if (this.#session !== session) return;
        this.#connectionState = "reconnecting";
      },
      reconnected: () => {
        if (this.#session !== session || !session.connected) return;
        this.#connectionState = "connected";
      },
      error: (error) => {
        if (this.#session !== session) return;
        this.#recordError(sanitizedError(error));
      },
    });
  }

  #receiveMessage(session, message) {
    if (this.#session !== session || session.controller.signal.aborted) return;
    const now = Date.now();
    if (
      !message ||
      !["p2p", "group"].includes(message.chatType) ||
      (message.chatType === "group" && !message.mentionedBot) ||
      typeof message.senderId !== "string" ||
      !/^ou_[A-Za-z0-9_-]+$/.test(message.senderId) ||
      message.senderId === session.channel.botIdentity?.openId ||
      typeof message.chatId !== "string" ||
      !message.chatId ||
      typeof message.messageId !== "string" ||
      !message.messageId ||
      !Number.isFinite(message.createTime) ||
      message.createTime <= 0 ||
      now - message.createTime > MESSAGE_WINDOW_MS ||
      message.createTime > now + 60000
    )
      return;
    for (const [id, time] of session.seen) {
      if (now - time > MESSAGE_WINDOW_MS) session.seen.delete(id);
    }
    if (session.seen.has(message.messageId)) return;
    // Bound remembered IDs without evicting admissible duplicates under load.
    if (session.seen.size >= 10000) return;
    session.seen.set(message.messageId, now);
    const key = `${session.config.platform}:${message.chatId}:${message.senderId}`;
    const work = session.executor
      .run(key, () => this.#handleMessage(session, message, key), {
        signal: session.controller.signal,
      })
      .catch((error) => {
        if (this.#session === session && error?.name !== "AbortError")
          this.#recordError(sanitizedError(error));
      });
    session.work.add(work);
    work.finally(() => session.work.delete(work));
    return work;
  }

  #approved(session, openId) {
    return (
      !session.revoked.has(openId) &&
      session.access.isApproved(session.config, openId)
    );
  }

  #mutate(session, work) {
    const pending = session.mutations.run("config", work, {
      signal: session.controller.signal,
    });
    session.work.add(pending);
    pending.then(
      () => session.work.delete(pending),
      () => session.work.delete(pending)
    );
    return pending;
  }

  listPendingUsers() {
    if (!this.status.connected) return [];
    return this.#session.access.listPending();
  }

  listApprovedUsers() {
    if (!this.status.connected) return [];
    return (this.#session.config.approved_users || [])
      .filter((user) => this.#approved(this.#session, user.open_id))
      .map((user) => ({
        open_id: user.open_id,
        name: user.name,
        platform: user.platform,
        active_workspace: user.active_workspace || null,
        active_thread: user.active_thread || null,
      }));
  }

  async approveUser(openId) {
    const session = this.#session;
    if (!this.status.connected) return { error: "Lark is not connected." };
    const id = String(openId);
    const version = session.accessVersions.get(id);
    try {
      const result = await this.#mutate(session, () =>
        session.access.approve(session.config, openId)
      );
      if (result.error)
        return {
          error:
            result.error === "Pairing request expired"
              ? result.error
              : "Could not update Lark access.",
        };
      if (session.accessVersions.get(id) !== version)
        return { error: "Pairing request denied." };
      session.revoked.delete(String(openId));
      return {
        open_id: result.open_id,
        name: result.name,
        platform: result.platform,
        active_workspace: result.active_workspace || null,
        active_thread: result.active_thread || null,
      };
    } catch {
      return { error: "Could not update Lark access." };
    }
  }

  async denyUser(openId) {
    const session = this.#session;
    if (!this.status.connected) return { error: "Lark is not connected." };
    const id = String(openId);
    this.#invalidateAccess(session, id);
    try {
      const result = await this.#mutate(session, async () => {
        session.access.deny(id);
        // An approval already writing when denial arrived may have committed.
        // Do not report a successful denial until its grant is removed too.
        if (session.access.isApproved(session.config, id))
          return session.access.revoke(session.config, id);
      });
      return result?.error
        ? { error: "Could not update Lark access." }
        : { success: true };
    } catch {
      return { error: "Could not update Lark access." };
    }
  }

  #invalidateAccess(session, id) {
    session.accessVersions.set(id, (session.accessVersions.get(id) || 0) + 1);
    session.revoked.add(id);
    for (const [key, turn] of session.turns) {
      if (turn.senderId !== id) continue;
      turn.controller.abort();
      session.runner.abort(key);
    }
    for (const pending of session.approvals.values()) {
      if (pending.senderId === id) pending.finish(false);
    }
  }

  async revokeUser(openId) {
    const session = this.#session;
    if (!this.status.connected) return { error: "Lark is not connected." };
    const id = String(openId);
    if (!session.access.isApproved(session.config, id))
      return { error: "User is not approved." };
    // Block new/queued work immediately, before the persistence round trip.
    // A failed persistence write stays denied in this running session.
    this.#invalidateAccess(session, id);
    session.access.deny(id);
    try {
      const result = await this.#mutate(session, () =>
        session.access.revoke(session.config, id)
      );
      return result?.error
        ? { error: "Could not update Lark access." }
        : { success: true };
    } catch {
      return { error: "Could not update Lark access." };
    }
  }

  async #handleMessage(session, message, key) {
    const { channel, config, access, state } = session;
    const reply = (text) =>
      channel.send(
        message.chatId,
        { text },
        message.chatType === "group" ? { replyTo: message.messageId } : {}
      );
    if (!this.#approved(session, message.senderId)) {
      if (message.chatType === "group")
        return reply("Open a direct chat with this bot to request access.");
      const pending = access.request({
        userId: message.senderId,
        name: message.senderName || "Lark user",
        platform: config.platform,
      });
      return reply(
        `Your pairing code is ${pending.code}. Ask your AnythingLLM administrator to approve your access.`
      );
    }
    let content = typeof message.content === "string" ? message.content : "";
    // The SDK strips bot mentions already. Retain a defensive placeholder pass
    // using only normalized mention metadata, preserving other users' mentions.
    for (const mention of message.mentions || []) {
      if (
        (mention.isBot || mention.openId === channel.botIdentity?.openId) &&
        mention.key
      )
        content = content.split(mention.key).join("");
    }
    content = content.trim();
    session.active.add(key);
    const controller = new AbortController();
    const abort = () => controller.abort();
    session.controller.signal.addEventListener("abort", abort, { once: true });
    session.turns.set(key, { controller, senderId: message.senderId });
    try {
      const command = parseLarkCommand(content);
      if (command)
        return await this.#mutate(session, () =>
          handleLarkCommand({
            command: command.name,
            args: command.args,
            userId: message.senderId,
            chatId: message.chatId,
            stateStore: state,
            channel,
            message,
            signal: controller.signal,
            isAuthorized: () => this.#approved(session, message.senderId),
          })
        );
      if (
        ["audio", "media", "video", "sticker"].includes(message.rawContentType)
      )
        return reply(SUPPORTED_TYPES);
      const selection = state.get(message.senderId);
      if (!selection?.workspaceSlug)
        return reply("No workspace configured. Use /workspace to select one.");
      let normalized;
      try {
        normalized = await normalizeLarkAttachments({
          channel,
          resources: message.resources,
          sizeLimit: config.attachment_size_limit,
          signal: controller.signal,
          // The server and collector share hotdir in supported deployments.
          tempRoot: require("../files").hotdirPath,
          parseDocument: async (name, options) => {
            const { CollectorApi } = require("../collectorApi");
            const collector = new CollectorApi();
            return collector.parseDocument(name, {
              ...options,
              safeLogging: true,
              signal: controller.signal,
            });
          },
        });
      } catch (error) {
        if (controller.signal.aborted) return;
        return reply(publicAttachmentError(error));
      }
      if (
        controller.signal.aborted ||
        !this.#approved(session, message.senderId)
      )
        return;
      const attachments = normalized.attachments
        .filter((item) => item.mime.startsWith("image/"))
        .map((item) => ({
          ...item,
          contentString: `data:${item.mime};base64,${item.contentString}`,
        }));
      const prompt =
        [content, normalized.documentText].filter(Boolean).join("\n\n") ||
        (attachments.length ? "Describe the attached image." : "");
      if (!prompt) return;
      const transport = this.#transport(session, message, key);
      await session.runner.run(
        { conversationId: key, ...selection, message: prompt, attachments },
        transport
      );
    } finally {
      session.active.delete(key);
      session.turns.delete(key);
      session.controller.signal.removeEventListener("abort", abort);
      for (const pending of session.approvals.values()) {
        if (pending.key === key) pending.finish(false);
      }
    }
  }

  #transport(session, message, key) {
    // Action eligibility is one-shot, but its decision must survive until the
    // SDK acknowledges sending the card and the transport asks for the result.
    const decisions = new Map();
    const transport = createLarkTransport({
      channel: session.channel,
      message,
      onToolApproval: (request) =>
        decisions.get(request.requestId) || {
          approved: false,
        },
    });
    const requestApproval = transport.requestToolApproval;
    transport.requestToolApproval = async (request) => {
      if (
        session.controller.signal.aborted ||
        !session.active.has(key) ||
        !this.#approved(session, message.senderId)
      )
        return { approved: false };
      const requestId = randomUUID();
      const timeout = Number.isFinite(request.timeoutMs)
        ? Math.max(0, Math.min(request.timeoutMs, 120000))
        : 120000;
      const expiresAt = Math.min(
        Number.isFinite(request.expiresAt) ? request.expiresAt : Infinity,
        Date.now() + timeout
      );
      if (expiresAt <= Date.now()) return { approved: false };
      let resolve;
      const promise = new Promise((done) => {
        resolve = done;
      });
      const pending = {
        key,
        senderId: message.senderId,
        chatId: message.chatId,
        expiresAt,
        promise,
        finish: (approved) => {
          if (session.approvals.get(requestId) !== pending) return;
          session.approvals.delete(requestId);
          clearTimeout(pending.timer);
          resolve({ approved });
        },
      };
      session.approvals.set(requestId, pending);
      decisions.set(requestId, promise);
      pending.timer = setTimeout(
        () => pending.finish(false),
        expiresAt - Date.now()
      );
      pending.timer.unref?.();
      try {
        const decision = await requestApproval({ ...request, requestId });
        if (
          session.controller.signal.aborted ||
          !this.#approved(session, message.senderId) ||
          !session.active.has(key) ||
          expiresAt <= Date.now()
        )
          return { approved: false };
        return decision;
      } finally {
        pending.finish(false);
        decisions.delete(requestId);
      }
    };
    const fail = transport.fail;
    transport.fail = () => fail(PUBLIC_FAILURE);
    return transport;
  }

  #receiveCardAction(session, event) {
    if (this.#session !== session || session.controller.signal.aborted) return;
    const value = event?.action?.value;
    if (
      event?.action?.tag !== "button" ||
      !value ||
      typeof value !== "object" ||
      typeof value.requestId !== "string" ||
      !["approve", "deny"].includes(value.action)
    )
      return;
    const pending = session.approvals.get(value.requestId);
    if (
      !pending ||
      !session.active.has(pending.key) ||
      pending.expiresAt <= Date.now() ||
      event.chatId !== pending.chatId ||
      event.operator?.openId !== pending.senderId ||
      !this.#approved(session, pending.senderId)
    )
      return;
    pending.finish(value.action === "approve");
  }

  #recordError(safe) {
    this.#lastError = safe;
    console.warn("[LarkChannel]", safe.category, safe.timestamp);
  }

  #recordCleanupError(error) {
    if (!this.#session && !this.#lastError)
      this.#recordError(sanitizedError(error));
  }

  #closeIncompleteHandshake(session) {
    if (session.connected) return;
    // SDK 1.74.0 disconnect() is a no-op until its first successful handshake.
    // Its public WS escape hatch is needed to cancel retries on failed startup.
    try {
      session.channel.rawWsClient?.close?.({ force: true });
    } catch (error) {
      // Best-effort cleanup must not replace the sanitized primary failure.
      this.#recordCleanupError(error);
    }
  }

  async #dispose(session) {
    if (!session) return;
    if (session.disposePromise) return session.disposePromise;
    session.disposePromise = (async () => {
      session.unsubscribe?.();
      session.controller.abort();
      for (const pending of session.approvals.values()) pending.finish(false);
      for (const key of session.active) session.runner.abort(key);
      session.access.pendingPairings.clear();
      this.#closeIncompleteHandshake(session);
      try {
        await session.connectPromise;
        session.connected = true;
      } catch {
        // Startup owns reporting the sanitized primary failure.
      }
      // A WS client may have been created after stop while bot lookup awaited.
      this.#closeIncompleteHandshake(session);
      try {
        await session.channel.disconnect();
      } catch (error) {
        // Do not leak cleanup errors or obscure the primary connection error.
        this.#recordCleanupError(error);
      }
      await Promise.allSettled([...session.work]);
    })();
    return session.disposePromise;
  }

  async stop() {
    ++this.#generation;
    const session = this.#session;
    this.#session = null;
    this.#connectionState = "disconnected";
    this.#lastError = null;
    await this.#dispose(session);
  }

  static async bootIfActive() {
    const service = new LarkChannelService();
    const generation = service.#generation;
    try {
      const connector = await ExternalCommunicationConnector.get("lark");
      if (generation !== service.#generation) return;
      if (!connector?.active) return;
      if (await SystemSettings.isMultiUserMode()) return;
      if (generation !== service.#generation) return;
      const appSecret = decryptConnectorSecret(connector.config?.app_secret);
      if (!appSecret) {
        throw Object.assign(new Error("permission_denied"), {
          code: "permission_denied",
        });
      }
      await service.start({ ...connector.config, app_secret: appSecret });
    } catch (error) {
      // A newer lifecycle owns status. start() also advances the generation
      // and reports its own failures, so boot must not report them again.
      if (generation !== service.#generation) return;
      service.#connectionState = "failed";
      service.#recordError(sanitizedError(error));
    }
  }
}

module.exports = { LarkChannelService };
