/* eslint-env jest */

/**
 * Tests for listing the deployments on an Azure OpenAI (Azure AI Foundry)
 * resource, which is what backs the deployment dropdown in the LLM settings.
 *
 * Related issue: https://github.com/Mintplex-Labs/anything-llm/issues/6172
 */

const mockCredentialOptions = [];

jest.mock(
  "@azure/identity",
  () => ({
    DefaultAzureCredential: class {
      constructor(options = {}) {
        mockCredentialOptions.push(options);
      }
      async getToken(scope) {
        return { token: `token|${scope}` };
      }
    },
    getBearerTokenProvider: (credential, scope) => async () => `token|${scope}`,
  }),
  { virtual: true }
);

const HOST = "https://my-resource.services.ai.azure.com";

/** Every deployment shape the route can return, including ones to drop. */
const DEPLOYMENTS = {
  data: [
    { id: "gpt-4o", model: "gpt-4o", status: "succeeded" },
    { id: "ada", model: "text-embedding-ada-002", status: "succeeded" },
    { id: "partner", model: "Kimi-K2.6", status: "succeeded" },
    { id: "half-built", model: "gpt-4o", status: "creating" },
  ],
};

const CATALOG = {
  data: [
    { id: "gpt-4o", capabilities: { chat_completion: true } },
    { id: "text-embedding-ada-002", capabilities: { embeddings: true } },
  ],
};

describe("Azure OpenAI deployment listing", () => {
  const ORIGINAL_ENV = process.env;
  let requests;

  beforeEach(() => {
    jest.resetModules();
    mockCredentialOptions.length = 0;
    requests = [];
    process.env = { ...ORIGINAL_ENV };
    delete process.env.AZURE_OPENAI_ENDPOINT;
    delete process.env.AZURE_OPENAI_KEY;
    delete process.env.AZURE_OPENAI_CONNECTION_METHOD;
    delete process.env.AZURE_OPENAI_MANAGED_IDENTITY_CLIENT_ID;

    global.fetch = jest.fn(async (url, init) => {
      requests.push({ url, headers: init.headers });
      const body = url.includes("/deployments") ? DEPLOYMENTS : CATALOG;
      return { ok: true, json: async () => body };
    });
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  function subject() {
    return require("../../../../utils/AiProviders/azureOpenAi/models");
  }

  it("returns an error rather than throwing when no endpoint is configured", async () => {
    const { listAzureDeployments } = subject();
    const { models, error } = await listAzureDeployments({});
    expect(models).toEqual([]);
    expect(error).toMatch(/endpoint/i);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("falls back to the saved endpoint", async () => {
    process.env.AZURE_OPENAI_ENDPOINT = HOST;
    process.env.AZURE_OPENAI_KEY = "secret";
    const { listAzureDeployments } = subject();
    const { error } = await listAzureDeployments({});
    expect(error).toBeNull();
    expect(requests[0].url).toContain(HOST);
  });

  it("drops a project path from the endpoint", async () => {
    const { listAzureDeployments } = subject();
    await listAzureDeployments({
      endpoint: `${HOST}/api/projects/my-project`,
      apiKey: "secret",
    });
    expect(requests[0].url).toBe(
      `${HOST}/openai/deployments?api-version=2023-03-15-preview`
    );
  });

  it("only returns deployments that finished provisioning", async () => {
    const { listAzureDeployments } = subject();
    const { models } = await listAzureDeployments({
      endpoint: HOST,
      apiKey: "secret",
    });
    expect(models.map((m) => m.id)).not.toContain("half-built");
  });

  it("classifies deployments by the capability of their model", async () => {
    const { listAzureDeployments } = subject();
    const { models } = await listAzureDeployments({
      endpoint: HOST,
      apiKey: "secret",
    });
    expect(models).toEqual([
      { id: "gpt-4o", model: "gpt-4o", type: "chat" },
      { id: "ada", model: "text-embedding-ada-002", type: "embedding" },
      { id: "partner", model: "Kimi-K2.6", type: "unknown" },
    ]);
  });

  it("keeps a deployment whose model the catalog does not list", async () => {
    const { listAzureDeployments } = subject();
    const { models } = await listAzureDeployments({
      endpoint: HOST,
      apiKey: "secret",
    });
    // A resource can serve models absent from the catalog, so an unrecognized
    // one must stay selectable rather than be hidden as unusable.
    expect(models.find((m) => m.id === "partner").type).toBe("unknown");
  });

  it("sends the API key in Azure's own header", async () => {
    const { listAzureDeployments } = subject();
    await listAzureDeployments({
      endpoint: HOST,
      apiKey: "secret",
      connectionMethod: "api_key",
    });
    expect(requests[0].headers).toEqual({ "api-key": "secret" });
  });

  it("sends a bearer token for managed identity and never the key header", async () => {
    const { listAzureDeployments } = subject();
    await listAzureDeployments({
      endpoint: HOST,
      connectionMethod: "managed_identity",
    });
    expect(requests[0].headers.Authorization).toBe(
      "Bearer token|https://cognitiveservices.azure.com/.default"
    );
    expect(requests[0].headers["api-key"]).toBeUndefined();
  });

  it("selects a user-assigned identity by client ID", async () => {
    const { listAzureDeployments } = subject();
    await listAzureDeployments({
      endpoint: HOST,
      connectionMethod: "managed_identity",
      managedIdentityClientId: "client-id",
    });
    expect(mockCredentialOptions[0]).toEqual({
      managedIdentityClientId: "client-id",
    });
  });

  it("omits the client ID for a system-assigned identity", async () => {
    const { listAzureDeployments } = subject();
    await listAzureDeployments({
      endpoint: HOST,
      connectionMethod: "managed_identity",
    });
    expect(mockCredentialOptions[0]).toEqual({});
  });

  it("reports a failed listing instead of returning an empty dropdown", async () => {
    global.fetch = jest.fn(async () => ({ ok: false, json: async () => ({}) }));
    const { listAzureDeployments } = subject();
    const { models, error } = await listAzureDeployments({
      endpoint: HOST,
      apiKey: "secret",
    });
    expect(models).toEqual([]);
    expect(error).toMatch(/could not list deployments/i);
  });

  it("still lists deployments when the capability catalog is unavailable", async () => {
    global.fetch = jest.fn(async (url) => ({
      ok: url.includes("/deployments"),
      json: async () => DEPLOYMENTS,
    }));
    const { listAzureDeployments } = subject();
    const { models, error } = await listAzureDeployments({
      endpoint: HOST,
      apiKey: "secret",
    });
    expect(error).toBeNull();
    expect(models.every((m) => m.type === "unknown")).toBe(true);
  });
});
