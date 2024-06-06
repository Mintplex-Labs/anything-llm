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
// isUnique/markUnique/removeUniqueConstraint prevents one-time functions from re-running. EG: charting.
const crypto = require("crypto");
const DEFAULT_COOLDOWN_MS = 5 * 1000;

class Deduplicator {
  #hashes = {};
  #cooldowns = {};
  #uniques = {};
  constructor() {}

  trackRun(key, params = {}) {
    const hash = crypto
      .createHash("sha256")
      .update(JSON.stringify({ key, params }))
      .digest("hex");
    this.#hashes[hash] = Number(new Date());
  }

  isDuplicate(key, params = {}) {
    const newSig = crypto
      .createHash("sha256")
      .update(JSON.stringify({ key, params }))
      .digest("hex");
    return this.#hashes.hasOwnProperty(newSig);
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

  startCooldown(
    key,
    parameters = {
      cooldownInMs: DEFAULT_COOLDOWN_MS,
    }
  ) {
    this.#cooldowns[key] = Number(new Date()) + Number(parameters.cooldownInMs);
  }

  isOnCooldown(key) {
    if (!this.#cooldowns.hasOwnProperty(key)) return false;
    return Number(new Date()) <= this.#cooldowns[key];
  }

  isUnique(key) {
    return !this.#uniques.hasOwnProperty(key);
  }

  removeUniqueConstraint(key) {
    delete this.#uniques[key];
  }

  markUnique(key) {
    this.#uniques[key] = Number(new Date());
  }
}

module.exports.Deduplicator = Deduplicator;
