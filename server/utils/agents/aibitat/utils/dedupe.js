// Some models may attempt to call an expensive or annoying function many times and in that case we will want
// to implement some stateful tracking during that agent session. GPT4 and other more powerful models are smart
// enough to realize this, but models like 3.5 lack this. Open source models suffer greatly from this issue.
// eg: "save something to file..."
//  agent -> saves
//  agent -> saves
//  agent -> saves
//  agent -> saves
// ... do random # of times.
// We want to block all the reruns of a plugin, so we can add this to prevent that behavior from
// spamming the user (or other costly function) that have the exact same signatures.

// Track Run/isDuplicate prevents _exact_ data re-runs based on the SHA of their inputs
// StartCooldown/isOnCooldown does prevention of _near-duplicate_ runs based on only the function name that is running.
// isMarkedUnique/markUnique/removeUniqueConstraint prevents one-time functions from re-running. EG: charting.
const crypto = require("crypto");
const DEFAULT_COOLDOWN_MS = 30 * 1000;

class Deduplicator {
  #hashes = {};
  #cooldowns = {};
  #uniques = {};
  constructor() {}

  log(message, ...args) {
    console.log(`\x1b[36m[Deduplicator]\x1b[0m ${message}`, ...args);
  }

  trackRun(
    key,
    params = {},
    options = {
      cooldown: false,
      cooldownInMs: DEFAULT_COOLDOWN_MS,
      markUnique: false,
    }
  ) {
    const hash = crypto
      .createHash("sha256")
      .update(JSON.stringify({ key, params }))
      .digest("hex");
    this.#hashes[hash] = Number(new Date());
    if (options.cooldown)
      this.startCooldown(key, { cooldownInMs: options.cooldownInMs });
    if (options.markUnique) this.markUnique(key);
  }

  /**
   * Checks if a key and params are:
   * - exactly the same as a previous run.
   * - on cooldown.
   * - marked as unique.
   * @param {string} key - The key to check.
   * @param {Object} params - The parameters to check.
   * @returns {{isDuplicate: boolean, reason: string}} - The result of the check.
   */
  isDuplicate(key, params = {}) {
    const newSig = crypto
      .createHash("sha256")
      .update(JSON.stringify({ key, params }))
      .digest("hex");
    if (this.#hashes.hasOwnProperty(newSig))
      return {
        isDuplicate: true,
        reason: `an exact duplicate of previous run of ${key}`,
      };
    if (this.isOnCooldown(key))
      return {
        isDuplicate: true,
        reason: `the function is on cooldown for ${key}.`,
      };
    if (this.isMarkedUnique(key))
      return {
        isDuplicate: true,
        reason: `the function is marked as unique for ${key}. Can only be called once per agent session.`,
      };
    return { isDuplicate: false, reason: "" };
  }

  /**
   * Resets the object property for this instance of the Deduplicator class
   * @param {('runs'|'cooldowns'|'uniques')} type - The type of prop to reset
   */
  reset(type = "runs") {
    switch (type) {
      case "runs":
        this.#hashes = {};
        break;
      case "cooldowns":
        this.#cooldowns = {};
        break;
      case "uniques":
        this.#uniques = {};
        break;
    }
    return;
  }

  /**
   * Starts a cooldown for a key.
   * @param {string} key - The key to start the cooldown for (string key of the function name).
   * @param {Object} parameters - The parameters for the cooldown.
   * @param {number} parameters.cooldownInMs - The cooldown in milliseconds.
   */
  startCooldown(
    key,
    parameters = {
      cooldownInMs: DEFAULT_COOLDOWN_MS,
    }
  ) {
    const cooldownDelay = parameters.cooldownInMs || DEFAULT_COOLDOWN_MS;
    this.log(`Starting cooldown for ${key} for ${cooldownDelay}ms`);
    this.#cooldowns[key] = Number(new Date()) + Number(cooldownDelay);
  }

  /**
   * Checks if a key is on cooldown.
   * @param {string} key - The key to check.
   * @returns {boolean} - True if the key is on cooldown, false otherwise.
   */
  isOnCooldown(key) {
    if (!this.#cooldowns.hasOwnProperty(key)) return false;
    return Number(new Date()) <= this.#cooldowns[key];
  }

  /**
   * Checks if a key is marked as unique and currently tracked by the deduplicator.
   * @param {string} key - The key to check.
   * @returns {boolean} - True if the key is marked as unique, false otherwise.
   */
  isMarkedUnique(key) {
    return this.#uniques.hasOwnProperty(key);
  }

  /**
   * Removes the unique constraint for a key.
   * @param {string} key - The key to remove the unique constraint for.
   */
  removeUniqueConstraint(key) {
    delete this.#uniques[key];
  }

  /**
   * Marks a key as unique and currently tracked by the deduplicator.
   * @param {string} key - The key to mark as unique.
   */
  markUnique(key) {
    this.#uniques[key] = Number(new Date());
  }
}

module.exports.Deduplicator = Deduplicator;
