const { TextSplitter } = require("../../../utils/TextSplitter");

describe("Sentence text splitting", () => {
  const split = (text, config = {}) =>
    new TextSplitter({
      strategy: "sentence",
      chunkSize: 30,
      chunkOverlap: 0,
      ...config,
    }).splitText(text);

  it("keeps sentences together instead of filling chunks with partial sentences", async () => {
    expect(
      await split("First sentence. Second sentence. Third sentence.")
    ).toEqual(["First sentence.", "Second sentence.", "Third sentence."]);
  });

  it("groups consecutive sentences that fit", async () => {
    expect(await split("One. Two. Three.")).toEqual(["One. Two. Three."]);
  });

  it("uses whole sentences for overlap without exceeding either limit", async () => {
    const chunks = await split("One. Two. Three. Four.", {
      chunkSize: 16,
      chunkOverlap: 7,
    });
    expect(chunks).toEqual(["One. Two. Three.", "Three. Four."]);
    expect(chunks.every((chunk) => chunk.length <= 16)).toBe(true);
  });

  it("does not overlap a sentence longer than the configured overlap", async () => {
    expect(
      await split("First sentence. Second sentence.", { chunkOverlap: 5 })
    ).toEqual(["First sentence.", "Second sentence."]);
  });

  it("falls back for oversized sentences and retains following text", async () => {
    const text =
      "A sentence much longer than the configured chunk limit. Done.";
    const chunks = await split(text, { chunkSize: 20 });
    expect(chunks.every((chunk) => chunk.length <= 20)).toBe(true);
    expect(chunks.join(" ")).toBe(text);
  });

  it("splits long unbroken text within the chunk limit", async () => {
    const text = "x".repeat(95);
    const chunks = await split(text, { chunkSize: 20 });
    expect(chunks.map((chunk) => chunk.length)).toEqual([20, 20, 20, 20, 15]);
    expect(chunks.join("")).toBe(text);
  });

  it("handles Unicode sentence boundaries", async () => {
    expect(await split("你好世界。再见世界。", { chunkSize: 6 })).toEqual([
      "你好世界。",
      "再见世界。",
    ]);
  });

  it.each(["", " \n\t "])("does not embed empty content: %j", async (text) => {
    expect(await split(text)).toEqual([]);
  });

  it("applies metadata and the embedding prefix once to every chunk", async () => {
    const splitter = new TextSplitter({
      strategy: "sentence",
      chunkSize: 20,
      chunkOverlap: 0,
      chunkPrefix: "search_document: ",
      chunkHeaderMeta: { sourceDocument: "Guide" },
    });
    const header = splitter.stringifyHeader();
    expect(
      await splitter.splitText("First sentence. Second sentence.")
    ).toEqual([`${header}First sentence.`, `${header}Second sentence.`]);
  });

  it.each([
    { chunkSize: 0 },
    { chunkSize: 2.5 },
    { chunkOverlap: -1 },
    { chunkOverlap: 31 },
  ])("rejects invalid sentence settings: %j", (config) => {
    expect(
      () =>
        new TextSplitter({
          strategy: "sentence",
          chunkSize: 30,
          chunkOverlap: 0,
          ...config,
        })
    ).toThrow();
  });

  it("preserves the existing default strategy", async () => {
    const text = "First sentence. Second sentence. Third sentence.";
    const config = { chunkSize: 25, chunkOverlap: 5 };
    const defaults = new TextSplitter(config);
    const explicit = new TextSplitter({ ...config, strategy: "recursive" });
    expect(await defaults.splitText(text)).toEqual(
      await explicit.splitText(text)
    );
  });
});
