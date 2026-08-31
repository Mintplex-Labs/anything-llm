/* eslint-env jest */
const {
  markdownToTelegram,
} = require("../../../utils/telegramBot/utils/format");

describe("markdownToTelegram code blocks containing $ sequences", () => {
  test("keeps $& from consuming the restored block", () => {
    const result = markdownToTelegram('```bash\nsed -E "s/foo/[$&]/" file\n```');

    expect(result).toBe('<pre>sed -E "s/foo/[$&amp;]/" file</pre>');
    expect(result).not.toContain("CODEBLOCK");
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
});
