jest.mock("../../../../utils/files", () => ({
  storeVectorResult: jest.fn(),
  cachedVectorInformation: jest.fn(),
}));
jest.mock("../../../../models/systemSettings", () => ({
  SystemSettings: { getValueOrFallback: jest.fn() },
}));

const { TopK: TopKClass } = require("../../../../utils/vectorDbProviders/topk");

const TopK = new TopKClass();

// Minimal stand-in for the topk-js client: only the calls the provider makes.
function mockClient({ collections = [], query = async () => [] } = {}) {
  const upserts = [];
  const queries = [];
  return {
    upserts,
    queries,
    collections: () => ({
      list: ({ prefix }) =>
        (async function* () {
          for (const name of collections)
            if (name.startsWith(prefix)) yield { name };
        })(),
    }),
    collection: (name) => ({
      query: async (q, opts) => {
        queries.push({ name, q, opts });
        return await query(q, queries.length);
      },
      upsert: async (docs) => upserts.push(docs),
    }),
  };
}

describe("TopK.collectionName", () => {
  it("prefixes the namespace and suffixes the dimension", () => {
    expect(TopK.collectionName("my-workspace", 384)).toBe(
      "anythingllm-my-workspace-d384"
    );
  });

  it("replaces characters TopK does not allow in collection names", () => {
    expect(TopK.collectionName("thread/abc def.1", 1536)).toBe(
      "anythingllm-thread-abc-def-1-d1536"
    );
  });
});

describe("TopK.collectionNames", () => {
  it("only returns collections that belong to the namespace", async () => {
    const client = mockClient({
      collections: [
        "anythingllm-docs-d384",
        "anythingllm-docs-d1536",
        "anythingllm-docs-d1-d384", // workspace "docs-d1"
        "anythingllm-docs2-d384",
        "other-docs-d384",
      ],
    });
    expect(await TopK.collectionNames(client, "docs")).toEqual([
      "anythingllm-docs-d384",
      "anythingllm-docs-d1536",
    ]);
  });

  it("returns every AnythingLLM collection without a namespace", async () => {
    const client = mockClient({
      collections: ["anythingllm-a-d384", "anythingllm-b-d768", "other-c-d384"],
    });
    expect(await TopK.collectionNames(client)).toEqual([
      "anythingllm-a-d384",
      "anythingllm-b-d768",
    ]);
  });
});

describe("TopK.normalizeScore", () => {
  it("clamps cosine similarity into [0, 1]", () => {
    expect(TopK.normalizeScore(0.42)).toBe(0.42);
    expect(TopK.normalizeScore(-0.3)).toBe(0);
    expect(TopK.normalizeScore(1.2)).toBe(1);
  });

  it("returns 0 for missing scores", () => {
    expect(TopK.normalizeScore(null)).toBe(0);
    expect(TopK.normalizeScore(undefined)).toBe(0);
    expect(TopK.normalizeScore("0.5")).toBe(0);
  });
});

describe("TopK.keywordsOf", () => {
  it("drops filler words and punctuation from questions", () => {
    expect(TopK.keywordsOf("What is issue #6054 about?")).toBe("issue 6054");
    expect(TopK.keywordsOf("Who is handling ticket ZX-4471?")).toBe(
      "handling ticket zx-4471"
    );
  });

  it("returns an empty string when nothing is worth matching", () => {
    expect(TopK.keywordsOf("What is it about?")).toBe("");
    expect(TopK.keywordsOf("")).toBe("");
  });
});

describe("TopK.fuseResults", () => {
  const doc = (id, vectorScore, keywordScore) => ({
    _id: id,
    vectorScore,
    ...(keywordScore === undefined ? {} : { keywordScore }),
  });

  it("is the plain vector similarity without keyword matches", () => {
    const fused = TopK.fuseResults([doc("a", 0.4), doc("b", 0.6)], []);
    expect(fused.map((d) => [d._id, d.score])).toEqual([
      ["b", 0.6],
      ["a", 0.4],
    ]);
  });

  it("gives the best keyword match the full boost and others a share", () => {
    const fused = TopK.fuseResults(
      [doc("a", 0.5)],
      [doc("b", 0.2, 8), doc("c", 0.2, 2)]
    );
    const score = Object.fromEntries(fused.map((d) => [d._id, d.score]));
    expect(score.a).toBe(0.5);
    expect(score.b).toBeCloseTo(0.2 + TopK.keywordWeight);
    expect(score.c).toBeCloseTo(0.2 + TopK.keywordWeight * 0.25);
  });

  it("merges a chunk found by both searches", () => {
    const fused = TopK.fuseResults([doc("a", 0.5)], [doc("a", 0.5, 3)]);
    expect(fused).toHaveLength(1);
    expect(fused[0].score).toBeCloseTo(0.5 + TopK.keywordWeight);
  });

  it("stays within [0, 1]", () => {
    const fused = TopK.fuseResults([doc("a", -0.5)], [doc("b", 0.95, 4)]);
    expect(fused.map((d) => d.score)).toEqual([1, 0]);
  });
});

describe("TopK search queries", () => {
  it("builds vector and keyword queries", () => {
    expect(() => TopK.vectorQuery([0.1, 0.2, 0.3], 20)).not.toThrow();
    expect(() =>
      TopK.keywordQuery([0.1, 0.2, 0.3], "ticket zx-4471", 20)
    ).not.toThrow();
  });
});

describe("TopK.similarityResponse", () => {
  const queryVector = [0.1, 0.2, 0.3];
  const row = (id, vectorScore, keywordScore, metadata = {}) => ({
    _id: id,
    text: `text ${id}`,
    metadata: JSON.stringify(metadata),
    vectorScore,
    ...(keywordScore === undefined ? {} : { keywordScore }),
  });
  // The provider runs the vector query first and the keyword query second.
  const searches = (vector, keyword) => async (_q, n) =>
    n % 2 === 1 ? vector : keyword;

  it("queries the collection for the query vector's dimension", async () => {
    const client = mockClient();
    await TopK.similarityResponse({ client, namespace: "ws", queryVector });
    expect(client.queries).toHaveLength(1); // no keywords, no keyword search
    expect(client.queries[0].name).toBe("anythingllm-ws-d3");
    expect(client.queries[0].opts).toEqual({ consistency: "strong" });
  });

  it("runs a keyword search when the input has keywords", async () => {
    const client = mockClient();
    await TopK.similarityResponse({
      client,
      namespace: "ws",
      queryVector,
      input: "ticket ZX-4471",
    });
    expect(client.queries).toHaveLength(2);
  });

  it("ranks keyword matches up, drops low scores and caps at topN", async () => {
    const client = mockClient({
      query: searches(
        [
          row("a", 0.7, undefined, { title: "a.txt" }),
          row("c", 0.1, undefined, { title: "c.txt" }),
          row("d", 0.6, undefined, { title: "d.txt" }),
        ],
        // Boosted, but still below a and d: the boost is at most keywordWeight.
        [row("b", 0, 4, { title: "b.txt" })]
      ),
    });
    const result = await TopK.similarityResponse({
      client,
      namespace: "ws",
      queryVector,
      input: "b",
      similarityThreshold: 0.25,
      topN: 2,
    });
    expect(result.contextTexts).toEqual(["text a", "text d"]);
    const withKeyword = await TopK.similarityResponse({
      client: mockClient({
        query: searches(
          [row("a", 0.5, undefined, { title: "a.txt" })],
          [row("b", 0.3, 4, { title: "b.txt" })]
        ),
      }),
      namespace: "ws",
      queryVector,
      input: "b",
    });
    expect(withKeyword.sourceDocuments).toEqual([
      { title: "b.txt", id: "b" },
      { title: "a.txt", id: "a" },
    ]);
    expect(withKeyword.scores[0]).toBeCloseTo(0.3 + TopK.keywordWeight);
    expect(withKeyword.scores[1]).toBe(0.5);
  });

  it("skips chunks from pinned documents", async () => {
    const pinned = { title: "pinned.txt", published: "2026-01-01" };
    const client = mockClient({
      query: async () => [
        row("a", 0.9, undefined, pinned),
        row("b", 0.8, undefined, { title: "b.txt" }),
      ],
    });
    const result = await TopK.similarityResponse({
      client,
      namespace: "ws",
      queryVector,
      filterIdentifiers: ["title:pinned.txt-timestamp:2026-01-01"],
    });
    expect(result.contextTexts).toEqual(["text b"]);
  });

  it("returns no results when the collection does not exist", async () => {
    const client = mockClient({
      query: async () => {
        throw new Error("collection not found");
      },
    });
    const result = await TopK.similarityResponse({
      client,
      namespace: "ws",
      queryVector,
      input: "hello",
    });
    expect(result).toEqual({
      contextTexts: [],
      sourceDocuments: [],
      scores: [],
    });
  });

  it("falls back to vector search on collections without a keyword index", async () => {
    const client = mockClient({
      query: async (_q, n) => {
        if (n % 2 === 0) throw new Error("No keyword indexes found");
        return [row("a", 0.6)];
      },
    });
    const result = await TopK.similarityResponse({
      client,
      namespace: "ws",
      queryVector,
      input: "hello",
    });
    expect(result.contextTexts).toEqual(["text a"]);
    expect(result.scores).toEqual([0.6]);
  });

  it("rethrows other errors", async () => {
    const client = mockClient({
      query: async () => {
        throw new Error("permission denied");
      },
    });
    await expect(
      TopK.similarityResponse({ client, namespace: "ws", queryVector })
    ).rejects.toThrow("permission denied");
  });
});

describe("TopK.smartAdd", () => {
  it("upserts in batches of maxRecordsPerWrite", async () => {
    const client = mockClient();
    const collection = client.collection("anythingllm-ws-d3");
    const records = Array.from({ length: 250 }, (_, i) => ({
      id: `id-${i}`,
      values: [0.1, 0.2, 0.3],
      text: `chunk ${i}`,
      docId: "doc-1",
      metadata: { title: "doc.txt" },
    }));
    await TopK.smartAdd(collection, records);
    expect(client.upserts.map((batch) => batch.length)).toEqual([100, 100, 50]);
    expect(client.upserts[0][0]).toEqual({
      _id: "id-0",
      embedding: [0.1, 0.2, 0.3],
      text: "chunk 0",
      doc_id: "doc-1",
      metadata: JSON.stringify({ title: "doc.txt" }),
    });
  });
});

describe("TopK.connect", () => {
  const original = process.env.VECTOR_DB;
  afterEach(() => {
    process.env.VECTOR_DB = original;
  });

  it("refuses to connect when TopK is not the selected vector database", async () => {
    process.env.VECTOR_DB = "lancedb";
    await expect(TopK.connect()).rejects.toThrow("TopK::Invalid ENV settings");
  });
});
