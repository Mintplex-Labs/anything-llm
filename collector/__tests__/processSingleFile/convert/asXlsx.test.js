/* eslint-env jest, node */
process.env.STORAGE_DIR = "test-storage"; // needed for tests to run

const { convertToCSV } = require("../../../processSingleFile/convert/asXlsx");

/**
 * A field has to be quoted when it holds a separator, a double quote or a line
 * break, and an embedded quote is doubled inside it (RFC 4180). Quoting only on
 * a comma left a cell with a line break splitting its row in two, and a cell
 * with a quote producing a field no CSV reader can parse.
 */
describe("convertToCSV", () => {
  it("leaves a plain field unquoted", () => {
    expect(convertToCSV([["a", "b"]])).toBe("a,b");
  });

  it("quotes a field that holds the separator", () => {
    expect(convertToCSV([["plain", "has, a comma"]])).toBe(
      'plain,"has, a comma"'
    );
  });

  it("quotes a field that holds a double quote, and doubles it", () => {
    expect(convertToCSV([["quote", 'he said "hi"']])).toBe(
      'quote,"he said ""hi"""'
    );
  });

  it("produces a parseable field when it holds both a quote and a comma", () => {
    expect(convertToCSV([["both", 'he said "hi", ok']])).toBe(
      'both,"he said ""hi"", ok"'
    );
  });

  it("keeps a cell with a line break inside one logical row", () => {
    const csv = convertToCSV([
      ["header a", "header b"],
      ["newline", "line one\nline two"],
    ]);

    // The line break stays inside the quoted field rather than ending the row.
    expect(csv).toBe('header a,header b\nnewline,"line one\nline two"');
  });

  it("renders an empty cell for null and undefined", () => {
    expect(convertToCSV([[null, undefined, "x"]])).toBe(",,x");
  });

  it("leaves numbers and booleans as they are", () => {
    expect(convertToCSV([[42, 0, true, false]])).toBe("42,0,true,false");
  });

  it("joins rows with a newline", () => {
    expect(convertToCSV([["a"], ["b"], ["c"]])).toBe("a\nb\nc");
  });
});
