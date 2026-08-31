/* eslint-env jest, node */
process.env.STORAGE_DIR = "test-storage"; // needed for tests to run
const { extractLinks } = require("../../../../utils/extensions/WebsiteDepth");

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
});
