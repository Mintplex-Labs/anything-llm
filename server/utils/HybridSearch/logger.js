const { config } = require("./config");

/**
 * Minimal structured logger for HybridSearch.
 *
 * Goals:
 *   - Predictable single-line output that's still grep-friendly
 *   - Structured fields (JSON in the trailing payload) so downstream log
 *     shippers (Fluentbit, Vector, etc.) can parse without regex
 *   - Level filtering driven by HYBRID_SEARCH_LOG_LEVEL
 *   - Zero dependencies — the rest of the codebase logs via console.log too
 */

const LEVELS = { debug: 10, info: 20, warn: 30, error: 40 };
const COLORS = {
  debug: "\x1b[90m",
  info: "\x1b[36m",
  warn: "\x1b[33m",
  error: "\x1b[31m",
};
const RESET = "\x1b[0m";

function shouldEmit(level) {
  return LEVELS[level] >= LEVELS[config.logLevel];
}

function emit(level, message, fields = {}) {
  if (!shouldEmit(level)) return;
  const tag = `${COLORS[level]}[HybridSearch:${level}]${RESET}`;
  if (Object.keys(fields).length === 0) {
    console.log(`${tag} ${message}`);
  } else {
    console.log(`${tag} ${message}`, fields);
  }
}

const logger = {
  debug: (msg, fields) => emit("debug", msg, fields),
  info: (msg, fields) => emit("info", msg, fields),
  warn: (msg, fields) => emit("warn", msg, fields),
  error: (msg, fields) => emit("error", msg, fields),
};

module.exports = { logger };
