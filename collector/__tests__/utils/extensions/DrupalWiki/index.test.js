/* eslint-env jest, node */
process.env.STORAGE_DIR = require("path").join(
  require("os").tmpdir(),
  "anythingllm-drupalwiki-tests"
);

// The converter is stubbed: this exercises where the attachment is written,
// not what the converter makes of it.
jest.mock("../../../../processSingleFile", () => ({
  processSingleFile: jest.fn().mockResolvedValue({ success: true }),
}));

// Only the document writer is stubbed; sanitizeFileName, normalizePath and
// isWithin stay real because they are what the path construction depends on.
jest.mock("../../../../utils/files", () => {
  const actual = jest.requireActual("../../../../utils/files");
  return { ...actual, writeToServerDocuments: jest.fn() };
});

const fs = require("fs");
const path = require("path");
const { processSingleFile } = require("../../../../processSingleFile");
const { WATCH_DIRECTORY } = require("../../../../utils/constants");
const {
  DrupalWiki,
} = require("../../../../utils/extensions/DrupalWiki/DrupalWiki");

const BASE = "https://wiki.example.com";

function buildLoader(fileName) {
  const loader = new DrupalWiki({ baseUrl: BASE, accessToken: "token" });
  loader._doFetch = jest.fn(async (url) => {
    if (url.includes("/attachment?pageId="))
      return { content: [{ fileName, id: 77 }] };
    if (/\/page\/\d+$/.test(url))
      return {
        id: 1,
        title: "Page One",
        lastModified: "2026-01-01",
        type: "page",
        body: "<p>Body text that is not empty.</p>",
      };
    return { content: [{ id: 1 }], last: true };
  });
  return loader;
}

describe("DrupalWiki attachment storage", () => {
  let writeFileSync;

  beforeEach(() => {
    jest.clearAllMocks();
    fs.mkdirSync(WATCH_DIRECTORY, { recursive: true });
    writeFileSync = jest
      .spyOn(fs, "writeFileSync")
      .mockImplementation(() => {});
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      arrayBuffer: async () => new ArrayBuffer(8),
    });
  });

  afterEach(() => writeFileSync.mockRestore());

  it("writes a supported attachment into the watch directory", async () => {
    const loader = buildLoader("spec.pdf");

    await loader.loadAndStoreAllPagesForSpace(5, { encrypt: () => "enc" });

    expect(writeFileSync).toHaveBeenCalledTimes(1);
    const written = writeFileSync.mock.calls[0][0];
    expect(path.dirname(path.resolve(written))).toBe(
      path.resolve(WATCH_DIRECTORY)
    );
    expect(path.basename(written)).toBe("spec.pdf");
    expect(processSingleFile).toHaveBeenCalledWith(written);
  });

  it("keeps a traversing attachment name inside the watch directory", async () => {
    const loader = buildLoader("../../etc/passwd.pdf");

    await loader.loadAndStoreAllPagesForSpace(5, { encrypt: () => "enc" });

    expect(writeFileSync).toHaveBeenCalledTimes(1);
    const written = path.resolve(writeFileSync.mock.calls[0][0]);
    expect(path.dirname(written)).toBe(path.resolve(WATCH_DIRECTORY));
    expect(written).not.toContain("etc");
  });
});
