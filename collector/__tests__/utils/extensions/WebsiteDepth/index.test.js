/* eslint-env jest, node */
process.env.STORAGE_DIR = "test-storage"; // needed for tests to run

// Puppeteer is stubbed so the crawl can be driven by an in-memory site map -
// no browser and no network access are required.
jest.mock("langchain/document_loaders/web/puppeteer", () => ({
  PuppeteerWebBaseLoader: jest.fn(),
}));

// Documents are written via the real files module in production; stub the
// writer and point the documents folder at a temp dir so tests leave no
// stray files in the repo.
jest.mock("../../../../utils/files", () => {
  const actual = jest.requireActual("../../../../utils/files");
  return {
    ...actual,
    writeToServerDocuments: jest.fn(),
    documentsFolder: require("path").join(
      require("os").tmpdir(),
      "anythingllm-website-depth-tests"
    ),
  };
});

const fs = require("fs");
const os = require("os");
const path = require("path");
const {
  PuppeteerWebBaseLoader,
} = require("langchain/document_loaders/web/puppeteer");
const { writeToServerDocuments } = require("../../../../utils/files");
const websiteScraper = require("../../../../utils/extensions/WebsiteDepth");
const { extractLinks } = websiteScraper;

/**
 * Points the stubbed Puppeteer loader at an in-memory site.
 * Values are the page's HTML (served for both link discovery and scraping);
 * an Error value makes every load of that URL fail. Loading a URL that is
 * not in the map throws, so an out-of-scope fetch fails loudly.
 */
function mockSite(pages) {
  PuppeteerWebBaseLoader.mockImplementation((url) => ({
    load: async () => {
      if (!(url in pages)) throw new Error(`unexpected fetch: ${url}`);
      if (pages[url] instanceof Error) throw pages[url];
      return [{ pageContent: pages[url] }];
    },
  }));
}

const fetchedUrls = () => PuppeteerWebBaseLoader.mock.calls.map((c) => c[0]);

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  fs.rmSync(path.join(os.tmpdir(), "anythingllm-website-depth-tests"), {
    recursive: true,
    force: true,
  });
});

describe("WebsiteDepth extractLinks scope", () => {
  it("stays on the start URL's origin", () => {
    const html =
      '<a href="https://example.com.evil.net/steal">x</a><a href="/ok">y</a>';
    expect(extractLinks(html, new URL("https://example.com"))).toEqual([
      "https://example.com/ok",
    ]);
  });

  it("does not follow a host whose port merely extends the start port", () => {
    const html =
      '<a href="http://127.0.0.1:50011/steal">x</a><a href="/ok">y</a>';
    expect(extractLinks(html, new URL("http://127.0.0.1:5001"))).toEqual([
      "http://127.0.0.1:5001/ok",
    ]);
  });

  it("keeps sibling directories that share the scope's name out", () => {
    const html =
      '<a href="/docs/guide">in</a><a href="/docs-private/secret">out</a>' +
      '<a href="/docs2">out</a><a href="/other/thing">out</a>';
    expect(
      extractLinks(html, new URL("https://example.com/docs/page"))
    ).toEqual(["https://example.com/docs/guide"]);
  });

  it("does not cross from https to http on the same host", () => {
    const html =
      '<a href="http://example.com/docs/x">x</a><a href="/docs/ok">y</a>';
    expect(
      extractLinks(html, new URL("https://example.com/docs/page"))
    ).toEqual(["https://example.com/docs/ok"]);
  });

  it("keeps the scope directory itself", () => {
    const html = '<a href="/docs">up</a>';
    expect(
      extractLinks(html, new URL("https://example.com/docs/page"))
    ).toEqual(["https://example.com/docs"]);
  });

  it("treats a bare origin as the whole site", () => {
    const html = '<a href="/a">a</a><a href="/b/c">b</a>';
    expect(extractLinks(html, new URL("https://example.com"))).toEqual([
      "https://example.com/a",
      "https://example.com/b/c",
    ]);
  });

  it("treats a double-slash start URL as the whole site", () => {
    const html = '<a href="/a">a</a><a href="/b/c">b</a>';
    expect(extractLinks(html, new URL("https://example.com//"))).toEqual([
      "https://example.com/a",
      "https://example.com/b/c",
    ]);
  });

  it("keeps dot-segment traversal out after URL normalization", () => {
    // WHATWG URL resolves ../ and %2e%2e/ before the pathname is compared,
    // so an encoded traversal cannot smuggle a path past the scope check.
    const html =
      '<a href="../secret">out</a><a href="/docs/%2e%2e/secret">out</a>' +
      '<a href="sub/../guide">in</a>';
    expect(
      extractLinks(html, new URL("https://example.com/docs/page"))
    ).toEqual(["https://example.com/docs/guide"]);
  });

  it("keeps protocol-relative links to another host out", () => {
    const html =
      '<a href="//example.com.evil.net/steal">out</a>' +
      '<a href="//example.com/docs/ok">in</a>';
    expect(
      extractLinks(html, new URL("https://example.com/docs/page"))
    ).toEqual(["https://example.com/docs/ok"]);
  });

  it("normalizes host and scheme casing before comparing", () => {
    const html = '<a href="HTTPS://EXAMPLE.COM/docs/Upper">in</a>';
    expect(
      extractLinks(html, new URL("https://example.com/docs/page"))
    ).toEqual(["https://example.com/docs/Upper"]);
  });

  it("keeps query strings and fragments on in-scope links", () => {
    const html = '<a href="/docs/guide?page=2#install">in</a>';
    expect(
      extractLinks(html, new URL("https://example.com/docs/page"))
    ).toEqual(["https://example.com/docs/guide?page=2#install"]);
  });
});

describe("WebsiteDepth extractLinks robustness", () => {
  const base = new URL("https://example.com/docs/page");

  it("skips mailto:, javascript: and tel: links", () => {
    const html =
      '<a href="mailto:a@b.com">m</a><a href="javascript:void(0)">j</a>' +
      '<a href="tel:+15555551234">t</a><a href="/docs/ok">in</a>';
    expect(extractLinks(html, base)).toEqual(["https://example.com/docs/ok"]);
  });

  it("does not let one malformed href abort the page's remaining links", () => {
    // href="http://" throws in new URL(); the rest of the page's links
    // must still be extracted rather than the whole page yielding nothing.
    const html =
      '<a href="/docs/before">in</a><a href="http://">broken</a>' +
      '<a href="/docs/after">in</a>';
    expect(extractLinks(html, base)).toEqual([
      "https://example.com/docs/before",
      "https://example.com/docs/after",
    ]);
  });

  it("skips anchors without an href and dedupes repeated links", () => {
    const html =
      '<a name="top">no href</a><a href="/docs/guide">a</a>' +
      '<a href="/docs/guide">a again</a>';
    expect(extractLinks(html, base)).toEqual([
      "https://example.com/docs/guide",
    ]);
  });

  it("skips empty hrefs rather than re-adding the page itself", () => {
    const html = '<a href="">self</a><a href="/docs/ok">in</a>';
    expect(extractLinks(html, base)).toEqual(["https://example.com/docs/ok"]);
  });

  it("returns no links for a page without anchors", () => {
    expect(extractLinks("<p>plain text, no links</p>", base)).toEqual([]);
  });
});

describe("WebsiteDepth websiteScraper", () => {
  it("crawls, scrapes and stores every in-scope page", async () => {
    mockSite({
      "https://example.com/docs/page":
        '<a href="/docs/guide">g</a><a href="/docs/api">a</a>',
      "https://example.com/docs/guide": "guide content",
      "https://example.com/docs/api": "api content",
    });

    const scraped = await websiteScraper("https://example.com/docs/page");

    expect(scraped.map((d) => d.chunkSource)).toEqual([
      "link://https://example.com/docs/page",
      "link://https://example.com/docs/guide",
      "link://https://example.com/docs/api",
    ]);
    expect(writeToServerDocuments).toHaveBeenCalledTimes(3);
    for (const doc of scraped) {
      expect(doc.url).toMatch(/^file:\/\/.+\.html$/);
      expect(doc.pageContent.length).toBeGreaterThan(0);
      expect(doc.token_count_estimate).toBeGreaterThan(0);
    }
  });

  it("never fetches a link that escapes the crawl scope", async () => {
    mockSite({
      "https://example.com/docs/page":
        '<a href="/docs/guide">in</a><a href="/docs-private/secret">out</a>' +
        '<a href="https://example.com.evil.net/steal">out</a>' +
        '<a href="../admin">out</a>',
      "https://example.com/docs/guide": "guide content",
    });

    await websiteScraper("https://example.com/docs/page");

    const fetched = fetchedUrls();
    expect(fetched).not.toContain("https://example.com/docs-private/secret");
    expect(fetched).not.toContain("https://example.com.evil.net/steal");
    expect(fetched).not.toContain("https://example.com/admin");
  });

  it("respects the depth limit", async () => {
    mockSite({
      "https://example.com/docs/page": '<a href="/docs/child">c</a>',
      "https://example.com/docs/child": '<a href="/docs/grandchild">g</a>',
      "https://example.com/docs/grandchild": "grandchild content",
    });

    const scraped = await websiteScraper("https://example.com/docs/page", 1);

    // At depth 1 only the start page is mined for links, so the grandchild
    // is never discovered or fetched.
    expect(scraped.map((d) => d.chunkSource)).toEqual([
      "link://https://example.com/docs/page",
      "link://https://example.com/docs/child",
    ]);
    expect(fetchedUrls()).not.toContain("https://example.com/docs/grandchild");
  });

  it("follows links found on child pages at depth 2", async () => {
    mockSite({
      "https://example.com/docs/page": '<a href="/docs/child">c</a>',
      "https://example.com/docs/child": '<a href="/docs/grandchild">g</a>',
      "https://example.com/docs/grandchild": "grandchild content",
    });

    const scraped = await websiteScraper("https://example.com/docs/page", 2);

    expect(scraped.map((d) => d.chunkSource)).toContain(
      "link://https://example.com/docs/grandchild"
    );
  });

  it("stops discovering once maxLinks is reached", async () => {
    mockSite({
      "https://example.com/docs/page":
        '<a href="/docs/a">a</a><a href="/docs/b">b</a>' +
        '<a href="/docs/c">c</a><a href="/docs/d">d</a>',
      "https://example.com/docs/a": "a content",
      "https://example.com/docs/b": "b content",
      "https://example.com/docs/c": "c content",
      "https://example.com/docs/d": "d content",
    });

    const scraped = await websiteScraper("https://example.com/docs/page", 1, 3);

    // The start URL counts toward the cap, leaving room for two links.
    expect(scraped).toHaveLength(3);
  });

  it("skips a page that fails to load without aborting the crawl", async () => {
    mockSite({
      "https://example.com/docs/page":
        '<a href="/docs/broken">b</a><a href="/docs/ok">o</a>',
      "https://example.com/docs/broken": new Error("net::ERR_FAILED"),
      "https://example.com/docs/ok": "ok content",
    });

    const scraped = await websiteScraper("https://example.com/docs/page");

    expect(scraped.map((d) => d.chunkSource)).toEqual([
      "link://https://example.com/docs/page",
      "link://https://example.com/docs/ok",
    ]);
  });

  it("skips pages whose scraped content is empty", async () => {
    mockSite({
      "https://example.com/docs/page": '<a href="/docs/empty">e</a>',
      "https://example.com/docs/empty": "",
    });

    const scraped = await websiteScraper("https://example.com/docs/page");

    expect(scraped.map((d) => d.chunkSource)).toEqual([
      "link://https://example.com/docs/page",
    ]);
    expect(writeToServerDocuments).toHaveBeenCalledTimes(1);
  });

  it("survives a start page that cannot be loaded at all", async () => {
    mockSite({
      "https://example.com/docs/page": new Error("net::ERR_CONNECTION_REFUSED"),
    });

    await expect(
      websiteScraper("https://example.com/docs/page")
    ).resolves.toEqual([]);
  });
});
