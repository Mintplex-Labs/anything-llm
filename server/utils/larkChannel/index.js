const { createLarkChannel, LoggerLevel } = require("@larksuiteoapi/node-sdk");
const {
  ExternalCommunicationConnector,
} = require("../../models/externalCommunicationConnector");
const { SystemSettings } = require("../../models/systemSettings");
const { decryptConnectorSecret } = require("../externalChannels/credentials");
const { domainForPlatform, sanitizedError } = require("./config");

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
      });
      session = { channel, connected: false };
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
    // Task 6 adds message registration here, before connect can deliver events.
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
    try {
      const connector = await ExternalCommunicationConnector.get("lark");
      if (!connector?.active) return;
      if (await SystemSettings.isMultiUserMode()) return;
      const appSecret = decryptConnectorSecret(connector.config?.app_secret);
      if (!appSecret) {
        throw Object.assign(new Error("permission_denied"), {
          code: "permission_denied",
        });
      }
      await service.start({ ...connector.config, app_secret: appSecret });
    } catch (error) {
      service.#connectionState = "failed";
      service.#recordError(sanitizedError(error));
    }
  }
}

module.exports = { LarkChannelService };
