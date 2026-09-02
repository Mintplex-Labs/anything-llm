/**
 * Unit tests for the Valkey vector DB provider.
 * GLIDE (`@valkey/valkey-glide`) and all model/util dependencies are mocked so
 * these tests are fully hermetic and need no running Valkey instance.
 */

// The current mock client - swapped per test. createClient resolves it lazily.
let mockClient = null;

jest.mock("@valkey/valkey-glide", () => ({
  ProtocolVersion: { RESP2: 1, RESP3: 0 },
  GlideClient: {
    createClient: jest.fn(async () => mockClient),
  },
}));

// Real toChunks (small pure helper) + a stubbed embedder selection.
jest.mock("../../../../utils/helpers", () => ({
  toChunks: (arr, size) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (_v, i) =>
      arr.slice(i * size, i * size + size)
    ),
  getEmbeddingEngineSelection: jest.fn(() => ({
    embeddingMaxChunkLength: 1000,
    embeddingPrefix: "",
    embedChunks: jest.fn(async (chunks) => chunks.map(() => [0.1, 0.2, 0.3])),
  })),
}));

jest.mock("../../../../utils/files", () => ({
  storeVectorResult: jest.fn(async () => true),
  cachedVectorInformation: jest.fn(async () => ({ exists: false })),
}));

jest.mock("../../../../models/vectors", () => ({
  DocumentVectors: {
    where: jest.fn(async () => []),
    bulkInsert: jest.fn(async () => true),
    deleteIds: jest.fn(async () => true),
  },
}));

jest.mock("../../../../models/systemSettings", () => ({
  SystemSettings: {
    getValueOrFallback: jest.fn(async () => null),
  },
}));

jest.mock("../../../../utils/chats", () => ({
  sourceIdentifier: (doc) =>
    !doc?.title || !doc?.published
      ? `random-${Math.random()}`
      : `title:${doc.title}-timestamp:${doc.published}`,
}));

const { GlideClient } = require("@valkey/valkey-glide");
const { cachedVectorInformation } = require("../../../../utils/files");
const { DocumentVectors } = require("../../../../models/vectors");
const {
  Valkey: ValkeyClass,
} = require("../../../../utils/vectorDbProviders/valkey");

function makeClient(overrides = {}) {
  return {
    customCommand: jest.fn(async () => []),
    hset: jest.fn(async () => 1),
    del: jest.fn(async () => 1),
    ping: jest.fn(async () => "PONG"),
    close: jest.fn(),
    ...overrides,
  };
}

// Routes a customCommand call to a per-command handler keyed by args[0].
function routeClient(routes = {}, base = {}) {
  return makeClient({
    customCommand: jest.fn(async (args) => {
      const route = routes[args[0]];
      if (route === undefined) return [];
      if (route instanceof Error) throw route;
      if (typeof route === "function") return route(args);
      return route;
    }),
    ...base,
  });
}

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  jest.clearAllMocks();
  process.env.VECTOR_DB = "valkey";
  delete process.env.VALKEY_VECTOR_DB_ENDPOINT;
  delete process.env.VALKEY_VECTOR_DB_HOST;
  delete process.env.VALKEY_VECTOR_DB_PORT;
  delete process.env.VALKEY_VECTOR_DB_USERNAME;
  delete process.env.VALKEY_VECTOR_DB_PASSWORD;
  delete process.env.VALKEY_VECTOR_DB_USE_TLS;
  delete process.env.VALKEY_VECTOR_DB_REQUEST_TIMEOUT;
  mockClient = makeClient();
});

afterEach(async () => {
  // Clear the static cached client between tests.
  await new ValkeyClass().disconnect();
});

afterAll(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe("Valkey provider - metadata + helpers", () => {
  it("name getter returns 'Valkey'", () => {
    expect(new ValkeyClass().name).toBe("Valkey");
  });

  it("connection() parses an endpoint URL (host/port/auth)", () => {
    process.env.VALKEY_VECTOR_DB_ENDPOINT = "redis://user:pass@myhost:6380";
    const config = ValkeyClass.connection();
    expect(config.addresses).toEqual([{ host: "myhost", port: 6380 }]);
    expect(config.credentials).toEqual({ username: "user", password: "pass" });
    expect(config.protocol).toBe(1); // RESP2
  });

  it("connection() falls back to host/port and honors TLS + timeout", () => {
    process.env.VALKEY_VECTOR_DB_HOST = "valkey.internal";
    process.env.VALKEY_VECTOR_DB_PORT = "7000";
    process.env.VALKEY_VECTOR_DB_USE_TLS = "true";
    process.env.VALKEY_VECTOR_DB_REQUEST_TIMEOUT = "9000";
    const config = ValkeyClass.connection();
    expect(config.addresses).toEqual([{ host: "valkey.internal", port: 7000 }]);
    expect(config.useTLS).toBe(true);
    expect(config.requestTimeout).toBe(9000);
    expect(config.credentials).toBeUndefined();
  });

  it("connection() defaults to localhost:6379 + 5000ms timeout", () => {
    const config = ValkeyClass.connection();
    expect(config.addresses).toEqual([{ host: "localhost", port: 6379 }]);
    expect(config.useTLS).toBe(false);
    expect(config.requestTimeout).toBe(5000);
  });

  it("distanceToSimilarity clamps and inverts the distance", () => {
    const provider = new ValkeyClass();
    expect(provider.distanceToSimilarity(0)).toBe(1);
    expect(provider.distanceToSimilarity(0.75)).toBeCloseTo(0.25);
    expect(provider.distanceToSimilarity(1)).toBe(0);
    expect(provider.distanceToSimilarity(1.5)).toBe(0);
    expect(provider.distanceToSimilarity(null)).toBe(0);
  });

  it("normalize/indexName/keyPrefix produce expected strings", () => {
    const provider = new ValkeyClass();
    expect(provider.normalize("my-work space!")).toBe("my_work_space_");
    expect(provider.normalize("123abc")).toBe("allm_123abc");
    expect(provider.indexName("my-ws")).toBe("allm_idx_my_ws");
    // keyPrefix is derived from the SAME normalized token as indexName so the
    // two can never diverge (raw "my-ws" would have produced "allm:my-ws:").
    expect(provider.keyPrefix("my-ws")).toBe("allm:my_ws:");
  });

  it("floatToBuffer yields a 4*dims byte Buffer that round-trips", () => {
    const provider = new ValkeyClass();
    const values = [0.5, -1.25, 3.0];
    const buf = provider.floatToBuffer(values);
    expect(Buffer.isBuffer(buf)).toBe(true);
    expect(buf.length).toBe(4 * values.length);
    const roundTripped = Array.from(
      new Float32Array(buf.buffer, buf.byteOffset, values.length)
    );
    expect(roundTripped).toEqual(values);
  });

  it("curateSources strips vector/_distance/text and unwraps metadata", () => {
    const provider = new ValkeyClass();
    const curated = provider.curateSources([
      {
        metadata: { title: "Doc", text: "hello", vector: [1, 2], _distance: 1 },
      },
      {},
    ]);
    expect(curated).toHaveLength(1);
    expect(curated[0].title).toBe("Doc");
    expect(curated[0].text).toBe("hello");
  });
});

describe("Valkey provider - index + namespace operations", () => {
  it("getOrCreateIndex issues FT.CREATE when the index is absent", async () => {
    const provider = new ValkeyClass();
    const client = routeClient({ "FT.INFO": new Error("Unknown index") });
    await provider.getOrCreateIndex(client, "ws", 3);
    const createCall = client.customCommand.mock.calls.find(
      (c) => c[0][0] === "FT.CREATE"
    );
    expect(createCall).toBeTruthy();
    expect(createCall[0]).toEqual(
      expect.arrayContaining(["HNSW", "TYPE", "FLOAT32", "DIM", "3", "COSINE"])
    );
  });

  it("getOrCreateIndex is a no-op when the index already exists", async () => {
    const provider = new ValkeyClass();
    const client = routeClient({ "FT.INFO": ["num_docs", "1"] });
    await provider.getOrCreateIndex(client, "ws", 3);
    const createCall = client.customCommand.mock.calls.find(
      (c) => c[0][0] === "FT.CREATE"
    );
    expect(createCall).toBeFalsy();
  });

  it("namespaceExists returns true/false based on FT.INFO", async () => {
    const provider = new ValkeyClass();
    const okClient = routeClient({ "FT.INFO": ["num_docs", "2"] });
    const failClient = routeClient({ "FT.INFO": new Error("Unknown index") });
    expect(await provider.namespaceExists(okClient, "ws")).toBe(true);
    expect(await provider.namespaceExists(failClient, "ws")).toBe(false);
  });

  it("namespaceCount + namespace parse num_docs (0 when absent)", async () => {
    mockClient = routeClient({ "FT.INFO": ["num_docs", "7"] });
    const provider = new ValkeyClass();
    expect(await provider.namespaceCount("ws")).toBe(7);
    const ns = await provider.namespace(mockClient, "ws");
    expect(ns).toEqual({ name: "ws", vectorCount: 7 });

    // Clear the statically-cached client so the next scenario binds the new mock.
    await provider.disconnect();
    mockClient = routeClient({ "FT.INFO": new Error("Unknown index") });
    const provider2 = new ValkeyClass();
    expect(await provider2.namespaceCount("missing")).toBe(0);
  });

  it("totalVectors sums num_docs across allm_idx_* indexes only", async () => {
    mockClient = routeClient({
      "FT._LIST": ["allm_idx_a", "allm_idx_b", "some_other_index"],
      "FT.INFO": (args) =>
        args[1] === "allm_idx_a"
          ? ["num_docs", "3"]
          : args[1] === "allm_idx_b"
            ? ["num_docs", "4"]
            : ["num_docs", "100"],
    });
    const provider = new ValkeyClass();
    expect(await provider.totalVectors()).toBe(7);
  });

  it("deleteVectorsInNamespace cleans orphan keys even if FT.DROPINDEX fails", async () => {
    const scanReplies = [
      ["5", ["allm:ws:k1", "allm:ws:k2"]],
      ["0", ["allm:ws:k3"]],
    ];
    let scanIdx = 0;
    mockClient = routeClient({
      "FT.DROPINDEX": new Error("Unknown index"),
      SCAN: () => scanReplies[scanIdx++],
    });
    const provider = new ValkeyClass();
    await provider.deleteVectorsInNamespace(mockClient, "ws");
    expect(mockClient.del).toHaveBeenCalled();
    const deleted = mockClient.del.mock.calls.flatMap((c) => c[0]);
    expect(deleted).toEqual(
      expect.arrayContaining(["allm:ws:k1", "allm:ws:k2", "allm:ws:k3"])
    );
  });

  it("namespace-stats returns stats for existing and throws for missing", async () => {
    mockClient = routeClient({ "FT.INFO": ["num_docs", "2"] });
    const provider = new ValkeyClass();
    expect(await provider["namespace-stats"]({ namespace: "ws" })).toEqual({
      name: "ws",
      vectorCount: 2,
    });

    // Clear the statically-cached client so the next scenario binds the new mock.
    await provider.disconnect();
    mockClient = routeClient({ "FT.INFO": new Error("Unknown index") });
    const provider2 = new ValkeyClass();
    await expect(
      provider2["namespace-stats"]({ namespace: "missing" })
    ).rejects.toThrow("does not exist");
  });

  it("delete-namespace returns a message containing the vector count", async () => {
    mockClient = routeClient({
      "FT.INFO": ["num_docs", "5"],
      SCAN: ["0", []],
    });
    const provider = new ValkeyClass();
    const result = await provider["delete-namespace"]({ namespace: "ws" });
    expect(result.message).toContain("5 vectors");
  });

  it("reset drops every allm_idx_* index and clears keys", async () => {
    mockClient = routeClient({
      "FT._LIST": ["allm_idx_a", "not_ours"],
      SCAN: ["0", ["allm:a:1"]],
    });
    const provider = new ValkeyClass();
    const result = await provider.reset();
    expect(result).toEqual({ reset: true });
    const dropCalls = mockClient.customCommand.mock.calls.filter(
      (c) => c[0][0] === "FT.DROPINDEX"
    );
    expect(dropCalls).toHaveLength(1);
    expect(dropCalls[0][0][1]).toBe("allm_idx_a");
    expect(mockClient.del).toHaveBeenCalledWith(["allm:a:1"]);
  });
});

describe("Valkey provider - connection lifecycle", () => {
  it("heartbeat returns a numeric heartbeat on success", async () => {
    mockClient = makeClient();
    const provider = new ValkeyClass();
    const result = await provider.heartbeat();
    expect(typeof result.heartbeat).toBe("number");
    expect(mockClient.ping).toHaveBeenCalled();
  });

  it("heartbeat disconnects and rethrows on PING failure", async () => {
    mockClient = makeClient({
      ping: jest.fn(async () => {
        throw new Error("unreachable");
      }),
    });
    const provider = new ValkeyClass();
    await expect(provider.heartbeat()).rejects.toThrow("unreachable");
    expect(mockClient.close).toHaveBeenCalled();
  });
});

describe("Valkey provider - document ingestion", () => {
  it("cache path upserts cached chunks without calling the embedder", async () => {
    cachedVectorInformation.mockResolvedValueOnce({
      exists: true,
      chunks: [
        [
          { values: [0.1, 0.2, 0.3], metadata: { text: "a" } },
          { values: [0.4, 0.5, 0.6], metadata: { text: "b" } },
        ],
      ],
    });
    mockClient = routeClient({ "FT.INFO": ["num_docs", "0"] });
    const provider = new ValkeyClass();
    const result = await provider.addDocumentToNamespace(
      "ws",
      { pageContent: "ignored-because-cache", docId: "doc-1" },
      "/tmp/file.json"
    );
    expect(result).toEqual({ vectorized: true, error: null });
    expect(mockClient.hset).toHaveBeenCalledTimes(2);
    expect(DocumentVectors.bulkInsert).toHaveBeenCalled();
  });

  it("embed path splits, embeds, HSETs and stores when skipCache=true", async () => {
    mockClient = routeClient({ "FT.INFO": new Error("Unknown index name") });
    const provider = new ValkeyClass();
    const result = await provider.addDocumentToNamespace(
      "ws",
      { pageContent: "hello world", docId: "doc-2" },
      "/tmp/file.json",
      true
    );
    expect(result).toEqual({ vectorized: true, error: null });
    expect(mockClient.hset).toHaveBeenCalled();
    // FT.CREATE should have been issued since the index was absent.
    const createCall = mockClient.customCommand.mock.calls.find(
      (c) => c[0][0] === "FT.CREATE"
    );
    expect(createCall).toBeTruthy();
  });

  it("returns false for empty pageContent", async () => {
    const provider = new ValkeyClass();
    const result = await provider.addDocumentToNamespace(
      "ws",
      { pageContent: "", docId: "doc-3" },
      "/tmp/file.json",
      true
    );
    expect(result).toBe(false);
  });

  it("surfaces a partial batch failure as {vectorized:false,error}", async () => {
    mockClient = routeClient(
      { "FT.INFO": new Error("Unknown index name") },
      {
        hset: jest.fn(async () => {
          throw new Error("HSET rejected");
        }),
      }
    );
    const provider = new ValkeyClass();
    const result = await provider.addDocumentToNamespace(
      "ws",
      { pageContent: "hello world", docId: "doc-4" },
      "/tmp/file.json",
      true
    );
    expect(result.vectorized).toBe(false);
    expect(result.error).toContain("HSET rejected");
  });

  it("deleteDocumentFromNamespace deletes keys and calls deleteIds", async () => {
    DocumentVectors.where.mockResolvedValueOnce([
      { id: 11, vectorId: "v1" },
      { id: 12, vectorId: "v2" },
    ]);
    mockClient = routeClient({ "FT.INFO": ["num_docs", "2"] });
    const provider = new ValkeyClass();
    const result = await provider.deleteDocumentFromNamespace("ws", "doc-5");
    expect(result).toBe(true);
    const deletedKeys = mockClient.del.mock.calls.flatMap((c) => c[0]);
    expect(deletedKeys).toEqual(
      expect.arrayContaining(["allm:ws:v1", "allm:ws:v2"])
    );
    expect(DocumentVectors.deleteIds).toHaveBeenCalledWith([11, 12]);
  });
});

describe("Valkey provider - similarity search", () => {
  function searchReply(items) {
    // RESP2 FT.SEARCH shape: [total, key, [field, value, ...], ...]
    const reply = [items.length];
    items.forEach((item, i) => {
      reply.push(`allm:ws:k${i}`);
      reply.push([
        "text",
        item.text,
        "metadata",
        JSON.stringify(item.metadata),
        "score",
        String(item.distance),
      ]);
    });
    return reply;
  }

  it("similarityResponse drops below-threshold and filtered results", async () => {
    const pinned = { title: "Pinned", published: "2020" };
    mockClient = routeClient({
      "FT.SEARCH": searchReply([
        { text: "keep", metadata: { text: "keep" }, distance: 0.1 }, // sim 0.9
        { text: "weak", metadata: { text: "weak" }, distance: 0.9 }, // sim 0.1 < 0.25
        {
          text: "pinned",
          metadata: { text: "pinned", ...pinned },
          distance: 0.0,
        },
      ]),
    });
    const provider = new ValkeyClass();
    const { sourceIdentifier } = require("../../../../utils/chats");
    const result = await provider.similarityResponse({
      client: mockClient,
      namespace: "ws",
      queryVector: [0.1, 0.2, 0.3],
      similarityThreshold: 0.25,
      topN: 4,
      filterIdentifiers: [sourceIdentifier(pinned)],
    });
    expect(result.contextTexts).toEqual(["keep"]);
    expect(result.scores[0]).toBeCloseTo(0.9);
  });

  it("performSimilaritySearch returns the empty message for a missing namespace", async () => {
    // No FT.INFO pre-check anymore: FT.SEARCH against a missing index errors
    // with an unknown-index message, which is treated as the empty case.
    mockClient = routeClient({ "FT.SEARCH": new Error("Unknown index name") });
    const provider = new ValkeyClass();
    const result = await provider.performSimilaritySearch({
      namespace: "ws",
      input: "query",
      LLMConnector: { embedTextInput: jest.fn(async () => [0.1, 0.2, 0.3]) },
    });
    expect(result.sources).toEqual([]);
    expect(result.message).toContain("no documents found");
  });

  it("performSimilaritySearch throws on invalid arguments", async () => {
    const provider = new ValkeyClass();
    await expect(
      provider.performSimilaritySearch({ namespace: null, input: "" })
    ).rejects.toThrow("Invalid request");
  });
});

describe("Valkey provider - selector registration", () => {
  it("getVectorDbClass('valkey') returns a Valkey instance", () => {
    const { getVectorDbClass } = jest.requireActual(
      "../../../../utils/helpers"
    );
    const instance = getVectorDbClass("valkey");
    expect(instance.name).toBe("Valkey");
  });
});
