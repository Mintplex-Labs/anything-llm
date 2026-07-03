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
} = require("./utils.js");

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
            "Create a professional Excel spreadsheet (.xlsx) from CSV data. " +
            "ALL styling is AUTOMATIC — you only need to provide the CSV data and filename. " +
            "The tool automatically applies: header styling, column auto-fit, zebra striping, frozen panes, " +
            "smart number formatting (thousand separators, decimals), total row detection, and autofilter. " +
            "Supports multiple sheets, automatic type detection (numbers, dates, booleans, currency, percentages). " +
            "Provide data in CSV format with comma, semicolon, tab, or pipe delimiters. " +
            "IMPORTANT for CSV data quality: " +
            "- Include ALL columns from the source data, do not omit any fields " +
            "- Use clear Vietnamese or English column headers " +
            "- Include a 'STT' (ordinal number) column when listing items " +
            "- For financial data, include currency values as plain numbers " +
            "- If you have a summary/total row, start it with 'Tổng' or 'Total' — it will be auto-styled",
          examples: [
            {
              prompt: "Xuất danh sách văn bản hành chính ra Excel",
              call: JSON.stringify({
                filename: "danh-sach-van-ban.xlsx",
                title: "DANH SÁCH VĂN BẢN HÀNH CHÍNH NĂM 2026",
                csvData:
                  "STT,Ký hiệu văn bản,Trích yếu nội dung,Ngày văn bản,Cơ quan ban hành,Trạng thái\n" +
                  "1,5775/STC-QLDN,Về việc rà soát cơ chế chính sách hỗ trợ doanh nghiệp,18/06/2026,Sở Tài chính,Đã xử lý\n" +
                  "2,702/CV-UBND,CV góp ý dự thảo triển khai Cổng DVC quốc gia,18/06/2026,UBND Tỉnh,Đang xử lý\n" +
                  "3,299/BC-UBND,Báo cáo tình hình triển khai NQ 57-NQ/TW,18/06/2026,UBND Phường,Hoàn thành",
              }),
            },
            {
              prompt: "Create an Excel file with sales data",
              call: JSON.stringify({
                filename: "sales-report.xlsx",
                title: "Q1 Sales Report 2026",
                csvData:
                  "Product,Region,Sales,Growth %\n" +
                  "Widget A,North,1250500,15.2%\n" +
                  "Widget B,South,980000,8.5%\n" +
                  "Widget C,East,1100250,12.1%\n" +
                  "Total,,3330750,11.9%",
              }),
            },
            {
              prompt: "Tạo báo cáo tài chính chi tiết",
              call: JSON.stringify({
                filename: "bao-cao-tai-chinh.xlsx",
                sheets: [
                  {
                    name: "Thu chi",
                    title: "BÁO CÁO THU CHI QUÝ I/2026",
                    csvData:
                      "STT,Khoản mục,Kế hoạch (VNĐ),Thực hiện (VNĐ),Tỷ lệ %,Ghi chú\n" +
                      "1,Doanh thu bán hàng,5000000000,4850000000,97%,Đạt kế hoạch\n" +
                      "2,Doanh thu dịch vụ,2000000000,2150000000,107.5%,Vượt kế hoạch\n" +
                      "3,Chi phí nguyên vật liệu,3000000000,2800000000,93.3%,Tiết kiệm\n" +
                      "4,Chi phí nhân sự,1500000000,1520000000,101.3%,Tăng nhẹ\n" +
                      "Tổng cộng,,11500000000,11320000000,98.4%,",
                  },
                  {
                    name: "Nhân sự",
                    title: "DANH SÁCH NHÂN SỰ",
                    csvData:
                      "STT,Họ tên,Phòng ban,Chức vụ,Lương (VNĐ)\n" +
                      "1,Nguyễn Văn A,Kỹ thuật,Trưởng phòng,25000000\n" +
                      "2,Trần Thị B,Kinh doanh,Nhân viên,15000000\n" +
                      "3,Lê Văn C,Hành chính,Phó phòng,20000000",
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
                  "Use for report titles like 'DANH SÁCH VĂN BẢN NĂM 2026' or 'Sales Report Q1'. " +
                  "Only applies when using single-sheet mode (csvData). For multi-sheet, set title per sheet.",
              },
              csvData: {
                type: "string",
                description:
                  "CSV data for a single-sheet workbook. Use comma, semicolon, tab, or pipe as delimiter. " +
                  "MUST include a header row as the first line. " +
                  "For multiple sheets, use the 'sheets' parameter instead.",
              },
              sheets: {
                type: "array",
                description:
                  "Array of sheet definitions for multi-sheet workbooks. Each sheet has a name, csvData, and optional title.",
                items: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      description:
                        "The name of the worksheet (max 31 characters).",
                    },
                    csvData: {
                      type: "string",
                      description: "The CSV data for this sheet.",
                    },
                    title: {
                      type: "string",
                      description:
                        "Optional title row for this sheet (large merged header at top).",
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
            sheets = null,
          }) {
            try {
              this.super.handlerProps.log(`Using the create-excel-file tool.`);

              // Strip XML 1.0 illegal control characters from all cell content
              // and sheet names so Excel can open the generated workbook.
              csvData = createFilesLib.stripInvalidXmlChars(csvData);
              sheets = createFilesLib.stripInvalidXmlChars(sheets);
              title = createFilesLib.stripInvalidXmlChars(title);

              const hasExtension = /\.xlsx$/i.test(filename);
              if (!hasExtension) filename = `${filename}.xlsx`;

              if (sheets && typeof sheets === "string") {
                // LLM hallucinated sheets as a string (the CSV data)
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
                sheet.csvData = actualCsvData; // Normalize
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
                const dataRowCount = parsedData.length - 1; // Minus header
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
                applyHeaderStyle(worksheet, {
                  bold: true,
                  fill: "FF0F172A",
                  fontColor: "FFFFFFFF",
                });

                // Adjust header style row if title exists
                if (dataStartRow > 1) {
                  // Re-apply header style to the actual header row (row 2)
                  const headerRow = worksheet.getRow(dataStartRow);
                  if (headerRow && headerRow.cellCount > 0) {
                    headerRow.eachCell((cell) => {
                      cell.font = {
                        bold: true,
                        color: { argb: "FFFFFFFF" },
                        name: "Segoe UI",
                        size: 11,
                      };
                      cell.fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: "FF0F172A" },
                      };
                      cell.alignment = {
                        vertical: "middle",
                        horizontal: "center",
                      };
                    });
                    headerRow.height = 25;
                  }
                }

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
                  headers: headers.slice(0, 10), // First 10 columns
                  hasMore: headers.length > 10,
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
                parts.push("");
              }

              parts.push("🎨 **Định dạng tự động đã áp dụng:**");
              parts.push("- ✓ Header row (đậm, nền tối, chữ trắng)");
              parts.push("- ✓ Auto-fit column widths");
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
                parts.push(`⚠️ **Warnings:**`);
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
