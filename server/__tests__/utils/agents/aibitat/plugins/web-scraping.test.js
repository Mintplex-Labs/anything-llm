// Behavior-level regression for the agent web-scraping SSRF guard.
//
// On a vulnerable build the plugin forwards ANY model-supplied URL straight to
// the collector (CollectorApi.getLinkContent), so a loopback URL would reach
// the network sink. With the guard in place the loopback call must be refused
// BEFORE getLinkContent is ever invoked, while ordinary public URLs still pass.
//
// CollectorApi is mocked so the test performs no real HTTP egress.

const mockGetLinkContent = jest.fn();
jest.mock("../../../../../utils/collectorApi", () => ({
  CollectorApi: jest.fn().mockImplementation(() => ({
    getLinkContent: mockGetLinkContent,
  })),
}));

// Avoid loading the heavy provider/token machinery (and its langchain deps)
// that the plugin pulls in for the post-fetch summarization path. None of it
// is exercised by the SSRF guard, which runs before any of it.
jest.mock("../../../../../utils/agents/aibitat/utils/summarize", () => ({
  summarizeContent: jest.fn(async () => "summarized"),
}));
jest.mock("../../../../../utils/agents/aibitat/providers/ai-provider", () => ({
  contextLimit: () => 1_000_000,
}));
jest.mock("../../../../../utils/helpers/tiktoken", () => ({
  TokenManager: jest.fn().mockImplementation(() => ({
    countFromString: () => 1,
  })),
}));

const {
  webScraping,
} = require("../../../../../utils/agents/aibitat/plugins/web-scraping");

/**
 * Build a minimal "scrape" closure with the same surface the plugin relies on,
 * mirroring how aibitat.function binds the handler object.
 */
function buildScraper() {
  const introspections = [];
  const pluginInstance = webScraping.plugin();
  let captured = null;

  const fakeAibitat = {
    function: (def) => {
      captured = def;
    },
    introspect: (m) => introspections.push(m),
    handlerProps: { log: () => {} },
    emitter: { on: () => {}, removeListener: () => {} },
    provider: "openai",
    model: "gpt-4o",
    addCitation: () => {},
  };

  pluginInstance.setup(fakeAibitat);
  captured.super = fakeAibitat;
  captured.caller = "tester";
  return { scrape: captured.scrape.bind(captured), introspections };
}

describe("web-scraping plugin SSRF guard (behavior)", () => {
  const ORIGINAL_ENV = process.env.COLLECTOR_ALLOW_ANY_IP;

  beforeEach(() => {
    mockGetLinkContent.mockReset();
    delete process.env.COLLECTOR_ALLOW_ANY_IP;
  });

  afterEach(() => {
    if (ORIGINAL_ENV === undefined) delete process.env.COLLECTOR_ALLOW_ANY_IP;
    else process.env.COLLECTOR_ALLOW_ANY_IP = ORIGINAL_ENV;
  });

  it("does NOT forward a loopback URL to the collector", async () => {
    const { scrape } = buildScraper();
    await expect(scrape("http://127.0.0.1:8080/canary")).rejects.toThrow();
    expect(mockGetLinkContent).not.toHaveBeenCalled();
  });

  it("does NOT forward the cloud metadata endpoint to the collector", async () => {
    const { scrape } = buildScraper();
    await expect(
      scrape("http://169.254.169.254/latest/meta-data/")
    ).rejects.toThrow();
    expect(mockGetLinkContent).not.toHaveBeenCalled();
  });

  it("DOES forward a public IP literal to the collector", async () => {
    mockGetLinkContent.mockResolvedValue({
      success: true,
      content: "hello world",
    });
    const { scrape } = buildScraper();
    const out = await scrape("https://93.184.216.34/");
    expect(mockGetLinkContent).toHaveBeenCalledWith("https://93.184.216.34/");
    expect(out).toContain("hello world");
  });

  it("forwards loopback again when COLLECTOR_ALLOW_ANY_IP=true", async () => {
    process.env.COLLECTOR_ALLOW_ANY_IP = "true";
    mockGetLinkContent.mockResolvedValue({
      success: true,
      content: "internal-service-body",
    });
    const { scrape } = buildScraper();
    const out = await scrape("http://127.0.0.1:8080/canary");
    expect(mockGetLinkContent).toHaveBeenCalledWith(
      "http://127.0.0.1:8080/canary"
    );
    expect(out).toContain("internal-service-body");
  });
});
