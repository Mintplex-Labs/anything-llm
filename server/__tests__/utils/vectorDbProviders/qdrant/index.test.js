/* eslint-env jest, node */

jest.mock("@qdrant/js-client-rest", () => ({
  QdrantClient: jest.fn(),
}));

jest.mock("../../../../utils/TextSplitter", () => ({
  TextSplitter: jest.fn(),
}));

jest.mock("../../../../models/systemSettings", () => ({
  SystemSettings: {},
}));

jest.mock("../../../../utils/files", () => ({
  storeVectorResult: jest.fn(),
  cachedVectorInformation: jest.fn(),
}));

jest.mock("uuid", () => ({
  v4: jest.fn(() => "test-uuid"),
}));

jest.mock("../../../../utils/helpers", () => ({
  toChunks: jest.fn(),
  getEmbeddingEngineSelection: jest.fn(),
}));

jest.mock("../../../../utils/chats", () => ({
  sourceIdentifier: jest.fn((payload) => {
    if (!payload?.title || !payload?.published) return "anon-source";
    return `title:${payload.title}-timestamp:${payload.published}`;
  }),
}));

const { QDrant } = require("../../../../utils/vectorDbProviders/qdrant");

describe("QDrant.similarityResponse", () => {
  let provider;

  beforeEach(() => {
    provider = new QDrant();
    jest.spyOn(provider, "logger").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("uses client.query (not search) and maps {points} for @qdrant/js-client-rest 1.19+", async () => {
    const queryVector = [0.1, 0.2, 0.3];
    const query = jest.fn().mockResolvedValue({
      points: [
        {
          id: "hit-1",
          score: 0.91,
          payload: {
            text: "relevant chunk",
            title: "doc.md",
            published: "2026-01-01",
          },
        },
        {
          id: "hit-2",
          score: 0.1,
          payload: { text: "below threshold", title: "other.md", published: "2026-01-02" },
        },
      ],
    });

    // 1.19-shaped client: query present, search removed.
    const client = { query };
    expect(typeof client.search).toBe("undefined");

    const result = await provider.similarityResponse({
      client,
      namespace: "workspace_ns",
      queryVector,
      similarityThreshold: 0.25,
      topN: 4,
      filterIdentifiers: [],
    });

    expect(query).toHaveBeenCalledTimes(1);
    expect(query).toHaveBeenCalledWith("workspace_ns", {
      query: queryVector,
      limit: 4,
      with_payload: true,
    });
    expect(result.contextTexts).toEqual(["relevant chunk"]);
    expect(result.scores).toEqual([0.91]);
    expect(result.sourceDocuments).toEqual([
      {
        text: "relevant chunk",
        title: "doc.md",
        published: "2026-01-01",
        id: "hit-1",
        score: 0.91,
      },
    ]);
  });

  it("filters pinned source identifiers from query points", async () => {
    const pinnedId = "title:pinned.md-timestamp:2026-01-01";
    const client = {
      query: jest.fn().mockResolvedValue({
        points: [
          {
            id: "pinned",
            score: 0.95,
            payload: {
              text: "pinned text",
              title: "pinned.md",
              published: "2026-01-01",
            },
          },
          {
            id: "ok",
            score: 0.8,
            payload: {
              text: "ok text",
              title: "ok.md",
              published: "2026-01-02",
            },
          },
        ],
      }),
    };

    const result = await provider.similarityResponse({
      client,
      namespace: "ns",
      queryVector: [1],
      similarityThreshold: 0.25,
      topN: 4,
      filterIdentifiers: [pinnedId],
    });

    expect(result.contextTexts).toEqual(["ok text"]);
    expect(result.sourceDocuments.map((d) => d.id)).toEqual(["ok"]);
  });

  it("treats a missing points array as empty results", async () => {
    const client = {
      query: jest.fn().mockResolvedValue({}),
    };

    const result = await provider.similarityResponse({
      client,
      namespace: "ns",
      queryVector: [1],
    });

    expect(result).toEqual({
      contextTexts: [],
      sourceDocuments: [],
      scores: [],
    });
  });
});
