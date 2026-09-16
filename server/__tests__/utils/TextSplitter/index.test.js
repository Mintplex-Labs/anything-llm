const { TextSplitter } = require("../../../utils/TextSplitter");
const _ = require("lodash");

describe("TextSplitter", () => {
  test("should split long text into n sized chunks", async () => {
    const text = "This is a test text to be split into chunks".repeat(2);
    const textSplitter = new TextSplitter({
      chunkSize: 20,
      chunkOverlap: 0,
    });
    const chunks = await textSplitter.splitText(text);
    expect(chunks.length).toEqual(5);
  });

  test("applies chunk overlap of 20 characters on invalid chunkOverlap", async () => {
    const text = "This is a test text to be split into chunks".repeat(2);
    const textSplitter = new TextSplitter({
      chunkSize: 30,
    });
    const chunks = await textSplitter.splitText(text);
    expect(chunks.length).toEqual(6);
  });

  test("does not allow chunkOverlap to be greater than chunkSize", async () => {
    expect(() => {
      new TextSplitter({
        chunkSize: 20,
        chunkOverlap: 21,
      });
    }).toThrow();
  });

  test("applies specific metadata to stringifyHeader to each chunk", async () => {
    const metadata = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      url: "https://example.com",
      title: "Example",
      docAuthor: "John Doe",
      published: "2021-01-01",
      chunkSource: "link://https://example.com",
      description: "This is a test text to be split into chunks",
    };
    const chunkHeaderMeta = TextSplitter.buildHeaderMeta(metadata);
    expect(chunkHeaderMeta).toEqual({
      sourceDocument: metadata.title,
      source: metadata.url,
      published: metadata.published,
    });
  });

  test("applies a valid chunkPrefix to each chunk", async () => {
    const text = "This is a test text to be split into chunks".repeat(2);
    let textSplitter = new TextSplitter({
      chunkSize: 20,
      chunkOverlap: 0,
      chunkPrefix: "testing: ",
    });
    let chunks = await textSplitter.splitText(text);
    // The prefix is part of what the embedder receives, so it comes out of the
    // chunk size rather than being added on top of it.
    expect(chunks.length).toEqual(9);
    expect(chunks.every(chunk => chunk.startsWith("testing: "))).toBe(true);
    expect(chunks.every(chunk => chunk.length <= 20)).toBe(true);

    textSplitter = new TextSplitter({
      chunkSize: 20,
      chunkOverlap: 0,
      chunkPrefix: "testing2: ",
    });
    chunks = await textSplitter.splitText(text);
    expect(chunks.length).toEqual(12);
    expect(chunks.every(chunk => chunk.startsWith("testing2: "))).toBe(true);
    expect(chunks.every(chunk => chunk.length <= 20)).toBe(true);

    textSplitter = new TextSplitter({
      chunkSize: 20,
      chunkOverlap: 0,
      chunkPrefix: undefined,
    });
    chunks = await textSplitter.splitText(text);
    expect(chunks.length).toEqual(5);
    expect(chunks.every(chunk => !chunk.startsWith(": "))).toBe(true);

    textSplitter = new TextSplitter({
      chunkSize: 20,
      chunkOverlap: 0,
      chunkPrefix: "",
    });
    chunks = await textSplitter.splitText(text);
    expect(chunks.length).toEqual(5);
    expect(chunks.every(chunk => !chunk.startsWith(": "))).toBe(true);

    // Applied chunkPrefix with chunkHeaderMeta
    textSplitter = new TextSplitter({
      chunkSize: 20,
      chunkOverlap: 0,
      chunkHeaderMeta: TextSplitter.buildHeaderMeta({
        title: "Example",
        url: "https://example.com",
        published: "2021-01-01",
      }),
      chunkPrefix: "testing3: ",
    });
    chunks = await textSplitter.splitText(text);
    expect(chunks.length).toEqual(5);
    expect(chunks.every(chunk => chunk.startsWith("testing3: <document_metadata>"))).toBe(true);
  });

  test("keeps the header inside the chunk size", async () => {
    const text = "word ".repeat(2_000);
    const chunkHeaderMeta = TextSplitter.buildHeaderMeta({
      title: "A Fairly Long Document Title That Real Uploads Have.pdf",
      published: "2026-09-16T00:00:00.000Z",
      chunkSource: "link://https://example.com/some/deep/path/to/a/page",
    });
    const textSplitter = new TextSplitter({
      chunkSize: 1_000,
      chunkOverlap: 20,
      chunkHeaderMeta,
    });

    const chunks = await textSplitter.splitText(text);

    // The header goes on every chunk, so header + content is what the embedder
    // is asked to embed, and chunkSize is that embedder's hard limit.
    expect(textSplitter.stringifyHeader().length).toBeGreaterThan(0);
    expect(chunks.length).toBeGreaterThan(1);
    expect(Math.max(...chunks.map((chunk) => chunk.length))).toBeLessThanOrEqual(
      1_000
    );
  });

  test("leaves the chunk size alone when the header cannot fit in it", async () => {
    const text = "word ".repeat(200);
    const chunkHeaderMeta = TextSplitter.buildHeaderMeta({
      title: "A Fairly Long Document Title That Real Uploads Have.pdf",
      published: "2026-09-16T00:00:00.000Z",
      chunkSource: "link://https://example.com/some/deep/path/to/a/page",
    });
    const textSplitter = new TextSplitter({
      chunkSize: 100,
      chunkOverlap: 20,
      chunkHeaderMeta,
    });
    const headerLength = textSplitter.stringifyHeader().length;
    expect(headerLength).toBeGreaterThan(100);

    const chunks = await textSplitter.splitText(text);

    // No split can honour the limit here, so the content budget is left as it
    // was rather than producing chunks that are almost entirely metadata.
    expect(
      chunks.every((chunk) => chunk.length - headerLength <= 100)
    ).toBe(true);
  });
});
