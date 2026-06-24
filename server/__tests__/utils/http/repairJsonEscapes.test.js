/* eslint-env jest */
const { repairJsonEscapes, safeJsonParse } = require("../../../utils/http");

/**
 * Regression coverage for issue #5883: LLM tool calls emit LaTeX (and Windows
 * paths) with unescaped backslashes inside JSON string values. Standard
 * JSON.parse either decodes them into XML-illegal control characters (`\f`,
 * `\b`) — which corrupts generated .docx/.xlsx/.pptx files and drops the
 * consumed letter — or throws on an invalid escape (`\alpha`), dropping the
 * whole tool call. repairJsonEscapes fixes the raw string before it is parsed.
 *
 * Note: every control character in this file is written as a visible escape
 * (`\f`, `\x00`, etc.) — never as a literal byte — so the assertions stay
 * readable and cannot be silently altered by an editor/formatter.
 */
describe("repairJsonEscapes", () => {
  const parse = (raw) => safeJsonParse(raw, null, { repairLLMEscapes: true });

  // The XML-illegal C0 control characters (everything below 0x20 except the
  // three legal whitespace chars tab/LF/CR). Used to assert clean output.
  // eslint-disable-next-line no-control-regex
  const ILLEGAL_XML_CONTROL = /[\x00-\x08\x0B\x0C\x0E-\x1F]/;

  test("preserves LaTeX \\frac (a plain parse corrupts it into a form feed)", () => {
    const raw = String.raw`{"content":"$\frac{3}{5}$"}`;

    // Baseline (the bug): a plain JSON.parse reads `\f` as a form feed (U+000C)
    // and consumes the 'f', leaving an illegal control char + "rac".
    const naive = JSON.parse(raw).content;
    expect(naive.charCodeAt(1)).toBe(0x0c); // 2nd char is a form feed, not "\"
    expect(naive).not.toContain("frac"); // the 'f' is gone -> "rac"
    expect(naive).toMatch(ILLEGAL_XML_CONTROL);

    // With repair: the literal backslash survives and no control char appears.
    const fixed = parse(raw).content;
    expect(fixed).toBe("$\\frac{3}{5}$");
    expect(fixed).not.toMatch(ILLEGAL_XML_CONTROL);
  });

  test("preserves LaTeX \\binom (a plain parse corrupts it into a backspace)", () => {
    const raw = String.raw`{"content":"$\binom{n}{k}$"}`;
    expect(JSON.parse(raw).content.charCodeAt(1)).toBe(0x08); // backspace
    expect(parse(raw).content).toBe("$\\binom{n}{k}$");
    expect(parse(raw).content).not.toMatch(ILLEGAL_XML_CONTROL);
  });

  test("recovers tool calls that would otherwise fail to parse (\\alpha, \\gamma)", () => {
    const raw = String.raw`{"content":"$\alpha + \gamma = \sqrt{2}\cdot\pi$"}`;
    // Invalid JSON escapes make a plain parse throw -> the whole call is dropped.
    expect(() => JSON.parse(raw)).toThrow();
    expect(parse(raw).content).toBe("$\\alpha + \\gamma = \\sqrt{2}\\cdot\\pi$");
  });

  test("keeps intended whitespace escapes (\\n, \\r, \\t)", () => {
    const raw = String.raw`{"content":"# Title\n\nBody line\twith tab\r\n"}`;
    expect(parse(raw).content).toBe("# Title\n\nBody line\twith tab\r\n");
  });

  // --- Documented, intentional trade-offs (pinned so they aren't "fixed" by
  //     accident) -----------------------------------------------------------

  // LaTeX Greek that collides with a whitespace escape (\nu, \tau, \rho) still
  // decodes to a newline/tab/CR, because models overwhelmingly use \n/\r/\t for
  // real markdown. This mangles the text but, unlike \f/\b, stays XML-legal so
  // it never corrupts a generated document. See repairJsonEscapes JSDoc.
  test("treats LaTeX \\nu/\\tau/\\rho as their whitespace escape (XML-legal)", () => {
    expect(parse(String.raw`{"content":"$\nu$"}`).content).toBe("$\nu$");
    expect(parse(String.raw`{"content":"$\tau$"}`).content).toBe("$\tau$");
    expect(parse(String.raw`{"content":"$\rho$"}`).content).toBe("$\rho$");
    // The whole point of the trade-off: no XML-illegal control char is emitted.
    expect(parse(String.raw`{"content":"$\nu$"}`).content).not.toMatch(
      ILLEGAL_XML_CONTROL
    );
  });

  // A *well-formed* \uXXXX is a valid JSON escape, so repair preserves it even
  // when it decodes to an XML-illegal control char (e.g. a \\u000c -> form feed).
  // Removing those is the job of the downstream stripInvalidXmlChars guard
  // (issue #5760), not this repair pass — they are defense-in-depth.
  test("preserves a well-formed \\u00XX control escape (downstream strips it)", () => {
    const raw = '{"content":"a\\u000cb"}';
    const out = parse(raw).content;
    expect(out.charCodeAt(1)).toBe(0x0c); // the form feed survives the parse
    expect(out).toMatch(ILLEGAL_XML_CONTROL); // repair does NOT sanitize XML
  });

  test("leaves already-escaped backslashes untouched", () => {
    const raw = String.raw`{"path":"C:\\Users\\me\\file.txt"}`;
    expect(parse(raw).path).toBe("C:\\Users\\me\\file.txt");
  });

  test("preserves a well-formed \\uXXXX escape", () => {
    const raw = String.raw`{"content":"snowman ☃ here"}`;
    expect(parse(raw).content).toBe("snowman ☃ here");
  });

  test("treats a malformed \\u (LaTeX \\underline) as a literal backslash", () => {
    const raw = String.raw`{"content":"$\underline{x}$"}`;
    expect(parse(raw).content).toBe("$\\underline{x}$");
  });

  test("handles escaped quotes inside the string without losing parser state", () => {
    const raw = String.raw`{"content":"she said \"hi\" then \beta"}`;
    expect(parse(raw).content).toBe('she said "hi" then \\beta');
  });

  test("does not touch backslashes outside string literals / clean JSON", () => {
    const raw = `{"a":1,"b":"plain","c":[true,null]}`;
    expect(repairJsonEscapes(raw)).toBe(raw); // byte-for-byte unchanged
    expect(parse(raw)).toEqual({ a: 1, b: "plain", c: [true, null] });
  });

  test("is a no-op for strings without backslashes and for non-strings", () => {
    expect(repairJsonEscapes('{"a":"no backslashes"}')).toBe(
      '{"a":"no backslashes"}'
    );
    expect(repairJsonEscapes(null)).toBe(null);
    expect(repairJsonEscapes(42)).toBe(42);
  });

  test("safeJsonParse leaves escapes alone when the flag is not set (default)", () => {
    const raw = String.raw`{"content":"$\frac{1}{2}$"}`;
    // Default behavior is unchanged: the form feed is still produced.
    const out = safeJsonParse(raw).content;
    expect(out.charCodeAt(1)).toBe(0x0c);
    expect(out).not.toContain("frac");
  });
});
