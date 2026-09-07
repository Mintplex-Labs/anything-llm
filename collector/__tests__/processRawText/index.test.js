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

const { writeToServerDocuments } = require("../../utils/files");
const { tokenizeString } = require("../../utils/tokenizer");
const { processRawText } = require("../../processRawText");

const NOW = new Date("2026-09-02T12:00:00Z");
const UUID_V4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

// Convenience: run with a valid title and return the single produced document.
async function run(metadata = {}, text = "hello world") {
  const { documents } = await processRawText(text, {
    title: "doc.txt",
    ...metadata,
  });
  return documents[0];
}

beforeEach(() => {
  jest.useFakeTimers({ now: NOW });
  jest.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
  writeToServerDocuments.mockClear();
  tokenizeString.mockClear();
});

describe("processRawText input validation", () => {
  test.each([[""], [null], [undefined], [0], [false]])(
    "empty or falsy textContent %p fails without writing",
    async (text) => {
      const result = await processRawText(text, { title: "doc.txt" });
      expect(result).toEqual({
        success: false,
        reason: "textContent was empty - nothing to process.",
        documents: [],
      });
      expect(writeToServerDocuments).not.toHaveBeenCalled();
    }
  );

  test.each([[12345], [["a", "b"]], [{ text: "a" }], [true]])(
    "non-string textContent %p fails instead of throwing",
    async (text) => {
      const result = await processRawText(text, { title: "doc.txt" });
      expect(result.success).toBe(false);
      expect(result.documents).toEqual([]);
      expect(writeToServerDocuments).not.toHaveBeenCalled();
    }
  );

  test.each([
    ["missing metadata", undefined],
    ["null metadata", null],
    ["empty metadata", {}],
    ["null title", { title: null }],
    ["empty title", { title: "" }],
    ["numeric title", { title: 123 }],
    ["array title", { title: ["doc.txt"] }],
    ["object title", { title: { name: "doc.txt" } }],
  ])("%s fails instead of throwing", async (_label, metadata) => {
    const result = await processRawText("hello world", metadata);
    expect(result).toEqual({
      success: false,
      reason: "metadata.title must be a non-empty string.",
      documents: [],
    });
    expect(writeToServerDocuments).not.toHaveBeenCalled();
  });

  test("a valid request succeeds with a single document", async () => {
    const result = await processRawText("hello world", { title: "doc.txt" });
    expect(result.success).toBe(true);
    expect(result.reason).toBeNull();
    expect(result.documents).toHaveLength(1);
  });
});

describe("processRawText title", () => {
  test.each([
    ["doc.txt", "doc.txt"],
    ["My Report.pdf", "my-report.txt"],
    ["archive.tar.gz", "archive-tar.txt"],
    ["no-extension", "no-extension.txt"],
    ["Spaces And Caps", "spaces-and-caps.txt"],
    ["ünïcödé.md", "unicode.txt"],
  ])("title %p becomes %p", async (title, expected) => {
    const doc = await run({ title });
    expect(doc.title).toBe(expected);
  });

  test.each([
    ["../../etc/passwd", ".txt"],
    ["../../evil.txt", "evil.txt"],
    ["..\\..\\windows.txt", "windows.txt"],
    ["/absolute/path.txt", "absolutepath.txt"],
  ])(
    "path-like title %p is slugged into a flat name",
    async (title, expected) => {
      const doc = await run({ title });
      expect(doc.title).toBe(expected);
      expect(doc.title).not.toMatch(/[/\\]/);
      expect(doc.title).not.toContain("..");
    }
  );

  test.each([["..."], ["."]])(
    "title %p with nothing to slug collapses to '.txt' (pinned behavior)",
    async (title) => {
      const doc = await run({ title });
      expect(doc.title).toBe(".txt");
    }
  );
});

describe("processRawText url", () => {
  test.each([
    ["https://Example.com/Page", "web://https://example.com/page.website"],
    ["http://example.com", "web://http://example.com.website"],
  ])("http(s) url %p is honored and lowercased", async (url, expected) => {
    const doc = await run({ url });
    expect(doc.url).toBe(expected);
  });

  test.each([
    ["ftp://example.com/file"],
    ["javascript:alert(1)"],
    ["file:///etc/passwd"],
    ["data:text/plain,hi"],
    ["not a url"],
    [""],
    [null],
    [undefined],
    [{}],
    [[]],
    [123],
  ])(
    "non-http url %p falls back to a file:// url from the title",
    async (url) => {
      const doc = await run({ url, title: "My Doc.txt" });
      expect(doc.url).toBe("file://my-doc.txt");
    }
  );
});

describe("processRawText string metadata fallbacks", () => {
  const NON_STRINGS = [[null], [undefined], [0], [123], [true], [[]], [{}]];

  test("string docAuthor, description, docSource and chunkSource are honored", async () => {
    const doc = await run({
      docAuthor: "Jane",
      description: "A description",
      docSource: "unit-test",
      chunkSource: "custom-chunk-source",
    });
    expect(doc.docAuthor).toBe("Jane");
    expect(doc.description).toBe("A description");
    expect(doc.docSource).toBe("unit-test");
    expect(doc.chunkSource).toBe("custom-chunk-source");
  });

  test("empty strings are honored as-is, not replaced", async () => {
    const doc = await run({
      docAuthor: "",
      description: "",
      docSource: "",
      chunkSource: "",
    });
    expect(doc.docAuthor).toBe("");
    expect(doc.description).toBe("");
    expect(doc.docSource).toBe("");
    expect(doc.chunkSource).toBe("");
  });

  test.each(NON_STRINGS)("non-string docAuthor %p falls back", async (v) => {
    const doc = await run({ docAuthor: v });
    expect(doc.docAuthor).toBe("no author specified");
  });

  test.each(NON_STRINGS)("non-string description %p falls back", async (v) => {
    const doc = await run({ description: v });
    expect(doc.description).toBe("no description found");
  });

  test.each(NON_STRINGS)("non-string docSource %p falls back", async (v) => {
    const doc = await run({ docSource: v });
    expect(doc.docSource).toBe("no source set");
  });

  test.each(NON_STRINGS)(
    "non-string chunkSource %p falls back to the slugged title",
    async (v) => {
      const doc = await run({ chunkSource: v, title: "My Doc.txt" });
      expect(doc.chunkSource).toBe("my-doc.txt");
    }
  );
});

describe("processRawText published", () => {
  test.each([[null], [""], [" "], ["\t"], [[]], [false], [true], [{}]])(
    "published %p is treated as absent, not as the epoch",
    async (published) => {
      const doc = await run({ published });
      expect(doc.published).toBe(NOW.toLocaleString());
    }
  );

  test.each([["abc"], ["2024-01-16"], ["null"], ["undefined"]])(
    "a non-numeric published %p falls back to now",
    async (published) => {
      const doc = await run({ published });
      expect(doc.published).toBe(NOW.toLocaleString());
    }
  );

  test.each([[1e20], [8.64e15 + 1], ["Infinity"], ["-Infinity"]])(
    "an out-of-range published %p falls back to now instead of 'Invalid Date'",
    async (published) => {
      const doc = await run({ published });
      expect(doc.published).not.toBe("Invalid Date");
      expect(doc.published).toBe(NOW.toLocaleString());
    }
  );

  test("an omitted published falls back to now", async () => {
    const doc = await run();
    expect(doc.published).toBe(NOW.toLocaleString());
  });

  test.each([[1700000000000], ["1700000000000"], [" 1700000000000 "]])(
    "an epoch timestamp %p is honored",
    async (published) => {
      const doc = await run({ published });
      expect(doc.published).toBe(new Date(1700000000000).toLocaleString());
    }
  );

  test("published 0 is still the epoch, not treated as absent", async () => {
    const doc = await run({ published: 0 });
    expect(doc.published).toBe(new Date(0).toLocaleString());
  });

  test("a negative epoch is honored as a pre-1970 date", async () => {
    const doc = await run({ published: -86400000 });
    expect(doc.published).toBe(new Date(-86400000).toLocaleString());
  });
});

describe("processRawText document assembly", () => {
  test("produces the full document shape", async () => {
    const doc = await run({}, "hello big world");
    expect(doc).toEqual({
      id: expect.stringMatching(UUID_V4),
      url: "file://doc.txt",
      title: "doc.txt",
      docAuthor: "no author specified",
      description: "no description found",
      docSource: "no source set",
      chunkSource: "doc.txt",
      published: NOW.toLocaleString(),
      wordCount: 3,
      pageContent: "hello big world",
      token_count_estimate: 2,
      location: "custom-documents/raw.json",
    });
  });

  test("each call gets a fresh id", async () => {
    const a = await run();
    const b = await run();
    expect(a.id).not.toBe(b.id);
  });

  test("pageContent is stored verbatim", async () => {
    const text = "  keep\n\twhitespace <b>and markup</b> & symbols  ";
    const doc = await run({}, text);
    expect(doc.pageContent).toBe(text);
  });

  test.each([
    ["one", 1],
    ["one two three", 3],
    ["a\nb\nc", 1],
    ["  leading", 3],
    ["double  space", 3],
  ])(
    "wordCount for %p splits on single spaces only (pinned behavior)",
    async (text, expected) => {
      const doc = await run({}, text);
      expect(doc.wordCount).toBe(expected);
    }
  );

  test("token estimate comes from the tokenizer with the raw text", async () => {
    tokenizeString.mockReturnValueOnce(42);
    const doc = await run({}, "count me");
    expect(tokenizeString).toHaveBeenCalledWith("count me");
    expect(doc.token_count_estimate).toBe(42);
  });

  test("writes once with a raw-<slug>-<uuid> filename and the assembled data", async () => {
    const doc = await run({ title: "My Report.pdf" });
    expect(writeToServerDocuments).toHaveBeenCalledTimes(1);
    const [{ data, filename }] = writeToServerDocuments.mock.calls[0];
    expect(filename).toBe(`raw-my-report-${doc.id}`);
    expect(data.id).toBe(doc.id);
    expect(data.title).toBe("my-report.txt");
    expect(data).not.toHaveProperty("location");
  });

  test("returns the writer's result so location is passed through", async () => {
    writeToServerDocuments.mockReturnValueOnce({
      location: "custom-documents/raw-custom.json",
    });
    const doc = await run();
    expect(doc).toEqual({ location: "custom-documents/raw-custom.json" });
  });
});
