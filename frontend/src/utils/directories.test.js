import { jest } from "@jest/globals";

jest.unstable_mockModule(
  "moment",
  () => ({ default: () => ({ format: () => "" }) }),
  { virtual: true }
);
jest.unstable_mockModule("./keyboardShortcuts.js", () => ({ isMac: false }));

const { middleTruncate } = await import("./directories.js");

describe("middleTruncate", () => {
  it("keeps the result within the requested length for named files", () => {
    expect(middleTruncate("very-long-document-name.pdf", 20)).toBe(
      "very-long...name.pdf"
    );
  });
});
