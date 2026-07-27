/**
 * UserMetaCache
 *
 * Singleton in-memory cache for per-user browser metadata (timezone, language).
 * Keyed by numeric user ID in multi-user mode, or the string 'primary' in
 * single-user mode. Populated from the X-Timezone / X-Language request headers
 * on every authenticated HTTP request via the validatedRequest middleware.
 *
 * Because every request repopulates the cache from headers, the data stays
 * fresh within a session without any database writes.
 *
 * Usage:
 *   const { UserMetaCache } = require("../userLocale");
 *   UserMetaCache.set(userId, { timezone, lang });
 *   const { timezone, lang } = UserMetaCache.get(userId);
 */

const DEFAULT_TIMEZONE = "UTC";
const DEFAULT_LANG = "en";

class _UserMetaCache {
  #cache = new Map();

  /**
   * Validate that a string is a recognised IANA timezone identifier.
   * @param {string} tz
   * @returns {boolean}
   */
  #isValidTimezone(tz) {
    if (!tz || typeof tz !== "string") return false;
    try {
      Intl.DateTimeFormat(undefined, { timeZone: tz });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Normalise a user ID to a cache key.
   * @param {number|null|undefined} userId
   * @returns {number|'primary'}
   */
  #key(userId) {
    return userId ?? "primary";
  }

  /**
   * Store or update locale metadata for a user.
   * Invalid timezone strings are silently ignored (existing/default value kept).
   *
   * @param {number|null} userId - Numeric user ID, or null for single-user mode.
   * @param {{ timezone?: string, lang?: string }} meta
   */
  set(userId, { timezone, lang } = {}) {
    const key = this.#key(userId);
    const current = this.#cache.get(key) || {};
    this.#cache.set(key, {
      timezone:
        timezone && this.#isValidTimezone(timezone)
          ? timezone
          : current.timezone || DEFAULT_TIMEZONE,
      lang: lang || current.lang || DEFAULT_LANG,
    });
  }

  /**
   * Retrieve locale metadata for a user.
   * Returns defaults if nothing has been cached yet.
   *
   * @param {number|null} userId - Numeric user ID, or null for single-user mode.
   * @returns {{ timezone: string, lang: string }}
   */
  get(userId) {
    return (
      this.#cache.get(this.#key(userId)) || {
        timezone: DEFAULT_TIMEZONE,
        lang: DEFAULT_LANG,
      }
    );
  }

  /**
   * Read X-Timezone and X-Language from an Express request and store them.
   * Intended to be called from the validatedRequest middleware after auth.
   *
   * @param {import('express').Request} request
   * @param {number|null} userId - null for single-user mode (stored under 'primary')
   */
  setFromRequest(request, userId = null) {
    const timezone = request.header("X-Timezone");
    const lang = request.header("X-Language");
    if (timezone || lang) this.set(userId, { timezone, lang });
  }
}

const UserMetaCache = new _UserMetaCache();
module.exports = { UserMetaCache };
