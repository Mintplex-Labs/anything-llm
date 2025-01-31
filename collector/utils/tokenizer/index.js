const { getEncoding } = require("js-tiktoken");

class TikTokenTokenizer {
  static MAX_KB_ESTIMATE = 10;
  static DIVISOR = 8;

  constructor() {
    if (TikTokenTokenizer.instance) {
      this.log(
        "Singleton instance already exists. Returning existing instance."
      );
      return TikTokenTokenizer.instance;
    }

    this.encoder = getEncoding("cl100k_base");
    TikTokenTokenizer.instance = this;
    this.log("Initialized new TikTokenTokenizer instance.");
  }

  log(text, ...args) {
    console.log(`\x1b[35m[TikTokenTokenizer]\x1b[0m ${text}`, ...args);
  }

  /**
   * Check if the input is too long to encode
   * this is more of a rough estimate and a sanity check to prevent
   * CPU issues from encoding too large of strings
   * Assumes 1 character = 2 bytes in JS
   * @param {string} input
   * @returns {boolean}
   */
  #isTooLong(input) {
    const bytesEstimate = input.length * 2;
    const kbEstimate = Math.floor(bytesEstimate / 1024);
    return kbEstimate >= TikTokenTokenizer.MAX_KB_ESTIMATE;
  }

  /**
   * Encode a string into tokens for rough token count estimation.
   * @param {string} input
   * @returns {number}
   */
  tokenizeString(input = "") {
    try {
      if (this.#isTooLong(input)) {
        this.log("Input will take too long to encode - estimating");
        return Math.ceil(input.length / TikTokenTokenizer.DIVISOR);
      }

      return this.encoder.encode(input).length;
    } catch (e) {
      this.log("Could not tokenize string! Estimating...", e.message, e.stack);
      return Math.ceil(input?.length / TikTokenTokenizer.DIVISOR) || 0;
    }
  }
}

const tokenizer = new TikTokenTokenizer();
module.exports = {
  /**
   * Encode a string into tokens for rough token count estimation.
   * @param {string} input
   * @returns {number}
   */
  tokenizeString: (input) => tokenizer.tokenizeString(input),
};
