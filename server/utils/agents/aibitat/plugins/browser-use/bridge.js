const { BrowserDriver } = require("./driver");
const { findChromium } = require("./driver/chromium");

/**
 * The agent loop's way to the browser. In the desktop app this is a channel to the Electron main
 * process; here the browser runs in the server process (see driver/), so requests are plain calls -
 * with the same timeout, so a hung page never stalls the agent forever.
 */
class BrowserBridge {
  /** Browser use needs a Chromium - the Docker image has one for the collector's web scraper. */
  static get available() {
    return !!findChromium();
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
