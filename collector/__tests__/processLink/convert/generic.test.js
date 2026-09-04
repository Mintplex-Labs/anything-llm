/* eslint-env jest, node */
process.env.STORAGE_DIR = "test-storage"; // needed for tests to run

jest.mock("langchain/document_loaders/web/puppeteer", () => ({
  PuppeteerWebBaseLoader: jest.fn(),
}));

const {
  PuppeteerWebBaseLoader,
} = require("langchain/document_loaders/web/puppeteer");
const { scrapeGenericUrl } = require("../../../processLink/convert/generic");
const {
  htmlToMarkdown,
} = require("../../../processLink/helpers/htmlToMarkdown");

const LINK = "http://127.0.0.1:8080/page";
const PAGE =
  "<html><head><title>T</title></head><body>" +
  '<div id="target"><h1>Hello</h1><p>Some <a href="https://example.com">link</a></p></div>' +
  "</body></html>";

function mockFetch() {
  return jest.spyOn(global, "fetch").mockImplementation(async () => ({
    ok: true,
    status: 200,
    statusText: "OK",
    headers: { get: () => "text/html" },
    text: async () => PAGE,
  }));
}

function mockBrowser() {
  PuppeteerWebBaseLoader.mockImplementation((_url, options) => ({
    load: async () => {
      const page = { evaluate: async () => PAGE };
      const browser = { close: async () => {} };
      return [{ pageContent: await options.evaluate(page, browser) }];
    },
  }));
}

function mockBrowserFailure() {
  PuppeteerWebBaseLoader.mockImplementation(() => ({
    load: async () => {
      throw new Error("Could not find Chrome");
    },
  }));
}

const GET = expect.objectContaining({ method: "GET" });
const scrape = (captureAs) =>
  scrapeGenericUrl({ link: LINK, captureAs, saveAsDocument: false });

beforeEach(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("getPageContent captureAs", () => {
  describe("via puppeteer", () => {
    beforeEach(mockBrowser);

    it("returns the raw page for html", async () => {
      const fetchMock = mockFetch();
      expect((await scrape("html")).content).toBe(PAGE);
      expect(fetchMock).not.toHaveBeenCalledWith(LINK, GET);
    });

    it("returns markdown for text", async () => {
      mockFetch();
      expect((await scrape("text")).content).toBe(
        await htmlToMarkdown(PAGE, LINK)
      );
    });
  });

  describe("via the fetch fallback when puppeteer throws", () => {
    beforeEach(mockBrowserFailure);

    it("returns the raw page for html", async () => {
      const fetchMock = mockFetch();
      expect((await scrape("html")).content).toBe(PAGE);
      expect(fetchMock).toHaveBeenCalledWith(LINK, GET);
    });

    it("returns markdown for text", async () => {
      const fetchMock = mockFetch();
      expect((await scrape("text")).content).toBe(
        await htmlToMarkdown(PAGE, LINK)
      );
      expect(fetchMock).toHaveBeenCalledWith(LINK, GET);
    });
  });
});
