const path = require("path");

jest.mock("@lancedb/lancedb", () => ({ connect: jest.fn() }));

const LANCEDB_CLOUD_ENV_KEYS = [
  "LANCEDB_CLOUD_URI",
  "LANCEDB_CLOUD_API_KEY",
  "LANCEDB_CLOUD_REGION",
];
const STORAGE_DIR = path.resolve("/tmp/anythingllm-test-storage");
const EXTERNAL_URI = "s3://my-bucket/lancedb";

describe("LanceDbCloud", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV, STORAGE_DIR, VECTOR_DB: "lancedb_cloud" };
    for (const key of LANCEDB_CLOUD_ENV_KEYS) delete process.env[key];
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  // resetModules gives each test a fresh connect mock and an empty connection cache.
  function loadProviders() {
    const lancedb = require("@lancedb/lancedb");
    let connections = 0;
    lancedb.connect.mockImplementation(async () => ({
      connectionId: connections++,
      tableNames: jest.fn().mockResolvedValue([]),
      dropTable: jest.fn().mockResolvedValue(undefined),
    }));
    const {
      LanceDbCloud,
    } = require("../../../../utils/vectorDbProviders/lancedb_cloud");
    const { LanceDb } = require("../../../../utils/vectorDbProviders/lance");
    return { lancedb, LanceDbCloud, LanceDb };
  }

  it("extends the on-device LanceDb provider", () => {
    const { LanceDbCloud, LanceDb } = loadProviders();
    expect(new LanceDbCloud()).toBeInstanceOf(LanceDb);
  });

  it("reports its own provider name", () => {
    const { LanceDbCloud } = loadProviders();
    expect(new LanceDbCloud().name).toBe("LanceDbCloud");
  });

  it("reads the uri from LANCEDB_CLOUD_URI and never the local storage path", () => {
    process.env.LANCEDB_CLOUD_URI = `  ${EXTERNAL_URI}  `;
    const { LanceDbCloud, LanceDb } = loadProviders();

    expect(new LanceDbCloud().uri).toBe(EXTERNAL_URI);
    expect(new LanceDbCloud().uri).not.toBe(new LanceDb().uri);
    expect(new LanceDb().uri).toBe(path.resolve(STORAGE_DIR, "lancedb"));
  });

  it("connects to the external uri with a single argument when no credentials are set", async () => {
    process.env.LANCEDB_CLOUD_URI = EXTERNAL_URI;
    const { lancedb, LanceDbCloud } = loadProviders();

    await new LanceDbCloud().connect();
    expect(lancedb.connect).toHaveBeenCalledTimes(1);
    expect(lancedb.connect.mock.calls[0]).toEqual([EXTERNAL_URI]);
  });

  it("passes the apiKey and region when both are set", async () => {
    process.env.LANCEDB_CLOUD_URI = "db://my-database";
    process.env.LANCEDB_CLOUD_API_KEY = "sk-lancedb-test";
    process.env.LANCEDB_CLOUD_REGION = "us-west-2";
    const { lancedb, LanceDbCloud } = loadProviders();

    await new LanceDbCloud().connect();
    expect(lancedb.connect.mock.calls[0]).toEqual([
      "db://my-database",
      { apiKey: "sk-lancedb-test", region: "us-west-2" },
    ]);
  });

  it("passes only the apiKey when the region is not set", async () => {
    process.env.LANCEDB_CLOUD_URI = "db://my-database";
    process.env.LANCEDB_CLOUD_API_KEY = "sk-lancedb-test";
    const { lancedb, LanceDbCloud } = loadProviders();

    await new LanceDbCloud().connect();
    expect(lancedb.connect.mock.calls[0]).toEqual([
      "db://my-database",
      { apiKey: "sk-lancedb-test" },
    ]);
  });

  it("passes only the region when the apiKey is not set", async () => {
    process.env.LANCEDB_CLOUD_URI = "db://my-database";
    process.env.LANCEDB_CLOUD_REGION = "us-west-2";
    const { lancedb, LanceDbCloud } = loadProviders();

    await new LanceDbCloud().connect();
    expect(lancedb.connect.mock.calls[0]).toEqual([
      "db://my-database",
      { region: "us-west-2" },
    ]);
  });

  it("ignores blank credentials", async () => {
    process.env.LANCEDB_CLOUD_URI = EXTERNAL_URI;
    process.env.LANCEDB_CLOUD_API_KEY = "   ";
    process.env.LANCEDB_CLOUD_REGION = "";
    const { lancedb, LanceDbCloud } = loadProviders();

    await new LanceDbCloud().connect();
    expect(lancedb.connect.mock.calls[0]).toEqual([EXTERNAL_URI]);
  });

  it("throws when LANCEDB_CLOUD_URI is unset or blank", async () => {
    const { LanceDbCloud } = loadProviders();
    await expect(new LanceDbCloud().connect()).rejects.toThrow(
      "LanceDbCloud::LANCEDB_CLOUD_URI is not set."
    );

    process.env.LANCEDB_CLOUD_URI = "   ";
    await expect(new LanceDbCloud().connect()).rejects.toThrow(
      "LanceDbCloud::LANCEDB_CLOUD_URI is not set."
    );
  });

  // VECTOR_DB is already the new provider when the outgoing store is reset, so this provider must still connect.
  it("still connects when VECTOR_DB has already moved to the on-device provider", async () => {
    process.env.VECTOR_DB = "lancedb";
    process.env.LANCEDB_CLOUD_URI = EXTERNAL_URI;
    const { lancedb, LanceDbCloud } = loadProviders();

    await expect(new LanceDbCloud().connect()).resolves.toBeDefined();
    expect(lancedb.connect.mock.calls[0]).toEqual([EXTERNAL_URI]);
  });

  it("deletes its namespaces after VECTOR_DB has already moved to the on-device provider", async () => {
    process.env.VECTOR_DB = "lancedb";
    process.env.LANCEDB_CLOUD_URI = EXTERNAL_URI;
    const { lancedb, LanceDbCloud } = loadProviders();
    const provider = new LanceDbCloud();
    provider.namespaceExists = jest.fn().mockResolvedValue(true);
    provider.deleteVectorsInNamespace = jest.fn().mockResolvedValue(true);

    await provider["delete-namespace"]({ namespace: "my-workspace" });
    expect(lancedb.connect.mock.calls[0]).toEqual([EXTERNAL_URI]);
    expect(provider.deleteVectorsInNamespace).toHaveBeenCalledWith(
      expect.anything(),
      "my-workspace"
    );
  });

  it("caches the connection across calls", async () => {
    process.env.LANCEDB_CLOUD_URI = EXTERNAL_URI;
    const { lancedb, LanceDbCloud } = loadProviders();

    const first = await new LanceDbCloud().connect();
    const second = await new LanceDbCloud().connect();
    expect(lancedb.connect).toHaveBeenCalledTimes(1);
    expect(second.client).toBe(first.client);
  });

  it("re-establishes the connection when the uri or credentials change", async () => {
    process.env.LANCEDB_CLOUD_URI = EXTERNAL_URI;
    const { lancedb, LanceDbCloud } = loadProviders();

    const first = await new LanceDbCloud().connect();
    process.env.LANCEDB_CLOUD_URI = "s3://another-bucket/lancedb";
    const second = await new LanceDbCloud().connect();
    expect(second.client).not.toBe(first.client);

    process.env.LANCEDB_CLOUD_API_KEY = "sk-lancedb-test";
    const third = await new LanceDbCloud().connect();
    expect(third.client).not.toBe(second.client);
    expect(lancedb.connect).toHaveBeenCalledTimes(3);
  });

  it("resets by dropping every table instead of removing a directory from disk", async () => {
    process.env.LANCEDB_CLOUD_URI = EXTERNAL_URI;
    const { lancedb, LanceDbCloud } = loadProviders();
    const client = {
      uri: EXTERNAL_URI,
      tableNames: jest.fn().mockResolvedValue(["alpha", "beta"]),
      dropTable: jest.fn().mockResolvedValue(undefined),
    };
    lancedb.connect.mockResolvedValue(client);
    const fs = require("fs");
    jest.spyOn(fs, "rm").mockImplementation(() => null);

    expect(await new LanceDbCloud().reset()).toEqual({ reset: true });
    expect(client.dropTable).toHaveBeenCalledWith("alpha");
    expect(client.dropTable).toHaveBeenCalledWith("beta");
    expect(fs.rm).not.toHaveBeenCalled();
  });

  it("drops the cached connection after a reset", async () => {
    process.env.LANCEDB_CLOUD_URI = EXTERNAL_URI;
    const { lancedb, LanceDbCloud } = loadProviders();

    await new LanceDbCloud().connect();
    await new LanceDbCloud().reset();
    await new LanceDbCloud().connect();
    expect(lancedb.connect).toHaveBeenCalledTimes(2);
  });

  it("inherits unmodified parent methods", () => {
    const { LanceDbCloud } = loadProviders();
    const provider = new LanceDbCloud();

    expect(provider.distanceToSimilarity(0.25)).toBe(0.75);
    expect(
      provider.curateSources([{ text: "hello", metadata: { title: "a.txt" } }])
    ).toEqual([{ title: "a.txt", text: "hello" }]);
  });
});

describe("LanceDb is unaffected by the LanceDB Cloud settings", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...ORIGINAL_ENV,
      STORAGE_DIR,
      VECTOR_DB: "lancedb",
      LANCEDB_CLOUD_URI: EXTERNAL_URI,
      LANCEDB_CLOUD_API_KEY: "sk-lancedb-test",
      LANCEDB_CLOUD_REGION: "us-west-2",
    };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it("still connects to the local storage path with a single argument", async () => {
    const lancedb = require("@lancedb/lancedb");
    lancedb.connect.mockResolvedValue({ uri: "local" });
    const { LanceDb } = require("../../../../utils/vectorDbProviders/lance");
    const provider = new LanceDb();

    expect(provider.uri).toBe(path.resolve(STORAGE_DIR, "lancedb"));
    await provider.connect();
    expect(lancedb.connect.mock.calls[0]).toEqual([
      path.resolve(STORAGE_DIR, "lancedb"),
    ]);
  });
});
