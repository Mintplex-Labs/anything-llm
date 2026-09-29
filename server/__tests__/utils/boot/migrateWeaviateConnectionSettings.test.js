/* eslint-env jest */
/**
 * Boot migration from the old Weaviate URL settings to the explicit
 * deployment / connection / auth settings.
 */
const migrateWeaviateConnectionSettings = require("../../../utils/boot/migrateWeaviateConnectionSettings");
const { Weaviate } = require("../../../utils/vectorDbProviders/weaviate");

const ORIGINAL_ENV = process.env;

function setLegacyEnv(values) {
  process.env = { ...ORIGINAL_ENV };
  for (const key of Object.keys(process.env))
    if (key.startsWith("WEAVIATE_")) delete process.env[key];
  delete process.env.VECTOR_DB; // keep post-update hooks idle
  Object.assign(process.env, values);
}

beforeEach(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

afterAll(() => {
  process.env = ORIGINAL_ENV;
});

describe("migrateWeaviateConnectionSettings", () => {
  const legacyConfigs = [
    ["local http", { WEAVIATE_ENDPOINT: "http://localhost:8080" }],
    [
      "docker service with API key",
      { WEAVIATE_ENDPOINT: "http://weaviate:8080", WEAVIATE_API_KEY: "k" },
    ],
    ["https without port", { WEAVIATE_ENDPOINT: "https://vectors.example.com" }],
    [
      "path behind a reverse proxy",
      { WEAVIATE_ENDPOINT: "https://proxy.example.com/weaviate/" },
    ],
    [
      "explicit gRPC URL",
      {
        WEAVIATE_ENDPOINT: "http://rest:8080",
        WEAVIATE_GRPC_ENDPOINT: "http://grpc-host:50052",
      },
    ],
    [
      "bare host:port gRPC endpoint",
      {
        WEAVIATE_ENDPOINT: "https://vectors.example.com",
        WEAVIATE_GRPC_ENDPOINT: "grpc.example.com:50051",
      },
    ],
    [
      "Weaviate Cloud",
      {
        WEAVIATE_ENDPOINT: "https://abc.c0.europe-west3.gcp.weaviate.cloud",
        WEAVIATE_API_KEY: "wcd-key",
      },
    ],
    [
      "Weaviate Cloud host with an explicit gRPC endpoint",
      {
        WEAVIATE_ENDPOINT: "https://abc.c0.europe-west3.gcp.weaviate.cloud",
        WEAVIATE_GRPC_ENDPOINT:
          "https://grpc-abc.c0.europe-west3.gcp.weaviate.cloud:443",
        WEAVIATE_API_KEY: "wcd-key",
      },
    ],
  ];

  it.each(legacyConfigs)(
    "%s: the connection is identical before and after migrating",
    async (_, legacy) => {
      setLegacyEnv(legacy);
      const before = new Weaviate().connectionConfig();

      const written = await migrateWeaviateConnectionSettings();
      expect(written).not.toBeNull();
      expect(process.env.WEAVIATE_DEPLOYMENT).toBe(before.method);

      expect(new Weaviate().connectionConfig()).toEqual(before);
      // The old URL settings are kept for rollbacks.
      for (const [key, value] of Object.entries(legacy))
        expect(process.env[key]).toBe(value);
    }
  );

  it("writes the explicit custom settings", async () => {
    setLegacyEnv({
      WEAVIATE_ENDPOINT: "https://proxy.example.com:8443/weaviate",
      WEAVIATE_API_KEY: "k",
    });
    expect(await migrateWeaviateConnectionSettings()).toEqual({
      WeaviateDeployment: "custom",
      WeaviateHttpHost: "proxy.example.com",
      WeaviateHttpPort: "8443",
      WeaviateHttpSecure: "true",
      WeaviateHttpPath: "/weaviate",
      WeaviateGrpcHost: "proxy.example.com",
      WeaviateGrpcPort: "50051",
      WeaviateGrpcSecure: "true",
      WeaviateAuthMethod: "api-key",
    });
    expect(process.env).toEqual(
      expect.objectContaining({
        WEAVIATE_HTTP_HOST: "proxy.example.com",
        WEAVIATE_HTTP_PORT: "8443",
        WEAVIATE_GRPC_PORT: "50051",
        WEAVIATE_AUTH_METHOD: "api-key",
      })
    );
  });

  it("uses no auth when there is no API key", async () => {
    setLegacyEnv({ WEAVIATE_ENDPOINT: "http://localhost:8080" });
    await migrateWeaviateConnectionSettings();
    expect(process.env.WEAVIATE_AUTH_METHOD).toBe("none");
  });

  it("writes only the deployment and auth for Weaviate Cloud", async () => {
    setLegacyEnv({
      WEAVIATE_ENDPOINT: "https://abc.c0.europe-west3.gcp.weaviate.cloud",
      WEAVIATE_API_KEY: "wcd-key",
    });
    expect(await migrateWeaviateConnectionSettings()).toEqual({
      WeaviateDeployment: "cloud",
      WeaviateAuthMethod: "api-key",
    });
    expect(process.env.WEAVIATE_HTTP_HOST).toBeUndefined();
  });

  it("runs only once", async () => {
    setLegacyEnv({ WEAVIATE_ENDPOINT: "http://localhost:8080" });
    expect(await migrateWeaviateConnectionSettings()).not.toBeNull();
    const after = { ...process.env };
    expect(await migrateWeaviateConnectionSettings()).toBeNull();
    expect(process.env).toEqual(after);
  });

  it.each([
    ["no Weaviate settings", {}],
    [
      "already on the new settings",
      { WEAVIATE_DEPLOYMENT: "custom", WEAVIATE_ENDPOINT: "http://x:8080" },
    ],
    [
      "explicit host without a deployment",
      { WEAVIATE_HTTP_HOST: "weaviate", WEAVIATE_ENDPOINT: "http://x:8080" },
    ],
  ])("does nothing with %s", async (_, values) => {
    setLegacyEnv(values);
    const before = { ...process.env };
    expect(await migrateWeaviateConnectionSettings()).toBeNull();
    expect(process.env).toEqual(before);
  });

  it("keeps settings it cannot interpret unchanged", async () => {
    setLegacyEnv({ WEAVIATE_ENDPOINT: "not a url" });
    const before = { ...process.env };
    expect(await migrateWeaviateConnectionSettings()).toBeNull();
    expect(process.env).toEqual(before);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining("keeping them as they are")
    );
  });
});
