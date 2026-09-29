/* eslint-env jest */
const {
  inferCellType,
} = require("../../../../../../../utils/agents/aibitat/plugins/create-files/xlsx/utils.js");

describe("inferCellType", () => {
  test.each([
    ["42", 42],
    ["-0.5", -0.5],
    ["  42 ", 42],
    ["1,234", 1234],
    ["1,234,567.89", 1234567.89],
    ["$1,234.56", 1234.56],
    ["$ 12", 12],
    ["$-5", -5],
    ["€99.99", 99.99],
    ["£1000", 1000],
    ["50%", 0.5],
  ])("converts %j to the number %j", (input, expected) => {
    expect(inferCellType(input)).toBe(expected);
  });

  test.each([
    "192.168.1.10",
    "2.10.1",
    "555.123.4567",
    "12,5",
    "1.234,56",
    "1,23,456",
    "€1.234,56",
    "₹1,23,456",
    "$1.2.3",
    "$192.168.1.10",
    "$1,23",
    "-$5",
    "$",
    "12.",
    "1e5",
    "abc",
  ])("keeps %j as text", (input) => {
    expect(inferCellType(input)).toBe(input);
  });

  test("converts booleans case-insensitively", () => {
    expect(inferCellType("TRUE")).toBe(true);
    expect(inferCellType("false")).toBe(false);
  });

  test("returns an empty string for empty or missing values", () => {
    expect(inferCellType("")).toBe("");
    expect(inferCellType(null)).toBe("");
    expect(inferCellType(undefined)).toBe("");
  });

  test("converts ISO dates to Date objects", () => {
    const result = inferCellType("2024-03-15");
    expect(result).toBeInstanceOf(Date);
    expect(result.toISOString().slice(0, 10)).toBe("2024-03-15");
  });
});
