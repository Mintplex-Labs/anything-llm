const { getEncodingNameForModel, getEncoding } = require("js-tiktoken");

class TokenManager {
  constructor(model = "gpt-3.5-turbo") {
    this.model = model;
    this.encoderName = this.#getEncodingFromModel(model);
    this.encoder = getEncoding(this.encoderName);
  }

  #getEncodingFromModel(model) {
    try {
      return getEncodingNameForModel(model);
    } catch {
      return "cl100k_base";
    }
  }

  // Pass in an empty array of disallowedSpecials to handle all tokens as text and to be tokenized.
  // https://github.com/openai/tiktoken/blob/9e79899bc248d5313c7dd73562b5e211d728723d/tiktoken/core.py#L91C20-L91C38
  // Returns number[]
  tokensFromString(input = "") {
    try {
      const tokens = this.encoder.encode(String(input), undefined, []);
      return tokens;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  bytesFromTokens(tokens = []) {
    const bytes = this.encoder.decode(tokens);
    return bytes;
  }

  // Returns number
  countFromString(input = "") {
    const tokens = this.tokensFromString(input);
    return tokens.length;
  }

  statsFrom(input) {
    if (typeof input === "string") return this.countFromString(input);

    // What is going on here?
    // https://github.com/openai/openai-cookbook/blob/main/examples/How_to_count_tokens_with_tiktoken.ipynb Item 6.
    // The only option is to estimate. From repeated testing using the static values in the code we are always 2 off,
    // which means as of Nov 1, 2023 the additional factor on ln: 476 changed from 3 to 5.
    if (Array.isArray(input)) {
      const perMessageFactorTokens = input.length * 3;
      const tokensFromContent = input.reduce(
        (a, b) => a + this.countFromString(b.content),
        0
      );
      const diffCoefficient = 5;
      return perMessageFactorTokens + tokensFromContent + diffCoefficient;
    }

    throw new Error("Not a supported tokenized format.");
  }
}

module.exports = {
  TokenManager,
};
