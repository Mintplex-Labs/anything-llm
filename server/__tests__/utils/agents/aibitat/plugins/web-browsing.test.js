/* eslint-env jest */
const fs = require("fs");
const os = require("os");
const path = require("path");

process.env.STORAGE_DIR = fs.mkdtempSync(
  path.join(os.tmpdir(), "web-browsing-test-")
);
jest.mock("../../../../../models/systemSettings", () => ({
  SystemSettings: {
    get: jest.fn().mockResolvedValue({ value: "anysearch-search" }),
  },
}));
jest.mock("../../../../../utils/helpers/tiktoken", () => ({
  TokenManager: class {
    countFromString() {
      return 42;
    }
  },
}));
jest.mock("../../../../../endpoints/utils", () => ({
  getAnythingLLMUserAgent: () => "AnythingLLM",
}));

const { SystemSettings } = require("../../../../../models/systemSettings");
const {
  webBrowsing,
} = require("../../../../../utils/agents/aibitat/plugins/web-browsing");

/**
 * The plugin registers one `web_search` function via aibitat.function({...}).
 * Capture that config object so its dispatcher (`search`) and AnySearch
 * engine (`_anySearchSearch`) can be exercised with a controlled context.
 */
function loadSearchTool() {
  let tool;
  const aibitat = {
    function: (cfg) => {
      tool = cfg;
    },
  };
  webBrowsing.plugin().setup(aibitat);
  return tool;
}

function makeContext(tool) {
  // At runtime aibitat binds the function config's own methods (search,
  // engine functions, citation helpers) onto the invocation context.
  return {
    ...tool,
    caller: "agent",
    super: {
      introspect: jest.fn(),
      handlerProps: { log: jest.fn() },
      addCitation: jest.fn(),
    },
    countTokens: () => 42,
  };
}

function mockFetch(payload, { ok = true, status, statusText } = {}) {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    status,
    statusText,
    json: async () => payload,
  });
}

function envelope(results) {
  return { code: 0, message: "success", data: { results } };
}

const RESULT = {
  title: "AnySearch docs",
  url: "https://anysearch.com/docs",
  snippet: "Search API for agents",
};

describe("web-browsing AnySearch engine", () => {
  let tool;
  beforeEach(() => {
    jest.clearAllMocks();
    SystemSettings.get.mockResolvedValue({ value: "anysearch-search" });
    process.env.AGENT_ANYSEARCH_API_KEY = "test-key";
    tool = loadSearchTool();
  });

  afterAll(() =>
    fs.rmSync(process.env.STORAGE_DIR, { recursive: true, force: true })
  );

  test("tool schema exposes query and count", () => {
    expect(tool.parameters.properties.query.type).toBe("string");
    expect(tool.parameters.properties.count.type).toBe("number");
  });

  test("searches with Bearer auth and maps results", async () => {
    mockFetch(envelope([RESULT, { ...RESULT, url: "https://example.com/2" }]));
    const ctx = makeContext(tool);
    const out = await tool.search.call(ctx, "what is anysearch");

    const [url, init] = global.fetch.mock.calls[0];
    expect(url).toBe("https://api.anysearch.com/v1/search");
    expect(init.method).toBe("POST");
    expect(init.headers.Authorization).toBe("Bearer test-key");
    expect(JSON.parse(init.body)).toEqual({
      query: "what is anysearch",
      max_results: 10,
    });

    const data = JSON.parse(out);
    expect(data).toHaveLength(2);
    expect(data[0]).toMatchObject({
      title: "AnySearch docs",
      link: "https://anysearch.com/docs",
      snippet: "Search API for agents",
    });
    expect(ctx.super.addCitation).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          title: "AnySearch docs",
          chunkSource: "link://https://anysearch.com/docs",
        }),
      ])
    );
  });

  test.each([
    [3, 3],
    [50, 10],
    [0, 10],
    ["7", 7],
    [undefined, 10],
  ])("maps count %p to max_results %p", async (count, expected) => {
    mockFetch(envelope([RESULT]));
    await tool.search.call(makeContext(tool), "q", count);
    expect(JSON.parse(global.fetch.mock.calls[0][1].body).max_results).toBe(
      expected
    );
  });

  test("searches anonymously without an API key", async () => {
    delete process.env.AGENT_ANYSEARCH_API_KEY;
    mockFetch(envelope([RESULT]));
    const ctx = makeContext(tool);
    const out = await tool.search.call(ctx, "anonymous query");

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch.mock.calls[0][1].headers.Authorization).toBeUndefined();
    expect(JSON.parse(out)[0].link).toBe("https://anysearch.com/docs");
  });

  test("surfaces the API message on an auth failure", async () => {
    mockFetch(
      { code: -1, message: "Invalid API key." },
      { ok: false, status: 401, statusText: "Unauthorized" }
    );
    const out = await tool.search.call(makeContext(tool), "q");
    expect(out).toBe(
      "There was an error searching for content. Invalid API key."
    );
  });

  test("surfaces the API message when rate limited", async () => {
    mockFetch(
      { code: 429, message: "Rate limit exceeded" },
      { ok: false, status: 429, statusText: "Too Many Requests" }
    );
    const out = await tool.search.call(makeContext(tool), "q");
    expect(out).toBe(
      "There was an error searching for content. Rate limit exceeded"
    );
  });

  test("reports a timeout instead of hanging errors", async () => {
    global.fetch = jest.fn().mockRejectedValue(
      Object.assign(new Error("The operation was aborted"), {
        name: "TimeoutError",
      })
    );
    const out = await tool.search.call(makeContext(tool), "q");
    expect(out).toBe(
      "There was an error searching for content. Request timed out after 20s"
    );
  });

  test("errors on code:0 envelope missing data.results", async () => {
    mockFetch({ code: 0, message: "success", data: {} });
    const out = await tool.search.call(makeContext(tool), "q");
    expect(out).toContain("Unexpected AnySearch response");
    expect(out).not.toContain("No information was found");
  });

  test("falls back to HTTP status text on a non-JSON error body", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 502,
      statusText: "Bad Gateway",
      json: async () => {
        throw new Error("invalid json");
      },
    });
    const out = await tool.search.call(makeContext(tool), "q");
    expect(out).toBe(
      "There was an error searching for content. 502 - Bad Gateway"
    );
  });
});
