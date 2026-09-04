/* eslint-env jest */
jest.mock("../../../../../models/systemSettings", () => ({
  SystemSettings: { get: jest.fn() },
}));
jest.mock("../../../../../utils/helpers/tiktoken", () => ({
  TokenManager: jest.fn().mockImplementation(() => ({
    countFromString: () => "0",
  })),
}));
jest.mock("../../../../../endpoints/utils", () => ({
  getAnythingLLMUserAgent: () => "anything-llm",
}));

const {
  webBrowsing,
} = require("../../../../../utils/agents/aibitat/plugins/web-browsing.js");

function setupPlugin() {
  const aibitat = {
    introspect: jest.fn(),
    handlerProps: { log: jest.fn() },
    function: (config) => (aibitat._fn = config),
  };
  webBrowsing.plugin.call(webBrowsing).setup(aibitat);
  const config = aibitat._fn;
  config.super = aibitat;
  config.caller = "@agent";
  config.reportSearchResultsCitations = jest.fn();
  return config;
}

function mockFetch(body, { ok = true, status = 200 } = {}) {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    status,
    statusText: ok ? "OK" : "Not Found",
    json: async () => body,
  });
  return global.fetch;
}

const MANAGED_BODY = {
  success: true,
  data: [
    {
      url: "https://example.com/managed",
      title: "Managed result",
      description: "managed snippet",
    },
  ],
};

// A self-hosted instance nests its results one level deeper than the managed API.
const SELF_HOSTED_BODY = {
  success: true,
  data: {
    results: [
      {
        url: "https://example.com/self-hosted",
        title: "Self-hosted result",
        description: "self-hosted snippet",
      },
    ],
  },
};

describe("web-browsing fastCRW search", () => {
  let provider;

  beforeEach(() => {
    provider = setupPlugin();
    delete process.env.AGENT_CRW_API_KEY;
    delete process.env.AGENT_CRW_API_URL;
  });

  afterEach(() => {
    delete process.env.AGENT_CRW_API_KEY;
    delete process.env.AGENT_CRW_API_URL;
    delete global.fetch;
  });

  it("calls /v1/search on a self-hosted instance without a double slash", async () => {
    process.env.AGENT_CRW_API_URL = "http://127.0.0.1:3000";
    const fetchMock = mockFetch(SELF_HOSTED_BODY);

    const result = await provider._crwSearch("debian stable release");

    expect(fetchMock.mock.calls[0][0]).toBe("http://127.0.0.1:3000/v1/search");
    expect(JSON.parse(result)).toEqual([
      {
        title: "Self-hosted result",
        link: "https://example.com/self-hosted",
        snippet: "self-hosted snippet",
      },
    ]);
  });

  it("tolerates trailing slashes on the base URL", async () => {
    process.env.AGENT_CRW_API_URL = "http://127.0.0.1:3000/";
    const fetchMock = mockFetch(SELF_HOSTED_BODY);

    await provider._crwSearch("debian stable release");

    expect(fetchMock.mock.calls[0][0]).toBe("http://127.0.0.1:3000/v1/search");
  });

  it("keeps a sub-path so an instance behind a reverse proxy stays reachable", async () => {
    process.env.AGENT_CRW_API_URL = "https://example.com/crw";
    const fetchMock = mockFetch(SELF_HOSTED_BODY);

    await provider._crwSearch("debian stable release");

    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://example.com/crw/v1/search"
    );
  });

  it("omits the Authorization header when no API key is set", async () => {
    process.env.AGENT_CRW_API_URL = "http://127.0.0.1:3000";
    const fetchMock = mockFetch(SELF_HOSTED_BODY);

    await provider._crwSearch("debian stable release");

    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBeUndefined();
  });

  it("still parses the managed response and sends the API key", async () => {
    process.env.AGENT_CRW_API_KEY = "crw_live_example";
    const fetchMock = mockFetch(MANAGED_BODY);

    const result = await provider._crwSearch("debian stable release");

    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://fastcrw.com/api/v1/search"
    );
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe(
      "Bearer crw_live_example"
    );
    expect(JSON.parse(result)).toEqual([
      {
        title: "Managed result",
        link: "https://example.com/managed",
        snippet: "managed snippet",
      },
    ]);
  });

  it("appends to the path and leaves a query string in place", async () => {
    process.env.AGENT_CRW_API_URL = "http://127.0.0.1:3000/crw?token=abc";
    const fetchMock = mockFetch(SELF_HOSTED_BODY);

    await provider._crwSearch("debian stable release");

    expect(fetchMock.mock.calls[0][0]).toBe(
      "http://127.0.0.1:3000/crw/v1/search?token=abc"
    );
  });

  it("requires an API key for the managed host whatever case it is typed in", async () => {
    process.env.AGENT_CRW_API_URL = "https://FastCRW.com/api/";
    const fetchMock = mockFetch(MANAGED_BODY);

    const result = await provider._crwSearch("debian stable release");

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result).toMatch(/Search is disabled/);
  });

  it("stays disabled when neither an API key nor a base URL is set", async () => {
    const fetchMock = mockFetch(MANAGED_BODY);

    const result = await provider._crwSearch("debian stable release");

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result).toMatch(/Search is disabled/);
  });

  it("trims whitespace around the base URL", async () => {
    process.env.AGENT_CRW_API_URL = "  http://127.0.0.1:3000  ";
    const fetchMock = mockFetch(SELF_HOSTED_BODY);

    await provider._crwSearch("debian stable release");

    expect(fetchMock.mock.calls[0][0]).toBe("http://127.0.0.1:3000/v1/search");
  });

  it("still requires an API key when the base URL is the managed endpoint", async () => {
    process.env.AGENT_CRW_API_URL = "https://fastcrw.com/api";
    const fetchMock = mockFetch(MANAGED_BODY);

    const result = await provider._crwSearch("debian stable release");

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result).toMatch(/Search is disabled/);
  });

  it("rejects a base URL that has no http or https scheme", async () => {
    process.env.AGENT_CRW_API_URL = "localhost:3000";
    const fetchMock = mockFetch(SELF_HOSTED_BODY);

    const result = await provider._crwSearch("debian stable release");

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result).toMatch(/Search is disabled/);
  });

  it("does not fall back to the managed endpoint when the base URL is invalid", async () => {
    process.env.AGENT_CRW_API_URL = "not a url";
    process.env.AGENT_CRW_API_KEY = "crw_live_example";
    const fetchMock = mockFetch(MANAGED_BODY);

    const result = await provider._crwSearch("debian stable release");

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result).toMatch(/Search is disabled/);
  });
});
