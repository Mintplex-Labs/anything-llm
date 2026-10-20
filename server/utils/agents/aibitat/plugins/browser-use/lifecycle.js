const { BrowserDriver } = require("./driver");
const { BrowserTraces } = require("./traces");

/** Hooks the rest of the server calls - each is one line that never throws. */
const BrowserUseLifecycle = {
  /**
   * Removes a deleted user's saved profile, incognito browser and session history.
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
