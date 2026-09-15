/* eslint-env jest, node */
process.env.STORAGE_DIR = "test-storage"; // needed for tests to run

jest.mock("../../../processSingleFile", () => ({
  processSingleFile: jest.fn(),
}));
jest.mock("../../../utils/downloadURIToFile", () => ({
  downloadURIToFile: jest.fn(),
}));

const { processSingleFile } = require("../../../processSingleFile");
const { downloadURIToFile } = require("../../../utils/downloadURIToFile");
const {
  parseContentType,
  returnResult,
  getContentTypeFromURL,
  determineContentType,
  processAsFile,
} = require("../../../processLink/helpers");

const MBOX_URL = "http://127.0.0.1:8080/inbox.mbox";

function mockHead({
  ok = true,
  status = 200,
  statusText = "OK",
  contentType = "application/mbox",
} = {}) {
  return jest.spyOn(global, "fetch").mockImplementation(async () => ({
    ok,
    status,
    statusText,
    headers: { get: () => contentType },
  }));
}

function mockDownload(fileLocation = "/watch/inbox.mbox") {
  downloadURIToFile.mockResolvedValue({
    success: true,
    reason: null,
    fileLocation,
  });
}

beforeEach(() => {
  jest.restoreAllMocks();
  processSingleFile.mockReset();
  downloadURIToFile.mockReset();
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});

describe("parseContentType", () => {
  it("returns null for a missing header", () => {
    expect(parseContentType(null)).toBeNull();
    expect(parseContentType(undefined)).toBeNull();
    expect(parseContentType("")).toBeNull();
  });

  it("lowercases the mime and drops its parameters", () => {
    expect(parseContentType("Application/PDF; charset=utf-8")).toBe(
      "application/pdf"
    );
    expect(parseContentType("  text/html  ; boundary=x")).toBe("text/html");
  });

  it("returns null when the header carries only parameters", () => {
    expect(parseContentType("; charset=utf-8")).toBeNull();
  });
});

describe("returnResult", () => {
  it("returns only success and content when not saving as a document", () => {
    expect(
      returnResult({
        success: true,
        reason: null,
        documents: [{ pageContent: "a" }],
        content: "a",
        saveAsDocument: false,
      })
    ).toEqual({ success: true, content: "a" });
  });

  it("returns success, reason and documents when saving as a document", () => {
    expect(
      returnResult({
        success: false,
        reason: "nope",
        documents: [],
        content: null,
      })
    ).toEqual({ success: false, reason: "nope", documents: [] });
  });
});

describe("getContentTypeFromURL", () => {
  it("rejects input that is not a URL", async () => {
    expect(await getContentTypeFromURL("not a url")).toEqual({
      success: false,
      reason: "Not a valid URL.",
      contentType: null,
    });
  });

  it("reports the status of a failed HEAD request", async () => {
    mockHead({ ok: false, status: 404, statusText: "Not Found" });
    expect(await getContentTypeFromURL(MBOX_URL)).toEqual({
      success: false,
      reason: "HTTP 404: Not Found",
      contentType: null,
    });
  });

  it("reports a response with no Content-Type", async () => {
    mockHead({ contentType: null });
    expect(await getContentTypeFromURL(MBOX_URL)).toEqual({
      success: false,
      reason: "No Content-Type found.",
      contentType: null,
    });
  });

  it("returns the mime without its charset", async () => {
    mockHead({ contentType: "application/mbox; charset=utf-8" });
    expect(await getContentTypeFromURL(MBOX_URL)).toEqual({
      success: true,
      reason: null,
      contentType: "application/mbox",
    });
  });
});

describe("determineContentType", () => {
  it("routes a YouTube link without making a request", async () => {
    const fetchSpy = mockHead();
    expect(
      await determineContentType("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
    ).toEqual({ contentType: "text/html", processVia: "youtube" });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("routes an accepted file mime to the file path", async () => {
    mockHead({ contentType: "application/mbox" });
    expect(await determineContentType(MBOX_URL)).toEqual({
      contentType: "application/mbox",
      processVia: "file",
    });
  });

  it.each(["text/html", "text/plain"])(
    "keeps %s on the web path",
    async (contentType) => {
      mockHead({ contentType });
      expect(await determineContentType(MBOX_URL)).toEqual({
        contentType,
        processVia: "web",
      });
    }
  );

  it("keeps an unsupported mime on the web path", async () => {
    mockHead({ contentType: "application/x-not-supported" });
    expect(await determineContentType(MBOX_URL)).toEqual({
      contentType: "application/x-not-supported",
      processVia: "web",
    });
  });

  it("falls back to the web path when the content type cannot be read", async () => {
    mockHead({ ok: false, status: 500, statusText: "Server Error" });
    expect(await determineContentType(MBOX_URL)).toEqual({
      contentType: null,
      processVia: "web",
    });
  });
});

describe("processAsFile", () => {
  it("returns the reason the download failed", async () => {
    downloadURIToFile.mockResolvedValue({
      success: false,
      reason: "Could not download file.",
      fileLocation: null,
    });
    expect(await processAsFile({ uri: MBOX_URL })).toEqual({
      success: false,
      reason: "Could not download file.",
      documents: [],
    });
    expect(processSingleFile).not.toHaveBeenCalled();
  });

  it("returns a parse failure as an empty text result", async () => {
    mockDownload();
    processSingleFile.mockResolvedValue({
      success: false,
      reason: "No mail items found in inbox.mbox.",
      documents: [],
    });
    expect(
      await processAsFile({ uri: MBOX_URL, saveAsDocument: false })
    ).toEqual({ success: false, content: null });
  });

  it("parses without saving when only the text is wanted", async () => {
    mockDownload("/watch/inbox.mbox");
    processSingleFile.mockResolvedValue({
      success: true,
      reason: null,
      documents: [{ pageContent: "only email" }],
    });
    await processAsFile({ uri: MBOX_URL, saveAsDocument: false });
    expect(processSingleFile).toHaveBeenCalledWith(
      "inbox.mbox",
      { parseOnly: true },
      {}
    );
  });

  it("forwards the caller's metadata to the parser", async () => {
    mockDownload();
    processSingleFile.mockResolvedValue({
      success: true,
      reason: null,
      documents: [{ pageContent: "only email" }],
    });
    await processAsFile({
      uri: MBOX_URL,
      saveAsDocument: false,
      metadata: { title: "Inbox" },
    });
    expect(processSingleFile).toHaveBeenCalledWith(
      "inbox.mbox",
      { parseOnly: true },
      { title: "Inbox" }
    );
  });

  it("passes the parsed documents through untouched when saving as a document", async () => {
    mockDownload();
    const parsed = {
      success: true,
      reason: null,
      documents: [{ pageContent: "first email" }, { pageContent: "second email" }],
    };
    processSingleFile.mockResolvedValue(parsed);
    expect(await processAsFile({ uri: MBOX_URL })).toBe(parsed);
    expect(processSingleFile).toHaveBeenCalledWith(
      "inbox.mbox",
      { parseOnly: false },
      {}
    );
  });

  it("separates the documents it joins with one blank line", async () => {
    // The separator is this module's choice, so it is pinned on its own rather
    // than inside the content-preservation cases below.
    mockDownload();
    processSingleFile.mockResolvedValue({
      success: true,
      reason: null,
      documents: [
        { pageContent: "first email" },
        { pageContent: "second email" },
      ],
    });
    expect(
      await processAsFile({ uri: MBOX_URL, saveAsDocument: false })
    ).toEqual({ success: true, content: "first email\n\nsecond email" });
  });

  describe.each([
    ["two messages", ["first email", "second email"]],
    ["ten messages", Array.from({ length: 10 }, (_, i) => `message ${i}`)],
    ["repeated identical messages", ["same body", "same body", "same body"]],
    [
      "messages carrying their own line breaks and padding",
      ["  leading pad\nsecond line", "trailing pad  \n\nlast line"],
    ],
    ["messages that sort out of order", ["zebra", "apple", "mango"]],
  ])("keeps every parsed message, %s", (_label, bodies) => {
    it("returns each body unchanged and in order", async () => {
      mockDownload();
      processSingleFile.mockResolvedValue({
        success: true,
        reason: null,
        documents: bodies.map((pageContent) => ({ pageContent })),
      });
      const { content } = await processAsFile({
        uri: MBOX_URL,
        saveAsDocument: false,
      });
      // Walk the result and require each body verbatim, in order, with exactly
      // one separator between neighbours and nothing left over. That rejects
      // taking the first, sorting, de-duplicating and trimming, and it stays
      // correct for a body that contains a blank line of its own.
      let cursor = 0;
      bodies.forEach((body, index) => {
        if (index > 0) {
          expect(content.slice(cursor, cursor + 2)).toBe("\n\n");
          cursor += 2;
        }
        expect(content.slice(cursor, cursor + body.length)).toBe(body);
        cursor += body.length;
      });
      expect(cursor).toBe(content.length);
    });
  });

  it("returns a single document's text unchanged", async () => {
    mockDownload();
    processSingleFile.mockResolvedValue({
      success: true,
      reason: null,
      documents: [{ pageContent: "only email" }],
    });
    expect(
      await processAsFile({ uri: MBOX_URL, saveAsDocument: false })
    ).toEqual({ success: true, content: "only email" });
  });

  it("skips documents that carry no text", async () => {
    mockDownload();
    processSingleFile.mockResolvedValue({
      success: true,
      reason: null,
      documents: [
        { pageContent: "first email" },
        { pageContent: "" },
        {},
        { pageContent: "second email" },
      ],
    });
    expect(
      await processAsFile({ uri: MBOX_URL, saveAsDocument: false })
    ).toEqual({ success: true, content: "first email\n\nsecond email" });
  });

  it("returns empty text when the file parsed to no documents", async () => {
    mockDownload();
    processSingleFile.mockResolvedValue({
      success: true,
      reason: null,
      documents: [],
    });
    expect(
      await processAsFile({ uri: MBOX_URL, saveAsDocument: false })
    ).toEqual({ success: true, content: "" });
  });
});
