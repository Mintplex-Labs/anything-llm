/* eslint-env jest, node */
process.env.STORAGE_DIR = "test-storage";

// The resync module pulls in the generic link scraper at require-time.
jest.mock("../../../../processLink", () => ({
  getLinkText: jest.fn(),
}));

// Stubbed so the options the recursive loader is constructed with can be asserted.
jest.mock("@langchain/community/document_loaders/web/github", () => ({
  GithubRepoLoader: jest.fn().mockImplementation(() => ({
    load: jest.fn().mockResolvedValue([]),
  })),
}));

// Only `fetchGithubFile` is stubbed - `generateChunkSource` stays real for the round trip.
jest.mock("../../../../utils/extensions/RepoLoader/GithubRepo", () => {
  const actual = jest.requireActual(
    "../../../../utils/extensions/RepoLoader/GithubRepo"
  );
  return { ...actual, fetchGithubFile: jest.fn() };
});

const GitHubRepoLoader = require("../../../../utils/extensions/RepoLoader/GithubRepo/RepoLoader");
const {
  GithubRepoLoader: LCGithubLoader,
} = require("@langchain/community/document_loaders/web/github");
const {
  generateChunkSource,
  fetchGithubFile,
} = require("../../../../utils/extensions/RepoLoader/GithubRepo");
const { EncryptionWorker } = require("../../../../utils/EncryptionWorker");
const resyncHandlers = require("../../../../extensions/resync");

const jsonResponse = (body) => ({
  ok: true,
  status: 200,
  statusText: "OK",
  headers: { get: () => null },
  json: async () => body,
});

const errorResponse = (status, statusText = "Error") => ({
  ok: false,
  status,
  statusText,
  headers: { get: () => null },
  json: async () => ({}),
});

/**
 * Stands up a fake GitHub REST v3 API over `fetch` so no network access is required.
 * The handlers key off the endpoint path only - never the host.
 */
function mockGithubApi({
  branches = [{ name: "main" }],
  branchStatus = 200,
  files = {},
  octocatStatus = 200,
} = {}) {
  return jest.spyOn(global, "fetch").mockImplementation(async (url) => {
    const { pathname, searchParams } = new URL(url);
    const endpoint = pathname.replace(/^\/api\/v3/, "");

    if (endpoint === "/octocat")
      return octocatStatus === 200
        ? jsonResponse({})
        : errorResponse(octocatStatus, "Unauthorized");

    if (endpoint.endsWith("/branches")) {
      if (branchStatus !== 200) return errorResponse(branchStatus);
      return jsonResponse(
        Number(searchParams.get("page")) === 0 ? branches : []
      );
    }

    const contents = endpoint.match(/\/repos\/[^/]+\/[^/]+\/contents\/(.+)$/);
    if (contents) {
      const filePath = decodeURIComponent(contents[1]);
      if (!(filePath in files)) return errorResponse(404, "Not Found");
      return jsonResponse({
        content: Buffer.from(files[filePath]).toString("base64"),
      });
    }

    return errorResponse(404, "Not Found");
  });
}

/** Every URL `fetch` was called with during a test. */
const requestedUrls = (fetchMock) => fetchMock.mock.calls.map(([url]) => url);

afterEach(() => {
  jest.restoreAllMocks();
  LCGithubLoader.mockClear();
  fetchGithubFile.mockReset();
});

describe("GitHubRepoLoader apiBase resolution", () => {
  test("a public github.com url still resolves to the public api root", async () => {
    mockGithubApi();
    const loader = new GitHubRepoLoader({
      repo: "https://github.com/Mintplex-Labs/anything-llm",
    });
    await loader.init();

    expect(loader.ready).toBe(true);
    expect(loader.apiBase).toBe("https://api.github.com");
    expect(loader.author).toBe("Mintplex-Labs");
    expect(loader.project).toBe("anything-llm");
  });

  test("the www. alias of github.com is not mistaken for an enterprise host", async () => {
    mockGithubApi();
    const loader = new GitHubRepoLoader({
      repo: "https://www.github.com/org/repo",
    });
    await loader.init();

    expect(loader.apiBase).toBe("https://api.github.com");
  });

  test("a GitHub Enterprise Server host resolves to the /api/v3 root", async () => {
    mockGithubApi();
    const loader = new GitHubRepoLoader({
      repo: "https://github.mycompany.com/org/repo",
    });
    await loader.init();

    expect(loader.ready).toBe(true);
    expect(loader.apiBase).toBe("https://github.mycompany.com/api/v3");
    expect(loader.author).toBe("org");
    expect(loader.project).toBe("repo");
  });

  test("an Enterprise Server host keeps its port and http scheme", async () => {
    mockGithubApi();
    const loader = new GitHubRepoLoader({
      repo: "http://github.mycompany.com:8443/org/repo",
    });
    await loader.init();

    expect(loader.apiBase).toBe("http://github.mycompany.com:8443/api/v3");
    expect(loader.author).toBe("org");
    expect(loader.project).toBe("repo");
  });

  test("a GHE.com data residency url resolves to its dedicated api subdomain", async () => {
    mockGithubApi();
    const loader = new GitHubRepoLoader({
      repo: "https://octocorp.ghe.com/org/repo",
    });
    await loader.init();

    expect(loader.apiBase).toBe("https://api.octocorp.ghe.com");
    expect(loader.author).toBe("org");
    expect(loader.project).toBe("repo");
  });

  test("an api.* host is already an api root and is never suffixed with /api/v3", async () => {
    mockGithubApi();
    const loader = new GitHubRepoLoader({
      repo: "https://api.octocorp.ghe.com/org/repo",
    });
    await loader.init();

    expect(loader.apiBase).toBe("https://api.octocorp.ghe.com");
  });

  test("a trailing slash does not produce a doubled separator or an empty project", async () => {
    mockGithubApi();
    const loader = new GitHubRepoLoader({
      repo: "https://github.mycompany.com/org/repo/",
    });
    await loader.init();

    expect(loader.apiBase).toBe("https://github.mycompany.com/api/v3");
    expect(loader.author).toBe("org");
    expect(loader.project).toBe("repo");
  });

  test("extra path segments beyond {author}/{project} are ignored when parsing", async () => {
    mockGithubApi();
    const loader = new GitHubRepoLoader({
      repo: "https://github.mycompany.com/org/repo/tree/main/src",
    });
    await loader.init();

    expect(loader.apiBase).toBe("https://github.mycompany.com/api/v3");
    expect(loader.author).toBe("org");
    expect(loader.project).toBe("repo");
  });

  test("a .git suffix is stripped from an Enterprise Server url", async () => {
    mockGithubApi();
    const loader = new GitHubRepoLoader({
      repo: "https://github.mycompany.com/org/repo.git",
    });
    await loader.init();

    expect(loader.project).toBe("repo");
    expect(loader.apiBase).toBe("https://github.mycompany.com/api/v3");
  });
});

describe("GitHubRepoLoader url rejection", () => {
  test("a url without a project segment leaves the loader un-ready", async () => {
    const fetchMock = mockGithubApi();
    const loader = new GitHubRepoLoader({
      repo: "https://github.mycompany.com/org",
    });
    await loader.init();

    expect(loader.ready).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("a non-http protocol leaves the loader un-ready", async () => {
    const fetchMock = mockGithubApi();
    const loader = new GitHubRepoLoader({
      repo: "ssh://github.mycompany.com/org/repo",
    });
    await loader.init();

    expect(loader.ready).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("a malformed url leaves the loader un-ready and makes no api calls", async () => {
    const fetchMock = mockGithubApi();
    const loader = new GitHubRepoLoader({ repo: "not-a-url" });
    await loader.init();

    expect(loader.ready).toBe(false);
    expect(loader.apiBase).toBe("https://api.github.com");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("GitHubRepoLoader request urls", () => {
  test("github.com requests are byte for byte what they were before", async () => {
    const fetchMock = mockGithubApi({ files: { "README.md": "# hello" } });
    const loader = new GitHubRepoLoader({
      repo: "https://github.com/org/repo",
      branch: "main",
      accessToken: "ghp_token",
    });
    await loader.init();
    await loader.fetchSingleFile("README.md");

    expect(requestedUrls(fetchMock)).toContain("https://api.github.com/octocat");
    expect(requestedUrls(fetchMock)).toContain(
      "https://api.github.com/repos/org/repo/branches?per_page=100&page=0"
    );
    expect(requestedUrls(fetchMock)).toContain(
      "https://api.github.com/repos/org/repo/contents/README.md?ref=main"
    );
  });

  test("an Enterprise Server host uses the same endpoint paths under /api/v3", async () => {
    const fetchMock = mockGithubApi({ files: { "README.md": "# hello" } });
    const loader = new GitHubRepoLoader({
      repo: "https://github.mycompany.com/org/repo",
      branch: "main",
      accessToken: "ghp_token",
    });
    await loader.init();
    await loader.fetchSingleFile("README.md");

    expect(requestedUrls(fetchMock)).toContain(
      "https://github.mycompany.com/api/v3/octocat"
    );
    expect(requestedUrls(fetchMock)).toContain(
      "https://github.mycompany.com/api/v3/repos/org/repo/branches?per_page=100&page=0"
    );
    expect(requestedUrls(fetchMock)).toContain(
      "https://github.mycompany.com/api/v3/repos/org/repo/contents/README.md?ref=main"
    );
  });

  test("a GHE.com host uses the same endpoint paths under its api subdomain", async () => {
    const fetchMock = mockGithubApi({ files: { "README.md": "# hello" } });
    const loader = new GitHubRepoLoader({
      repo: "https://octocorp.ghe.com/org/repo",
      branch: "main",
    });
    await loader.init();
    await loader.fetchSingleFile("README.md");

    expect(requestedUrls(fetchMock)).toContain(
      "https://api.octocorp.ghe.com/repos/org/repo/branches?per_page=100&page=0"
    );
    expect(requestedUrls(fetchMock)).toContain(
      "https://api.octocorp.ghe.com/repos/org/repo/contents/README.md?ref=main"
    );
  });

  test("getRepoBranches targets the enterprise host without a prior init call", async () => {
    const fetchMock = mockGithubApi({
      branches: [{ name: "legacy" }, { name: "main" }],
    });
    const loader = new GitHubRepoLoader({
      repo: "https://github.mycompany.com/org/repo",
    });
    const branches = await loader.getRepoBranches();

    expect(branches[0]).toBe("main");
    expect(branches.sort()).toEqual(["legacy", "main"]);
    requestedUrls(fetchMock).forEach((url) =>
      expect(url.startsWith("https://github.mycompany.com/api/v3/")).toBe(true)
    );
  });

  test("a file fetched from an enterprise host is decoded from the api response", async () => {
    mockGithubApi({ files: { "src/index.js": "console.log('hi');" } });
    const loader = new GitHubRepoLoader({
      repo: "https://github.mycompany.com/org/repo",
      branch: "main",
    });
    await loader.init();

    await expect(loader.fetchSingleFile("src/index.js")).resolves.toBe(
      "console.log('hi');"
    );
  });
});

describe("GitHubRepoLoader recursive loader options", () => {
  test("github.com keeps the upstream loader on its default hosts", async () => {
    mockGithubApi();
    const loader = new GitHubRepoLoader({
      repo: "https://github.com/org/repo",
      branch: "main",
    });
    await loader.init();
    await loader.recursiveLoader();

    const [repoUrl, options] = LCGithubLoader.mock.calls[0];
    expect(repoUrl).toBe("https://github.com/org/repo");
    expect(options.baseUrl).toBe("https://github.com");
    expect(options.apiUrl).toBe("https://api.github.com");
  });

  test("an Enterprise Server repo points the upstream loader at its own hosts", async () => {
    mockGithubApi();
    const loader = new GitHubRepoLoader({
      repo: "https://github.mycompany.com/org/repo",
      branch: "main",
    });
    await loader.init();
    await loader.recursiveLoader();

    const [repoUrl, options] = LCGithubLoader.mock.calls[0];
    expect(repoUrl).toBe("https://github.mycompany.com/org/repo");
    expect(options.baseUrl).toBe("https://github.mycompany.com");
    expect(options.apiUrl).toBe("https://github.mycompany.com/api/v3");
  });

  test("a GHE.com repo separates its browse host from its api host", async () => {
    mockGithubApi();
    const loader = new GitHubRepoLoader({
      repo: "https://octocorp.ghe.com/org/repo",
      branch: "main",
    });
    await loader.init();
    await loader.recursiveLoader();

    const [, options] = LCGithubLoader.mock.calls[0];
    expect(options.baseUrl).toBe("https://octocorp.ghe.com");
    expect(options.apiUrl).toBe("https://api.octocorp.ghe.com");
  });

  test("recursiveLoader refuses to run before init", async () => {
    const loader = new GitHubRepoLoader({
      repo: "https://github.mycompany.com/org/repo",
    });

    await expect(loader.recursiveLoader()).rejects.toThrow(
      "[GitHub Loader]: not in ready state!"
    );
  });
});

describe("GitHubRepoLoader access token validation", () => {
  test("a token rejected by an enterprise instance is dropped and the loader stays ready", async () => {
    mockGithubApi({ octocatStatus: 401 });
    jest.spyOn(console, "error").mockImplementation(() => {});
    const loader = new GitHubRepoLoader({
      repo: "https://github.mycompany.com/org/repo",
      accessToken: "ghp_expired",
    });
    await loader.init();

    expect(loader.ready).toBe(true);
    expect(loader.accessToken).toBeNull();
  });

  test("no token means no validation request is made at all", async () => {
    const fetchMock = mockGithubApi();
    const loader = new GitHubRepoLoader({
      repo: "https://github.mycompany.com/org/repo",
    });
    await loader.init();

    expect(requestedUrls(fetchMock)).not.toContain(
      "https://github.mycompany.com/api/v3/octocat"
    );
  });
});

describe("GitHub chunkSource round trip", () => {
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

  test("an enterprise host survives encode then decode so resync stays on it", async () => {
    mockGithubApi();
    const loader = new GitHubRepoLoader({
      repo: "https://github.mycompany.com/org/repo",
      branch: "main",
      accessToken: "ghp_token",
    });
    await loader.init();

    const chunkSource = generateChunkSource(
      loader,
      { metadata: { source: "src/index.js" } },
      encryptionWorker
    );
    expect(chunkSource.startsWith("github://")).toBe(true);

    fetchGithubFile.mockResolvedValue({
      success: true,
      reason: null,
      content: "console.log('hi');",
    });
    const { response, json } = mockResponse();
    await resyncHandlers.github({ chunkSource }, response);

    expect(fetchGithubFile).toHaveBeenCalledWith({
      repoUrl: "https://github.mycompany.com/org/repo",
      branch: "main",
      accessToken: "ghp_token",
      sourceFilePath: "src/index.js",
    });
    expect(json).toHaveBeenCalledWith({
      success: true,
      content: "console.log('hi');",
    });
  });

  test("an http enterprise host keeps its scheme and port through a resync", async () => {
    mockGithubApi();
    const loader = new GitHubRepoLoader({
      repo: "http://github.mycompany.com:8443/org/repo",
      branch: "main",
    });
    await loader.init();

    const chunkSource = generateChunkSource(
      loader,
      { metadata: { source: "src/index.js" } },
      encryptionWorker
    );

    fetchGithubFile.mockResolvedValue({
      success: true,
      reason: null,
      content: "console.log('hi');",
    });
    const { response } = mockResponse();
    await resyncHandlers.github({ chunkSource }, response);

    expect(fetchGithubFile).toHaveBeenCalledWith(
      expect.objectContaining({
        repoUrl: "http://github.mycompany.com:8443/org/repo",
      })
    );
  });

  test("a chunkSource stored before the protocol was recorded still resyncs over https", async () => {
    const legacy = `github://https://github.com/org/repo?payload=${encryptionWorker.encrypt(
      JSON.stringify({
        owner: "org",
        project: "repo",
        branch: "main",
        path: "README.md",
        pat: null,
      })
    )}`;

    fetchGithubFile.mockResolvedValue({
      success: true,
      reason: null,
      content: "# hello",
    });
    const { response } = mockResponse();
    await resyncHandlers.github({ chunkSource: legacy }, response);

    expect(fetchGithubFile).toHaveBeenCalledWith(
      expect.objectContaining({ repoUrl: "https://github.com/org/repo" })
    );
  });

  test("a public github.com repo round trips unchanged", async () => {
    mockGithubApi();
    const loader = new GitHubRepoLoader({
      repo: "https://github.com/org/repo",
      branch: "main",
    });
    await loader.init();

    const chunkSource = generateChunkSource(
      loader,
      { metadata: { source: "README.md" } },
      encryptionWorker
    );

    fetchGithubFile.mockResolvedValue({
      success: true,
      reason: null,
      content: "# hello",
    });
    const { response } = mockResponse();
    await resyncHandlers.github({ chunkSource }, response);

    expect(fetchGithubFile).toHaveBeenCalledWith(
      expect.objectContaining({
        repoUrl: "https://github.com/org/repo",
        sourceFilePath: "README.md",
      })
    );
  });
});
