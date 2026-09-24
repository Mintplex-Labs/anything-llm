const fs = require("fs");
const os = require("os");
const path = require("path");
const xlsx = require("node-xlsx").default;

jest.mock("../../../utils/files", () => ({
  createdDate: () => "2024-01-01",
  trashFile: jest.fn(),
  writeToServerDocuments: jest.fn(({ data }) => data),
  documentsFolder: "/tmp",
}));

const asXlsx = require("../../../processSingleFile/convert/asXlsx");

async function pageContentOf(rows) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "asxlsx-"));
  const fullFilePath = path.join(dir, "sheet.xlsx");
  fs.writeFileSync(fullFilePath, xlsx.build([{ name: "Orders", data: rows }]));
  const result = await asXlsx({
    fullFilePath,
    filename: "sheet.xlsx",
    options: { parseOnly: true, absolutePath: true },
  });
  expect(result.success).toBe(true);
  return result.documents[0].pageContent;
}

describe("asXlsx", () => {
  it("reads a date as the date the sheet shows, not as its serial number", async () => {
    const content = await pageContentOf([
      ["order", "placed"],
      ["A-1", new Date(2024, 8, 30)],
    ]);

    // The stored value is the serial number 45565 with a date format.
    expect(content).toContain("A-1,9/30/24");
    expect(content).not.toContain("45565");
  });

  it("keeps every digit of a long number", async () => {
    const content = await pageContentOf([
      ["order", "phone", "total"],
      [1234567890123, 8613812345678, 1234.5],
    ]);

    // Formatted the way Excel's General format shows it, the first two would
    // read 1.23457E+12 and 8.61381E+12.
    expect(content).toContain("1234567890123,8613812345678,1234.5");
  });
});
