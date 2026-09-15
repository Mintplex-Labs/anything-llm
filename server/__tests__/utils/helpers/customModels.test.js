/* eslint-env jest */

/**
 * Tests for the custom-model dispatcher in server/utils/helpers/customModels.js.
 *
 * The providers exercised here reach their endpoint with `fetch` directly, so the
 * dispatcher's own behavior can be observed without standing up a provider SDK.
 */

const {
  getCustomModels,
  SUPPORT_CUSTOM_MODELS,
} = require("../../../utils/helpers/customModels");

const BASE_PATH = "http://127.0.0.1:11434";

/**
 * The providers that read a base path and a token and then call `/api/tags`.
 * They share one implementation shape, so they share one set of expectations.
 */
const TAG_PROVIDERS = [
  {
    provider: "ollama",
    basePathEnv: "OLLAMA_BASE_PATH",
    authTokenEnv: "OLLAMA_AUTH_TOKEN",
  },
  {
    provider: "llmman",
    basePathEnv: "LLMMAN_BASE_PATH",
    authTokenEnv: "LLMMAN_AUTH_TOKEN",
  },
];

const ORIGINAL_ENV = process.env;
let requests;

/**
 * Answer every request with a model list, recording what was asked for.
 * @param {Object} response - `{ok, status, body}` to answer with
 */
function mockEndpoint({
  ok = true,
  status = 200,
  body = { models: [{ name: "llama3:latest" }] },
} = {}) {
  jest.spyOn(global, "fetch").mockImplementation(async (url, options = {}) => {
    requests.push({ url, headers: options.headers ?? {} });
    return { ok, status, json: async () => body };
  });
}

/**
 * Answer only when the request carries this exact bearer token, the way an
 * endpoint that requires authentication behaves.
 * @param {string} expectedToken
 */
function mockAuthenticatedEndpoint(expectedToken) {
  jest.spyOn(global, "fetch").mockImplementation(async (url, options = {}) => {
    const headers = options.headers ?? {};
    requests.push({ url, headers });
    if (headers.Authorization !== `Bearer ${expectedToken}`)
      return { ok: false, status: 401, json: async () => ({}) };
    return {
      ok: true,
      status: 200,
      json: async () => ({ models: [{ name: "llama3:latest" }] }),
    };
  });
}

beforeEach(() => {
  requests = [];
  process.env = { ...ORIGINAL_ENV };
  for (const { basePathEnv, authTokenEnv } of TAG_PROVIDERS) {
    delete process.env[basePathEnv];
    delete process.env[authTokenEnv];
  }
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

afterAll(() => {
  process.env = ORIGINAL_ENV;
});

describe("SUPPORT_CUSTOM_MODELS", () => {
  // Both consumers of this export read it with `.includes`, so membership is
  // the whole of its contract. This documents that, it does not stand in for
  // coverage of the arms behind each name.
  it("includes every provider this suite exercises", () => {
    for (const { provider } of TAG_PROVIDERS)
      expect(SUPPORT_CUSTOM_MODELS).toContain(provider);
  });
});

describe("getCustomModels provider guard", () => {
  it("rejects a provider that is not supported", async () => {
    mockEndpoint();
    expect(await getCustomModels("not-a-provider", null, BASE_PATH)).toEqual({
      models: [],
      error: "Invalid provider for custom models",
    });
    expect(requests).toHaveLength(0);
  });

  it("rejects an empty provider", async () => {
    mockEndpoint();
    expect(await getCustomModels()).toEqual({
      models: [],
      error: "Invalid provider for custom models",
    });
    expect(requests).toHaveLength(0);
  });
});

describe.each(TAG_PROVIDERS)(
  "getCustomModels for $provider",
  ({ provider, basePathEnv, authTokenEnv }) => {
    it("asks the given base path for its models", async () => {
      mockEndpoint();
      const { models, error } = await getCustomModels(
        provider,
        null,
        BASE_PATH
      );
      expect(error).toBeNull();
      expect(models).toEqual([{ id: "llama3:latest" }]);
      expect(requests).toHaveLength(1);
      expect(requests[0].url).toBe(`${BASE_PATH}/api/tags`);
    });

    it("falls back to the stored base path when none is given", async () => {
      process.env[basePathEnv] = BASE_PATH;
      mockEndpoint();
      await getCustomModels(provider, null, null);
      expect(requests[0].url).toBe(`${BASE_PATH}/api/tags`);
    });

    it("rejects a base path that is not a URL", async () => {
      mockEndpoint();
      expect(await getCustomModels(provider, null, "not a url")).toEqual({
        models: [],
        error: "Not a valid URL.",
      });
      expect(requests).toHaveLength(0);
    });

    it("rejects a base path that ends in a slash", async () => {
      mockEndpoint();
      expect(await getCustomModels(provider, null, `${BASE_PATH}/`)).toEqual({
        models: [],
        error: "Not a valid URL.",
      });
      expect(requests).toHaveLength(0);
    });

    it("sends no authorization header when there is no token", async () => {
      mockEndpoint();
      await getCustomModels(provider, null, BASE_PATH);
      expect(requests[0].headers.Authorization).toBeUndefined();
    });

    it("sends the token the caller supplied", async () => {
      mockAuthenticatedEndpoint("typed-token");
      const { models } = await getCustomModels(
        provider,
        "typed-token",
        BASE_PATH
      );
      expect(requests[0].headers.Authorization).toBe("Bearer typed-token");
      expect(models).toEqual([{ id: "llama3:latest" }]);
    });

    it("prefers the caller's token over one already stored", async () => {
      process.env[authTokenEnv] = "stale-token";
      mockAuthenticatedEndpoint("replacement-token");
      const { models } = await getCustomModels(
        provider,
        "replacement-token",
        BASE_PATH
      );
      expect(requests[0].headers.Authorization).toBe("Bearer replacement-token");
      expect(models).toEqual([{ id: "llama3:latest" }]);
    });

    it("uses the stored token when the caller supplies none", async () => {
      process.env[authTokenEnv] = "saved-token";
      mockAuthenticatedEndpoint("saved-token");
      const { models } = await getCustomModels(provider, null, BASE_PATH);
      expect(requests[0].headers.Authorization).toBe("Bearer saved-token");
      expect(models).toEqual([{ id: "llama3:latest" }]);
    });

    it("caches the supplied token after a nonempty model response", async () => {
      mockAuthenticatedEndpoint("typed-token");
      await getCustomModels(provider, "typed-token", BASE_PATH);
      expect(process.env[authTokenEnv]).toBe("typed-token");
    });

    it("leaves a stored token alone when the endpoint rejects the new one", async () => {
      process.env[authTokenEnv] = "saved-token";
      mockAuthenticatedEndpoint("some-other-token");
      const { models } = await getCustomModels(
        provider,
        "rejected-token",
        BASE_PATH
      );
      expect(requests[0].headers.Authorization).toBe("Bearer rejected-token");
      expect(models).toEqual([]);
      expect(process.env[authTokenEnv]).toBe("saved-token");
    });

    it("leaves a stored token alone when the response lists no models", async () => {
      process.env[authTokenEnv] = "saved-token";
      mockEndpoint({ body: { models: [] } });
      const { models } = await getCustomModels(
        provider,
        "empty-result-token",
        BASE_PATH
      );
      expect(models).toEqual([]);
      expect(process.env[authTokenEnv]).toBe("saved-token");
    });

    it("returns an empty list when the endpoint rejects the request", async () => {
      mockEndpoint({ ok: false, status: 401 });
      expect(await getCustomModels(provider, null, BASE_PATH)).toEqual({
        models: [],
        error: null,
      });
    });

    it("returns an empty list when the response has no models property", async () => {
      mockEndpoint({ body: {} });
      expect(await getCustomModels(provider, null, BASE_PATH)).toEqual({
        models: [],
        error: null,
      });
    });

    it("returns an empty list when the response lists an empty array", async () => {
      mockEndpoint({ body: { models: [] } });
      expect(await getCustomModels(provider, null, BASE_PATH)).toEqual({
        models: [],
        error: null,
      });
    });
  }
);
