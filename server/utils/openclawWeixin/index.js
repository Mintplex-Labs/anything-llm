const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");

const CHANNEL_ID = "openclaw-weixin";
const DEFAULT_COMMAND_TIMEOUT_MS = 60_000;
const LOGOUT_COMMAND_TIMEOUT_MS = 10_000;
const LOGIN_QR_TIMEOUT_MS = 60_000;
const ASCII_QR_SETTLE_MS = 2_500;
const MAX_CAPTURE_BYTES = 64_000;
const LOGIN_GRACE_MS = 2_000;
const ACTIVE_LOGIN_TTL_MS = 5 * 60_000;
const INTERACTIVE_PROMPT_PATTERNS = [
  /Install openclaw-weixin plugin\?/i,
  /Download from npm \(@tencent-weixin\/openclaw-weixin\)/i,
  /Skip for now/i,
  /◆\s*Install/i,
];
const CONFIG_WARNING_PATTERNS = [
  /^config warnings:?$/i,
  /(?:channel )?plugin manifest declares .* without channelConfigs metadata/i,
  /plugins\.allow is empty/i,
  /discovered non-bundled plugins may auto-load/i,
  /^[-=─\s]+$/,
  /^openclaw\b/i,
  /\bconfig warning\b/i,
  /\bwarning\b/i,
];
const DECORATIVE_OUTPUT_PATTERNS = [/^[│┌┐└┘├┤┬┴┼─╭╮╰╯]+/, /^[◆●○]\s*/];

let activeLoginChild = null;

function getOpenClawBin() {
  return process.env.OPENCLAW_BIN?.trim() || "openclaw";
}

function getWeixinHome() {
  return (
    process.env.OPENCLAW_WEIXIN_HOME?.trim() ||
    path.join(os.homedir(), ".openclaw", "openclaw-weixin")
  );
}

function appendBounded(current = "", next = "") {
  const output = `${current}${next}`;
  if (Buffer.byteLength(output) <= MAX_CAPTURE_BYTES) return output;
  return output.slice(output.length - MAX_CAPTURE_BYTES);
}

function stripAnsi(text = "") {
  return String(text).replace(
    // eslint-disable-next-line no-control-regex
    /[\u001B\u009B][[\]()#;?]*(?:\d{1,4}(?:;\d{0,4})*)?[\dA-PR-TZcf-nq-uy=><~]/g,
    ""
  );
}

function sanitizeOutput(text = "") {
  return stripAnsi(text)
    .replace(/("token"\s*:\s*")[^"]+(")/gi, "$1***$2")
    .replace(/("botToken"\s*:\s*")[^"]+(")/gi, "$1***$2")
    .replace(/(bot_token[=:]\s*)[^\s,}]+/gi, "$1***")
    .slice(-4_000);
}

function hasInteractivePrompt(text = "") {
  const clean = stripAnsi(text);
  return INTERACTIVE_PROMPT_PATTERNS.some((pattern) => pattern.test(clean));
}

function stripConfigWarnings(text = "") {
  return String(text)
    .split(/\r?\n/)
    .filter((line) => {
      const clean = line.trim();
      if (!clean) return false;
      if (INTERACTIVE_PROMPT_PATTERNS.some((pattern) => pattern.test(clean)))
        return false;
      if (CONFIG_WARNING_PATTERNS.some((pattern) => pattern.test(clean)))
        return false;
      return !DECORATIVE_OUTPUT_PATTERNS.some((pattern) => pattern.test(clean));
    })
    .join("\n")
    .trim();
}

function commandFailureReason(result = {}) {
  if (
    result.errorCode === "openclaw_interactive_prompt" ||
    hasInteractivePrompt(`${result.stdout || ""}\n${result.stderr || ""}`)
  ) {
    return "openclaw_interactive_prompt";
  }

  const filteredReason =
    stripConfigWarnings(result.stderr || "") ||
    stripConfigWarnings(result.stdout || "");
  if (filteredReason) return filteredReason;
  if (result.signal) return `terminated_by_${result.signal}`;
  return "logout_failed_without_error_details";
}

function commandEnv() {
  return {
    ...process.env,
    CI: "true",
    NO_COLOR: "1",
  };
}

function logCommandWarnings(commandName = "openclaw", result = {}) {
  const warnings = String(result.stderr || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) =>
      CONFIG_WARNING_PATTERNS.some((pattern) => pattern.test(line))
    );
  if (warnings.length) {
    console.warn(
      `[OpenClawWeixin] ${commandName} warnings:`,
      warnings.join(" | ")
    );
  }
}

function runCommand(
  file,
  args = [],
  { timeoutMs = DEFAULT_COMMAND_TIMEOUT_MS } = {}
) {
  return new Promise((resolve) => {
    let stdout = "";
    let stderr = "";
    let settled = false;

    const child = spawn(file, args, {
      shell: false,
      env: commandEnv(),
      stdio: ["pipe", "pipe", "pipe"],
    });
    child.stdin?.end?.();

    const timeout = setTimeout(() => {
      child.kill("SIGTERM");
      setTimeout(() => {
        if (child.exitCode === null && child.signalCode === null)
          child.kill("SIGKILL");
      }, LOGIN_GRACE_MS).unref?.();
    }, timeoutMs);

    const resolveInteractivePrompt = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      child.kill("SIGTERM");
      setTimeout(() => {
        if (child.exitCode === null && child.signalCode === null)
          child.kill("SIGKILL");
      }, LOGIN_GRACE_MS).unref?.();
      resolve({
        ok: false,
        code: null,
        signal: null,
        errorCode: "openclaw_interactive_prompt",
        stdout: sanitizeOutput(stdout),
        stderr: sanitizeOutput(stderr),
      });
    };

    child.stdout.on("data", (chunk) => {
      stdout = appendBounded(stdout, chunk.toString("utf8"));
      if (hasInteractivePrompt(stdout)) resolveInteractivePrompt();
    });
    child.stderr.on("data", (chunk) => {
      stderr = appendBounded(stderr, chunk.toString("utf8"));
      if (hasInteractivePrompt(stderr)) resolveInteractivePrompt();
    });

    child.on("error", (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      resolve({
        ok: false,
        code: null,
        error,
        stdout: sanitizeOutput(stdout),
        stderr: sanitizeOutput(stderr),
      });
    });

    child.on("close", (code, signal) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      resolve({
        ok: code === 0,
        code,
        signal,
        stdout: sanitizeOutput(stdout),
        stderr: sanitizeOutput(stderr),
      });
    });
  });
}

async function ensureWeixinHomeAvailable() {
  const weixinHome = getWeixinHome();
  const parent = path.dirname(weixinHome);
  try {
    fs.mkdirSync(parent, { recursive: true });
    fs.accessSync(parent, fs.constants.R_OK | fs.constants.W_OK);

    if (fs.existsSync(weixinHome)) {
      fs.accessSync(weixinHome, fs.constants.R_OK | fs.constants.W_OK);
      const accountIndex = path.join(weixinHome, "accounts.json");
      const accountsDir = path.join(weixinHome, "accounts");
      if (fs.existsSync(accountIndex))
        JSON.parse(fs.readFileSync(accountIndex, "utf8"));
      if (fs.existsSync(accountsDir))
        fs.accessSync(accountsDir, fs.constants.R_OK);
    }

    return true;
  } catch (error) {
    console.warn("[OpenClawWeixin] environment check failed:", error.message);
    return false;
  }
}

async function detectEnvironment() {
  const openclawBin = getOpenClawBin();
  const version = await runCommand(openclawBin, ["--version"]);
  if (version.errorCode === "openclaw_interactive_prompt")
    return { status: "openclaw_interactive_prompt" };
  if (!version.ok) return { status: "openclaw_not_installed" };

  const plugin = await runCommand(openclawBin, [
    "plugins",
    "inspect",
    CHANNEL_ID,
  ]);
  if (plugin.errorCode === "openclaw_interactive_prompt")
    return { status: "openclaw_interactive_prompt" };
  if (!plugin.ok) return { status: "plugin_missing" };

  if (!(await ensureWeixinHomeAvailable()))
    return { status: "environment_incomplete" };

  return { status: "environment_ready" };
}

async function installOpenClawWeixinPlugin() {
  return await runCommand("npx", [
    "-y",
    "@tencent-weixin/openclaw-weixin-cli",
    "install",
  ]);
}

async function prepareEnvironment() {
  const initial = await detectEnvironment();
  if (initial.status === "environment_ready") return initial;
  if (initial.status === "openclaw_not_installed") return initial;

  const install = await installOpenClawWeixinPlugin();
  if (!install.ok) {
    return {
      status: "plugin_install_failed",
      reason: commandFailureReason(install),
    };
  }

  const next = await detectEnvironment();
  if (next.status === "environment_ready") return next;
  return next.status === "openclaw_not_installed"
    ? next
    : { status: "environment_incomplete" };
}

function extractQrData(output = "") {
  const clean = stripAnsi(output);
  const dataUrl = clean.match(
    /data:image\/(?:png|jpe?g|webp);base64,[A-Za-z0-9+/=]+/i
  )?.[0];
  if (dataUrl)
    return {
      qrCode: dataUrl,
      qrCodeType: "image",
      extractionSource: "data_url",
      qrCodePreview: previewQrCode(dataUrl),
    };

  const urls = collectQrUrls(clean);
  const preferredUrl =
    urls.find((url) => /liteapp\.weixin\.qq\.com\/q\//i.test(url)) ||
    urls.find((url) => /ilink|weixin|wechat|qrcode|qr/i.test(url)) ||
    urls[0];
  if (preferredUrl)
    return {
      qrCode: preferredUrl,
      qrCodeType: "url",
      extractionSource: "url",
      qrCodePreview: previewQrCode(preferredUrl),
    };

  const asciiLines = clean
    .split(/\r?\n/)
    .filter((line) => /[█▀▄]/.test(line) && line.trim().length >= 8);
  if (asciiLines.length >= 4)
    return {
      qrCode: asciiLines.join("\n"),
      qrCodeType: "ascii",
      extractionSource: "ascii",
      qrCodePreview: previewQrCode(asciiLines.join("\n")),
    };

  return {
    qrCode: null,
    qrCodeType: null,
    extractionSource: null,
    qrCodePreview: null,
  };
}

function collectQrUrls(output = "") {
  return Array.from(output.matchAll(/https?:\/\/[^\s'"<>`]+/g))
    .map((match) => match[0])
    .map((url) =>
      url
        .replace(/&amp;/g, "&")
        .replace(/[)\]}>,，。；;、]+$/g, "")
        .trim()
    )
    .filter(Boolean);
}

function previewQrCode(qrCode = "") {
  return String(qrCode).replace(/\s+/g, " ").slice(0, 80);
}

function killChild(child) {
  return new Promise((resolve) => {
    if (!child || child.exitCode !== null || child.signalCode !== null) {
      resolve();
      return;
    }

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      resolve();
    };

    child.once("close", finish);
    child.kill("SIGTERM");
    setTimeout(() => {
      if (!done && child.exitCode === null && child.signalCode === null)
        child.kill("SIGKILL");
    }, LOGIN_GRACE_MS).unref?.();
    setTimeout(finish, LOGIN_GRACE_MS + 1_000).unref?.();
  });
}

async function cleanupOpenClawWeixinLoginChild() {
  if (!activeLoginChild) return;
  const child = activeLoginChild.child;
  activeLoginChild = null;
  await killChild(child);
}

function getActiveLoginState() {
  if (!activeLoginChild) return null;
  if (Date.now() - activeLoginChild.startedAt > ACTIVE_LOGIN_TTL_MS) {
    activeLoginChild.status = "expired";
  }
  return {
    startedAt: activeLoginChild.startedAt,
    status: activeLoginChild.status,
    qrCode: activeLoginChild.qrCode,
    qrCodeType: activeLoginChild.qrCodeType,
    accountId: activeLoginChild.accountId,
    outputTail: sanitizeOutput(activeLoginChild.output),
  };
}

async function startQrLogin() {
  await cleanupOpenClawWeixinLoginChild();

  return new Promise((resolve) => {
    const openclawBin = getOpenClawBin();
    const child = spawn(
      openclawBin,
      ["--no-color", "channels", "login", "--channel", CHANNEL_ID],
      {
        shell: false,
        env: commandEnv(),
        stdio: ["pipe", "pipe", "pipe"],
      }
    );
    child.stdin?.end?.();

    const login = {
      child,
      startedAt: Date.now(),
      status: "pending_scan",
      qrCode: null,
      qrCodeType: null,
      accountId: null,
      output: "",
    };
    activeLoginChild = login;

    let settled = false;
    let asciiSettle = null;
    const timeout = setTimeout(() => {
      if (settled) return;
      settled = true;
      if (asciiSettle) clearTimeout(asciiSettle);
      login.status = "expired";
      cleanupOpenClawWeixinLoginChild();
      resolve({
        success: false,
        error: "qr_generation_failed",
        reason: "qr_generation_timeout",
      });
    }, LOGIN_QR_TIMEOUT_MS);

    const resolveQr = (extracted) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      if (asciiSettle) clearTimeout(asciiSettle);
      login.qrCode = extracted.qrCode;
      login.qrCodeType = extracted.qrCodeType;
      resolve({
        success: true,
        status: "pending_scan",
        qr_status: "pending_scan",
        qr_code: extracted.qrCode,
        qr_code_type: extracted.qrCodeType,
        qr_code_preview: extracted.qrCodePreview,
        extraction_source: extracted.extractionSource,
      });
    };

    const handleOutput = (chunk) => {
      login.output = appendBounded(login.output, chunk.toString("utf8"));
      if (hasInteractivePrompt(login.output)) {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        if (asciiSettle) clearTimeout(asciiSettle);
        activeLoginChild = null;
        child.kill("SIGTERM");
        resolve({
          success: false,
          error: "qr_generation_failed",
          reason: "openclaw_interactive_prompt",
        });
        return;
      }

      const extracted = extractQrData(login.output);
      if (!extracted.qrCode || settled) return;

      if (extracted.qrCodeType !== "ascii") {
        resolveQr(extracted);
        return;
      }

      if (!asciiSettle) {
        asciiSettle = setTimeout(() => {
          resolveQr(extractQrData(login.output));
        }, ASCII_QR_SETTLE_MS);
      }
    };

    child.stdout.on("data", handleOutput);
    child.stderr.on("data", handleOutput);

    child.on("error", (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      if (asciiSettle) clearTimeout(asciiSettle);
      activeLoginChild = null;
      resolve({
        success: false,
        error: "qr_generation_failed",
        reason: error.message,
      });
    });

    child.on("close", () => {
      clearTimeout(timeout);
      if (activeLoginChild === login) {
        activeLoginChild.status = login.qrCode ? "expired" : "disconnected";
      }
      if (settled) return;
      settled = true;
      if (asciiSettle) clearTimeout(asciiSettle);
      activeLoginChild = null;
      resolve({
        success: false,
        error: "qr_generation_failed",
        reason: sanitizeOutput(login.output) || "login_process_exited",
      });
    });
  });
}

function safeReadJson(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

function listAccountIds() {
  const weixinHome = getWeixinHome();
  const indexed = safeReadJson(path.join(weixinHome, "accounts.json"));
  const ids = new Set();
  if (Array.isArray(indexed)) {
    indexed
      .filter((id) => typeof id === "string" && id.trim())
      .forEach((id) => ids.add(id.trim()));
  }

  const accountsDir = path.join(weixinHome, "accounts");
  try {
    for (const filename of fs.readdirSync(accountsDir)) {
      if (!filename.endsWith(".json")) continue;
      if (filename.endsWith(".sync.json")) continue;
      if (filename.endsWith(".context-tokens.json")) continue;
      ids.add(filename.replace(/\.json$/, ""));
    }
  } catch {
    // Missing accounts dir simply means no linked accounts yet.
  }

  return Array.from(ids);
}

function getConnectedProfile() {
  const accountsDir = path.join(getWeixinHome(), "accounts");
  for (const accountId of listAccountIds()) {
    const account = safeReadJson(path.join(accountsDir, `${accountId}.json`));
    if (!account || typeof account !== "object") continue;
    const hasToken = typeof account.token === "string" && account.token.trim();
    if (!hasToken) continue;

    return {
      accountId,
      lastConnectedAt:
        typeof account.savedAt === "string" ? account.savedAt : null,
      profile: {
        nickname: null,
        avatar_url: null,
        wxid:
          typeof account.userId === "string" && account.userId.trim()
            ? account.userId.trim()
            : accountId,
        openid: accountId,
      },
    };
  }

  return null;
}

async function getLoginStatus() {
  const connected = getConnectedProfile();
  if (connected) {
    if (activeLoginChild) {
      activeLoginChild.status = "connected";
      activeLoginChild.accountId = connected.accountId;
      await cleanupOpenClawWeixinLoginChild();
    }
    return { status: "connected", ...connected };
  }

  const active = getActiveLoginState();
  if (active?.status === "expired") {
    await cleanupOpenClawWeixinLoginChild();
    return { status: "expired", profile: null, accountId: null };
  }
  if (active) return { status: "pending_scan", profile: null, accountId: null };

  return { status: "disconnected", profile: null, accountId: null };
}

async function disconnect({ accountId = null } = {}) {
  const connected = getConnectedProfile();

  await cleanupOpenClawWeixinLoginChild();
  if (!connected) return { success: true };

  const environment = await prepareEnvironment();
  if (environment.status !== "environment_ready") {
    return {
      success: false,
      error: "disconnect_failed",
      reason: environment.reason || environment.status,
    };
  }

  const targetAccountId = connected?.accountId || accountId || null;
  const openclawBin = getOpenClawBin();
  if (targetAccountId) {
    const scoped = await runLogoutWithInstallRetry(
      openclawBin,
      [
        "channels",
        "logout",
        "--channel",
        CHANNEL_ID,
        "--account",
        targetAccountId,
      ],
      "account logout"
    );
    if (scoped.ok) return { success: true };
    if (commandFailureReason(scoped) === "openclaw_interactive_prompt") {
      return {
        success: false,
        error: "disconnect_failed",
        reason: "openclaw_interactive_prompt",
      };
    }
  }

  const result = await runLogoutWithInstallRetry(
    openclawBin,
    ["channels", "logout", "--channel", CHANNEL_ID],
    "channel logout"
  );
  if (!getConnectedProfile()) return { success: true };
  if (!result.ok) {
    return {
      success: false,
      error: "disconnect_failed",
      reason: commandFailureReason(result),
    };
  }
  return { success: true };
}

async function runLogoutWithInstallRetry(openclawBin, args, commandName) {
  let result = await runCommand(openclawBin, args, {
    timeoutMs: LOGOUT_COMMAND_TIMEOUT_MS,
  });
  logCommandWarnings(commandName, result);
  if (commandFailureReason(result) !== "openclaw_interactive_prompt")
    return result;

  const install = await installOpenClawWeixinPlugin();
  logCommandWarnings("plugin install", install);
  if (!install.ok) {
    return {
      ok: false,
      code: install.code,
      signal: install.signal,
      errorCode: commandFailureReason(install),
      stdout: install.stdout,
      stderr: install.stderr,
    };
  }

  result = await runCommand(openclawBin, args, {
    timeoutMs: LOGOUT_COMMAND_TIMEOUT_MS,
  });
  logCommandWarnings(`${commandName} retry`, result);
  return result;
}

module.exports = {
  CHANNEL_ID,
  cleanupOpenClawWeixinLoginChild,
  detectEnvironment,
  disconnect,
  extractQrData,
  collectQrUrls,
  getActiveLoginState,
  getConnectedProfile,
  getLoginStatus,
  getOpenClawBin,
  getWeixinHome,
  hasInteractivePrompt,
  prepareEnvironment,
  runCommand,
  startQrLogin,
};
