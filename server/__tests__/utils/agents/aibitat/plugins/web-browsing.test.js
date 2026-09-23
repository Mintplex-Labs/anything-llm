/* eslint-env jest */
jest.mock("../../../../../models/systemSettings", () => ({
  SystemSettings: { get: jest.fn() },
}));
jest.mock("../../../../../utils/helpers/tiktoken", () => ({
  TokenManager: jest
    .fn()
    .mockImplementation(() => ({ countFromString: () => 1 })),
}));
jest.mock("../../../../../endpoints/utils", () => ({
  getAnythingLLMUserAgent: jest.fn(),
}));

const {
  webBrowsing,
} = require("../../../../../utils/agents/aibitat/plugins/web-browsing");
const originalFetch = global.fetch;
const originalKey = process.env.AGENT_SEARCHAPI_API_KEY;
const originalEngine = process.env.AGENT_SEARCHAPI_ENGINE;

function setupSearchApi(engine, response) {
  process.env.AGENT_SEARCHAPI_API_KEY = "test-key";
  process.env.AGENT_SEARCHAPI_ENGINE = engine;
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => response,
  });

  const aibitat = {
    introspect: jest.fn(),
    addCitation: jest.fn(),
    handlerProps: { log: jest.fn() },
    function: jest.fn(),
  };
  webBrowsing.plugin.call(webBrowsing).setup(aibitat);
  const search = aibitat.function.mock.calls[0][0];
  return { aibitat, search: search._searchApi.bind(search) };
}

async function runSearch(engine, response, query = "example") {
  const { aibitat, search } = setupSearchApi(engine, response);
  const results = JSON.parse(await search(query));
  const citations = aibitat.addCitation.mock.calls[0][0];
  return { results, citations };
}

afterEach(() => {
  if (originalKey === undefined) delete process.env.AGENT_SEARCHAPI_API_KEY;
  else process.env.AGENT_SEARCHAPI_API_KEY = originalKey;
  if (originalEngine === undefined) delete process.env.AGENT_SEARCHAPI_ENGINE;
  else process.env.AGENT_SEARCHAPI_ENGINE = originalEngine;
  global.fetch = originalFetch;
});

describe("SearchApi web browsing", () => {
  test("returns Jobs results and cites the available application links", async () => {
    const { results, citations } = await runSearch("google_jobs", {
      jobs: [
        {
          title: "AI Engineer",
          description: "Build agent tools",
          apply_link: "https://example.com/apply",
        },
        {
          title: "AI Researcher",
          sharing_link: "https://example.com/share",
        },
      ],
    });

    expect(results).toHaveLength(2);
    expect(results[0]).toEqual(
      expect.objectContaining({
        title: "AI Engineer",
        link: "https://example.com/apply",
        snippet: "Build agent tools",
      })
    );
    expect(citations.map(({ chunkSource }) => chunkSource)).toEqual([
      "link://https://example.com/apply",
      "link://https://example.com/share",
    ]);
  });

  test("uses websites or Google Maps URLs for place citations", async () => {
    const { results, citations } = await runSearch("google_maps", {
      local_results: [
        { title: "Cafe", website: "https://example.com/cafe" },
        { title: "Park", address: "1 Park Rd", place_id: "place-123" },
      ],
    });

    expect(results[0].link).toBe("https://example.com/cafe");
    const mapUrl = new URL(results[1].link);
    expect(mapUrl.origin + mapUrl.pathname).toBe(
      "https://www.google.com/maps/search/"
    );
    expect(mapUrl.searchParams.get("query")).toBe("Park, 1 Park Rd");
    expect(mapUrl.searchParams.get("query_place_id")).toBe("place-123");
    expect(citations.map(({ chunkSource }) => chunkSource)).toEqual(
      results.map(({ link }) => `link://${link}`)
    );
  });

  test("returns local-only Google Search results without a place ID", async () => {
    const { results } = await runSearch(
      "google",
      { local_results: [{ title: "Cafe", address: "1 Main St" }] },
      "cafes"
    );

    const mapUrl = new URL(results[0].link);
    expect(mapUrl.searchParams.get("query")).toBe("Cafe, 1 Main St");
    expect(mapUrl.searchParams.has("query_place_id")).toBe(false);
  });

  test.each([
    {
      engine: "google_shopping",
      response: {
        shopping_results: [
          {
            title: "Mouse",
            product_link: "https://example.com/mouse",
            price: "$20",
          },
        ],
      },
      expected: {
        title: "Mouse",
        link: "https://example.com/mouse",
        snippet: "$20",
      },
    },
    {
      engine: "google_finance",
      response: {
        search_metadata: {
          request_url: "https://www.google.com/finance/quote/TSLA:NASDAQ",
        },
        summary: { title: "Tesla", price: 200, currency: "USD" },
      },
      expected: {
        title: "Tesla",
        link: "https://www.google.com/finance/quote/TSLA:NASDAQ",
        snippet: "200 USD",
      },
    },
    {
      engine: "google_patents",
      response: {
        organic_results: [
          {
            title: "Invention",
            patent_id: "patent/US123/en",
            snippet: "Details",
          },
        ],
      },
      expected: {
        title: "Invention",
        link: "https://patents.google.com/patent/US123/en",
        snippet: "Details",
      },
    },
    {
      engine: "youtube",
      response: {
        videos: [
          {
            title: "AI Agents",
            link: "https://youtube.com/watch?v=abc",
            description: "How agents work",
          },
        ],
      },
      expected: {
        title: "AI Agents",
        link: "https://youtube.com/watch?v=abc",
        snippet: "How agents work",
      },
    },
    {
      engine: "amazon_search",
      response: {
        organic_results: [
          { title: "Mouse", link: "https://amazon.com/dp/ABC", price: "$20" },
        ],
      },
      expected: {
        title: "Mouse",
        link: "https://amazon.com/dp/ABC",
        snippet: "$20",
      },
    },
  ])(
    "normalizes $engine results with a usable citation",
    async ({ engine, response, expected }) => {
      const { results, citations } = await runSearch(engine, response);

      expect(results).toHaveLength(1);
      expect(results[0]).toEqual(expect.objectContaining(expected));
      expect(citations[0].chunkSource).toBe(`link://${expected.link}`);
    }
  );

  test("keeps ordinary organic search results", async () => {
    const { results } = await runSearch("google", {
      organic_results: [
        { title: "Example", link: "https://example.com", snippet: "Result" },
      ],
    });

    expect(results).toEqual([
      { title: "Example", link: "https://example.com", snippet: "Result" },
    ]);
  });

  test("limits each Google result list without dropping local places", async () => {
    const organicResults = Array.from({ length: 11 }, (_, index) => ({
      title: `Web ${index}`,
      link: `https://example.com/${index}`,
    }));
    const localResults = Array.from({ length: 11 }, (_, index) => ({
      title: `Place ${index}`,
    }));
    const { results, citations } = await runSearch("google", {
      organic_results: organicResults,
      local_results: localResults,
    });

    expect(results).toHaveLength(20);
    expect(results[9].title).toBe("Web 9");
    expect(results[10].title).toBe("Place 0");
    expect(results[19].title).toBe("Place 9");
    expect(citations).toHaveLength(20);
  });

  test("cites knowledge graph and featured answer sources", async () => {
    const { results, citations } = await runSearch("google", {
      search_metadata: { request_url: "https://google.com/search?q=seasons" },
      knowledge_graph: {
        title: "Earth",
        description: "A planet",
        source: { link: "https://example.com/earth" },
      },
      answer_box: {
        answer: "Earth's axis is tilted",
        organic_result: {
          title: "Why Do We Have Seasons?",
          link: "https://www.weather.gov/lmk/seasons",
        },
      },
    });

    expect(results.map(({ title, link }) => ({ title, link }))).toEqual([
      { title: "Earth", link: "https://example.com/earth" },
      {
        title: "Why Do We Have Seasons?",
        link: "https://www.weather.gov/lmk/seasons",
      },
    ]);
    expect(citations.map(({ chunkSource }) => chunkSource)).toEqual(
      results.map(({ link }) => `link://${link}`)
    );
  });
});
