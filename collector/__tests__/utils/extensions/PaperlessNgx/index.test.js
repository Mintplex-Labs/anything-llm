/* eslint-env jest, node */
const fs = require("fs");
const os = require("os");
const path = require("path");

process.env.STORAGE_DIR = fs.mkdtempSync(
  path.join(os.tmpdir(), "paperless-ngx-test-")
);

const { EncryptionWorker } = require("../../../../utils/EncryptionWorker");
const {
  loadPaperlessNgx,
} = require("../../../../utils/extensions/PaperlessNgx");
const PaperlessNgxLoader = require("../../../../utils/extensions/PaperlessNgx/PaperlessNgxLoader");

const BASE_URL = "http://paperless.local";
const response = {
  locals: {
    encryptionWorker: new EncryptionWorker(
      Buffer.alloc(32, 7).toString("base64")
    ),
  },
};

/** Serves one page of documents, then the same plain-text content for each. */
function mockPaperlessApi(results) {
  return jest.spyOn(global, "fetch").mockImplementation(async (url) => {
    if (String(url).endsWith("/download/"))
      return {
        ok: true,
        status: 200,
        headers: { get: () => "text/plain" },
        text: async () => "Scanned text.",
      };
    return {
      ok: true,
      status: 200,
      json: async () => ({ next: null, results }),
    };
  });
}

function savedTitles(destination) {
  const folder = path.join(process.env.STORAGE_DIR, "documents", destination);
  return fs
    .readdirSync(folder)
    .map((file) => JSON.parse(fs.readFileSync(path.join(folder, file))).title)
    .sort();
}

beforeEach(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

afterAll(() => {
  fs.rmSync(process.env.STORAGE_DIR, { recursive: true, force: true });
});

describe("loadPaperlessNgx", () => {
  test("imports documents that have no original file name", async () => {
    mockPaperlessApi([
      { id: 1, title: "Invoice", original_file_name: "invoice.pdf" },
      { id: 2, title: "Old scan", original_file_name: null },
      { id: 3, title: "Receipt", original_file_name: "receipt.pdf" },
    ]);

    const result = await loadPaperlessNgx(
      { baseUrl: BASE_URL, apiToken: "token" },
      response
    );

    expect(result.success).toBe(true);
    expect(savedTitles(result.data.destination)).toEqual([
      "Old scan",
      "invoice.pdf",
      "receipt.pdf",
    ]);
  });
});

describe("PaperlessNgxLoader.createDocumentFromPage", () => {
  const loader = new PaperlessNgxLoader({ baseUrl: BASE_URL, apiToken: "t" });
  const titleOf = (doc) => loader.createDocumentFromPage(doc).metadata.title;

  test("falls back to the document title, then to the document id", () => {
    expect(
      titleOf({ id: 2, title: "Old scan", original_file_name: null })
    ).toBe("Old scan");
    expect(titleOf({ id: 3, title: "", original_file_name: null })).toBe(
      "Paperless-ngx document 3"
    );
  });
});
