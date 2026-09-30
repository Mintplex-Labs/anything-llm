/* eslint-env jest */
jest.mock("../../../../../models/systemSettings", () => ({
  SystemSettings: { get: jest.fn() },
}));

const {
  webBrowsing,
} = require("../../../../../utils/agents/aibitat/plugins/web-browsing.js");

/**
 * Builds one result the way html.duckduckgo.com renders it: the destination is
 * percent-encoded into the `uddg` parameter of a DuckDuckGo redirect link.
 */
function ddgResult({ url, title, snippet }) {
  const href = `//duckduckgo.com/l/?uddg=${encodeURIComponent(url)}&amp;rut=abc123`;
  return `<div class="result results_links results_links_deep web-result ">
  <div class="links_main links_deep result__body">
    <h2 class="result__title">
      <a rel="nofollow" class="result__a" href="${href}">${title}</a>
    </h2>
    <a class="result__snippet" href="${href}">${snippet}</a>
  </div>
</div>`;
}

function setupPlugin() {
  const aibitat = {
    introspect: jest.fn(),
    handlerProps: { log: jest.fn() },
    addCitation: jest.fn(),
    function: (config) => (aibitat._fn = config),
  };
  webBrowsing.plugin.call(webBrowsing).setup(aibitat);
  aibitat._fn.caller = "@agent";
  return aibitat;
}

async function searchDuckDuckGo(results) {
  const html = `<html><body>${results.map(ddgResult).join("")}</body></html>`;
  global.fetch = jest
    .fn()
    .mockResolvedValue({ ok: true, text: async () => html });
  const aibitat = setupPlugin();
  const output = await aibitat._fn._duckDuckGoEngine.call(aibitat._fn, "query");
  return { results: JSON.parse(output), aibitat };
}

const originalFetch = global.fetch;

describe("web-browsing: DuckDuckGo engine", () => {
  afterEach(() => (global.fetch = originalFetch));

  it("returns the destination URL of each result unchanged", async () => {
    const urls = [
      "https://example.com/reports/Annual%20Report%202024.pdf",
      "https://en.wikipedia.org/wiki/Who_Wants_to_Be_a_Millionaire%3F",
      "https://example.com/search?q=C%23&tag=a%26b",
      "https://example.com/plain-page",
    ];
    const { results, aibitat } = await searchDuckDuckGo(
      urls.map((url) => ({ url, title: "Title", snippet: "Snippet" }))
    );

    expect(results.map((r) => r.link)).toEqual(urls);
    expect(aibitat.addCitation.mock.calls[0][0].map((c) => c.id)).toEqual(urls);
  });

  it("returns plain text titles and snippets instead of HTML", async () => {
    const { results, aibitat } = await searchDuckDuckGo([
      {
        url: "https://example.com/a",
        title: "What&#x27;s new in C# 12 &amp; .NET 8",
        snippet: "It&#x27;s <b>fast</b> &amp; &quot;safe&quot;",
      },
      {
        url: "https://example.com/report.pdf",
        title: `<span class="result__type">PDF</span> Annual Report 2024`,
        snippet: "Revenue grew",
      },
    ]);

    expect(results.map((r) => r.title)).toEqual([
      "What's new in C# 12 & .NET 8",
      "PDF Annual Report 2024",
    ]);
    expect(results[0].snippet).toBe(`It's fast & "safe"`);
    expect(aibitat.addCitation.mock.calls[0][0][0].title).toBe(
      "What's new in C# 12 & .NET 8"
    );
  });
});
