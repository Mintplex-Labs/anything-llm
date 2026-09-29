/* eslint-env jest */
/**
 * Validation of the Weaviate settings saved from the vector database settings
 * page (updateENV).
 */
const { updateENV } = require("../../../utils/helpers/updateENV");

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
    expect(process.env.WEAVIATE_HEADERS).toBe('{"X-Gateway": "abc"}');
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
