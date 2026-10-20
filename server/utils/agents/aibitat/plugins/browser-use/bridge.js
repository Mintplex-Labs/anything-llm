const { BrowserDriver } = require("./driver");
const { Chromium } = require("./driver/chromium");

/**
 * The browser agent's only way to the browser - the one file that knows where the browser runs.
 * The desktop app has its own bridge.js that talks to the Electron main process; here the browser
 * runs in the server process (see driver/), so requests are plain calls - with the same timeout,
 * so a hung page never stalls the agent forever.
 *
 * Requests (see BrowserDriver#request):
 *   start     - open a session on a profile: {sessionId, profile, maxChars, startUrl, terms}
 *   act       - run a browser tool: {sessionId, tool, args}
 *   close     - end a session: {sessionId}
 *   attention - the agent needs help: {sessionId, title, body, path}
 *   hide      - the help request was answered: {sessionId}
 */
class BrowserBridge {
  /** How a person gets their hands on the browser - part of what the agent asks when it needs help. */
  static TAKE_CONTROL_HINT = 'Click "Take control" in the session card';

  /**
   * Browser use runs a browser on the server, so a production server only offers it inside the
   * Docker image - never on a bare-metal install. Development runs it anywhere.
   */
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
