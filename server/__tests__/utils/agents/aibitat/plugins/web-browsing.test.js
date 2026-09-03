/* eslint-env jest */
jest.mock("../../../../../models/systemSettings", () => ({
  SystemSettings: { get: jest.fn() },
}));
jest.mock("../../../../../utils/helpers/tiktoken", () => ({
  TokenManager: jest.fn().mockImplementation(() => ({
    countFromString: jest.fn(() => 0),
  })),
}));
jest.mock("../../../../../endpoints/utils", () => ({
  getAnythingLLMUserAgent: jest.fn(() => "AnythingLLM"),
}));

const {
  webBrowsing,
} = require("../../../../../utils/agents/aibitat/plugins/web-browsing.js");

const ORIGINAL_CRW_KEY = process.env.AGENT_CRW_API_KEY;
const ORIGINAL_CRW_URL = process.env.AGENT_CRW_API_URL;

function setup() {
  const aibitat = {
    introspect: jest.fn(),
    addCitation: jest.fn(),
    handlerProps: { log: jest.fn() },
    function: (config) => (aibitat._fn = config),
  };
  webBrowsing.plugin.call(webBrowsing).setup(aibitat);

  const countTokens = jest.fn((str) => String(str?.length || 0));
  aibitat._fn.countTokens = countTokens;

  // Provide the fields _crwSearch reads off `this` without running the full
  // AIbitat invocation machinery.
  const ctx = {
    ...aibitat._fn,
    super: aibitat,
    caller: "WebSearchAgent",
    introspect: aibitat.introspect,
  };

  return { aibitat, ctx };
}

function mockOkResponse(payload) {
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve(payload),
  });
}

function mockErrorResponse(status, statusText) {
  return Promise.resolve({ ok: false, status, statusText });
}

afterEach(() => {
  jest.restoreAllMocks();
  if (ORIGINAL_CRW_KEY === undefined) delete process.env.AGENT_CRW_API_KEY;
  else process.env.AGENT_CRW_API_KEY = ORIGINAL_CRW_KEY;
  if (ORIGINAL_CRW_URL === undefined) delete process.env.AGENT_CRW_API_URL;
  else process.env.AGENT_CRW_API_URL = ORIGINAL_CRW_URL;
});

describe("fastCRW (_crwSearch) agent search provider", () => {
  test("self-hosted instance without an API key sends no Authorization header", async () => {
    delete process.env.AGENT_CRW_API_KEY;
    process.env.AGENT_CRW_API_URL = "http://localhost:3000";
    const fetchSpy = jest
      .spyOn(global, "fetch")
      .mockResolvedValue(
        mockOkResponse({
          success: true,
          data: {
            results: [
              {
                title: "Debian releases",
                url: "https://www.debian.org/releases/",
                description: "The latest stable release of Debian.",
              },
            ],
          },
        })
      );

    const { ctx } = setup();
    const reply = await ctx._crwSearch("Debian latest stable release");

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url, options] = fetchSpy.mock.calls[0];
    expect(url).toBe("http://localhost:3000/v1/search");
    expect(options.method).toBe("POST");
    expect(options.headers).not.toHaveProperty("Authorization");
    expect(options.headers).toEqual({ "Content-Type": "application/json" });
    expect(JSON.parse(options.body)).toEqual({
      query: "Debian latest stable release",
    });
    expect(JSON.parse(reply)).toEqual([
      {
        title: "Debian releases",
        link: "https://www.debian.org/releases/",
        snippet: "The latest stable release of Debian.",
      },
    ]);
  });

  test("authenticated fastCRW sends a Bearer header and reads hosted response shape", async () => {
    process.env.AGENT_CRW_API_KEY = "test-key";
    delete process.env.AGENT_CRW_API_URL;
    jest
      .spyOn(global, "fetch")
      .mockResolvedValue(
        mockOkResponse({
          success: true,
          data: [
            {
              title: "Rust runtime",
              url: "https://example.com/rust",
              description: "Async runtime details.",
            },
          ],
        })
      );

    const { ctx } = setup();
    const reply = await ctx._crwSearch("rust async runtime");

    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toBe("https://fastcrw.com/api/v1/search");
    expect(options.headers).toHaveProperty(
      "Authorization",
      "Bearer test-key"
    );
    expect(JSON.parse(reply)[0]).toEqual({
      title: "Rust runtime",
      link: "https://example.com/rust",
      snippet: "Async runtime details.",
    });
  });

  test("normalizes both hosted (data array) and self-hosted (data.results) responses", async () => {
    process.env.AGENT_CRW_API_KEY = "test-key";
    delete process.env.AGENT_CRW_API_URL;

    jest
      .spyOn(global, "fetch")
      .mockResolvedValue(
        mockOkResponse({
          success: true,
          data: [
            {
              title: "Hosted result",
              url: "https://example.com/a",
              description: "desc a",
            },
          ],
        })
      );

    let { ctx } = setup();
    let reply = await ctx._crwSearch("hosted");
    expect(JSON.parse(reply)[0]).toEqual({
      title: "Hosted result",
      link: "https://example.com/a",
      snippet: "desc a",
    });

    process.env.AGENT_CRW_API_URL = "http://localhost:3000";
    jest
      .spyOn(global, "fetch")
      .mockResolvedValue(
        mockOkResponse({
          success: true,
          data: {
            results: [
              {
                title: "Self-hosted result",
                url: "https://example.com/b",
                description: "desc b",
              },
            ],
          },
        })
      );

    ({ ctx } = setup());
    reply = await ctx._crwSearch("self-hosted");
    expect(JSON.parse(reply)[0]).toEqual({
      title: "Self-hosted result",
      link: "https://example.com/b",
      snippet: "desc b",
    });
  });

  test("returns a clean error message on an HTTP failure without leaking the API key", async () => {
    process.env.AGENT_CRW_API_KEY = "super-secret-key-12345";
    delete process.env.AGENT_CRW_API_URL;
    jest.spyOn(global, "fetch").mockResolvedValue(mockErrorResponse(404, "Not Found"));

    const { ctx, aibitat } = setup();
    const reply = await ctx._crwSearch("missing route");

    expect(reply).toContain("There was an error searching for content.");
    expect(reply).toMatch(/404 - Not Found/);
    expect(reply).not.toContain("super-secret-key-12345");
    expect(
      aibitat.handlerProps.log.mock.calls[0][0]
    ).toContain("404 - Not Found");
    expect(
      aibitat.handlerProps.log.mock.calls[0][0]
    ).not.toContain("super-secret-key-12345");
  });

  test.each([
    ["http://localhost:3000", "http://localhost:3000/v1/search"],
    ["http://localhost:3000/", "http://localhost:3000/v1/search"],
    ["http://localhost:3000/api", "http://localhost:3000/api/v1/search"],
    ["http://localhost:3000/custom/path", "http://localhost:3000/custom/path/v1/search"],
  ])("builds the search endpoint for base URL %s", async (baseUrl, expected) => {
    process.env.AGENT_CRW_API_URL = baseUrl;
    jest.spyOn(global, "fetch").mockResolvedValue(mockOkResponse({ success: true, data: [] }));

    const { ctx } = setup();
    await ctx._crwSearch("some query");

    expect(global.fetch.mock.calls[0][0]).toBe(expected);
  });
});