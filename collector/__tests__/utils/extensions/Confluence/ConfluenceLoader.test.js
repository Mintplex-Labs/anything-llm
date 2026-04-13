/* eslint-env jest, node */
process.env.STORAGE_DIR = "test-storage";

const { normalizeBaseUrl } = require("../../../../utils/extensions/Confluence");
const {
  ConfluencePagesLoader,
} = require("../../../../utils/extensions/Confluence/ConfluenceLoader");

describe("Confluence base URL handling", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("preserves self-hosted context paths", () => {
    expect(normalizeBaseUrl("https://my.domain.com/confluence/", false)).toBe(
      "https://my.domain.com/confluence"
    );
  });

  test("ignores cloud URL paths before loader appends cloud routes", () => {
    expect(
      normalizeBaseUrl("https://example.atlassian.net/wiki/spaces/SP", true)
    ).toBe("https://example.atlassian.net");
  });

  test("fetches self-hosted Confluence API through the configured context path", async () => {
    const fetchMock = jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ size: 0, results: [] }),
    });
    const loader = new ConfluencePagesLoader({
      baseUrl: normalizeBaseUrl("https://my.domain.com/confluence/", false),
      spaceKey: "SP",
      username: "user",
      accessToken: "token",
      cloud: false,
    });

    await loader.fetchAllPagesInSpace();

    expect(fetchMock).toHaveBeenCalledWith(
      "https://my.domain.com/confluence/rest/api/content?spaceKey=SP&limit=25&start=0&expand=body.storage,version",
      expect.any(Object)
    );
  });

  test("builds self-hosted page URLs through the configured context path", () => {
    const loader = new ConfluencePagesLoader({
      baseUrl: normalizeBaseUrl("https://my.domain.com/confluence/", false),
      spaceKey: "SP",
      username: "user",
      accessToken: "token",
      cloud: false,
    });

    const document = loader.createDocumentFromPage({
      id: "123",
      status: "current",
      title: "Context path page",
      type: "page",
      body: { storage: { value: "<p>Hello</p>" } },
      version: {
        number: 1,
        by: { displayName: "User" },
        when: "2026-01-01T00:00:00.000Z",
      },
    });

    expect(document.metadata.url).toBe(
      "https://my.domain.com/confluence/spaces/SP/pages/123"
    );
  });
});
