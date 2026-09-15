jest.mock("@larksuiteoapi/node-sdk", () => ({
  ...jest.requireActual("@larksuiteoapi/node-sdk"),
  createLarkChannel: jest.fn(),
}));
jest.mock("../../../models/externalCommunicationConnector", () => ({
  ExternalCommunicationConnector: { get: jest.fn() },
}));
jest.mock("../../../models/systemSettings", () => ({
  SystemSettings: { isMultiUserMode: jest.fn() },
}));
jest.mock("../../../utils/externalChannels/credentials", () => ({
  decryptConnectorSecret: jest.fn(),
}));

const {
  createLarkChannel,
  Domain,
  LoggerLevel,
} = require("@larksuiteoapi/node-sdk");
const {
  ExternalCommunicationConnector,
} = require("../../../models/externalCommunicationConnector");
const { SystemSettings } = require("../../../models/systemSettings");
const {
  decryptConnectorSecret,
} = require("../../../utils/externalChannels/credentials");
const { LarkChannelService } = require("../../../utils/larkChannel");

const config = {
  platform: "lark",
  app_id: "cli_1",
  app_secret: "plaintext-secret",
};
let service, channel, handlers, unsubscribe;
function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}

beforeEach(() => {
  jest.clearAllMocks();
  service = new LarkChannelService();
  handlers = {};
  unsubscribe = jest.fn();
  channel = {
    connect: jest.fn().mockResolvedValue(undefined),
    disconnect: jest.fn().mockResolvedValue(undefined),
    on: jest.fn((events) => {
      Object.assign(handlers, events);
      return unsubscribe;
    }),
    botIdentity: { openId: "ou_bot", name: "Bot" },
    rawWsClient: { close: jest.fn() },
  };
  createLarkChannel.mockReturnValue(channel);
  SystemSettings.isMultiUserMode.mockResolvedValue(false);
  jest.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(async () => {
  await service.stop();
  jest.restoreAllMocks();
});

test("shares a singleton and sends plaintext credentials with the official channel policy", async () => {
  await service.start(config);
  expect(new LarkChannelService()).toBe(service);
  expect(decryptConnectorSecret).not.toHaveBeenCalled();
  expect(createLarkChannel).toHaveBeenCalledWith(
    expect.objectContaining({
      appId: "cli_1",
      appSecret: "plaintext-secret",
      domain: Domain.Lark,
      transport: "websocket",
      loggerLevel: LoggerLevel.warn,
      policy: {
        requireMention: true,
        dmMode: "open",
        respondToMentionAll: false,
      },
      includeRawInMessage: false,
    })
  );
  expect(Object.keys(handlers).sort()).toEqual([
    "error",
    "reconnected",
    "reconnecting",
  ]);
  expect(service.status).toMatchObject({
    connected: true,
    connection_state: "connected",
    bot_name: "Bot",
    bot_open_id: "ou_bot",
  });
  expect(JSON.stringify(service)).not.toContain("plaintext-secret");
});

test("does not report connected until connect resolves after the handshake", async () => {
  const handshake = deferred();
  channel.connect.mockReturnValue(handshake.promise);
  const start = service.start({ ...config, platform: "feishu" });
  await Promise.resolve();
  expect(service.status).toMatchObject({
    connection_state: "connecting",
    connected: false,
  });
  expect(createLarkChannel.mock.calls[0][0].domain).toBe(Domain.Feishu);
  handshake.resolve();
  await start;
  expect(service.status.connected).toBe(true);
});

test("reports reconnect transitions and only safe error categories and timestamps", async () => {
  await service.start(config);
  handlers.reconnecting();
  expect(service.status).toMatchObject({
    connected: false,
    connection_state: "reconnecting",
  });
  handlers.error({
    code: "rate_limited",
    message: "plaintext-secret",
    cause: { raw: "sensitive-response" },
  });
  expect(service.status.last_error).toEqual({
    category: "rate_limited",
    timestamp: expect.any(String),
  });
  expect(Number.isNaN(Date.parse(service.status.last_error.timestamp))).toBe(
    false
  );
  handlers.reconnected();
  expect(service.status).toMatchObject({
    connected: true,
    connection_state: "connected",
  });
  const snapshot = service.status;
  snapshot.last_error.category = "tampered";
  expect(service.status.last_error.category).toBe("rate_limited");
  handlers.error({ code: "plaintext-secret", message: "sensitive-response" });
  expect(service.status.last_error.category).toBe("unknown");
  expect(JSON.stringify([service.status, console.warn.mock.calls])).not.toMatch(
    /plaintext-secret|sensitive-response/
  );
});

test("disables raw SDK logging even when it includes credentials and payloads", async () => {
  await service.start(config);
  const { logger } = createLarkChannel.mock.calls[0][0];
  for (const method of ["error", "warn", "info", "debug", "trace"]) {
    logger[method]("plaintext-secret", { raw: "sensitive-response" });
  }
  expect(console.warn).not.toHaveBeenCalled();
});

test("stop disconnects once, unsubscribes, clears identity, and ignores stale callbacks", async () => {
  await service.start(config);
  await Promise.all([service.stop(), service.stop()]);
  handlers.reconnected();
  handlers.error({ code: "permission_denied" });
  expect(channel.disconnect).toHaveBeenCalledTimes(1);
  expect(channel.rawWsClient.close).not.toHaveBeenCalled();
  expect(unsubscribe).toHaveBeenCalledTimes(1);
  expect(service.status).toEqual({
    connected: false,
    connection_state: "disconnected",
    bot_name: null,
    bot_open_id: null,
    last_error: null,
  });
});

test("permission-denied handshake failure is sanitized and never retried by the service", async () => {
  channel.connect.mockRejectedValue({
    code: "permission_denied",
    message: "plaintext-secret",
    response: "sensitive-response",
  });
  await expect(service.start(config)).rejects.toMatchObject({
    message: "permission_denied",
    code: "permission_denied",
  });
  expect(service.status).toMatchObject({
    connected: false,
    connection_state: "failed",
    last_error: { category: "permission_denied" },
  });
  expect(channel.connect).toHaveBeenCalledTimes(1);
  expect(createLarkChannel).toHaveBeenCalledTimes(1);
  expect(channel.rawWsClient.close).toHaveBeenCalledWith({ force: true });
  expect(channel.disconnect).toHaveBeenCalledTimes(1);
  expect(unsubscribe).toHaveBeenCalledTimes(1);
  handlers.reconnected();
  handlers.error({ code: "unknown" });
  expect(service.status).toMatchObject({
    connection_state: "failed",
    bot_name: null,
    bot_open_id: null,
    last_error: { category: "permission_denied" },
  });
  expect(JSON.stringify([service.status, console.warn.mock.calls])).not.toMatch(
    /plaintext-secret|sensitive-response/
  );
});

test("stop during handshake force-closes retries and cannot be resurrected by late success", async () => {
  const handshake = deferred();
  channel.connect.mockReturnValue(handshake.promise);
  const start = service.start(config);
  await Promise.resolve();
  const stop = service.stop();
  expect(channel.rawWsClient.close).toHaveBeenCalledWith({ force: true });
  handshake.resolve();
  await Promise.all([start, stop]);
  expect(channel.disconnect).toHaveBeenCalledTimes(1);
  expect(service.status.connection_state).toBe("disconnected");
});

test("cleanup failure does not replace or expose the primary connection error", async () => {
  channel.connect.mockRejectedValue({ code: "permission_denied" });
  channel.rawWsClient.close.mockImplementation(() => {
    throw new Error("plaintext-secret");
  });
  channel.disconnect.mockRejectedValue(new Error("sensitive-response"));
  await expect(service.start(config)).rejects.toMatchObject({
    code: "permission_denied",
  });
  expect(service.status.last_error.category).toBe("permission_denied");
});

test("shutdown cleanup errors are recorded safely without exposing the SDK response", async () => {
  await service.start(config);
  channel.disconnect.mockRejectedValue(new Error("sensitive-response"));
  await service.stop();
  expect(service.status).toMatchObject({
    connection_state: "disconnected",
    last_error: { category: "unknown" },
  });
  expect(JSON.stringify(console.warn.mock.calls)).not.toContain(
    "sensitive-response"
  );
});

test("restart disconnects the old channel and ignores its callbacks", async () => {
  await service.start(config);
  const oldHandlers = { ...handlers };
  const replacement = {
    ...channel,
    connect: jest.fn().mockResolvedValue(),
    disconnect: jest.fn().mockResolvedValue(),
  };
  createLarkChannel.mockReturnValue(replacement);
  await service.start({ ...config, app_id: "cli_2" });
  oldHandlers.reconnecting();
  oldHandlers.error({ code: "permission_denied" });
  expect(channel.disconnect).toHaveBeenCalledTimes(1);
  expect(service.status).toMatchObject({ connected: true, last_error: null });
  await service.stop();
  expect(replacement.disconnect).toHaveBeenCalledTimes(1);
});

test("reconnected events before initial handshake cannot report a connected service", async () => {
  const handshake = deferred();
  channel.connect.mockReturnValue(handshake.promise);
  const start = service.start(config);
  await Promise.resolve();
  handlers.reconnected();
  expect(service.status.connected).toBe(false);
  handshake.resolve();
  await start;
});

test("failed startup cleans up when no underlying WebSocket has been created", async () => {
  delete channel.rawWsClient;
  channel.connect.mockRejectedValue({ code: "permission_denied" });
  await expect(service.start(config)).rejects.toMatchObject({
    code: "permission_denied",
  });
  expect(channel.disconnect).toHaveBeenCalledTimes(1);
});

test("boot decrypts stored active credentials without mutating the record", async () => {
  const stored = { ...config, app_secret: "enc:cipher" };
  ExternalCommunicationConnector.get.mockResolvedValue({
    active: true,
    config: stored,
  });
  decryptConnectorSecret.mockReturnValue("plaintext-secret");
  await LarkChannelService.bootIfActive();
  expect(decryptConnectorSecret).toHaveBeenCalledWith("enc:cipher");
  expect(createLarkChannel.mock.calls[0][0].appSecret).toBe("plaintext-secret");
  expect(stored.app_secret).toBe("enc:cipher");
  expect(service.status.connected).toBe(true);
});

test.each([null, { active: false, config }])(
  "boot skips absent or inactive connectors",
  async (connector) => {
    ExternalCommunicationConnector.get.mockResolvedValue(connector);
    await LarkChannelService.bootIfActive();
    expect(createLarkChannel).not.toHaveBeenCalled();
  }
);

test("boot skips multi-user mode", async () => {
  ExternalCommunicationConnector.get.mockResolvedValue({
    active: true,
    config,
  });
  SystemSettings.isMultiUserMode.mockResolvedValue(true);
  await LarkChannelService.bootIfActive();
  expect(createLarkChannel).not.toHaveBeenCalled();
});

test("boot failures are non-fatal with sanitized failed status", async () => {
  ExternalCommunicationConnector.get.mockResolvedValue({
    active: true,
    config,
  });
  decryptConnectorSecret.mockReturnValue(null);
  await expect(LarkChannelService.bootIfActive()).resolves.toBeUndefined();
  expect(createLarkChannel).not.toHaveBeenCalled();
  expect(service.status).toMatchObject({
    connection_state: "failed",
    last_error: { category: "permission_denied" },
  });
});
