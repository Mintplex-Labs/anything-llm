jest.mock("../../models/externalCommunicationConnector", () => ({
  ExternalCommunicationConnector: {
    get: jest.fn(),
    getWithStatus: jest.fn(),
    upsert: jest.fn(),
    delete: jest.fn(),
  },
}));
jest.mock("../../models/workspace", () => ({ Workspace: { get: jest.fn() } }));
jest.mock("../../utils/larkChannel", () => ({ LarkChannelService: jest.fn() }));
jest.mock("../../utils/externalChannels/credentials", () => ({
  encryptConnectorSecret: jest.fn(() => "enc:ciphertext"),
  decryptConnectorSecret: jest.fn(() => "app-secret"),
}));
jest.mock("../../utils/middleware/validatedRequest", () => ({
  validatedRequest: jest.fn(),
}));
jest.mock("../../models/systemSettings", () => ({
  SystemSettings: { isMultiUserMode: jest.fn() },
}));
jest.mock("../../utils/http", () => ({
  reqBody: (req) =>
    typeof req.body === "string" ? JSON.parse(req.body) : req.body,
}));

const api = require("../../endpoints/lark");
const {
  ExternalCommunicationConnector: model,
} = require("../../models/externalCommunicationConnector");
const { Workspace } = require("../../models/workspace");
const { LarkChannelService } = require("../../utils/larkChannel");
const { validatedRequest } = require("../../utils/middleware/validatedRequest");
const {
  isSingleUserMode,
} = require("../../utils/middleware/multiUserProtected");
const { SystemSettings } = require("../../models/systemSettings");
const {
  encryptConnectorSecret,
} = require("../../utils/externalChannels/credentials");
let service;
const body = {
  platform: "feishu",
  app_id: "cli_1",
  app_secret: "app-secret",
  default_workspace: "general",
  attachment_size_limit: null,
};
function response() {
  return {
    code: null,
    body: null,
    status(code) {
      this.code = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
    sendStatus(code) {
      this.code = code;
      return this;
    },
    end() {},
  };
}
async function call(name, input = body) {
  const res = response();
  await api[name]({ body: input }, res);
  return res;
}
beforeEach(() => {
  jest.clearAllMocks();
  service = {
    status: { connected: true, connection_state: "connected" },
    start: jest.fn().mockImplementation(async (_config, { beforeActivate }) => {
      await beforeActivate({ bot_name: "Bot", bot_open_id: "ou_bot" });
      return { connected: true };
    }),
    stop: jest.fn().mockResolvedValue(),
    listPendingUsers: jest.fn().mockReturnValue([]),
    listApprovedUsers: jest.fn().mockReturnValue([]),
    approveUser: jest.fn().mockResolvedValue({ open_id: "ou_1" }),
    denyUser: jest.fn().mockResolvedValue({ success: true }),
    revokeUser: jest.fn().mockResolvedValue({ success: true }),
    updateConfig: jest.fn().mockResolvedValue({ success: true }),
  };
  LarkChannelService.mockImplementation(() => service);
  model.get.mockResolvedValue(null);
  model.getWithStatus.mockImplementation(async () => ({
    connector: await model.get("lark"),
    error: null,
  }));
  model.upsert.mockImplementation(async (_type, config) => ({
    connector: { active: true, config },
    error: null,
  }));
  model.delete.mockResolvedValue(true);
  Workspace.get.mockResolvedValue({ slug: "general" });
  encryptConnectorSecret.mockReturnValue("enc:ciphertext");
});

test("every management route authenticates and rejects multi-user callers before workspace reads", async () => {
  const app = { get: jest.fn(), post: jest.fn() };
  api.larkEndpoints(app);
  const routes = [...app.get.mock.calls, ...app.post.mock.calls];
  expect(routes.map(([path]) => path).sort()).toEqual(
    [
      "config",
      "connect",
      "disconnect",
      "status",
      "pending-users",
      "approved-users",
      "approve-user",
      "deny-user",
      "revoke-user",
      "update-config",
    ]
      .map((name) => `/lark/${name}`)
      .sort()
  );
  SystemSettings.isMultiUserMode.mockResolvedValue(true);
  for (const [, middleware, handler] of routes) {
    expect(middleware).toEqual([validatedRequest, isSingleUserMode]);
    expect(typeof handler).toBe("function");
    const next = jest.fn(),
      res = response();
    await middleware[1]({}, res, next);
    expect(res.code).toBe(401);
    expect(next).not.toHaveBeenCalled();
  }
  expect(Workspace.get).not.toHaveBeenCalled();
});
test.each([
  { platform: "other" },
  { app_id: " " },
  { app_secret: "" },
  { default_workspace: null },
  { attachment_size_limit: 0 },
  { attachment_size_limit: -1 },
  { attachment_size_limit: 1.5 },
  { attachment_size_limit: "10" },
])("invalid connect %j cannot start or persist", async (invalid) => {
  expect((await call("connectLark", { ...body, ...invalid })).code).toBe(400);
  expect(service.start).not.toHaveBeenCalled();
  expect(model.upsert).not.toHaveBeenCalled();
});
test("missing workspace is rejected without echoing input", async () => {
  Workspace.get.mockResolvedValue(null);
  const res = await call("connectLark", {
    ...body,
    default_workspace: "private-name",
  });
  expect(res.code).toBe(400);
  expect(JSON.stringify(res.body)).not.toContain("private-name");
});
test("connect persists encrypted active config only after handshake", async () => {
  service.start.mockImplementation(async (_config, { beforeActivate }) => {
    expect(model.upsert).not.toHaveBeenCalled();
    await beforeActivate({ bot_name: "Bot", bot_open_id: "ou_bot" });
    return { connected: true };
  });
  const res = await call("connectLark");
  expect(res.body).toEqual({
    success: true,
    config: expect.objectContaining({
      platform: "feishu",
      app_id: "cli_1",
      has_app_secret: true,
      connected: true,
    }),
  });
  expect(service.start).toHaveBeenCalledWith(
    expect.objectContaining({ app_secret: "app-secret" }),
    expect.objectContaining({ beforeActivate: expect.any(Function) })
  );
  expect(model.upsert).toHaveBeenCalledWith(
    "lark",
    expect.objectContaining({ active: true, app_secret: "enc:ciphertext" })
  );
  expect(JSON.stringify(res.body)).not.toMatch(/app-secret|ciphertext/);
});
test("failed handshake exposes no SDK errors and persists nothing", async () => {
  service.start.mockRejectedValue(new Error("SDK app-secret enc:ciphertext"));
  const res = await call("connectLark");
  expect(res.code).toBe(400);
  expect(model.upsert).not.toHaveBeenCalled();
  expect(JSON.stringify(res.body)).not.toMatch(/SDK|app-secret|ciphertext/);
});

test("failed post-stop read aborts reconnect without overwriting approved users", async () => {
  const existing = {
    active: true,
    config: {
      ...body,
      app_secret: "enc:ciphertext",
      approved_users: [{ open_id: "ou_1", active_thread: "old" }],
    },
  };
  model.get.mockResolvedValueOnce(existing).mockResolvedValue(null);
  model.getWithStatus.mockResolvedValue({
    connector: null,
    error: "Database failure enc:ciphertext",
  });
  const res = await call("connectLark");
  expect(res.code).toBe(500);
  expect(JSON.stringify(res.body)).not.toMatch(
    /Database|ciphertext|app-secret/
  );
  expect(service.stop).toHaveBeenCalledTimes(1);
  expect(service.start).not.toHaveBeenCalled();
  expect(model.upsert).not.toHaveBeenCalled();
  expect(existing.config.approved_users).toEqual([
    { open_id: "ou_1", active_thread: "old" },
  ]);
});

test("successful post-stop read preserves the latest drained routing state", async () => {
  const existing = {
    active: true,
    config: {
      ...body,
      approved_users: [{ open_id: "ou_1", active_thread: "old" }],
    },
  };
  const latest = {
    active: true,
    config: {
      ...body,
      approved_users: [{ open_id: "ou_1", active_thread: "latest" }],
    },
  };
  model.get.mockResolvedValue(existing);
  model.getWithStatus.mockImplementation(async () => {
    expect(service.stop).toHaveBeenCalled();
    return { connector: latest, error: null };
  });
  expect((await call("connectLark")).code).toBe(200);
  expect(model.upsert).toHaveBeenCalledWith(
    "lark",
    expect.objectContaining({
      approved_users: [{ open_id: "ou_1", active_thread: "latest" }],
    })
  );
});
test("a handshake superseded by stop is not saved and its runtime is stopped", async () => {
  service.start.mockResolvedValue({ connected: false });
  expect((await call("connectLark")).code).toBe(400);
  expect(model.upsert).not.toHaveBeenCalled();
  expect(service.stop).toHaveBeenCalledTimes(2);
});
test.each([undefined, "********", "••••••••"])(
  "reconnect reuses stored secret %s and preserves latest user state after stopping",
  async (app_secret) => {
    const config = {
      ...body,
      app_secret: "enc:ciphertext",
      approved_users: [{ open_id: "ou_1", active_thread: "latest" }],
    };
    model.get.mockResolvedValue({ active: true, config });
    const res = await call("connectLark", { ...body, app_secret });
    expect(res.code).toBe(200);
    expect(service.start).toHaveBeenCalledWith(
      expect.objectContaining({
        app_secret: "app-secret",
        approved_users: config.approved_users,
      }),
      expect.objectContaining({ beforeActivate: expect.any(Function) })
    );
    expect(model.upsert).toHaveBeenCalledWith(
      "lark",
      expect.objectContaining({ approved_users: config.approved_users })
    );
  }
);
test("failed encryption does not start; failed persistence stops runtime and returns safe error", async () => {
  encryptConnectorSecret.mockReturnValueOnce(null);
  expect((await call("connectLark")).code).toBe(500);
  expect(service.start).not.toHaveBeenCalled();
  model.upsert.mockResolvedValue({ error: "enc:ciphertext" });
  const res = await call("connectLark");
  expect(res.code).toBe(500);
  expect(service.stop).toHaveBeenCalled();
  expect(JSON.stringify(res.body)).not.toContain("ciphertext");
});
test.each(["getLarkConfig", "getLarkStatus"])(
  "%s returns only safe selected config/status",
  async (name) => {
    model.get.mockResolvedValue({
      active: true,
      config: {
        ...body,
        app_secret: "enc:ciphertext",
        approved_users: [{ name: "private" }],
      },
    });
    service.status.last_error = {
      category: "unknown",
      timestamp: "bad secret",
      message: "app-secret",
    };
    const res = await call(name);
    expect(res.code).toBe(200);
    expect(JSON.stringify(res.body)).not.toMatch(
      /ciphertext|app-secret|private|bad secret/
    );
  }
);
test("disconnect stops before deleting and reports delete failure", async () => {
  model.delete.mockImplementation(async () => {
    expect(service.stop).toHaveBeenCalled();
    return true;
  });
  expect((await call("disconnectLark")).body).toEqual({ success: true });
  model.delete.mockResolvedValue(false);
  expect((await call("disconnectLark")).code).toBe(500);
});
test.each([
  ["getPendingLarkUsers", "listPendingUsers"],
  ["getApprovedLarkUsers", "listApprovedUsers"],
])("%s reads service public user list", async (handler, method) => {
  service[method].mockReturnValue([{ open_id: "ou_1" }]);
  expect((await call(handler)).body).toEqual({ users: [{ open_id: "ou_1" }] });
});
test.each([
  ["approveLarkUser", "approveUser"],
  ["denyLarkUser", "denyUser"],
  ["revokeLarkUser", "revokeUser"],
])("%s validates open_id and delegates mutation", async (handler, method) => {
  expect((await call(handler, { open_id: "invalid" })).code).toBe(400);
  expect((await call(handler, { open_id: "ou_1" })).body).toEqual({
    success: true,
  });
  expect(service[method]).toHaveBeenCalledWith("ou_1");
  service[method].mockResolvedValue({ error: "app-secret" });
  const res = await call(handler, { open_id: "ou_1" });
  expect(res.code).toBe(400);
  expect(JSON.stringify(res.body)).not.toContain("app-secret");
});
test("config updates validate workspace/limit and exclude credentials and user state", async () => {
  expect(
    (await call("updateLarkConfig", { attachment_size_limit: 0 })).code
  ).toBe(400);
  expect((await call("updateLarkConfig", { platform: "lark" })).code).toBe(400);
  const res = await call("updateLarkConfig", {
    default_workspace: "general",
    attachment_size_limit: 100,
    app_secret: "malicious",
    approved_users: [],
  });
  expect(res.code).toBe(200);
  expect(service.updateConfig).toHaveBeenCalledWith({
    default_workspace: "general",
    attachment_size_limit: 100,
  });
});
