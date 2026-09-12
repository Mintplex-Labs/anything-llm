jest.mock(
  "js-tiktoken",
  () => ({
    getEncoding: () => ({ encode: (s) => String(s).split(" ") }),
    encodingForModel: () => ({ encode: (s) => String(s).split(" ") }),
  }),
  { virtual: true }
);

jest.mock(
  "mime",
  () => ({ lookup: (s) => "application/octet-stream", extension: (s) => "bin" }),
  { virtual: true }
);

jest.mock(
  "slugify",
  () => ({ __esModule: true, default: (s) => String(s) }),
  { virtual: true }
);
jest.mock("uuid", () => ({ v4: () => "mock-uuid" }), { virtual: true });

/* eslint-env jest, node */
process.env.STORAGE_DIR = "test-storage";

const { resolvePaperlessBaseUrl } = require("../../../../utils/extensions/PaperlessNgx");
const { PaperlessNgxLoader } = require("../../../../utils/extensions/PaperlessNgx/PaperlessNgxLoader");

describe("resolvePaperlessBaseUrl", () => {
  test("preserves context path, strips trailing slash", () => {
    expect(resolvePaperlessBaseUrl("https://my.domain.com/paperless/")).toBe(
      "https://my.domain.com/paperless"
    );
  });

  test("returns origin when no context path", () => {
    expect(resolvePaperlessBaseUrl("https://my.domain.com/")).toBe(
      "https://my.domain.com"
    );
  });

  test("accepts bare host without trailing slash", () => {
    expect(resolvePaperlessBaseUrl("https://my.domain.com")).toBe(
      "https://my.domain.com"
    );
  });

  test("preserves multi-segment subpath", () => {
    expect(
      resolvePaperlessBaseUrl("https://paperless.example.com/paperless/ngx/")
    ).toBe("https://paperless.example.com/paperless/ngx");
  });

  test("preserves custom port", () => {
    expect(
      resolvePaperlessBaseUrl("https://paperless.example.com:8080/paperless-ngx/")
    ).toBe("https://paperless.example.com:8080/paperless-ngx");
  });

  test("root path stays at origin", () => {
    expect(resolvePaperlessBaseUrl("https://paperless.example.com:8080/")).toBe(
      "https://paperless.example.com:8080"
    );
  });
});

describe("PaperlessNgxLoader", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("constructor keeps context path instead of truncating to origin", () => {
    const loader = new PaperlessNgxLoader({
      baseUrl: resolvePaperlessBaseUrl(
        "https://paperless.example.com:8080/paperless-ngx/"
      ),
      apiToken: "token",
    });
    expect(loader.baseUrl).toBe("https://paperless.example.com:8080/paperless-ngx");
  });

  test("API requests are built on the normalized base URL", async () => {
    const fetchMock = jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ results: [], next: null }),
    });
    const loader = new PaperlessNgxLoader({
      baseUrl: resolvePaperlessBaseUrl(
        "https://paperless.example.com:8080/paperless-ngx/"
      ),
      apiToken: "token",
    });
    await loader.fetchAllDocuments();
    expect(fetchMock).toHaveBeenCalledWith(
      "https://paperless.example.com:8080/paperless-ngx/api/documents/",
      expect.any(Object)
    );
  });

  test("document metadata URL uses the normalized base URL", () => {
    const loader = new PaperlessNgxLoader({
      baseUrl: resolvePaperlessBaseUrl(
        "https://paperless.example.com:8080/paperless-ngx/"
      ),
      apiToken: "token",
    });
    const document = loader.createDocumentFromPage({
      id: 42,
      original_file_name: "doc.pdf",
      created: "2026-01-01",
      modified: "2026-01-02",
      added: "2026-01-03",
      tags: [],
      correspondent: "Alice",
      document_type: "Invoice",
    });
    expect(document.metadata.url).toBe(
      "https://paperless.example.com:8080/paperless-ngx/documents/42"
    );
  });
});
