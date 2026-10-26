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
    const text = "This is a test text to be split into chunks".repeat(2);
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    const textSplitter = new TextSplitter({
      chunkSize: 30,
      chunkOverlap: 31,
    });
    const chunks = await textSplitter.splitText(text);
    logSpy.mockRestore();

    // Falls back to the default overlap of 20, same as an unset chunkOverlap.
    const defaultOverlapChunks = await new TextSplitter({
      chunkSize: 30,
    }).splitText(text);
    expect(chunks).toEqual(defaultOverlapChunks);
  });

  test("keeps embedding when the embedder caps chunkSize below the saved chunkOverlap", async () => {
    const text = "word ".repeat(2_000);
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    // Saved settings: 8000 char chunks with a 1500 char overlap, embedder max of 1000.
    const textSplitter = new TextSplitter({
      chunkSize: TextSplitter.determineMaxChunkSize(8_000, 1_000),
      chunkOverlap: 1_500,
    });
    const chunks = await textSplitter.splitText(text);
    logSpy.mockRestore();

    expect(chunks.length).toEqual(11);
    expect(chunks.every((chunk) => chunk.length <= 1_000)).toBe(true);
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
    expect(chunks.length).toEqual(5);
    expect(chunks.every(chunk => chunk.startsWith("testing: "))).toBe(true);

    textSplitter = new TextSplitter({
      chunkSize: 20,
      chunkOverlap: 0,
      chunkPrefix: "testing2: ",
    });
    chunks = await textSplitter.splitText(text);
    expect(chunks.length).toEqual(5);
    expect(chunks.every(chunk => chunk.startsWith("testing2: "))).toBe(true);

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

  test("defaults chunkSize to 1000 when null", async () => {
    const text = "word ".repeat(500);
    const textSplitter = new TextSplitter({ chunkSize: null, chunkOverlap: 20 });
    const chunks = await textSplitter.splitText(text);
    expect(chunks.length).toEqual(3);
    expect(chunks.every((chunk) => chunk.length <= 1000)).toBe(true);
  });

  test("warns when a chunk header is present but does not change the split", async () => {
    const text = "word ".repeat(200);
    const chunkHeaderMeta = TextSplitter.buildHeaderMeta({
      title: "Example.pdf",
      published: "2026-09-16T00:00:00.000Z",
      chunkSource: "link://https://example.com/page",
    });
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    const textSplitter = new TextSplitter({ chunkSize: 100, chunkOverlap: 20, chunkHeaderMeta });
    const header = textSplitter.stringifyHeader();
    const chunks = await textSplitter.splitText(text);
    const headerless = await new TextSplitter({ chunkSize: 100, chunkOverlap: 20 }).splitText(text);
    const logged = logSpy.mock.calls.map((call) => String(call[0]));
    logSpy.mockRestore();

    expect(logged.some((line) => line.includes(`Chunk header of ${header.length} chars`))).toBe(true);
    expect(chunks.map((chunk) => chunk.slice(header.length))).toEqual(headerless);
    expect(chunks.every((chunk) => chunk.startsWith(header))).toBe(true);
  });
});
