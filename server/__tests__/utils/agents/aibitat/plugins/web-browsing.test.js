/* eslint-env jest */
process.env.STORAGE_DIR = __dirname;
process.env.NODE_ENV = "test";

const {
  webBrowsing,
} = require("../../../../../../utils/agents/aibitat/plugins/web-browsing.js");

/**
 * Tests for the fastCRW search provider (`crw-search`) in the web-browsing plugin.
 *
 * fastCRW is a Firecrawl-compatible web data engine. These tests mirror the
 * existing sibling providers (e.g. Tavily) and exercise the `_crwSearch` helper
 * in isolation with a mocked global `fetch` (no network access).
 */

/**
 * Extract the function config object passed to `aibitat.function(...)` so we can
 * call the private engine helpers directly, then build a `this` context that
 * stubs out the `super` plumbing the helpers rely on.
 */
function buildContext() {
  let config = null;
  const aibitat = {
    function: (fn) => {
      config = fn;
    },
  };
  webBrowsing.plugin().setup(aibitat);

  const introspections = [];
  const logs = [];
  const citations = [];
  const context = {
    ...config,
    caller: "@agent",
    super: {
      introspect: (msg) => introspections.push(msg),
      handlerProps: { log: (msg) => logs.push(msg) },
      addCitation: (c) => citations.push(c),
    },
    __introspections: introspections,
    __logs: logs,
    __citations: citations,
  };
  return context;
}

describe("web-browsing crw-search provider", () => {
  const ORIGINAL_ENV = { ...process.env };
  let originalFetch;

  beforeEach(() => {
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    process.env = { ...ORIGINAL_ENV };
    jest.restoreAllMocks();
  });

  it("is disabled when AGENT_CRW_API_KEY is not set", async () => {
    delete process.env.AGENT_CRW_API_KEY;
    const ctx = buildContext();
    global.fetch = jest.fn();

    const result = await ctx._crwSearch.call(ctx, "anythingllm updates");
    expect(result).toMatch(/Search is disabled/);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("calls the default cloud endpoint with a Bearer header and maps results", async () => {
    process.env.AGENT_CRW_API_KEY = "test-key";
    delete process.env.AGENT_CRW_API_URL;
    const ctx = buildContext();

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: [
          {
            title: "AnythingLLM",
            url: "https://anythingllm.com",
            description: "Docs and updates.",
          },
        ],
      }),
    });

    const result = await ctx._crwSearch.call(ctx, "anythingllm updates");

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [calledUrl, calledOpts] = global.fetch.mock.calls[0];
    expect(calledUrl).toBe("https://fastcrw.com/api/v1/search");
    expect(calledOpts.method).toBe("POST");
    expect(calledOpts.headers.Authorization).toBe("Bearer test-key");
    expect(JSON.parse(calledOpts.body)).toEqual({
      query: "anythingllm updates",
    });

    const parsed = JSON.parse(result);
    expect(parsed).toEqual([
      {
        title: "AnythingLLM",
        link: "https://anythingllm.com",
        snippet: "Docs and updates.",
      },
    ]);
    expect(ctx.__citations.length).toBe(1);
  });

  it("honors a self-hosted base URL override and trims trailing slashes", async () => {
    process.env.AGENT_CRW_API_KEY = "test-key";
    process.env.AGENT_CRW_API_URL = "http://localhost:3000/";
    const ctx = buildContext();

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: [] }),
    });

    await ctx._crwSearch.call(ctx, "self hosted");
    const [calledUrl] = global.fetch.mock.calls[0];
    expect(calledUrl).toBe("http://localhost:3000/v1/search");
  });

  it("returns an error string when the API responds with success:false", async () => {
    process.env.AGENT_CRW_API_KEY = "test-key";
    const ctx = buildContext();

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: false, error: "rate limited" }),
    });

    const result = await ctx._crwSearch.call(ctx, "boom");
    expect(result).toMatch(/There was an error searching for content/);
    expect(result).toMatch(/rate limited/);
  });

  it("returns a no-results string when data is empty", async () => {
    process.env.AGENT_CRW_API_KEY = "test-key";
    const ctx = buildContext();

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: [] }),
    });

    const result = await ctx._crwSearch.call(ctx, "nothing");
    expect(result).toMatch(/No information was found online/);
  });
});
