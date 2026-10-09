/**
 * Serialization for the values AnythingLLM writes back to server/.env.
 *
 * dumpENV() rewrites the whole file and single-quotes every value so a value
 * can never escape its own line and inject another key. Single quotes are also
 * the one form that neither dotenv nor `docker compose` unescapes, so the file
 * always holds the literal characters that were written.
 *
 * Some keys legitimately hold line breaks - the embedding prefixes, where
 * instruct models such as Qwen3-Embedding require "instruction\nQuery: " - and
 * a line break cannot be written literally. For those keys (MULTILINE_ENV_KEYS)
 * a line break is stored as the two characters `\n`/`\r` with backslashes
 * escaped, which restoreEscapedEnvValues() reverses when the process boots.
 *
 * Escaping is scoped to those keys on purpose: every other value keeps the
 * previous behaviour untouched, so a path such as `D:\reports\cert.pem` is
 * never reinterpreted as containing a line break.
 */

/**
 * ENV keys whose values may legitimately contain line breaks. A value for any
 * other key is still truncated at the first line break.
 * @type {Set<string>}
 */
const MULTILINE_ENV_KEYS = new Set([
  "GENERIC_OPEN_AI_EMBEDDING_PASSAGE_PREFIX",
  "GENERIC_OPEN_AI_EMBEDDING_QUERY_PREFIX",
]);

/**
 * Characters that could end the quoted value, start a comment or smuggle a
 * separator into the file. Line breaks are handled separately.
 */
const UNSAFE_CHARS =
  /['"`#]|[\t\v\f\u0085\u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]/;

/**
 * Truncates a value at the first character that could break the ENV file
 * format. Only keys listed in MULTILINE_ENV_KEYS may keep line breaks.
 * @param {string} value - The value as it currently lives in process.env
 * @param {{allowLineBreaks?: boolean}} options
 * @returns {string}
 */
function sanitizeEnvValue(value, { allowLineBreaks = false } = {}) {
  for (let index = 0; index < value.length; index++) {
    const char = value[index];
    if (char === "\n" || char === "\r") {
      if (allowLineBreaks) continue;
      return value.substring(0, index);
    }
    if (UNSAFE_CHARS.test(char)) return value.substring(0, index);
  }
  return value;
}

/**
 * Replaces backslashes and line breaks with the literal escape sequences that
 * can be stored on a single line.
 * @param {string} value
 * @returns {string}
 */
function escapeEnvValue(value) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r");
}

/**
 * Reverses escapeEnvValue(). Any other escape sequence is left untouched.
 * @param {string} value
 * @returns {string}
 */
function unescapeEnvValue(value) {
  return value.replace(/\\([\\nr])/g, (_match, char) => {
    if (char === "n") return "\n";
    if (char === "r") return "\r";
    return "\\";
  });
}

/**
 * Formats a single `KEY='value'` assignment for server/.env.
 * @param {string} key
 * @param {string} value
 * @returns {string}
 */
function serializeEnvValue(key, value) {
  if (MULTILINE_ENV_KEYS.has(key))
    return `'${escapeEnvValue(
      sanitizeEnvValue(value, { allowLineBreaks: true })
    )}'`;

  return `'${sanitizeEnvValue(value)}'`;
}

/**
 * Restores the line breaks that dumpENV() had to escape. dotenv does not
 * override variables that are already set (in Docker the same file also arrives
 * through `env_file` in docker-compose), so this always runs on process.env
 * after the ENV file has been read.
 * @param {NodeJS.ProcessEnv} env
 * @returns {NodeJS.ProcessEnv}
 */
function restoreEscapedEnvValues(env = process.env) {
  for (const key of MULTILINE_ENV_KEYS) {
    const value = env[key];
    if (typeof value !== "string") continue;
    env[key] = unescapeEnvValue(value);
  }
  return env;
}

module.exports = {
  MULTILINE_ENV_KEYS,
  sanitizeEnvValue,
  escapeEnvValue,
  unescapeEnvValue,
  serializeEnvValue,
  restoreEscapedEnvValues,
};
