const { spawn } = require("child_process");
const { EventEmitter } = require("events");
const fs = require("fs");
const os = require("os");
const path = require("path");

const IDLE_SHUTDOWN_MS = 5 * 60_000;
// The only ANYTHINGLLM_CHROMIUM_ARGS flags used; the rest (e.g. --no-sandbox) are dropped.
const ALLOWED_EXTRA_ARGS =
  /^--(proxy-server|proxy-bypass-list|proxy-pac-url|lang|disable-gpu|disable-software-rasterizer|disable-dev-shm-usage)(=|$)/i;
const PASSED_ENV = [
  "PATH",
  "HOME",
  "TMPDIR",
  "TMP",
  "TEMP",
  "LANG",
  "LC_ALL",
  "TZ",
  "LD_LIBRARY_PATH",
  "FONTCONFIG_PATH",
  "FONTCONFIG_FILE",
  "XDG_CONFIG_HOME",
  "XDG_CACHE_HOME",
  "CHROME_DEVEL_SANDBOX",
  // Windows, for local development.
  "SYSTEMROOT",
  "WINDIR",
  "LOCALAPPDATA",
  "APPDATA",
  "PROGRAMFILES",
  "USERPROFILE",
];

// Killed on exit so no browser outlives the server.
const running = new Set();
process.once("exit", () => {
  for (const connection of running) connection.kill();
});

// Where the Docker image installs Chromium (see docker/Dockerfile).
const IMAGE_CHROMIUM = {
  arm64: "/app/chrome-linux/chrome",
  puppeteerCache: "/app/.cache/puppeteer",
};

/**
 * Production only uses the Docker image's Chromium. Development also checks CHROME_PATH,
 * PUPPETEER_EXECUTABLE_PATH, the puppeteer cache and system installs.
 * @returns {string|null}
 */
function findChromium() {
  if (process.env.NODE_ENV === "production")
    return (
      [IMAGE_CHROMIUM.arm64].find((exe) => fs.existsSync(exe)) ||
      puppeteerChrome(IMAGE_CHROMIUM.puppeteerCache)
    );

  for (const env of ["CHROME_PATH", "PUPPETEER_EXECUTABLE_PATH"])
    if (process.env[env] && fs.existsSync(process.env[env]))
      return process.env[env];

  return (
    puppeteerChrome(
      process.env.PUPPETEER_CACHE_DIR ||
        path.join(os.homedir(), ".cache", "puppeteer")
    ) ||
    [
      "/usr/bin/chromium",
      "/usr/bin/chromium-browser",
      "/usr/bin/google-chrome",
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    ].find((exe) => fs.existsSync(exe)) ||
    null
  );
}

/**
 * The newest Chrome for Testing build in a puppeteer cache folder.
 * @param {string} cache
 * @returns {string|null}
 */
function puppeteerChrome(cache) {
  const builds = path.join(cache, "chrome");
  if (!fs.existsSync(builds)) return null;
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
  return null;
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
    // A browser that dies (most often: it can't start its sandbox) resets the pipes, and a failed
    // spawn never exits. Unhandled, either error would crash the whole server.
    for (const stream of [proc.stdio[2], proc.stdio[3], proc.stdio[4]])
      stream?.on("error", () => {});
    proc.on("error", () => this.#gone());
    proc.on("exit", () => this.#gone());
  }

  #gone() {
    if (this.closed) return;
    this.closed = true;
    for (const { reject, method } of this.callbacks.values())
      reject(new Error(`The browser closed (${method}).`));
    this.callbacks.clear();
    this.emit("closed");
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
 * Headless Chromium browsers, one per profile key (see profiles.js), so no one shares a browser -
 * or a crash - with anyone else. A saved profile's folder persists sign-ins; an incognito browser
 * uses a temp folder deleted on shutdown, plus a fresh context per session (see tab.js).
 */
class Chromium {
  /** @type {Map<string, {connection: Promise<Connection>|null, live: Connection|null, users: number, idleTimer: NodeJS.Timeout|null}>} */
  static #browsers = new Map();
  /** Browsers still shutting down: key -> promise. A new launch on that profile waits for it. */
  static #closing = new Map();

  /** A Chromium exists and can run sandboxed - Chromium cannot sandbox itself as root. */
  static get available() {
    return !!findChromium() && process.getuid?.() !== 0;
  }

  /**
   * @param {string} key - profile key
   * @param {{profileDir?: string|null}} opts - the saved profile's folder; none for incognito
   * @returns {Promise<Connection>}
   */
  static async acquire(key, { profileDir = null } = {}) {
    await Chromium.#closing.get(key);
    let browser = Chromium.#browsers.get(key);
    if (!browser) {
      browser = { connection: null, live: null, users: 0, idleTimer: null };
      Chromium.#browsers.set(key, browser);
    }
    browser.users++;
    clearTimeout(browser.idleTimer);
    if (!browser.connection) {
      browser.connection = Chromium.#launch(browser, profileDir).catch(
        (error) => {
          browser.connection = null;
          throw error;
        }
      );
    }
    try {
      return await browser.connection;
    } catch (error) {
      browser.users--;
      throw error;
    }
  }

  /** @param {string} key */
  static release(key) {
    const browser = Chromium.#browsers.get(key);
    if (!browser) return;
    browser.users = Math.max(0, browser.users - 1);
    if (browser.users) return;
    clearTimeout(browser.idleTimer);
    browser.idleTimer = setTimeout(
      () => Chromium.shutdown(key),
      IDLE_SHUTDOWN_MS
    );
    browser.idleTimer.unref?.();
  }

  /**
   * Close a profile's browser now. It is asked to close first, so cookies from a recent
   * sign-in are written to the saved profile, and killed if it does not.
   * @param {string} key
   */
  static async shutdown(key) {
    const browser = Chromium.#browsers.get(key);
    if (!browser) return await Chromium.#closing.get(key);
    Chromium.#browsers.delete(key);
    clearTimeout(browser.idleTimer);
    const closing = Chromium.#close(browser).finally(() => {
      if (Chromium.#closing.get(key) === closing) Chromium.#closing.delete(key);
    });
    Chromium.#closing.set(key, closing);
    await closing;
  }

  static async #close(browser) {
    const connection = await browser.connection?.catch(() => null);
    if (!connection || connection.closed) return;
    const exited = new Promise((resolve) => connection.once("closed", resolve));
    connection.send("Browser.close").catch(() => {});
    const timer = setTimeout(() => connection.kill(), 5_000);
    await exited;
    clearTimeout(timer);
  }

  static async #launch(browser, profileDir) {
    const exe = findChromium();
    if (!exe)
      throw new Error(
        "No Chromium browser was found. Set CHROME_PATH to a Chrome or Chromium executable."
      );
    if (process.getuid?.() === 0)
      throw new Error(
        "The browser cannot run as root: Chromium's sandbox needs a regular user."
      );
    const userDataDir = profileDir || tempDir("anythingllm-browser-");
    // A saved profile holds the user's sign-ins - only the server's own user may read it.
    fs.mkdirSync(userDataDir, { recursive: true, mode: 0o700 });
    fs.chmodSync(userDataDir, 0o700);
    // The page cache never goes into a saved profile - it would only grow the storage folder.
    const cacheDir = tempDir("anythingllm-browser-cache-");
    // A browser that was killed (a server restart) leaves its lock behind, and Chromium refuses a
    // locked profile. Only this process ever opens the folder, so the lock is always stale here.
    for (const lock of ["SingletonLock", "SingletonSocket", "SingletonCookie"])
      fs.rmSync(path.join(userDataDir, lock), { force: true });
    disablePasswordManager(userDataDir);

    const extraArgs = allowedExtraArgs(process.env.ANYTHINGLLM_CHROMIUM_ARGS);
    const proc = spawn(
      exe,
      [
        "--headless=new",
        "--remote-debugging-pipe",
        `--user-data-dir=${userDataDir}`,
        `--disk-cache-dir=${cacheDir}`,
        "--disable-gpu-shader-disk-cache",
        "--window-size=1280,800",
        "--no-first-run",
        "--no-default-browser-check",
        "--disable-dev-shm-usage",
        // A browser under a debugger otherwise sets navigator.webdriver.
        "--disable-blink-features=AutomationControlled",
        "--lang=en-US",
        // Chromium's own errors (GPU, USB, policy) are noise in the server log.
        "--log-level=3",
        ...extraArgs,
        "about:blank",
      ],
      { stdio: ["ignore", "ignore", "pipe", "pipe", "pipe"], env: browserEnv() }
    );
    // Kept only to explain a browser that fails to start (most often: no sandbox in this container).
    let stderr = "";
    proc.stderr.on("data", (chunk) => {
      stderr = (stderr + chunk.toString("utf8")).slice(-2_000);
    });
    const connection = new Connection(proc);
    browser.live = connection;
    running.add(connection);
    connection.on("closed", () => {
      running.delete(connection);
      fs.rm(cacheDir, { recursive: true, force: true }, () => {});
      if (!profileDir)
        fs.rm(userDataDir, { recursive: true, force: true }, () => {});
      // A crashed browser is relaunched by the next session - unless a newer one already replaced it.
      if (browser.live !== connection) return;
      browser.live = null;
      browser.connection = null;
    });

    const { product } = await connection
      .send("Browser.getVersion")
      .catch(() => {
        const output = stderr.trim().split("\n").slice(-5).join("\n");
        throw new Error(
          `The browser could not start. If it reports a sandbox error, the container needs to allow Chromium's sandbox (see the Browser Use docs).${output ? `\n${output}` : ""}`
        );
      });
    console.log(
      `\x1b[36m[BrowserUse]\x1b[0m Started ${product}${profileDir ? ` on profile ${path.basename(profileDir)}` : " (incognito)"}`
    );
    return connection;
  }
}

/**
 * The flags of ANYTHINGLLM_CHROMIUM_ARGS this browser may use (see ALLOWED_EXTRA_ARGS).
 * @param {string|undefined} value - comma-separated flags
 * @returns {string[]}
 */
function allowedExtraArgs(value) {
  return String(value || "")
    .split(",")
    .map((arg) => arg.trim())
    .filter((arg) => arg && ALLOWED_EXTRA_ARGS.test(arg));
}

function browserEnv() {
  const env = {};
  for (const [name, value] of Object.entries(process.env))
    if (PASSED_ENV.includes(name.toUpperCase())) env[name] = value;
  return env;
}

function tempDir(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

/**
 * Headless Chrome's password manager leaves a save-password bubble after a login form that
 * swallows every later click. Sessions never keep passwords anyway.
 */
function disablePasswordManager(userDataDir) {
  const file = path.join(userDataDir, "Default", "Preferences");
  let prefs = {};
  try {
    prefs = JSON.parse(fs.readFileSync(file, "utf8")) || {};
  } catch {}
  prefs.credentials_enable_service = false;
  prefs.profile = {
    ...(prefs.profile || {}),
    password_manager_enabled: false,
    password_manager_leak_detection: false,
  };
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(prefs));
}

module.exports = { Chromium, allowedExtraArgs };
