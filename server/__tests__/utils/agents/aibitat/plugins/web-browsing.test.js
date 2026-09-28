/* eslint-env jest */
jest.mock("../../../../../models/systemSettings", () => ({
  SystemSettings: { get: jest.fn() },
}));
jest.mock("../../../../../endpoints/utils", () => ({
  getAnythingLLMUserAgent: jest.fn(() => "AnythingLLM/test"),
}));

const { SystemSettings } = require("../../../../../models/systemSettings");
const {
  webBrowsing,
} = require("../../../../../utils/agents/aibitat/plugins/web-browsing.js");

function setupPlugin() {
  const aibitat = {
    introspect: jest.fn(),
    addCitation: jest.fn(),
    handlerProps: { log: jest.fn() },
    function: (config) => (aibitat._fn = config),
  };
  webBrowsing.plugin.call(webBrowsing).setup(aibitat);
  return { aibitat, skill: aibitat._fn };
}

function mockFetchResponse({ ok = true, status = 200, body = {} } = {}) {
  return jest.fn().mockResolvedValue({
    ok,
    status,
    statusText: ok ? "OK" : "Error",
    json: jest.fn().mockResolvedValue(body),
  });
}

const originalFetch = global.fetch;
const originalKey = process.env.AGENT_LINKUP_API_KEY;

beforeEach(() => {
  jest.clearAllMocks();
  process.env.AGENT_LINKUP_API_KEY = "linkup-test-key";
});

afterAll(() => {
  global.fetch = originalFetch;
  if (originalKey === undefined) delete process.env.AGENT_LINKUP_API_KEY;
  else process.env.AGENT_LINKUP_API_KEY = originalKey;
});

describe("web-browsing Linkup search", () => {
  test("routes the linkup-search provider to Linkup", async () => {
    SystemSettings.get.mockResolvedValue({ value: "linkup-search" });
    global.fetch = mockFetchResponse({ body: { results: [] } });
    const { skill } = setupPlugin();

    await skill.search("anythingllm");

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.linkup.so/v1/search",
      expect.anything()
    );
  });

  test("sends the query with a bearer token and maps text results", async () => {
    global.fetch = mockFetchResponse({
      body: {
        results: [
          {
            type: "text",
            name: "AnythingLLM",
            url: "https://anythingllm.com",
            content: "The all-in-one AI application.",
          },
          {
            type: "image",
            name: "AnythingLLM logo",
            url: "https://anythingllm.com/logo.png",
          },
        ],
      },
    });
    const { aibitat, skill } = setupPlugin();

    const result = await skill._linkupSearch("what is anythingllm");

    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toBe("https://api.linkup.so/v1/search");
    expect(options.method).toBe("POST");
    expect(options.headers.Authorization).toBe("Bearer linkup-test-key");
    expect(JSON.parse(options.body)).toEqual({
      q: "what is anythingllm",
      depth: "standard",
      outputType: "searchResults",
      maxResults: 10,
    });
    expect(JSON.parse(result)).toEqual([
      {
        title: "AnythingLLM",
        link: "https://anythingllm.com",
        snippet: "The all-in-one AI application.",
      },
    ]);
    expect(aibitat.addCitation).toHaveBeenCalledWith([
      expect.objectContaining({
        id: "https://anythingllm.com",
        chunkSource: "link://https://anythingllm.com",
      }),
    ]);
  });

  test("does not call Linkup when no API key is set", async () => {
    delete process.env.AGENT_LINKUP_API_KEY;
    global.fetch = jest.fn();
    const { skill } = setupPlugin();

    const result = await skill._linkupSearch("anythingllm");

    expect(global.fetch).not.toHaveBeenCalled();
    expect(result).toMatch(/Search is disabled/);
  });

  test("surfaces the error message returned by Linkup", async () => {
    global.fetch = mockFetchResponse({
      ok: false,
      status: 401,
      body: { error: { code: "UNAUTHORIZED", message: "Unauthorized action" } },
    });
    const { aibitat, skill } = setupPlugin();

    const result = await skill._linkupSearch("anythingllm");

    expect(result).toBe(
      "There was an error searching for content. Unauthorized action"
    );
    expect(aibitat.handlerProps.log).toHaveBeenCalledWith(
      "Linkup Search Error: Unauthorized action"
    );
  });

  test("reports no results when Linkup returns nothing usable", async () => {
    global.fetch = mockFetchResponse({ body: { results: [] } });
    const { aibitat, skill } = setupPlugin();

    const result = await skill._linkupSearch("anythingllm");

    expect(result).toBe(
      "No information was found online for the search query."
    );
    expect(aibitat.addCitation).not.toHaveBeenCalled();
  });
});
