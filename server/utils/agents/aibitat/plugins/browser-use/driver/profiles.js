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
 * Saved browser profiles: one Chromium user-data folder per person, so their sign-ins carry over
 * between sessions. Single-user mode has one profile ("default"). In multi-user mode every user
 * has their own ("user-<id>") and the default one is never used - it is deleted when multi-user
 * mode is turned on.
 *
 * A profile key with the incognito prefix ("incognito-user-3") is that person's private browser:
 * a separate, throwaway browser that never touches their saved profile.
 */
const BrowserProfiles = {
  DEFAULT: DEFAULT_PROFILE,

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

  /** Delete a profile's folder. The browser using it must already be shut down. */
  removeDir(key) {
    const dir = this.dirFor(key);
    if (dir && fs.existsSync(dir))
      fs.rmSync(dir, { recursive: true, force: true });
  },
};

module.exports = { BrowserProfiles };
