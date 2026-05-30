/* eslint-env jest */

process.env.STORAGE_DIR = __dirname;
process.env.NODE_ENV = "test";

jest.mock("../../../../../models/systemSettings", () => ({
  SystemSettings: { get: jest.fn() },
}));

jest.mock("../../../../../utils/helpers/tiktoken", () => ({
  TokenManager: jest.fn().mockImplementation(() => ({
    countFromString: jest.fn().mockReturnValue(0),
  })),
}));

const {
  webBrowsing,
} = require("../../../../../utils/agents/aibitat/plugins/web-browsing");

describe("web-browsing SearXNG engine", () => {
  const originalFetch = global.fetch;
  const originalSearXNGUrl = process.env.AGENT_SEARXNG_API_URL;

  afterEach(() => {
    global.fetch = originalFetch;
    process.env.AGENT_SEARXNG_API_URL = originalSearXNGUrl;
    jest.clearAllMocks();
  });

  it("does not double encode the search query", async () => {
    let definition;
    const aibitat = {
      function: jest.fn((pluginDefinition) => {
        definition = pluginDefinition;
      }),
      introspect: jest.fn(),
      handlerProps: { log: jest.fn() },
    };

    webBrowsing.plugin().setup(aibitat);

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: [] }),
    });

    process.env.AGENT_SEARXNG_API_URL = "http://searxng:8080/search";

    await definition._searXNGEngine("Colossus and the Crab ending");

    const requestedUrl = global.fetch.mock.calls[0][0];
    expect(requestedUrl).toContain("q=Colossus+and+the+Crab+ending");
    expect(requestedUrl).not.toContain("%2520");
  });
});
