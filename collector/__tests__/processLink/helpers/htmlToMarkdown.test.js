/* eslint-env jest, node */
process.env.STORAGE_DIR = "test-storage"; // needed for tests to run
const {
  htmlToMarkdown,
} = require("../../../processLink/helpers/htmlToMarkdown");

describe("htmlToMarkdown citation stripping", () => {
  it("keeps a numeric index inside a fenced code block", async () => {
    const markdown = await htmlToMarkdown(
      "<pre><code>const second = items[1];</code></pre>"
    );
    expect(markdown).toContain("items[1]");
  });

  it("keeps a numeric index inside inline code", async () => {
    const markdown = await htmlToMarkdown(
      "<p>Use <code>arr[0]</code> to read the first element.</p>"
    );
    expect(markdown).toContain("`arr[0]`");
  });

  it("keeps a footnote link whose visible text is a number", async () => {
    const markdown = await htmlToMarkdown(
      '<p>See note<sup><a href="#fn1">1</a></sup> end.</p>',
      "https://example.com"
    );
    // compactLinks emits an unescaped [1](#fn1), so the citation regex ate the
    // link text and left a dangling (#fn1) behind.
    expect(markdown).toBe("See note[1](#fn1) end.");
  });

  it("keeps a numeric image alt text", async () => {
    const markdown = await htmlToMarkdown(
      '<p><img src="/a.png" alt="1"></p>',
      "https://example.com"
    );
    expect(markdown).toBe("![1](https://example.com/a.png)");
  });

  it("keeps a bracketed number inside a link target", async () => {
    const markdown = await htmlToMarkdown(
      '<p><a href="/docs/[1]/page">link</a></p>',
      "https://example.com"
    );
    expect(markdown).toBe("[link](https://example.com/docs/[1]/page)");
  });

  it("still removes a reference superscript from prose", async () => {
    const markdown = await htmlToMarkdown(
      '<p>As shown in the study<sup class="reference">[1]</sup>, results vary.</p>'
    );
    expect(markdown).toBe("As shown in the study, results vary.");
  });
});
