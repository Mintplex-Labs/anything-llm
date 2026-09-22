/* eslint-env jest */
const {
  markdownToTelegram,
  escapeHTML,
} = require("../../../utils/telegramBot/utils/format");

describe("markdownToTelegram", () => {
  describe("empty and null input", () => {
    test("returns empty string for empty input", () => {
      expect(markdownToTelegram("")).toBe("");
    });

    test("returns empty string for null/undefined input", () => {
      expect(markdownToTelegram(null)).toBe("");
      expect(markdownToTelegram(undefined)).toBe("");
    });
  });

  describe("basic markdown conversion", () => {
    test("converts **bold** and __bold__ to <b>", () => {
      expect(markdownToTelegram("this is **bold** text")).toBe(
        "this is <b>bold</b> text"
      );
      expect(markdownToTelegram("this is __bold__ text")).toBe(
        "this is <b>bold</b> text"
      );
    });

    test("converts *italic* and _italic_ to <i>", () => {
      expect(markdownToTelegram("this is *italic* text")).toBe(
        "this is <i>italic</i> text"
      );
      expect(markdownToTelegram("this is _italic_ text")).toBe(
        "this is <i>italic</i> text"
      );
    });

    test("converts ~~strikethrough~~ to <s>", () => {
      expect(markdownToTelegram("this is ~~gone~~ text")).toBe(
        "this is <s>gone</s> text"
      );
    });

    test("converts markdown links to <a href>", () => {
      expect(markdownToTelegram("see [docs](https://example.com) here")).toBe(
        'see <a href="https://example.com">docs</a> here'
      );
    });

    test("converts headings to <b>", () => {
      expect(markdownToTelegram("# Title\nbody")).toBe("<b>Title</b>\nbody");
      expect(markdownToTelegram("### Subsection")).toBe("<b>Subsection</b>");
    });

    test("converts list markers to bullets", () => {
      expect(markdownToTelegram("- one\n- two\n* three")).toBe(
        "• one\n• two\n• three"
      );
    });

    test("converts blockquotes to <i>", () => {
      expect(markdownToTelegram("> quoted line")).toBe("<i>quoted line</i>");
    });

    test("converts horizontal rules to a divider line", () => {
      expect(markdownToTelegram("above\n---\nbelow")).toBe(
        "above\n————————————\nbelow"
      );
    });

    test("supports italic nested inside bold", () => {
      expect(markdownToTelegram("**bold and *nested* here**")).toBe(
        "<b>bold and <i>nested</i> here</b>"
      );
    });

    test("does not italicize underscores inside identifiers", () => {
      expect(markdownToTelegram("the var user_name_here stays")).toBe(
        "the var user_name_here stays"
      );
    });
  });

  describe("HTML escaping", () => {
    test("escapes HTML in plain text", () => {
      expect(markdownToTelegram("a <script>alert(1)</script> & b")).toBe(
        "a &lt;script&gt;alert(1)&lt;/script&gt; &amp; b"
      );
    });

    test("preserves HTML when escapeHtml is false", () => {
      expect(
        markdownToTelegram("a <b>kept</b> & thing", { escapeHtml: false })
      ).toBe("a <b>kept</b> & thing");
    });
  });

  describe("code blocks", () => {
    test("converts fenced code blocks to <pre> and escapes HTML inside", () => {
      expect(markdownToTelegram("```js\nconst a = 1 < 2 && 3 > 2;\n```")).toBe(
        "<pre>const a = 1 &lt; 2 &amp;&amp; 3 &gt; 2;</pre>"
      );
    });

    test("does not apply markdown formatting inside code blocks", () => {
      expect(markdownToTelegram("```\n**not bold** _not italic_\n```")).toBe(
        "<pre>**not bold** _not italic_</pre>"
      );
    });

    test("restores multiple code blocks in order", () => {
      expect(
        markdownToTelegram("```\nfirst\n```\ntext\n```\nsecond\n```")
      ).toBe("<pre>first</pre>\ntext\n<pre>second</pre>");
    });

    test("converts inline code to <code> and escapes HTML inside", () => {
      expect(markdownToTelegram("use `<div>` tag")).toBe(
        "use <code>&lt;div&gt;</code> tag"
      );
    });

    test("does not apply markdown formatting inside inline code", () => {
      expect(markdownToTelegram("run `a ** b` now")).toBe(
        "run <code>a ** b</code> now"
      );
    });

    test("restores multiple inline code spans on one line", () => {
      expect(markdownToTelegram("`a` and `b`")).toBe(
        "<code>a</code> and <code>b</code>"
      );
    });
  });

  describe("code blocks containing $ sequences", () => {
    test("keeps $& from consuming the restored block", () => {
      const result = markdownToTelegram(
        '```bash\nsed -E "s/foo/[$&]/" file\n```'
      );

      expect(result).toBe('<pre>sed -E "s/foo/[$&amp;]/" file</pre>');
      expect(result).not.toContain("CODEBLOCK");
      expect(result).not.toContain("\x00");
    });

    test("keeps a literal $$ in a code block", () => {
      const result = markdownToTelegram("```make\nall:\n\techo $$HOME\n```");

      expect(result).toContain("echo $$HOME");
    });

    test("keeps $& literal in inline code", () => {
      const result = markdownToTelegram("run `echo [$&]` first");

      expect(result).toBe("run <code>echo [$&amp;]</code> first");
      expect(result).not.toContain("INLINECODE");
    });

    test("keeps $` and $' literal in code blocks", () => {
      const result = markdownToTelegram(
        '```awk\nBEGIN { print "$` before, $\' after" }\n```'
      );

      expect(result).toContain("$` before, $' after");
      expect(result).not.toContain("CODEBLOCK");
    });

    test("keeps $ sequences literal in think blocks", () => {
      const result = markdownToTelegram(
        "<think>cost is $$ and $& applies</think>done"
      );

      expect(result).toContain("cost is $$ and $&amp; applies");
      expect(result).not.toContain("THINKBLOCK");
    });

    test("keeps $ sequences in plain text outside code", () => {
      expect(markdownToTelegram("price is $5 and $$ or $& fine")).toBe(
        "price is $5 and $$ or $&amp; fine"
      );
    });
  });

  describe("think blocks", () => {
    test("converts a complete <think> block to a blockquote", () => {
      expect(markdownToTelegram("<think>pondering</think>answer")).toBe(
        "<blockquote>💭 <b>Thinking:</b>\npondering</blockquote>answer"
      );
    });

    test("handles an unclosed <think> tag from a split message", () => {
      expect(markdownToTelegram("<think>still pondering")).toBe(
        "<blockquote>💭 <b>Thinking:</b>\nstill pondering</blockquote>"
      );
    });

    test("handles a closing </think> without an opener from a split message", () => {
      expect(markdownToTelegram("end of thought</think>final answer")).toBe(
        "<blockquote>💭 <b>Thinking continued:</b>\nend of thought</blockquote>final answer"
      );
    });

    test("uses an expandable blockquote for long thinking content", () => {
      const result = markdownToTelegram(`<think>${"x".repeat(250)}</think>ok`);

      expect(result).toContain("<blockquote expandable>");
    });
  });

  describe("tables", () => {
    test("converts markdown tables to aligned preformatted text", () => {
      const result = markdownToTelegram(
        "| Name | Age |\n| --- | --- |\n| Bob | 42 |"
      );

      expect(result).toContain("<pre>");
      expect(result).toContain("Name │ Age");
      expect(result).toContain("Bob");
      expect(result).not.toContain("| --- |");
    });
  });

  describe("unclosed tag handling for streaming", () => {
    test("closes unclosed HTML tags by default", () => {
      expect(markdownToTelegram("<b>hello", { escapeHtml: false })).toBe(
        "<b>hello</b>"
      );
    });

    test("leaves unclosed tags alone when closeUnclosedTags is false", () => {
      expect(
        markdownToTelegram("<b>hello", {
          escapeHtml: false,
          closeUnclosedTags: false,
        })
      ).toBe("<b>hello");
    });

    test("leaves incomplete markdown untouched mid-stream", () => {
      expect(markdownToTelegram("streaming **bold text that got cut")).toBe(
        "streaming **bold text that got cut"
      );
      expect(markdownToTelegram("```js\nconst a = 1;")).toBe(
        "```js\nconst a = 1;"
      );
    });
  });
});

describe("escapeHTML", () => {
  test("escapes ampersands and angle brackets", () => {
    expect(escapeHTML("<a> & </a>")).toBe("&lt;a&gt; &amp; &lt;/a&gt;");
  });

  test("leaves text without special characters unchanged", () => {
    expect(escapeHTML("plain text")).toBe("plain text");
  });
});
