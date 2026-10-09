const { restoreEscapedEnvValues } = require("./envValueCodec");

let escapedValuesRestored = false;

/**
 * Loads the ENV file for the current environment and restores the line breaks
 * that dumpENV() had to escape (see envValueCodec.js).
 *
 * Replaces a bare `require("dotenv").config()` call so every entry point that
 * loads the ENV file also decodes the values AnythingLLM persists itself.
 * Required and called as `require("./utils/helpers/loadEnv")()`, the same shape
 * as the other boot helpers.
 * @returns {boolean}
 */
function loadEnv() {
  const dotenv = require("dotenv");
  process.env.NODE_ENV === "development"
    ? dotenv.config({ path: `.env.${process.env.NODE_ENV}` })
    : dotenv.config();

  // Only ever decode once per process: a value may legitimately contain a
  // literal backslash followed by "n", which a second pass would rewrite.
  if (!escapedValuesRestored) {
    restoreEscapedEnvValues();
    escapedValuesRestored = true;
  }

  return true;
}

module.exports = loadEnv;
