const crypto = require("crypto");

/**
 * Generates a random password that satisfies typical complexity rules
 * (mixed case, digit, symbol) for joi-password-complexity defaults.
 * @returns {string}
 */
function generateComplexPassword() {
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const nums = "0123456789";
  const sym = "!@#$%^&*()-_=+[]{}";
  const chars = lower + upper + nums + sym;
  const out = [];
  out.push(lower[crypto.randomInt(lower.length)]);
  out.push(upper[crypto.randomInt(upper.length)]);
  out.push(nums[crypto.randomInt(nums.length)]);
  out.push(sym[crypto.randomInt(sym.length)]);
  for (let i = 0; i < 28; i++) {
    out.push(chars[crypto.randomInt(chars.length)]);
  }
  // Fisher–Yates shuffle
  for (let i = out.length - 1; i > 0; i--) {
    const j = crypto.randomInt(i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out.join("");
}

module.exports = { generateComplexPassword };
