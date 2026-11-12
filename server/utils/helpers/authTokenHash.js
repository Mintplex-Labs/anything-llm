const bcrypt = require("bcryptjs");

// AUTH_TOKEN is a process-lifetime constant, but the single-user auth call
// sites ran bcrypt.hashSync(AUTH_TOKEN, 10) on every request (~60-100ms of
// CPU per call at cost 10). Any hash generated from the current AUTH_TOKEN
// works as a comparison reference for bcrypt.compareSync, so the hash is
// computed once and memoized by value; changing AUTH_TOKEN invalidates the
// cache automatically.
let cachedToken = null;
let cachedHash = null;

/**
 * Returns a bcrypt hash (cost 10) of the current AUTH_TOKEN, memoized by the
 * token value so the expensive hashSync runs at most once per distinct token
 * value. Callers must ensure AUTH_TOKEN is set before invoking; both call
 * sites are already gated on it being present.
 * @returns {string} A bcrypt hash of process.env.AUTH_TOKEN.
 */
function authTokenHash() {
  const token = process.env.AUTH_TOKEN;
  if (cachedHash !== null && cachedToken === token) return cachedHash;
  cachedToken = token;
  cachedHash = bcrypt.hashSync(token, 10);
  return cachedHash;
}

module.exports = { authTokenHash };
