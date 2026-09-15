jest.mock("@larksuiteoapi/node-sdk", () => ({
  ...jest.requireActual("@larksuiteoapi/node-sdk"),
  createLarkChannel: jest.fn(),
}));
jest.mock("../../../models/externalCommunicationConnector", () => ({
  ExternalCommunicationConnector: {
    get: jest.fn(),
    updateConfig: jest.fn(),
    delete: jest.fn(),
  },
}));
jest.mock("../../../models/systemSettings", () => ({
  SystemSettings: { isMultiUserMode: jest.fn() },
}));
jest.mock("../../../utils/externalChannels/credentials", () => ({
  decryptConnectorSecret: jest.fn(),
}));
jest.mock("../../../utils/externalChannels/chat", () => ({
  ExternalChannelChatRunner: jest
    .fn()
    .mockImplementation(() => ({ run: mockRun, abort: mockAbort })),
}));
jest.mock("../../../models/workspace", () => ({
  Workspace: { get: jest.fn(), where: jest.fn() },
}));
jest.mock("../../../models/workspaceThread", () => ({
  WorkspaceThread: { get: jest.fn(), new: jest.fn() },
}));
jest.mock("../../../models/workspaceChats", () => ({
  WorkspaceChats: { markThreadHistoryInvalidV2: jest.fn() },
}));
jest.mock("../../../utils/helpers", () => ({
  getBaseLLMProviderModel: jest.fn(),
}));
jest.mock("../../../utils/files", () => ({
  hotdirPath: require("node:os").tmpdir(),
}));
jest.mock("../../../utils/collectorApi", () => ({
  CollectorApi: jest
    .fn()
    .mockImplementation(() => ({ parseDocument: mockParse })),
}));
const mockRun = jest.fn(),
  mockAbort = jest.fn(),
  mockParse = jest.fn();

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
  default_workspace: "general",
  attachment_size_limit: null,
};
function message(overrides = {}) {
  return {
    messageId: "om_1",
    chatId: "oc_1",
    chatType: "p2p",
    senderId: "ou_user",
    content: "Hello",
    rawContentType: "text",
    resources: [],
    mentions: [],
    mentionAll: false,
    mentionedBot: false,
    createTime: Date.now(),
    ...overrides,
  };
}
function approvedConfig() {
  return {
    ...config,
    default_workspace: "general",
    approved_users: [
      {
        open_id: "ou_user",
        name: "User",
        active_workspace: "research",
        active_thread: "paper",
      },
    ],
  };
}

test("unapproved DM gets a pairing code without state, attachment, or model work", async () => {
  const {
    ChannelStateStore,
  } = require("../../../utils/externalChannels/state");
  const stateRead = jest.spyOn(ChannelStateStore.prototype, "get");
  await service.start(config);
  await handlers.message(
    message({
      resources: [{ type: "file", fileKey: "file_1", fileName: "a.txt" }],
    })
  );
  expect(channel.send.mock.calls[0][1].text).toMatch(/\b\d{6}\b/);
  expect(channel.downloadResource).not.toHaveBeenCalled();
  expect(stateRead).not.toHaveBeenCalled();
  expect(mockRun).not.toHaveBeenCalled();
});

test("unapproved group mention never creates or exposes a pairing code", async () => {
  const { PairingAccess } = require("../../../utils/externalChannels/access");
  const pairing = jest.spyOn(PairingAccess.prototype, "request");
  await service.start(config);
  await handlers.message(message({ chatType: "group", mentionedBot: true }));
  expect(channel.send.mock.calls[0][1].text).toMatch(/direct/i);
  expect(channel.send.mock.calls[0][1].text).not.toMatch(/\d{6}/);
  expect(pairing).not.toHaveBeenCalled();
  expect(mockRun).not.toHaveBeenCalled();
});

test("approved direct sender reaches shared runner with saved workspace/thread and conversation key", async () => {
  await service.start(approvedConfig());
  await handlers.message(message());
  expect(mockRun).toHaveBeenCalledWith(
    expect.objectContaining({
      conversationId: "lark:oc_1:ou_user",
      workspaceSlug: "research",
      threadSlug: "paper",
      message: "Hello",
      attachments: [],
    }),
    expect.objectContaining({ requestToolApproval: expect.any(Function) })
  );
});

test("group strips only bot mention placeholders and uses source message for replies", async () => {
  await service.start(approvedConfig());
  mockRun.mockImplementation(async (_, transport) =>
    transport.status("Working")
  );
  await handlers.message(
    message({
      chatType: "group",
      mentionedBot: true,
      content: "@_user_1 Hello @Alice",
      mentions: [
        { key: "@_user_1", openId: "ou_bot", isBot: true, name: "Bot" },
        { key: "@_user_2", openId: "ou_alice", name: "Alice" },
      ],
    })
  );
  expect(mockRun.mock.calls[0][0].message).toBe("Hello @Alice");
  expect(channel.send).toHaveBeenCalledWith(
    "oc_1",
    { markdown: "Working" },
    { replyTo: "om_1" }
  );
});

test.each([
  { chatType: "group", mentionedBot: false },
  { senderId: "ou_bot" },
  { senderId: "cli_other_bot" },
  { createTime: Date.now() - 600001 },
  { createTime: 0 },
  { chatType: "unknown" },
])("ignores inadmissible message %j", async (overrides) => {
  await service.start(approvedConfig());
  await handlers.message(message(overrides));
  expect(mockRun).not.toHaveBeenCalled();
  expect(channel.send).not.toHaveBeenCalled();
});

test("duplicate messages execute once", async () => {
  await service.start(approvedConfig());
  const input = message();
  await Promise.all([handlers.message(input), handlers.message(input)]);
  expect(mockRun).toHaveBeenCalledTimes(1);
});

test("commands send help without model invocation", async () => {
  await service.start(approvedConfig());
  await handlers.message(message({ content: "/help" }));
  expect(channel.send.mock.calls[0][1].text).toContain("/workspace");
  expect(mockRun).not.toHaveBeenCalled();
});

test.each(["audio", "media"])(
  "explicitly rejects %s messages with supported type guidance",
  async (rawContentType) => {
    await service.start(approvedConfig());
    await handlers.message(message({ rawContentType }));
    expect(channel.send.mock.calls[0][1].text).toMatch(
      /Voice, video.*not supported/
    );
    expect(channel.downloadResource).not.toHaveBeenCalled();
    expect(mockRun).not.toHaveBeenCalled();
  }
);

test("same conversation is serial while different conversations run concurrently", async () => {
  await service.start(approvedConfig());
  const first = deferred(),
    entered = deferred();
  mockRun.mockImplementation(async (payload) => {
    if (payload.message === "first") {
      entered.resolve();
      await first.promise;
    }
  });
  const a = handlers.message(message({ content: "first" }));
  await entered.promise;
  const b = handlers.message(message({ messageId: "om_2", content: "second" }));
  await handlers.message(
    message({ messageId: "om_3", chatId: "oc_2", content: "other" })
  );
  expect(mockRun.mock.calls.map(([payload]) => payload.message)).toEqual([
    "first",
    "other",
  ]);
  first.resolve();
  await Promise.all([a, b]);
  expect(mockRun.mock.calls.map(([payload]) => payload.message)).toEqual([
    "first",
    "other",
    "second",
  ]);
});

test("documents go through collector and become prompt text before model work", async () => {
  const fs = require("node:fs");
  let scopedFile;
  mockParse.mockImplementation(async (_, options) => {
    scopedFile = options.absolutePath;
    expect(options.safeLogging).toBe(true);
    expect(options.signal).toBeInstanceOf(AbortSignal);
    expect(fs.existsSync(scopedFile)).toBe(true);
    return { success: true, documents: [{ pageContent: "parsed text" }] };
  });
  await service.start(approvedConfig());
  await handlers.message(
    message({
      resources: [{ type: "file", fileKey: "file_1", fileName: "notes.md" }],
    })
  );
  expect(mockRun.mock.calls[0][0]).toMatchObject({
    message: expect.stringContaining("parsed text"),
    attachments: [],
  });
  expect(fs.existsSync(scopedFile)).toBe(false);
});

test("attachment setup failures cannot expose internal paths to chat", async () => {
  const files = require("../../../utils/files");
  const original = files.hotdirPath;
  Object.defineProperty(files, "hotdirPath", {
    configurable: true,
    get: () => {
      throw new Error("/secret/internal/path raw body");
    },
  });
  try {
    await service.start(approvedConfig());
    await handlers.message(
      message({
        resources: [{ type: "file", fileKey: "file_1", fileName: "a.txt" }],
      })
    );
    expect(JSON.stringify(channel.send.mock.calls)).not.toContain(
      "/secret/internal/path"
    );
  } finally {
    Object.defineProperty(files, "hotdirPath", {
      configurable: true,
      value: original,
    });
  }
});

function click(requestId, extra = {}) {
  return {
    messageId: "om_reply",
    chatId: "oc_1",
    operator: { openId: "ou_user" },
    action: { tag: "button", value: { requestId, action: "approve" } },
    ...extra,
  };
}

test("same-chat card action resolves only the matching approved sender's pending invocation once", async () => {
  const started = deferred();
  let approval;
  mockRun.mockImplementation(async (_, transport) => {
    const pending = transport.requestToolApproval({
      requestId: "worker-request",
      skillName: "tool",
      payload: "secret",
    });
    started.resolve();
    approval = await pending;
  });
  await service.start(approvedConfig());
  const turn = handlers.message(message());
  await started.promise;
  const card = channel.send.mock.calls[0][1].card;
  const requestId = card.body.elements[1].actions[0].value.requestId;
  expect(requestId).toMatch(/^[0-9a-f-]{36}$/);
  expect(requestId).not.toBe("worker-request");
  await handlers.cardAction(
    click(requestId, { operator: { openId: "ou_other" } })
  );
  await handlers.cardAction(click(requestId, { chatId: "oc_other" }));
  await handlers.cardAction(click("made-up"));
  await handlers.cardAction(
    click(requestId, {
      action: {
        tag: "button",
        value: { requestId, action: "yes", raw: "secret" },
      },
    })
  );
  expect(approval).toBeUndefined();
  await handlers.cardAction(click(requestId));
  await turn;
  expect(approval).toEqual({ approved: true });
  await handlers.cardAction(
    click(requestId, {
      action: { tag: "button", value: { requestId, action: "deny" } },
    })
  );
  expect(approval).toEqual({ approved: true });
  expect(
    JSON.stringify([channel.send.mock.calls, console.warn.mock.calls])
  ).not.toContain("secret");
});

test.each(["deny", "expire", "stop"])(
  "pending approval resolves safely on %s",
  async (action) => {
    const started = deferred();
    let approval;
    mockRun.mockImplementation(async (_, transport) => {
      const promise = transport.requestToolApproval({
        requestId: "worker-request",
        timeoutMs: action === "expire" ? 1 : 10000,
      });
      started.resolve();
      approval = await promise;
    });
    await service.start(approvedConfig());
    const turn = handlers.message(message());
    await started.promise;
    const requestId =
      channel.send.mock.calls[0][1].card.body.elements[1].actions[0].value
        .requestId;
    if (action === "deny")
      await handlers.cardAction(
        click(requestId, {
          action: { tag: "button", value: { requestId, action: "deny" } },
        })
      );
    if (action === "stop") await service.stop();
    await turn;
    expect(approval).toMatchObject({ approved: false });
    if (action === "stop")
      expect(mockAbort).toHaveBeenCalledWith("lark:oc_1:ou_user");
  }
);
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
  mockRun.mockReset().mockResolvedValue();
  ExternalCommunicationConnector.updateConfig.mockResolvedValue({
    error: null,
  });
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
    send: jest.fn().mockResolvedValue({ messageId: "om_reply" }),
    downloadResource: jest.fn().mockResolvedValue(Buffer.from("notes")),
  };
  createLarkChannel.mockReturnValue(channel);
  SystemSettings.isMultiUserMode.mockResolvedValue(false);
  require("../../../models/workspace").Workspace.get.mockResolvedValue({
    slug: "general",
  });
  ExternalCommunicationConnector.delete.mockResolvedValue(true);
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
    "cardAction",
    "error",
    "message",
    "reconnected",
    "reconnecting",
  ]);
  expect(createLarkChannel.mock.calls[0][0]).toMatchObject({
    safety: { chatQueue: { enabled: false } },
    includeRawEvent: false,
  });
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

test("boot deletes connector and skips multi-user mode", async () => {
  ExternalCommunicationConnector.get.mockResolvedValue({
    active: true,
    config,
  });
  SystemSettings.isMultiUserMode.mockResolvedValue(true);
  await LarkChannelService.bootIfActive();
  expect(createLarkChannel).not.toHaveBeenCalled();
  expect(ExternalCommunicationConnector.delete).toHaveBeenCalledWith("lark");
});

test.each([
  { app_id: "" },
  { app_secret: "" },
  { platform: "other" },
  { default_workspace: null },
  { attachment_size_limit: 0 },
])("boot skips incomplete config %j", async (invalid) => {
  ExternalCommunicationConnector.get.mockResolvedValue({
    active: true,
    config: { ...config, ...invalid },
  });
  await LarkChannelService.bootIfActive();
  expect(createLarkChannel).not.toHaveBeenCalled();
});
test("boot skips deleted default workspace", async () => {
  ExternalCommunicationConnector.get.mockResolvedValue({
    active: true,
    config,
  });
  require("../../../models/workspace").Workspace.get.mockResolvedValue(null);
  await LarkChannelService.bootIfActive();
  expect(createLarkChannel).not.toHaveBeenCalled();
});
test("live config updates persist before changing routing and reject credential/state fields", async () => {
  const liveConfig = approvedConfig();
  await service.start(liveConfig);
  const write = deferred();
  ExternalCommunicationConnector.updateConfig.mockReturnValueOnce(
    write.promise
  );
  const update = service.updateConfig({
    default_workspace: "new",
    attachment_size_limit: 100,
    app_secret: "injected",
    approved_users: [],
  });
  await new Promise(setImmediate);
  expect(liveConfig.default_workspace).toBe("general");
  expect(ExternalCommunicationConnector.updateConfig).toHaveBeenCalledWith(
    "lark",
    { default_workspace: "new", attachment_size_limit: 100 }
  );
  write.resolve({ error: null });
  expect(await update).toEqual({ success: true });
  expect(liveConfig.default_workspace).toBe("new");
  expect(service.listApprovedUsers()).toHaveLength(1);
  ExternalCommunicationConnector.updateConfig.mockResolvedValueOnce({
    error: "SDK secret",
  });
  expect(await service.updateConfig({ default_workspace: "failure" })).toEqual({
    error: "Could not update Lark configuration.",
  });
  expect(liveConfig.default_workspace).toBe("new");
});

test("live config updates serialize with user revocation", async () => {
  await service.start(approvedConfig());
  const write = deferred();
  ExternalCommunicationConnector.updateConfig.mockReturnValueOnce(
    write.promise
  );
  const update = service.updateConfig({ attachment_size_limit: 100 });
  await new Promise(setImmediate);
  const revoke = service.revokeUser("ou_user");
  await new Promise(setImmediate);
  expect(ExternalCommunicationConnector.updateConfig).toHaveBeenCalledTimes(1);
  write.resolve({ error: null });
  await Promise.all([update, revoke]);
  expect(ExternalCommunicationConnector.updateConfig).toHaveBeenLastCalledWith(
    "lark",
    { approved_users: [] }
  );
  expect(service.listApprovedUsers()).toEqual([]);
});

test("repeated boot restores only one running channel", async () => {
  ExternalCommunicationConnector.get.mockResolvedValue({
    active: true,
    config,
  });
  decryptConnectorSecret.mockReturnValue("plaintext-secret");
  await LarkChannelService.bootIfActive();
  await LarkChannelService.bootIfActive();
  expect(createLarkChannel).toHaveBeenCalledTimes(1);
});

test("management handshake admits no commands or admin mutations until encrypted persistence completes", async () => {
  const save = deferred(),
    saving = deferred();
  const start = service.start(approvedConfig(), {
    beforeActivate: async (identity) => {
      expect(identity).toEqual({ bot_name: "Bot", bot_open_id: "ou_bot" });
      saving.resolve();
      await save.promise;
    },
  });
  await saving.promise;
  expect(service.status.connected).toBe(false);
  await handlers.message(message({ content: "/reset" }));
  expect(ExternalCommunicationConnector.updateConfig).not.toHaveBeenCalled();
  expect(await service.revokeUser("ou_user")).toEqual({
    error: "Lark is not connected.",
  });
  save.resolve();
  await start;
  expect(service.status.connected).toBe(true);
  expect(service.listApprovedUsers()).toHaveLength(1);
});

test("failed persistence never admits a session and closes the handshaken channel", async () => {
  await expect(
    service.start(approvedConfig(), {
      beforeActivate: async () => {
        throw new Error("enc:secret");
      },
    })
  ).rejects.toThrow("unknown");
  expect(service.status.connected).toBe(false);
  expect(channel.disconnect).toHaveBeenCalledTimes(1);
  expect(JSON.stringify(console.warn.mock.calls)).not.toContain("enc:secret");
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

test("cancelled boot handshake cannot overwrite stopped status with its late failure", async () => {
  const handshake = deferred();
  const connecting = deferred();
  ExternalCommunicationConnector.get.mockResolvedValue({
    active: true,
    config,
  });
  decryptConnectorSecret.mockReturnValue("plaintext-secret");
  channel.connect.mockImplementation(() => {
    connecting.resolve();
    return handshake.promise;
  });
  const boot = LarkChannelService.bootIfActive();
  await connecting.promise;
  const stop = service.stop();
  handshake.reject({ code: "permission_denied" });
  await Promise.all([boot, stop]);
  expect(service.status).toMatchObject({
    connection_state: "disconnected",
    connected: false,
    last_error: null,
  });
  expect(console.warn).not.toHaveBeenCalled();
});

test("a newer start retains its status after an old boot handshake rejects", async () => {
  const handshake = deferred();
  const connecting = deferred();
  ExternalCommunicationConnector.get.mockResolvedValue({
    active: true,
    config,
  });
  decryptConnectorSecret.mockReturnValue("plaintext-secret");
  channel.connect.mockImplementation(() => {
    connecting.resolve();
    return handshake.promise;
  });
  const boot = LarkChannelService.bootIfActive();
  await connecting.promise;
  const replacement = {
    ...channel,
    connect: jest.fn().mockResolvedValue(),
    disconnect: jest.fn().mockResolvedValue(),
    botIdentity: { openId: "ou_new", name: "New bot" },
  };
  createLarkChannel.mockReturnValue(replacement);
  const start = service.start({ ...config, app_id: "cli_new" });
  handshake.reject({ code: "permission_denied" });
  await Promise.all([boot, start]);
  expect(service.status).toMatchObject({
    connection_state: "connected",
    connected: true,
    bot_open_id: "ou_new",
    last_error: null,
  });
  expect(console.warn).not.toHaveBeenCalled();
});

test.each([
  ["connector", "resolve"],
  ["connector", "reject"],
  ["settings", "resolve"],
  ["settings", "reject"],
])(
  "stop cancels boot during %s read even when it later %ss",
  async (stage, outcome) => {
    const read = deferred();
    const reading = deferred();
    ExternalCommunicationConnector.get.mockResolvedValue({
      active: true,
      config,
    });
    decryptConnectorSecret.mockReturnValue("plaintext-secret");
    const reader =
      stage === "connector"
        ? ExternalCommunicationConnector.get
        : SystemSettings.isMultiUserMode;
    reader.mockImplementation(() => {
      reading.resolve();
      return read.promise;
    });
    const boot = LarkChannelService.bootIfActive();
    await reading.promise;
    await service.stop();
    if (outcome === "reject") read.reject(new Error("sensitive-response"));
    else read.resolve(stage === "connector" ? { active: true, config } : false);
    await boot;
    expect(createLarkChannel).not.toHaveBeenCalled();
    expect(service.status).toMatchObject({
      connection_state: "disconnected",
      last_error: null,
    });
    expect(console.warn).not.toHaveBeenCalled();
  }
);

test.each(["connector", "settings"])(
  "a newer start prevents delayed boot %s read from starting another session",
  async (stage) => {
    const read = deferred();
    const reading = deferred();
    ExternalCommunicationConnector.get.mockResolvedValue({
      active: true,
      config,
    });
    decryptConnectorSecret.mockReturnValue("plaintext-secret");
    const reader =
      stage === "connector"
        ? ExternalCommunicationConnector.get
        : SystemSettings.isMultiUserMode;
    reader.mockImplementation(() => {
      reading.resolve();
      return read.promise;
    });
    const boot = LarkChannelService.bootIfActive();
    await reading.promise;
    await service.start({ ...config, app_id: "cli_new" });
    read.resolve(stage === "connector" ? { active: true, config } : false);
    await boot;
    expect(createLarkChannel).toHaveBeenCalledTimes(1);
    expect(createLarkChannel.mock.calls[0][0].appId).toBe("cli_new");
    expect(channel.disconnect).not.toHaveBeenCalled();
    expect(service.status).toMatchObject({ connected: true, last_error: null });
  }
);

test("boot does not re-record a connection failure already reported by start", async () => {
  ExternalCommunicationConnector.get.mockResolvedValue({
    active: true,
    config,
  });
  decryptConnectorSecret.mockReturnValue("plaintext-secret");
  channel.connect.mockRejectedValue({ code: "permission_denied" });
  await LarkChannelService.bootIfActive();
  expect(service.status).toMatchObject({
    connection_state: "failed",
    last_error: { category: "permission_denied" },
  });
  expect(console.warn).toHaveBeenCalledTimes(1);
});

test("admin pairing approves immutable open ID, persists, and returns only safe copies", async () => {
  await service.start({ ...config, approved_users: [] });
  await handlers.message(message());
  const pending = service.listPendingUsers();
  expect(pending[0]).toMatchObject({
    userId: "ou_user",
    code: expect.stringMatching(/^\d{6}$/),
  });
  pending[0].code = "tampered";
  expect(service.listPendingUsers()[0].code).not.toBe("tampered");
  await service.approveUser("ou_user");
  expect(ExternalCommunicationConnector.updateConfig).toHaveBeenCalledWith(
    "lark",
    { approved_users: [expect.objectContaining({ open_id: "ou_user" })] }
  );
  expect(service.listPendingUsers()).toEqual([]);
  const users = service.listApprovedUsers();
  expect(users[0].open_id).toBe("ou_user");
  users[0].open_id = "tampered";
  expect(service.listApprovedUsers()[0].open_id).toBe("ou_user");
  expect(JSON.stringify(users)).not.toContain("plaintext-secret");
});

test("admin operations fail safely for missing, expired, denied, and disconnected users", async () => {
  expect(await service.approveUser("ou_user")).toEqual({
    error: "Lark is not connected.",
  });
  expect(service.listPendingUsers()).toEqual([]);
  expect(service.listApprovedUsers()).toEqual([]);
  await service.start({ ...config, approved_users: [] });
  expect(await service.approveUser("ou_missing")).toEqual({
    error: "Pairing request expired",
  });
  await handlers.message(message());
  await service.denyUser("ou_user");
  expect(service.listPendingUsers()).toEqual([]);
  expect(await service.approveUser("ou_user")).toEqual({
    error: "Pairing request expired",
  });
  expect(await service.revokeUser("ou_missing")).toEqual({
    error: "User is not approved.",
  });
});

test("revoke immediately cancels model/approval and denies queued messages while persistence waits", async () => {
  const started = deferred(),
    saved = deferred();
  let approval;
  mockRun.mockImplementation(async (_, transport) => {
    const pending = transport.requestToolApproval({
      requestId: "worker-request",
    });
    started.resolve();
    approval = await pending;
  });
  await service.start(approvedConfig());
  const first = handlers.message(message());
  await started.promise;
  const queued = handlers.message(message({ messageId: "om_next" }));
  ExternalCommunicationConnector.updateConfig.mockReturnValue(saved.promise);
  const revoking = service.revokeUser("ou_user");
  await first;
  await queued;
  expect(mockAbort).toHaveBeenCalledWith("lark:oc_1:ou_user");
  expect(approval).toMatchObject({ approved: false });
  expect(mockRun).toHaveBeenCalledTimes(1);
  expect(service.listApprovedUsers()).toEqual([]);
  saved.resolve({ error: null });
  await revoking;
});

test("admin persistence errors remain sanitized and failed revoke stays denied", async () => {
  await service.start(approvedConfig());
  ExternalCommunicationConnector.updateConfig.mockRejectedValue(
    new Error("secret database path")
  );
  expect(await service.revokeUser("ou_user")).toEqual({
    error: "Could not update Lark access.",
  });
  expect(service.listApprovedUsers()).toEqual([]);
  await handlers.message(message());
  expect(mockRun).not.toHaveBeenCalled();
});

test("concurrent admin writes cannot restore a revoked user from an old approval snapshot", async () => {
  await service.start(approvedConfig());
  await handlers.message(message({ senderId: "ou_new" }));
  const writing = deferred(),
    firstWrite = deferred();
  ExternalCommunicationConnector.updateConfig.mockImplementationOnce(
    async () => {
      writing.resolve();
      return firstWrite.promise;
    }
  );
  const approving = service.approveUser("ou_new");
  await writing.promise;
  const revoking = service.revokeUser("ou_user");
  firstWrite.resolve({ error: null });
  await Promise.all([approving, revoking]);
  expect(service.listApprovedUsers().map((user) => user.open_id)).toEqual([
    "ou_new",
  ]);
  const lastWrite =
    ExternalCommunicationConnector.updateConfig.mock.calls.at(-1)[1];
  expect(lastWrite.approved_users.map((user) => user.open_id)).toEqual([
    "ou_new",
  ]);
});

test("denial waits for overlapping approval persistence and prevents its authorization", async () => {
  await service.start({
    ...config,
    default_workspace: "general",
    approved_users: [],
  });
  await handlers.message(message());
  const writing = deferred(),
    saved = deferred();
  ExternalCommunicationConnector.updateConfig.mockImplementationOnce(() => {
    writing.resolve();
    return saved.promise;
  });
  const approving = service.approveUser("ou_user");
  await writing.promise;
  let denied = false;
  const denying = Promise.resolve(service.denyUser("ou_user")).then(
    (result) => {
      denied = true;
      return result;
    }
  );
  await new Promise((resolve) => setImmediate(resolve));
  const settledBeforeAck = denied;
  saved.resolve({ error: null });
  const approvalResult = await approving,
    denialResult = await denying;
  expect(settledBeforeAck).toBe(false);
  expect(approvalResult).toMatchObject({ error: expect.any(String) });
  expect(denialResult).toEqual({ success: true });
  expect(service.listPendingUsers()).toEqual([]);
  expect(service.listApprovedUsers()).toEqual([]);
  expect(
    ExternalCommunicationConnector.updateConfig.mock.calls.at(-1)[1]
      .approved_users
  ).toEqual([]);
  await handlers.message(message({ messageId: "om_after_denial" }));
  expect(mockRun).not.toHaveBeenCalled();
});

test("denial cannot report success if rollback of an overlapping approval fails", async () => {
  await service.start({ ...config, approved_users: [] });
  await handlers.message(message());
  const writing = deferred(),
    saved = deferred();
  ExternalCommunicationConnector.updateConfig
    .mockImplementationOnce(() => {
      writing.resolve();
      return saved.promise;
    })
    .mockResolvedValueOnce({ error: "private database failure" });
  const approving = service.approveUser("ou_user");
  await writing.promise;
  const denying = service.denyUser("ou_user");
  saved.resolve({ error: null });
  await approving;
  expect(await denying).toEqual({ error: "Could not update Lark access." });
  expect(service.listApprovedUsers()).toEqual([]);
});

test("revoke during delayed /workspace query suppresses workspace names and slugs", async () => {
  const { Workspace } = require("../../../models/workspace");
  const queried = deferred(),
    query = deferred();
  Workspace.where.mockImplementationOnce(() => {
    queried.resolve();
    return query.promise;
  });
  await service.start(approvedConfig());
  const command = handlers.message(message({ content: "/workspace" }));
  await queried.promise;
  const revoking = service.revokeUser("ou_user");
  query.resolve([{ id: 1, name: "Private workspace", slug: "secret-slug" }]);
  await Promise.all([command, revoking]);
  expect(channel.send).not.toHaveBeenCalled();
  expect(mockAbort).toHaveBeenCalledWith("lark:oc_1:ou_user");
});

test.each(["/new private", "/reset"])(
  "revoke during %s lookup stops later mutations",
  async (content) => {
    const { Workspace } = require("../../../models/workspace");
    const { WorkspaceThread } = require("../../../models/workspaceThread");
    const { WorkspaceChats } = require("../../../models/workspaceChats");
    const queried = deferred(),
      query = deferred();
    Workspace.get.mockImplementationOnce(() => {
      queried.resolve();
      return query.promise;
    });
    WorkspaceThread.get.mockResolvedValue({ id: 2, slug: "paper" });
    WorkspaceThread.new.mockResolvedValue({
      thread: { id: 3, slug: "private", name: "Private" },
    });
    await service.start(approvedConfig());
    const command = handlers.message(message({ content }));
    await queried.promise;
    const revoking = service.revokeUser("ou_user");
    query.resolve({ id: 1, name: "Private", slug: "research" });
    await Promise.all([command, revoking]);
    expect(WorkspaceThread.new).not.toHaveBeenCalled();
    expect(WorkspaceThread.get).not.toHaveBeenCalled();
    expect(WorkspaceChats.markThreadHistoryInvalidV2).not.toHaveBeenCalled();
    expect(channel.send).not.toHaveBeenCalled();
  }
);

test("revoke during thread creation prevents selecting the created thread or sending its details", async () => {
  const { Workspace } = require("../../../models/workspace");
  const { WorkspaceThread } = require("../../../models/workspaceThread");
  Workspace.get.mockResolvedValue({
    id: 1,
    slug: "research",
    name: "Research",
  });
  const creating = deferred(),
    creation = deferred();
  WorkspaceThread.new.mockImplementationOnce(() => {
    creating.resolve();
    return creation.promise;
  });
  await service.start(approvedConfig());
  const command = handlers.message(message({ content: "/new private" }));
  await creating.promise;
  const revoking = service.revokeUser("ou_user");
  creation.resolve({ thread: { id: 3, slug: "secret", name: "Secret" } });
  await Promise.all([command, revoking]);
  expect(ExternalCommunicationConnector.updateConfig).toHaveBeenCalledTimes(1);
  expect(
    ExternalCommunicationConnector.updateConfig.mock.calls[0][1].approved_users
  ).toEqual([]);
  expect(channel.send).not.toHaveBeenCalled();
});

test.each(["approve", "deny"])(
  "early %s click survives delayed card send acknowledgement and rejects replay",
  async (action) => {
    const started = deferred(),
      acknowledgement = deferred();
    let decision;
    mockRun.mockImplementation(async (_, transport) => {
      const pending = transport.requestToolApproval({
        requestId: "worker-request",
      });
      started.resolve();
      decision = await pending;
    });
    channel.send.mockReturnValue(acknowledgement.promise);
    await service.start(approvedConfig());
    const turn = handlers.message(message());
    await started.promise;
    const requestId =
      channel.send.mock.calls[0][1].card.body.elements[1].actions[0].value
        .requestId;
    await handlers.cardAction(
      click(requestId, {
        action: { tag: "button", value: { requestId, action } },
      })
    );
    await handlers.cardAction(
      click(requestId, {
        action: {
          tag: "button",
          value: {
            requestId,
            action: action === "approve" ? "deny" : "approve",
          },
        },
      })
    );
    acknowledgement.resolve({ messageId: "om_reply" });
    await turn;
    expect(decision).toEqual({ approved: action === "approve" });
    await handlers.cardAction(click(requestId));
    expect(decision).toEqual({ approved: action === "approve" });
  }
);

test("revocation before delayed card acknowledgement invalidates an early approval", async () => {
  const started = deferred(),
    acknowledgement = deferred();
  let decision;
  mockRun.mockImplementation(async (_, transport) => {
    const pending = transport.requestToolApproval({
      requestId: "worker-request",
    });
    started.resolve();
    decision = await pending;
  });
  channel.send.mockReturnValue(acknowledgement.promise);
  await service.start(approvedConfig());
  const turn = handlers.message(message());
  await started.promise;
  const requestId =
    channel.send.mock.calls[0][1].card.body.elements[1].actions[0].value
      .requestId;
  await handlers.cardAction(click(requestId));
  await service.revokeUser("ou_user");
  acknowledgement.resolve({ messageId: "om_reply" });
  await turn;
  expect(decision).toMatchObject({ approved: false });
});
