/* eslint-env jest, node */
process.env.STORAGE_DIR = "test-storage"; // needed for tests to run

jest.mock("langchain/document_loaders/web/puppeteer", () => ({
  PuppeteerWebBaseLoader: jest.fn(),
}));
jest.mock("../../../utils/files", () => ({
  ...jest.requireActual("../../../utils/files"),
  writeToServerDocuments: jest.fn(),
}));
jest.mock("../../../processLink/helpers", () => ({
  ...jest.requireActual("../../../processLink/helpers"),
  processAsFile: jest.fn(),
}));
jest.mock("../../../utils/extensions/YoutubeTranscript", () => ({
  loadYouTubeTranscript: jest.fn(),
}));

const {
  PuppeteerWebBaseLoader,
} = require("langchain/document_loaders/web/puppeteer");
const { writeToServerDocuments } = require("../../../utils/files");
const { processAsFile } = require("../../../processLink/helpers");
const {
  loadYouTubeTranscript,
} = require("../../../utils/extensions/YoutubeTranscript");
const { scrapeGenericUrl } = require("../../../processLink/convert/generic");
const {
  htmlToMarkdown,
} = require("../../../processLink/helpers/htmlToMarkdown");

const LINK = "http://127.0.0.1:8080/page";
const PAGE =
  "<html><head><title>T</title></head><body>" +
  '<div id="target"><h1>Hello</h1><p>Some <a href="https://example.com">link</a></p></div>' +
  "</body></html>";

function mockFetch({ contentType = "text/html", body = PAGE } = {}) {
  return jest.spyOn(global, "fetch").mockImplementation(async () => ({
    ok: true,
    status: 200,
    statusText: "OK",
    headers: { get: () => contentType },
    text: async () => body,
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
const scrape = (captureAs, extra = {}) =>
  scrapeGenericUrl({ link: LINK, captureAs, saveAsDocument: false, ...extra });

beforeEach(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
  PuppeteerWebBaseLoader.mockReset();
  writeToServerDocuments.mockReset();
  processAsFile.mockReset();
  loadYouTubeTranscript.mockReset();
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

    it("defaults to text when captureAs is omitted", async () => {
      mockFetch();
      expect((await scrape(undefined)).content).toBe(
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

    it("defaults to text when captureAs is omitted", async () => {
      mockFetch();
      expect((await scrape(undefined)).content).toBe(
        await htmlToMarkdown(PAGE, LINK)
      );
    });

    it.each(["HTML", "Html", " html", "", null, "json", 0, true])(
      "returns markdown for the non-html value %p",
      async (captureAs) => {
        mockFetch();
        expect((await scrape(captureAs)).content).toBe(
          await htmlToMarkdown(PAGE, LINK)
        );
      }
    );

    it("forwards only valid custom headers to the fallback fetch", async () => {
      const fetchMock = mockFetch();
      await scrape("html", {
        scraperHeaders: {
          Authorization: " Bearer abc ",
          "X-Empty": "",
          "X-Blank": "   ",
          "X-Number": 42,
          "   ": "whitespace-key",
        },
      });
      const [, init] = fetchMock.mock.calls.find(
        ([url, opts]) => url === LINK && opts?.method === "GET"
      );
      expect(init.headers).toMatchObject({ Authorization: "Bearer abc" });
      expect(init.headers).not.toHaveProperty("X-Empty");
      expect(init.headers).not.toHaveProperty("X-Blank");
      expect(init.headers).not.toHaveProperty("X-Number");
      expect(init.headers).not.toHaveProperty("   ");
      expect(init.headers["User-Agent"]).toMatch(/Mozilla/);
    });
  });
});

describe("scrapeGenericUrl", () => {
  describe("when no method can fetch the page", () => {
    beforeEach(mockBrowserFailure);

    function mockFetchFailingGet() {
      return jest
        .spyOn(global, "fetch")
        .mockImplementation(async (_url, init) => {
          if (init?.method === "GET") throw new Error("ECONNREFUSED");
          return {
            ok: true,
            status: 200,
            statusText: "OK",
            headers: { get: () => "text/html" },
            text: async () => PAGE,
          };
        });
    }

    it("returns a failed content result when saveAsDocument is false", async () => {
      mockFetchFailingGet();
      expect(await scrape("html")).toEqual({ success: false, content: null });
    });

    it("returns a failed document result when saveAsDocument is true", async () => {
      mockFetchFailingGet();
      expect(await scrape("text", { saveAsDocument: true })).toEqual({
        success: false,
        reason: `No URL content found at ${LINK}.`,
        documents: [],
      });
      expect(writeToServerDocuments).not.toHaveBeenCalled();
    });
  });

  it("fails when the page body is empty", async () => {
    mockBrowserFailure();
    mockFetch({ body: "" });
    expect(await scrape("html")).toEqual({ success: false, content: null });
  });

  describe("when saveAsDocument is true", () => {
    beforeEach(mockBrowser);

    it("writes a document built from the scraped content", async () => {
      mockFetch();
      writeToServerDocuments.mockImplementation(({ data }) => ({
        ...data,
        location: "custom-documents/doc.json",
      }));

      const result = await scrapeGenericUrl({
        link: "https://example.com/docs/intro%20page",
        captureAs: "text",
        metadata: { title: "Intro", docAuthor: "Ada" },
      });

      expect(result.success).toBe(true);
      expect(result.reason).toBeNull();
      expect(result.documents).toHaveLength(1);
      expect(writeToServerDocuments).toHaveBeenCalledTimes(1);

      const { data, filename } = writeToServerDocuments.mock.calls[0][0];
      const markdown = await htmlToMarkdown(
        PAGE,
        "https://example.com/docs/intro%20page"
      );
      expect(data.pageContent).toBe(markdown);
      expect(data.title).toBe("Intro");
      expect(data.docAuthor).toBe("Ada");
      expect(data.description).toBe("No description found.");
      expect(data.docSource).toBe("URL link uploaded by the user.");
      expect(data.chunkSource).toBe(
        "link://https://example.com/docs/intro%20page"
      );
      expect(data.url).toBe("file://example.com_docs_intro-page.html");
      expect(data.wordCount).toBe(markdown.split(" ").length);
      expect(typeof data.token_count_estimate).toBe("number");
      expect(filename).toBe(`url-example.com_docs_intro-page-${data.id}`);
    });

    it("falls back to defaults when metadata is not provided", async () => {
      mockFetch();
      writeToServerDocuments.mockImplementation(({ data }) => data);
      await scrapeGenericUrl({ link: LINK, captureAs: "html" });
      const { data } = writeToServerDocuments.mock.calls[0][0];
      expect(data.title).toBe("127.0.0.1_page.html");
      expect(data.docAuthor).toBe("no author found");
      expect(data.pageContent).toBe(PAGE);
    });
  });

  describe("delegation by content type", () => {
    it("hands non-html mime types in ACCEPTED_MIMES to processAsFile", async () => {
      mockBrowser();
      mockFetch({ contentType: "application/pdf; charset=binary" });
      const expected = { success: true, content: "pdf text" };
      processAsFile.mockResolvedValue(expected);

      const result = await scrape("text");

      expect(result).toBe(expected);
      expect(processAsFile).toHaveBeenCalledWith({
        uri: LINK,
        saveAsDocument: false,
        metadata: {},
      });
      expect(PuppeteerWebBaseLoader).not.toHaveBeenCalled();
    });

    it("does not treat text/plain as a file", async () => {
      mockBrowser();
      mockFetch({ contentType: "text/plain" });
      expect((await scrape("html")).content).toBe(PAGE);
      expect(processAsFile).not.toHaveBeenCalled();
    });

    it("scrapes as a web page when the HEAD probe fails", async () => {
      mockBrowser();
      jest.spyOn(global, "fetch").mockImplementation(async (_url, init) => {
        if (init?.method === "HEAD") throw new Error("HEAD not allowed");
        return {
          ok: true,
          headers: { get: () => "text/html" },
          text: async () => PAGE,
        };
      });
      expect((await scrape("html")).content).toBe(PAGE);
      expect(processAsFile).not.toHaveBeenCalled();
    });

    it("hands YouTube links to the transcript loader with parseOnly mirrored from saveAsDocument", async () => {
      const fetchMock = mockFetch();
      const youtube = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
      const expected = { success: true, content: "transcript" };
      loadYouTubeTranscript.mockResolvedValue(expected);

      const result = await scrapeGenericUrl({
        link: youtube,
        captureAs: "text",
        saveAsDocument: false,
      });

      expect(result).toBe(expected);
      expect(loadYouTubeTranscript).toHaveBeenCalledWith(
        { url: youtube },
        { parseOnly: true }
      );
      expect(fetchMock).not.toHaveBeenCalled();
      expect(PuppeteerWebBaseLoader).not.toHaveBeenCalled();

      loadYouTubeTranscript.mockClear();
      await scrapeGenericUrl({ link: youtube, saveAsDocument: true });
      expect(loadYouTubeTranscript).toHaveBeenCalledWith(
        { url: youtube },
        { parseOnly: false }
      );
    });
  });
});
