/* eslint-env jest, node */
process.env.STORAGE_DIR = "test-storage";

// The resync module pulls in the generic link scraper at require-time.
jest.mock("../../../../processLink", () => ({
  getLinkText: jest.fn(),
}));

// Only `fetchGitlabFile` is stubbed - `generateChunkSource` stays real for the round trip.
jest.mock("../../../../utils/extensions/RepoLoader/GitlabRepo", () => {
  const actual = jest.requireActual(
    "../../../../utils/extensions/RepoLoader/GitlabRepo"
  );
  return { ...actual, fetchGitlabFile: jest.fn() };
});

const GitLabRepoLoader = require("../../../../utils/extensions/RepoLoader/GitlabRepo/RepoLoader");
const {
  generateChunkSource,
  fetchGitlabFile,
  issueToMarkdown,
} = require("../../../../utils/extensions/RepoLoader/GitlabRepo");
const { fetchGitlabFile: realFetchGitlabFile } = jest.requireActual(
  "../../../../utils/extensions/RepoLoader/GitlabRepo"
);
const { EncryptionWorker } = require("../../../../utils/EncryptionWorker");
const resyncHandlers = require("../../../../extensions/resync");

const jsonResponse = (body) => ({
  ok: true,
  status: 200,
  statusText: "OK",
  headers: { get: () => null },
  json: async () => body,
  text: async () => JSON.stringify(body),
});

const textResponse = (text) => ({
  ok: true,
  status: 200,
  statusText: "OK",
  headers: { get: () => null },
  json: async () => ({}),
  text: async () => text,
});

const errorResponse = (status, statusText = "Error") => ({
  ok: false,
  status,
  statusText,
  headers: { get: () => null },
  json: async () => ({}),
  text: async () => "",
});

const rateLimitResponse = () => ({
  ok: false,
  status: 429,
  statusText: "Too Many Requests",
  headers: { get: (name) => (name === "retry-after" ? "0.001" : null) },
  json: async () => ({}),
  text: async () => "",
});

/**
 * Stands up a fake GitLab REST v4 API over `fetch` so no network access is required.
 * The handlers key off the endpoint path only - never the host.
 */
function mockGitlabApi({
  branches = [{ name: "main" }],
  branchStatus = 200,
  tree = [],
  treePages = null,
  files = {},
  userStatus = 200,
  issues = [],
  discussions = {},
  wikis = [],
  wikiStatus = 200,
  rateLimitOnce = [],
  rateLimitAlways = [],
} = {}) {
  const pendingRateLimits = new Set(rateLimitOnce);
  return jest.spyOn(global, "fetch").mockImplementation(async (url) => {
    const { pathname, searchParams } = new URL(url);
    const page = Number(searchParams.get("page"));
    const firstPage = page === 1;

    if (rateLimitAlways.some((suffix) => pathname.endsWith(suffix)))
      return rateLimitResponse();
    const limited = [...pendingRateLimits].find((suffix) =>
      pathname.endsWith(suffix)
    );
    if (limited) {
      pendingRateLimits.delete(limited);
      return rateLimitResponse();
    }

    if (pathname === "/api/v4/user")
      return userStatus === 200
        ? jsonResponse({ username: "tester" })
        : errorResponse(userStatus, "Unauthorized");

    if (pathname.endsWith("/repository/branches")) {
      if (branchStatus !== 200) return errorResponse(branchStatus);
      return jsonResponse(firstPage ? branches : []);
    }

    if (pathname.endsWith("/repository/tree")) {
      if (treePages) {
        const body = treePages[page - 1] ?? [];
        const next = page < treePages.length ? String(page + 1) : "";
        return {
          ...jsonResponse(body),
          headers: { get: (name) => (name === "x-next-page" ? next : null) },
        };
      }
      return jsonResponse(firstPage ? tree : []);
    }

    const discussion = pathname.match(/\/issues\/(\d+)\/discussions$/);
    if (discussion)
      return jsonResponse(firstPage ? discussions[discussion[1]] ?? [] : []);

    if (pathname.endsWith("/issues"))
      return jsonResponse(firstPage ? issues : []);

    if (pathname.endsWith("/wikis")) {
      if (wikiStatus !== 200) return errorResponse(wikiStatus, "Unauthorized");
      return jsonResponse(wikis);
    }

    const raw = pathname.match(/\/repository\/files\/(.+)\/raw$/);
    if (raw) {
      const filePath = decodeURIComponent(raw[1]);
      if (!(filePath in files)) return errorResponse(404, "Not Found");
      return textResponse(files[filePath]);
    }

    return errorResponse(404, "Not Found");
  });
}

/** Every URL `fetch` was called with during a test. */
const requestedUrls = (fetchMock) => fetchMock.mock.calls.map(([url]) => url);
/** Every headers object `fetch` was called with during a test. */
const requestedHeaders = (fetchMock) =>
  fetchMock.mock.calls.map(([, options]) => options?.headers ?? {});

afterEach(() => {
  jest.restoreAllMocks();
  fetchGitlabFile.mockReset();
});

describe("GitLabRepoLoader url parsing", () => {
  test("a gitlab.com url resolves to the hosted api root", async () => {
    mockGitlabApi();
    const loader = new GitLabRepoLoader({
      repo: "https://gitlab.com/gitlab-org/gitlab",
    });
    await loader.init();

    expect(loader.ready).toBe(true);
    expect(loader.apiBase).toBe("https://gitlab.com");
    expect(loader.author).toBe("gitlab-org");
    expect(loader.project).toBe("gitlab");
    expect(loader.projectId).toBe("gitlab-org%2Fgitlab");
  });

  test("a self-hosted url resolves apiBase to its own origin", async () => {
    mockGitlabApi();
    const loader = new GitLabRepoLoader({
      repo: "https://gitlab.example.com/acme/widgets",
    });
    await loader.init();

    expect(loader.ready).toBe(true);
    expect(loader.apiBase).toBe("https://gitlab.example.com");
    expect(loader.author).toBe("acme");
    expect(loader.project).toBe("widgets");
  });

  test("a self-hosted host keeps its port and http scheme in apiBase", async () => {
    const fetchMock = mockGitlabApi();
    const loader = new GitLabRepoLoader({
      repo: "http://gitlab.example.com:8080/acme/widgets",
    });
    await loader.init();

    expect(loader.ready).toBe(true);
    expect(loader.apiBase).toBe("http://gitlab.example.com:8080");
    expect(requestedUrls(fetchMock).length).toBeGreaterThan(0);
    requestedUrls(fetchMock).forEach((url) =>
      expect(url.startsWith("http://gitlab.example.com:8080/api/v4/")).toBe(
        true
      )
    );
  });

  test("a malformed url leaves the loader un-ready and makes no api calls", async () => {
    const fetchMock = mockGitlabApi();
    const loader = new GitLabRepoLoader({ repo: "not-a-url" });
    await loader.init();

    expect(loader.ready).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("a url without a project segment leaves the loader un-ready", async () => {
    const fetchMock = mockGitlabApi();
    const loader = new GitLabRepoLoader({
      repo: "https://gitlab.example.com/acme",
    });
    await loader.init();

    expect(loader.ready).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("a non-http protocol leaves the loader un-ready", async () => {
    const fetchMock = mockGitlabApi();
    const loader = new GitLabRepoLoader({
      repo: "ssh://gitlab.example.com/acme/widgets",
    });
    await loader.init();

    expect(loader.ready).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("GitLabRepoLoader request urls", () => {
  test("gitlab.com requests use the v4 api under the hosted origin", async () => {
    const fetchMock = mockGitlabApi({ files: { "README.md": "# hello" } });
    const loader = new GitLabRepoLoader({
      repo: "https://gitlab.com/acme/widgets",
      branch: "main",
      accessToken: "glpat-token",
    });
    await loader.init();
    await loader.fetchSingleFileContents("README.md");

    expect(requestedUrls(fetchMock)).toContain(
      "https://gitlab.com/api/v4/user"
    );
    expect(requestedUrls(fetchMock)).toContain(
      "https://gitlab.com/api/v4/projects/acme%2Fwidgets/repository/branches?per_page=100&page=1"
    );
    expect(requestedUrls(fetchMock)).toContain(
      "https://gitlab.com/api/v4/projects/acme%2Fwidgets/repository/files/README.md/raw?ref=main"
    );
  });

  test("a self-hosted http host uses the same endpoint paths under its own origin and port", async () => {
    const fetchMock = mockGitlabApi({
      files: { "src/index.js": "console.log('hi');" },
    });
    const loader = new GitLabRepoLoader({
      repo: "http://gitlab.example.com:8080/acme/widgets",
      branch: "main",
    });
    await loader.init();

    await expect(loader.fetchSingleFileContents("src/index.js")).resolves.toBe(
      "console.log('hi');"
    );
    expect(requestedUrls(fetchMock)).toContain(
      "http://gitlab.example.com:8080/api/v4/projects/acme%2Fwidgets/repository/branches?per_page=100&page=1"
    );
    expect(requestedUrls(fetchMock)).toContain(
      "http://gitlab.example.com:8080/api/v4/projects/acme%2Fwidgets/repository/files/src%2Findex.js/raw?ref=main"
    );
  });
});

describe("GitLabRepoLoader branch resolution", () => {
  test("keeps an explicitly provided branch that exists on the remote", async () => {
    mockGitlabApi({ branches: [{ name: "main" }, { name: "develop" }] });
    const loader = new GitLabRepoLoader({
      repo: "https://gitlab.example.com/acme/widgets",
      branch: "develop",
    });
    await loader.init();

    expect(loader.branch).toBe("develop");
  });

  test("auto-assigns main when the provided branch does not exist", async () => {
    mockGitlabApi({ branches: [{ name: "main" }, { name: "develop" }] });
    const loader = new GitLabRepoLoader({
      repo: "https://gitlab.example.com/acme/widgets",
      branch: "does-not-exist",
    });
    await loader.init();

    expect(loader.branch).toBe("main");
  });

  test("falls back to master when the repository has no main branch", async () => {
    mockGitlabApi({ branches: [{ name: "master" }, { name: "legacy" }] });
    const loader = new GitLabRepoLoader({
      repo: "https://gitlab.example.com/acme/widgets",
    });
    await loader.init();

    expect(loader.branch).toBe("master");
  });

  test("getRepoBranches sorts main to the front and returns every branch", async () => {
    mockGitlabApi({
      branches: [{ name: "legacy" }, { name: "main" }, { name: "release" }],
    });
    const loader = new GitLabRepoLoader({
      repo: "https://gitlab.example.com/acme/widgets",
    });
    const branches = await loader.getRepoBranches();

    expect(branches[0]).toBe("main");
    expect(branches.sort()).toEqual(["legacy", "main", "release"]);
  });
});

describe("GitLabRepoLoader access token handling", () => {
  test("sends the PAT as a PRIVATE-TOKEN header on every request", async () => {
    const fetchMock = mockGitlabApi({
      tree: [{ type: "blob", path: "README.md" }],
      files: { "README.md": "# hello" },
    });
    const loader = new GitLabRepoLoader({
      repo: "https://gitlab.example.com/acme/widgets",
      accessToken: "glpat-token",
    });
    await loader.init();
    await loader.recursiveLoader();

    expect(requestedUrls(fetchMock)).toContain(
      "https://gitlab.example.com/api/v4/user"
    );
    requestedHeaders(fetchMock).forEach((headers) =>
      expect(headers).toEqual({ "PRIVATE-TOKEN": "glpat-token" })
    );
  });

  test("a token whose validation request throws is dropped and the loader stays ready", async () => {
    const realMock = mockGitlabApi();
    const impl = realMock.getMockImplementation();
    realMock.mockImplementation(async (url, options) => {
      if (new URL(url).pathname === "/api/v4/user")
        throw new Error("ECONNRESET");
      return impl(url, options);
    });
    jest.spyOn(console, "error").mockImplementation(() => {});
    const loader = new GitLabRepoLoader({
      repo: "https://gitlab.example.com/acme/widgets",
      accessToken: "glpat-token",
    });
    await loader.init();

    expect(loader.ready).toBe(true);
    expect(loader.accessToken).toBeNull();
  });

  test("sends no auth header and skips token validation without a PAT", async () => {
    const fetchMock = mockGitlabApi({
      tree: [{ type: "blob", path: "README.md" }],
      files: { "README.md": "# hello" },
    });
    const loader = new GitLabRepoLoader({
      repo: "https://gitlab.example.com/acme/widgets",
    });
    await loader.init();
    await loader.recursiveLoader();

    expect(requestedUrls(fetchMock)).not.toContain(
      "https://gitlab.example.com/api/v4/user"
    );
    requestedHeaders(fetchMock).forEach((headers) =>
      expect(headers).toEqual({})
    );
  });
});

describe("GitLabRepoLoader file loading", () => {
  test("loads every blob in the tree and builds a browsable url", async () => {
    mockGitlabApi({
      tree: [
        { type: "tree", path: "src" },
        { type: "blob", path: "src/index.js" },
        { type: "blob", path: "README.md" },
      ],
      files: {
        "src/index.js": "console.log('hi');",
        "README.md": "# widgets",
      },
    });
    const loader = new GitLabRepoLoader({
      repo: "https://gitlab.example.com/acme/widgets",
      branch: "main",
    });
    await loader.init();
    const docs = await loader.recursiveLoader();

    expect(docs).toHaveLength(2);
    expect(docs.map((doc) => doc.metadata.source).sort()).toEqual([
      "README.md",
      "src/index.js",
    ]);
    expect(
      docs.find((doc) => doc.metadata.source === "README.md").pageContent
    ).toBe("# widgets");
    expect(
      docs.find((doc) => doc.metadata.source === "README.md").metadata.url
    ).toBe("https://gitlab.example.com/acme/widgets/-/blob/main/README.md");
  });

  test("ignorePaths excludes matched files and never requests their contents", async () => {
    const fetchMock = mockGitlabApi({
      tree: [
        { type: "blob", path: "README.md" },
        { type: "blob", path: "yarn.lock" },
        { type: "blob", path: "node_modules/left-pad/index.js" },
      ],
      files: {
        "README.md": "# widgets",
        "yarn.lock": "lockfile",
        "node_modules/left-pad/index.js": "module.exports = {};",
      },
    });
    const loader = new GitLabRepoLoader({
      repo: "https://gitlab.example.com/acme/widgets",
      branch: "main",
      ignorePaths: ["node_modules/**", "*.lock"],
    });
    await loader.init();
    const docs = await loader.recursiveLoader();

    expect(docs.map((doc) => doc.metadata.source)).toEqual(["README.md"]);
    const rawRequests = requestedUrls(fetchMock).filter((url) =>
      url.includes("/repository/files/")
    );
    expect(rawRequests).toHaveLength(1);
    expect(rawRequests[0]).toContain("/repository/files/README.md/raw");
  });

  test("recursiveLoader refuses to run before init", async () => {
    const loader = new GitLabRepoLoader({
      repo: "https://gitlab.example.com/acme/widgets",
    });

    await expect(loader.recursiveLoader()).rejects.toThrow(
      "[Gitlab Loader]: not in ready state!"
    );
  });
});

describe("GitLabRepoLoader error handling", () => {
  test("a failing branches request yields an empty branch list", async () => {
    mockGitlabApi({ branchStatus: 500 });
    jest.spyOn(console, "warn").mockImplementation(() => {});
    const loader = new GitLabRepoLoader({
      repo: "https://gitlab.example.com/acme/widgets",
    });

    await expect(loader.getRepoBranches()).resolves.toEqual([]);
  });

  test("a missing file resolves to null instead of throwing", async () => {
    mockGitlabApi({ files: { "README.md": "# widgets" } });
    jest.spyOn(console, "error").mockImplementation(() => {});
    const loader = new GitLabRepoLoader({
      repo: "https://gitlab.example.com/acme/widgets",
      branch: "main",
    });
    await loader.init();

    await expect(
      loader.fetchSingleFileContents("does-not-exist.md")
    ).resolves.toBeNull();
  });
});

describe("GitLab chunkSource round trip", () => {
  const encryptionWorker = new EncryptionWorker(
    Buffer.alloc(32, 7).toString("base64")
  );

  const mockResponse = () => {
    const json = jest.fn();
    return {
      json,
      response: {
        locals: { encryptionWorker },
        status: jest.fn(() => ({ json })),
      },
    };
  };

  test("a self-hosted https host survives encode then decode so resync stays on it", async () => {
    mockGitlabApi();
    const loader = new GitLabRepoLoader({
      repo: "https://gitlab.example.com/acme/widgets",
      branch: "main",
      accessToken: "glpat-token",
    });
    await loader.init();

    const chunkSource = generateChunkSource(
      loader,
      { metadata: { source: "src/index.js" } },
      encryptionWorker
    );
    expect(chunkSource.startsWith("gitlab://")).toBe(true);

    fetchGitlabFile.mockResolvedValue({
      success: true,
      reason: null,
      content: "console.log('hi');",
    });
    const { response, json } = mockResponse();
    await resyncHandlers.gitlab({ chunkSource }, response);

    expect(fetchGitlabFile).toHaveBeenCalledWith({
      repoUrl: "https://gitlab.example.com/acme/widgets",
      branch: "main",
      accessToken: "glpat-token",
      sourceFilePath: "src/index.js",
    });
    expect(json).toHaveBeenCalledWith({
      success: true,
      content: "console.log('hi');",
    });
  });

  test("an http self-hosted host keeps its scheme and port through a resync", async () => {
    mockGitlabApi();
    const loader = new GitLabRepoLoader({
      repo: "http://gitlab.example.com:8080/acme/widgets",
      branch: "main",
    });
    await loader.init();

    const chunkSource = generateChunkSource(
      loader,
      { metadata: { source: "src/index.js" } },
      encryptionWorker
    );

    fetchGitlabFile.mockResolvedValue({
      success: true,
      reason: null,
      content: "console.log('hi');",
    });
    const { response } = mockResponse();
    await resyncHandlers.gitlab({ chunkSource }, response);

    expect(fetchGitlabFile).toHaveBeenCalledWith(
      expect.objectContaining({
        repoUrl: "http://gitlab.example.com:8080/acme/widgets",
      })
    );
  });

  test("a chunkSource stored before the protocol was recorded still resyncs over https", async () => {
    const legacy = `gitlab://https://gitlab.com/acme/widgets?payload=${encryptionWorker.encrypt(
      JSON.stringify({
        projectId: "acme/widgets",
        branch: "main",
        path: "README.md",
        pat: null,
      })
    )}`;

    fetchGitlabFile.mockResolvedValue({
      success: true,
      reason: null,
      content: "# hello",
    });
    const { response } = mockResponse();
    await resyncHandlers.gitlab({ chunkSource: legacy }, response);

    expect(fetchGitlabFile).toHaveBeenCalledWith(
      expect.objectContaining({ repoUrl: "https://gitlab.com/acme/widgets" })
    );
  });

  test("a public gitlab.com repo round trips unchanged", async () => {
    mockGitlabApi();
    const loader = new GitLabRepoLoader({
      repo: "https://gitlab.com/acme/widgets",
      branch: "main",
    });
    await loader.init();

    const chunkSource = generateChunkSource(
      loader,
      { metadata: { source: "README.md" } },
      encryptionWorker
    );

    fetchGitlabFile.mockResolvedValue({
      success: true,
      reason: null,
      content: "# hello",
    });
    const { response } = mockResponse();
    await resyncHandlers.gitlab({ chunkSource }, response);

    expect(fetchGitlabFile).toHaveBeenCalledWith(
      expect.objectContaining({
        repoUrl: "https://gitlab.com/acme/widgets",
        sourceFilePath: "README.md",
      })
    );
  });

  test("a failed file fetch reports an unsuccessful resync rather than throwing", async () => {
    mockGitlabApi();
    const loader = new GitLabRepoLoader({
      repo: "http://gitlab.example.com:8080/acme/widgets",
      branch: "main",
    });
    await loader.init();

    const chunkSource = generateChunkSource(
      loader,
      { metadata: { source: "README.md" } },
      encryptionWorker
    );

    jest.spyOn(console, "error").mockImplementation(() => {});
    fetchGitlabFile.mockResolvedValue({
      success: false,
      reason: "Target file returned a null content response.",
      content: null,
    });
    const { response, json } = mockResponse();
    await resyncHandlers.gitlab({ chunkSource }, response);

    expect(json).toHaveBeenCalledWith({ success: false, content: null });
  });
});

describe("GitLabRepoLoader issues and wikis", () => {
  const issue = {
    iid: 7,
    title: "Widgets fall over",
    description: "They should not.",
    web_url: "https://gitlab.example.com/acme/widgets/-/issues/7",
    state: "opened",
    author: { username: "alice" },
  };
  const discussions = {
    7: [
      {
        notes: [
          {
            body: "Reproduced on main.",
            author: { username: "bob" },
            created_at: "2024-01-01T00:00:00Z",
          },
          {
            body: "Fix incoming.",
            author: { username: "alice" },
            created_at: "2024-01-02T00:00:00Z",
          },
        ],
      },
    ],
  };

  test("issues are only requested when fetchIssues is set", async () => {
    const fetchMock = mockGitlabApi({ issues: [issue], discussions });
    const loader = new GitLabRepoLoader({
      repo: "https://gitlab.example.com/acme/widgets",
      branch: "main",
    });
    await loader.init();
    const docs = await loader.recursiveLoader();

    expect(docs).toEqual([]);
    expect(
      requestedUrls(fetchMock).some((url) => url.includes("/issues"))
    ).toBe(false);
  });

  test("fetchIssues attaches every discussion note to its issue", async () => {
    mockGitlabApi({ issues: [issue], discussions });
    const loader = new GitLabRepoLoader({
      repo: "https://gitlab.example.com/acme/widgets",
      branch: "main",
      fetchIssues: true,
    });
    await loader.init();
    const issues = await loader.fetchIssues();

    expect(issues).toHaveLength(1);
    expect(issues[0].iid).toBe(7);
    expect(issues[0].discussions.flat()).toEqual([
      "bob at 2024-01-01T00:00:00Z:\nReproduced on main.",
      "alice at 2024-01-02T00:00:00Z:\nFix incoming.",
    ]);
  });

  test("recursiveLoader wraps issues with a stable source and the issue web url", async () => {
    mockGitlabApi({ issues: [issue], discussions });
    const loader = new GitLabRepoLoader({
      repo: "https://gitlab.example.com/acme/widgets",
      branch: "main",
      fetchIssues: true,
    });
    await loader.init();
    const docs = await loader.recursiveLoader();

    expect(docs).toHaveLength(1);
    expect(docs[0].pageContent).toBeUndefined();
    expect(docs[0].issue.iid).toBe(7);
    expect(docs[0].metadata).toEqual({
      source: "issue-https://gitlab.example.com/acme/widgets-7",
      url: "https://gitlab.example.com/acme/widgets/-/issues/7",
    });
  });

  test("an issue without discussions yields an empty discussions list", async () => {
    mockGitlabApi({ issues: [issue] });
    const loader = new GitLabRepoLoader({
      repo: "https://gitlab.example.com/acme/widgets",
      branch: "main",
      fetchIssues: true,
    });
    await loader.init();
    const issues = await loader.fetchIssues();

    expect(issues[0].discussions).toEqual([]);
  });

  test("fetchWiki requests page content and recursiveLoader wraps each page by slug", async () => {
    const fetchMock = mockGitlabApi({
      wikis: [
        { slug: "home", title: "Home", format: "markdown", content: "# Home" },
        { slug: "faq", title: "FAQ", format: "asciidoc", content: "= FAQ" },
      ],
    });
    const loader = new GitLabRepoLoader({
      repo: "https://gitlab.example.com/acme/widgets",
      branch: "main",
      fetchWikis: true,
    });
    await loader.init();
    const docs = await loader.recursiveLoader();

    expect(requestedUrls(fetchMock)).toContain(
      "https://gitlab.example.com/api/v4/projects/acme%2Fwidgets/wikis?with_content=1&per_page=100&page=1"
    );
    expect(docs).toHaveLength(2);
    expect(docs.map((doc) => doc.metadata)).toEqual([
      {
        source: "wiki-https://gitlab.example.com/acme/widgets-home",
        url: "https://gitlab.example.com/acme/widgets/-/wikis/home",
      },
      {
        source: "wiki-https://gitlab.example.com/acme/widgets-faq",
        url: "https://gitlab.example.com/acme/widgets/-/wikis/faq",
      },
    ]);
    expect(docs[0].wiki.content).toBe("# Home");
  });

  test("wikis are only requested when fetchWikis is set", async () => {
    const fetchMock = mockGitlabApi({ wikis: [{ slug: "home" }] });
    const loader = new GitLabRepoLoader({
      repo: "https://gitlab.example.com/acme/widgets",
      branch: "main",
    });
    await loader.init();
    await loader.recursiveLoader();

    expect(requestedUrls(fetchMock).some((url) => url.includes("/wikis"))).toBe(
      false
    );
  });

  test("a non-array wiki response yields no pages", async () => {
    mockGitlabApi({ wikis: { message: "wiki disabled" } });
    jest.spyOn(console, "warn").mockImplementation(() => {});
    const loader = new GitLabRepoLoader({
      repo: "https://gitlab.example.com/acme/widgets",
      branch: "main",
      fetchWikis: true,
    });
    await loader.init();

    await expect(loader.fetchWiki()).resolves.toEqual([]);
  });

  test("an unauthorized wiki request yields no pages", async () => {
    mockGitlabApi({ wikiStatus: 401 });
    jest.spyOn(console, "warn").mockImplementation(() => {});
    const loader = new GitLabRepoLoader({
      repo: "https://gitlab.example.com/acme/widgets",
      branch: "main",
      fetchWikis: true,
    });
    await loader.init();

    await expect(loader.fetchWiki()).resolves.toEqual([]);
  });
});

describe("GitLabRepoLoader rate limiting and pagination", () => {
  beforeEach(() => {
    jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  test("a single 429 on a raw file fetch is retried and the content returned", async () => {
    const fetchMock = mockGitlabApi({
      files: { "README.md": "# widgets" },
      rateLimitOnce: ["/repository/files/README.md/raw"],
    });
    const loader = new GitLabRepoLoader({
      repo: "https://gitlab.example.com/acme/widgets",
      branch: "main",
    });
    await loader.init();

    await expect(loader.fetchSingleFileContents("README.md")).resolves.toBe(
      "# widgets"
    );
    expect(
      requestedUrls(fetchMock).filter((url) => url.includes("/raw"))
    ).toHaveLength(2);
  });

  test("a persistent 429 on a raw file fetch gives up after the retry budget and returns null", async () => {
    const fetchMock = mockGitlabApi({
      files: { "README.md": "# widgets" },
      rateLimitAlways: ["/repository/files/README.md/raw"],
    });
    const loader = new GitLabRepoLoader({
      repo: "https://gitlab.example.com/acme/widgets",
      branch: "main",
    });
    await loader.init();

    await expect(
      loader.fetchSingleFileContents("README.md")
    ).resolves.toBeNull();
    // one initial attempt plus MAX_RETRIES
    expect(
      requestedUrls(fetchMock).filter((url) => url.includes("/raw"))
    ).toHaveLength(4);
  });

  test("a single 429 on a paginated endpoint is retried and the page returned", async () => {
    const fetchMock = mockGitlabApi({
      branches: [{ name: "main" }, { name: "develop" }],
      rateLimitOnce: ["/repository/branches"],
    });
    const loader = new GitLabRepoLoader({
      repo: "https://gitlab.example.com/acme/widgets",
    });
    const branches = await loader.getRepoBranches();

    expect(branches.sort()).toEqual(["develop", "main"]);
    expect(
      requestedUrls(fetchMock).filter((url) => url.includes("/branches"))
    ).toHaveLength(2);
  });

  test("a persistent 429 on a paginated endpoint yields an empty page set", async () => {
    mockGitlabApi({ rateLimitAlways: ["/repository/branches"] });
    const loader = new GitLabRepoLoader({
      repo: "https://gitlab.example.com/acme/widgets",
    });

    await expect(loader.getRepoBranches()).resolves.toEqual([]);
  });

  test("an unauthorized paginated request yields an empty page set", async () => {
    mockGitlabApi({ branchStatus: 401 });
    const loader = new GitLabRepoLoader({
      repo: "https://gitlab.example.com/acme/widgets",
    });

    await expect(loader.getRepoBranches()).resolves.toEqual([]);
  });

  test("fetchNextPage follows x-next-page until it is empty", async () => {
    const fetchMock = mockGitlabApi({
      treePages: [
        [{ type: "blob", path: "a.md" }],
        [{ type: "blob", path: "b.md" }],
      ],
      files: { "a.md": "A", "b.md": "B" },
    });
    const loader = new GitLabRepoLoader({
      repo: "https://gitlab.example.com/acme/widgets",
      branch: "main",
    });
    await loader.init();
    const docs = await loader.recursiveLoader();

    expect(docs.map((doc) => doc.metadata.source).sort()).toEqual([
      "a.md",
      "b.md",
    ]);
    const treeRequests = requestedUrls(fetchMock).filter((url) =>
      url.includes("/repository/tree")
    );
    expect(treeRequests).toHaveLength(2);
    expect(treeRequests[0]).toContain("page=1");
    expect(treeRequests[1]).toContain("page=2");
  });

  test("a request that throws resolves to null instead of propagating", async () => {
    jest.spyOn(global, "fetch").mockRejectedValue(new Error("ECONNREFUSED"));
    jest.spyOn(console, "error").mockImplementation(() => {});
    const loader = new GitLabRepoLoader({
      repo: "https://gitlab.example.com/acme/widgets",
      branch: "main",
    });

    await expect(
      loader.fetchNextPage({ endpoint: "/api/v4/anything" })
    ).resolves.toBeNull();
    await expect(
      loader.fetchSingleFileContents("README.md")
    ).resolves.toBeNull();
  });
});

describe("fetchGitlabFile", () => {
  test("returns the file contents for a reachable repo", async () => {
    mockGitlabApi({ files: { "src/index.js": "console.log('hi');" } });

    await expect(
      realFetchGitlabFile({
        repoUrl: "https://gitlab.example.com/acme/widgets",
        branch: "main",
        accessToken: "glpat-token",
        sourceFilePath: "src/index.js",
      })
    ).resolves.toEqual({
      success: true,
      reason: null,
      content: "console.log('hi');",
    });
  });

  test("fetches over http when given an http repo url", async () => {
    const fetchMock = mockGitlabApi({ files: { "README.md": "# hello" } });

    const result = await realFetchGitlabFile({
      repoUrl: "http://gitlab.example.com:8080/acme/widgets",
      branch: "main",
      sourceFilePath: "README.md",
    });

    expect(result.content).toBe("# hello");
    requestedUrls(fetchMock).forEach((url) =>
      expect(url.startsWith("http://gitlab.example.com:8080/")).toBe(true)
    );
  });

  test("an invalid repo url fails before any request is made", async () => {
    const fetchMock = mockGitlabApi();

    await expect(
      realFetchGitlabFile({
        repoUrl: "not-a-url",
        branch: "main",
        sourceFilePath: "README.md",
      })
    ).resolves.toEqual({
      success: false,
      content: null,
      reason: "Could not prepare GitLab repo for loading! Check URL or PAT.",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("a missing file reports a null content response", async () => {
    mockGitlabApi({ files: {} });
    jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(
      realFetchGitlabFile({
        repoUrl: "https://gitlab.example.com/acme/widgets",
        branch: "main",
        sourceFilePath: "missing.md",
      })
    ).resolves.toEqual({
      success: false,
      reason: "Target file returned a null content response.",
      content: null,
    });
  });
});

describe("issueToMarkdown", () => {
  const base = {
    iid: 7,
    title: "Widgets fall over",
    description: "They should not.",
    web_url: "https://gitlab.example.com/acme/widgets/-/issues/7",
    state: "opened",
    created_at: "2024-01-01T00:00:00Z",
    discussions: [],
  };

  test("renders the title, description and scalar metadata", () => {
    const markdown = issueToMarkdown(base);

    expect(
      markdown.startsWith("# Widgets fall over (7)\n\nThey should not.\n")
    ).toBe(true);
    expect(markdown).toContain("## Metadata");
    expect(markdown).toContain(
      "- web url: https://gitlab.example.com/acme/widgets/-/issues/7"
    );
    expect(markdown).toContain("- state: opened");
    expect(markdown).toContain("- created at: 2024-01-01T00:00:00Z");
    expect(markdown).not.toContain("## Activity");
  });

  test("user fields collapse to usernames, arrays as nested lists", () => {
    const markdown = issueToMarkdown({
      ...base,
      author: { username: "alice", name: "Alice" },
      assignees: [{ username: "bob" }, { username: "carol" }],
      closed_by: { username: "dave" },
    });

    expect(markdown).toContain("- author: alice");
    expect(markdown).toContain("- assignees:\n  - bob\n  - carol");
    expect(markdown).toContain("- closed by: dave");
    expect(markdown).not.toContain("Alice");
  });

  test("absent, null and empty metadata values are omitted", () => {
    const markdown = issueToMarkdown({
      ...base,
      closed_at: null,
      due_date: undefined,
      labels: [],
      assignees: [],
    });

    expect(markdown).not.toContain("closed at");
    expect(markdown).not.toContain("due date");
    expect(markdown).not.toContain("labels");
    expect(markdown).not.toContain("assignees");
  });

  test("milestone and human time stats are included when present", () => {
    const markdown = issueToMarkdown({
      ...base,
      milestone: { id: 3, title: "v1.0" },
      time_stats: {
        time_estimate: 3600,
        total_time_spent: 1800,
        human_time_estimate: "1h",
        human_total_time_spent: "30m",
      },
    });

    expect(markdown).toContain("- milestone: v1.0 (3)");
    expect(markdown).toContain("- time estimate: 1h");
    expect(markdown).toContain("- total time_spent: 30m");
    expect(markdown).not.toContain("3600");
  });

  test("discussions are rendered under an Activity heading", () => {
    const markdown = issueToMarkdown({
      ...base,
      discussions: [
        "bob at 2024-01-01T00:00:00Z:\nReproduced on main.",
        "alice at 2024-01-02T00:00:00Z:\nFix incoming.",
      ],
    });

    expect(markdown).toContain(
      "## Activity\n\nbob at 2024-01-01T00:00:00Z:\nReproduced on main.\n\nalice at 2024-01-02T00:00:00Z:\nFix incoming."
    );
  });
});
