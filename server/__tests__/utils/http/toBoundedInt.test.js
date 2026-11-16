/* eslint-env jest */
const { toBoundedInt } = require("../../../utils/http");

describe("toBoundedInt", () => {
  it("parses numeric strings and numbers", () => {
    expect(toBoundedInt("5", 100)).toBe(5);
    expect(toBoundedInt(5, 100)).toBe(5);
    expect(toBoundedInt("  42 ", 100)).toBe(42);
    expect(toBoundedInt(7.9, 100)).toBe(7);
  });

  it.each([
    undefined,
    null,
    "",
    "   ",
    "abc",
    "NaN",
    "Infinity",
    NaN,
    Infinity,
    true,
    {},
    [],
  ])("returns the fallback for non-integer input %p", (value) => {
    expect(toBoundedInt(value, 100)).toBe(100);
  });

  it("clamps parsed values to the inclusive bounds", () => {
    expect(toBoundedInt("0", 100, { min: 1 })).toBe(1);
    expect(toBoundedInt("-5", 0, { min: 0 })).toBe(0);
    expect(toBoundedInt("1", 100, { min: 1 })).toBe(1);
    expect(toBoundedInt("500", 100, { min: 1, max: 200 })).toBe(200);
  });

  it("does not clamp the fallback", () => {
    expect(toBoundedInt("abc", 0, { min: 1 })).toBe(0);
  });
});
