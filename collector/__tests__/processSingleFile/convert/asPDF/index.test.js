/* eslint-env jest, node */
process.env.STORAGE_DIR = "test-storage";

const mockLoad = jest.fn();

jest.mock("../../../../processSingleFile/convert/asPDF/PDFLoader", () =>
  jest.fn().mockImplementation(() => ({ load: mockLoad }))
);
jest.mock("../../../../utils/files", () => ({
  createdDate: jest.fn(() => "2026-01-01T00:00:00.000Z"),
  trashFile: jest.fn(),
  writeToServerDocuments: jest.fn(({ data }) => ({ ...data })),
}));
jest.mock("../../../../utils/tokenizer", () => ({
  tokenizeString: jest.fn(() => 2),
}));
jest.mock("../../../../utils/OCRLoader", () =>
  jest.fn().mockImplementation(() => ({ ocrPDF: jest.fn() }))
);

const { writeToServerDocuments } = require("../../../../utils/files");
const asPdf = require("../../../../processSingleFile/convert/asPDF");

function pageWith(info) {
  return [
    {
      pageContent: "Hello world",
      metadata: { pdf: { info, totalPages: 1 }, loc: { pageNumber: 1 } },
    },
  ];
}

async function authorOf(info, metadata = {}) {
  mockLoad.mockResolvedValue(pageWith(info));
  const result = await asPdf({
    fullFilePath: "/tmp/report.pdf",
    filename: "report.pdf",
    metadata,
  });
  return { result, data: writeToServerDocuments.mock.calls[0][0].data };
}

beforeEach(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
  mockLoad.mockReset();
  writeToServerDocuments.mockClear();
});

describe("asPdf document author", () => {
  test("uses the PDF Author field, not the Creator application", async () => {
    const { data } = await authorOf({
      Author: "Jane Doe",
      Creator: "Microsoft Word",
      Title: "Report",
    });
    expect(data.docAuthor).toBe("Jane Doe");
  });

  test("does not fall back to Creator when Author is absent", async () => {
    const { data } = await authorOf({ Creator: "LaTeX", Title: "Report" });
    expect(data.docAuthor).toBe("no author found");
  });

  test("an explicit metadata.docAuthor still wins", async () => {
    const { data } = await authorOf(
      { Author: "Jane Doe", Creator: "Microsoft Word" },
      { docAuthor: "John Smith" }
    );
    expect(data.docAuthor).toBe("John Smith");
  });
});
