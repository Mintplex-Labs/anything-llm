/* eslint-env jest */
/**
 * Integration tests for the Weaviate provider against a real Weaviate server.
 * Skipped unless WEAVIATE_TEST_URL is set. Run all of them with
 * `./run-integration.sh` in this folder, which starts the servers from
 * docker-compose.yml for each supported Weaviate version.
 *
 * Env:
 *   WEAVIATE_TEST_URL / WEAVIATE_TEST_GRPC_URL             anonymous server
 *   WEAVIATE_TEST_AUTH_URL / WEAVIATE_TEST_AUTH_GRPC_URL   API-key server (optional)
 *   WEAVIATE_TEST_API_KEY                                  key for the API-key server
 *   WEAVIATE_TEST_EXPECT_UNSUPPORTED=true                  the server is older than
 *                                                          the minimum; only the
 *                                                          version gate is tested
 *
 * All REST traffic goes through a local recording proxy, so the tests can
 * assert that no GraphQL request is ever made and that every request carries
 * the integration header. gRPC traffic goes straight to the server.
 */
const http = require("node:http");

const TEST_URL = process.env.WEAVIATE_TEST_URL;
const TEST_GRPC_URL = process.env.WEAVIATE_TEST_GRPC_URL;
const AUTH_URL = process.env.WEAVIATE_TEST_AUTH_URL;
const AUTH_GRPC_URL = process.env.WEAVIATE_TEST_AUTH_GRPC_URL;
const API_KEY = process.env.WEAVIATE_TEST_API_KEY;
const EXPECT_UNSUPPORTED =
  process.env.WEAVIATE_TEST_EXPECT_UNSUPPORTED === "true";

const describeIf = (condition) => (condition ? describe : describe.skip);

// ---- Model mocks: no database, cache or embedding model needed ----
const mockDocumentVectors = {
  rows: [],
  bulkInsert: jest.fn(async (records = []) => {
    for (const r of records)
      mockDocumentVectors.rows.push({
        id: mockDocumentVectors.rows.length + 1,
        ...r,
      });
  }),
  where: jest.fn(async ({ docId }) =>
    mockDocumentVectors.rows.filter((r) => r.docId === docId)
  ),
  deleteIds: jest.fn(async (ids = []) => {
    mockDocumentVectors.rows = mockDocumentVectors.rows.filter(
      (r) => !ids.includes(r.id)
    );
  }),
};
jest.mock("../../../../models/vectors", () => ({
  DocumentVectors: mockDocumentVectors,
}));
jest.mock("../../../../models/systemSettings", () => ({
  SystemSettings: {
    getValueOrFallback: jest.fn(async ({ label }, fallback = null) =>
      label === "text_splitter_chunk_size"
        ? 80
        : label === "text_splitter_chunk_overlap"
          ? 0
          : fallback
    ),
  },
}));
const mockVectorCache = new Map();
jest.mock("../../../../utils/files", () => ({
  cachedVectorInformation: jest.fn(async (filename) =>
    mockVectorCache.has(filename)
      ? { exists: true, chunks: mockVectorCache.get(filename) }
      : { exists: false, chunks: [] }
  ),
  storeVectorResult: jest.fn(async (chunks, filename) => {
    if (filename) mockVectorCache.set(filename, chunks);
  }),
}));
// Deterministic bag-of-words "embedder" (16 dims).
const embed = (text) => {
  const vector = new Array(16).fill(0.001);
  for (const word of String(text).toLowerCase().split(/\W+/).filter(Boolean))
    vector[[...word].reduce((a, c) => a + c.charCodeAt(0), 0) % 16] += 1;
  return vector;
};
const mockEmbedder = {
  embeddingMaxChunkLength: 1000,
  embedChunks: jest.fn(async (chunks) => chunks.map(embed)),
  embedTextInput: jest.fn(async (text) => embed(text)),
};
jest.mock("../../../../utils/helpers", () => ({
  ...jest.requireActual("../../../../utils/helpers"),
  getEmbeddingEngineSelection: () => mockEmbedder,
}));

const {
  Weaviate,
} = require("../../../../utils/vectorDbProviders/weaviate");
const { version: APP_VERSION } = require("../../../../package.json");

jest.setTimeout(120_000);

// ---- Recording reverse proxy for the REST port ----
function startRecordingProxy(target) {
  const upstream = new URL(target);
  const requests = [];
  const server = http.createServer((req, res) => {
    requests.push({ method: req.method, path: req.url, headers: req.headers });
    const proxied = http.request(
      {
        host: upstream.hostname,
        port: upstream.port,
        method: req.method,
        path: req.url,
        headers: { ...req.headers, host: upstream.host },
      },
      (upstreamRes) => {
        res.writeHead(upstreamRes.statusCode, upstreamRes.headers);
        upstreamRes.pipe(res);
      }
    );
    proxied.on("error", (e) => {
      res.writeHead(502);
      res.end(e.message);
    });
    req.pipe(proxied);
  });
  return new Promise((resolve) =>
    server.listen(0, "127.0.0.1", () =>
      resolve({
        url: `http://127.0.0.1:${server.address().port}`,
        requests,
        close: () => new Promise((r) => server.close(r)),
      })
    )
  );
}

// ---- Raw REST helpers: seed data the way the legacy client stored it ----
async function rest(baseUrl, method, path, body, apiKey) {
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      "content-type": "application/json",
      ...(apiKey ? { authorization: `Bearer ${apiKey}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status} ${text}`);
  return text ? JSON.parse(text) : null;
}

async function dropAllCollections(baseUrl, apiKey) {
  const { classes = [] } = await rest(baseUrl, "GET", "/v1/schema", null, apiKey);
  for (const { class: name } of classes)
    await rest(baseUrl, "DELETE", `/v1/schema/${name}`, null, apiKey);
}

function useServer({ url, grpcUrl, apiKey }) {
  process.env.VECTOR_DB = "weaviate";
  process.env.WEAVIATE_ENDPOINT = url;
  if (grpcUrl) process.env.WEAVIATE_GRPC_ENDPOINT = grpcUrl;
  else delete process.env.WEAVIATE_GRPC_ENDPOINT;
  if (apiKey) process.env.WEAVIATE_API_KEY = apiKey;
  else delete process.env.WEAVIATE_API_KEY;
}

const fruitDoc = (overrides = {}) => ({
  docId: "fruits",
  id: "must-not-be-stored",
  url: "file://fruits.txt",
  title: "fruits.txt",
  docAuthor: "tester",
  description: "a fruit file",
  docSource: "integration-test",
  chunkSource: "",
  published: "9/28/2026, 10:00:00 AM",
  wordCount: 40,
  token_count_estimate: 60,
  pageContent:
    "Apples grow in orchards and are crunchy. Bananas grow in tropical plantations and are soft. " +
    "Cherries are small red stone fruits. Durians smell strong but taste sweet. " +
    "Elderberries are dark purple and used in syrups.",
  ...overrides,
});

afterAll(() => Weaviate.disconnect());

describeIf(TEST_URL && EXPECT_UNSUPPORTED)(
  "Weaviate provider on an unsupported server",
  () => {
    it("refuses to connect and asks for an upgrade", async () => {
      useServer({ url: TEST_URL, grpcUrl: TEST_GRPC_URL });
      await Weaviate.disconnect();
      await expect(new Weaviate().connect()).rejects.toThrow(
        /AnythingLLM requires Weaviate 1\.29\.0 or later - please upgrade/
      );
      const result = await new Weaviate().addDocumentToNamespace(
        "ws",
        fruitDoc()
      );
      expect(result.vectorized).toBe(false);
    });
  }
);

describeIf(TEST_URL && !EXPECT_UNSUPPORTED)(
  "Weaviate provider against a real server",
  () => {
    let proxy;
    let serverVersion;

    beforeAll(async () => {
      await dropAllCollections(TEST_URL);
      proxy = await startRecordingProxy(TEST_URL);
      useServer({ url: proxy.url, grpcUrl: TEST_GRPC_URL });
      await Weaviate.disconnect();
      ({ version: serverVersion } = await rest(TEST_URL, "GET", "/v1/meta"));
    });

    afterAll(async () => {
      await Weaviate.disconnect();
      await proxy?.close();
      await dropAllCollections(TEST_URL);
    });

    beforeEach(() => {
      mockDocumentVectors.rows = [];
      mockVectorCache.clear();
      jest.clearAllMocks();
    });

    it("connects and reports a heartbeat", async () => {
      const { client } = await new Weaviate().connect();
      expect((await client.getWeaviateVersion()).show()).toBe(serverVersion);
      expect(await new Weaviate().heartbeat()).toEqual({
        heartbeat: expect.any(Number),
      });
    });

    it("runs the full document lifecycle", async () => {
      const w = new Weaviate();
      expect(await w.hasNamespace("lifecycle ws")).toBe(false);

      const added = await w.addDocumentToNamespace(
        "lifecycle ws",
        fruitDoc(),
        "fruits.json"
      );
      expect(added).toEqual({ vectorized: true, error: null });
      const chunkCount = mockDocumentVectors.rows.length;
      expect(chunkCount).toBeGreaterThan(2);

      // The collection was created exactly as the legacy client created it.
      const schema = await rest(TEST_URL, "GET", "/v1/schema/LifecycleWs");
      expect(schema.class).toBe("LifecycleWs");
      expect(schema.vectorizer).toBe("none");
      expect(schema.description).toBe(
        "Class created by AnythingLLM named LifecycleWs"
      );
      expect(schema.vectorConfig ?? {}).toEqual({});
      const propNames = schema.properties.map((p) => p.name).sort();
      expect(propNames).toEqual(
        expect.arrayContaining(["text", "title", "wordCount", "published"])
      );
      expect(propNames).not.toContain("id");
      expect(propNames).not.toContain("docId");

      expect(await w.hasNamespace("lifecycle ws")).toBe(true);
      expect(await w.namespaceCount("lifecycle ws")).toBe(chunkCount);
      expect(await w.totalVectors()).toBe(chunkCount);

      const search = await w.performSimilaritySearch({
        namespace: "lifecycle ws",
        input: "bananas tropical plantations",
        LLMConnector: mockEmbedder,
        similarityThreshold: 0,
        topN: 2,
      });
      expect(search.message).toBe(false);
      expect(search.contextTexts).toHaveLength(2);
      expect(search.contextTexts[0]).toMatch(/Bananas/);
      expect(search.sources[0]).toEqual(
        expect.objectContaining({
          id: expect.stringMatching(/^[0-9a-f-]{36}$/),
          score: expect.any(Number),
          title: "fruits.txt",
          docSource: "integration-test",
          wordCount: 40,
          text: search.contextTexts[0],
        })
      );
      expect(search.sources[0].score).toBeGreaterThanOrEqual(
        search.sources[1].score
      );
      expect(
        mockDocumentVectors.rows.map((r) => r.vectorId)
      ).toContain(search.sources[0].id);

      // Threshold of 1 filters everything that is not an exact match.
      const strict = await w.performSimilaritySearch({
        namespace: "lifecycle ws",
        input: "zzz qqq",
        LLMConnector: mockEmbedder,
        similarityThreshold: 0.999,
      });
      expect(strict.contextTexts).toEqual([]);

      // Pinned documents are filtered out.
      const pinned = await w.performSimilaritySearch({
        namespace: "lifecycle ws",
        input: "bananas",
        LLMConnector: mockEmbedder,
        similarityThreshold: 0,
        filterIdentifiers: [
          "title:fruits.txt-timestamp:9/28/2026, 10:00:00 AM",
        ],
      });
      expect(pinned.contextTexts).toEqual([]);

      // Re-adding from the vector cache stores each chunk once, with new ids.
      const recached = await w.addDocumentToNamespace(
        "lifecycle ws",
        fruitDoc({ docId: "fruits-copy" }),
        "fruits.json"
      );
      expect(recached).toEqual({ vectorized: true, error: null });
      expect(mockEmbedder.embedChunks).toHaveBeenCalledTimes(1);
      expect(await w.namespaceCount("lifecycle ws")).toBe(chunkCount * 2);

      // Deleting one document leaves the other untouched.
      expect(await w.deleteDocumentFromNamespace("lifecycle ws", "fruits")).toBe(
        true
      );
      expect(await w.namespaceCount("lifecycle ws")).toBe(chunkCount);
      expect(mockDocumentVectors.rows.every((r) => r.docId === "fruits-copy")).toBe(
        true
      );

      const stats = await w["namespace-stats"]({ namespace: "lifecycle ws" });
      expect(stats).toEqual(
        expect.objectContaining({ name: "LifecycleWs", vectorCount: chunkCount })
      );

      expect(await w["delete-namespace"]({ namespace: "lifecycle ws" })).toEqual({
        message: `Namespace LifecycleWs was deleted along with ${chunkCount} vectors.`,
      });
      expect(await w.hasNamespace("lifecycle ws")).toBe(false);
    });

    it("inserts and deletes more than one batch (1,234 chunks)", async () => {
      const w = new Weaviate();
      const cached = Array.from({ length: 1234 }, (_, i) => ({
        id: `cached-${i}`,
        class: "Whatever",
        vector: embed(`chunk number ${i}`),
        properties: { text: `chunk number ${i}`, title: "big.txt" },
      }));
      mockVectorCache.set("big.json", [
        cached.slice(0, 500),
        cached.slice(500, 1000),
        cached.slice(1000),
      ]);
      expect(
        await w.addDocumentToNamespace("big ws", fruitDoc({ docId: "big" }), "big.json")
      ).toEqual({ vectorized: true, error: null });
      expect(await w.namespaceCount("big ws")).toBe(1234);

      expect(await w.deleteDocumentFromNamespace("big ws", "big")).toBe(true);
      expect(await w.namespaceCount("big ws")).toBe(0);
    });

    it("reads, extends and deletes data written by the legacy client", async () => {
      // Seed exactly what weaviate-ts-client 1.x produced: a class with
      // vectorizer "none" and REST batch objects with an unnamed vector.
      await rest(TEST_URL, "POST", "/v1/schema", {
        class: "LegacyWorkspace",
        description: "Class created by AnythingLLM named LegacyWorkspace",
        vectorizer: "none",
      });
      const legacyTexts = [
        "Legacy apples orchard notes",
        "Legacy bananas plantation notes",
        "Legacy cherries stone fruit notes",
      ];
      const legacyIds = [
        "0f5b6c1e-0000-4000-8000-000000000001",
        "0f5b6c1e-0000-4000-8000-000000000002",
        "0f5b6c1e-0000-4000-8000-000000000003",
      ];
      const batch = await rest(TEST_URL, "POST", "/v1/batch/objects", {
        objects: legacyTexts.map((text, i) => ({
          class: "LegacyWorkspace",
          id: legacyIds[i],
          vector: embed(text),
          properties: {
            text,
            url: "file://legacy.txt",
            title: "legacy.txt",
            docAuthor: "old",
            description: "seeded by the legacy client",
            docSource: "legacy",
            chunkSource: "",
            published: "1/1/2024, 9:00:00 AM",
            wordCount: 12,
            token_count_estimate: 20,
          },
        })),
      });
      expect(batch.every((r) => !r.result?.errors)).toBe(true);
      await mockDocumentVectors.bulkInsert(
        legacyIds.map((vectorId) => ({ docId: "legacy", vectorId }))
      );

      const w = new Weaviate();
      expect(await w.hasNamespace("legacy workspace")).toBe(true);
      expect(await w.namespaceCount("legacy workspace")).toBe(3);

      const search = await w.performSimilaritySearch({
        namespace: "legacy workspace",
        input: "bananas plantation",
        LLMConnector: mockEmbedder,
        similarityThreshold: 0,
        topN: 1,
      });
      expect(search.contextTexts).toEqual(["Legacy bananas plantation notes"]);
      expect(search.sources[0]).toEqual(
        expect.objectContaining({
          id: legacyIds[1],
          title: "legacy.txt",
          wordCount: 12,
          docSource: "legacy",
        })
      );

      // New documents go into the old collection without schema conflicts.
      expect(
        await w.addDocumentToNamespace("legacy workspace", fruitDoc())
      ).toEqual({ vectorized: true, error: null });
      const newChunks = mockDocumentVectors.rows.filter(
        (r) => r.docId === "fruits"
      ).length;
      expect(await w.namespaceCount("legacy workspace")).toBe(3 + newChunks);
      const mixed = await w.performSimilaritySearch({
        namespace: "legacy workspace",
        input: "apples orchard",
        LLMConnector: mockEmbedder,
        similarityThreshold: 0,
        topN: 10,
      });
      expect(mixed.sources.map((s) => s.docSource)).toEqual(
        expect.arrayContaining(["legacy", "integration-test"])
      );

      // Legacy vectors are deleted through the tracking rows, new ones stay.
      expect(
        await w.deleteDocumentFromNamespace("legacy workspace", "legacy")
      ).toBe(true);
      expect(await w.namespaceCount("legacy workspace")).toBe(newChunks);
      for (const id of legacyIds) {
        const res = await fetch(`${TEST_URL}/v1/objects/LegacyWorkspace/${id}`);
        expect(res.status).toBe(404);
      }
    });

    it("reset removes every collection", async () => {
      const w = new Weaviate();
      await w.addDocumentToNamespace("reset one", fruitDoc());
      await w.addDocumentToNamespace("reset two", fruitDoc());
      expect(await w.reset()).toEqual({ reset: true });
      const { classes } = await rest(TEST_URL, "GET", "/v1/schema");
      expect(classes).toEqual([]);
      expect(await w.totalVectors()).toBe(0);
    });

    it("never calls GraphQL and always sends the integration header", () => {
      expect(proxy.requests.length).toBeGreaterThan(10);
      const graphql = proxy.requests.filter((r) =>
        r.path.startsWith("/v1/graphql")
      );
      expect(graphql).toEqual([]);
      for (const r of proxy.requests)
        expect(r.headers["x-weaviate-client-integration"]).toBe(
          `anything-llm/${APP_VERSION}`
        );
    });
  }
);

describeIf(TEST_URL && AUTH_URL && API_KEY && !EXPECT_UNSUPPORTED)(
  "Weaviate provider against an API-key protected server",
  () => {
    afterEach(() => Weaviate.disconnect());
    afterAll(() => dropAllCollections(AUTH_URL, API_KEY));

    it("works with the right API key", async () => {
      useServer({ url: AUTH_URL, grpcUrl: AUTH_GRPC_URL, apiKey: API_KEY });
      const w = new Weaviate();
      expect(await w.addDocumentToNamespace("auth ws", fruitDoc())).toEqual({
        vectorized: true,
        error: null,
      });
      expect(await w.namespaceCount("auth ws")).toBeGreaterThan(0);
      const search = await w.performSimilaritySearch({
        namespace: "auth ws",
        input: "cherries",
        LLMConnector: mockEmbedder,
        similarityThreshold: 0,
      });
      expect(search.contextTexts.length).toBeGreaterThan(0);
    });

    it("fails with a wrong API key", async () => {
      useServer({ url: AUTH_URL, grpcUrl: AUTH_GRPC_URL, apiKey: "wrong-key" });
      await expect(new Weaviate().heartbeat()).rejects.toThrow(
        /Weaviate::Could not connect/
      );
    });

    it("fails without an API key", async () => {
      useServer({ url: AUTH_URL, grpcUrl: AUTH_GRPC_URL });
      await expect(new Weaviate().heartbeat()).rejects.toThrow(
        /Weaviate::Could not connect/
      );
    });
  }
);
