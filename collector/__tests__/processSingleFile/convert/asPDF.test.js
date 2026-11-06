/* eslint-env jest, node */
process.env.STORAGE_DIR = "test-storage"; // needed for tests to run

// PDFLoader trims each page, so a scanned page whose text layer holds only
// whitespace loads as an empty page.
jest.mock("../../../processSingleFile/convert/asPDF/PDFLoader", () =>
  jest.fn().mockImplementation(() => ({
    load: async () => [
      { pageContent: "", metadata: { loc: { pageNumber: 1 } } },
    ],
  }))
);
jest.mock("../../../utils/OCRLoader", () =>
  jest.fn().mockImplementation(() => ({
    ocrPDF: async () => [
      { pageContent: "Invoice 1042", metadata: { loc: { pageNumber: 1 } } },
    ],
  }))
);
jest.mock("../../../utils/files", () => ({
  ...jest.requireActual("../../../utils/files"),
  writeToServerDocuments: jest.fn(({ data }) => data),
}));

const asPdf = require("../../../processSingleFile/convert/asPDF");

describe("asPdf", () => {
  it("runs OCR when the text layer has only empty pages", async () => {
    const result = await asPdf({
      fullFilePath: "/nonexistent/scan.pdf",
      filename: "scan.pdf",
      options: { absolutePath: true, parseOnly: true },
    });

    expect(result.success).toBe(true);
    expect(result.documents[0].pageContent).toBe("Invoice 1042");
  });
});
