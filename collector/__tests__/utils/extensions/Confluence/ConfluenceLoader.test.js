/* eslint-env jest, node */
process.env.STORAGE_DIR = "test-storage";

const { resolveConfluenceBaseUrl } = require("../../../../utils/extensions/Confluence");
const {
  ConfluencePagesLoader,
} = require("../../../../utils/extensions/Confluence/ConfluenceLoader");

describe("resolveConfluenceBaseUrl", () => {
  test("cloud: strips path and returns origin only", () => {
    expect(
      resolveConfluenceBaseUrl("https://example.atlassian.net/wiki/spaces/SP", true)
    ).toBe("https://example.atlassian.net");
  });

  test("self-hosted: preserves context path, strips trailing slash", () => {
    expect(
      resolveConfluenceBaseUrl("https://my.domain.com/confluence/", false)
    ).toBe("https://my.domain.com/confluence");
  });

  test("self-hosted: returns origin when no context path", () => {
    expect(
      resolveConfluenceBaseUrl("https://my.domain.com/", false)
    ).toBe("https://my.domain.com");
  });
});

describe("ConfluencePagesLoader", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("preserves code blocks when the macro id precedes the name", () => {
    const loader = new ConfluencePagesLoader({
      baseUrl: "https://example.com",
      spaceKey: "SP",
      cloud: false,
    });
    const document = loader.createDocumentFromPage({
      id: "123",
      body: {
        storage: {
          value:
            '<ac:structured-macro ac:macro-id="example" ac:name="code" ac:schema-version="1"><ac:parameter ac:name="language">js</ac:parameter><ac:plain-text-body><![CDATA[let x = 1;]]></ac:plain-text-body></ac:structured-macro>',
        },
      },
    });

    expect(document.pageContent).toBe("```js\nlet x = 1;\n```");
  });

  test("keeps markup, indentation and blank lines inside code blocks as written", () => {
    const loader = new ConfluencePagesLoader({
      baseUrl: "https://example.com",
      spaceKey: "SP",
      cloud: false,
    });
    const code =
      '<div class="box">\n    <span>Hi & bye</span>\n</div>\n\n\n\nList<String> names = new ArrayList<>();';
    const document = loader.createDocumentFromPage({
      id: "123",
      body: {
        storage: {
          value: `<p>Before</p><ac:structured-macro ac:name="code"><ac:parameter ac:name="language">html</ac:parameter><ac:plain-text-body><![CDATA[${code}]]></ac:plain-text-body></ac:structured-macro><p>After</p><p>ANYTHINGLLMCODEBLOCK7</p>`,
        },
      },
    });

    expect(document.pageContent).toBe(
      `Before\n\n\`\`\`html\n${code}\n\`\`\`\n\nAfter\n\nANYTHINGLLMCODEBLOCK7`
    );
  });

  test("load rejects with the HTTP status instead of resolving to no pages", async () => {
    jest
      .spyOn(global, "fetch")
      .mockResolvedValue({ ok: false, status: 401, json: async () => ({}) });
    const loader = new ConfluencePagesLoader({
      baseUrl: "https://example.com",
      spaceKey: "SP",
      cloud: false,
    });

    await expect(loader.load()).rejects.toThrow("from Confluence: 401");
  });

  describe("cloud mode", () => {
    test("API requests include /wiki prefix", async () => {
      const fetchMock = jest.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ size: 0, results: [] }),
      });
      const loader = new ConfluencePagesLoader({
        baseUrl: resolveConfluenceBaseUrl("https://example.atlassian.net/wiki/spaces/SP", true),
        spaceKey: "SP",
        username: "user",
        accessToken: "token",
        cloud: true,
      });

      await loader.fetchAllPagesInSpace();

      expect(fetchMock).toHaveBeenCalledWith(
        "https://example.atlassian.net/wiki/rest/api/content?spaceKey=SP&limit=25&start=0&expand=body.storage,version",
        expect.any(Object)
      );
    });

    test("page URLs include /wiki prefix", () => {
      const loader = new ConfluencePagesLoader({
        baseUrl: resolveConfluenceBaseUrl("https://example.atlassian.net/wiki", true),
        spaceKey: "SP",
        username: "user",
        accessToken: "token",
        cloud: true,
      });

      const document = loader.createDocumentFromPage({
        id: "123",
        status: "current",
        title: "Cloud page",
        type: "page",
        body: { storage: { value: "<p>Hello</p>" } },
        version: { number: 1, by: { displayName: "User" }, when: "2026-01-01T00:00:00.000Z" },
      });

      expect(document.metadata.url).toBe(
        "https://example.atlassian.net/wiki/spaces/SP/pages/123"
      );
    });
  });

  describe("self-hosted mode", () => {
    test("API requests use context path without /wiki", async () => {
      const fetchMock = jest.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ size: 0, results: [] }),
      });
      const loader = new ConfluencePagesLoader({
        baseUrl: resolveConfluenceBaseUrl("https://my.domain.com/confluence/", false),
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

    test("page URLs use context path without /wiki", () => {
      const loader = new ConfluencePagesLoader({
        baseUrl: resolveConfluenceBaseUrl("https://my.domain.com/confluence/", false),
        spaceKey: "SP",
        username: "user",
        accessToken: "token",
        cloud: false,
      });

      const document = loader.createDocumentFromPage({
        id: "123",
        status: "current",
        title: "Self-hosted page",
        type: "page",
        body: { storage: { value: "<p>Hello</p>" } },
        version: { number: 1, by: { displayName: "User" }, when: "2026-01-01T00:00:00.000Z" },
      });

      expect(document.metadata.url).toBe(
        "https://my.domain.com/confluence/spaces/SP/pages/123"
      );
    });
  });
});
