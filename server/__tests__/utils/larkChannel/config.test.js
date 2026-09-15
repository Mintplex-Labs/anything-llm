const { Domain } = require("@larksuiteoapi/node-sdk");
const {
  domainForPlatform,
  safeLarkConfig,
} = require("../../../utils/larkChannel/config");

test.each([
  ["lark", Domain.Lark],
  ["feishu", Domain.Feishu],
])("maps %s to its official domain", (platform, domain) => {
  expect(domainForPlatform(platform)).toBe(domain);
});

test.each([undefined, null, "Lark", "", "https://example.com"])(
  "rejects unsupported platform %s",
  (platform) => {
    expect(() => domainForPlatform(platform)).toThrow(
      "Unsupported Lark platform"
    );
  }
);

test("serializes only safe configuration and runtime fields", () => {
  const result = safeLarkConfig(
    {
      active: true,
      config: {
        platform: "lark",
        app_id: "cli_1",
        app_secret: "enc:cipher",
        bot_name: "Stored bot",
        bot_open_id: "ou_1",
        default_workspace: "docs",
        attachment_size_limit: 12,
        unexpected: "private",
      },
    },
    {
      status: {
        connection_state: "reconnecting",
        connected: false,
        bot_name: "Live bot",
        bot_open_id: "ou_live",
        last_error: {
          category: "permission_denied",
          timestamp: "2026-09-15T00:00:00.000Z",
          message: "private",
        },
      },
    }
  );
  expect(result).toEqual({
    platform: "lark",
    app_id: "cli_1",
    has_app_secret: true,
    bot_name: "Live bot",
    bot_open_id: "ou_live",
    default_workspace: "docs",
    attachment_size_limit: 12,
    active: true,
    connection_state: "reconnecting",
    connected: false,
    last_error: {
      category: "permission_denied",
      timestamp: "2026-09-15T00:00:00.000Z",
    },
  });
  expect(Object.hasOwn(result, "app_secret")).toBe(false);
  expect(JSON.stringify(result)).not.toMatch(/cipher|private/);
});

test("missing connector has safe disconnected defaults", () => {
  expect(safeLarkConfig(null)).toEqual({
    platform: "lark",
    app_id: "",
    has_app_secret: false,
    bot_name: null,
    bot_open_id: null,
    default_workspace: null,
    attachment_size_limit: null,
    active: false,
    connected: false,
    connection_state: "disconnected",
    last_error: null,
  });
});

test("unknown runtime error categories never echo arbitrary error text", () => {
  expect(
    safeLarkConfig(null, {
      status: { last_error: { category: "secret", timestamp: "bad secret" } },
    }).last_error
  ).toBeNull();
});
