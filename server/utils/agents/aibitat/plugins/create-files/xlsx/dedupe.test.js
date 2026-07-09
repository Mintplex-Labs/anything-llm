/**
 * dedupe.test.js — Unit test cho khử trùng dòng Excel.
 * Chạy với Jest (backend AnythingLLM): `yarn test` hoặc `npx jest dedupe`.
 * (describe/it/expect là global của Jest — không cần import.)
 */
const {
  dedupeDataRows,
  dedupeSheets,
  normalizeSheetKey,
  sheetHasFormula,
  isFormulaRow,
  isTotalRow,
} = require("./dedupe.js");

describe("isFormulaRow", () => {
  it("nhận diện ô công thức", () => {
    expect(isFormulaRow(["1", "=SUM(B2:B4)"])).toBe(true);
  });
  it("dòng thường -> false", () => {
    expect(isFormulaRow(["1", "An", "9.2"])).toBe(false);
  });
});

describe("isTotalRow", () => {
  it("nhận diện dòng Tổng/Cộng/Total", () => {
    expect(isTotalRow(["Tổng cộng", 100])).toBe(true);
    expect(isTotalRow(["Cộng", 5])).toBe(true);
    expect(isTotalRow(["Total", 5])).toBe(true);
  });
  it("dòng thường -> false", () => {
    expect(isTotalRow(["Nguyễn Văn A", 5])).toBe(false);
  });
});

describe("sheetHasFormula", () => {
  it("true khi có ít nhất 1 công thức", () => {
    expect(sheetHasFormula([["H"], ["1"], ["=A1"]])).toBe(true);
  });
  it("false khi không có công thức", () => {
    expect(sheetHasFormula([["H"], ["1"], ["2"]])).toBe(false);
  });
});

describe("dedupeDataRows", () => {
  it("bỏ dòng dữ liệu trùng hệt, giữ tiêu đề + thứ tự", () => {
    const rows = [
      ["STT", "Tên"],
      ["1", "An"],
      ["2", "Bình"],
      ["1", "An"], // trùng
      ["2", "Bình"], // trùng
    ];
    const { rows: out, removed } = dedupeDataRows(rows);
    expect(out).toEqual([
      ["STT", "Tên"],
      ["1", "An"],
      ["2", "Bình"],
    ]);
    expect(removed).toBe(2);
  });

  it("KHÔNG bỏ dòng khác nhau ở STT (chỉ khác 1 ô)", () => {
    const rows = [
      ["STT", "Tên"],
      ["1", "An"],
      ["2", "An"], // cùng tên, khác STT -> giữ
    ];
    const { removed } = dedupeDataRows(rows);
    expect(removed).toBe(0);
  });

  it("giữ nguyên dòng công thức và dòng tổng dù trùng", () => {
    const rows = [
      ["Chỉ tiêu", "Giá trị"],
      ["A", "=B1"],
      ["A", "=B1"], // có công thức -> giữ
      ["Tổng", "10"],
      ["Tổng", "10"], // dòng tổng -> giữ
    ];
    const { rows: out, removed } = dedupeDataRows(rows);
    expect(removed).toBe(0);
    expect(out).toHaveLength(5);
  });

  it("<= 1 dòng dữ liệu thì trả nguyên", () => {
    const rows = [["H"], ["1"]];
    expect(dedupeDataRows(rows)).toEqual({ rows, removed: 0 });
  });

  it("đầu vào không phải mảng -> []", () => {
    expect(dedupeDataRows(null)).toEqual({ rows: [], removed: 0 });
  });
});

describe("dedupeSheets", () => {
  it("gộp các sheet trùng hệt nội dung, chỉ giữ sheet đầu tiên", () => {
    const csv = "STT,Tên\n1,An\n2,Bình";
    const { sheets, removed, aliases } = dedupeSheets([
      { name: "File A", csvData: csv },
      { name: "File B", csvData: csv }, // trùng hệt
      { name: "File C", csvData: csv }, // trùng hệt
    ]);
    expect(sheets).toHaveLength(1);
    expect(sheets[0].name).toBe("File A");
    expect(removed).toBe(2);
    // Biểu đồ trỏ tới "File B"/"File C" phải được ánh xạ về "File A"
    expect(aliases.get("file b")).toBe("File A");
    expect(aliases.get("file c")).toBe("File A");
  });

  it("KHÔNG gộp sheet khác nhau dù chỉ một ô", () => {
    const { sheets, removed } = dedupeSheets([
      { name: "S1", csvData: "STT,Tên\n1,An" },
      { name: "S2", csvData: "STT,Tên\n1,Anh" },
    ]);
    expect(sheets).toHaveLength(2);
    expect(removed).toBe(0);
  });

  it("coi CRLF và khoảng trắng cuối dòng là như nhau", () => {
    const { removed } = dedupeSheets([
      { name: "S1", csvData: "STT,Tên\n1,An" },
      { name: "S2", csvData: "STT,Tên  \r\n1,An\r\n" },
    ]);
    expect(removed).toBe(1);
  });

  it("gộp charts của sheet trùng vào sheet giữ lại", () => {
    const csv = "STT,Tên\n1,An";
    const { sheets } = dedupeSheets([
      { name: "A", csvData: csv, charts: [{ title: "c1" }] },
      { name: "B", csvData: csv, charts: [{ title: "c2" }] },
    ]);
    expect(sheets).toHaveLength(1);
    expect(sheets[0].charts.map((c) => c.title)).toEqual(["c1", "c2"]);
  });

  it("đầu vào không phải mảng -> rỗng", () => {
    expect(dedupeSheets(null)).toEqual({
      sheets: [],
      aliases: new Map(),
      removed: 0,
    });
  });
});

describe("normalizeSheetKey", () => {
  it("chuẩn hoá xuống dòng và khoảng trắng cuối", () => {
    expect(normalizeSheetKey("a,b  \r\nc,d\r\n")).toBe("a,b\nc,d");
  });
});
