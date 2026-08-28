/* eslint-env jest */

/**
 * Tests for Azure OpenAI (Azure AI Foundry) credential handling - the API key
 * default and the Microsoft Entra ID / managed identity path.
 *
 * Related issue: https://github.com/Mintplex-Labs/anything-llm/issues/6172
 */

let mockTokenCounter = 0;
const mockCredentialOptions = [];

jest.mock(
  "@azure/identity",
  () => ({
    DefaultAzureCredential: class {
      constructor(options = {}) {
        mockCredentialOptions.push(options);
        this.options = options;
      }
    },
    getBearerTokenProvider: (credential, scope) => async () =>
      `token-${++mockTokenCounter}|${scope}|${credential.options.managedIdentityClientId ?? "system-assigned"}`,
  }),
  { virtual: true }
);

describe("Azure OpenAI credentials", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    mockTokenCounter = 0;
    mockCredentialOptions.length = 0;
    process.env = { ...ORIGINAL_ENV };
    delete process.env.AZURE_OPENAI_CONNECTION_METHOD;
    delete process.env.AZURE_OPENAI_KEY;
    delete process.env.AZURE_OPENAI_MANAGED_IDENTITY_CLIENT_ID;
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  function loadCredentials() {
    return require("../../../../utils/AiProviders/azureOpenAi/credentials");
  }

  describe("api key (default)", () => {
    test("is the connection method when nothing is configured", () => {
      const { azureConnectionMethod, usesManagedIdentity } = loadCredentials();
      expect(azureConnectionMethod()).toBe("api_key");
      expect(usesManagedIdentity()).toBe(false);
    });

    test("an unrecognized connection method falls back to the api key", () => {
      process.env.AZURE_OPENAI_CONNECTION_METHOD = "something-else";
      const { azureConnectionMethod } = loadCredentials();
      expect(azureConnectionMethod()).toBe("api_key");
    });

    test("passes the key to both client shapes", () => {
      process.env.AZURE_OPENAI_KEY = "static-key";
      const { azureClientOptions, azureOpenAiClientOptions } =
        loadCredentials();
      expect(azureClientOptions()).toEqual({ apiKey: "static-key" });
      expect(azureOpenAiClientOptions()).toEqual({ apiKey: "static-key" });
    });

    test("still requires a key to be set", () => {
      const { validateAzureCredentials } = loadCredentials();
      expect(() => validateAzureCredentials()).toThrow(
        "No Azure API key was set."
      );
    });
  });

  describe("managed identity", () => {
    beforeEach(() => {
      process.env.AZURE_OPENAI_CONNECTION_METHOD = "managed_identity";
    });

    test("needs no API key", () => {
      const { usesManagedIdentity, validateAzureCredentials } =
        loadCredentials();
      expect(usesManagedIdentity()).toBe(true);
      expect(() => validateAzureCredentials()).not.toThrow();
    });

    test("hands the SDK's AzureOpenAI client a token provider instead of a key", async () => {
      const { azureOpenAiClientOptions } = loadCredentials();
      const options = azureOpenAiClientOptions();
      expect(options.apiKey).toBeUndefined();
      expect(typeof options.azureADTokenProvider).toBe("function");
      await expect(options.azureADTokenProvider()).resolves.toContain(
        "https://cognitiveservices.azure.com/.default"
      );
    });

    test("sets a bearer token on every request the plain client makes", async () => {
      const { azureClientOptions } = loadCredentials();
      const { apiKey, fetch: wrappedFetch } = azureClientOptions();

      // The SDK and LangChain both refuse to build a client without an apiKey,
      // but the header built from it is replaced below.
      expect(apiKey).toBeTruthy();

      const authHeaders = [];
      global.fetch = jest.fn(async (_url, init) => {
        authHeaders.push(new Headers(init.headers).get("authorization"));
        return { ok: true };
      });

      await wrappedFetch("https://x.openai.azure.com/openai/v1/models", {
        headers: { "content-type": "application/json" },
      });
      await wrappedFetch("https://x.openai.azure.com/openai/v1/models", {});

      expect(authHeaders[0]).toMatch(/^Bearer token-/);
      expect(authHeaders[1]).toMatch(/^Bearer token-/);
      expect(authHeaders[0]).toContain("system-assigned");
    });

    test("preserves the headers and request options the caller passed", async () => {
      const { azureClientOptions } = loadCredentials();
      const { fetch: wrappedFetch } = azureClientOptions();

      let captured = null;
      global.fetch = jest.fn(async (_url, init) => {
        captured = init;
        return { ok: true };
      });

      const controller = new AbortController();
      await wrappedFetch("https://x.openai.azure.com/openai/v1/models", {
        method: "POST",
        body: "{}",
        signal: controller.signal,
        headers: { "content-type": "application/json" },
      });

      expect(captured.method).toBe("POST");
      expect(captured.body).toBe("{}");
      expect(captured.signal).toBe(controller.signal);
      expect(new Headers(captured.headers).get("content-type")).toBe(
        "application/json"
      );
    });

    test("selects a user-assigned identity by client ID", async () => {
      process.env.AZURE_OPENAI_MANAGED_IDENTITY_CLIENT_ID = "client-id-123";
      const { azureOpenAiClientOptions } = loadCredentials();
      await expect(
        azureOpenAiClientOptions().azureADTokenProvider()
      ).resolves.toContain("client-id-123");
      expect(mockCredentialOptions[0]).toEqual({
        managedIdentityClientId: "client-id-123",
      });
    });

    test("omits the client ID entirely for a system-assigned identity", () => {
      const { azureOpenAiClientOptions } = loadCredentials();
      azureOpenAiClientOptions();
      expect(mockCredentialOptions[0]).toEqual({});
    });

    test("rebuilds the credential when the configured identity changes", async () => {
      const { azureOpenAiClientOptions } = loadCredentials();
      await azureOpenAiClientOptions().azureADTokenProvider();
      expect(mockCredentialOptions).toHaveLength(1);

      // Same identity - the cached provider is reused.
      await azureOpenAiClientOptions().azureADTokenProvider();
      expect(mockCredentialOptions).toHaveLength(1);

      process.env.AZURE_OPENAI_MANAGED_IDENTITY_CLIENT_ID = "client-id-123";
      await expect(
        azureOpenAiClientOptions().azureADTokenProvider()
      ).resolves.toContain("client-id-123");
      expect(mockCredentialOptions).toHaveLength(2);
    });
  });
});
