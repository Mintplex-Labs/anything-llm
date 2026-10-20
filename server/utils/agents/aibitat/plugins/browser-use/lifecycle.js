const { BrowserDriver } = require("./driver");
const { BrowserTraces } = require("./traces");

/**
 * What the rest of the server tells Browser Use about, so each caller is one line that never throws
 * (see endpoints/admin.js, endpoints/api/admin and endpoints/system.js).
 */
const BrowserUseLifecycle = {
  /**
   * A user was deleted: their saved browser profile, their incognito browser and their session
   * history all go with them.
   * @param {number} userId
   */
  async userDeleted(userId) {
    try {
      await BrowserDriver.deleteUserProfile(userId);
      BrowserTraces.deleteForUser(userId);
    } catch (error) {
      console.error(
        `[BrowserUse] Could not remove user ${userId}'s browser data:`,
        error.message
      );
    }
  },

  /** Multi-user mode was turned on: nobody may use the single-user profile and its sign-ins any more. */
  async multiUserEnabled() {
    try {
      await BrowserDriver.deleteSingleUserProfile();
    } catch (error) {
      console.error(
        "[BrowserUse] Could not remove the single-user browser profile:",
        error.message
      );
    }
  },
};

module.exports = { BrowserUseLifecycle };
