/* eslint-env jest, node */
const mockStat = jest.fn();
const mockReadFile = jest.fn();

jest.mock("fs", () => ({
  promises: {
    stat: (...args) => mockStat(...args),
    readFile: (...args) => mockReadFile(...args),
  },
}));

const PDFLoader = require("../../../../../processSingleFile/convert/asPDF/PDFLoader");

describe("PDFLoader", () => {
  let consoleErrorSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("file size guard", () => {
    it("throws if file exceeds MAX_PDF_FILE_SIZE_MB", async () => {
      mockStat.mockResolvedValue({ size: 251 * 1024 * 1024 });
      const loader = new PDFLoader("/fake/large.pdf");

      await expect(loader.load()).rejects.toThrow(
        /exceeds the maximum allowed size of 250MB/
      );
    });

    it("does not throw if file is under MAX_PDF_FILE_SIZE_MB", async () => {
      mockStat.mockResolvedValue({ size: 100 * 1024 * 1024 });
      mockReadFile.mockResolvedValue(Buffer.from("fake-pdf-data"));

      const mockPdf = {
        numPages: 0,
        getMetadata: jest.fn().mockResolvedValue({}),
        getPage: jest.fn(),
      };

      const loader = new PDFLoader("/fake/small.pdf");
      loader.getPdfJS = jest.fn().mockResolvedValue({
        getDocument: jest.fn().mockReturnValue({
          promise: Promise.resolve(mockPdf),
        }),
        version: "1.10.100",
      });

      const result = await loader.load();

      expect(result).toEqual([]);
    });
  });

  describe("password detection", () => {
    it("throws a descriptive error on PasswordException", async () => {
      mockStat.mockResolvedValue({ size: 1024 });
      mockReadFile.mockResolvedValue(Buffer.from("encrypted-pdf-data"));

      const passwordError = new Error("Incorrect or missing password");
      passwordError.name = "PasswordException";

      const loader = new PDFLoader("/fake/encrypted.pdf");
      loader.getPdfJS = jest.fn().mockResolvedValue({
        getDocument: jest.fn().mockReturnValue({
          promise: Promise.reject(passwordError),
        }),
        version: "1.10.100",
      });

      await expect(loader.load()).rejects.toThrow(/password protected/);
    });
  });
});