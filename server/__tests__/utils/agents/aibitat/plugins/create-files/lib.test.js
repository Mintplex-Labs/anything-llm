/* eslint-env jest */
const createFilesLib = require("../../../../../../utils/agents/aibitat/plugins/create-files/lib.js");

describe("CreateFilesManager.stripInvalidXmlChars", () => {
  test("removes the form feed produced by a LaTeX backslash sequence", () => {
    // `\frac` arrives as a JSON "\f" escape that decodes to U+000C (form feed),
    // which is illegal in XML 1.0 and corrupts OOXML documents.
    const content = "En la fracción $\x0Crac{3}{5}$";
    const cleaned = createFilesLib.stripInvalidXmlChars(content);
    expect(cleaned).toBe("En la fracción $rac{3}{5}$");
    expect(cleaned).not.toMatch(/[\x00-\x08\x0B\x0C\x0E-\x1F]/);
  });

  test("strips every disallowed C0 control character", () => {
    const dirty = "a\x00b\x08c\x0Bd\x0Ce\x1Ff";
    expect(createFilesLib.stripInvalidXmlChars(dirty)).toBe("abcdef");
  });

  test("preserves tab, line feed, and carriage return (the legal C0 chars)", () => {
    const content = "line1\tcol2\nline2\r\nline3";
    expect(createFilesLib.stripInvalidXmlChars(content)).toBe(content);
  });

  test("leaves clean strings unchanged", () => {
    const content = "# Title\n\nA normal paragraph with **bold** text.";
    expect(createFilesLib.stripInvalidXmlChars(content)).toBe(content);
  });

  test("preserves typical markdown document content", () => {
    const content = [
      "# Quarterly Report\n",
      "## Summary\n",
      "Revenue grew **15%** year-over-year.\n",
      "- Item 1: $1,200\n- Item 2: $3,400\n",
      "| Column A | Column B |\n|----------|----------|\n| value    | value    |",
    ].join("\n");
    expect(createFilesLib.stripInvalidXmlChars(content)).toBe(content);
  });

  test("preserves unicode, accented characters, and emoji", () => {
    const content = "Ñoño résumé naïve — «quotes» 日本語 🎉👍";
    expect(createFilesLib.stripInvalidXmlChars(content)).toBe(content);
  });

  test("preserves HTML tags that appear in rich content", () => {
    const content =
      '<h1>Title</h1>\n<p style="color:red">Hello &amp; goodbye</p>';
    expect(createFilesLib.stripInvalidXmlChars(content)).toBe(content);
  });

  test("preserves code blocks and special syntax", () => {
    const content =
      "```javascript\nconst x = () => { return 42; };\n```\n\n$E = mc^2$";
    expect(createFilesLib.stripInvalidXmlChars(content)).toBe(content);
  });

  test("preserves backslash sequences that are NOT control characters", () => {
    const content =
      "Use \\textbf{bold} and \\newline and C:\\Users\\file.txt";
    expect(createFilesLib.stripInvalidXmlChars(content)).toBe(content);
  });

  test("recursively cleans arrays and nested objects", () => {
    const sheets = [
      {
        name: "Sheet\x0C1",
        csvData: "a,b\n1\x00,2",
        options: { headerStyle: true, autoFit: 1 },
      },
    ];
    expect(createFilesLib.stripInvalidXmlChars(sheets)).toEqual([
      {
        name: "Sheet1",
        csvData: "a,b\n1,2",
        options: { headerStyle: true, autoFit: 1 },
      },
    ]);
  });

  test("returns non-string scalars untouched", () => {
    expect(createFilesLib.stripInvalidXmlChars(null)).toBeNull();
    expect(createFilesLib.stripInvalidXmlChars(undefined)).toBeUndefined();
    expect(createFilesLib.stripInvalidXmlChars(42)).toBe(42);
    expect(createFilesLib.stripInvalidXmlChars(true)).toBe(true);
  });
});
