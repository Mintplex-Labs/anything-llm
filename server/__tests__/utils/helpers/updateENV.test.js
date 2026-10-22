jest.mock("../../../utils/vectorStore/resetAllVectorStores", () => ({
  resetAllVectorStores: jest.fn().mockResolvedValue(true),
}));
jest.mock("../../../models/telemetry", () => ({
  Telemetry: { sendTelemetry: jest.fn() },
}));
jest.mock("../../../models/eventLogs", () => ({
  EventLogs: { logEvent: jest.fn() },
}));

const { updateENV } = require("../../../utils/helpers/updateENV");
const {
  resetAllVectorStores,
} = require("../../../utils/vectorStore/resetAllVectorStores");

const EMPTY_URI = "Invalid LanceDB Cloud URI. Must not be empty.";
const SPACED_URI = "Invalid LanceDB Cloud URI. Must not contain spaces.";
const UNSUPPORTED_URI =
  "Invalid LanceDB Cloud URI. Must be an absolute filesystem path or start with s3://, s3+ddb://, gs://, az:// or db://";

const LANCEDB_CLOUD_ENV_KEYS = [
  "LANCEDB_CLOUD_URI",
  "LANCEDB_CLOUD_API_KEY",
  "LANCEDB_CLOUD_REGION",
];

function useCleanEnv() {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...ORIGINAL_ENV };
    for (const key of LANCEDB_CLOUD_ENV_KEYS) delete process.env[key];
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });
}

describe("LanceDBCloudUri validation", () => {
  useCleanEnv();

  const validCases = [
    "s3://my-bucket/lancedb",
    "S3://MY-BUCKET/lancedb",
    "s3+ddb://my-bucket/lancedb",
    "gs://my-bucket/lancedb",
    "az://my-container/lancedb",
    "db://my-database",
    "DB://my-database",
    "s3://bucket-only",
    "/var/lib/lancedb",
    "C:\\storage\\lancedb",
    "C:/storage/lancedb",
    "  s3://my-bucket/lancedb  ",
  ];

  const invalidCases = [
    ["", EMPTY_URI],
    ["   ", EMPTY_URI],
    ["s3://my bucket/lancedb", SPACED_URI],
    ["relative/path/lancedb", UNSUPPORTED_URI],
    ["my-bucket", UNSUPPORTED_URI],
    ["http://localhost:8080", UNSUPPORTED_URI],
    ["postgresql://user:pass@host:5432/db", UNSUPPORTED_URI],
    ["db://", UNSUPPORTED_URI],
    ["C:relative/lancedb", UNSUPPORTED_URI],
  ];

  // The raw value is persisted as-is - the provider trims when it reads the ENV.
  it.each(validCases)("accepts %p", async (uri) => {
    const { newValues, error } = await updateENV({ LanceDBCloudUri: uri });

    expect(error).toBe(false);
    expect(newValues.LanceDBCloudUri).toBe(uri);
    expect(process.env.LANCEDB_CLOUD_URI).toBe(uri);
  });

  it.each(invalidCases)("rejects %p", async (uri, expected) => {
    const { newValues, error } = await updateENV({ LanceDBCloudUri: uri });

    expect(error).toContain(expected);
    expect(newValues.LanceDBCloudUri).toBeUndefined();
    expect(process.env.LANCEDB_CLOUD_URI).toBeUndefined();
  });
});

describe("LanceDB Cloud ENV keys", () => {
  useCleanEnv();

  it("persists a valid uri, api key and region", async () => {
    const { newValues, error } = await updateENV({
      LanceDBCloudUri: "s3://my-bucket/lancedb",
      LanceDBCloudApiKey: "sk-lancedb-test",
      LanceDBCloudRegion: "us-west-2",
    });

    expect(error).toBe(false);
    expect(newValues.LanceDBCloudUri).toBe("s3://my-bucket/lancedb");
    expect(process.env.LANCEDB_CLOUD_URI).toBe("s3://my-bucket/lancedb");
    expect(process.env.LANCEDB_CLOUD_API_KEY).toBe("sk-lancedb-test");
    expect(process.env.LANCEDB_CLOUD_REGION).toBe("us-west-2");
  });

  it("ignores an obscured api key sent back from the UI", async () => {
    process.env.LANCEDB_CLOUD_API_KEY = "sk-lancedb-test";
    const { newValues, error } = await updateENV({
      LanceDBCloudApiKey: "*".repeat(20),
    });

    expect(error).toBe(false);
    expect(newValues.LanceDBCloudApiKey).toBeUndefined();
    expect(process.env.LANCEDB_CLOUD_API_KEY).toBe("sk-lancedb-test");
  });
});

describe("swapping between the LanceDB providers resets the previous vector store", () => {
  useCleanEnv();

  it("resets lancedb when moving to lancedb_cloud", async () => {
    process.env.VECTOR_DB = "lancedb";
    const { error } = await updateENV({ VectorDB: "lancedb_cloud" });

    expect(error).toBe(false);
    expect(process.env.VECTOR_DB).toBe("lancedb_cloud");
    expect(resetAllVectorStores).toHaveBeenCalledWith({
      vectorDbKey: "lancedb",
    });
  });

  it("resets lancedb_cloud when moving back to lancedb", async () => {
    process.env.VECTOR_DB = "lancedb_cloud";
    const { error } = await updateENV({ VectorDB: "lancedb" });

    expect(error).toBe(false);
    expect(process.env.VECTOR_DB).toBe("lancedb");
    expect(resetAllVectorStores).toHaveBeenCalledWith({
      vectorDbKey: "lancedb_cloud",
    });
  });

  it("resets lancedb_cloud when the embedding engine changes", async () => {
    process.env.VECTOR_DB = "lancedb_cloud";
    process.env.EMBEDDING_ENGINE = "native";
    const { error } = await updateENV({ EmbeddingEngine: "openai" });

    expect(error).toBe(false);
    expect(resetAllVectorStores).toHaveBeenCalledWith({
      vectorDbKey: "lancedb_cloud",
    });
  });

  it("resets lancedb_cloud when the embedding model changes", async () => {
    process.env.VECTOR_DB = "lancedb_cloud";
    process.env.EMBEDDING_ENGINE = "openai";
    process.env.EMBEDDING_MODEL_PREF = "text-embedding-3-small";
    const { error } = await updateENV({
      EmbeddingModelPref: "text-embedding-3-large",
    });

    expect(error).toBe(false);
    expect(resetAllVectorStores).toHaveBeenCalledWith({
      vectorDbKey: "lancedb_cloud",
    });
  });

  it("does not reset when the provider is unchanged", async () => {
    process.env.VECTOR_DB = "lancedb_cloud";
    await updateENV({ VectorDB: "lancedb_cloud" });

    expect(resetAllVectorStores).not.toHaveBeenCalled();
  });
});
