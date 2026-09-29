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
 *   WEAVIATE_TEST_ALLOW_DROP=true                          allow dropping collections
 *                                                          that already exist on the server
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
const mockSystemSettings = new Map();
jest.mock("../../../../models/systemSettings", () => ({
  SystemSettings: {
    get: jest.fn(async ({ label }) =>
      mockSystemSettings.has(label)
        ? { label, value: mockSystemSettings.get(label) }
        : null
    ),
    _updateSettings: jest.fn(async (updates) => {
      for (const [k, v] of Object.entries(updates))
        mockSystemSettings.set(k, v);
    }),
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

const { Weaviate } = require("../../../../utils/vectorDbProviders/weaviate");
const { version: APP_VERSION } = require("../../../../package.json");

jest.setTimeout(120_000);
// These tests act as the server process, which moves data between layouts.
Weaviate.enableLayoutMoves();
Weaviate.clientCloseGraceMs = 0;

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

// Refuse to wipe a server that holds data these tests did not create, unless
// WEAVIATE_TEST_ALLOW_DROP=true (run-integration.sh sets it for its own containers).
async function dropAllCollections(baseUrl, apiKey) {
  const { classes = [] } = await rest(
    baseUrl,
    "GET",
    "/v1/schema",
    null,
    apiKey
  );
  if (classes.length > 0 && process.env.WEAVIATE_TEST_ALLOW_DROP !== "true")
    throw new Error(
      `Refusing to drop ${classes.length} existing collection(s) on ${baseUrl}. ` +
        "Use an empty, disposable Weaviate or set WEAVIATE_TEST_ALLOW_DROP=true."
    );
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
      expect(mockDocumentVectors.rows.map((r) => r.vectorId)).toContain(
        search.sources[0].id
      );

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
      expect(
        await w.deleteDocumentFromNamespace("lifecycle ws", "fruits")
      ).toBe(true);
      expect(await w.namespaceCount("lifecycle ws")).toBe(chunkCount);
      expect(
        mockDocumentVectors.rows.every((r) => r.docId === "fruits-copy")
      ).toBe(true);

      const stats = await w["namespace-stats"]({ namespace: "lifecycle ws" });
      expect(stats).toEqual(
        expect.objectContaining({
          name: "LifecycleWs",
          vectorCount: chunkCount,
        })
      );

      expect(
        await w["delete-namespace"]({ namespace: "lifecycle ws" })
      ).toEqual({
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
        await w.addDocumentToNamespace(
          "big ws",
          fruitDoc({ docId: "big" }),
          "big.json"
        )
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

    describe("vector compression (WEAVIATE_QUANTIZATION)", () => {
      const OPTIONS = [
        ["rq-8", "rq", { bits: 8 }, [1, 32, 0]],
        ["rq-1", "rq", { bits: 1 }, [1, 33, 0]],
        ["bq", "bq", {}, [1, 29, 0]],
        ["sq", "sq", {}, [1, 29, 0]],
        ["pq", "pq", {}, [1, 29, 0]],
      ];
      const atLeast = (version, [ma, mi, pa]) => {
        const [a, b, c] = version.split(".").map(Number);
        return a !== ma ? a > ma : b !== mi ? b > mi : c >= pa;
      };

      afterEach(() => {
        delete process.env.WEAVIATE_QUANTIZATION;
      });

      it.each(OPTIONS)(
        "%s: compresses new collections on supported servers, refuses on older ones",
        async (value, key, extra, minVersion) => {
          process.env.WEAVIATE_QUANTIZATION = value;
          const w = new Weaviate();
          const namespace = `quant ${value}`;
          const collection = `Quant${value.replace("-", "")}`.replace(
            /^(Quant)(.)/,
            (_, a, b) => a + b.toUpperCase()
          );
          const result = await w.addDocumentToNamespace(namespace, fruitDoc());

          if (!atLeast(serverVersion, minVersion)) {
            expect(result.vectorized).toBe(false);
            expect(result.error).toMatch(/requires Weaviate/);
            expect(await w.hasNamespace(namespace)).toBe(false);
            return;
          }

          expect(result).toEqual({ vectorized: true, error: null });
          const schema = await rest(
            TEST_URL,
            "GET",
            `/v1/schema/${collection}`
          );
          expect(schema.vectorIndexConfig[key]).toEqual(
            expect.objectContaining({ enabled: true, ...extra })
          );
          const search = await w.performSimilaritySearch({
            namespace,
            input: "bananas tropical plantations",
            LLMConnector: mockEmbedder,
            similarityThreshold: 0,
            topN: 1,
          });
          expect(search.contextTexts[0]).toMatch(/Bananas/);
          await w["delete-namespace"]({ namespace });
        }
      );
    });

    it("connects with the explicit custom options, headers, timeouts and skipInitChecks", async () => {
      const saved = { ...process.env };
      const proxyUrl = new URL(proxy.url);
      const grpcUrl = new URL(TEST_GRPC_URL);
      try {
        delete process.env.WEAVIATE_ENDPOINT;
        delete process.env.WEAVIATE_GRPC_ENDPOINT;
        Object.assign(process.env, {
          WEAVIATE_DEPLOYMENT: "custom",
          WEAVIATE_HTTP_HOST: proxyUrl.hostname,
          WEAVIATE_HTTP_PORT: proxyUrl.port,
          WEAVIATE_HTTP_SECURE: "false",
          WEAVIATE_GRPC_HOST: grpcUrl.hostname,
          WEAVIATE_GRPC_PORT: grpcUrl.port,
          WEAVIATE_GRPC_SECURE: "false",
          WEAVIATE_AUTH_METHOD: "none",
          WEAVIATE_HEADERS: '{"X-AnythingLLM-Test": "explicit-options"}',
          WEAVIATE_TIMEOUT_QUERY: "20",
          WEAVIATE_TIMEOUT_INSERT: "60",
          WEAVIATE_TIMEOUT_INIT: "5",
        });
        const w = new Weaviate();
        expect(
          await w.addDocumentToNamespace("explicit options", fruitDoc())
        ).toEqual({ vectorized: true, error: null });
        const search = await w.performSimilaritySearch({
          namespace: "explicit options",
          input: "bananas",
          LLMConnector: mockEmbedder,
          similarityThreshold: 0,
          topN: 1,
        });
        expect(search.contextTexts[0]).toMatch(/Bananas/);
        const tagged = proxy.requests.filter(
          (r) => r.headers["x-anythingllm-test"] === "explicit-options"
        );
        expect(tagged.length).toBeGreaterThan(0);

        process.env.WEAVIATE_SKIP_INIT_CHECKS = "true";
        expect(await w.namespaceCount("explicit options")).toBeGreaterThan(0);
        await w["delete-namespace"]({ namespace: "explicit options" });
      } finally {
        process.env = saved;
      }
    });

    describe("hybrid search", () => {
      const saved = {};
      const KEYS = [
        "WEAVIATE_SEARCH_MODE",
        "WEAVIATE_HYBRID_ALPHA",
        "WEAVIATE_HYBRID_FUSION",
        "WEAVIATE_MULTI_TENANCY",
      ];
      beforeEach(() => KEYS.forEach((k) => (saved[k] = process.env[k])));
      afterEach(async () => {
        KEYS.forEach((k) =>
          saved[k] === undefined
            ? delete process.env[k]
            : (process.env[k] = saved[k])
        );
        jest.restoreAllMocks();
        await dropAllCollections(TEST_URL);
      });

      async function seed(namespace) {
        const w = new Weaviate();
        await w.addDocumentToNamespace(
          namespace,
          fruitDoc({
            docId: "part",
            pageContent: "Order part XJ9000 for the left bracket.",
          })
        );
        for (let i = 0; i < 5; i++)
          await w.addDocumentToNamespace(
            namespace,
            fruitDoc({
              docId: `filler-${i}`,
              pageContent: `Order notes number ${i} for the right bracket.`,
            })
          );
        return w;
      }
      const search = (w, namespace, extra = {}) =>
        w.performSimilaritySearch({
          namespace,
          input: "XJ9000",
          LLMConnector: mockEmbedder,
          similarityThreshold: 0,
          topN: 3,
          ...extra,
        });

      it("finds an exact term by keyword that vector search cannot rank", async () => {
        const w = await seed("hybrid terms");
        const vector = await search(w, "hybrid terms");
        process.env.WEAVIATE_SEARCH_MODE = "hybrid";
        process.env.WEAVIATE_HYBRID_ALPHA = "0";
        const keyword = await search(w, "hybrid terms");
        expect(keyword.contextTexts[0]).toMatch(/XJ9000/);
        expect(keyword.sources[0].score).toBeCloseTo(1, 5);
        // The toy embedder has never seen "xj9000", so pure vector search does
        // not single it out.
        expect(vector.sources[0].score).toBeLessThan(0.99);
      });

      it.each([["relativeScore"], ["ranked"]])(
        "runs with %s fusion and a mid alpha",
        async (fusion) => {
          const w = await seed("hybrid fusion");
          process.env.WEAVIATE_SEARCH_MODE = "hybrid";
          process.env.WEAVIATE_HYBRID_ALPHA = "0.5";
          process.env.WEAVIATE_HYBRID_FUSION = fusion;
          const result = await search(w, "hybrid fusion");
          expect(result.contextTexts[0]).toMatch(/XJ9000/);
          expect(result.sources.length).toBeGreaterThan(1);
        }
      );

      it("ignores the similarity threshold, so exact keyword matches survive", async () => {
        const w = await seed("hybrid threshold");
        process.env.WEAVIATE_SEARCH_MODE = "hybrid";
        process.env.WEAVIATE_HYBRID_ALPHA = "0.5";
        const result = await search(w, "hybrid threshold", {
          similarityThreshold: 1,
        });
        expect(result.contextTexts[0]).toMatch(/XJ9000/);
        expect(result.contextTexts).toHaveLength(3); // topN
      });

      it("uses the workspace's own mode and alpha over the app setting", async () => {
        const w = await seed("hybrid workspace");
        process.env.WEAVIATE_SEARCH_MODE = "vector";
        jest
          .spyOn(Weaviate.prototype, "workspaceSearchPreference")
          .mockResolvedValue({
            vectorSearchMode: "hybrid",
            vectorSearchAlpha: 0,
          });
        const result = await search(w, "hybrid workspace");
        expect(result.contextTexts[0]).toMatch(/XJ9000/);
        expect(result.sources[0].score).toBeCloseTo(1, 5);
      });

      it("works inside a tenant", async () => {
        process.env.WEAVIATE_MULTI_TENANCY = "true";
        process.env.WEAVIATE_SEARCH_MODE = "hybrid";
        process.env.WEAVIATE_HYBRID_ALPHA = "0";
        const w = await seed("hybrid-tenant");
        const result = await search(w, "hybrid-tenant");
        expect(result.contextTexts[0]).toMatch(/XJ9000/);
      });
    });

    describe("multi-tenancy (WEAVIATE_MULTI_TENANCY)", () => {
      beforeEach(async () => {
        mockSystemSettings.clear();
        await Weaviate.disconnect();
      });
      afterEach(async () => {
        delete process.env.WEAVIATE_MULTI_TENANCY;
        delete process.env.WEAVIATE_COLLECTION;
        await dropAllCollections(TEST_URL);
      });

      it("never moves a same-named collection another app created", async () => {
        await rest(TEST_URL, "POST", "/v1/schema", {
          class: "Documents",
          description: "Another app's data",
          vectorizer: "none",
        });
        await rest(TEST_URL, "POST", "/v1/objects", {
          class: "Documents",
          properties: { text: "not ours" },
          vector: embed("not ours"),
        });
        process.env.WEAVIATE_MULTI_TENANCY = "true";
        expect(await new Weaviate().hasNamespace("documents")).toBe(false);
        const { objects } = await rest(
          TEST_URL,
          "GET",
          "/v1/objects?class=Documents&limit=10"
        );
        expect(objects).toHaveLength(1);
      });

      it("explains when the shared collection name is a regular collection", async () => {
        await rest(TEST_URL, "POST", "/v1/schema", {
          class: "PlainShared",
          description: "Class created by AnythingLLM named PlainShared",
          vectorizer: "none",
        });
        process.env.WEAVIATE_MULTI_TENANCY = "true";
        process.env.WEAVIATE_COLLECTION = "PlainShared";
        const result = await new Weaviate().addDocumentToNamespace(
          "someone",
          fruitDoc()
        );
        expect(result.vectorized).toBe(false);
        expect(result.error).toMatch(
          "Collection PlainShared already exists and is not multi-tenant"
        );
      });

      it("stores workspaces as isolated tenants of one collection", async () => {
        process.env.WEAVIATE_MULTI_TENANCY = "true";
        process.env.WEAVIATE_COLLECTION = "ItShared";
        const w = new Weaviate();
        await w.addDocumentToNamespace(
          "alpha",
          fruitDoc({
            docId: "a",
            pageContent: "Alpha keeps notes about zebras and stripes.",
          })
        );
        await w.addDocumentToNamespace(
          "beta",
          fruitDoc({
            docId: "b",
            pageContent: "Beta keeps notes about volcanoes and lava.",
          })
        );

        const schema = await rest(TEST_URL, "GET", "/v1/schema/ItShared");
        expect(schema.multiTenancyConfig).toEqual(
          expect.objectContaining({
            enabled: true,
            autoTenantCreation: true,
            autoTenantActivation: true,
          })
        );
        const { classes } = await rest(TEST_URL, "GET", "/v1/schema");
        expect(classes.map((c) => c.class)).toEqual(["ItShared"]);
        const tenants = await rest(
          TEST_URL,
          "GET",
          "/v1/schema/ItShared/tenants"
        );
        expect(tenants.map((t) => t.name).sort()).toEqual(["alpha", "beta"]);

        const search = await w.performSimilaritySearch({
          namespace: "beta",
          input: "zebras stripes",
          LLMConnector: mockEmbedder,
          similarityThreshold: 0,
          topN: 10,
        });
        expect(search.contextTexts.join(" ")).not.toMatch(/zebras/);
        expect(await w.totalVectors()).toBe(
          (await w.namespaceCount("alpha")) + (await w.namespaceCount("beta"))
        );

        await w.deleteDocumentFromNamespace("alpha", "a");
        expect(await w.namespaceCount("alpha")).toBe(0);
        await w["delete-namespace"]({ namespace: "alpha" });
        const left = await rest(TEST_URL, "GET", "/v1/schema/ItShared/tenants");
        expect(left.map((t) => t.name)).toEqual(["beta"]);
      });

      it("moves legacy per-workspace data into tenants and back, keeping ids and vectors", async () => {
        // A workspace stored the legacy way (the v1 client's REST shape).
        await rest(TEST_URL, "POST", "/v1/schema", {
          class: "OldSpace",
          description: "Class created by AnythingLLM named OldSpace",
          vectorizer: "none",
        });
        // Well-spread deterministic vectors. (The toy bag-of-words embedder
        // yields only ~17 distinct vectors for 620 near-identical texts, and
        // approximate HNSW search cannot reliably find one point among so many
        // exact duplicates - with or without a migration.)
        const chunkText = (i) => `legacy chunk ${i}`;
        const vectorFor = (i) => {
          let seed = i + 1;
          return Array.from({ length: 16 }, () => {
            seed = (seed * 1103515245 + 12345) % 2147483648;
            return seed / 2147483648 - 0.5;
          });
        };
        const uniqueVector = vectorFor(417);
        const ids = Array.from(
          { length: 620 },
          (_, i) => `00000000-0000-4000-8000-${String(i).padStart(12, "0")}`
        );
        for (let i = 0; i < ids.length; i += 200)
          await rest(TEST_URL, "POST", "/v1/batch/objects", {
            objects: ids.slice(i, i + 200).map((id, j) => ({
              class: "OldSpace",
              id,
              vector: vectorFor(i + j),
              properties: { text: chunkText(i + j), wordCount: 3 },
            })),
          });
        const vectorOf = async (path) =>
          (await rest(TEST_URL, "GET", `${path}?include=vector`)).vector;
        const before = await vectorOf(`/v1/objects/OldSpace/${ids[417]}`);

        process.env.WEAVIATE_MULTI_TENANCY = "true";
        const w = new Weaviate();
        expect(await w.hasNamespace("old-space")).toBe(true);
        let { classes } = await rest(TEST_URL, "GET", "/v1/schema");
        expect(classes.map((c) => c.class)).toEqual(["AnythingLLM"]);
        expect(await w.namespaceCount("old-space")).toBe(620);
        const inTenant = await rest(
          TEST_URL,
          "GET",
          `/v1/objects/AnythingLLM/${ids[417]}?include=vector&tenant=old-space`
        );
        expect(inTenant.vector).toEqual(before);
        expect(inTenant.properties).toEqual({
          text: "legacy chunk 417",
          wordCount: 3,
        });
        const search = await w.performSimilaritySearch({
          namespace: "old-space",
          input: "chunk 417",
          LLMConnector: { embedTextInput: async () => uniqueVector },
          similarityThreshold: 0,
          topN: 1,
        });
        expect(search.sources[0].id).toBe(ids[417]);

        // Switch back: the data returns to its own collection.
        process.env.WEAVIATE_MULTI_TENANCY = "false";
        expect(await w.hasNamespace("old-space")).toBe(true);
        expect(await w.namespaceCount("old-space")).toBe(620);
        expect(await vectorOf(`/v1/objects/OldSpace/${ids[417]}`)).toEqual(
          before
        );
        const tenants = await rest(
          TEST_URL,
          "GET",
          "/v1/schema/AnythingLLM/tenants"
        );
        expect(tenants).toEqual([]);
      });
    });

    it("never calls GraphQL and always sends the integration header", () => {
      expect(proxy.requests.length).toBeGreaterThan(10);
      // Runs last, so the traffic covers the multi-tenancy tests too.
      expect(proxy.requests.some((r) => r.path.includes("/tenants"))).toBe(
        true
      );
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
