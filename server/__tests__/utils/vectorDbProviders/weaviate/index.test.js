/* eslint-env jest */
/**
 * Unit tests for the Weaviate provider, run against an in-memory fake of the
 * weaviate-client v3 API. Tests against a real Weaviate server live in
 * weaviate.integration.test.js.
 */

// ---- In-memory fake of the weaviate-client v3 surface used by the provider ----
function fakeVersion(version) {
  const [major, minor, patch] = version.split(".").map(Number);
  return {
    show: () => version,
    isAtLeast: (ma, mi, pa) =>
      major !== ma ? major > ma : minor !== mi ? minor > mi : patch >= pa,
  };
}

function cosineDistance(a, b) {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return 1 - dot / (Math.sqrt(na) * Math.sqrt(nb));
}

function createFakeClient({ version = "1.39.0" } = {}) {
  const store = new Map(); // collection name -> Map(uuid -> {vector, properties})
  const insertErrors = new Map(); // uuid -> error message to simulate
  const capitalize = (name) => name.charAt(0).toUpperCase() + name.slice(1);

  const collectionHandle = (rawName) => {
    const name = capitalize(rawName);
    const objects = () => {
      if (!store.has(name)) throw new Error(`collection ${name} not found`);
      return store.get(name);
    };
    return {
      name,
      aggregate: {
        overAll: jest.fn(async () => ({ totalCount: objects().size })),
      },
      query: {
        nearVector: jest.fn(async (vector, { limit }) => ({
          objects: [...objects().entries()]
            .map(([uuid, obj]) => ({
              uuid,
              properties: obj.properties,
              metadata: { distance: cosineDistance(vector, obj.vector) },
            }))
            .sort((a, b) => a.metadata.distance - b.metadata.distance)
            .slice(0, limit),
        })),
      },
      data: {
        insertMany: jest.fn(async (batch) => {
          const errors = {};
          batch.forEach((obj, i) => {
            if (insertErrors.has(obj.id)) {
              errors[i] = { message: insertErrors.get(obj.id), object: obj };
              return;
            }
            objects().set(obj.id, {
              vector: obj.vectors,
              properties: obj.properties,
            });
          });
          return { hasErrors: Object.keys(errors).length > 0, errors };
        }),
        deleteMany: jest.fn(async ({ ids }) => {
          let successful = 0;
          for (const id of ids) if (objects().delete(id)) successful++;
          return { failed: 0, matches: successful, successful };
        }),
      },
      filter: {
        byId: () => ({ containsAny: (ids) => ({ ids }) }),
      },
      config: {
        get: jest.fn(async () => ({ name, vectorizers: {}, properties: [] })),
      },
    };
  };

  const handles = new Map();
  const client = {
    store,
    insertErrors,
    closed: false,
    getWeaviateVersion: jest.fn(async () => fakeVersion(version)),
    isLive: jest.fn(async () => true),
    close: jest.fn(async () => {
      client.closed = true;
    }),
    collections: {
      listAll: jest.fn(async () => [...store.keys()].map((name) => ({ name }))),
      exists: jest.fn(async (name) => store.has(capitalize(name))),
      createFromSchema: jest.fn(async (schema) => {
        store.set(capitalize(schema.class), new Map());
      }),
      delete: jest.fn(async (name) => {
        store.delete(capitalize(name));
      }),
      get: jest.fn((name) => {
        const key = capitalize(name);
        if (!handles.has(key)) handles.set(key, collectionHandle(key));
        return handles.get(key);
      }),
    },
  };
  return client;
}

// ---- Module mocks ----
jest.mock("weaviate-client", () => ({
  connectToCustom: jest.fn(),
  connectToWeaviateCloud: jest.fn(),
  ApiKey: class ApiKey {
    constructor(apiKey) {
      this.apiKey = apiKey;
    }
  },
}));

const mockDocumentVectors = {
  rows: [],
  bulkInsert: jest.fn(async (records = []) => {
    records.forEach((r) =>
      mockDocumentVectors.rows.push({
        id: mockDocumentVectors.rows.length + 1,
        ...r,
      })
    );
    return { documentsInserted: records.length };
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

const mockSettings = { chunkSize: 60, chunkOverlap: 0 };
jest.mock("../../../../models/systemSettings", () => ({
  SystemSettings: {
    getValueOrFallback: jest.fn(async ({ label }, fallback = null) => {
      if (label === "text_splitter_chunk_size") return mockSettings.chunkSize;
      if (label === "text_splitter_chunk_overlap")
        return mockSettings.chunkOverlap;
      return fallback;
    }),
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

// Deterministic "embedder": a bag of words hashed into 8 dimensions.
const embed = (text) => {
  const vector = new Array(8).fill(0.001);
  for (const word of String(text).toLowerCase().split(/\W+/).filter(Boolean))
    vector[[...word].reduce((a, c) => a + c.charCodeAt(0), 0) % 8] += 1;
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

const weaviate = require("weaviate-client");
const { Weaviate } = require("../../../../utils/vectorDbProviders/weaviate");
const { version: APP_VERSION } = require("../../../../package.json");

// ---- Helpers ----
const ENV_KEYS = [
  "VECTOR_DB",
  "WEAVIATE_DEPLOYMENT",
  "WEAVIATE_ENDPOINT",
  "WEAVIATE_GRPC_ENDPOINT",
  "WEAVIATE_API_KEY",
];
const originalEnv = Object.fromEntries(
  ENV_KEYS.map((k) => [k, process.env[k]])
);

function setEnv(overrides = {}) {
  for (const k of ENV_KEYS) delete process.env[k];
  Object.assign(
    process.env,
    {
      VECTOR_DB: "weaviate",
      WEAVIATE_ENDPOINT: "http://localhost:8080",
    },
    overrides
  );
  for (const [k, v] of Object.entries(overrides))
    if (v === undefined) delete process.env[k];
}

let fakeClient;
function useFakeClient(options) {
  fakeClient = createFakeClient(options);
  weaviate.connectToCustom.mockResolvedValue(fakeClient);
  weaviate.connectToWeaviateCloud.mockResolvedValue(fakeClient);
  return fakeClient;
}

const doc = (overrides = {}) => ({
  docId: "doc-1",
  id: "should-be-stripped",
  title: "fruits.txt",
  published: "1/1/2026",
  docSource: "unit-test",
  wordCount: 12,
  pageContent:
    "Apples are red and crunchy. Bananas are yellow and soft. Cherries are small and sweet. Dates are brown and sticky.",
  ...overrides,
});

beforeEach(async () => {
  await Weaviate.disconnect();
  jest.clearAllMocks();
  mockDocumentVectors.rows = [];
  mockVectorCache.clear();
  mockSettings.chunkSize = 60;
  setEnv();
  useFakeClient();
});

afterAll(async () => {
  await Weaviate.disconnect();
  for (const [k, v] of Object.entries(originalEnv)) {
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
});

// ---- Tests ----
describe("Weaviate.connectionConfig", () => {
  const header = {
    "X-Weaviate-Client-Integration": `anything-llm/${APP_VERSION}`,
  };
  const cases = [
    {
      name: "local http, gRPC derived on 50051",
      env: { WEAVIATE_ENDPOINT: "http://localhost:8080" },
      expected: {
        method: "custom",
        options: {
          headers: header,
          httpHost: "localhost",
          httpPort: 8080,
          httpSecure: false,
          grpcHost: "localhost",
          grpcPort: 50051,
          grpcSecure: false,
        },
      },
    },
    {
      name: "docker hostname without port defaults to 80",
      env: { WEAVIATE_ENDPOINT: "http://weaviate" },
      expected: {
        method: "custom",
        options: expect.objectContaining({
          httpHost: "weaviate",
          httpPort: 80,
          grpcHost: "weaviate",
          grpcPort: 50051,
        }),
      },
    },
    {
      name: "https self-hosted: TLS on both, 443 default",
      env: { WEAVIATE_ENDPOINT: "https://vectors.example.com" },
      expected: {
        method: "custom",
        options: expect.objectContaining({
          httpHost: "vectors.example.com",
          httpPort: 443,
          httpSecure: true,
          grpcHost: "vectors.example.com",
          grpcPort: 50051,
          grpcSecure: true,
        }),
      },
    },
    {
      name: "path prefix behind a reverse proxy is kept",
      env: { WEAVIATE_ENDPOINT: "https://proxy.example.com/weaviate/" },
      expected: {
        method: "custom",
        options: expect.objectContaining({ httpPath: "/weaviate" }),
      },
    },
    {
      name: "explicit gRPC URL",
      env: {
        WEAVIATE_ENDPOINT: "http://localhost:8080",
        WEAVIATE_GRPC_ENDPOINT: "http://grpc-host:50052",
      },
      expected: {
        method: "custom",
        options: expect.objectContaining({
          grpcHost: "grpc-host",
          grpcPort: 50052,
          grpcSecure: false,
        }),
      },
    },
    {
      name: "explicit https gRPC URL without a port uses 443",
      env: {
        WEAVIATE_ENDPOINT: "http://localhost:8080",
        WEAVIATE_GRPC_ENDPOINT: "https://grpc.example.com",
      },
      expected: {
        method: "custom",
        options: expect.objectContaining({
          grpcHost: "grpc.example.com",
          grpcPort: 443,
          grpcSecure: true,
        }),
      },
    },
    {
      name: "bare host:port gRPC endpoint inherits the REST scheme",
      env: {
        WEAVIATE_ENDPOINT: "https://vectors.example.com",
        WEAVIATE_GRPC_ENDPOINT: "grpc.example.com:50051",
      },
      expected: {
        method: "custom",
        options: expect.objectContaining({
          grpcHost: "grpc.example.com",
          grpcPort: 50051,
          grpcSecure: true,
        }),
      },
    },
    {
      name: "inferred: Weaviate Cloud host (.weaviate.cloud) is cloud",
      env: {
        WEAVIATE_ENDPOINT: "https://abc123.c0.europe-west3.gcp.weaviate.cloud",
        WEAVIATE_API_KEY: "wcd-key",
      },
      expected: {
        method: "cloud",
        url: "https://abc123.c0.europe-west3.gcp.weaviate.cloud",
        options: {
          headers: header,
          authCredentials: expect.objectContaining({ apiKey: "wcd-key" }),
        },
      },
    },
    {
      name: "inferred: legacy Weaviate Cloud host (.weaviate.network) is cloud",
      env: {
        WEAVIATE_ENDPOINT: "https://my-sandbox.weaviate.network",
        WEAVIATE_API_KEY: "wcd-key",
      },
      expected: expect.objectContaining({ method: "cloud" }),
    },
    {
      name: "inferred: Weaviate Cloud host with an explicit gRPC endpoint is custom",
      env: {
        WEAVIATE_ENDPOINT: "https://abc123.c0.europe-west3.gcp.weaviate.cloud",
        WEAVIATE_GRPC_ENDPOINT:
          "https://grpc-abc123.c0.europe-west3.gcp.weaviate.cloud:443",
      },
      expected: expect.objectContaining({ method: "custom" }),
    },
    {
      name: "explicit cloud works for any host and ignores WEAVIATE_GRPC_ENDPOINT",
      env: {
        WEAVIATE_DEPLOYMENT: "cloud",
        WEAVIATE_ENDPOINT: "https://vectors.my-company.com/",
        WEAVIATE_GRPC_ENDPOINT: "http://ignored:50051",
        WEAVIATE_API_KEY: "wcd-key",
      },
      expected: expect.objectContaining({
        method: "cloud",
        url: "https://vectors.my-company.com",
      }),
    },
    {
      name: "explicit custom wins over a Weaviate Cloud host",
      env: {
        WEAVIATE_DEPLOYMENT: "custom",
        WEAVIATE_ENDPOINT: "https://abc123.c0.europe-west3.gcp.weaviate.cloud",
      },
      expected: {
        method: "custom",
        options: expect.objectContaining({
          httpHost: "abc123.c0.europe-west3.gcp.weaviate.cloud",
          httpPort: 443,
          grpcPort: 50051,
          grpcSecure: true,
        }),
      },
    },
    {
      name: "deployment value is case and whitespace insensitive",
      env: {
        WEAVIATE_DEPLOYMENT: "  Custom ",
        WEAVIATE_ENDPOINT: "https://abc123.c0.europe-west3.gcp.weaviate.cloud",
      },
      expected: expect.objectContaining({ method: "custom" }),
    },
  ];

  it.each(cases)("$name", ({ env, expected }) => {
    setEnv(env);
    expect(new Weaviate().connectionConfig()).toEqual(expected);
  });

  it("adds ApiKey credentials only when an API key is set", () => {
    setEnv({ WEAVIATE_API_KEY: "  secret-key  " });
    const { options } = new Weaviate().connectionConfig();
    expect(options.authCredentials).toBeInstanceOf(weaviate.ApiKey);
    expect(options.authCredentials.apiKey).toBe("secret-key");

    setEnv({ WEAVIATE_API_KEY: "   " });
    expect(new Weaviate().connectionConfig().options).not.toHaveProperty(
      "authCredentials"
    );
  });

  it("requires an API key for Weaviate Cloud", () => {
    setEnv({
      WEAVIATE_DEPLOYMENT: "cloud",
      WEAVIATE_ENDPOINT: "https://abc123.c0.europe-west3.gcp.weaviate.cloud",
    });
    expect(() => new Weaviate().connectionConfig()).toThrow(
      "Weaviate::Weaviate Cloud requires an API key."
    );
  });

  it("rejects an unknown deployment value", () => {
    setEnv({ WEAVIATE_DEPLOYMENT: "serverless" });
    expect(() => new Weaviate().connectionConfig()).toThrow(
      'Weaviate::Invalid WEAVIATE_DEPLOYMENT "serverless"'
    );
  });

  it("throws on an invalid endpoint URL", () => {
    setEnv({ WEAVIATE_ENDPOINT: "not a url" });
    expect(() => new Weaviate().connectionConfig()).toThrow();
  });
});

describe("Weaviate.connect", () => {
  it("rejects when VECTOR_DB is not weaviate", async () => {
    setEnv({ VECTOR_DB: "lancedb" });
    await expect(new Weaviate().connect()).rejects.toThrow(
      "Weaviate::Invalid ENV settings"
    );
    expect(weaviate.connectToCustom).not.toHaveBeenCalled();
  });

  it("uses connectToCustom for self-hosted and connectToWeaviateCloud for cloud", async () => {
    await new Weaviate().connect();
    expect(weaviate.connectToCustom).toHaveBeenCalledTimes(1);
    expect(weaviate.connectToWeaviateCloud).not.toHaveBeenCalled();

    setEnv({
      WEAVIATE_ENDPOINT: "https://x.c0.us-east1.gcp.weaviate.cloud",
      WEAVIATE_API_KEY: "wcd-key",
    });
    await new Weaviate().connect();
    expect(weaviate.connectToWeaviateCloud).toHaveBeenCalledWith(
      "https://x.c0.us-east1.gcp.weaviate.cloud",
      expect.objectContaining({ headers: expect.any(Object) })
    );
  });

  it.each(["1.27.0", "1.28.9"])(
    "rejects Weaviate %s with an upgrade message and closes the client",
    async (version) => {
      const client = useFakeClient({ version });
      await expect(new Weaviate().connect()).rejects.toThrow(
        `Weaviate::Server version ${version} is not supported. AnythingLLM requires Weaviate 1.29.0 or later`
      );
      expect(client.close).toHaveBeenCalled();
    }
  );

  it.each(["1.29.0", "1.32.27", "1.39.7", "2.0.0"])(
    "accepts Weaviate %s",
    async (version) => {
      const client = useFakeClient({ version });
      await expect(new Weaviate().connect()).resolves.toEqual({ client });
    }
  );

  it("wraps connection failures with a helpful message", async () => {
    weaviate.connectToCustom.mockRejectedValueOnce(new Error("ECONNREFUSED"));
    await expect(new Weaviate().connect()).rejects.toThrow(
      /Weaviate::Could not connect.*ECONNREFUSED/
    );
  });

  it("reuses one client across calls and instances", async () => {
    const a = await new Weaviate().connect();
    const b = await new Weaviate().connect();
    expect(a.client).toBe(b.client);
    expect(weaviate.connectToCustom).toHaveBeenCalledTimes(1);
  });

  it("shares one pending connection between concurrent callers", async () => {
    const results = await Promise.all(
      [1, 2, 3, 4, 5].map(() => new Weaviate().connect())
    );
    expect(new Set(results.map((r) => r.client)).size).toBe(1);
    expect(weaviate.connectToCustom).toHaveBeenCalledTimes(1);
  });

  it("fails to connect to Weaviate Cloud without an API key", async () => {
    setEnv({ WEAVIATE_DEPLOYMENT: "cloud" });
    await expect(new Weaviate().connect()).rejects.toThrow(
      "Weaviate Cloud requires an API key"
    );
    expect(weaviate.connectToWeaviateCloud).not.toHaveBeenCalled();
  });

  it.each([
    ["WEAVIATE_DEPLOYMENT", "custom"],
    ["WEAVIATE_ENDPOINT", "http://other:8080"],
    ["WEAVIATE_GRPC_ENDPOINT", "http://other:50051"],
    ["WEAVIATE_API_KEY", "rotated"],
  ])(
    "rebuilds and closes the old client when %s changes",
    async (key, value) => {
      const first = fakeClient;
      await new Weaviate().connect();
      const second = useFakeClient();
      process.env[key] = value;
      const { client } = await new Weaviate().connect();
      expect(client).toBe(second);
      await new Promise((r) => setImmediate(r));
      expect(first.close).toHaveBeenCalled();
    }
  );

  it("retries after a failed connection instead of caching the failure", async () => {
    weaviate.connectToCustom.mockRejectedValueOnce(new Error("down"));
    await expect(new Weaviate().connect()).rejects.toThrow();
    await expect(new Weaviate().connect()).resolves.toEqual({
      client: fakeClient,
    });
    expect(weaviate.connectToCustom).toHaveBeenCalledTimes(2);
  });
});

describe("Weaviate.heartbeat", () => {
  it("returns a heartbeat when the server is live", async () => {
    const result = await new Weaviate().heartbeat();
    expect(result.heartbeat).toEqual(expect.any(Number));
    expect(fakeClient.isLive).toHaveBeenCalled();
  });

  it("throws when the server is not live, even with a cached client", async () => {
    await new Weaviate().connect();
    fakeClient.isLive.mockResolvedValueOnce(false);
    await expect(new Weaviate().heartbeat()).rejects.toThrow(
      "is the service online?"
    );
  });
});

describe("Weaviate.distanceToSimilarity", () => {
  const w = new Weaviate();
  it.each([
    [0, 1],
    [0.25, 0.75],
    [0.999, 0.001],
    [1, 0],
    [1.5, 0],
    [2, 0],
    [-0.1, 0.9],
    [null, 0],
    [undefined, 0],
    ["0.1", 0],
  ])("distance %p -> similarity %p", (distance, similarity) => {
    expect(w.distanceToSimilarity(distance)).toBeCloseTo(similarity, 10);
  });
});

describe("Weaviate.flattenObjectForWeaviate", () => {
  const w = new Weaviate();
  it("flattens nested objects with underscores and drops `id`", () => {
    expect(
      w.flattenObjectForWeaviate({
        id: "x",
        title: "t",
        meta: { author: "a", nested: { depth: 2, id: "inner" } },
      })
    ).toEqual({ title: "t", meta_author: "a", meta_nested_depth: 2 });
  });

  it("keeps homogeneous primitive arrays and drops mixed, object and empty arrays", () => {
    expect(
      w.flattenObjectForWeaviate({
        tags: ["a", "b"],
        nums: [1, 2],
        mixed: ["a", 1],
        objs: [{ a: 1 }],
        empty: [],
      })
    ).toEqual({ tags: ["a", "b"], nums: [1, 2] });
  });

  it("returns an empty object for empty or missing input", () => {
    expect(w.flattenObjectForWeaviate({})).toEqual({});
    expect(w.flattenObjectForWeaviate()).toEqual({});
  });
});

describe("Weaviate.addVectors", () => {
  const records = (n, cls = "Ws") =>
    Array.from({ length: n }, (_, i) => ({
      id: `id-${i}`,
      class: cls,
      vector: [1, 0],
      properties: { text: `t${i}` },
    }));

  it.each([
    [0, 0],
    [1, 1],
    [500, 1],
    [501, 2],
    [1234, 3],
  ])("%i records -> %i insertMany calls", async (n, calls) => {
    const { client } = await new Weaviate().connect();
    await client.collections.createFromSchema({ class: "Ws" });
    const result = await new Weaviate().addVectors(client, records(n));
    expect(result).toEqual({ success: true, errors: [] });
    expect(client.collections.get("Ws").data.insertMany).toHaveBeenCalledTimes(
      calls
    );
    expect(client.store.get("Ws").size).toBe(n);
  });

  it("maps legacy records to v3 DataObjects", async () => {
    const { client } = await new Weaviate().connect();
    await client.collections.createFromSchema({ class: "Ws" });
    await new Weaviate().addVectors(client, records(1));
    expect(client.collections.get("Ws").data.insertMany).toHaveBeenCalledWith([
      { id: "id-0", properties: { text: "t0" }, vectors: [1, 0] },
    ]);
  });

  it("groups records by collection", async () => {
    const { client } = await new Weaviate().connect();
    await client.collections.createFromSchema({ class: "A" });
    await client.collections.createFromSchema({ class: "B" });
    await new Weaviate().addVectors(client, [
      ...records(2, "A"),
      ...records(3, "B"),
    ]);
    expect(client.store.get("A").size).toBe(2);
    expect(client.store.get("B").size).toBe(3);
  });

  it("reports partial failures with de-duplicated messages", async () => {
    const { client } = await new Weaviate().connect();
    await client.collections.createFromSchema({ class: "Ws" });
    client.insertErrors.set("id-1", "invalid vector length");
    client.insertErrors.set("id-2", "invalid vector length");
    client.insertErrors.set("id-600", "property type mismatch");
    const result = await new Weaviate().addVectors(client, records(700));
    expect(result.success).toBe(false);
    expect(result.errors.sort()).toEqual([
      "invalid vector length",
      "property type mismatch",
    ]);
  });
});

describe("Weaviate.addDocumentToNamespace", () => {
  it("embeds, creates the collection with the legacy schema and stores every chunk", async () => {
    const w = new Weaviate();
    const result = await w.addDocumentToNamespace(
      "my workspace",
      doc(),
      "custom-documents/fruits.json"
    );
    expect(result).toEqual({ vectorized: true, error: null });

    expect(fakeClient.collections.createFromSchema).toHaveBeenCalledWith({
      class: "MyWorkspace",
      description: "Class created by AnythingLLM named MyWorkspace",
      vectorizer: "none",
    });
    const stored = [...fakeClient.store.get("MyWorkspace").values()];
    const chunkCount = mockEmbedder.embedChunks.mock.calls[0][0].length;
    expect(chunkCount).toBeGreaterThan(1);
    expect(stored).toHaveLength(chunkCount);
    for (const obj of stored) {
      expect(obj.properties).toEqual(
        expect.objectContaining({
          title: "fruits.txt",
          docSource: "unit-test",
          wordCount: 12,
          text: expect.any(String),
        })
      );
      expect(obj.properties).not.toHaveProperty("id");
      expect(obj.properties).not.toHaveProperty("docId");
      expect(obj.properties).not.toHaveProperty("pageContent");
    }
    expect(mockDocumentVectors.rows).toHaveLength(chunkCount);
    expect(mockDocumentVectors.rows.every((r) => r.docId === "doc-1")).toBe(
      true
    );
    expect(
      mockVectorCache.get("custom-documents/fruits.json").flat()
    ).toHaveLength(chunkCount);
  });

  it("does not recreate an existing collection", async () => {
    const w = new Weaviate();
    await w.addDocumentToNamespace("ws", doc());
    await w.addDocumentToNamespace("ws", doc({ docId: "doc-2" }));
    expect(fakeClient.collections.createFromSchema).toHaveBeenCalledTimes(1);
  });

  it("re-uses cached vectors: no embedding, each chunk inserted exactly once", async () => {
    // 1,203 cached chunks spread across 3 cache groups (500/500/203).
    const cached = Array.from({ length: 1203 }, (_, i) => ({
      id: `old-${i}`,
      class: "Old",
      vector: [i % 7, 1],
      properties: { text: `chunk ${i}`, title: "big.txt", nested: { a: 1 } },
    }));
    mockVectorCache.set("big.json", [
      cached.slice(0, 500),
      cached.slice(500, 1000),
      cached.slice(1000),
    ]);

    const result = await new Weaviate().addDocumentToNamespace(
      "ws",
      doc(),
      "big.json"
    );
    expect(result).toEqual({ vectorized: true, error: null });
    expect(mockEmbedder.embedChunks).not.toHaveBeenCalled();

    const insertMany = fakeClient.collections.get("Ws").data.insertMany;
    const inserted = insertMany.mock.calls.flatMap(([batch]) => batch);
    expect(inserted).toHaveLength(1203); // the legacy loop re-sent 500+1000+1203
    expect(new Set(inserted.map((o) => o.id)).size).toBe(1203);
    expect(inserted.every((o) => !o.id.startsWith("old-"))).toBe(true); // fresh ids
    expect(inserted[0].properties).toEqual({
      text: "chunk 0",
      title: "big.txt",
      nested_a: 1,
    });
    expect(fakeClient.store.get("Ws").size).toBe(1203);
    expect(mockDocumentVectors.rows.map((r) => r.vectorId).sort()).toEqual(
      inserted.map((o) => o.id).sort()
    );
  });

  it("skipCache forces a fresh embed", async () => {
    mockVectorCache.set("f.json", [[{ vector: [1], properties: {} }]]);
    await new Weaviate().addDocumentToNamespace("ws", doc(), "f.json", true);
    expect(mockEmbedder.embedChunks).toHaveBeenCalled();
  });

  it("returns false for empty page content", async () => {
    expect(
      await new Weaviate().addDocumentToNamespace(
        "ws",
        doc({ pageContent: "" })
      )
    ).toBe(false);
    expect(weaviate.connectToCustom).not.toHaveBeenCalled();
  });

  it("returns vectorized:false when the embedder returns nothing", async () => {
    mockEmbedder.embedChunks.mockResolvedValueOnce([]);
    const result = await new Weaviate().addDocumentToNamespace("ws", doc());
    expect(result.vectorized).toBe(false);
    expect(result.error).toMatch(/Could not embed document chunks/);
    expect(mockDocumentVectors.bulkInsert).not.toHaveBeenCalled();
  });

  it("returns vectorized:false and records nothing when Weaviate rejects objects", async () => {
    const w = new Weaviate();
    const { client } = await w.connect();
    client.collections.get("Ws").data.insertMany.mockResolvedValueOnce({
      hasErrors: true,
      errors: { 0: { message: "boom" } },
    });
    const result = await w.addDocumentToNamespace("ws", doc(), "x.json");
    expect(result).toEqual({
      vectorized: false,
      error: "Error embedding into Weaviate",
    });
    expect(mockDocumentVectors.bulkInsert).not.toHaveBeenCalled();
    expect(mockVectorCache.has("x.json")).toBe(false);
  });

  it("returns vectorized:false when the server is too old", async () => {
    useFakeClient({ version: "1.28.0" });
    const result = await new Weaviate().addDocumentToNamespace("ws", doc());
    expect(result.vectorized).toBe(false);
    expect(result.error).toMatch(/requires Weaviate 1\.29\.0/);
  });
});

describe("Weaviate similarity search", () => {
  async function seed() {
    const w = new Weaviate();
    const { client } = await w.connect();
    await client.collections.createFromSchema({ class: "Ws" });
    const put = (id, text, extra = {}) =>
      client.store
        .get("Ws")
        .set(id, { vector: embed(text), properties: { text, ...extra } });
    put("a", "apples apples", { title: "a.txt", published: "p1" });
    put("b", "bananas bananas", { title: "b.txt", published: "p2" });
    put("c", "apples bananas", { title: "c.txt", published: "p3" });
    return { w, client };
  }

  it("returns the legacy result shape ordered by score", async () => {
    const { w, client } = await seed();
    const result = await w.similarityResponse({
      client,
      namespace: "ws",
      queryVector: embed("apples"),
      similarityThreshold: 0,
      topN: 2,
    });
    expect(result.contextTexts).toEqual(["apples apples", "apples bananas"]);
    expect(result.sourceDocuments[0]).toEqual({
      text: "apples apples",
      title: "a.txt",
      published: "p1",
      id: "a",
      score: expect.any(Number),
    });
    expect(result.scores[0]).toBeGreaterThan(result.scores[1]);
    expect(result.scores[0]).toBeCloseTo(1, 2);
    expect(client.collections.get("Ws").query.nearVector).toHaveBeenCalledWith(
      embed("apples"),
      {
        limit: 2,
        returnMetadata: ["distance"],
      }
    );
  });

  it("drops results below the similarity threshold", async () => {
    const { w, client } = await seed();
    const result = await w.similarityResponse({
      client,
      namespace: "ws",
      queryVector: embed("apples"),
      similarityThreshold: 0.99,
      topN: 3,
    });
    expect(result.contextTexts).toEqual(["apples apples"]);
  });

  it("filters out pinned documents by source identifier", async () => {
    const { w, client } = await seed();
    const result = await w.similarityResponse({
      client,
      namespace: "ws",
      queryVector: embed("apples"),
      similarityThreshold: 0,
      topN: 3,
      filterIdentifiers: ["title:a.txt-timestamp:p1"],
    });
    expect(result.sourceDocuments.map((d) => d.id)).toEqual(["c", "b"]);
  });

  it("handles an empty result set", async () => {
    const { w, client } = await seed();
    client.collections
      .get("Ws")
      .query.nearVector.mockResolvedValueOnce({ objects: [] });
    expect(
      await w.similarityResponse({
        client,
        namespace: "ws",
        queryVector: [1],
      })
    ).toEqual({ contextTexts: [], sourceDocuments: [], scores: [] });
  });

  it("performSimilaritySearch returns curated sources with text", async () => {
    const { w } = await seed();
    const result = await w.performSimilaritySearch({
      namespace: "ws",
      input: "bananas",
      LLMConnector: mockEmbedder,
      similarityThreshold: 0.5,
      topN: 1,
    });
    expect(result).toEqual({
      contextTexts: ["bananas bananas"],
      sources: [
        expect.objectContaining({
          id: "b",
          text: "bananas bananas",
          title: "b.txt",
        }),
      ],
      message: false,
    });
  });

  it("performSimilaritySearch reports a missing workspace collection", async () => {
    const result = await new Weaviate().performSimilaritySearch({
      namespace: "nope",
      input: "x",
      LLMConnector: mockEmbedder,
    });
    expect(result).toEqual({
      contextTexts: [],
      sources: [],
      message: "Invalid query - no documents found for workspace!",
    });
  });

  it("performSimilaritySearch validates its arguments", async () => {
    await expect(
      new Weaviate().performSimilaritySearch({ namespace: "ws", input: "" })
    ).rejects.toThrow("Invalid request to performSimilaritySearch.");
  });
});

describe("Weaviate deletes", () => {
  it("deletes every vector of a document in batched deleteMany calls", async () => {
    const w = new Weaviate();
    mockSettings.chunkSize = 5; // many chunks
    await w.addDocumentToNamespace("ws", doc());
    await w.addDocumentToNamespace(
      "ws",
      doc({ docId: "keep", pageContent: "keep me around" })
    );
    const docVectors = mockDocumentVectors.rows.filter(
      (r) => r.docId === "doc-1"
    );
    expect(docVectors.length).toBeGreaterThan(20);

    // Force several delete batches.
    const extra = Array.from({ length: 1100 }, (_, i) => ({
      docId: "doc-1",
      vectorId: `ghost-${i}`,
    }));
    await mockDocumentVectors.bulkInsert(extra);

    expect(await w.deleteDocumentFromNamespace("ws", "doc-1")).toBe(true);
    const deleteMany = fakeClient.collections.get("Ws").data.deleteMany;
    expect(deleteMany).toHaveBeenCalledTimes(
      Math.ceil((docVectors.length + extra.length) / 500)
    );
    const keepIds = mockDocumentVectors.rows
      .filter((r) => r.docId === "keep")
      .map((r) => r.vectorId);
    expect([...fakeClient.store.get("Ws").keys()].sort()).toEqual(
      keepIds.sort()
    );
    expect(mockDocumentVectors.rows.every((r) => r.docId === "keep")).toBe(
      true
    );
  });

  it("throws, and keeps the tracking rows, when Weaviate fails to delete", async () => {
    const w = new Weaviate();
    await w.addDocumentToNamespace("ws", doc());
    const before = mockDocumentVectors.rows.length;
    fakeClient.collections
      .get("Ws")
      .data.deleteMany.mockResolvedValueOnce({ failed: 2, successful: 0 });
    await expect(w.deleteDocumentFromNamespace("ws", "doc-1")).rejects.toThrow(
      "Weaviate::Failed to delete 2 vectors of document doc-1"
    );
    expect(mockDocumentVectors.rows).toHaveLength(before);
  });

  it("is a no-op for a missing collection or unknown document", async () => {
    const w = new Weaviate();
    expect(
      await w.deleteDocumentFromNamespace("missing", "doc-1")
    ).toBeUndefined();
    await w.addDocumentToNamespace("ws", doc());
    expect(
      await w.deleteDocumentFromNamespace("ws", "unknown")
    ).toBeUndefined();
    expect(
      fakeClient.collections.get("Ws").data.deleteMany
    ).not.toHaveBeenCalled();
  });

  it("delete-namespace drops the collection and reports its size", async () => {
    const w = new Weaviate();
    await w.addDocumentToNamespace("ws", doc());
    const count = fakeClient.store.get("Ws").size;
    expect(await w["delete-namespace"]({ namespace: "ws" })).toEqual({
      message: `Namespace Ws was deleted along with ${count} vectors.`,
    });
    expect(fakeClient.store.has("Ws")).toBe(false);
  });

  it("reset deletes every collection", async () => {
    const w = new Weaviate();
    await w.addDocumentToNamespace("one", doc());
    await w.addDocumentToNamespace("two", doc());
    expect(await w.reset()).toEqual({ reset: true });
    expect(fakeClient.store.size).toBe(0);
    expect(
      fakeClient.collections.delete.mock.calls.map(([n]) => n).sort()
    ).toEqual(["One", "Two"]);
  });
});

describe("Weaviate namespaces and counts", () => {
  it("counts per namespace and in total across collections", async () => {
    const w = new Weaviate();
    await w.addDocumentToNamespace("one", doc());
    await w.addDocumentToNamespace("two", doc());
    await w.addDocumentToNamespace("two", doc({ docId: "doc-2" }));
    const one = fakeClient.store.get("One").size;
    const two = fakeClient.store.get("Two").size;
    expect(await w.namespaceCount("one")).toBe(one);
    expect(await w.namespaceCount("two")).toBe(two);
    expect(await w.totalVectors()).toBe(one + two);
  });

  it("returns 0 when counting fails", async () => {
    expect(await new Weaviate().namespaceCount("missing")).toBe(0);
  });

  it("hasNamespace / namespaceExists use the PascalCase collection name", async () => {
    const w = new Weaviate();
    await w.addDocumentToNamespace("my-workspace", doc());
    expect(await w.hasNamespace("my-workspace")).toBe(true);
    expect(await w.hasNamespace("other")).toBe(false);
    expect(await w.hasNamespace(null)).toBe(false);
    expect(fakeClient.collections.exists).toHaveBeenCalledWith("MyWorkspace");
    await expect(w.namespaceExists(fakeClient, null)).rejects.toThrow(
      "No namespace value provided."
    );
  });

  it("namespace-stats returns config plus vectorCount, or a message", async () => {
    const w = new Weaviate();
    await w.addDocumentToNamespace("ws", doc());
    expect(await w["namespace-stats"]({ namespace: "ws" })).toEqual(
      expect.objectContaining({
        name: "Ws",
        vectorCount: fakeClient.store.get("Ws").size,
      })
    );
    expect(await w["namespace-stats"]({ namespace: "missing" })).toEqual({
      message: "No stats were able to be fetched from DB for namespace",
    });
    await expect(w["namespace-stats"]({})).rejects.toThrow(
      "namespace required"
    );
  });

  it("allNamespaces returns [] on error", async () => {
    const { client } = await new Weaviate().connect();
    client.collections.listAll.mockRejectedValueOnce(new Error("nope"));
    expect(await new Weaviate().allNamespaces(client)).toEqual([]);
  });
});

describe("Weaviate.curateSources", () => {
  it("unwraps metadata and drops empty sources", () => {
    expect(
      new Weaviate().curateSources([
        { metadata: { a: 1 } },
        {},
        { b: 2, text: "t" },
      ])
    ).toEqual([{ a: 1 }, { b: 2, text: "t" }]);
  });
});
