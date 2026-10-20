const { Chromium } = require("./chromium");
const { BrowserProfiles } = require("./profiles");
const { BrowserSession } = require("./session");

const FRAME_INTERVAL_MS = 250;
// Sessions are closed by the agent when it finishes; this only catches ones it never got to close.
const IDLE_TIMEOUT_MS = 30 * 60_000;
// A start still running after this long logs what it is waiting on, every time it passes again.
const SLOW_START_LOG_MS = 15_000;

/**
 * The browser side of the browser-use agent skill, running in the server process. Each person has
 * their own headless Chromium on their saved profile, and a separate one for incognito sessions
 * (see chromium.js and profiles.js), so no one's browsing touches anyone else's.
 *
 * It answers the agent's requests (see bridge.js), and adds what the chat card needs to show the
 * session and hand control to a person: live frames (watch) and their clicks and keys (input).
 */
class BrowserDriver {
  /** @type {Map<string, {session: BrowserSession, profile: string, touched: number, watchers: Set<Function>, stopFrames: Function|null}>} */
  static #sessions = new Map();
  static #reaper = null;
  /** Cards that asked to watch before their session started: sessionId -> listeners */
  static #earlyWatchers = new Map();
  /** Sessions still starting, and those of them closed meanwhile (the agent gave up waiting). */
  static #starting = new Set();
  static #cancelled = new Set();

  static log(text, ...args) {
    console.log(`\x1b[36m[BrowserUse]\x1b[0m ${text}`, ...args);
  }

  /**
   * A request from the agent, through bridge.js.
   * @param {string} action - start | act | close | attention | hide
   * @param {Object} params
   */
  static async request(action, { sessionId, ...params } = {}) {
    switch (action) {
      case "start":
        return await BrowserDriver.#start(sessionId, params);
      case "act":
        return await BrowserDriver.#get(sessionId).run(
          params.tool,
          params.args || {}
        );
      case "close":
        BrowserDriver.close(sessionId);
        return true;
      // The chat card already shows the help request - there is no window to raise or hide.
      case "attention":
      case "hide":
        return true;
      default:
        throw new Error(`Unknown browser-use action "${action}"`);
    }
  }

  /**
   * @param {string} sessionId
   * @param {{profile: string, maxChars: number, startUrl: string|null, terms: string[]}} params
   *   profile - the profile key the plugin chose for the user (see profiles.js)
   */
  static async #start(sessionId, params) {
    BrowserDriver.close(sessionId);
    BrowserDriver.#starting.add(sessionId);
    // A start that hangs says where, so the log explains a "did not respond to start".
    const phase = { now: "launching the browser" };
    const slow = setInterval(
      () =>
        BrowserDriver.log(
          `Session ${sessionId} is still starting: ${phase.now}`
        ),
      SLOW_START_LOG_MS
    );
    slow.unref?.();
    try {
      return await BrowserDriver.#open(sessionId, params, phase);
    } finally {
      clearInterval(slow);
      BrowserDriver.#starting.delete(sessionId);
      BrowserDriver.#cancelled.delete(sessionId);
    }
  }

  /** A start that was closed while in flight closes what it opened, rather than leaving it behind. */
  static #abandoned(sessionId) {
    if (!BrowserDriver.#cancelled.has(sessionId)) return;
    BrowserDriver.close(sessionId);
    throw new Error("The browser session was closed while it was starting.");
  }

  static async #open(sessionId, { profile, maxChars, startUrl, terms }, phase) {
    const parsed = BrowserProfiles.parse(profile);
    if (!parsed) throw new Error(`"${profile}" is not a browser profile.`);
    const connection = await Chromium.acquire(profile, {
      profileDir: parsed.incognito ? null : BrowserProfiles.dirFor(profile),
    });
    phase.now = "opening a tab";
    let session;
    try {
      session = await BrowserSession.create({
        id: sessionId,
        connection,
        isolated: parsed.incognito,
        maxChars,
        terms,
      });
    } catch (error) {
      Chromium.release(profile);
      throw error;
    }
    const entry = {
      session,
      profile,
      touched: Date.now(),
      watchers: new Set(),
      stopFrames: null,
    };
    BrowserDriver.#sessions.set(sessionId, entry);
    for (const listener of BrowserDriver.#earlyWatchers.get(sessionId) || [])
      BrowserDriver.#addWatcher(entry, listener);
    BrowserDriver.#earlyWatchers.delete(sessionId);
    BrowserDriver.#startReaper();
    BrowserDriver.log(`Started session ${sessionId} on ${profile}`);
    BrowserDriver.#abandoned(sessionId);
    phase.now = `loading ${startUrl}`;
    const result = startUrl
      ? await session.run("navigate", { url: startUrl })
      : null;
    BrowserDriver.#abandoned(sessionId);
    return {
      profile: {
        id: profile,
        name: parsed.incognito ? "Incognito" : "Saved profile",
        ephemeral: parsed.incognito,
      },
      result,
    };
  }

  static #get(sessionId) {
    const entry = BrowserDriver.#sessions.get(sessionId);
    if (!entry) throw new Error("The browser session has ended.");
    entry.touched = Date.now();
    return entry.session;
  }

  static close(sessionId) {
    if (BrowserDriver.#starting.has(sessionId))
      BrowserDriver.#cancelled.add(sessionId);
    const entry = BrowserDriver.#sessions.get(sessionId);
    if (!entry) return;
    BrowserDriver.#sessions.delete(sessionId);
    entry.stopFrames?.();
    entry.watchers.clear();
    entry.session.close();
    Chromium.release(entry.profile);
    BrowserDriver.log(`Closed session ${sessionId}`);
  }

  /**
   * Wipe a saved profile: end its sessions, shut its browser down and delete its folder. The
   * user's next session starts a new, empty profile.
   * @param {string} key
   */
  static async deleteProfile(key) {
    if (!BrowserProfiles.dirFor(key)) return false;
    for (const [id, entry] of BrowserDriver.#sessions)
      if (entry.profile === key) BrowserDriver.close(id);
    await Chromium.shutdown(key);
    if (BrowserProfiles.removeDir(key))
      BrowserDriver.log(`Deleted browser profile ${key}`);
    return true;
  }

  /**
   * A user was deleted - their saved profile goes with them, and their incognito browser is closed.
   * @param {number} userId
   */
  static async deleteUserProfile(userId) {
    const key = BrowserProfiles.keyFor(userId);
    const incognito = BrowserProfiles.incognitoKeyFor(key);
    for (const [id, entry] of BrowserDriver.#sessions)
      if (entry.profile === incognito) BrowserDriver.close(id);
    await Chromium.shutdown(incognito);
    return await BrowserDriver.deleteProfile(key);
  }

  /** Multi-user mode was turned on - nobody may use the single-user profile any more. */
  static async deleteSingleUserProfile() {
    return await BrowserDriver.deleteUserProfile(null);
  }

  /**
   * Stream a session's live view. Frames are only produced while someone watches, throttled with a
   * trailing send so the last frame of a burst always arrives (pages often stop repainting right after).
   * @param {string} sessionId
   * @param {(frame: string) => void} listener - base64 jpeg
   * @returns {() => void} stop watching
   */
  static watch(sessionId, listener) {
    const entry = BrowserDriver.#sessions.get(sessionId);
    // The card shows up before the browser has started - hold on to it until it has.
    if (!entry) {
      const early = BrowserDriver.#earlyWatchers.get(sessionId) || new Set();
      BrowserDriver.#earlyWatchers.set(sessionId, early.add(listener));
    } else BrowserDriver.#addWatcher(entry, listener);
    return () => {
      const early = BrowserDriver.#earlyWatchers.get(sessionId);
      early?.delete(listener);
      if (early && !early.size) BrowserDriver.#earlyWatchers.delete(sessionId);
      const current = BrowserDriver.#sessions.get(sessionId);
      if (!current?.watchers.delete(listener)) return;
      if (current.watchers.size || !current.stopFrames) return;
      current.stopFrames();
      current.stopFrames = null;
    };
  }

  static #addWatcher(entry, listener) {
    entry.watchers.add(listener);
    if (!entry.stopFrames) entry.stopFrames = BrowserDriver.#stream(entry);
    // The screencast only sends a frame on repaint - start the viewer off with the current picture.
    entry.session.currentFrame().then((frame) => frame && listener(frame));
  }

  static #stream(entry) {
    const { session } = entry;
    let lastSent = 0;
    let pending = null;
    let timer = null;
    const flush = () => {
      timer = null;
      if (!pending) return;
      for (const listener of entry.watchers) listener(pending);
      pending = null;
      lastSent = Date.now();
    };
    const onFrame = (frame) => {
      pending = frame;
      if (!timer)
        timer = setTimeout(
          flush,
          Math.max(0, FRAME_INTERVAL_MS - (Date.now() - lastSent))
        );
    };
    session.tab.on("frame", onFrame);
    session.setStreaming(true);
    return () => {
      clearTimeout(timer);
      session.tab.off("frame", onFrame);
      session.setStreaming(false);
    };
  }

  /**
   * A click, press, move, release, scroll, key or text from the person helping in the chat card.
   * @param {string} sessionId
   * @param {Object} event - see BrowserSession#userInput
   */
  static async input(sessionId, event) {
    const entry = BrowserDriver.#sessions.get(sessionId);
    if (!entry) return;
    entry.touched = Date.now();
    await entry.session
      .userInput(event)
      .catch((error) =>
        BrowserDriver.log(`Input for ${sessionId} failed:`, error.message)
      );
  }

  static #startReaper() {
    if (BrowserDriver.#reaper) return;
    BrowserDriver.#reaper = setInterval(() => {
      const now = Date.now();
      for (const [id, entry] of BrowserDriver.#sessions)
        if (
          now - Math.max(entry.touched, entry.session.lastUserInput) >
          IDLE_TIMEOUT_MS
        )
          BrowserDriver.close(id);
      if (!BrowserDriver.#sessions.size) {
        clearInterval(BrowserDriver.#reaper);
        BrowserDriver.#reaper = null;
      }
    }, 60_000);
    BrowserDriver.#reaper.unref?.();
  }
}

module.exports = { BrowserDriver };
