/**
 * Parses CSV string into a 2D array of values.
 * Handles quoted fields, embedded commas, and newlines within quotes.
 * @param {string} csvString - The CSV content to parse
 * @param {string} [delimiter=","] - The field delimiter
 * @returns {string[][]} 2D array of parsed values
 */
function parseCSV(csvString, delimiter = ",") {
  const rows = [];
  let currentRow = [];
  let currentField = "";
  let inQuotes = false;

  for (let i = 0; i < csvString.length; i++) {
    const char = csvString[i];
    const nextChar = csvString[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentField += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === delimiter) {
        currentRow.push(currentField.trim());
        currentField = "";
      } else if (char === "\r" && nextChar === "\n") {
        currentRow.push(currentField.trim());
        rows.push(currentRow);
        currentRow = [];
        currentField = "";
        i++;
      } else if (char === "\n" || char === "\r") {
        currentRow.push(currentField.trim());
        rows.push(currentRow);
        currentRow = [];
        currentField = "";
      } else {
        currentField += char;
      }
    }
  }

  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    rows.push(currentRow);
  }

  return rows.filter((row) => row.some((cell) => cell !== ""));
}

/**
 * Validates CSV data structure.
 * @param {string[][]} data - Parsed CSV data
 * @returns {{valid: boolean, error?: string, warnings?: string[]}}
 */
function validateCSVData(data) {
  const warnings = [];

  if (!data || data.length === 0) {
    return { valid: false, error: "CSV data is empty" };
  }

  if (data.length === 1 && data[0].length === 1 && !data[0][0]) {
    return { valid: false, error: "CSV data contains no meaningful content" };
  }

  const columnCounts = data.map((row) => row.length);
  const maxColumns = Math.max(...columnCounts);
  const minColumns = Math.min(...columnCounts);

  if (maxColumns !== minColumns) {
    warnings.push(
      `Inconsistent column count: rows have between ${minColumns} and ${maxColumns} columns. Missing cells will be empty.`
    );
  }

  if (maxColumns > 16384) {
    return {
      valid: false,
      error: `CSV has ${maxColumns} columns, exceeding Excel's limit of 16,384 columns`,
    };
  }

  if (data.length > 1048576) {
    return {
      valid: false,
      error: `CSV has ${data.length} rows, exceeding Excel's limit of 1,048,576 rows`,
    };
  }

  return { valid: true, warnings: warnings.length > 0 ? warnings : undefined };
}

/**
 * Attempts to detect the delimiter used in a CSV string.
 * @param {string} csvString - The CSV content
 * @returns {string} Detected delimiter (comma, semicolon, tab, or pipe)
 */
function detectDelimiter(csvString) {
  const firstLine = csvString.split(/\r?\n/)[0] || "";
  const delimiters = [",", ";", "\t", "|"];
  let bestDelimiter = ",";
  let maxCount = 0;

  for (const delimiter of delimiters) {
    const count = (firstLine.match(new RegExp(`\\${delimiter}`, "g")) || [])
      .length;
    if (count > maxCount) {
      maxCount = count;
      bestDelimiter = delimiter;
    }
  }

  return bestDelimiter;
}

/**
 * Attempts to convert a string value to an appropriate type (number, date, boolean, or string).
 * @param {string} value - The string value to convert
 * @returns {string|number|Date|boolean} The converted value
 */
function inferCellType(value) {
  if (value === "" || value === null || value === undefined) {
    return "";
  }

  const trimmed = value.trim();
  const lowerTrimmed = trimmed.toLowerCase();

  if (lowerTrimmed === "true") return true;
  if (lowerTrimmed === "false") return false;

  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    const num = parseFloat(trimmed);
    if (!isNaN(num) && isFinite(num)) {
      return num;
    }
  }

  if (/^-?\d{1,3}(,\d{3})*(\.\d+)?$/.test(trimmed)) {
    const num = parseFloat(trimmed.replace(/,/g, ""));
    if (!isNaN(num) && isFinite(num)) {
      return num;
    }
  }

  const currencyMatch = trimmed.match(/^[$€£¥₹]?\s*(-?\d+(?:[,.\d]*\d)?)\s*$/);
  if (currencyMatch) {
    const num = parseFloat(currencyMatch[1].replace(/,/g, ""));
    if (!isNaN(num) && isFinite(num)) {
      return num;
    }
  }

  if (/^\d+(\.\d+)?%$/.test(trimmed)) {
    const num = parseFloat(trimmed) / 100;
    if (!isNaN(num) && isFinite(num)) {
      return num;
    }
  }

  const datePatterns = [
    /^\d{4}-\d{2}-\d{2}$/,
    /^\d{2}\/\d{2}\/\d{4}$/,
    /^\d{2}-\d{2}-\d{4}$/,
    /^\d{4}\/\d{2}\/\d{2}$/,
  ];

  for (const pattern of datePatterns) {
    if (pattern.test(trimmed)) {
      const date = new Date(trimmed);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
  }

  return value;
}

/**
 * Applies AnythingLLM branding to an Excel workbook.
 * Adds a subtle "Created with AnythingLLM" text row below the data on each sheet.
 * @param {import('exceljs').Workbook} workbook - The ExcelJS workbook instance
 */
function applyBranding(workbook) {
  for (const worksheet of workbook.worksheets) {
    const lastRow = worksheet.rowCount || 1;
    const lastCol = worksheet.columnCount || 1;

    const brandingRowNum = lastRow + 2;

    if (lastCol > 1) {
      worksheet.mergeCells(brandingRowNum, 1, brandingRowNum, lastCol);
    }

    const brandingCell = worksheet.getCell(brandingRowNum, 1);
    brandingCell.value = "Created with AnythingLLM";
    brandingCell.font = {
      italic: true,
      size: 9,
      color: { argb: "FF999999" },
    };
    brandingCell.alignment = {
      horizontal: "right",
      vertical: "middle",
    };
  }
}

/**
 * Auto-fits column widths based on content.
 * @param {import('exceljs').Worksheet} worksheet - The worksheet to auto-fit
 * @param {number} [minWidth=8] - Minimum column width
 * @param {number} [maxWidth=50] - Maximum column width
 */
function autoFitColumns(worksheet, minWidth = 8, maxWidth = 50) {
  worksheet.columns.forEach((column, colIndex) => {
    let maxLength = minWidth;

    worksheet.eachRow({ includeEmpty: false }, (row) => {
      const cell = row.getCell(colIndex + 1);
      const cellValue = cell.value;
      let cellLength = minWidth;

      if (cellValue !== null && cellValue !== undefined) {
        if (typeof cellValue === "string") {
          cellLength = cellValue.length;
        } else if (cellValue instanceof Date) {
          cellLength = 12;
        } else if (typeof cellValue === "number") {
          cellLength = cellValue.toString().length;
        } else if (typeof cellValue === "object" && cellValue.richText) {
          cellLength = cellValue.richText.reduce(
            (acc, rt) => acc + (rt.text?.length || 0),
            0
          );
        } else {
          cellLength = String(cellValue).length;
        }
      }

      maxLength = Math.max(maxLength, cellLength);
    });

    column.width = Math.min(maxLength + 2, maxWidth);
  });
}

/**
 * Applies header styling to the first row of a worksheet.
 * @param {import('exceljs').Worksheet} worksheet - The worksheet to style
 * @param {Object} [options] - Styling options
 * @param {boolean} [options.bold=true] - Make headers bold
 * @param {string} [options.fill] - Background color (ARGB format, e.g., 'FF4472C4')
 * @param {string} [options.fontColor] - Font color (ARGB format, e.g., 'FFFFFFFF')
 */
function applyHeaderStyle(
  worksheet,
  { bold = true, fill = "FF4472C4", fontColor = "FFFFFFFF" } = {}
) {
  const headerRow = worksheet.getRow(1);
  if (!headerRow || headerRow.cellCount === 0) return;

  headerRow.eachCell((cell) => {
    cell.font = {
      bold,
      color: { argb: fontColor },
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: fill },
    };
    cell.alignment = {
      vertical: "middle",
      horizontal: "center",
    };
  });

  headerRow.height = 20;
}

/**
 * Applies alternating row colors (zebra striping) to a worksheet.
 * @param {import('exceljs').Worksheet} worksheet - The worksheet to style
 * @param {string} [evenColor='FFF2F2F2'] - Color for even rows (ARGB format)
 * @param {number} [startRow=2] - Row to start alternating from (skips header)
 */
function applyZebraStriping(worksheet, evenColor = "FFF2F2F2", startRow = 2) {
  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber >= startRow && rowNumber % 2 === 0) {
      row.eachCell((cell) => {
        if (!cell.fill || cell.fill.type !== "pattern") {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: evenColor },
          };
        }
      });
    }
  });
}

/**
 * Freezes the header row and optionally first columns.
 * @param {import('exceljs').Worksheet} worksheet - The worksheet to modify
 * @param {number} [rows=1] - Number of rows to freeze
 * @param {number} [columns=0] - Number of columns to freeze
 */
function freezePanes(worksheet, rows = 1, columns = 0) {
  worksheet.views = [{ state: "frozen", xSplit: columns, ySplit: rows }];
}

module.exports = {
  parseCSV,
  validateCSVData,
  detectDelimiter,
  inferCellType,
  applyBranding,
  autoFitColumns,
  applyHeaderStyle,
  applyZebraStriping,
  freezePanes,
};
