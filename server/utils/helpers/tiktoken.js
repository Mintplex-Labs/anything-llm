const { getEncodingNameForModel, getEncoding } = require("js-tiktoken");
const { getPromptTokenCounter } = require("./tokenCounters");

/**
 * @class TokenManager
 *
 * @notice
 * We cannot do estimation of tokens here like we do in the collector
 * because we need to know the model to do it.
 * Other issues are we also do reverse tokenization here for the chat history during cannonballing.
 * So here we are stuck doing the actual tokenization and encoding until we figure out what to do with prompt overflows.
 */
class TokenManager {
  static instance = null;
  static currentKey = null;

  /**
   * @param {string} model - Model name used for the local encoder fallback
   * @param {Object|null} llm - Optional LLM connector used for a provider's native tokenizer
   */
  constructor(model = "gpt-3.5-turbo", llm = null) {
    const cacheKey = `${model}:${llm?.className ?? ""}`;
    if (TokenManager.instance && TokenManager.currentKey === cacheKey) {
      this.log("Returning existing instance for model:", model);
      // Keep the native counter pointed at the connector for this request.
      TokenManager.instance.llm = llm;
      return TokenManager.instance;
    }

    this.model = model;
    this.llm = llm;
    this.encoderName = this.#getEncodingFromModel(model);
    this.encoder = getEncoding(this.encoderName);

    TokenManager.instance = this;
    TokenManager.currentKey = cacheKey;
    this.log("Initialized new TokenManager instance for model:", model);
    return this;
  }

  log(text, ...args) {
    if (process.env.NODE_ENV === "test") return;
    console.log(`\x1b[35m[TokenManager]\x1b[0m ${text}`, ...args);
  }

  #getEncodingFromModel(model) {
    try {
      return getEncodingNameForModel(model);
    } catch {
      return "cl100k_base";
    }
  }

  /**
   * Pass in an empty array of disallowedSpecials to handle all tokens as text and to be tokenized.
   * @param {string} input
   * @returns {number[]}
   */
  tokensFromString(input = "") {
    try {
      const tokens = this.encoder.encode(String(input), undefined, []);
      return tokens;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  /**
   * Converts an array of tokens back to a string.
   * @param {number[]} tokens
   * @returns {string}
   */
  bytesFromTokens(tokens = []) {
    const bytes = this.encoder.decode(tokens);
    return bytes;
  }

  /**
   * Counts the number of tokens in a string.
   * @param {string} input
   * @returns {number}
   */
  countFromString(input = "") {
    const tokens = this.tokensFromString(input);
    return tokens.length;
  }

  /**
   * Counts an OpenAI-shaped prompt with the provider's native tokenizer when
   * the connector has one. Returns null when the provider has no counter or the
   * request fails so callers can keep using the local encoder estimate.
   * @param {Array<{role: string, content: string|object[]}>} messages
   * @returns {Promise<number|null>}
   */
  async countPromptTokens(messages = []) {
    const counter = getPromptTokenCounter(this.llm);
    if (!counter) return null;

    try {
      const count = await counter(this.llm, messages);
      return Number.isInteger(count) && count > 0 ? count : null;
    } catch {
      return null;
    }
  }

  /**
   * Estimates the number of tokens in a string or array of strings.
   * @param {string | string[]} input
   * @returns {number}
   */
  statsFrom(input) {
    if (typeof input === "string") return this.countFromString(input);

    // What is going on here?
    // https://github.com/openai/openai-cookbook/blob/main/examples/How_to_count_tokens_with_tiktoken.ipynb Item 6.
    // The only option is to estimate. From repeated testing using the static values in the code we are always 2 off,
    // which means as of Nov 1, 2023 the additional factor on ln: 476 changed from 3 to 5.
    if (Array.isArray(input)) {
      const perMessageFactorTokens = input.length * 3;
      const tokensFromContent = input.reduce(
        (a, b) => a + this.countFromContent(b.content),
        0
      );
      const diffCoefficient = 5;
      return perMessageFactorTokens + tokensFromContent + diffCoefficient;
    }

    throw new Error("Not a supported tokenized format.");
  }

  /**
   * Messages with attachments carry an array of content parts. Only the text
   * parts are counted, because the token cost of an image depends on the provider.
   * @param {string | object[]} content
   * @returns {number}
   */
  countFromContent(content) {
    if (!Array.isArray(content)) return this.countFromString(content);
    return content.reduce((a, part) => a + this.countFromString(part?.text), 0);
  }
}

module.exports = {
  TokenManager,
};
