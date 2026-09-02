/* eslint-env jest, node */
process.env.STORAGE_DIR = "test-storage";

jest.mock("../../../utils/downloadURIToFile", () => ({
  downloadURIToFile: jest.fn(),
}));
jest.mock("../../../processSingleFile", () => ({
  processSingleFile: jest.fn(),
}));
// generic.js pulls in the puppeteer loader and the YouTube loader at
// require-time; neither is exercised here.
jest.mock("langchain/document_loaders/web/puppeteer", () => ({
  PuppeteerWebBaseLoader: class {},
}));
jest.mock("../../../utils/extensions/YoutubeTranscript", () => ({
  loadYouTubeTranscript: jest.fn(),
}));
// Keep processAsFile real - it is the unit under test - but let the test
// decide what determineContentType says about the link.
jest.mock("../../../processLink/helpers", () => {
  const actual = jest.requireActual("../../../processLink/helpers");
  return { ...actual, determineContentType: jest.fn() };
});

const { downloadURIToFile } = require("../../../utils/downloadURIToFile");
const { processSingleFile } = require("../../../processSingleFile");
const helpers = require("../../../processLink/helpers");
const { scrapeGenericUrl } = require("../../../processLink/convert/generic");

beforeEach(() => {
  downloadURIToFile.mockReset();
  processSingleFile.mockReset();
  helpers.determineContentType.mockReset();
  downloadURIToFile.mockResolvedValue({
    success: true,
    fileLocation: "/srv/collector/hotdir/example.com-report.pdf",
    reason: null,
  });
  processSingleFile.mockResolvedValue({
    success: true,
    reason: null,
    documents: [{ pageContent: "body" }],
  });
});

describe("processAsFile", () => {
  test("forwards the caller's metadata to processSingleFile", async () => {
    await helpers.processAsFile({
      uri: "https://example.com/report.pdf",
      saveAsDocument: true,
      metadata: { title: "Q3 Report", docAuthor: "Finance" },
    });

    expect(processSingleFile).toHaveBeenCalledWith(
      "example.com-report.pdf",
      { parseOnly: false },
      { title: "Q3 Report", docAuthor: "Finance" }
    );
  });

  test("defaults to empty metadata when none is given", async () => {
    await helpers.processAsFile({
      uri: "https://example.com/report.pdf",
      saveAsDocument: false,
    });

    expect(processSingleFile).toHaveBeenCalledWith(
      "example.com-report.pdf",
      { parseOnly: true },
      {}
    );
  });
});

describe("scrapeGenericUrl", () => {
  test("a link that resolves to a file keeps the metadata sent with it", async () => {
    helpers.determineContentType.mockResolvedValue({
      contentType: "application/pdf",
      processVia: "file",
    });

    await scrapeGenericUrl({
      link: "https://example.com/report.pdf",
      metadata: { title: "Q3 Report" },
      saveAsDocument: true,
    });

    expect(processSingleFile).toHaveBeenCalledWith(
      "example.com-report.pdf",
      { parseOnly: false },
      { title: "Q3 Report" }
    );
  });
});
