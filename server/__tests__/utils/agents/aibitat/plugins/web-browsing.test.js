/* eslint-env jest */

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

const ORIGINAL_ENV = process.env;
const originalFetch = global.fetch;

beforeEach(() => {
  process.env = {
    ...ORIGINAL_ENV,
    AGENT_PERPLEXITY_API_KEY: "test-api-key",
  };
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue({ results: [] }),
  });
});

afterEach(() => {
  global.fetch = originalFetch;
});

afterAll(() => {
  process.env = ORIGINAL_ENV;
});

test("adds the integration header to direct Perplexity Search requests", async () => {
  let searchTool;
  const aibitat = {
    function: jest.fn().mockImplementation((tool) => {
      searchTool = tool;
    }),
    handlerProps: { log: jest.fn() },
    introspect: jest.fn(),
  };

  webBrowsing.plugin().setup(aibitat);
  await searchTool._perplexitySearch.call(searchTool, "latest news");

  expect(global.fetch).toHaveBeenCalledWith(
    "https://api.perplexity.ai/search",
    expect.objectContaining({
      headers: expect.objectContaining({
        "X-Pplx-Integration": "anythingllm",
      }),
    })
  );
});
