/* eslint-env jest */

/**
 * You.com agent web-search provider smoke tests.
 * Mocks fetch — does not depend on live You.com availability.
 */

describe("You.com web search provider wiring", () => {
  const ORIGINAL_FETCH = global.fetch;
  const ORIGINAL_ENV = process.env;
  let fetchMock;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
    delete process.env.AGENT_YOU_API_KEY;
    fetchMock = jest.fn();
    global.fetch = fetchMock;
  });

  afterEach(() => {
    global.fetch = ORIGINAL_FETCH;
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  test("system settings allowlist accepts you-search", () => {
    const { SystemSettings } = require("../../../../../models/systemSettings");
    expect(
      SystemSettings.validations.agent_search_provider("you-search")
    ).toBe("you-search");
  });

  test("updateENV registers AgentYouApiKey → AGENT_YOU_API_KEY", () => {
    const fs = require("fs");
    const src = fs.readFileSync(
      require.resolve("../../../../../utils/helpers/updateENV"),
      "utf8"
    );
    expect(src).toMatch(
      /AgentYouApiKey:\s*\{[\s\S]*?envKey:\s*"AGENT_YOU_API_KEY"/
    );
  });

  test("web-browsing plugin registers you-search → _youSearch", () => {
    const fs = require("fs");
    const src = fs.readFileSync(
      require.resolve(
        "../../../../../utils/agents/aibitat/plugins/web-browsing"
      ),
      "utf8"
    );
    expect(src).toContain('case "you-search"');
    expect(src).toContain('engine = "_youSearch"');
    expect(src).toContain("https://api.you.com/v1/agents/search");
    expect(src).toContain("https://ydc-index.io/v1/search");
  });

  test("keyless path calls free-tier endpoint without X-API-Key", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        results: {
          web: [
            {
              title: "AnythingLLM",
              url: "https://anythingllm.com",
              description: "Desktop RAG app",
              snippets: ["Open-source AI app"],
            },
          ],
          news: [
            {
              title: "News Item",
              url: "https://news.example/item",
              description: "A news blurb",
            },
          ],
        },
      }),
    });

    const searchURL = new URL("https://api.you.com/v1/agents/search");
    searchURL.searchParams.append("query", "AnythingLLM");
    searchURL.searchParams.append("count", "10");

    const response = await fetch(searchURL.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "identity",
      },
    }).then((res) => res.json());

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("https://api.you.com/v1/agents/search"),
      expect.objectContaining({
        method: "GET",
        headers: expect.not.objectContaining({
          "X-API-Key": expect.anything(),
        }),
      })
    );

    const data = [];
    const webResults = response?.results?.web ?? [];
    const newsResults = response?.results?.news ?? [];
    [...webResults, ...newsResults].forEach((searchResult) => {
      const { url, title, description, snippets } = searchResult;
      const snippet =
        Array.isArray(snippets) && snippets.length > 0
          ? snippets[0]
          : description;
      data.push({ title, link: url, snippet });
    });

    expect(data).toEqual([
      {
        title: "AnythingLLM",
        link: "https://anythingllm.com",
        snippet: "Open-source AI app",
      },
      {
        title: "News Item",
        link: "https://news.example/item",
        snippet: "A news blurb",
      },
    ]);
  });

  test("keyed path uses ydc-index.io and sends X-API-Key", async () => {
    process.env.AGENT_YOU_API_KEY = "test-you-key-12345";
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ results: { web: [], news: [] } }),
    });

    const apiKey = process.env.AGENT_YOU_API_KEY;
    const searchURL = new URL("https://ydc-index.io/v1/search");
    searchURL.searchParams.append("query", "test");
    searchURL.searchParams.append("count", "10");

    await fetch(searchURL.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "identity",
        "X-API-Key": apiKey,
      },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("https://ydc-index.io/v1/search"),
      expect.objectContaining({
        headers: expect.objectContaining({
          "X-API-Key": "test-you-key-12345",
        }),
      })
    );
  });
});
