/* eslint-env jest */
const mockRerank = jest.fn();

jest.mock("@lancedb/lancedb", () => ({
  connect: jest.fn(),
}));
jest.mock("../../../../utils/helpers", () => ({}));
jest.mock("../../../../utils/TextSplitter", () => ({}));
jest.mock("../../../../models/systemSettings", () => ({}));
jest.mock("../../../../utils/files", () => ({}));
jest.mock("../../../../utils/chats", () => ({
  sourceIdentifier: jest.fn(),
}));
jest.mock("../../../../utils/EmbeddingRerankers/native", () => ({
  NativeEmbeddingReranker: jest.fn(),
}));
jest.mock("../../../../utils/vectorDbProviders/base", () => ({
  VectorDatabase: class {
    logger() {}
  },
}));

const { LanceDb } = require("../../../../utils/vectorDbProviders/lance");
const { sourceIdentifier } = require("../../../../utils/chats");
const {
  NativeEmbeddingReranker,
} = require("../../../../utils/EmbeddingRerankers/native");

describe("LanceDb rerankedSimilarityResponse searchLimit", () => {
  const makeRows = (n) =>
    Array.from({ length: n }, (_, i) => ({
      id: `row-${i}`,
      text: `chunk ${i}`,
      _distance: 0.1,
    }));

  const buildChain = (rows) => {
    const chain = {
      distanceType: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      toArray: jest.fn().mockResolvedValue(rows),
    };
    const client = {
      openTable: jest.fn().mockResolvedValue({
        vectorSearch: jest.fn().mockReturnValue(chain),
      }),
    };
    return { client, chain };
  };

  const runSearch = async (client, { topN, totalEmbeddings }) => {
    jest
      .spyOn(LanceDb.prototype, "namespaceCount")
      .mockResolvedValue(totalEmbeddings);
    const db = new LanceDb();
    return db.rerankedSimilarityResponse({
      client,
      namespace: "workspace-ns",
      query: "test query",
      queryVector: [0.1, 0.2],
      similarityThreshold: 0.25,
      topN,
      filterIdentifiers: [],
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    sourceIdentifier.mockReturnValue("mock-source-identifier");
    NativeEmbeddingReranker.mockImplementation(() => ({ rerank: mockRerank }));
    mockRerank.mockImplementation(async (_query, rows, { topK }) =>
      rows.slice(0, topK)
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("fetches at least topN candidates when the namespace is small (total=20, topN=20)", async () => {
    const { client, chain } = buildChain(makeRows(20));

    const result = await runSearch(client, { topN: 20, totalEmbeddings: 20 });

    expect(chain.limit).toHaveBeenCalledWith(20);
    expect(result.contextTexts).toHaveLength(20);
  });

  test("keeps the 10-candidate floor for small namespaces (total=20, topN=4)", async () => {
    const { client, chain } = buildChain(makeRows(10));

    const result = await runSearch(client, { topN: 4, totalEmbeddings: 20 });

    expect(chain.limit).toHaveBeenCalledWith(10);
    expect(result.contextTexts).toHaveLength(4);
  });

  test("caps at 50 for large namespaces (total=1000, topN=4)", async () => {
    const { client, chain } = buildChain(makeRows(50));

    const result = await runSearch(client, { topN: 4, totalEmbeddings: 1000 });

    expect(chain.limit).toHaveBeenCalledWith(50);
    expect(result.contextTexts).toHaveLength(4);
  });

  test("caps topN at 50 to bound rerank cost (topN=100)", async () => {
    const { client, chain } = buildChain(makeRows(50));

    const result = await runSearch(client, { topN: 100, totalEmbeddings: 20 });

    expect(chain.limit).toHaveBeenCalledWith(50);
    expect(result.contextTexts).toHaveLength(50);
  });

  test("reranker only sees eligible candidates below the fetched limit", async () => {
    const { client } = buildChain(makeRows(20));

    await runSearch(client, { topN: 20, totalEmbeddings: 20 });

    expect(mockRerank).toHaveBeenCalledWith(
      "test query",
      expect.any(Array),
      { topK: 20 }
    );
    expect(mockRerank.mock.calls[0][1]).toHaveLength(20);
  });
});