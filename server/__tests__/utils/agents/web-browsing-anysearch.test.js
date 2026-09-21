// Set required env vars before requiring modules
process.env.STORAGE_DIR = __dirname;
process.env.NODE_ENV = "test";

jest.mock("../../../models/systemSettings", () => ({
  SystemSettings: { get: jest.fn().mockResolvedValue(null) },
}));
jest.mock("../../../utils/helpers/tiktoken", () => ({
  TokenManager: class {
    countFromString() {
      return 100;
    }
  },
}));
jest.mock("../../../endpoints/utils", () => ({
  getAnythingLLMUserAgent: () => "AnythingLLM",
}));

const { webBrowsing } = require("../../../utils/agents/aibitat/plugins/web-browsing");

/**
 * The plugin registers itself via aibitat.function({...}); capture that
 * config object so its `_anySearchSearch` method can be exercised directly.
 */
function loadSearchHandler() {
  let handler;
  const aibitat = {
    function: (cfg) => {
      handler = cfg;
    },
    introspect: jest.fn(),
    handlerProps: { log: jest.fn() },
  };
  webBrowsing.plugin().setup(aibitat);
  return handler;
}

function mockFetchEnvelope(payload, ok = true) {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    json: async () => payload,
  });
}

describe("web-browsing _anySearchSearch", () => {
  let handler;
  beforeEach(() => {
    process.env.AGENT_ANYSEARCH_API_KEY = "test-key";
    handler = loadSearchHandler();
    handler.reportSearchResultsCitations = jest.fn();
  });
  afterEach(() => {
    delete process.env.AGENT_ANYSEARCH_API_KEY;
    delete global.fetch;
  });

  test("missing API key returns a configuration error, not a crash", async () => {
    delete process.env.AGENT_ANYSEARCH_API_KEY;

    const out = await handler._anySearchSearch("query");
    expect(out).toContain("AnySearch API key is missing");
    expect(out).toContain("https://anysearch.com/console/api-keys");
  });

  test("normalizes results to {title, link, snippet} and skips rows without a URL", async () => {
    mockFetchEnvelope({
      code: 0,
      data: {
        results: [
          { title: "Good", url: "https://ok.example", snippet: "s" },
          { title: "NoUrl", snippet: "x" },
          "not-a-dict",
        ],
      },
    });

    const out = await handler._anySearchSearch("query");
    const data = JSON.parse(out);

    expect(data).toHaveLength(1);
    expect(data[0]).toEqual({
      title: "Good",
      link: "https://ok.example",
      snippet: "s",
    });
    expect(handler.reportSearchResultsCitations).toHaveBeenCalledWith(data);
  });

  test("caps long snippets at 500 characters", async () => {
    mockFetchEnvelope({
      code: 0,
      data: {
        results: [{ title: "T", url: "https://t.example", snippet: "x".repeat(900) }],
      },
    });

    const data = JSON.parse(await handler._anySearchSearch("query"));
    expect(data[0].snippet).toHaveLength(500);
  });

  test("API-level error (non-zero code) returns an error message instead of throwing", async () => {
    mockFetchEnvelope({ code: 1001, message: "rate limited" });

    const out = await handler._anySearchSearch("query");
    expect(out).toContain("There was an error searching for content");
    expect(out).toContain("rate limited");
    expect(handler.reportSearchResultsCitations).not.toHaveBeenCalled();
  });

  test("HTTP error status returns an error message", async () => {
    mockFetchEnvelope({}, false);

    const out = await handler._anySearchSearch("query");
    expect(out).toContain("There was an error searching for content");
  });

  test("network failure returns an error message", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("boom"));

    const out = await handler._anySearchSearch("query");
    expect(out).toContain("There was an error searching for content");
    expect(out).toContain("boom");
  });

  test("non-OK responses surface the API envelope message when present", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      json: async () => ({ code: -1, message: "Invalid API key." }),
    });

    const out = await handler._anySearchSearch("query");
    expect(out).toContain("There was an error searching for content");
    expect(out).toContain("Invalid API key.");
  });

  test("empty results returns the no-results message", async () => {
    mockFetchEnvelope({ code: 0, data: { results: [] } });

    const out = await handler._anySearchSearch("query");
    expect(out).toBe("No information was found online for the search query.");
    expect(handler.reportSearchResultsCitations).not.toHaveBeenCalled();
  });
});
