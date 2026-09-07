/**
 * Integration tests for the Valkey vector DB provider.
 *
 * These hit a REAL Valkey instance running the `valkey-search` module
 * (i.e. `valkey/valkey-bundle:8.1`). They are gated behind
 * VALKEY_INTEGRATION_TEST=1 so the default Jest run stays hermetic.
 *
 * Run:
 *   podman run -d --name valkey-test -p 6379:6379 valkey/valkey-bundle:8.1
 *   cd server && VALKEY_INTEGRATION_TEST=1 VALKEY_VECTOR_DB_HOST=localhost \
 *     VALKEY_VECTOR_DB_PORT=6379 \
 *     npx jest __tests__/utils/vectorDbProviders/valkey/integration.test.js
 *
 * Only the embedder, the on-disk vector cache, and the Prisma-backed
 * DocumentVectors model are stubbed - every Valkey operation is real.
 */

// Stub the embedder with a deterministic text->vector function so we don't pull
// a real embedding model into the test. The Valkey operations stay real.
jest.mock("../../../../utils/helpers", () => {
  const actual = jest.requireActual("../../../../utils/helpers");
  function mockTextToVector(text = "") {
    const v = new Array(8).fill(0);
    for (let i = 0; i < text.length; i++) v[i % 8] += text.charCodeAt(i);
    const mag = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
    return v.map((x) => x / mag);
  }
  return {
    ...actual,
    getEmbeddingEngineSelection: () => ({
      embeddingMaxChunkLength: 1000,
      embeddingPrefix: "",
      embedChunks: async (chunks) => chunks.map((c) => mockTextToVector(c)),
    }),
  };
});

// Avoid writing the on-disk vector cache during tests.
jest.mock("../../../../utils/files", () => ({
  storeVectorResult: jest.fn(async () => true),
  cachedVectorInformation: jest.fn(async () => ({ exists: false })),
}));

// In-memory DocumentVectors so we don't need a Prisma/SQLite database.
jest.mock("../../../../models/vectors", () => {
  const store = [];
  let nextId = 1;
  return {
    DocumentVectors: {
      where: async ({ docId }) => store.filter((r) => r.docId === docId),
      bulkInsert: async (records) => {
        records.forEach((r) => store.push({ id: nextId++, ...r }));
        return true;
      },
      deleteIds: async (ids) => {
        for (let i = store.length - 1; i >= 0; i--)
          if (ids.includes(store[i].id)) store.splice(i, 1);
        return true;
      },
    },
  };
});

jest.mock("../../../../models/systemSettings", () => ({
  SystemSettings: { getValueOrFallback: jest.fn(async () => null) },
}));

const {
  Valkey: ValkeyClass,
} = require("../../../../utils/vectorDbProviders/valkey");

// Same deterministic embedding used for query inputs in this test file.
function textToVector(text = "") {
  const v = new Array(8).fill(0);
  for (let i = 0; i < text.length; i++) v[i % 8] += text.charCodeAt(i);
  const mag = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
  return v.map((x) => x / mag);
}

const LLMConnector = {
  embedTextInput: async (input) => textToVector(input),
};

const RUN = process.env.VALKEY_INTEGRATION_TEST === "1";
const describeMaybe = RUN ? describe : describe.skip;

/**
 * Poll FT.INFO num_docs (via namespaceCount) until it equals `expected` or we
 * time out. valkey-search indexing is asynchronous, so we never sleep blindly.
 */
async function waitForIndexCount(
  provider,
  namespace,
  expected,
  { timeoutMs = 10_000, intervalMs = 100 } = {}
) {
  const deadline = Date.now() + timeoutMs;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const count = await provider.namespaceCount(namespace);
    if (count === expected) return count;
    if (Date.now() >= deadline) return count;
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
}

describeMaybe("Valkey provider - live integration", () => {
  let provider;
  const nsA = `it_ns_a_${Date.now()}`;
  const nsB = `it_ns_b_${Date.now()}`;

  beforeAll(() => {
    process.env.VECTOR_DB = "valkey";
    process.env.VALKEY_VECTOR_DB_HOST =
      process.env.VALKEY_VECTOR_DB_HOST || "localhost";
    process.env.VALKEY_VECTOR_DB_PORT =
      process.env.VALKEY_VECTOR_DB_PORT || "6379";
    provider = new ValkeyClass();
  });

  afterAll(async () => {
    try {
      await provider.reset();
    } finally {
      await provider.disconnect();
    }
  });

  it("connects and responds to a heartbeat", async () => {
    const result = await provider.heartbeat();
    expect(typeof result.heartbeat).toBe("number");
  });

  it("creates an index and ingests documents", async () => {
    const result = await provider.addDocumentToNamespace(
      nsA,
      {
        pageContent: "the quick brown fox jumps over the lazy dog",
        docId: "doc-a1",
        title: "Fox Doc",
        published: "2024-01-01",
      },
      `/tmp/${nsA}-a1.json`,
      true
    );
    expect(result.vectorized).toBe(true);
    expect(await provider.hasNamespace(nsA)).toBe(true);
    const count = await waitForIndexCount(provider, nsA, 1);
    expect(count).toBe(1);
  });

  it("retrieves the nearest chunk via KNN search", async () => {
    const { contextTexts, sources } = await provider.performSimilaritySearch({
      namespace: nsA,
      input: "the quick brown fox jumps over the lazy dog",
      LLMConnector,
      similarityThreshold: 0.1,
      topN: 4,
    });
    expect(contextTexts.length).toBeGreaterThan(0);
    expect(contextTexts[0]).toContain("quick brown fox");
    expect(sources.length).toBeGreaterThan(0);
  });

  it("excludes pinned sources via filterIdentifiers", async () => {
    const { sourceIdentifier } = require("../../../../utils/chats");
    const pinnedId = sourceIdentifier({
      title: "Fox Doc",
      published: "2024-01-01",
    });
    const { contextTexts } = await provider.performSimilaritySearch({
      namespace: nsA,
      input: "the quick brown fox jumps over the lazy dog",
      LLMConnector,
      similarityThreshold: 0.1,
      topN: 4,
      filterIdentifiers: [pinnedId],
    });
    expect(contextTexts).toEqual([]);
  });

  it("deletes a document's vectors from the namespace", async () => {
    await provider.addDocumentToNamespace(
      nsA,
      {
        pageContent: "a second distinct document about databases",
        docId: "doc-a2",
        title: "DB Doc",
        published: "2024-02-02",
      },
      `/tmp/${nsA}-a2.json`,
      true
    );
    await waitForIndexCount(provider, nsA, 2);

    await provider.deleteDocumentFromNamespace(nsA, "doc-a2");
    const count = await waitForIndexCount(provider, nsA, 1);
    expect(count).toBe(1);
  });

  it("reports namespace operations correctly", async () => {
    expect(
      await provider.namespaceExists((await provider.connect()).client, nsA)
    ).toBe(true);
    const stats = await provider["namespace-stats"]({ namespace: nsA });
    expect(stats.name).toBe(nsA);
    expect(stats.vectorCount).toBeGreaterThanOrEqual(1);
  });

  it("sums totalVectors across two namespaces", async () => {
    await provider.addDocumentToNamespace(
      nsB,
      {
        pageContent: "content that lives in a different namespace entirely",
        docId: "doc-b1",
        title: "B Doc",
        published: "2024-03-03",
      },
      `/tmp/${nsB}-b1.json`,
      true
    );
    await waitForIndexCount(provider, nsB, 1);
    const total = await provider.totalVectors();
    expect(total).toBeGreaterThanOrEqual(2);
  });

  it("delete-namespace removes both the index and all chunk keys", async () => {
    const result = await provider["delete-namespace"]({ namespace: nsB });
    expect(result.message).toContain("deleted");

    const { client } = await provider.connect();
    const orphanKeys = await provider._scanKeys(
      client,
      `${provider.keyPrefix(nsB)}*`
    );
    expect(orphanKeys).toEqual([]);
    expect(await provider.hasNamespace(nsB)).toBe(false);
  });

  it("reset clears every managed index and key", async () => {
    await provider.reset();
    const { client } = await provider.connect();
    const remainingKeys = await provider._scanKeys(client, "allm:*");
    expect(remainingKeys).toEqual([]);

    const list = await client.customCommand(["FT._LIST"]);
    const ourIndexes = (Array.isArray(list) ? list : [])
      .map((i) => (Buffer.isBuffer(i) ? i.toString("utf-8") : `${i}`))
      .filter((i) => i.startsWith("allm_idx_"));
    expect(ourIndexes).toEqual([]);
  });
});
