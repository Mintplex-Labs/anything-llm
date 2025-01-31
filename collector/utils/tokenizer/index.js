const { getEncoding } = require("js-tiktoken");

class TikTokenTokenizer {
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
   * Encode a string into tokens for rough token count estimation.
   * @param {string} input
   * @returns {number[]}
   */
  tokenizeString(input = "") {
    try {
      return this.encoder.encode(input);
    } catch (e) {
      this.log("Could not tokenize string!", e.message, e.stack);
      return [];
    }
  }
}

const tokenizer = new TikTokenTokenizer();
module.exports = {
  /**
   * Encode a string into tokens for rough token count estimation.
   * @param {string} input
   * @returns {number[]}
   */
  tokenizeString: (input) => tokenizer.tokenizeString(input),
};
