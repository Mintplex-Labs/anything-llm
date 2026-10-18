const { spawn } = require("child_process");
const { EventEmitter } = require("events");
const fs = require("fs");
const os = require("os");
const path = require("path");

// The browser is shut down after this long without a session, so it never sits in memory unused.
const IDLE_SHUTDOWN_MS = 5 * 60_000;

/**
 * Where Chromium lives. The Docker image provides one for the collector's web scraper:
 * CHROME_PATH on arm64, puppeteer's Chrome for Testing download on amd64. Bare-metal installs
 * use the same puppeteer download (collector) or a system Chrome/Chromium.
 * @returns {string|null}
 */
function findChromium() {
  for (const env of ["CHROME_PATH", "PUPPETEER_EXECUTABLE_PATH"])
    if (process.env[env] && fs.existsSync(process.env[env]))
      return process.env[env];

  const cache =
    process.env.PUPPETEER_CACHE_DIR ||
    path.join(os.homedir(), ".cache", "puppeteer");
  const builds = path.join(cache, "chrome");
  if (fs.existsSync(builds)) {
    for (const build of fs.readdirSync(builds).sort().reverse()) {
      for (const exe of [
        "chrome-linux64/chrome",
        "chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing",
        "chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing",
        "chrome-win64/chrome.exe",
      ]) {
        const full = path.join(builds, build, exe);
        if (fs.existsSync(full)) return full;
      }
    }
  }

  return (
    [
      "/usr/bin/chromium",
      "/usr/bin/chromium-browser",
      "/usr/bin/google-chrome",
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    ].find((exe) => fs.existsSync(exe)) || null
  );
}

/** One raw CDP connection over --remote-debugging-pipe, with flattened sessions. */
class Connection extends EventEmitter {
  constructor(proc) {
    super();
    this.setMaxListeners(100);
    this.proc = proc;
    this.lastId = 0;
    this.callbacks = new Map();
    this.closed = false;
    let buffer = "";
    proc.stdio[4].on("data", (chunk) => {
      buffer += chunk.toString("utf8");
      let end;
      while ((end = buffer.indexOf("\0")) !== -1) {
        const raw = buffer.slice(0, end);
        buffer = buffer.slice(end + 1);
        try {
          this.#dispatch(JSON.parse(raw));
        } catch {}
      }
    });
    proc.on("exit", () => {
      this.closed = true;
      for (const { reject, method } of this.callbacks.values())
        reject(new Error(`The browser closed (${method}).`));
      this.callbacks.clear();
      this.emit("closed");
    });
  }

  #dispatch(message) {
    if (message.id === undefined)
      return this.emit(
        "event",
        message.method,
        message.params || {},
        message.sessionId || ""
      );
    const callback = this.callbacks.get(message.id);
    if (!callback) return;
    this.callbacks.delete(message.id);
    if (message.error) callback.reject(new Error(message.error.message));
    else callback.resolve(message.result || {});
  }

  /**
   * @param {string} method
   * @param {Object} params
   * @param {string} [sessionId] - a flattened target session; the browser itself when empty
   */
  send(method, params = {}, sessionId = "") {
    if (this.closed)
      return Promise.reject(new Error("The browser has been closed."));
    const id = ++this.lastId;
    return new Promise((resolve, reject) => {
      this.callbacks.set(id, { resolve, reject, method });
      this.proc.stdio[3].write(
        JSON.stringify({
          id,
          method,
          params,
          ...(sessionId ? { sessionId } : {}),
        }) + "\0"
      );
    });
  }

  kill() {
    try {
      this.proc.kill("SIGKILL");
    } catch {}
  }
}

/**
 * The one headless Chromium all sessions share. Every session gets its own browser context
 * (like an incognito window), so sessions never see each other's cookies or storage.
 */
class Chromium {
  /** @type {Promise<Connection>|null} */
  static #connection = null;
  /** The running browser's connection, once launched. */
  static #live = null;
  static #idleTimer = null;
  static #users = 0;

  static get available() {
    return !!findChromium();
  }

  /** @returns {Promise<Connection>} */
  static async acquire() {
    Chromium.#users++;
    clearTimeout(Chromium.#idleTimer);
    if (!Chromium.#connection) {
      Chromium.#connection = Chromium.#launch().catch((error) => {
        Chromium.#connection = null;
        throw error;
      });
    }
    try {
      return await Chromium.#connection;
    } catch (error) {
      Chromium.#users--;
      throw error;
    }
  }

  static release() {
    Chromium.#users = Math.max(0, Chromium.#users - 1);
    if (Chromium.#users) return;
    clearTimeout(Chromium.#idleTimer);
    Chromium.#idleTimer = setTimeout(
      () => Chromium.#shutdown(),
      IDLE_SHUTDOWN_MS
    );
    Chromium.#idleTimer.unref?.();
  }

  static async #shutdown() {
    const pending = Chromium.#connection;
    Chromium.#connection = null;
    (await pending?.catch(() => null))?.kill();
  }

  static async #launch() {
    const exe = findChromium();
    if (!exe)
      throw new Error(
        "No Chromium browser was found. Set CHROME_PATH to a Chrome or Chromium executable."
      );
    const userDataDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "anythingllm-browser-")
    );
    // Headless Chrome's password manager leaves a save-password bubble after a login form that
    // swallows every later click. Sessions never keep passwords anyway.
    const prefs = path.join(userDataDir, "Default", "Preferences");
    fs.mkdirSync(path.dirname(prefs), { recursive: true });
    fs.writeFileSync(
      prefs,
      JSON.stringify({
        credentials_enable_service: false,
        profile: {
          password_manager_enabled: false,
          password_manager_leak_detection: false,
        },
      })
    );

    const extraArgs = String(process.env.ANYTHINGLLM_CHROMIUM_ARGS || "")
      .split(",")
      .map((arg) => arg.trim())
      .filter(Boolean);
    const proc = spawn(
      exe,
      [
        "--headless=new",
        "--remote-debugging-pipe",
        `--user-data-dir=${userDataDir}`,
        "--window-size=1280,800",
        "--no-first-run",
        "--no-default-browser-check",
        "--disable-dev-shm-usage",
        // A browser under a debugger otherwise sets navigator.webdriver.
        "--disable-blink-features=AutomationControlled",
        "--lang=en-US",
        // Chromium's own errors (GPU, USB, policy) are noise in the server log.
        "--log-level=3",
        ...(process.getuid?.() === 0 ? ["--no-sandbox"] : []),
        ...extraArgs,
        "about:blank",
      ],
      { stdio: ["ignore", "ignore", "ignore", "pipe", "pipe"] }
    );
    const connection = new Connection(proc);
    Chromium.#live = connection;
    connection.on("closed", () => {
      fs.rm(userDataDir, { recursive: true, force: true }, () => {});
      // A crashed browser is relaunched by the next session - unless a newer one already replaced it.
      if (Chromium.#live !== connection) return;
      Chromium.#live = null;
      Chromium.#connection = null;
    });
    process.once("exit", () => connection.kill());

    const { product } = await connection.send("Browser.getVersion");
    console.log(`\x1b[36m[BrowserUse]\x1b[0m Started ${product}`);
    return connection;
  }
}

module.exports = { Chromium, findChromium };
