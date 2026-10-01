/* eslint-env jest */
const ExcelJS = require("exceljs");
const {
  parseCSV,
  validateCSVData,
  detectDelimiter,
  inferCellType,
  applyBranding,
  autoFitColumns,
  applyHeaderStyle,
  applyZebraStriping,
  freezePanes,
} = require("../../../../../../../utils/agents/aibitat/plugins/create-files/xlsx/utils.js");

function sheetWith(rows) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");
  rows.forEach((row) => worksheet.addRow(row));
  return { workbook, worksheet };
}

describe("parseCSV", () => {
  test("splits rows and fields, trimming whitespace", () => {
    expect(parseCSV("a, b ,c\n1,2,3")).toEqual([
      ["a", "b", "c"],
      ["1", "2", "3"],
    ]);
  });

  test("handles LF, CRLF, and bare CR line endings", () => {
    expect(parseCSV("a,b\r\n1,2\r3,4\n5,6")).toEqual([
      ["a", "b"],
      ["1", "2"],
      ["3", "4"],
      ["5", "6"],
    ]);
  });

  test("keeps delimiters and newlines inside quoted fields", () => {
    expect(parseCSV('name,notes\nAda,"one, two\nthree"')).toEqual([
      ["name", "notes"],
      ["Ada", "one, two\nthree"],
    ]);
  });

  test("unescapes doubled quotes inside quoted fields", () => {
    expect(parseCSV('"say ""hi""",x')).toEqual([['say "hi"', "x"]]);
  });

  test("drops blank and all-empty rows", () => {
    expect(parseCSV("a,b\n\n,,\n1,2\n")).toEqual([
      ["a", "b"],
      ["1", "2"],
    ]);
  });

  test("keeps empty cells inside a row that has content", () => {
    expect(parseCSV("a,,c\n,2,")).toEqual([
      ["a", "", "c"],
      ["", "2", ""],
    ]);
  });

  test("uses the given delimiter and treats commas as data", () => {
    expect(parseCSV("a;b\n1,5;2", ";")).toEqual([
      ["a", "b"],
      ["1,5", "2"],
    ]);
    expect(parseCSV("a\tb\n1\t2", "\t")).toEqual([
      ["a", "b"],
      ["1", "2"],
    ]);
  });

  test("keeps a row with no trailing newline", () => {
    expect(parseCSV("only")).toEqual([["only"]]);
  });

  test("returns an empty array for empty or whitespace-only input", () => {
    expect(parseCSV("")).toEqual([]);
    expect(parseCSV("\n\r\n  \n")).toEqual([]);
  });

  test("reads an unterminated quote to the end of the input", () => {
    expect(parseCSV('a,"b\nc')).toEqual([["a", "b\nc"]]);
  });
});

describe("validateCSVData", () => {
  test("accepts a rectangular table with no warnings", () => {
    expect(
      validateCSVData([
        ["a", "b"],
        ["1", "2"],
      ])
    ).toEqual({ valid: true, warnings: undefined });
  });

  test.each([[null], [undefined], [[]]])("rejects %j as empty", (data) => {
    expect(validateCSVData(data)).toEqual({
      valid: false,
      error: "CSV data is empty",
    });
  });

  test("rejects a single empty cell", () => {
    expect(validateCSVData([[""]])).toEqual({
      valid: false,
      error: "CSV data contains no meaningful content",
    });
  });

  test("accepts a single non-empty cell", () => {
    expect(validateCSVData([["x"]]).valid).toBe(true);
  });

  test("warns about ragged rows but stays valid", () => {
    const result = validateCSVData([["a", "b", "c"], ["1"], ["1", "2"]]);
    expect(result.valid).toBe(true);
    expect(result.warnings).toEqual([
      "Inconsistent column count: rows have between 1 and 3 columns. Missing cells will be empty.",
    ]);
  });

  test("accepts exactly 16,384 columns and rejects 16,385", () => {
    expect(validateCSVData([new Array(16384).fill("x")]).valid).toBe(true);
    expect(validateCSVData([new Array(16385).fill("x")])).toEqual({
      valid: false,
      error: "CSV has 16385 columns, exceeding Excel's limit of 16,384 columns",
    });
  });

  test("accepts exactly 1,048,576 rows and rejects 1,048,577", () => {
    const row = ["x"];
    expect(validateCSVData(new Array(1048576).fill(row)).valid).toBe(true);
    expect(validateCSVData(new Array(1048577).fill(row))).toEqual({
      valid: false,
      error: "CSV has 1048577 rows, exceeding Excel's limit of 1,048,576 rows",
    });
  });
});

describe("detectDelimiter", () => {
  test.each([
    ["a,b,c\n1,2,3", ","],
    ["a;b;c\n1;2;3", ";"],
    ["a\tb\tc\n1\t2\t3", "\t"],
    ["a|b|c\n1|2|3", "|"],
  ])("detects the delimiter in %j", (csv, expected) => {
    expect(detectDelimiter(csv)).toBe(expected);
  });

  test("picks the most frequent delimiter in the first line", () => {
    expect(detectDelimiter("price;qty;note\n1,5;2;a,b,c,d")).toBe(";");
    expect(detectDelimiter("a\tb\tc,d")).toBe("\t");
  });

  test("looks only at the first line, with LF or CRLF endings", () => {
    expect(detectDelimiter("a;b\r\n1,2,3,4")).toBe(";");
  });

  test("falls back to a comma when no delimiter is present", () => {
    expect(detectDelimiter("single column")).toBe(",");
    expect(detectDelimiter("")).toBe(",");
  });

  test("prefers the earlier delimiter on a tie", () => {
    expect(detectDelimiter("a,b;c")).toBe(",");
  });
});

describe("inferCellType", () => {
  test.each([
    ["42", 42],
    ["-0.5", -0.5],
    ["  42 ", 42],
    ["007", 7],
    ["1,234", 1234],
    ["1,234,567.89", 1234567.89],
    ["-1,234", -1234],
    ["$1,234.56", 1234.56],
    ["$ 12", 12],
    ["$-5", -5],
    ["€99.99", 99.99],
    ["£1000", 1000],
    ["¥1,000", 1000],
    ["50%", 0.5],
    ["12.5%", 0.125],
  ])("converts %j to the number %j", (input, expected) => {
    expect(inferCellType(input)).toBe(expected);
  });

  test.each([
    "192.168.1.10",
    "2.10.1",
    "555.123.4567",
    "12,5",
    "1.234,56",
    "1,23,456",
    "€1.234,56",
    "₹1,23,456",
    "$1.2.3",
    "$192.168.1.10",
    "$1,23",
    "-$5",
    "$",
    "12.",
    ".5",
    "1e5",
    "0x1A",
    "-5%",
    "5 %",
    "Infinity",
    "NaN",
    "null",
    "abc",
  ])("keeps %j as text", (input) => {
    expect(inferCellType(input)).toBe(input);
  });

  test("returns non-numeric text untrimmed", () => {
    expect(inferCellType("  hello  ")).toBe("  hello  ");
  });

  test("converts booleans case-insensitively, ignoring surrounding space", () => {
    expect(inferCellType("TRUE")).toBe(true);
    expect(inferCellType(" false ")).toBe(false);
    expect(inferCellType("yes")).toBe("yes");
  });

  test("returns an empty string for empty or missing values", () => {
    expect(inferCellType("")).toBe("");
    expect(inferCellType(null)).toBe("");
    expect(inferCellType(undefined)).toBe("");
  });

  test("converts an ISO date to UTC midnight", () => {
    const result = inferCellType("2024-03-15");
    expect(result).toBeInstanceOf(Date);
    expect(result.toISOString()).toBe("2024-03-15T00:00:00.000Z");
  });

  test.each(["2024/03/15", "03/15/2024", "03-15-2024"])(
    "converts the date %j to local midnight",
    (input) => {
      const result = inferCellType(input);
      expect(result).toBeInstanceOf(Date);
      expect(result.getTime()).toBe(new Date(2024, 2, 15).getTime());
    }
  );

  test.each(["2024-13-45", "99/99/9999", "2024-3-15", "15 March 2024"])(
    "keeps the invalid or unrecognised date %j as text",
    (input) => {
      expect(inferCellType(input)).toBe(input);
    }
  );
});

describe("applyBranding", () => {
  test("adds a merged, styled branding row two rows below the data", () => {
    const { workbook, worksheet } = sheetWith([
      ["a", "b", "c"],
      [1, 2, 3],
    ]);
    applyBranding(workbook);

    const cell = worksheet.getCell(4, 1);
    expect(cell.value).toBe("Created with AnythingLLM");
    expect(cell.font).toEqual({
      italic: true,
      size: 9,
      color: { argb: "FF999999" },
    });
    expect(cell.alignment).toEqual({
      horizontal: "right",
      vertical: "middle",
    });
    expect(worksheet.getCell(4, 3).isMerged).toBe(true);
    expect(worksheet.getCell(3, 1).value).toBeNull();
  });

  test("does not merge when the sheet has one column", () => {
    const { workbook, worksheet } = sheetWith([["a"], ["b"]]);
    applyBranding(workbook);
    expect(worksheet.getCell(4, 1).value).toBe("Created with AnythingLLM");
    expect(worksheet.getCell(4, 1).isMerged).toBe(false);
  });

  test("brands every sheet in the workbook", () => {
    const workbook = new ExcelJS.Workbook();
    workbook.addWorksheet("One").addRow(["a", "b"]);
    workbook.addWorksheet("Two").addRow(["x"]);
    applyBranding(workbook);
    for (const worksheet of workbook.worksheets) {
      expect(worksheet.getCell(3, 1).value).toBe("Created with AnythingLLM");
    }
  });

  test("places the branding on row 3 of an empty sheet", () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Empty");
    applyBranding(workbook);
    expect(worksheet.getCell(3, 1).value).toBe("Created with AnythingLLM");
  });
});

describe("autoFitColumns", () => {
  test("sizes each column to its longest value plus padding", () => {
    const { worksheet } = sheetWith([
      ["id", "a much longer header"],
      [123456789012, "x"],
    ]);
    autoFitColumns(worksheet);
    expect(worksheet.getColumn(1).width).toBe(14);
    expect(worksheet.getColumn(2).width).toBe(22);
  });

  test("never goes below the minimum width", () => {
    const { worksheet } = sheetWith([["a"]]);
    autoFitColumns(worksheet);
    expect(worksheet.getColumn(1).width).toBe(10);
  });

  test("caps the width at the maximum", () => {
    const { worksheet } = sheetWith([["x".repeat(200)]]);
    autoFitColumns(worksheet);
    expect(worksheet.getColumn(1).width).toBe(50);
  });

  test("respects custom minimum and maximum widths", () => {
    const { worksheet } = sheetWith([["abc", "x".repeat(40)]]);
    autoFitColumns(worksheet, 2, 20);
    expect(worksheet.getColumn(1).width).toBe(5);
    expect(worksheet.getColumn(2).width).toBe(20);
  });

  test("measures dates, booleans, and rich text", () => {
    const { worksheet } = sheetWith([
      [
        new Date("2024-03-15"),
        true,
        { richText: [{ text: "hello " }, { text: "world, again" }] },
      ],
    ]);
    autoFitColumns(worksheet, 1);
    expect(worksheet.getColumn(1).width).toBe(14);
    expect(worksheet.getColumn(2).width).toBe(6);
    expect(worksheet.getColumn(3).width).toBe(20);
  });
});

describe("applyHeaderStyle", () => {
  test("styles every header cell with the default colours", () => {
    const { worksheet } = sheetWith([
      ["a", "b"],
      [1, 2],
    ]);
    applyHeaderStyle(worksheet);

    for (const col of [1, 2]) {
      const cell = worksheet.getCell(1, col);
      expect(cell.font).toEqual({ bold: true, color: { argb: "FFFFFFFF" } });
      expect(cell.fill).toEqual({
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF4472C4" },
      });
      expect(cell.alignment).toEqual({
        vertical: "middle",
        horizontal: "center",
      });
    }
    expect(worksheet.getRow(1).height).toBe(20);
    expect(worksheet.getCell(2, 1).fill).toBeUndefined();
  });

  test("applies custom options", () => {
    const { worksheet } = sheetWith([["a"]]);
    applyHeaderStyle(worksheet, {
      bold: false,
      fill: "FF000000",
      fontColor: "FFFF0000",
    });
    const cell = worksheet.getCell(1, 1);
    expect(cell.font).toEqual({ bold: false, color: { argb: "FFFF0000" } });
    expect(cell.fill.fgColor).toEqual({ argb: "FF000000" });
  });

  test("leaves an empty sheet untouched", () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Empty");
    applyHeaderStyle(worksheet);
    expect(worksheet.getRow(1).height).toBeUndefined();
  });
});

describe("applyZebraStriping", () => {
  const stripe = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFF2F2F2" },
  };

  test("fills even data rows and skips the header and odd rows", () => {
    const { worksheet } = sheetWith([["h"], [1], [2], [3], [4]]);
    applyZebraStriping(worksheet);
    expect(worksheet.getCell(1, 1).fill).toBeUndefined();
    expect(worksheet.getCell(2, 1).fill).toEqual(stripe);
    expect(worksheet.getCell(3, 1).fill).toBeUndefined();
    expect(worksheet.getCell(4, 1).fill).toEqual(stripe);
    expect(worksheet.getCell(5, 1).fill).toBeUndefined();
  });

  test("does not overwrite an existing pattern fill", () => {
    const { worksheet } = sheetWith([["h"], [1]]);
    const existing = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFF0000" },
    };
    worksheet.getCell(2, 1).fill = existing;
    applyZebraStriping(worksheet);
    expect(worksheet.getCell(2, 1).fill).toEqual(existing);
  });

  test("respects a custom colour and start row", () => {
    const { worksheet } = sheetWith([["h"], [1], [2], [3], [4]]);
    applyZebraStriping(worksheet, "FF00FF00", 3);
    expect(worksheet.getCell(2, 1).fill).toBeUndefined();
    expect(worksheet.getCell(4, 1).fill.fgColor).toEqual({ argb: "FF00FF00" });
  });

  test("stripes every cell in the row", () => {
    const { worksheet } = sheetWith([
      ["h1", "h2", "h3"],
      [1, 2, 3],
    ]);
    applyZebraStriping(worksheet);
    for (const col of [1, 2, 3]) {
      expect(worksheet.getCell(2, col).fill).toEqual(stripe);
    }
  });
});

describe("freezePanes", () => {
  test("freezes the header row by default", () => {
    const { worksheet } = sheetWith([["a"]]);
    freezePanes(worksheet);
    expect(worksheet.views).toEqual([
      { state: "frozen", xSplit: 0, ySplit: 1 },
    ]);
  });

  test("freezes the given rows and columns, replacing earlier views", () => {
    const { worksheet } = sheetWith([["a"]]);
    freezePanes(worksheet);
    freezePanes(worksheet, 2, 3);
    expect(worksheet.views).toEqual([
      { state: "frozen", xSplit: 3, ySplit: 2 },
    ]);
  });
});
