/* eslint-env jest, node */
process.env.STORAGE_DIR = "test-storage";

jest.mock("../../utils/files", () => ({
  writeToServerDocuments: jest.fn(({ data }) => ({
    ...data,
    location: "custom-documents/raw.json",
  })),
}));
jest.mock("../../utils/tokenizer", () => ({
  tokenizeString: jest.fn(() => 2),
}));

const { processRawText } = require("../../processRawText");

const NOW = new Date("2026-09-02T12:00:00Z");

beforeEach(() => {
  jest.useFakeTimers({ now: NOW });
});

afterEach(() => {
  jest.useRealTimers();
});

describe("processRawText published metadata", () => {
  test.each([[null], [""], [" "], ["\t"], [[]]])(
    "published %p is treated as absent, not as the epoch",
    async (published) => {
      const { documents } = await processRawText("hello world", {
        title: "doc.txt",
        published,
      });
      expect(documents[0].published).toBe(NOW.toLocaleString());
    }
  );

  test("an omitted published falls back to now", async () => {
    const { documents } = await processRawText("hello world", {
      title: "doc.txt",
    });
    expect(documents[0].published).toBe(NOW.toLocaleString());
  });

  test.each([[1700000000000], ["1700000000000"]])(
    "an epoch timestamp %p is honored",
    async (published) => {
      const { documents } = await processRawText("hello world", {
        title: "doc.txt",
        published,
      });
      expect(documents[0].published).toBe(
        new Date(1700000000000).toLocaleString()
      );
    }
  );

  test("published 0 is still the epoch, not treated as absent", async () => {
    const { documents } = await processRawText("hello world", {
      title: "doc.txt",
      published: 0,
    });
    expect(documents[0].published).toBe(new Date(0).toLocaleString());
  });
});
