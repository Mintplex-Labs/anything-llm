/* eslint-env jest, node */
process.env.STORAGE_DIR = "test-storage";

const { resolvePaperlessNgxBaseUrl } = require("../../../../utils/extensions/PaperlessNgx");
const PaperlessNgxLoader = require("../../../../utils/extensions/PaperlessNgx/PaperlessNgxLoader");

describe("resolvePaperlessNgxBaseUrl", () => {
  test("preserves context path and strips trailing slash", () => {
    expect(
      resolvePaperlessNgxBaseUrl("https://docs.example.com/paperless/")
    ).toBe("https://docs.example.com/paperless");
  });

  test("preserves nested context path", () => {
    expect(
      resolvePaperlessNgxBaseUrl("https://docs.example.com/services/paperless")
    ).toBe("https://docs.example.com/services/paperless");
  });

  test("strips multiple trailing slashes", () => {
    expect(
      resolvePaperlessNgxBaseUrl("https://docs.example.com/paperless///")
    ).toBe("https://docs.example.com/paperless");
  });

  test("returns origin when no context path", () => {
    expect(
      resolvePaperlessNgxBaseUrl("https://docs.example.com/")
    ).toBe("https://docs.example.com");
  });

  test("preserves explicit port", () => {
    expect(
      resolvePaperlessNgxBaseUrl("http://localhost:8000/paperless")
    ).toBe("http://localhost:8000/paperless");
  });
});

describe("PaperlessNgxLoader (context-path preservation)", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("appends /api/documents/ after the context path", async () => {
    const fetchMock = jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ results: [], next: null }),
    });

    const loader = new PaperlessNgxLoader({
      baseUrl: resolvePaperlessNgxBaseUrl(
        "https://docs.example.com/paperless/"
      ),
      apiToken: "test-token",
    });

    await loader.fetchAllDocuments();

    expect(fetchMock).toHaveBeenCalledWith(
      "https://docs.example.com/paperless/api/documents/",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Token test-token",
        }),
      })
    );
  });

  test("document content URL also keeps the context path", async () => {
    const fetchMock = jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      text: jest.fn().mockResolvedValue("plain text body"),
    });

    const loader = new PaperlessNgxLoader({
      baseUrl: resolvePaperlessNgxBaseUrl(
        "https://docs.example.com/paperless"
      ),
      apiToken: "test-token",
    });

    await loader.fetchDocumentContent(42);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://docs.example.com/paperless/api/documents/42/download/",
      expect.any(Object)
    );
  });
});
