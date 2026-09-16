/* eslint-env jest, node */
process.env.STORAGE_DIR = "test-storage"; // needed for tests to run
const {
  htmlToMarkdown,
} = require("../../../processLink/helpers/htmlToMarkdown");

describe("htmlToMarkdown", () => {
  describe("input handling", () => {
    it("returns an empty string for null, undefined, and non-string input", async () => {
      expect(await htmlToMarkdown(null)).toBe("");
      expect(await htmlToMarkdown(undefined)).toBe("");
      expect(await htmlToMarkdown(12345)).toBe("");
      expect(await htmlToMarkdown("")).toBe("");
    });

    it("trims surrounding whitespace from the output", async () => {
      expect(await htmlToMarkdown("<div>  <p>x</p>  </div>")).toBe("x");
    });
  });

  describe("content container selection", () => {
    it("prefers <article> over <main> to avoid page chrome", async () => {
      const markdown = await htmlToMarkdown(
        "<main><p>file tree chrome</p><article><p>readme body</p></article></main>"
      );
      expect(markdown).toBe("readme body");
    });

    it("scopes to [role=main] when no article or main exists", async () => {
      const markdown = await htmlToMarkdown(
        '<div role="main"><p>kept</p></div><div><p>outside</p></div>'
      );
      expect(markdown).toBe("kept");
    });

    it("uses the whole document when no content container exists", async () => {
      const markdown = await htmlToMarkdown("<div><p>a</p><p>b</p></div>");
      expect(markdown).toBe("a\n\nb");
    });
  });

  describe("junk and hidden element stripping", () => {
    it("removes nav, header, footer, and aside even inside the content container", async () => {
      const markdown = await htmlToMarkdown(
        "<nav>menu</nav><article><header>h</header><p>keep</p><aside>ad</aside><footer>f</footer></article>"
      );
      expect(markdown).toBe("keep");
    });

    it("removes script and style content", async () => {
      const markdown = await htmlToMarkdown(
        "<p>a</p><script>evil()</script><style>p{}</style>"
      );
      expect(markdown).toBe("a");
    });

    it("removes elements hidden via inline style, hidden, or aria-hidden", async () => {
      const markdown = await htmlToMarkdown(
        '<article><p style="display: none">a</p><p style="visibility:hidden">b</p>' +
          '<p hidden>c</p><p aria-hidden="true">d</p><p>kept</p></article>'
      );
      expect(markdown).toBe("kept");
    });
  });

  describe("URL resolution", () => {
    it("resolves relative link hrefs against the base URL", async () => {
      const markdown = await htmlToMarkdown(
        '<p><a href="/x/y">go</a></p>',
        "https://ex.com/base/"
      );
      expect(markdown).toBe("[go](https://ex.com/x/y)");
    });

    it("leaves mailto and fragment hrefs untouched", async () => {
      const markdown = await htmlToMarkdown(
        '<p><a href="mailto:a@b.c">mail</a> <a href="#top">top</a></p>',
        "https://ex.com"
      );
      expect(markdown).toBe("[mail](mailto:a@b.c) [top](#top)");
    });

    it("leaves relative hrefs as-is when no base URL is given", async () => {
      const markdown = await htmlToMarkdown('<p><a href="/x/y">go</a></p>');
      expect(markdown).toBe("[go](/x/y)");
    });

    it("resolves relative image srcs against the base URL", async () => {
      const markdown = await htmlToMarkdown(
        '<p><img src="./pics/a.png" alt="pic"></p>',
        "https://ex.com/docs/"
      );
      expect(markdown).toBe("![pic](https://ex.com/docs/pics/a.png)");
    });
  });

  describe("image filtering", () => {
    it("removes base64 data-URI images", async () => {
      const markdown = await htmlToMarkdown(
        '<p>t <img src="data:image/png;base64,AAAA" alt="x"></p>',
        "https://ex.com"
      );
      expect(markdown).toBe("t");
    });

    it("removes badge/tracking images from ignored basepaths", async () => {
      const markdown = await htmlToMarkdown(
        '<p>t <img src="https://img.shields.io/badge/x.svg" alt="badge"></p>',
        "https://ex.com"
      );
      expect(markdown).toBe("t");
    });

    it("gives alt-less images a filename-based alt", async () => {
      const markdown = await htmlToMarkdown(
        '<p><img src="/imgs/photo.png"></p>',
        "https://ex.com"
      );
      expect(markdown).toBe("![photo.png](https://ex.com/imgs/photo.png)");
    });
  });

  describe("compactLinks rule", () => {
    it("collapses whitespace inside link text", async () => {
      const markdown = await htmlToMarkdown(
        '<p><a href="/x">two\n  words</a></p>',
        "https://ex.com"
      );
      expect(markdown).toBe("[two words](https://ex.com/x)");
    });

    it("drops links with no visible text entirely", async () => {
      const markdown = await htmlToMarkdown(
        '<p>before<a href="/x">   </a>after</p>',
        "https://ex.com"
      );
      expect(markdown).toBe("before after");
    });

    it("keeps the text of an anchor with no href", async () => {
      const markdown = await htmlToMarkdown("<p><a>plain</a></p>");
      expect(markdown).toBe("plain");
    });
  });

  describe("long URL stripping", () => {
    const longUrl = `https://ex.com/${"a".repeat(300)}`;

    it("removes images with 200+ character URLs", async () => {
      const markdown = await htmlToMarkdown(
        `<p>keep <img src="${longUrl}.png" alt="big"> end</p>`
      );
      expect(markdown).toBe("keep end");
    });

    it("unwraps links with 200+ character URLs, keeping the text", async () => {
      const markdown = await htmlToMarkdown(
        `<p><a href="${longUrl}">label</a></p>`
      );
      expect(markdown).toBe("label");
    });
  });

  describe("citation stripping", () => {
    it("removes reference and noprint superscripts before conversion", async () => {
      expect(
        await htmlToMarkdown(
          '<p>As shown in the study<sup class="reference">[1]</sup>, results vary.</p>'
        )
      ).toBe("As shown in the study, results vary.");
      expect(
        await htmlToMarkdown('<p>fact<sup class="noprint">[note]</sup>.</p>')
      ).toBe("fact.");
    });

    it("removes reference-section containers like .reflist", async () => {
      const markdown = await htmlToMarkdown(
        '<article><p>body</p><div class="reflist"><p>ref1</p></div></article>'
      );
      expect(markdown).toBe("body");
    });

    it("removes MediaWiki section-edit controls from headings", async () => {
      const markdown = await htmlToMarkdown(
        '<h2><span class="mw-headline">Intro</span>' +
          '<span class="mw-editsection">' +
          '<span class="mw-editsection-bracket">[</span>' +
          '<a href="/w/index.php?title=Help:Section&amp;action=edit&amp;section=1">edit</a>' +
          '<span class="mw-editsection-bracket">]</span>' +
          "</span></h2><p>Body text.</p>",
        "https://www.mediawiki.org"
      );
      expect(markdown).toBe("## Intro\n\nBody text.");
    });

    it("removes section-edit controls without touching [edit] in body code", async () => {
      const markdown = await htmlToMarkdown(
        '<h2>Config<span class="mw-editsection">[<a href="/edit">edit</a>]</span></h2>' +
          "<pre><code>config[edit] = true;</code></pre>",
        "https://example.com"
      );
      expect(markdown).toBe("## Config\n\n```\nconfig[edit] = true;\n```");
    });

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

    it("keeps a section marker inside a fenced code block", async () => {
      const markdown = await htmlToMarkdown(
        "<pre><code>config[edit] = true;</code></pre>"
      );
      expect(markdown).toContain("config[edit] = true;");
    });

    it("keeps a section marker inside inline code", async () => {
      const markdown = await htmlToMarkdown(
        "<p>Set <code>menu[edit]</code> to enable it.</p>"
      );
      expect(markdown).toContain("`menu[edit]`");
    });

    it("keeps an uppercase section marker inside code", async () => {
      const markdown = await htmlToMarkdown(
        "<pre><code>config[EDIT] = true;</code></pre>"
      );
      expect(markdown).toContain("config[EDIT] = true;");
    });

    it("keeps a link whose visible text is the section marker", async () => {
      const markdown = await htmlToMarkdown(
        '<p><a href="/wiki/page?action=edit">edit</a></p>',
        "https://example.com"
      );
      expect(markdown).toBe(
        "[edit](https://example.com/wiki/page?action=edit)"
      );
    });

    it("keeps a section marker inside a link target", async () => {
      const markdown = await htmlToMarkdown(
        '<p><a href="/docs/[edit]/page">link</a></p>',
        "https://example.com"
      );
      expect(markdown).toBe("[link](https://example.com/docs/[edit]/page)");
    });

    it("keeps a cite anchor inside a fenced code block", async () => {
      const markdown = await htmlToMarkdown(
        "<pre><code>const ref = notes[#cite_note-1];</code></pre>"
      );
      expect(markdown).toContain("notes[#cite_note-1]");
    });

    it("keeps a link whose visible text is a cite anchor", async () => {
      const markdown = await htmlToMarkdown(
        '<p><a href="#cite_note-1">#cite_note-1</a></p>',
        "https://example.com"
      );
      // compactLinks emits an unescaped [text](href), so the cite pattern ate
      // the link text and left a dangling (#cite_note-1) behind.
      expect(markdown).toBe("[#cite\\_note-1](#cite_note-1)");
    });

    it("keeps a bracketed cite marker in prose", async () => {
      // Turndown escapes brackets in prose, and the cite pattern's [^\]]*
      // spans the backslash before the escaped closing bracket. It therefore
      // matched from the opening bracket through the closing one and left the
      // first backslash stranded, turning this whole phrase into "See \ for
      // details." The numeric pattern could not reach escaped prose this way.
      const markdown = await htmlToMarkdown(
        "<p>See [#cite_note-1] for details.</p>"
      );
      expect(markdown).toBe("See \\[#cite\\_note-1\\] for details.");
    });
  });
  describe("tables", () => {
    /** Read the markdown table back the way a reader does. */
    const tableRows = (markdown) =>
      markdown
        .split("\n")
        .filter((line) => line.trim().startsWith("|"))
        .map((line) =>
          line
            .trim()
            .replace(/^\||\|$/g, "")
            .split(/(?<!\\)\|/)
            .map((cell) => cell.replace(/\\(.)/g, "$1").trim())
        );

    it("keeps a value in the row and the column it belongs to", async () => {
      // Turndown ships no table rules, so every cell came out as a paragraph
      // of its own and a price lost the product it belonged to.
      const markdown = await htmlToMarkdown(
        "<h1>Specs</h1>" +
          "<table><thead><tr><th>Product</th><th>Price</th></tr></thead>" +
          "<tbody><tr><td>Cable</td><td>9 EUR</td></tr>" +
          "<tr><td>Hub</td><td>29 EUR</td></tr></tbody></table>" +
          "<p>after</p>"
      );

      expect(tableRows(markdown)).toEqual([
        ["Product", "Price"],
        ["---", "---"],
        ["Cable", "9 EUR"],
        ["Hub", "29 EUR"],
      ]);
      // The table has to be a block of its own, or it is read as prose.
      expect(markdown).toBe(
        "# Specs\n\n| Product | Price |\n| --- | --- |\n| Cable | 9 EUR |\n| Hub | 29 EUR |\n\nafter"
      );
    });

    it("uses the first row as the header when the page wrote no th", async () => {
      const markdown = await htmlToMarkdown(
        "<table><tr><td>Product</td><td>Price</td></tr>" +
          "<tr><td>Cable</td><td>9 EUR</td></tr></table>"
      );

      expect(tableRows(markdown)).toEqual([
        ["Product", "Price"],
        ["---", "---"],
        ["Cable", "9 EUR"],
      ]);
    });

    it("keeps a pipe inside the cell that holds it", async () => {
      const markdown = await htmlToMarkdown(
        "<table><tr><th>Product</th><th>Spec</th></tr>" +
          "<tr><td>Cable</td><td>USB-A|USB-C</td></tr></table>"
      );

      expect(tableRows(markdown)[2]).toEqual(["Cable", "USB-A|USB-C"]);
    });

    it("keeps a cell's own backslash next to a pipe", async () => {
      const markdown = await htmlToMarkdown(
        "<table><tr><th>Pattern</th></tr><tr><td>a\\|b</td></tr></table>"
      );

      expect(tableRows(markdown)[2]).toEqual(["a\\|b"]);
    });

    it("keeps the inline markup and the resolved links inside a cell", async () => {
      const markdown = await htmlToMarkdown(
        "<table><tr><th>Item</th></tr>" +
          '<tr><td><b>Cable</b>, see <a href="/docs">Docs</a></td></tr></table>',
        "https://example.com"
      );

      expect(tableRows(markdown)[2]).toEqual([
        "**Cable**, see [Docs](https://example.com/docs)",
      ]);
    });

    it("puts a caption in its own paragraph above the table", async () => {
      const markdown = await htmlToMarkdown(
        "<table><caption>Prices</caption><tr><th>A</th></tr><tr><td>1</td></tr></table>"
      );

      expect(markdown).toBe("Prices\n\n| A |\n| --- |\n| 1 |");
    });

    it("leaves a page without a table alone", async () => {
      expect(await htmlToMarkdown("<h1>Title</h1><p>hello</p>")).toBe(
        "# Title\n\nhello"
      );
    });
  });
});
