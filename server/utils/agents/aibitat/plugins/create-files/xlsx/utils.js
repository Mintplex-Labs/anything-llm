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
  
  // Pad shorter rows to match the header length so columns are never lost
  const headerLength = parsedRows[0]?.length || 0;
  if (headerLength > 0) {
    for (let i = 0; i < parsedRows.length; i++) {
      while (parsedRows[i].length < headerLength) {
        parsedRows[i].push("");
      }
      // Truncate if somehow a row exceeds header (though rare in basic CSV)
      if (parsedRows[i].length > headerLength) {
        parsedRows[i] = parsedRows[i].slice(0, headerLength);
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
  { bold = true, fill = "FF0F172A", fontColor = "FFFFFFFF" } = {}, // Slate 900
  headerRowNumber = 1
) {
  const headerRow = worksheet.getRow(headerRowNumber);
  if (!headerRow) return;

  const colCount = worksheet.columnCount || 1;
  for (let col = 1; col <= colCount; col++) {
    const cell = headerRow.getCell(col);
    cell.font = {
      bold,
      color: { argb: fontColor },
      name: "Segoe UI",
      size: 11,
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
  }

  headerRow.height = 25;
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
 */
function applyPremiumFormatting(worksheet, dataStartRow = 1) {
  // Add auto filter to the data range
  if (worksheet.rowCount > 0 && worksheet.columnCount > 0) {
    worksheet.autoFilter = {
      from: { row: dataStartRow, column: 1 },
      to: { row: worksheet.rowCount, column: worksheet.columnCount },
    };
  }

  // Detect total/summary rows (last row with keywords)
  const totalKeywords = [
    "tổng", "total", "sum", "cộng", "tổng cộng", "tổng kết",
    "grand total", "subtotal", "trung bình", "average", "avg",
  ];

  const colCount = worksheet.columnCount || 1;

  // Set default row height, borders, and fonts
  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber <= dataStartRow) return; // Skip title rows

    if (rowNumber > dataStartRow && !row.height) {
      row.height = 20;
    }

    // Check if this is a total/summary row
    const firstCellValue = String(row.getCell(1).value || "").trim().toLowerCase();
    const isTotalRow = totalKeywords.some((kw) => firstCellValue.startsWith(kw));

    for (let col = 1; col <= colCount; col++) {
      const cell = row.getCell(col);
      // Apply clean subtle borders
      cell.border = {
        top: { style: "thin", color: { argb: "FFE2E8F0" } }, // slate-200
        left: { style: "thin", color: { argb: "FFE2E8F0" } },
        bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
        right: { style: "thin", color: { argb: "FFE2E8F0" } },
      };

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
          name: currentFont.name || "Segoe UI",
          size: currentFont.size || 10,
          color: currentFont.color || { argb: "FF334155" }, // slate-700
          bold: isTotalRow ? true : currentFont.bold || false,
        };

        // Total row gets special background
        if (isTotalRow) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFEEF2FF" }, // indigo-50
          };
          cell.border = {
            top: { style: "medium", color: { argb: "FF6366F1" } }, // indigo-500
            left: { style: "thin", color: { argb: "FFE2E8F0" } },
            bottom: { style: "medium", color: { argb: "FF6366F1" } },
            right: { style: "thin", color: { argb: "FFE2E8F0" } },
          };
        }
      }
    }
  });
}

/**
 * Inserts a title row at the top of a worksheet.
 * The title is merged across all columns with large bold font and colored background.
 * Shifts existing data down by 1 row.
 *
 * @param {import('exceljs').Worksheet} worksheet - The worksheet to modify
 * @param {string} title - The title text to display
 * @returns {number} The new data start row (2, since title takes row 1)
 */
function applyTitleRow(worksheet, title) {
  if (!title || typeof title !== "string" || !title.trim()) return 1;

  // Insert a new row at position 1 (pushes everything else down)
  worksheet.insertRow(1, []);
  const titleRow = worksheet.getRow(1);
  titleRow.getCell(1).value = title.trim();

  // Merge across all columns
  const colCount = worksheet.columnCount || 1;
  if (colCount > 1) {
    worksheet.mergeCells(1, 1, 1, colCount);
  }

  // Style the title cell
  const titleCell = titleRow.getCell(1);
  titleCell.font = {
    name: "Segoe UI",
    size: 14,
    bold: true,
    color: { argb: "FF1E293B" }, // slate-800
  };
  titleCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFF1F5F9" }, // slate-100
  };
  titleCell.alignment = {
    vertical: "middle",
    horizontal: "center",
  };
  titleCell.border = {
    bottom: { style: "medium", color: { argb: "FF3B82F6" } }, // blue-500
  };
  titleRow.height = 35;

  return 2; // Data now starts at row 2
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

  for (let col = 1; col <= colCount; col++) {
    // Analyze the column data to determine the dominant type
    let numCount = 0;
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
      if (hasLargeNumbers) {
        fmt = "#,##0";
      }
    }

    if (fmt) {
      worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber <= headerRow) return;
        const cell = row.getCell(col);
        if (typeof cell.value === "number" && !cell.numFmt) {
          cell.numFmt = fmt;
        }
      });
    }

    // Right-align numeric columns
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber <= headerRow) return;
      const cell = row.getCell(col);
      if (typeof cell.value === "number") {
        cell.alignment = {
          ...(cell.alignment || {}),
          horizontal: "right",
          vertical: "middle",
        };
      }
    });
  }
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
  applySmartNumberFormatting,
  embedChartInWorksheet,
};

