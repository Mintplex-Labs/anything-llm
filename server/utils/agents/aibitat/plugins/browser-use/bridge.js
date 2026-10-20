const { BrowserDriver } = require("./driver");
const { Chromium } = require("./driver/chromium");

/**
 * The browser agent's only path to the browser. The desktop app has its own bridge.js that talks
 * to the Electron main process; here the browser runs in-process (see driver/), so requests are
 * plain calls with a timeout so a hung page never stalls the agent.
 *
 * Requests (see BrowserDriver#request):
 *   start     - open a session on a profile: {sessionId, profile, maxChars, startUrl, terms}
 *   act       - run a browser tool: {sessionId, tool, args}
 *   close     - end a session: {sessionId}
 *   attention - the agent needs help: {sessionId, title, body, path}
 *   hide      - the help request was answered: {sessionId}
 */
class BrowserBridge {
  /** Part of what the agent says when it asks for help. */
  static TAKE_CONTROL_HINT = 'Click "Take control" in the session card';

  /** A production server only runs the browser inside the Docker image, never on bare metal. */
  static get runtimeAllowed() {
    if (process.env.NODE_ENV !== "production") return true;
    return process.env.ANYTHING_LLM_RUNTIME === "docker";
  }

  /** An allowed runtime and a Chromium it can run sandboxed (the Docker image ships one). */
  static get available() {
    return BrowserBridge.runtimeAllowed && Chromium.available;
  }

  /**
   * @param {string} action
   * @param {Object} params
   * @param {number} timeoutMs
   * @returns {Promise<any>}
   */
  static request(action, params = {}, timeoutMs = 60_000) {
    let timer;
    return Promise.race([
      BrowserDriver.request(action, params),
      new Promise((_, reject) => {
        timer = setTimeout(
          () =>
            reject(
              new Error(`The browser did not respond to "${action}" in time.`)
            ),
          timeoutMs
        );
      }),
    ]).finally(() => clearTimeout(timer));
  }
}

module.exports = { BrowserBridge };
