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

  const parsedRows = rows.filter((row) => row.some((cell) => cell !== ""));

  // Normalize all rows to the widest row so no cell is ever lost.
  // If a data row is wider than the header, extend the header with generic names.
  const maxLength = parsedRows.reduce((max, row) => Math.max(max, row.length), 0);
  if (maxLength > 0) {
    while (parsedRows[0].length < maxLength) {
      parsedRows[0].push(`Cột ${parsedRows[0].length + 1}`);
    }
    for (let i = 1; i < parsedRows.length; i++) {
      while (parsedRows[i].length < maxLength) {
        parsedRows[i].push("");
      }
    }
  }

  return parsedRows;
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
 * @returns {string|number|Date|boolean|{formula: string}} The converted value
 */
function inferCellType(value) {
  if (value === "" || value === null || value === undefined) {
    return "";
  }

  const trimmed = value.trim();
  const lowerTrimmed = trimmed.toLowerCase();

  // Real Excel formula. A leading "'=" escapes it to a literal string.
  if (trimmed.startsWith("'=")) return trimmed.substring(1);
  if (trimmed.startsWith("=") && trimmed.length > 1) {
    return { formula: trimmed.substring(1) };
  }

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

  // ISO-style dates: yyyy-mm-dd or yyyy/mm/dd
  const isoMatch = trimmed.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})$/);
  if (isoMatch) {
    const [, y, m, d] = isoMatch.map(Number);
    if (m >= 1 && m <= 12 && d >= 1 && d <= 31)
      return new Date(Date.UTC(y, m - 1, d));
  }

  // Day-first dates (Vietnamese convention): dd/mm/yyyy or dd-mm-yyyy
  const dmyMatch = trimmed.match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/);
  if (dmyMatch) {
    const [, d, m, y] = dmyMatch.map(Number);
    if (m >= 1 && m <= 12 && d >= 1 && d <= 31)
      return new Date(Date.UTC(y, m - 1, d));
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
        } else if (
          typeof cellValue === "object" &&
          typeof cellValue.formula === "string"
        ) {
          // Formula display width is unknown until Excel computes it
          cellLength =
            cellValue.result != null ? String(cellValue.result).length : 12;
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
  {
    bold = true,
    fill = "FF1F4E78",
    fontColor = "FFFFFFFF",
    fontName = "Times New Roman",
  } = {},
  headerRowNumber = 1
) {
  const headerRow = worksheet.getRow(headerRowNumber);
  if (!headerRow) return;

  const thin = { style: "thin", color: { argb: "FF94A3B8" } };
  const colCount = worksheet.columnCount || 1;
  for (let col = 1; col <= colCount; col++) {
    const cell = headerRow.getCell(col);
    cell.font = {
      bold,
      color: { argb: fontColor },
      name: fontName,
      size: 12,
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: fill },
    };
    cell.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    // Full borders (required for printable administrative tables)
    cell.border = {
      top: thin,
      left: thin,
      right: thin,
      bottom: { style: "medium", color: { argb: "FF0F172A" } },
    };
  }

  headerRow.height = 32;
}

/**
 * Applies alternating row colors (zebra striping) to a worksheet.
 * @param {import('exceljs').Worksheet} worksheet - The worksheet to style
 * @param {string} [evenColor='FFF2F2F2'] - Color for even rows (ARGB format)
 * @param {number} [startRow=2] - Row to start alternating from (skips header)
 */
function applyZebraStriping(worksheet, evenColor = "FFF8FAFC", startRow = 2) {
  const colCount = worksheet.columnCount || 1;
  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber >= startRow && rowNumber % 2 === 0) {
      for (let col = 1; col <= colCount; col++) {
        const cell = row.getCell(col);
        if (!cell.fill || cell.fill.type !== "pattern") {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: evenColor },
          };
        }
      }
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

/**
 * Applies premium formatting to the entire worksheet:
 * - Autofilter for data
 * - Borders for all cells (including blank cells)
 * - Modern fonts and vertical alignment
 * - Auto-detect total/summary rows and bold them
 * @param {import('exceljs').Worksheet} worksheet - The worksheet to modify
 * @param {number} [dataStartRow=1] - The row where data headers begin (1 if no title row)
 * @param {{totalFill?: string, totalBorder?: string}} [colors] - ARGB colors for total row styling
 * @param {number} [lastDataRow=null] - Last row of the data table (rows below are ignored)
 */
function applyPremiumFormatting(
  worksheet,
  dataStartRow = 1,
  {
    totalFill = "FFD9E5F1",
    totalBorder = "FF1F4E78",
    fontName = "Times New Roman",
  } = {},
  lastDataRow = null
) {
  const endRow = lastDataRow || worksheet.rowCount;

  // Detect total/summary rows (last row with keywords)
  const totalKeywords = [
    "tổng", "total", "sum", "cộng", "tổng cộng", "tổng kết",
    "grand total", "subtotal", "trung bình", "average", "avg",
  ];

  const colCount = worksheet.columnCount || 1;
  const thin = { style: "thin", color: { argb: "FF94A3B8" } };

  // Set default row height, borders, and fonts
  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber <= dataStartRow) return; // Skip title rows
    if (rowNumber > endRow) return; // Skip anything after the table (e.g. signature block)

    if (rowNumber > dataStartRow && !row.height) {
      row.height = 22;
    }

    // Check if this is a total/summary row (formula objects are never labels)
    const firstVal = row.getCell(1).value;
    const firstCellValue =
      firstVal !== null &&
      typeof firstVal === "object" &&
      !(firstVal instanceof Date)
        ? ""
        : String(firstVal ?? "").trim().toLowerCase();
    const isTotalRow = totalKeywords.some((kw) => firstCellValue.startsWith(kw));

    for (let col = 1; col <= colCount; col++) {
      const cell = row.getCell(col);
      // Full thin borders on every cell so printed tables read as a grid
      cell.border = { top: thin, left: thin, right: thin, bottom: thin };

      // Ensure proper alignment
      if (rowNumber > dataStartRow) {
        if (!cell.alignment) {
          cell.alignment = { vertical: "middle", wrapText: false };
        } else {
          cell.alignment.vertical = cell.alignment.vertical || "middle";
        }

        // Upgrade font
        const currentFont = cell.font || {};
        cell.font = {
          ...currentFont,
          name: currentFont.name || fontName,
          size: currentFont.size || 11,
          color: currentFont.color || { argb: "FF1E293B" }, // slate-800
          bold: isTotalRow ? true : currentFont.bold || false,
        };

        // Total row gets special background and distinct borders
        if (isTotalRow) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: totalFill },
          };
          cell.border = {
            top: { style: "double", color: { argb: totalBorder } },
            bottom: { style: "medium", color: { argb: totalBorder } },
            left: { style: "thin", color: { argb: totalBorder } },
            right: { style: "thin", color: { argb: totalBorder } },
          };
        }
      }
    }
  });
}

/**
 * Inserts a title row at the given position of a worksheet.
 * The title is merged across all columns with large bold font.
 * Shifts existing data down by 1 row.
 *
 * @param {import('exceljs').Worksheet} worksheet - The worksheet to modify
 * @param {string} title - The title text to display
 * @param {number} [atRow=1] - The row position to insert the title at
 * @param {{accent?: string}} [opts] - Styling options (ARGB accent color)
 * @returns {number} The number of rows inserted (0 or 1)
 */
function applyTitleRow(
  worksheet,
  title,
  atRow = 1,
  { accent = "FF0EA5E9", fontName = "Times New Roman", size = 15 } = {}
) {
  if (!title || typeof title !== "string" || !title.trim()) return 0;

  worksheet.insertRow(atRow, []);
  const titleRow = worksheet.getRow(atRow);
  titleRow.getCell(1).value = title.trim();

  // Merge across all columns
  const colCount = worksheet.columnCount || 1;
  if (colCount > 1) {
    worksheet.mergeCells(atRow, 1, atRow, colCount);
  }

  // Style the title cell
  const titleCell = titleRow.getCell(1);
  titleCell.font = {
    name: fontName,
    size,
    bold: true,
    color: { argb: "FF0F172A" }, // slate-900
  };
  titleCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFFFFFF" },
  };
  titleCell.alignment = {
    vertical: "middle",
    horizontal: "center",
    wrapText: true,
  };
  titleCell.border = {
    bottom: { style: "thick", color: { argb: accent } },
  };
  titleRow.height = 45;

  return 1;
}

/**
 * Inserts the standard Vietnamese administrative document header block at the
 * top of a worksheet (Quốc hiệu / Tiêu ngữ on the right, agency names on the
 * left, date line below) per Nghị định 30/2020/NĐ-CP layout conventions.
 * Shifts existing data down.
 *
 * @param {import('exceljs').Worksheet} worksheet - The worksheet to modify
 * @param {Object} [opts]
 * @param {string} [opts.parentOrganization] - Upper-level agency name (line 1, left)
 * @param {string} [opts.organization] - Issuing agency/unit name (line 2, left)
 * @param {string} [opts.place] - Locality name for the date line (e.g. "Hà Nội")
 * @returns {number} The number of rows inserted
 */
function applyGovernmentHeader(
  worksheet,
  { parentOrganization = "", organization = "", place = "" } = {}
) {
  const colCount = Math.max(worksheet.columnCount || 1, 2);
  const rowsInserted = 4;
  worksheet.insertRows(1, Array.from({ length: rowsInserted }, () => []));

  // Left block spans roughly the first half, right block the rest
  const leftEnd = Math.max(1, Math.ceil(colCount / 2) - (colCount >= 5 ? 1 : 0));
  const rightStart = leftEnd + 1;

  const setBlockCell = (row, startCol, endCol, value, font) => {
    if (endCol > startCol) worksheet.mergeCells(row, startCol, row, endCol);
    const cell = worksheet.getRow(row).getCell(startCol);
    cell.value = value;
    cell.font = { name: "Times New Roman", size: 12, ...font };
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    return cell;
  };

  // Row 1: parent agency (left) | national motto (right)
  setBlockCell(
    1,
    1,
    leftEnd,
    (parentOrganization || "").toUpperCase(),
    { size: 11 }
  );
  setBlockCell(1, rightStart, colCount, "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", {
    bold: true,
    size: 12,
  });

  // Row 2: agency name (left, bold) | motto line (right, bold + underline rule)
  setBlockCell(2, 1, leftEnd, (organization || "").toUpperCase(), {
    bold: true,
    size: 11,
  });
  const motto = setBlockCell(
    2,
    rightStart,
    colCount,
    "Độc lập - Tự do - Hạnh phúc",
    { bold: true, size: 12 }
  );
  motto.border = { bottom: { style: "thin", color: { argb: "FF000000" } } };

  // Row 3: date line (right, italic)
  const now = new Date();
  const dateLine = `${place || "………"}, ngày ${String(now.getDate()).padStart(2, "0")} tháng ${now.getMonth() + 1} năm ${now.getFullYear()}`;
  const dateCell = setBlockCell(3, rightStart, colCount, dateLine, {
    italic: true,
    size: 12,
  });
  dateCell.alignment = { horizontal: "center", vertical: "middle" };
  worksheet.getRow(3).height = 22;

  // Row 4 stays blank as a spacer before the title/table
  return rowsInserted;
}

/**
 * Appends the Vietnamese administrative signature block after the data table:
 * signer title (right-aligned, uppercase bold), "(Ký, ghi rõ họ tên)" note and
 * empty rows for a handwritten signature.
 *
 * @param {import('exceljs').Worksheet} worksheet - The worksheet to modify
 * @param {Object} [opts]
 * @param {string} [opts.signerTitle="NGƯỜI LẬP BIỂU"] - Signer title/role
 * @param {string} [opts.signerName] - Optional pre-filled signer name
 */
function applySignatureBlock(
  worksheet,
  { signerTitle = "NGƯỜI LẬP BIỂU", signerName = "" } = {}
) {
  const colCount = Math.max(worksheet.columnCount || 1, 2);
  const startCol = Math.max(1, Math.ceil(colCount / 2) + 1);
  let row = (worksheet.rowCount || 1) + 2;

  const writeLine = (value, font, height = 18) => {
    if (colCount > startCol) worksheet.mergeCells(row, startCol, row, colCount);
    const cell = worksheet.getRow(row).getCell(startCol);
    cell.value = value;
    cell.font = { name: "Times New Roman", size: 12, ...font };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    worksheet.getRow(row).height = height;
    row++;
  };

  writeLine((signerTitle || "NGƯỜI LẬP BIỂU").toUpperCase(), { bold: true });
  writeLine("(Ký, ghi rõ họ tên)", { italic: true, size: 11 });
  row += 3; // space for the handwritten signature
  if (signerName) writeLine(signerName, { bold: true });
}

/**
 * Applies smart number formatting to data columns.
 * Auto-detects columns that contain numbers and applies appropriate formatting:
 * - Large numbers get thousand separators (#,##0)
 * - Decimal numbers get #,##0.00
 * - Percentage columns get 0.00%
 * - Currency columns get symbol + #,##0.00
 *
 * @param {import('exceljs').Worksheet} worksheet - The worksheet to modify
 * @param {number} [headerRow=1] - The header row number
 */
function applySmartNumberFormatting(worksheet, headerRow = 1) {
  const colCount = worksheet.columnCount || 0;

  // Formula cells count as numeric unless the formula clearly builds text
  const getFormula = (val) =>
    val !== null &&
    typeof val === "object" &&
    !(val instanceof Date) &&
    typeof val.formula === "string"
      ? val.formula
      : null;
  const isNumericFormula = (f) =>
    !/&|\b(TEXT|CONCAT|CONCATENATE|TEXTJOIN|LEFT|RIGHT|MID|UPPER|LOWER|PROPER|TRIM|SUBSTITUTE|REPT|CHAR)\s*\(/i.test(
      f
    );

  for (let col = 1; col <= colCount; col++) {
    // Analyze the column data to determine the dominant type
    let numCount = 0;
    let formulaCount = 0;
    let pctCount = 0;
    let currencyCount = 0;
    let hasDecimals = false;
    let totalDataRows = 0;
    let currencySymbol = "";

    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber <= headerRow) return;
      totalDataRows++;
      const cell = row.getCell(col);
      const val = cell.value;

      if (typeof val === "number") {
        numCount++;
        if (!Number.isInteger(val)) hasDecimals = true;
        // Check if original text had currency
        if (cell.numFmt && /[$€£¥₹]/.test(cell.numFmt)) {
          currencyCount++;
          const match = cell.numFmt.match(/["']?([$€£¥₹])/);
          if (match) currencySymbol = match[1];
        }
        if (cell.numFmt && cell.numFmt.includes("%")) {
          pctCount++;
        }
      } else {
        const f = getFormula(val);
        if (f && isNumericFormula(f)) {
          numCount++;
          formulaCount++;
          if (/AVERAGE|\//i.test(f)) hasDecimals = true;
        }
      }
    });

    if (totalDataRows === 0 || numCount < totalDataRows * 0.5) continue;

    // Determine format
    let fmt = null;
    if (pctCount > numCount * 0.3) {
      fmt = "0.00%";
    } else if (currencyCount > 0 && currencySymbol) {
      fmt = `"${currencySymbol}"#,##0.00`;
    } else if (hasDecimals) {
      fmt = "#,##0.00";
    } else if (numCount > 0) {
      // Only apply thousand separator if numbers are large enough
      let hasLargeNumbers = false;
      worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber <= headerRow) return;
        const val = row.getCell(col).value;
        if (typeof val === "number" && Math.abs(val) >= 1000) {
          hasLargeNumbers = true;
        }
      });
      if (hasLargeNumbers || formulaCount > 0) {
        // "#,##0" renders small integers unchanged, so it is safe for
        // formula columns whose magnitude is unknown until Excel computes
        fmt = "#,##0";
      }
    }

    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber <= headerRow) return;
      const cell = row.getCell(col);
      const f = getFormula(cell.value);
      const isNumeric =
        typeof cell.value === "number" || (f && isNumericFormula(f));
      if (!isNumeric) return;

      if (fmt && !cell.numFmt) cell.numFmt = fmt;
      // Right-align numeric cells
      cell.alignment = {
        ...(cell.alignment || {}),
        horizontal: "right",
        vertical: "middle",
      };
    });
  }
}

/**
 * Applies A4 print setup so the sheet prints cleanly for reports:
 * fit-to-width scaling, landscape for wide tables, centered horizontally
 * and the table header row repeated on every printed page.
 *
 * @param {import('exceljs').Worksheet} worksheet - The worksheet to modify
 * @param {Object} [opts]
 * @param {number} [opts.headerRow=1] - Row number of the table header
 * @param {number} [opts.columnCount=1] - Number of table columns
 */
function applyPrintSetup(worksheet, { headerRow = 1, columnCount = 1 } = {}) {
  worksheet.pageSetup = {
    paperSize: 9, // A4
    orientation: columnCount >= 8 ? "landscape" : "portrait",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    horizontalCentered: true,
    margins: {
      left: 0.4,
      right: 0.4,
      top: 0.6,
      bottom: 0.6,
      header: 0.3,
      footer: 0.3,
    },
    printTitlesRow: `${headerRow}:${headerRow}`,
  };
}

/**
 * Checks every sheet reference inside a formula against the workbook's
 * actual sheet names so broken #REF! links are caught before file creation.
 *
 * @param {string} formula - Raw formula text (with or without leading "=")
 * @param {Set<string>} validSheetNames - Lowercased valid sheet names
 * @returns {string|null} The first unknown sheet name, or null if all valid
 */
function validateFormulaSheetRefs(formula, validSheetNames) {
  // Mask string literals so text like "abc!" is never mistaken for a ref
  const body = formula.replace(/^=/, "").replace(/"(?:[^"]|"")*"/g, '""');
  const refs = [];
  for (const m of body.matchAll(/'((?:[^']|'')+)'!/g))
    refs.push(m[1].replace(/''/g, "'"));
  const stripped = body.replace(/'(?:[^']|'')+'!/g, "!");
  for (const m of stripped.matchAll(
    /([A-Za-z_À-ỹ][\w.À-ỹ]*)!/g
  ))
    refs.push(m[1]);
  for (const ref of refs) {
    if (!validSheetNames.has(ref.toLowerCase())) return ref;
  }
  return null;
}

/**
 * Shifts the row numbers of every A1-style cell reference in a formula.
 * Formulas from the LLM are written against the raw CSV grid (header = row 1),
 * but government headers and title rows push the table down - each sheet's
 * offset moves its references to the final positions.
 *
 * @param {string} formula - Formula text without the leading "="
 * @param {number} ownOffset - Row offset of the sheet the formula lives on
 * @param {Map<string, number>} offsetBySheet - Lowercased sheet name -> offset
 * @returns {string} The adjusted formula
 */
function adjustFormulaRows(formula, ownOffset, offsetBySheet) {
  const anyOffset =
    ownOffset > 0 ||
    (offsetBySheet && [...offsetBySheet.values()].some((v) => v > 0));
  if (!anyOffset) return formula;

  const refPattern =
    /(('((?:[^']|'')+)'|([A-Za-z_À-ỹ][\w.À-ỹ]*))!)?(\$?[A-Za-z]{1,3}\$?)(\d{1,7})(?![\w(])/g;

  // Split out double-quoted string literals; only rewrite code segments
  return formula
    .split(/("(?:[^"]|"")*")/)
    .map((segment, i) => {
      if (i % 2 === 1) return segment;
      return segment.replace(
        refPattern,
        (match, prefix, _inner, quotedName, bareName, col, row) => {
          let offset = ownOffset;
          if (prefix) {
            const sheet = (
              quotedName ? quotedName.replace(/''/g, "'") : bareName
            ).toLowerCase();
            offset = offsetBySheet.get(sheet) ?? 0;
          }
          if (!offset) return match;
          return `${prefix || ""}${col}${Number(row) + offset}`;
        }
      );
    })
    .join("");
}

/**
 * Generates a chart image from QuickChart and embeds it into the worksheet.
 *
 * @param {import('exceljs').Workbook} workbook - The workbook object
 * @param {import('exceljs').Worksheet} worksheet - The worksheet to embed the chart in
 * @param {Object} chartDef - Chart definition
 * @param {string} chartDef.title - Title of the chart
 * @param {string} chartDef.type - Type of the chart ('bar', 'line', 'pie', 'doughnut', etc.)
 * @param {string[]} chartDef.labels - X-axis labels
 * @param {Array<{label: string, data: number[]}>} chartDef.datasets - Datasets containing labels and numeric data
 * @param {'side'|'below'} [chartDef.position='side'] - Placement relative to data table
 * @param {number} [dataStartRow=1] - The start row of data headers
 * @param {number} [maxCol=1] - Maximum columns in table
 * @param {number} [maxRow=1] - Maximum rows in table
 */
async function embedChartInWorksheet(
  workbook,
  worksheet,
  chartDef,
  dataStartRow = 1,
  maxCol = 1,
  maxRow = 1
) {
  try {
    const type = chartDef.type || "bar";
    const title = chartDef.title || "Biểu đồ";
    const labels = chartDef.labels || [];
    const datasets = chartDef.datasets || [];

    // Nice clean colors for charts
    const chartColors = [
      { border: "#4F46E5", background: "rgba(79, 70, 229, 0.2)" }, // indigo
      { border: "#0D9488", background: "rgba(13, 148, 136, 0.2)" }, // teal
      { border: "#E11D48", background: "rgba(225, 29, 72, 0.2)" }, // rose
      { border: "#D97706", background: "rgba(217, 119, 6, 0.2)" }, // amber
      { border: "#059669", background: "rgba(5, 150, 105, 0.2)" }, // emerald
    ];

    const formattedDatasets = datasets.map((ds, index) => {
      const color = chartColors[index % chartColors.length];
      return {
        label: ds.label || `Dataset ${index + 1}`,
        data: ds.data || [],
        borderColor: color.border,
        backgroundColor: type === "line" ? "transparent" : color.background,
        borderWidth: 2,
        fill: type !== "line",
      };
    });

    const chartConfig = {
      type: type,
      data: {
        labels: labels,
        datasets: formattedDatasets,
      },
      options: {
        title: {
          display: true,
          text: title,
          fontSize: 16,
          fontColor: "#1E293B",
          fontFamily: "Segoe UI",
        },
        legend: {
          position: "bottom",
          labels: {
            boxWidth: 12,
            fontSize: 11,
            fontFamily: "Segoe UI",
          },
        },
        scales: type !== "pie" && type !== "doughnut" && type !== "polarArea" ? {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              fontFamily: "Segoe UI",
            }
          }],
          xAxes: [{
            ticks: {
              fontFamily: "Segoe UI",
            }
          }]
        } : undefined,
      },
    };

    const width = 550;
    const height = 320;
    const quickchartEndpoint = (process.env.QUICKCHART_ENDPOINT || "https://quickchart.io").replace(/\/$/, "");
    const url = `${quickchartEndpoint}/chart?c=${encodeURIComponent(
      JSON.stringify(chartConfig)
    )}&w=${width}&h=${height}&bkg=white`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch chart from QuickChart: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const imageId = workbook.addImage({
      buffer: buffer,
      extension: "png",
    });

    // Calculate chart grid coordinates
    let fromCol = maxCol + 2;
    let fromRow = dataStartRow > 1 ? dataStartRow : 2;

    if (chartDef.position === "below") {
      fromCol = 2;
      fromRow = maxRow + 3;
    }

    // Width: ~8 columns, Height: ~16 rows
    const toCol = fromCol + 8;
    const toRow = fromRow + 16;

    // Helper to get column letter (e.g. 1 -> A, 27 -> AA)
    const getColLetter = (col) => {
      let temp, letter = "";
      while (col > 0) {
        temp = (col - 1) % 26;
        letter = String.fromCharCode(temp + 65) + letter;
        col = (col - temp - 1) / 26;
      }
      return letter;
    };

    const range = `${getColLetter(fromCol)}${fromRow}:${getColLetter(toCol)}${toRow}`;
    worksheet.addImage(imageId, range);

    return { success: true, range };
  } catch (err) {
    console.error("[Excel-Chart-Embed] Error:", err.message);
    return { success: false, error: err.message };
  }
}

const OOXML_NS = {
  xdr: "http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing",
  a: "http://schemas.openxmlformats.org/drawingml/2006/main",
  c: "http://schemas.openxmlformats.org/drawingml/2006/chart",
  r: "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
  pkgRels: "http://schemas.openxmlformats.org/package/2006/relationships",
};

// Fixed chart box size when anchored on a data sheet (EMU): ~17.3cm x 9cm.
// A oneCellAnchor keeps the size independent of the auto-fitted column widths.
// The width leaves room for a right-hand legend beside the plot (see overlay=0).
const CHART_EMU_CX = 6240000;
const CHART_EMU_CY = 3240000;
// Vertical pitch between stacked charts, in default-height rows (~9.9cm)
const CHART_ROW_PITCH = 19;

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function unescapeXml(value) {
  return String(value)
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

/**
 * Builds one floating chart anchor for a worksheet drawing part.
 * @param {{fromRow: number, chartRelId: number, shapeId: number, name: string}} opts
 * @returns {string} oneCellAnchor XML fragment
 */
function buildChartAnchorXml({ fromRow, chartRelId, shapeId, name }) {
  return (
    `<xdr:oneCellAnchor>` +
    `<xdr:from><xdr:col>0</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>${fromRow}</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:from>` +
    `<xdr:ext cx="${CHART_EMU_CX}" cy="${CHART_EMU_CY}"/>` +
    `<xdr:graphicFrame macro="">` +
    `<xdr:nvGraphicFramePr><xdr:cNvPr id="${shapeId}" name="${escapeXml(name)}"/><xdr:cNvGraphicFramePr/></xdr:nvGraphicFramePr>` +
    `<xdr:xfrm><a:off x="0" y="0"/><a:ext cx="${CHART_EMU_CX}" cy="${CHART_EMU_CY}"/></xdr:xfrm>` +
    `<a:graphic><a:graphicData uri="${OOXML_NS.c}">` +
    `<c:chart xmlns:c="${OOXML_NS.c}" xmlns:r="${OOXML_NS.r}" r:id="rId${chartRelId}"/>` +
    `</a:graphicData></a:graphic>` +
    `</xdr:graphicFrame>` +
    `<xdr:clientData/>` +
    `</xdr:oneCellAnchor>`
  );
}

/**
 * Merges native Excel charts (each generated separately by xlsx-chart in
 * single-chart mode) into an exceljs-generated workbook.
 *
 * Each chart job is either:
 *  - anchored on an existing data sheet (`targetSheetName` + `anchorFromRow`):
 *    a drawing part with floating chart frames is attached to that sheet, or
 *  - hosted on its own placeholder sheet (`placeholderName`): the k-th
 *    placeholder sheet's XML is replaced by xlsx-chart's chart-hosting sheet.
 *
 * Expected workbook layout (by exceljs sheet order):
 *   sheets 1..P        - placeholder sheets, in job order (only untargeted jobs)
 *   sheets P+1..       - styled data sheets
 *   hidden ChartData{k} sheets - one per job k, holding the chart's data in
 *                        the exact layout xlsx-chart references (labels in
 *                        column A from row 2, series names in row 1 from B1)
 *
 * xlsx-chart hardcodes its formula references to a sheet named "Table"; those
 * references are rewritten to point at the matching ChartData{k} sheet so the
 * charts stay live/editable instead of relying on cached values.
 *
 * @param {Buffer} exceljsBuffer - Buffer of the styled workbook from exceljs.
 * @param {Array<{buffer: Buffer, targetSheetName?: string|null, anchorFromRow?: number, placeholderName?: string|null, def?: {title?: string}}>} chartJobs
 * @returns {Promise<Buffer>} Merged Excel file buffer.
 */
async function mergeNativeCharts(exceljsBuffer, chartJobs) {
  try {
    const JSZip = require("jszip");
    const zipOut = await JSZip.loadAsync(exceljsBuffer);
    let contentTypes = await zipOut.file("[Content_Types].xml").async("text");
    const addContentTypeOverride = (part, type) => {
      if (!contentTypes.includes(`PartName="${part}"`)) {
        contentTypes = contentTypes.replace(
          "</Types>",
          `<Override PartName="${part}" ContentType="${type}"/></Types>`
        );
      }
    };

    // Map worksheet names to their xl/worksheets/sheetN.xml paths
    const workbookXml = await zipOut.file("xl/workbook.xml").async("text");
    const workbookRels = await zipOut
      .file("xl/_rels/workbook.xml.rels")
      .async("text");
    const relTargets = {};
    for (const m of workbookRels.matchAll(/<Relationship\b[^>]*>/g)) {
      const id = (m[0].match(/ Id="([^"]+)"/) || [])[1];
      const target = (m[0].match(/ Target="([^"]+)"/) || [])[1];
      if (id && target) relTargets[id] = target;
    }
    const sheetPathByName = {};
    for (const m of workbookXml.matchAll(/<sheet\b[^>]*>/g)) {
      const name = (m[0].match(/ name="([^"]+)"/) || [])[1];
      const rid = (m[0].match(/ r:id="([^"]+)"/) || [])[1];
      const target = rid && relTargets[rid];
      if (name && target) {
        sheetPathByName[unescapeXml(name)] =
          "xl/" + target.replace(/^\//, "").replace(/^xl\//, "");
      }
    }

    let drawingCounter = 0;
    let placeholderCounter = 0;
    const targetGroups = new Map(); // sheetName -> jobs on that sheet

    for (let k = 1; k <= chartJobs.length; k++) {
      const job = chartJobs[k - 1];
      job.chartIndex = k;
      const zipChart = await JSZip.loadAsync(job.buffer);

      // Chart XML: retarget data references from "Table" to this chart's hidden data sheet
      let chartXml = await zipChart.file("xl/charts/chart1.xml").async("text");
      chartXml = chartXml.replace(/Table!/g, `ChartData${k}!`);
      // xlsx-chart emits a right-side legend without <c:overlay>, so renderers
      // draw it on top of the bars/slices. Force overlay off (scoped to the
      // <c:legend> block, placed after <c:layout/> per the CT_Legend schema) so
      // the plot area shrinks and the legend gets its own space on the side.
      chartXml = chartXml.replace(
        /(<c:legend>[\s\S]*?)(<\/c:legend>)/,
        (whole, inner, close) =>
          inner.includes("<c:overlay")
            ? whole
            : `${inner}<c:overlay val="0"/>${close}`
      );
      // Pie charts on reports must show percentage data labels
      if (/<c:pieChart[ >]/.test(chartXml) && !chartXml.includes("<c:dLbls>")) {
        const dLbls =
          `<c:dLbls><c:showLegendKey val="0"/><c:showVal val="0"/>` +
          `<c:showCatName val="0"/><c:showSerName val="0"/>` +
          `<c:showPercent val="1"/><c:showBubbleSize val="0"/></c:dLbls>`;
        chartXml = chartXml.includes("<c:firstSliceAng")
          ? chartXml.replace("<c:firstSliceAng", `${dLbls}<c:firstSliceAng`)
          : chartXml.replace("</c:pieChart>", `${dLbls}</c:pieChart>`);
      }
      zipOut.file(`xl/charts/chart${k}.xml`, chartXml);
      addContentTypeOverride(
        `/xl/charts/chart${k}.xml`,
        "application/vnd.openxmlformats-officedocument.drawingml.chart+xml"
      );

      if (job.targetSheetName) {
        // Anchored on a data sheet - grouped below, one drawing part per sheet
        if (!targetGroups.has(job.targetSheetName))
          targetGroups.set(job.targetSheetName, []);
        targetGroups.get(job.targetSheetName).push(job);
        continue;
      }

      // Placeholder-sheet chart: reuse xlsx-chart's own sheet + drawing parts.
      // Placeholders were added first, in job order, so the p-th untargeted
      // job owns xl/worksheets/sheet{p}.xml.
      placeholderCounter++;
      drawingCounter++;
      const p = placeholderCounter;
      const d = drawingCounter;

      let drawingXml = await zipChart
        .file("xl/drawings/drawing1.xml")
        .async("text");
      drawingXml = drawingXml.replace(
        /name="[^"]*"\/><xdr:cNvGraphicFramePr/,
        `name="Biểu đồ ${k}"/><xdr:cNvGraphicFramePr`
      );
      zipOut.file(`xl/drawings/drawing${d}.xml`, drawingXml);
      addContentTypeOverride(
        `/xl/drawings/drawing${d}.xml`,
        "application/vnd.openxmlformats-officedocument.drawing+xml"
      );

      let drawingRels = await zipChart
        .file("xl/drawings/_rels/drawing1.xml.rels")
        .async("text");
      drawingRels = drawingRels.replace(
        "../charts/chart1.xml",
        `../charts/chart${k}.xml`
      );
      zipOut.file(`xl/drawings/_rels/drawing${d}.xml.rels`, drawingRels);

      // Replace the placeholder sheet with the chart-hosting sheet XML.
      // Strip tabSelected so multiple sheets never open as a grouped selection.
      let sheetXml = await zipChart
        .file("xl/worksheets/sheet1.xml")
        .async("text");
      sheetXml = sheetXml.replace(/ tabSelected="1"/g, "");
      zipOut.file(`xl/worksheets/sheet${p}.xml`, sheetXml);

      let sheetRels = await zipChart
        .file("xl/worksheets/_rels/sheet1.xml.rels")
        .async("text");
      sheetRels = sheetRels.replace(
        "../drawings/drawing1.xml",
        `../drawings/drawing${d}.xml`
      );
      zipOut.file(`xl/worksheets/_rels/sheet${p}.xml.rels`, sheetRels);
    }

    // Charts anchored on data sheets: one drawing part per sheet with all
    // of that sheet's chart frames stacked vertically below the table.
    for (const [sheetName, jobs] of targetGroups) {
      const sheetPath = sheetPathByName[sheetName];
      if (!sheetPath || !zipOut.file(sheetPath))
        throw new Error(`Không tìm thấy sheet "${sheetName}" để gắn biểu đồ`);

      drawingCounter++;
      const d = drawingCounter;

      const anchors = jobs
        .map((job, i) =>
          buildChartAnchorXml({
            fromRow: job.anchorFromRow || 0,
            chartRelId: i + 1,
            shapeId: i + 2,
            name: (job.def && job.def.title) || `Biểu đồ ${job.chartIndex}`,
          })
        )
        .join("");
      zipOut.file(
        `xl/drawings/drawing${d}.xml`,
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
          `<xdr:wsDr xmlns:xdr="${OOXML_NS.xdr}" xmlns:a="${OOXML_NS.a}">${anchors}</xdr:wsDr>`
      );
      addContentTypeOverride(
        `/xl/drawings/drawing${d}.xml`,
        "application/vnd.openxmlformats-officedocument.drawing+xml"
      );

      const chartRels = jobs
        .map(
          (job, i) =>
            `<Relationship Id="rId${i + 1}" Type="${OOXML_NS.r}/chart" Target="../charts/chart${job.chartIndex}.xml"/>`
        )
        .join("");
      zipOut.file(
        `xl/drawings/_rels/drawing${d}.xml.rels`,
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
          `<Relationships xmlns="${OOXML_NS.pkgRels}">${chartRels}</Relationships>`
      );

      // Wire the drawing into the target sheet's rels + XML
      const sheetRelsPath = sheetPath.replace(
        /worksheets\/(sheet\d+\.xml)$/,
        "worksheets/_rels/$1.rels"
      );
      const existingRels = zipOut.file(sheetRelsPath);
      let sheetRels = existingRels
        ? await existingRels.async("text")
        : `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
          `<Relationships xmlns="${OOXML_NS.pkgRels}"></Relationships>`;
      let maxRid = 0;
      for (const m of sheetRels.matchAll(/ Id="rId(\d+)"/g))
        maxRid = Math.max(maxRid, Number(m[1]));
      const drawingRid = `rId${maxRid + 1}`;
      sheetRels = sheetRels.replace(
        "</Relationships>",
        `<Relationship Id="${drawingRid}" Type="${OOXML_NS.r}/drawing" Target="../drawings/drawing${d}.xml"/></Relationships>`
      );
      zipOut.file(sheetRelsPath, sheetRels);

      let sheetXml = await zipOut.file(sheetPath).async("text");
      const rootTag = (sheetXml.match(/<worksheet\b[^>]*>/) || [""])[0];
      const drawingTag = / xmlns:r=/.test(rootTag)
        ? `<drawing r:id="${drawingRid}"/>`
        : `<drawing xmlns:r="${OOXML_NS.r}" r:id="${drawingRid}"/>`;
      sheetXml = sheetXml.replace("</worksheet>", `${drawingTag}</worksheet>`);
      zipOut.file(sheetPath, sheetXml);
    }

    zipOut.file("[Content_Types].xml", contentTypes);
    return await zipOut.generateAsync({ type: "nodebuffer" });
  } catch (err) {
    console.error("[Excel-Chart-Merge] Error:", err.message);
    throw err;
  }
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
  applyPremiumFormatting,
  applyTitleRow,
  applyGovernmentHeader,
  applySignatureBlock,
  applySmartNumberFormatting,
  applyPrintSetup,
  validateFormulaSheetRefs,
  adjustFormulaRows,
  embedChartInWorksheet,
  mergeNativeCharts,
  CHART_ROW_PITCH,
};

