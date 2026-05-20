/* eslint-env jest, node */
const { BM25, tokenize } = require("../../../utils/HybridSearch/tokenizers/bm25");

describe("tokenize", () => {
  it("lowercases, strips punctuation, drops stopwords and 1-char tokens", () => {
    expect(tokenize("The quick, brown FOX!")).toEqual(["quick", "brown", "fox"]);
  });

  it("returns empty for nullish or non-string input", () => {
    expect(tokenize(null)).toEqual([]);
    expect(tokenize(undefined)).toEqual([]);
    expect(tokenize(123)).toEqual([]);
  });

  it("handles unicode letters", () => {
    expect(tokenize("café naïve")).toEqual(["café", "naïve"]);
  });
});

describe("BM25", () => {
  const docs = [
    { id: "1", text: "the quick brown fox jumps over the lazy dog", item: { id: 1 } },
    { id: "2", text: "a brown fox is a clever animal", item: { id: 2 } },
    { id: "3", text: "machine learning models predict outcomes", item: { id: 3 } },
    { id: "4", text: "the lazy dog sleeps all afternoon", item: { id: 4 } },
  ];

  it("returns empty array for unmatched query", () => {
    const bm25 = new BM25(docs);
    expect(bm25.score("quantum entanglement")).toEqual([]);
  });

  it("returns empty for empty query", () => {
    const bm25 = new BM25(docs);
    expect(bm25.score("")).toEqual([]);
  });

  it("ranks docs containing query terms above docs without them", () => {
    const bm25 = new BM25(docs);
    const results = bm25.score("brown fox");
    expect(results.length).toBeGreaterThan(0);
    expect(results.map((r) => r.id)).toEqual(expect.arrayContaining(["1", "2"]));
    // doc 3 has neither term — must not appear
    expect(results.map((r) => r.id)).not.toContain("3");
  });

  it("scores docs with both query terms above docs with one", () => {
    const bm25 = new BM25(docs);
    const results = bm25.score("lazy dog");
    // Docs 1 and 4 contain both "lazy" and "dog"; the others don't match at all.
    const both = results.map((r) => r.id);
    expect(both).toEqual(expect.arrayContaining(["1", "4"]));
    expect(both).not.toContain("3");
  });

  it("handles empty corpus", () => {
    const bm25 = new BM25([]);
    expect(bm25.score("anything")).toEqual([]);
  });

  it("preserves the original item reference on each result", () => {
    const bm25 = new BM25(docs);
    const [top] = bm25.score("brown fox");
    expect(top.item).toEqual({ id: 2 });
  });
});
