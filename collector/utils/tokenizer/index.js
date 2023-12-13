const { getEncoding } = require("js-tiktoken");

function tokenizeString(input = "") {
  try {
    const encoder = getEncoding("cl100k_base");
    return encoder.encode(input);
  } catch (e) {
    console.error("Could not tokenize string!");
    return [];
  }
}

module.exports = {
  tokenizeString,
};
