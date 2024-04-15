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
const crypto = require("crypto");

class Deduplicator {
  #hashes = {};
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
}

module.exports.Deduplicator = Deduplicator;
