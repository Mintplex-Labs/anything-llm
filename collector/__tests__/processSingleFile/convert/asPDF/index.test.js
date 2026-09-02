/* eslint-env jest, node */
process.env.STORAGE_DIR = "test-storage"; // needed for tests to run

// The loader is stubbed so the test drives page text directly - no PDF fixture
// and no pdfjs parsing are required.
jest.mock("../../../../processSingleFile/convert/asPDF/PDFLoader");

// Stub the writer so the converted document can be inspected without touching
// the documents folder.
jest.mock("../../../../utils/files", () => {
  const actual = jest.requireActual("../../../../utils/files");
  return {
    ...actual,
    createdDate: jest.fn(() => "2026-01-01"),
    trashFile: jest.fn(),
    writeToServerDocuments: jest.fn((args) => args.data),
  };
});

const PDFLoader = require("../../../../processSingleFile/convert/asPDF/PDFLoader");
const { writeToServerDocuments } = require("../../../../utils/files");
const asPdf = require("../../../../processSingleFile/convert/asPDF");

function mockPages(pages) {
  PDFLoader.mockImplementation(() => ({
    load: async () =>
      pages.map((text, index) => ({
        pageContent: text,
        metadata: { loc: { pageNumber: index + 1 } },
      })),
  }));
}

describe("asPdf page assembly", () => {
  beforeEach(() => jest.clearAllMocks());

  it("separates page boundaries instead of fusing the adjoining words", async () => {
    // PDFLoader trims each page, so joining with "" leaves no boundary at all.
    mockPages(["Revenue for the quarter grew to", "$4.2 million, up 12% YoY."]);

    const result = await asPdf({
      fullFilePath: "/tmp/report.pdf",
      filename: "report.pdf",
      options: { absolutePath: true },
    });

    expect(result.success).toBe(true);
    const { pageContent } = writeToServerDocuments.mock.calls[0][0].data;
    expect(pageContent).not.toContain("grew to$4.2");
    expect(pageContent).toContain("grew to\n\n$4.2 million");
  });

  it("keeps a page-number footer off the next page's heading", async () => {
    mockPages(["Some closing sentence.\n12", "Chapter 3"]);

    await asPdf({
      fullFilePath: "/tmp/book.pdf",
      filename: "book.pdf",
      options: { absolutePath: true },
    });

    const { pageContent } = writeToServerDocuments.mock.calls[0][0].data;
    expect(pageContent).not.toContain("12Chapter 3");
  });

  it("does not add a separator before the only page", async () => {
    mockPages(["Single page body."]);

    await asPdf({
      fullFilePath: "/tmp/one.pdf",
      filename: "one.pdf",
      options: { absolutePath: true },
    });

    const { pageContent } = writeToServerDocuments.mock.calls[0][0].data;
    expect(pageContent).toBe("Single page body.");
  });
});
