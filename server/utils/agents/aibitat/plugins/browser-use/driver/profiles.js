const fs = require("fs");
const path = require("path");

const profilesPath =
  process.env.NODE_ENV === "development"
    ? path.resolve(__dirname, `../../../../../../storage/browser-use/profiles`)
    : path.resolve(process.env.STORAGE_DIR, `browser-use/profiles`);

const DEFAULT_PROFILE = "default";
const PROFILE_KEY = /^(default|user-\d+)$/;
const INCOGNITO_PREFIX = "incognito-";

/**
 * Saved browser profiles: one Chromium user-data folder per person, so sign-ins carry over.
 * Single-user mode uses "default"; multi-user mode gives each user "user-<id>" and deletes
 * "default" when turned on. "incognito-<key>" is that person's throwaway browser.
 */
const BrowserProfiles = {
  /**
   * @param {number|null} userId - null in single-user mode
   * @returns {string}
   */
  keyFor(userId = null) {
    return userId === null || userId === undefined
      ? DEFAULT_PROFILE
      : `user-${Number(userId)}`;
  },

  /** @param {string} key */
  incognitoKeyFor(key) {
    return `${INCOGNITO_PREFIX}${key}`;
  },

  /**
   * @param {string} key - a profile key, incognito or not
   * @returns {{owner: string, incognito: boolean}|null} null for anything that is not a profile key
   */
  parse(key) {
    const value = String(key || "");
    const incognito = value.startsWith(INCOGNITO_PREFIX);
    const owner = incognito ? value.slice(INCOGNITO_PREFIX.length) : value;
    return PROFILE_KEY.test(owner) ? { owner, incognito } : null;
  },

  /** @returns {string|null} the profile's folder, or null for an invalid key */
  dirFor(key) {
    return PROFILE_KEY.test(String(key || ""))
      ? path.join(profilesPath, key)
      : null;
  },

  /** @returns {number|null} the user a profile key belongs to (null for the default profile) */
  userIdOf(key) {
    const match = String(key || "").match(/^user-(\d+)$/);
    return match ? Number(match[1]) : null;
  },

  /**
   * Every saved profile on disk.
   * @returns {Array<{key: string, userId: number|null}>}
   */
  list() {
    if (!fs.existsSync(profilesPath)) return [];
    return fs
      .readdirSync(profilesPath)
      .filter((key) => this.dirFor(key))
      .map((key) => ({ key, userId: this.userIdOf(key) }));
  },

  /**
   * Delete a profile's folder. The browser using it must already be shut down.
   * @returns {boolean} whether there was a folder to delete
   */
  removeDir(key) {
    const dir = this.dirFor(key);
    if (!dir || !fs.existsSync(dir)) return false;
    fs.rmSync(dir, { recursive: true, force: true });
    return true;
  },
};

module.exports = { BrowserProfiles };
