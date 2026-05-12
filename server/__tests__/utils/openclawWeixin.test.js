/* eslint-env jest */
const fs = require("fs");
const os = require("os");
const path = require("path");
const EventEmitter = require("events");

function makeChild({
  stdout = "",
  stdoutChunks = null,
  stderr = "",
  code = 0,
  error = null,
  stayOpen = false,
} = {}) {
  const child = new EventEmitter();
  child.stdout = new EventEmitter();
  child.stderr = new EventEmitter();
  child.exitCode = null;
  child.signalCode = null;
  child.kill = jest.fn((signal = "SIGTERM") => {
    child.signalCode = signal;
    setImmediate(() => child.emit("close", null, signal));
    return true;
  });

  setImmediate(() => {
    if (error) {
      child.emit("error", error);
      return;
    }
    if (Array.isArray(stdoutChunks)) {
      stdoutChunks.forEach(({ text = "", delay = 0 }) => {
        setTimeout(() => {
          child.stdout.emit("data", Buffer.from(text));
        }, delay);
      });
    } else if (stdout) {
      child.stdout.emit("data", Buffer.from(stdout));
    }
    if (stderr) child.stderr.emit("data", Buffer.from(stderr));
    if (!stayOpen) {
      child.exitCode = code;
      child.emit("close", code, null);
    }
  });

  return child;
}

function loadHelper(queue = []) {
  jest.resetModules();
  const spawn = jest.fn(() => makeChild(queue.shift() || {}));
  jest.doMock("child_process", () => ({ spawn }));
  const helper = require("../../utils/openclawWeixin");
  return { helper, spawn };
}

function readyEnvironmentQueue() {
  return [{ stdout: "OpenClaw 1.0" }, { stdout: "openclaw-weixin loaded" }];
}

const OPENCLAW_INSTALL_PROMPT = [
  "│",
  "◆  Install openclaw-weixin plugin?",
  "│  ● Download from npm (@tencent-weixin/openclaw-weixin)",
  "│  ○ Skip for now",
  "└",
].join("\n");

describe("OpenClaw Weixin helper", () => {
  let tempHome;

  beforeEach(() => {
    jest.clearAllMocks();
    tempHome = fs.mkdtempSync(path.join(os.tmpdir(), "openclaw-weixin-"));
    process.env.OPENCLAW_WEIXIN_HOME = tempHome;
    delete process.env.OPENCLAW_BIN;
  });

  afterEach(() => {
    delete process.env.OPENCLAW_WEIXIN_HOME;
    delete process.env.OPENCLAW_BIN;
    fs.rmSync(tempHome, { recursive: true, force: true });
    jest.dontMock("child_process");
  });

  it("uses OPENCLAW_BIN and reports a ready environment", async () => {
    process.env.OPENCLAW_BIN = "/custom/openclaw";
    const { helper, spawn } = loadHelper([
      { stdout: "OpenClaw 1.0" },
      { stdout: "openclaw-weixin loaded" },
    ]);

    await expect(helper.detectEnvironment()).resolves.toEqual({
      status: "environment_ready",
    });
    expect(spawn).toHaveBeenNthCalledWith(
      1,
      "/custom/openclaw",
      ["--version"],
      expect.objectContaining({ shell: false })
    );
  });

  it("returns openclaw_not_installed when the CLI is missing", async () => {
    const { helper } = loadHelper([
      { error: Object.assign(new Error("not found"), { code: "ENOENT" }) },
    ]);

    await expect(helper.detectEnvironment()).resolves.toEqual({
      status: "openclaw_not_installed",
    });
  });

  it("installs only the missing plugin and re-checks environment", async () => {
    const { helper, spawn } = loadHelper([
      { stdout: "OpenClaw 1.0" },
      { stderr: "missing", code: 1 },
      { stdout: "installed" },
      { stdout: "OpenClaw 1.0" },
      { stdout: "openclaw-weixin loaded" },
    ]);

    await expect(helper.prepareEnvironment()).resolves.toEqual({
      status: "environment_ready",
    });
    expect(spawn).toHaveBeenCalledWith(
      "npx",
      ["-y", "@tencent-weixin/openclaw-weixin-cli", "install"],
      expect.objectContaining({ shell: false })
    );
  });

  it("extracts QR data from image, URL, and ASCII output", () => {
    const { helper } = loadHelper();
    expect(
      helper.extractQrData("scan data:image/png;base64,abc123==")
    ).toMatchObject({ qrCodeType: "image", extractionSource: "data_url" });
    expect(
      helper.extractQrData("open https://ilinkai.weixin.qq.com/qr/abc")
    ).toMatchObject({ qrCodeType: "url", extractionSource: "url" });
    expect(
      helper.extractQrData(
        "如果二维码未能成功展示，请用浏览器打开以下链接扫码：\nhttps://liteapp.weixin.qq.com/q/7GiQu1?qrcode=c813b1082550d4c229086200c3711c22&bot_type=3"
      )
    ).toMatchObject({
      qrCode:
        "https://liteapp.weixin.qq.com/q/7GiQu1?qrcode=c813b1082550d4c229086200c3711c22&bot_type=3",
      qrCodeType: "url",
      extractionSource: "url",
    });
    expect(
      helper.extractQrData(
        ["████████", "██  ████", "██▀▄▄▀██", "████████"].join("\n")
      )
    ).toMatchObject({ qrCodeType: "ascii", extractionSource: "ascii" });
  });

  it("kills the previous active login child before starting a new one", async () => {
    const first = { stdout: "https://ilinkai.weixin.qq.com/qr/one", stayOpen: true };
    const second = {
      stdout: "https://ilinkai.weixin.qq.com/qr/two",
      stayOpen: true,
    };
    const { helper, spawn } = loadHelper([first, second]);

    await expect(helper.startQrLogin()).resolves.toMatchObject({
      success: true,
      qr_code_type: "url",
      extraction_source: "url",
    });
    const firstChild = spawn.mock.results[0].value;
    await expect(helper.startQrLogin()).resolves.toMatchObject({
      success: true,
      qr_code: "https://ilinkai.weixin.qq.com/qr/two",
    });
    expect(firstChild.kill).toHaveBeenCalledWith("SIGTERM");
    await helper.cleanupOpenClawWeixinLoginChild();
  });

  it("waits briefly for a URL after ASCII QR output", async () => {
    const { helper } = loadHelper([
      {
        stdoutChunks: [
          {
            text: ["████████", "██  ████", "██▀▄▄▀██", "████████"].join("\n"),
            delay: 0,
          },
          {
            text: "\nhttps://liteapp.weixin.qq.com/q/abc?qrcode=123&bot_type=3\n",
            delay: 10,
          },
        ],
        stayOpen: true,
      },
    ]);

    await expect(helper.startQrLogin()).resolves.toMatchObject({
      success: true,
      qr_code: "https://liteapp.weixin.qq.com/q/abc?qrcode=123&bot_type=3",
      qr_code_type: "url",
      extraction_source: "url",
    });
    await helper.cleanupOpenClawWeixinLoginChild();
  });

  it("reads account metadata without returning credential values", () => {
    const { helper } = loadHelper();
    const accountsDir = path.join(tempHome, "accounts");
    fs.mkdirSync(accountsDir, { recursive: true });
    fs.writeFileSync(
      path.join(tempHome, "accounts.json"),
      JSON.stringify(["account-one"])
    );
    fs.writeFileSync(
      path.join(accountsDir, "account-one.json"),
      JSON.stringify({
        token: "secret-token",
        baseUrl: "https://example.com",
        userId: "wxid_1",
        savedAt: "2026-05-12T00:00:00.000Z",
      })
    );

    expect(helper.getConnectedProfile()).toEqual({
      accountId: "account-one",
      lastConnectedAt: "2026-05-12T00:00:00.000Z",
      profile: {
        nickname: null,
        avatar_url: null,
        wxid: "wxid_1",
        openid: "account-one",
      },
    });
  });

  it("falls back to channel-only logout when account logout fails", async () => {
    const { helper, spawn } = loadHelper([
      ...readyEnvironmentQueue(),
      { stderr: "unknown option --account", code: 1 },
      { stdout: "logged out" },
    ]);
    const accountsDir = path.join(tempHome, "accounts");
    fs.mkdirSync(accountsDir, { recursive: true });
    fs.writeFileSync(
      path.join(tempHome, "accounts.json"),
      JSON.stringify(["account-one"])
    );
    fs.writeFileSync(
      path.join(accountsDir, "account-one.json"),
      JSON.stringify({ token: "secret-token" })
    );

    await expect(helper.disconnect({ accountId: "account-one" })).resolves.toEqual({
      success: true,
    });
    expect(spawn).toHaveBeenNthCalledWith(
      3,
      "openclaw",
      [
        "channels",
        "logout",
        "--channel",
        "openclaw-weixin",
        "--account",
        "account-one",
      ],
      expect.any(Object)
    );
    expect(spawn).toHaveBeenNthCalledWith(
      4,
      "openclaw",
      ["channels", "logout", "--channel", "openclaw-weixin"],
      expect.objectContaining({ shell: false })
    );
  });

  it("treats logout stderr config warnings with exit code zero as success", async () => {
    const { helper, spawn } = loadHelper([
      ...readyEnvironmentQueue(),
      {
        stderr:
          "Config warnings:\nchannel plugin manifest declares openclaw-weixin without channelConfigs metadata\nplugins.allow is empty\ndiscovered non-bundled plugins may auto-load\n",
        code: 0,
      },
    ]);
    const accountsDir = path.join(tempHome, "accounts");
    fs.mkdirSync(accountsDir, { recursive: true });
    fs.writeFileSync(
      path.join(tempHome, "accounts.json"),
      JSON.stringify(["account-one"])
    );
    fs.writeFileSync(
      path.join(accountsDir, "account-one.json"),
      JSON.stringify({ token: "secret-token" })
    );

    await expect(helper.disconnect({ accountId: "account-one" })).resolves.toEqual({
      success: true,
    });
    expect(spawn).toHaveBeenCalledTimes(3);
  });

  it("does not expose warning-only stderr as disconnect failure reason", async () => {
    const { helper } = loadHelper([
      ...readyEnvironmentQueue(),
      { stderr: "Config warnings:\n", code: 1 },
      { stderr: "Config warnings:\nplugins.allow is empty\n", code: 1 },
    ]);
    const accountsDir = path.join(tempHome, "accounts");
    fs.mkdirSync(accountsDir, { recursive: true });
    fs.writeFileSync(
      path.join(tempHome, "accounts.json"),
      JSON.stringify(["account-one"])
    );
    fs.writeFileSync(
      path.join(accountsDir, "account-one.json"),
      JSON.stringify({ token: "secret-token" })
    );

    await expect(helper.disconnect({ accountId: "account-one" })).resolves.toEqual({
      success: false,
      error: "disconnect_failed",
      reason: "logout_failed_without_error_details",
    });
  });

  it("succeeds when account logout has warning-only failure and channel logout succeeds", async () => {
    const { helper, spawn } = loadHelper([
      ...readyEnvironmentQueue(),
      { stderr: "Config warnings:\nplugins.allow is empty\n", code: 1 },
      { stderr: "Config warnings:\n", code: 0 },
    ]);
    const accountsDir = path.join(tempHome, "accounts");
    fs.mkdirSync(accountsDir, { recursive: true });
    fs.writeFileSync(
      path.join(tempHome, "accounts.json"),
      JSON.stringify(["account-one"])
    );
    fs.writeFileSync(
      path.join(accountsDir, "account-one.json"),
      JSON.stringify({ token: "secret-token" })
    );

    await expect(helper.disconnect({ accountId: "account-one" })).resolves.toEqual({
      success: true,
    });
    expect(spawn).toHaveBeenCalledTimes(4);
  });

  it("installs and retries when logout emits the OpenClaw install prompt", async () => {
    const { helper, spawn } = loadHelper([
      ...readyEnvironmentQueue(),
      { stdout: OPENCLAW_INSTALL_PROMPT, stayOpen: true },
      { stdout: "installed" },
      { stdout: "logged out" },
    ]);
    const accountsDir = path.join(tempHome, "accounts");
    fs.mkdirSync(accountsDir, { recursive: true });
    fs.writeFileSync(
      path.join(tempHome, "accounts.json"),
      JSON.stringify(["account-one"])
    );
    fs.writeFileSync(
      path.join(accountsDir, "account-one.json"),
      JSON.stringify({ token: "secret-token" })
    );

    await expect(helper.disconnect({ accountId: "account-one" })).resolves.toEqual({
      success: true,
    });
    expect(spawn).toHaveBeenNthCalledWith(
      4,
      "npx",
      ["-y", "@tencent-weixin/openclaw-weixin-cli", "install"],
      expect.objectContaining({ shell: false })
    );
  });

  it("returns a stable reason when logout still emits the install prompt after retry", async () => {
    const { helper } = loadHelper([
      ...readyEnvironmentQueue(),
      { stdout: OPENCLAW_INSTALL_PROMPT, stayOpen: true },
      { stdout: "installed" },
      { stdout: OPENCLAW_INSTALL_PROMPT, stayOpen: true },
    ]);
    const accountsDir = path.join(tempHome, "accounts");
    fs.mkdirSync(accountsDir, { recursive: true });
    fs.writeFileSync(
      path.join(tempHome, "accounts.json"),
      JSON.stringify(["account-one"])
    );
    fs.writeFileSync(
      path.join(accountsDir, "account-one.json"),
      JSON.stringify({ token: "secret-token" })
    );

    const result = await helper.disconnect({ accountId: "account-one" });
    expect(result).toEqual({
      success: false,
      error: "disconnect_failed",
      reason: "openclaw_interactive_prompt",
    });
    expect(JSON.stringify(result)).not.toContain("Install openclaw-weixin");
    expect(JSON.stringify(result)).not.toContain("Download from npm");
  });

  it("disconnect returns quickly when no login child or account metadata exists", async () => {
    const { helper, spawn } = loadHelper();

    await expect(helper.disconnect({ accountId: "stale-db-account" })).resolves.toEqual({
      success: true,
    });
    expect(spawn).not.toHaveBeenCalled();
  });
});
