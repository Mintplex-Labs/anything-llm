/**
 * dedupe.js — Khử trùng dòng dữ liệu trong MỘT sheet Excel.
 * ----------------------------------------------------------------------------
 * `rows` là mảng-các-dòng (kết quả parseCSV), dòng 0 là tiêu đề, mỗi ô là chuỗi.
 *
 * QUY TẮC AN TOÀN (tránh phá số liệu/công thức):
 *  - Luôn GIỮ dòng tiêu đề (dòng 0).
 *  - Giữ nguyên thứ tự; chỉ bỏ dòng TRÙNG HỆT (so toàn bộ ô) xuất hiện sau.
 *  - KHÔNG đụng dòng chứa công thức (ô bắt đầu '=') và dòng tổng
 *    ('tổng'/'cộng'/'total') — luôn giữ lại.
 *  - Bên gọi NÊN chỉ dedupe khi cả sheet KHÔNG có công thức (dùng sheetHasFormula),
 *    vì công thức thường tham chiếu theo vị trí dòng của lưới CSV.
 *
 * CommonJS để khớp backend AnythingLLM.
 */

function isFormulaRow(row) {
  return (
    Array.isArray(row) &&
    row.some((c) => typeof c === "string" && c.trim().startsWith("="))
  );
}

function isTotalRow(row) {
  if (!Array.isArray(row) || row[0] == null) return false;
  const first = String(row[0]).trim().toLowerCase();
  return (
    first.startsWith("tổng") ||
    first.startsWith("cộng") ||
    first.startsWith("total")
  );
}

/** true nếu sheet có bất kỳ ô công thức nào. */
function sheetHasFormula(rows) {
  return Array.isArray(rows) && rows.some(isFormulaRow);
}

/**
 * Chuẩn hoá nội dung CSV của một sheet để so trùng: bỏ khác biệt do xuống dòng
 * (CRLF/CR -> LF), khoảng trắng cuối mỗi dòng và đầu/cuối chuỗi. Giữ nguyên chữ
 * hoa/thường và dấu để chỉ gộp những sheet THỰC SỰ trùng nội dung.
 * @param {string} csvData
 * @returns {string}
 */
function normalizeSheetKey(csvData) {
  return String(csvData || "")
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.replace(/\s+$/, ""))
    .join("\n")
    .trim();
}

/**
 * Khử trùng ở cấp SHEET: khi đọc nhiều file, model đôi khi lặp lại cùng một
 * bảng ở nhiều sheet ("ra 3 bảng"). Hàm này chỉ GIỮ sheet đầu tiên của mỗi
 * nội dung trùng hệt và gộp charts của các bản sao vào sheet giữ lại, đồng thời
 * trả về map đổi tên (tên sheet bị bỏ -> tên sheet giữ lại) để bên gọi trỏ lại
 * các biểu đồ tham chiếu theo tên sheet.
 *
 * An toàn: chỉ gộp khi nội dung CSV trùng HỆT sau chuẩn hoá; sheet khác nhau dù
 * chỉ một ô đều được giữ nguyên.
 * @param {Array<{name?: string, csvData?: string, charts?: any[]}>} sheets
 * @returns {{sheets: any[], aliases: Map<string,string>, removed: number}}
 */
function dedupeSheets(sheets) {
  if (!Array.isArray(sheets))
    return { sheets: [], aliases: new Map(), removed: 0 };

  const kept = [];
  const seen = new Map(); // nội dung chuẩn hoá -> sheet giữ lại
  const aliases = new Map(); // tên bị bỏ (lower) -> tên giữ lại
  let removed = 0;

  for (const sheet of sheets) {
    if (!sheet || typeof sheet !== "object") {
      kept.push(sheet);
      continue;
    }
    const key = normalizeSheetKey(sheet.csvData);
    if (key && seen.has(key)) {
      const survivor = seen.get(key);
      if (Array.isArray(sheet.charts) && sheet.charts.length)
        survivor.charts = [
          ...(Array.isArray(survivor.charts) ? survivor.charts : []),
          ...sheet.charts,
        ];
      if (sheet.name && survivor.name)
        aliases.set(String(sheet.name).toLowerCase(), survivor.name);
      removed++;
      continue;
    }
    seen.set(key, sheet);
    kept.push(sheet);
  }
  return { sheets: kept, aliases, removed };
}

/**
 * @param {any[][]} rows
 * @returns {{rows: any[][], removed: number}}
 */
function dedupeDataRows(rows) {
  if (!Array.isArray(rows)) return { rows: [], removed: 0 };
  if (rows.length <= 2) return { rows, removed: 0 }; // tiêu đề + tối đa 1 dòng

  const out = [rows[0]];
  const seen = new Set();
  let removed = 0;

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (isFormulaRow(r) || isTotalRow(r)) {
      out.push(r);
      continue;
    }
    const key = JSON.stringify(r);
    if (seen.has(key)) {
      removed++;
      continue;
    }
    seen.add(key);
    out.push(r);
  }
  return { rows: out, removed };
}

module.exports = {
  dedupeDataRows,
  dedupeSheets,
  normalizeSheetKey,
  sheetHasFormula,
  isFormulaRow,
  isTotalRow,
};
