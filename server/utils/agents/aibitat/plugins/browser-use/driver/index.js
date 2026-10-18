const { Chromium } = require("./chromium");
const { BrowserSession } = require("./session");

const FRAME_INTERVAL_MS = 250;
// Sessions are closed by the agent when it finishes; this only catches ones it never got to close.
const IDLE_TIMEOUT_MS = 30 * 60_000;
// Every session is a fresh, signed-out browser - nothing is kept between sessions.
const ANONYMOUS_PROFILE = { id: null, name: "Anonymous", ephemeral: true };

/**
 * The browser side of the browser-use agent skill, running in the server process: a headless
 * Chromium shared by all sessions, one isolated browser context per session.
 *
 * It answers the same requests the desktop app's Electron driver does (see bridge.js), and adds
 * what the chat card needs to show the session and hand control to a person: live frames
 * (watch) and their clicks and keys (input).
 */
class BrowserDriver {
  /** @type {Map<string, {session: BrowserSession, touched: number, watchers: Set<Function>, stopFrames: Function|null}>} */
  static #sessions = new Map();
  static #reaper = null;

  static log(text, ...args) {
    console.log(`\x1b[36m[BrowserUse]\x1b[0m ${text}`, ...args);
  }

  /**
   * @param {string} action - start | act | close | hide | attention | profiles
   * @param {Object} params
   */
  static async request(action, { sessionId, ...params } = {}) {
    switch (action) {
      case "profiles":
        return [ANONYMOUS_PROFILE];
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
      // The chat card itself is where the user sees and helps the session.
      case "show":
      case "hide":
      case "attention":
        return true;
      default:
        throw new Error(`Unknown browser-use action "${action}"`);
    }
  }

  static async #start(sessionId, { maxChars, startUrl, terms }) {
    BrowserDriver.close(sessionId);
    const connection = await Chromium.acquire();
    let session;
    try {
      session = await BrowserSession.create({
        id: sessionId,
        connection,
        maxChars,
        terms,
      });
    } catch (error) {
      Chromium.release();
      throw error;
    }
    BrowserDriver.#sessions.set(sessionId, {
      session,
      touched: Date.now(),
      watchers: new Set(),
      stopFrames: null,
    });
    BrowserDriver.#startReaper();
    BrowserDriver.log(`Started session ${sessionId}`);
    const result = startUrl
      ? await session.run("navigate", { url: startUrl })
      : null;
    return { profile: ANONYMOUS_PROFILE, result };
  }

  static #get(sessionId) {
    const entry = BrowserDriver.#sessions.get(sessionId);
    if (!entry) throw new Error("The browser session has ended.");
    entry.touched = Date.now();
    return entry.session;
  }

  static close(sessionId) {
    const entry = BrowserDriver.#sessions.get(sessionId);
    if (!entry) return;
    BrowserDriver.#sessions.delete(sessionId);
    entry.stopFrames?.();
    entry.watchers.clear();
    entry.session.close();
    Chromium.release();
    BrowserDriver.log(`Closed session ${sessionId}`);
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
    if (!entry) return () => {};
    entry.watchers.add(listener);
    if (!entry.stopFrames) entry.stopFrames = BrowserDriver.#stream(entry);
    // The screencast only sends a frame on repaint - start the viewer off with the current picture.
    entry.session.currentFrame().then((frame) => frame && listener(frame));
    return () => {
      entry.watchers.delete(listener);
      if (entry.watchers.size || !entry.stopFrames) return;
      entry.stopFrames();
      entry.stopFrames = null;
    };
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
   * A click, scroll, key or text from the person helping in the chat card.
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
