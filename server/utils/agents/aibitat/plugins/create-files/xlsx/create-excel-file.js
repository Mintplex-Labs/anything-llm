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
  mergeNativeChart,
} = require("./utils.js");
const XlsxChart = require("xlsx-chart");

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
            "Create a professional Excel spreadsheet (.xlsx) from CSV data with optional embedded native Excel charts. " +
            "ALL styling is AUTOMATIC — you only need to provide the CSV data and filename. " +
            "The tool automatically applies: header styling, column auto-fit, zebra striping, frozen panes, " +
            "smart number formatting, total row detection, and autofilter. " +
            "If the spreadsheet contains numeric data suitable for comparison or trends (e.g. sales, budgets, growth, metrics over time/regions), " +
            "you MUST generate corresponding charts in the 'charts' array to visualize the data. " +
            "BẮT BUỘC: Nếu dữ liệu có chứa số liệu so sánh hoặc xu hướng theo thời gian/danh mục (doanh thu, chi phí, ngân sách...), " +
            "bạn phải định nghĩa đối tượng biểu đồ tương ứng trong tham số 'charts' (ví dụ biểu đồ cột 'bar' hoặc đường 'line') để trực quan hóa dữ liệu trực tiếp trong file Excel. " +
            "Đảm bảo các nhãn (labels) và bộ dữ liệu (datasets) trong đối tượng chart khớp chính xác với dữ liệu bảng CSV của bạn. " +
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
                  "CSV data for a single-sheet workbook. MUST include a header row as the first line. " +
                  "Supports dynamic spreadsheet formulas! You can write formulas directly in cells by starting with '=' (e.g. '=B2-C2', '=SUM(B2:B10)', '=AVERAGE(C2:C5)'). These formulas will be dynamically calculated by Excel.",
              },
              charts: {
                type: "array",
                description: "CRITICAL BẮT BUỘC: Nếu dữ liệu mang tính chất thống kê, báo cáo doanh thu, số lượng, hoặc so sánh, bạn PHẢI MẶC ĐỊNH cung cấp mảng 'charts' này để vẽ biểu đồ Native Excel. Tuyệt đối không được bỏ qua nếu người dùng yêu cầu vẽ biểu đồ.",
                items: chartSchemaItem,
              },
              sheets: {
                type: "array",
                description:
                  "Array of sheet definitions for multi-sheet workbooks. Each sheet can also contain formulas (cells starting with '=').",
                items: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      description: "The name of the worksheet (max 31 characters).",
                    },
                    csvData: {
                      type: "string",
                      description: "The CSV data for this sheet (can include formulas starting with '=').",
                    },
                    title: {
                      type: "string",
                      description: "Optional title row for this sheet.",
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

              let hasNativeChart = false;
              let xlsxChartOpts = null;
              let originalCharts = charts;

              let sheetDefinitions = (sheets && Array.isArray(sheets))
                ? sheets
                : [
                    {
                      name: "Sheet1",
                      csvData,
                      title: title || null,
                      charts: charts || null,
                    },
                  ];

              // Transform single-sheet with charts to a native Excel Chart/Table double-sheet structure
              if (sheetDefinitions.length === 1 && sheetDefinitions[0].charts && sheetDefinitions[0].charts.length > 0) {
                hasNativeChart = true;
                const sheetDef = sheetDefinitions[0];
                const chartsList = sheetDef.charts;
                originalCharts = chartsList;

                // Build options for xlsx-chart
                const convertChartType = (t) => {
                  const map = {
                    bar: "bar",
                    line: "line",
                    pie: "pie",
                    doughnut: "pie",
                    radar: "radar",
                    area: "area"
                  };
                  return map[String(t).toLowerCase()] || "column";
                };

                if (chartsList.length === 1) {
                  const chart = chartsList[0];
                  xlsxChartOpts = {
                    chart: convertChartType(chart.type),
                    titles: chart.datasets.map(d => d.label),
                    fields: chart.labels,
                    data: {},
                    chartTitle: chart.title
                  };
                  chart.datasets.forEach(ds => {
                    xlsxChartOpts.data[ds.label] = {};
                    chart.labels.forEach((label, idx) => {
                      xlsxChartOpts.data[ds.label][label] = ds.data[idx] || 0;
                    });
                  });
                } else {
                  xlsxChartOpts = {
                    charts: chartsList.map(chart => {
                      const singleOpt = {
                        chart: convertChartType(chart.type),
                        titles: chart.datasets.map(d => d.label),
                        fields: chart.labels,
                        data: {},
                        chartTitle: chart.title
                      };
                      chart.datasets.forEach(ds => {
                        singleOpt.data[ds.label] = {};
                        chart.labels.forEach((label, idx) => {
                          singleOpt.data[ds.label][label] = ds.data[idx] || 0;
                        });
                      });
                      return singleOpt;
                    })
                  };
                }

                // Transform to 2 sheets: Chart (placeholder) and Table (styled data)
                sheetDefinitions = [
                  {
                    name: "Chart",
                    csvData: "Placeholder,Chart\n1,1", // dummy CSV
                    title: null
                  },
                  {
                    name: "Table",
                    csvData: sheetDef.csvData,
                    // FORCE title to null if we have a native chart! 
                    // xlsx-chart hardcodes formula references to start at row 1.
                    // If we add a title row, the data shifts to row 2 and the chart reads text instead of numbers, resulting in a blank chart.
                    title: null
                  }
                ];
              }

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

                // Collect summary info
                const headers = parsedData[0] || [];
                sheetSummaries.push({
                  name: sheetName,
                  title: sheetTitle,
                  rows: dataRowCount,
                  columns: colCount,
                  headers: headers.slice(0, 10),
                  hasMore: headers.length > 10,
                  embeddedCharts: [],
                });
              }

              let buffer = await workbook.xlsx.writeBuffer();

              // --- Process and Merge Native Excel Chart ---
              if (hasNativeChart && xlsxChartOpts) {
                try {
                  const xlsxChart = new XlsxChart();
                  const xlsxChartBuffer = await new Promise((resolve, reject) => {
                    xlsxChart.generate(xlsxChartOpts, (err, data) => {
                      if (err) return reject(err);
                      resolve(Buffer.from(data, "base64"));
                    });
                  });

                  // Merge native chart XMLs into exceljs styled workbook
                  buffer = await mergeNativeChart(buffer, xlsxChartBuffer);

                  // Update summaries for native chart rendering
                  sheetSummaries.length = 0;
                  sheetSummaries.push({
                    name: "Chart",
                    title: "Biểu đồ trực quan hóa dữ liệu gốc",
                    rows: 0,
                    columns: 0,
                    headers: [],
                    hasMore: false,
                    embeddedCharts: originalCharts.map(c => ({ title: c.title, type: c.type, range: "Sheet: Chart (Native Excel Chart)" }))
                  });

                  const tableParsedData = parseCSV(sheetDefinitions[1].csvData, detectDelimiter(sheetDefinitions[1].csvData));
                  sheetSummaries.push({
                    name: "Table",
                    title: title || "Bảng số liệu chi tiết",
                    rows: tableParsedData.length - 1,
                    columns: tableParsedData[0]?.length || 0,
                    headers: tableParsedData[0] || [],
                    hasMore: tableParsedData[0]?.length > 10,
                    embeddedCharts: []
                  });

                } catch (chartErr) {
                  allWarnings.push(`Không thể vẽ biểu đồ native: ${chartErr.message}. Fallback về bảng dữ liệu thường.`);
                }
              }

              const bufferSizeKB = (buffer.length / 1024).toFixed(2);
              const displayFilename = filename.split("/").pop();

              this.super.handlerProps.log(
                `create-excel-file: Generated buffer - size: ${bufferSizeKB}KB, sheets: ${sheetSummaries.length}`
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
                if (summary.name === "Chart") {
                  parts.push(`- Loại sheet: Sheet biểu đồ gốc (Native Excel Chart Sheet)`);
                  if (summary.embeddedCharts.length > 0) {
                    parts.push(`📈 **Biểu đồ có sẵn:**`);
                    summary.embeddedCharts.forEach((c) => {
                      parts.push(`  - ✓ **${c.title}** (Định dạng: Excel-native ${c.type}) liên kết trực tiếp tới các ô dữ liệu.`);
                    });
                  }
                } else {
                  parts.push(`- Số dòng dữ liệu: ${summary.rows}`);
                  parts.push(`- Số cột: ${summary.columns}`);
                  if (summary.headers.length > 0) {
                    parts.push(`- Các cột: ${summary.headers.join(", ")}${summary.hasMore ? "..." : ""}`);
                  }
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

              if (sheetSummaries.some((s) => s.name === "Table" && s.title)) {
                parts.push("- ✓ Title row (tiêu đề lớn merge cells)");
              }

              if (hasNativeChart) {
                parts.push("- ✓ **Biểu đồ Native Excel**: Biểu đồ gốc hoàn toàn có thể chỉnh sửa trực tiếp dữ liệu.");
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
