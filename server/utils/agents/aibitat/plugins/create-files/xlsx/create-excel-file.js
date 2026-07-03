const createFilesLib = require("../lib.js");
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
  applyPremiumFormatting,
  applyTitleRow,
  applySmartNumberFormatting,
  embedChartInWorksheet,
} = require("./utils.js");

const chartSchemaItem = {
  type: "object",
  properties: {
    title: {
      type: "string",
      description: "Title of the chart. Do not leave blank.",
    },
    type: {
      type: "string",
      enum: ["bar", "line", "pie", "doughnut", "radar"],
      description: "The chart visualization style.",
    },
    labels: {
      type: "array",
      items: { type: "string" },
      description: "The category labels for the X-axis (e.g. ['Q1', 'Q2', 'Q3', 'Q4'] or ['Hà Nội', 'HCM']).",
    },
    datasets: {
      type: "array",
      description: "One or more datasets/series of values to plot.",
      items: {
        type: "object",
        properties: {
          label: {
            type: "string",
            description: "The name of this metric series (e.g. 'Doanh thu', 'Chi phí').",
          },
          data: {
            type: "array",
            items: { type: "number" },
            description: "The numeric data points corresponding to labels.",
          },
        },
        required: ["label", "data"],
      },
    },
    position: {
      type: "string",
      enum: ["side", "below"],
      description: "Chart placement: 'side' (to the right of the table, default) or 'below' (underneath the table).",
    },
  },
  required: ["title", "type", "labels", "datasets"],
};

module.exports.CreateExcelFile = {
  name: "create-excel-file",
  plugin: function () {
    return {
      name: "create-excel-file",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Create a professional Excel spreadsheet (.xlsx) from CSV data with optional embedded charts. " +
            "ALL styling is AUTOMATIC — you only need to provide the CSV data and filename. " +
            "The tool automatically applies: header styling, column auto-fit, zebra striping, frozen panes, " +
            "smart number formatting, total row detection, and autofilter. " +
            "You can also embed charts (bar, line, pie...) next to or below your tables by providing the 'charts' specification. " +
            "IMPORTANT for CSV data quality: " +
            "- Include ALL columns from the source data, do not omit any fields " +
            "- Use clear Vietnamese or English column headers " +
            "- Include a 'STT' (ordinal number) column when listing items " +
            "- For financial data, include currency values as plain numbers " +
            "- If you have a summary/total row, start it with 'Tổng' or 'Total' — it will be auto-styled",
          examples: [
            {
              prompt: "Tạo file Excel báo cáo doanh số 4 quý năm 2025 của 3 chi nhánh và vẽ đồ thị cột so sánh doanh số giữa các chi nhánh",
              call: JSON.stringify({
                filename: "doanh-so-2025.xlsx",
                title: "BÁO CÁO DOANH SỐ CÁC CHI NHÁNH NĂM 2025",
                csvData:
                  "Chi nhánh,Quý 1,Quý 2,Quý 3,Quý 4,Tổng cộng\n" +
                  "Chi nhánh Hà Nội,450000000,520000000,480000000,610000000,2060000000\n" +
                  "Chi nhánh TP.HCM,600000000,580000000,650000000,720000000,2550000000\n" +
                  "Chi nhánh Đà Nẵng,250000000,280000000,310000000,340000000,1180000000\n" +
                  "Tổng cộng,,1300000000,1380000000,1440000000,1670000000,5790000000",
                charts: [
                  {
                    title: "So sánh Doanh số Quý giữa các Chi nhánh",
                    type: "bar",
                    labels: ["Quý 1", "Quý 2", "Quý 3", "Quý 4"],
                    datasets: [
                      {
                        label: "Hà Nội",
                        data: [450000000, 520000000, 480000000, 610000000],
                      },
                      {
                        label: "TP.HCM",
                        data: [600000000, 580000000, 650000000, 720000000],
                      },
                      {
                        label: "Đà Nẵng",
                        data: [250000000, 280000000, 310000000, 340000000],
                      },
                    ],
                    position: "side",
                  },
                ],
              }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              filename: {
                type: "string",
                description:
                  "The filename for the Excel file. The .xlsx extension will be added automatically if not provided.",
              },
              title: {
                type: "string",
                description:
                  "Optional title displayed as a large merged header row at the top of the sheet. " +
                  "Use for report titles like 'DANH SÁCH VĂN BẢN NĂM 2026'.",
              },
              csvData: {
                type: "string",
                description:
                  "CSV data for a single-sheet workbook. MUST include a header row as the first line.",
              },
              charts: {
                type: "array",
                description: "Optional list of charts to embed directly into the single sheet.",
                items: chartSchemaItem,
              },
              sheets: {
                type: "array",
                description:
                  "Array of sheet definitions for multi-sheet workbooks.",
                items: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      description: "The name of the worksheet (max 31 characters).",
                    },
                    csvData: {
                      type: "string",
                      description: "The CSV data for this sheet.",
                    },
                    title: {
                      type: "string",
                      description: "Optional title row for this sheet.",
                    },
                    charts: {
                      type: "array",
                      description: "Optional list of charts to embed directly into this specific sheet.",
                      items: chartSchemaItem,
                    },
                  },
                  required: ["name", "csvData"],
                },
              },
            },
            required: ["filename"],
            additionalProperties: false,
          },
          handler: async function ({
            filename = "spreadsheet.xlsx",
            title = null,
            csvData = null,
            charts = null,
            sheets = null,
          }) {
            try {
              this.super.handlerProps.log(`Using the create-excel-file tool.`);

              // Strip XML 1.0 illegal control characters from inputs
              csvData = createFilesLib.stripInvalidXmlChars(csvData);
              sheets = createFilesLib.stripInvalidXmlChars(sheets);
              title = createFilesLib.stripInvalidXmlChars(title);

              const hasExtension = /\.xlsx$/i.test(filename);
              if (!hasExtension) filename = `${filename}.xlsx`;

              if (sheets && typeof sheets === "string") {
                if (!csvData) csvData = sheets;
                sheets = null;
              }

              if (!csvData && (!sheets || !Array.isArray(sheets) || sheets.length === 0)) {
                return "Error: You must provide either 'csvData' (string) for a single sheet or 'sheets' (array of objects) for multiple sheets.";
              }

              const sheetDefinitions = (sheets && Array.isArray(sheets))
                ? sheets
                : [
                    {
                      name: "Sheet1",
                      csvData,
                      title: title || null,
                      charts: charts || null,
                    },
                  ];

              for (let i = 0; i < sheetDefinitions.length; i++) {
                let sheet = sheetDefinitions[i];
                if (typeof sheet === "string") {
                   sheet = { name: `Sheet${i+1}`, csvData: sheet };
                   sheetDefinitions[i] = sheet;
                }
                const actualCsvData = sheet.csvData || sheet.data || sheet.content || sheet.text;
                if (!actualCsvData || typeof actualCsvData !== "string" || actualCsvData.trim() === "") {
                  return `Error: Sheet "${sheet.name || `Sheet${i+1}`}" has no CSV data.`;
                }
                sheet.csvData = actualCsvData;
              }

              const sheetCount = sheetDefinitions.length;
              this.super.introspect(
                `${this.caller}: Creating Excel file "${filename}" with ${sheetCount} sheet(s)`
              );

              if (this.super.requestToolApproval) {
                const approval = await this.super.requestToolApproval({
                  skillName: this.name,
                  payload: {
                    filename,
                    sheetCount,
                    sheetNames: sheetDefinitions.map((s) => s.name),
                  },
                  description: `Create Excel spreadsheet "${filename}" with ${sheetCount} sheet(s)`,
                });
                if (!approval.approved) {
                  this.super.introspect(
                    `${this.caller}: User rejected the ${this.name} request.`
                  );
                  return approval.message;
                }
              }

              const ExcelJS = await import("exceljs");
              const workbook = new ExcelJS.default.Workbook();

              workbook.created = new Date();
              workbook.modified = new Date();

              const allWarnings = [];
              const sheetSummaries = [];

              for (const sheetDef of sheetDefinitions) {
                let sheetName = (sheetDef.name || "Sheet").substring(0, 31);
                sheetName = sheetName.replace(/[*?:\\/[\]]/g, "_");

                const delimiter = detectDelimiter(sheetDef.csvData);
                const parsedData = parseCSV(sheetDef.csvData, delimiter);
                const validation = validateCSVData(parsedData);

                if (!validation.valid) {
                  return `Error in sheet "${sheetName}": ${validation.error}`;
                }

                if (validation.warnings) {
                  allWarnings.push(
                    ...validation.warnings.map((w) => `${sheetName}: ${w}`)
                  );
                }

                const worksheet = workbook.addWorksheet(sheetName);
                const dataRowCount = parsedData.length - 1;
                const colCount = parsedData[0]?.length || 0;

                // Populate cells
                for (
                  let rowIndex = 0;
                  rowIndex < parsedData.length;
                  rowIndex++
                ) {
                  const rowData = parsedData[rowIndex];
                  const row = worksheet.getRow(rowIndex + 1);

                  for (
                    let colIndex = 0;
                    colIndex < rowData.length;
                    colIndex++
                  ) {
                    const cellValue = rowData[colIndex];
                    const cell = row.getCell(colIndex + 1);
                    const typedValue =
                      rowIndex === 0 ? cellValue : inferCellType(cellValue);

                    cell.value = typedValue;

                    if (typedValue instanceof Date) {
                      cell.numFmt = "yyyy-mm-dd";
                    } else if (
                      typeof typedValue === "number" &&
                      typeof cellValue === "string"
                    ) {
                      if (cellValue.includes("%")) {
                        cell.numFmt = "0.00%";
                      } else if (/^[$€£¥₹]/.test(cellValue.trim())) {
                        const symbol = cellValue.trim().charAt(0);
                        cell.numFmt = `"${symbol}"#,##0.00`;
                      } else if (/[0-9],[0-9]{3}/.test(cellValue)) {
                        cell.numFmt = "#,##0.00";
                      }
                    }
                  }

                  row.commit();
                }

                // --- Apply title row if provided ---
                let dataStartRow = 1;
                const sheetTitle = sheetDef.title || null;
                if (sheetTitle) {
                  dataStartRow = applyTitleRow(worksheet, sheetTitle);
                }

                // --- Auto-apply ALL professional styling ---
                autoFitColumns(worksheet);
                applyHeaderStyle(
                  worksheet,
                  {
                    bold: true,
                    fill: "FF0F172A",
                    fontColor: "FFFFFFFF",
                  },
                  dataStartRow
                );

                applyZebraStriping(worksheet, "FFF8FAFC", dataStartRow + 1);
                applySmartNumberFormatting(worksheet, dataStartRow);
                applyPremiumFormatting(worksheet, dataStartRow);
                freezePanes(worksheet, dataStartRow, 0);

                // --- Embed charts if provided ---
                const embeddedCharts = [];
                if (Array.isArray(sheetDef.charts) && sheetDef.charts.length > 0) {
                  for (const chart of sheetDef.charts) {
                    const embedResult = await embedChartInWorksheet(
                      workbook,
                      worksheet,
                      chart,
                      dataStartRow,
                      colCount,
                      parsedData.length + (dataStartRow - 1)
                    );
                    if (embedResult.success) {
                      embeddedCharts.push({
                        title: chart.title,
                        type: chart.type,
                        range: embedResult.range,
                      });
                    } else {
                      allWarnings.push(
                        `Không thể vẽ đồ thị "${chart.title}" trên sheet "${sheetName}": ${embedResult.error}`
                      );
                    }
                  }
                }

                // Collect summary info
                const headers = parsedData[0] || [];
                sheetSummaries.push({
                  name: sheetName,
                  title: sheetTitle,
                  rows: dataRowCount,
                  columns: colCount,
                  headers: headers.slice(0, 10),
                  hasMore: headers.length > 10,
                  embeddedCharts,
                });
              }

              const buffer = await workbook.xlsx.writeBuffer();
              const bufferSizeKB = (buffer.length / 1024).toFixed(2);
              const displayFilename = filename.split("/").pop();

              this.super.handlerProps.log(
                `create-excel-file: Generated buffer - size: ${bufferSizeKB}KB, sheets: ${sheetDefinitions.length}`
              );

              const savedFile = await createFilesLib.saveGeneratedFile({
                fileType: "xlsx",
                extension: "xlsx",
                buffer: Buffer.from(buffer),
                displayFilename,
                workspace: this.super.handlerProps?.invocation?.workspace,
              });

              this.super.socket.send("fileDownloadCard", {
                filename: savedFile.displayFilename,
                storageFilename: savedFile.filename,
                fileSize: savedFile.fileSize,
              });

              createFilesLib.registerOutput(this.super, "ExcelFileDownload", {
                filename: savedFile.displayFilename,
                storageFilename: savedFile.filename,
                fileSize: savedFile.fileSize,
              });

              this.super.introspect(
                `${this.caller}: Successfully created Excel file "${displayFilename}"`
              );

              // --- Build rich response ---
              const parts = [
                `✅ **Đã tạo thành công file Excel "${displayFilename}"** (${bufferSizeKB}KB)`,
                "",
              ];

              for (const summary of sheetSummaries) {
                parts.push(`📊 **Sheet "${summary.name}"**${summary.title ? ` — ${summary.title}` : ""}`);
                parts.push(`- Số dòng dữ liệu: ${summary.rows}`);
                parts.push(`- Số cột: ${summary.columns}`);
                if (summary.headers.length > 0) {
                  parts.push(`- Các cột: ${summary.headers.join(", ")}${summary.hasMore ? "..." : ""}`);
                }
                if (summary.embeddedCharts.length > 0) {
                  parts.push(`📈 **Đồ thị đã vẽ:**`);
                  summary.embeddedCharts.forEach((c) => {
                    parts.push(`  - ✓ **${c.title}** (${c.type}) đặt tại ô ${c.range}`);
                  });
                }
                parts.push("");
              }

              parts.push("🎨 **Định dạng tự động đã áp dụng:**");
              parts.push("- ✓ Header row (đậm, nền tối, chữ trắng)");
              parts.push("- ✓ Auto-fit column widths (bảo toàn cấu trúc cột, không mất cột)");
              parts.push("- ✓ Zebra striping (dòng xen kẽ màu)");
              parts.push("- ✓ Frozen header row");
              parts.push("- ✓ Auto-filter");
              parts.push("- ✓ Smart number formatting (dấu phân cách hàng nghìn)");
              parts.push("- ✓ Total row detection (tự động highlight dòng tổng)");

              if (sheetSummaries.some((s) => s.title)) {
                parts.push("- ✓ Title row (tiêu đề lớn merge cells)");
              }

              if (allWarnings.length > 0) {
                parts.push("");
                parts.push(`⚠️ **Lưu ý:**`);
                allWarnings.forEach((w) => parts.push(`- ${w}`));
              }

              return parts.join("\n");
            } catch (e) {
              this.super.handlerProps.log(
                `create-excel-file error: ${e.message}`
              );
              this.super.introspect(`Error: ${e.message}`);
              return `Error creating Excel file: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
