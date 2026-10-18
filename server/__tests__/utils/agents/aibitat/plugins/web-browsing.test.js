/* eslint-env jest */
jest.mock("../../../../../models/systemSettings", () => ({
  SystemSettings: { get: jest.fn() },
}));
jest.mock("../../../../../utils/helpers/tiktoken", () => ({
  TokenManager: class {
    countFromString() {
      return 0;
    }
  },
}));
jest.mock("../../../../../endpoints/utils", () => ({
  getAnythingLLMUserAgent: () => "AnythingLLM-test",
}));

const { SystemSettings } = require("../../../../../models/systemSettings");
const {
  webBrowsing,
} = require("../../../../../utils/agents/aibitat/plugins/web-browsing.js");

const API_KEY = "abcde-this-key-must-stay-private-vwxyz";

function setupPlugin() {
  const aibitat = {
    introspect: jest.fn(),
    handlerProps: { log: jest.fn() },
    function: (config) => (aibitat._fn = config),
  };
  webBrowsing.plugin.call(webBrowsing).setup(aibitat);
  return { aibitat, handler: aibitat._fn.handler.bind(aibitat._fn) };
}

function expectNoKey(text) {
  expect(text).not.toContain(API_KEY.slice(0, 5));
  expect(text).not.toContain(API_KEY.slice(-5));
}

const originalFetch = global.fetch;
const originalEnv = { ...process.env };
beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    status: 401,
    statusText: "Unauthorized",
    text: async () => "",
  });
});
afterEach(() => {
  global.fetch = originalFetch;
  process.env = { ...originalEnv };
  jest.clearAllMocks();
});

describe("web-browsing search errors", () => {
  // These engines hand the failed request's error back to the model as the
  // tool result, so whatever the error says, the model (and its provider) sees.
  test.each([
    ["serpapi", "AGENT_SERPAPI_API_KEY"],
    ["searchapi", "AGENT_SEARCHAPI_API_KEY"],
    ["serper-dot-dev", "AGENT_SERPER_DEV_KEY"],
    ["baidu-search", "AGENT_BAIDU_SEARCH_API_KEY"],
    ["serply-engine", "AGENT_SERPLY_API_KEY"],
    ["tavily-search", "AGENT_TAVILY_API_KEY"],
    ["exa-search", "AGENT_EXA_API_KEY"],
    ["perplexity-search", "AGENT_PERPLEXITY_API_KEY"],
    ["crw-search", "AGENT_CRW_API_KEY"],
  ])(
    "%s: a rejected request reports the status without the key's first or last five characters",
    async (provider, envKey) => {
      SystemSettings.get.mockResolvedValue({ value: provider });
      process.env[envKey] = API_KEY;
      const { aibitat, handler } = setupPlugin();

      const reply = await handler({ query: "weather in denver" });

      expect(global.fetch).toHaveBeenCalled();
      expect(reply).toContain("There was an error searching for content.");
      expect(reply).toContain("401 - Unauthorized");
      expect(reply).toContain("weather in denver");
      expectNoKey(reply);
      for (const [line] of aibitat.handlerProps.log.mock.calls)
        expectNoKey(line);
    }
  );

  // These two only log the error, so the server log is what to check. You.com
  // falls back to DuckDuckGo on failure, so look for You.com's own log line.
  test.each([
    ["bing-search", "AGENT_BING_SEARCH_API_KEY", "Bing Web Search Error:"],
    ["you-search", "AGENT_YOU_API_KEY", "You.com Search Error:"],
  ])(
    "%s: a rejected request logs the status without the key's first or last five characters",
    async (provider, envKey, logPrefix) => {
      SystemSettings.get.mockResolvedValue({ value: provider });
      process.env[envKey] = API_KEY;
      const { aibitat, handler } = setupPlugin();

      await handler({ query: "weather in denver" });

      const logged = aibitat.handlerProps.log.mock.calls.map(([l]) => l);
      expect(logged).toContainEqual(expect.stringContaining(logPrefix));
      const engineError = logged.find((l) => l.startsWith(logPrefix));
      expect(engineError).toContain("401 - Unauthorized");
      expect(engineError).toContain("weather in denver");
      for (const line of logged) expectNoKey(line);
    }
  );
});
