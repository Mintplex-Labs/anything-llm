/* eslint-env jest, node */
const { tokenizeString } = require("../../../utils/tokenizer");

const SENTENCE =
  "The quick brown fox jumps over the lazy dog while the sun sets slowly behind distant hills. ";
const text = SENTENCE.repeat(80);

describe("tokenizeString", () => {
  it("does not drop when crossing the too-long guard (5120 chars)", () => {
    const below = tokenizeString(text.slice(0, 5119));
    const at = tokenizeString(text.slice(0, 5120));
    expect(at).toBeGreaterThanOrEqual(below);
  });

  it("keeps the long-input estimate close to the real encoding", () => {
    const real = tokenizeString(text.slice(0, 5119));
    const estimate = tokenizeString(text.slice(0, 5120));
    expect(estimate).toBeGreaterThanOrEqual(real * 0.8);
    expect(estimate).toBeLessThanOrEqual(real * 1.5);
  });

  it("estimates ceil(length / 4) once the guard trips", () => {
    expect(tokenizeString("a".repeat(5120))).toBe(1280);
    expect(tokenizeString("a".repeat(5119))).not.toBe(1280);
  });

  it("returns 0 for empty input", () => {
    expect(tokenizeString("")).toBe(0);
  });
});
