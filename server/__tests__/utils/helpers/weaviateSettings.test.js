/* eslint-env jest */
/**
 * Validation of the Weaviate settings saved from the vector database settings
 * page (updateENV).
 */
const fs = require("fs");
const { updateENV, dumpENV } = require("../../../utils/helpers/updateENV");
const { Weaviate } = require("../../../utils/vectorDbProviders/weaviate");

const ORIGINAL_ENV = process.env;

beforeEach(() => {
  process.env = { ...ORIGINAL_ENV };
  delete process.env.VECTOR_DB; // keep post-update hooks from touching Weaviate
  delete process.env.ANYTHING_LLM_RUNTIME;
});

afterAll(() => {
  process.env = ORIGINAL_ENV;
});

describe("Weaviate settings validation", () => {
  it("saves a full custom connection", async () => {
    const { error } = await updateENV({
      WeaviateDeployment: "custom",
      WeaviateEndpoint: "",
      WeaviateGrpcEndpoint: "",
      WeaviateHttpHost: "weaviate.internal",
      WeaviateHttpPort: "8080",
      WeaviateHttpSecure: "false",
      WeaviateHttpPath: "/weaviate",
      WeaviateGrpcHost: "",
      WeaviateGrpcPort: "50051",
      WeaviateGrpcSecure: "",
      WeaviateGrpcProxy: "",
      WeaviateAuthMethod: "oidc-password",
      WeaviateOidcUsername: "me",
      WeaviateOidcPassword: "pw",
      WeaviateOidcScopes: "openid offline_access",
      WeaviateHeaders: '{"X-Gateway": "abc"}',
      WeaviateTimeoutQuery: "45",
      WeaviateTimeoutInsert: "",
      WeaviateTimeoutInit: "1.5",
      WeaviateSkipInitChecks: "false",
    });
    expect(error).toBe(false);
    expect(process.env.WEAVIATE_HTTP_HOST).toBe("weaviate.internal");
    expect(process.env.WEAVIATE_HTTP_PATH).toBe("/weaviate");
    expect(process.env.WEAVIATE_AUTH_METHOD).toBe("oidc-password");
    expect(process.env.WEAVIATE_TIMEOUT_INIT).toBe("1.5");
    // Stored base64-encoded (see the .env round-trip test below).
    expect(process.env.WEAVIATE_HEADERS).toBe(
      `b64:${Buffer.from('{"X-Gateway": "abc"}').toString("base64")}`
    );
    expect(new Weaviate().headers()).toEqual(
      expect.objectContaining({ "X-Gateway": "abc" })
    );
  });

  it("every Weaviate setting survives the .env writer unchanged", async () => {
    // dumpENV cuts values at quotes, "#", backticks and some whitespace. It
    // runs after every settings save in production, so a value it truncates
    // is silently broken after the next restart.
    const { error } = await updateENV({
      WeaviateDeployment: "custom",
      WeaviateEndpoint: "https://weaviate.example.com/path",
      WeaviateGrpcEndpoint: "https://grpc.example.com:443",
      WeaviateHttpHost: "weaviate.example.com",
      WeaviateHttpPort: "443",
      WeaviateHttpSecure: "true",
      WeaviateHttpPath: "/weaviate",
      WeaviateGrpcHost: "grpc.example.com",
      WeaviateGrpcPort: "443",
      WeaviateGrpcSecure: "true",
      WeaviateGrpcProxy: "http://user:pass@proxy.example.com:3128",
      WeaviateAuthMethod: "oidc-client-credentials",
      WeaviateApiKey: "abc#123'x\"y",
      WeaviateOidcClientSecret: "s3cr3t`#value",
      WeaviateOidcUsername: "user@example.com",
      WeaviateOidcPassword: "p4ss#w0rd'\"",
      WeaviateOidcScopes: "openid offline_access",
      WeaviateAccessToken: "eyJhbGciOi.eyJzdWIi.sig-_",
      WeaviateAccessTokenExpiresIn: "3600",
      WeaviateRefreshToken: "refresh#token",
      WeaviateHeaders:
        '{"X-Gateway": "abc", "Authorization": "Bearer x#y\'z", "X-Json": "{\\"a\\": 1}"}',
      WeaviateTimeoutQuery: "30.5",
      WeaviateTimeoutInsert: "90",
      WeaviateTimeoutInit: "2",
      WeaviateSkipInitChecks: "false",
      WeaviateSearchMode: "hybrid",
      WeaviateHybridAlpha: "0.75",
      WeaviateHybridFusion: "relativeScore",
      WeaviateQuantization: "rq-8",
      WeaviateMultiTenancy: "false",
      WeaviateCollection: "AnythingLLM",
    });
    expect(error).toBe(false);

    const write = jest.spyOn(fs, "writeFileSync").mockImplementation(() => {});
    try {
      dumpENV();
      const written = Object.fromEntries(
        write.mock.calls[0][1]
          .split("\n")
          .filter((line) => line.startsWith("WEAVIATE_"))
          .map((line) => {
            const at = line.indexOf("=");
            return [line.slice(0, at), line.slice(at + 2, -1)];
          })
      );
      // Only the settings AnythingLLM manages (the shell may define others).
      const weaviateKeys = Object.keys(written);
      expect(weaviateKeys.length).toBeGreaterThan(25);
      for (const key of weaviateKeys)
        expect([key, written[key]]).toEqual([key, process.env[key]]);
    } finally {
      write.mockRestore();
    }
    // Secrets with such characters decode back to the original value.
    const decoded = (key) => {
      const v = process.env[key];
      return v.startsWith("b64:")
        ? Buffer.from(v.slice(4), "base64").toString()
        : v;
    };
    expect(decoded("WEAVIATE_API_KEY")).toBe("abc#123'x\"y");
    expect(decoded("WEAVIATE_OIDC_CLIENT_SECRET")).toBe("s3cr3t`#value");
    expect(decoded("WEAVIATE_OIDC_PASSWORD")).toBe("p4ss#w0rd'\"");
    expect(decoded("WEAVIATE_REFRESH_TOKEN")).toBe("refresh#token");
    // Safe values stay readable (and readable by older versions).
    expect(process.env.WEAVIATE_ACCESS_TOKEN).toBe("eyJhbGciOi.eyJzdWIi.sig-_");
    expect(new Weaviate().connectionConfig().options.authCredentials).toEqual(
      expect.objectContaining({ clientSecret: "s3cr3t`#value" })
    );
    expect(new Weaviate().headers()).toEqual(
      expect.objectContaining({
        "X-Gateway": "abc",
        Authorization: "Bearer x#y'z",
        "X-Json": '{"a": 1}',
      })
    );
  });

  it("saves the hybrid search settings, including alpha 0 and 1", async () => {
    for (const alpha of ["0", "1", "0.35"]) {
      const { error } = await updateENV({
        WeaviateSearchMode: "hybrid",
        WeaviateHybridAlpha: alpha,
        WeaviateHybridFusion: "relativeScore",
      });
      expect(error).toBe(false);
      expect(process.env.WEAVIATE_HYBRID_ALPHA).toBe(alpha);
    }
    expect(process.env.WEAVIATE_SEARCH_MODE).toBe("hybrid");
  });

  it("keeps a stored secret when the masked placeholder is sent back", async () => {
    process.env.WEAVIATE_OIDC_PASSWORD = "stored";
    process.env.WEAVIATE_HEADERS = '{"Authorization": "Bearer x"}';
    const { error } = await updateENV({
      WeaviateOidcPassword: "*".repeat(20),
      WeaviateHeaders: "*".repeat(20),
    });
    expect(error).toBe(false);
    expect(process.env.WEAVIATE_OIDC_PASSWORD).toBe("stored");
    expect(process.env.WEAVIATE_HEADERS).toBe('{"Authorization": "Bearer x"}');
  });

  it.each([
    ["WeaviateHttpHost", "http://weaviate", "host name or IP address only"],
    ["WeaviateHttpHost", "weaviate/path", "host name or IP address only"],
    ["WeaviateHttpPort", "0", "Port must be"],
    ["WeaviateHttpPort", "65536", "Port must be"],
    ["WeaviateGrpcPort", "12.5", "Port must be"],
    ["WeaviateHttpSecure", "yes", 'must be "true" or "false"'],
    ["WeaviateHttpPath", "weaviate", 'must start with "/"'],
    ["WeaviateGrpcProxy", "not a url", "not a valid URL"],
    ["WeaviateAuthMethod", "kerberos", "Invalid Weaviate authentication"],
    ["WeaviateHeaders", "{bad json", "JSON object of string values"],
    ["WeaviateHeaders", '{"a": 1}', "JSON object of string values"],
    ["WeaviateTimeoutQuery", "0", "greater than 0"],
    ["WeaviateTimeoutInit", "abc", "greater than 0"],
    ["WeaviateAccessTokenExpiresIn", "-5", "greater than 0"],
    ["WeaviateSkipInitChecks", "1", 'must be "true" or "false"'],
    ["WeaviateDeployment", "serverless", 'must be "cloud" or "custom"'],
    ["WeaviateQuantization", "fp8", "vector compression must be one of"],
    ["WeaviateMultiTenancy", "maybe", 'must be "true" or "false"'],
    ["WeaviateCollection", "bad-name", "must start with a letter"],
    ["WeaviateSearchMode", "semantic", 'must be "vector" or "hybrid"'],
    ["WeaviateHybridAlpha", "1.2", "between 0 and 1"],
    ["WeaviateHybridAlpha", "-0.1", "between 0 and 1"],
    ["WeaviateHybridAlpha", "high", "between 0 and 1"],
    ["WeaviateHybridFusion", "rrf", 'must be "relativeScore" or "ranked"'],
  ])("rejects %s=%p", async (key, value, message) => {
    const { error } = await updateENV({ [key]: value });
    expect(error).toMatch(message);
  });
});
