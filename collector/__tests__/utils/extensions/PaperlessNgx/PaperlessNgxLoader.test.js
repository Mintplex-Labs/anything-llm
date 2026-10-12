/* eslint-env jest, node */
const PaperlessNgxLoader = require("../../../../utils/extensions/PaperlessNgx/PaperlessNgxLoader");

describe("PaperlessNgxLoader pagination", () => {
  afterEach(() => jest.restoreAllMocks());

  it("follows the next page through the configured base URL", async () => {
    const base = "https://docs.example.com/paperless";
    const pages = {
      [`${base}/api/documents/`]: {
        // Behind a reverse proxy Paperless links to the scheme, host and path it sees.
        next: "http://paperless:8000/api/documents/?page=2",
        results: [{ id: 1 }, { id: 2 }],
      },
      [`${base}/api/documents/?page=2`]: {
        // A link that already matches the configured URL keeps working.
        next: `${base}/api/documents/?page=3`,
        results: [{ id: 3 }],
      },
      [`${base}/api/documents/?page=3`]: { next: null, results: [{ id: 4 }] },
    };
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(global, "fetch").mockImplementation(async (url) => {
      if (pages[url]) return { ok: true, json: async () => pages[url] };
      if (
        url.startsWith(`${base}/api/documents/`) &&
        url.endsWith("/download/")
      )
        return {
          ok: true,
          headers: { get: () => "text/plain" },
          text: async () => `text of ${url}`,
        };
      return { ok: false, status: 404 };
    });

    const docs = await new PaperlessNgxLoader({
      baseUrl: base,
      apiToken: "token",
    }).load();
    expect(docs.map((doc) => doc.metadata.id)).toEqual([1, 2, 3, 4]);
  });
});
