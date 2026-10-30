jest.mock("@lancedb/lancedb", () => ({}));
jest.mock("../../../../utils/helpers", () => ({}));
jest.mock("../../../../utils/TextSplitter", () => ({}));
jest.mock("../../../../models/systemSettings", () => ({}));
jest.mock("../../../../utils/files", () => ({}));
jest.mock("../../../../utils/EmbeddingRerankers/native", () => ({
  NativeEmbeddingReranker: jest.fn(),
}));

const { LanceDb } = require("../../../../utils/vectorDbProviders/lance");
const { sourceIdentifier } = require("../../../../utils/chats");
const {
  NativeEmbeddingReranker,
} = require("../../../../utils/EmbeddingRerankers/native");

const chunk = (id, overrides = {}) => ({
  id,
  title: id,
  published: "2026-01-01",
  text: `${id} evidence`,
  vector: [1, 0],
  _distance: 0.1,
  rerank_score: 0.5,
  ...overrides,
});

describe("LanceDb rerankedSimilarityResponse", () => {
  let db, search, client, rerank;

  beforeEach(() => {
    jest.clearAllMocks();
    db = new LanceDb();
    jest.spyOn(db, "logger").mockImplementation(() => {});
    jest.spyOn(db, "namespaceCount").mockResolvedValue(6);
    search = {
      distanceType: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      toArray: jest.fn(),
    };
    client = {
      openTable: jest.fn().mockResolvedValue({
        vectorSearch: jest.fn().mockReturnValue(search),
      }),
    };
    // Model scores are controlled so the test isolates eligibility vs topK.
    rerank = jest.fn(async (_query, documents, { topK }) =>
      [...documents]
        .sort((a, b) => b.rerank_score - a.rerank_score)
        .slice(0, topK)
    );
    NativeEmbeddingReranker.mockImplementation(() => ({ rerank }));
  });

  const run = (overrides = {}) =>
    db.rerankedSimilarityResponse({
      client,
      namespace: "workspace",
      query: "What are the region and approval code?",
      queryVector: [1, 0],
      topN: 4,
      similarityThreshold: 0.25,
      ...overrides,
    });

  it("retains complementary evidence when pinned chunks fill the topK positions", async () => {
    const pinned = Array.from({ length: 4 }, (_, i) =>
      chunk(`A${i}`, {
        title: "A",
        text: "The deployment region is eu-west-2.",
        rerank_score: 0.99 - i * 0.01,
      })
    );
    const evidence = chunk("B", {
      text: "The required approval code is APR-731.",
      rerank_score: 0.8,
    });
    search.toArray.mockResolvedValue([...pinned, evidence]);

    const result = await run({
      filterIdentifiers: [sourceIdentifier(pinned[0])],
    });

    expect(result.contextTexts).toEqual([evidence.text]);
    expect(result.sourceDocuments).toEqual([
      expect.objectContaining({ id: "B", score: 0.8 }),
    ]);
    expect(result.sourceDocuments[0]).not.toHaveProperty("vector");
    expect(result.scores).toEqual([0.8]);
    expect(rerank.mock.calls[0][1]).toEqual([evidence]);
    expect(search.limit).toHaveBeenCalledWith(10);
  });

  it("does not let a high rerank score below the vector threshold displace eligible evidence", async () => {
    const rejected = chunk("irrelevant", {
      _distance: 0.9,
      rerank_score: 0.99,
    });
    const eligible = chunk("B", { _distance: 0.75 });
    search.toArray.mockResolvedValue([rejected, eligible]);

    const result = await run({ topN: 1 });

    expect(result.contextTexts).toEqual([eligible.text]);
    expect(rerank.mock.calls[0][1]).toEqual([eligible]);
  });

  it.each(["empty", "pinned", "below threshold"])(
    "skips model inference when the candidate pool is %s",
    async (kind) => {
      const candidate = chunk("A", {
        _distance: kind === "below threshold" ? 0.9 : 0.1,
      });
      search.toArray.mockResolvedValue(kind === "empty" ? [] : [candidate]);
      const result = await run({
        filterIdentifiers:
          kind === "pinned" ? [sourceIdentifier(candidate)] : [],
      });
      expect(result).toEqual({
        contextTexts: [],
        sourceDocuments: [],
        scores: [],
      });
      expect(rerank).not.toHaveBeenCalled();
    }
  );

  it("preserves rerank order and topN when all candidates qualify", async () => {
    const candidates = [chunk("B"), chunk("C", { rerank_score: 0.9 })];
    search.toArray.mockResolvedValue(candidates);
    const result = await run({ topN: 1 });
    expect(result.sourceDocuments.map((doc) => doc.id)).toEqual(["C"]);
    expect(result.scores).toEqual([0.9]);
    expect(rerank).toHaveBeenCalledWith(expect.any(String), candidates, {
      topK: 1,
    });
  });

  it("keeps a different publication of the same title eligible", async () => {
    const pinned = chunk("A");
    const other = chunk("A", { published: "2026-02-01" });
    search.toArray.mockResolvedValue([pinned, other]);
    expect(
      (await run({ filterIdentifiers: [sourceIdentifier(pinned)] }))
        .contextTexts
    ).toEqual([other.text]);
    expect(rerank.mock.calls[0][1]).toEqual([other]);
  });

  it("preserves the existing maximum candidate budget", async () => {
    db.namespaceCount.mockResolvedValue(10000);
    search.toArray.mockResolvedValue([chunk("B")]);
    await run();
    expect(search.limit).toHaveBeenCalledWith(50);
  });

  it("preserves the empty response on reranker failure", async () => {
    search.toArray.mockResolvedValue([chunk("B")]);
    rerank.mockRejectedValue(new Error("inference failed"));
    expect(await run()).toEqual({
      contextTexts: [],
      sourceDocuments: [],
      scores: [],
    });
  });
});
