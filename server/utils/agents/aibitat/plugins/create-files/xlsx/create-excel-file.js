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
            "Create an Excel spreadsheet (.xlsx) from CSV data. " +
            "Supports multiple sheets, automatic type detection (numbers, dates, booleans), " +
            "header styling, column auto-fit, zebra striping, and frozen panes. " +
            "Provide data in CSV format with comma, semicolon, tab, or pipe delimiters.",
          examples: [
            {
              prompt: "Create an Excel file with sales data",
              call: JSON.stringify({
                filename: "sales-report.xlsx",
                sheets: [
                  {
                    name: "Q1 Sales",
                    csvData:
                      "Product,Region,Sales,Date\nWidget A,North,1250.50,2024-01-15\nWidget B,South,980.00,2024-01-20\nWidget C,East,1100.25,2024-02-01",
                    options: {
                      headerStyle: true,
                      autoFit: true,
                      freezeHeader: true,
                    },
                  },
                ],
              }),
            },
            {
              prompt: "Create a multi-sheet Excel workbook with employee data",
              call: JSON.stringify({
                filename: "employee-directory.xlsx",
                sheets: [
                  {
                    name: "Employees",
                    csvData:
                      "ID,Name,Department,Salary,Start Date\n1,John Smith,Engineering,85000,2022-03-15\n2,Jane Doe,Marketing,72000,2021-08-01\n3,Bob Wilson,Sales,68000,2023-01-10",
                    options: {
                      headerStyle: true,
                      zebraStripes: true,
                      freezeHeader: true,
                    },
                  },
                  {
                    name: "Departments",
                    csvData:
                      "Department,Head,Budget\nEngineering,Alice Brown,500000\nMarketing,Carol White,250000\nSales,Dan Green,300000",
                    options: { headerStyle: true, autoFit: true },
                  },
                ],
              }),
            },
            {
              prompt: "Create a simple spreadsheet from CSV data",
              call: JSON.stringify({
                filename: "data-export.xlsx",
                csvData:
                  "Name,Email,Status\nAlice,alice@example.com,Active\nBob,bob@example.com,Pending\nCharlie,charlie@example.com,Active",
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
              csvData: {
                type: "string",
                description:
                  "CSV data for a single-sheet workbook. Use comma, semicolon, tab, or pipe as delimiter. " +
                  "For multiple sheets, use the 'sheets' parameter instead.",
              },
              sheets: {
                type: "array",
                description:
                  "Array of sheet definitions for multi-sheet workbooks. Each sheet has a name, csvData, and optional styling options.",
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
                    options: {
                      type: "object",
                      description: "Optional styling options for this sheet.",
                      properties: {
                        headerStyle: {
                          type: "boolean",
                          description:
                            "Apply styling to the header row (bold, colored background).",
                        },
                        autoFit: {
                          type: "boolean",
                          description:
                            "Auto-fit column widths based on content.",
                        },
                        freezeHeader: {
                          type: "boolean",
                          description:
                            "Freeze the header row so it stays visible when scrolling.",
                        },
                        zebraStripes: {
                          type: "boolean",
                          description:
                            "Apply alternating row colors for better readability.",
                        },
                        delimiter: {
                          type: "string",
                          description:
                            "Override auto-detected delimiter. One of: comma, semicolon, tab, pipe.",
                        },
                      },
                    },
                  },
                  required: ["name", "csvData"],
                },
              },
              options: {
                type: "object",
                description:
                  "Default styling options applied to all sheets (can be overridden per-sheet).",
                properties: {
                  headerStyle: { type: "boolean" },
                  autoFit: { type: "boolean" },
                  freezeHeader: { type: "boolean" },
                  zebraStripes: { type: "boolean" },
                },
              },
            },
            required: ["filename"],
            additionalProperties: false,
          },
          handler: async function ({
            filename = "spreadsheet.xlsx",
            csvData = null,
            sheets = null,
            options = {},
          }) {
            try {
              this.super.handlerProps.log(`Using the create-excel-file tool.`);

              const hasExtension = /\.xlsx$/i.test(filename);
              if (!hasExtension) filename = `${filename}.xlsx`;

              if (!csvData && (!sheets || sheets.length === 0)) {
                return "Error: You must provide either 'csvData' for a single sheet or 'sheets' array for multiple sheets.";
              }

              const sheetDefinitions = sheets
                ? sheets
                : [
                    {
                      name: "Sheet1",
                      csvData,
                      options: {},
                    },
                  ];

              for (const sheet of sheetDefinitions) {
                if (!sheet.csvData || sheet.csvData.trim() === "") {
                  return `Error: Sheet "${sheet.name || "unnamed"}" has no CSV data.`;
                }
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

              workbook.creator = "AnythingLLM";
              workbook.created = new Date();
              workbook.modified = new Date();

              const allWarnings = [];

              for (const sheetDef of sheetDefinitions) {
                let sheetName = (sheetDef.name || "Sheet").substring(0, 31);
                sheetName = sheetName.replace(/[*?:\\/[\]]/g, "_");

                const sheetOptions = {
                  ...options,
                  ...(sheetDef.options || {}),
                };

                const delimiterMap = {
                  comma: ",",
                  semicolon: ";",
                  tab: "\t",
                  pipe: "|",
                };
                const delimiter = sheetOptions.delimiter
                  ? delimiterMap[sheetOptions.delimiter] ||
                    sheetOptions.delimiter
                  : detectDelimiter(sheetDef.csvData);

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
                      cellValue.includes("%")
                    ) {
                      cell.numFmt = "0.00%";
                    }
                  }

                  row.commit();
                }

                if (sheetOptions.autoFit !== false) {
                  autoFitColumns(worksheet);
                }

                if (sheetOptions.headerStyle !== false) {
                  applyHeaderStyle(worksheet);
                }

                if (sheetOptions.zebraStripes) {
                  applyZebraStriping(worksheet);
                }

                if (sheetOptions.freezeHeader !== false) {
                  freezePanes(worksheet, 1, 0);
                }
              }

              applyBranding(workbook);

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

              let result = `Successfully created Excel spreadsheet "${displayFilename}" (${bufferSizeKB}KB) with ${sheetDefinitions.length} sheet(s).`;

              if (allWarnings.length > 0) {
                result += `\n\nWarnings:\n${allWarnings.map((w) => `- ${w}`).join("\n")}`;
              }

              return result;
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
