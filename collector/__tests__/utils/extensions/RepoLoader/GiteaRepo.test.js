/* eslint-env jest, node */
process.env.STORAGE_DIR = "test-storage";

// The resync module pulls in the generic link scraper at require-time which is
// irrelevant (and expensive) for these tests.
jest.mock("../../../../processLink", () => ({
  getLinkText: jest.fn(),
}));

// Only `fetchGiteaFile` is stubbed so the resync handler can be exercised without
// hitting the loader a second time - `generateChunkSource` stays real because the
// encode -> decode round trip is exactly what we are asserting.
jest.mock("../../../../utils/extensions/RepoLoader/GiteaRepo", () => {
  const actual = jest.requireActual(
    "../../../../utils/extensions/RepoLoader/GiteaRepo"
  );
  return { ...actual, fetchGiteaFile: jest.fn() };
});

const GiteaRepoLoader = require("../../../../utils/extensions/RepoLoader/GiteaRepo/RepoLoader");
const {
  generateChunkSource,
  fetchGiteaFile,
} = require("../../../../utils/extensions/RepoLoader/GiteaRepo");
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

/**
 * Stands up a fake Gitea v1 API over `fetch` so no network access is required.
 */
function mockGiteaApi({
  branches = [{ name: "main" }],
  branchStatus = 200,
  tree = [],
  treeStatus = 200,
  truncated = false,
  files = {},
  defaultBranch = "main",
  repoStatus = 200,
  userStatus = 200,
} = {}) {
  return jest.spyOn(global, "fetch").mockImplementation(async (url) => {
    const { pathname, searchParams } = new URL(url);

    if (pathname === "/api/v1/user")
      return userStatus === 200
        ? jsonResponse({ login: "tester" })
        : errorResponse(userStatus, "Unauthorized");

    if (pathname.endsWith("/branches")) {
      if (branchStatus !== 200) return errorResponse(branchStatus);
      return jsonResponse(
        Number(searchParams.get("page")) === 1 ? branches : []
      );
    }

    if (pathname.includes("/git/trees/")) {
      if (treeStatus !== 200) return errorResponse(treeStatus);
      const page = Number(searchParams.get("page"));
      return jsonResponse({
        tree: page === 1 ? tree : [],
        truncated,
        total_count: tree.length,
      });
    }

    if (pathname.includes("/raw/")) {
      const filePath = decodeURIComponent(pathname.split("/raw/")[1]);
      if (!(filePath in files)) return errorResponse(404, "Not Found");
      return textResponse(files[filePath]);
    }

    // Repository metadata - `/api/v1/repos/{owner}/{project}`
    if (/^\/api\/v1\/repos\/[^/]+\/[^/]+$/.test(pathname)) {
      if (repoStatus !== 200) return errorResponse(repoStatus);
      return jsonResponse({ default_branch: defaultBranch });
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
  fetchGiteaFile.mockReset();
});

describe("GiteaRepoLoader url parsing", () => {
  test("derives apiBase, author, and project from a self-hosted url", async () => {
    mockGiteaApi();
    const loader = new GiteaRepoLoader({
      repo: "https://git.example.com/acme/widgets",
    });
    await loader.init();

    expect(loader.ready).toBe(true);
    expect(loader.apiBase).toBe("https://git.example.com");
    expect(loader.scheme).toBe("https");
    expect(loader.author).toBe("acme");
    expect(loader.project).toBe("widgets");
    expect(loader.repo).toBe("https://git.example.com/acme/widgets");
  });

  test("preserves a non-standard port and the http scheme in apiBase", async () => {
    const fetchMock = mockGiteaApi();
    const loader = new GiteaRepoLoader({
      repo: "http://git.example.com:3000/acme/widgets",
    });
    await loader.init();

    expect(loader.apiBase).toBe("http://git.example.com:3000");
    expect(loader.scheme).toBe("http");
    expect(loader.repo).toBe("http://git.example.com:3000/acme/widgets");
    expect(requestedUrls(fetchMock).length).toBeGreaterThan(0);
    requestedUrls(fetchMock).forEach((url) =>
      expect(url.startsWith("http://git.example.com:3000/api/v1/")).toBe(true)
    );
  });

  test("strips a .git suffix from the project name", async () => {
    mockGiteaApi();
    const loader = new GiteaRepoLoader({
      repo: "https://git.example.com/acme/widgets.git",
    });
    await loader.init();

    expect(loader.project).toBe("widgets");
    expect(loader.repo).toBe("https://git.example.com/acme/widgets");
  });

  test("ignores extra path segments beyond {author}/{project}", async () => {
    mockGiteaApi();
    const loader = new GiteaRepoLoader({
      repo: "https://git.example.com/acme/widgets/src/branch/main/README.md",
    });
    await loader.init();

    expect(loader.author).toBe("acme");
    expect(loader.project).toBe("widgets");
    expect(loader.repo).toBe("https://git.example.com/acme/widgets");
  });

  test("a malformed url leaves the loader un-ready and makes no api calls", async () => {
    const fetchMock = mockGiteaApi();
    const loader = new GiteaRepoLoader({ repo: "not-a-url" });
    await loader.init();

    expect(loader.ready).toBe(false);
    expect(loader.apiBase).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("a url without a project segment leaves the loader un-ready", async () => {
    const fetchMock = mockGiteaApi();
    const loader = new GiteaRepoLoader({
      repo: "https://git.example.com/acme",
    });
    await loader.init();

    expect(loader.ready).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("a non-http protocol leaves the loader un-ready", async () => {
    const fetchMock = mockGiteaApi();
    const loader = new GiteaRepoLoader({
      repo: "ssh://git.example.com/acme/widgets",
    });
    await loader.init();

    expect(loader.ready).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("GiteaRepoLoader branch resolution", () => {
  test("keeps an explicitly provided branch that exists and skips the metadata lookup", async () => {
    const fetchMock = mockGiteaApi({
      branches: [{ name: "main" }, { name: "develop" }],
    });
    const loader = new GiteaRepoLoader({
      repo: "https://git.example.com/acme/widgets",
      branch: "develop",
    });
    await loader.init();

    expect(loader.branch).toBe("develop");
    expect(requestedUrls(fetchMock)).not.toContain(
      "https://git.example.com/api/v1/repos/acme/widgets"
    );
  });

  test("auto-assigns the repository default branch when no branch is given", async () => {
    mockGiteaApi({
      branches: [{ name: "main" }, { name: "trunk" }],
      defaultBranch: "trunk",
    });
    const loader = new GiteaRepoLoader({
      repo: "https://git.example.com/acme/widgets",
    });
    await loader.init();

    expect(loader.branch).toBe("trunk");
  });

  test("auto-assigns when the provided branch does not exist on the remote", async () => {
    mockGiteaApi({
      branches: [{ name: "main" }],
      defaultBranch: "main",
    });
    const loader = new GiteaRepoLoader({
      repo: "https://git.example.com/acme/widgets",
      branch: "does-not-exist",
    });
    await loader.init();

    expect(loader.branch).toBe("main");
  });

  test("falls back to main when the repository metadata cannot be read", async () => {
    mockGiteaApi({
      branches: [{ name: "main" }, { name: "legacy" }],
      repoStatus: 404,
    });
    const loader = new GiteaRepoLoader({
      repo: "https://git.example.com/acme/widgets",
    });
    await loader.init();

    expect(loader.branch).toBe("main");
  });

  test("falls back to master when neither the metadata nor a main branch exist", async () => {
    mockGiteaApi({
      branches: [{ name: "master" }, { name: "legacy" }],
      repoStatus: 500,
    });
    const loader = new GiteaRepoLoader({
      repo: "https://git.example.com/acme/widgets",
    });
    await loader.init();

    expect(loader.branch).toBe("master");
  });

  test("getRepoBranches sorts main to the front and returns every branch", async () => {
    mockGiteaApi({
      branches: [{ name: "legacy" }, { name: "main" }, { name: "release" }],
    });
    const loader = new GiteaRepoLoader({
      repo: "https://git.example.com/acme/widgets",
    });
    const branches = await loader.getRepoBranches();

    expect(branches[0]).toBe("main");
    expect(branches.sort()).toEqual(["legacy", "main", "release"]);
  });
});

describe("GiteaRepoLoader authorization headers", () => {
  test("sends a Gitea token header on every request when a PAT is provided", async () => {
    const fetchMock = mockGiteaApi({
      tree: [{ type: "blob", path: "README.md" }],
      files: { "README.md": "# hello" },
    });
    const loader = new GiteaRepoLoader({
      repo: "https://git.example.com/acme/widgets",
      accessToken: "pat_abc123",
    });
    await loader.init();
    await loader.recursiveLoader();

    expect(requestedUrls(fetchMock)).toContain(
      "https://git.example.com/api/v1/user"
    );
    requestedHeaders(fetchMock).forEach((headers) =>
      expect(headers).toEqual({ Authorization: "token pat_abc123" })
    );
  });

  test("sends no authorization header and skips token validation without a PAT", async () => {
    const fetchMock = mockGiteaApi({
      tree: [{ type: "blob", path: "README.md" }],
      files: { "README.md": "# hello" },
    });
    const loader = new GiteaRepoLoader({
      repo: "https://git.example.com/acme/widgets",
    });
    await loader.init();
    await loader.recursiveLoader();

    expect(requestedUrls(fetchMock)).not.toContain(
      "https://git.example.com/api/v1/user"
    );
    requestedHeaders(fetchMock).forEach((headers) =>
      expect(headers).toEqual({})
    );
  });

  test("an access token rejected by the instance is dropped and not reused", async () => {
    const fetchMock = mockGiteaApi({ userStatus: 401 });
    const loader = new GiteaRepoLoader({
      repo: "https://git.example.com/acme/widgets",
      accessToken: "pat_expired",
    });
    await loader.init();

    expect(loader.accessToken).toBeNull();
    await loader.fetchSingleFile("README.md");
    const lastHeaders = requestedHeaders(fetchMock).pop();
    expect(lastHeaders).toEqual({});
  });
});

describe("GiteaRepoLoader file loading", () => {
  test("loads the content of every blob in the tree and builds a browsable url", async () => {
    mockGiteaApi({
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
    const loader = new GiteaRepoLoader({
      repo: "https://git.example.com/acme/widgets",
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
    ).toBe("https://git.example.com/acme/widgets/src/branch/main/README.md");
  });

  test("ignorePaths excludes matched files and never requests their contents", async () => {
    const fetchMock = mockGiteaApi({
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
    const loader = new GiteaRepoLoader({
      repo: "https://git.example.com/acme/widgets",
      branch: "main",
      ignorePaths: ["node_modules/**", "*.lock"],
    });
    await loader.init();
    const docs = await loader.recursiveLoader();

    expect(docs.map((doc) => doc.metadata.source)).toEqual(["README.md"]);
    const rawRequests = requestedUrls(fetchMock).filter((url) =>
      url.includes("/raw/")
    );
    expect(rawRequests).toHaveLength(1);
    expect(rawRequests[0]).toContain("/raw/README.md");
  });

  test("url-encodes path segments without escaping the separators", async () => {
    const fetchMock = mockGiteaApi({
      tree: [{ type: "blob", path: "docs/my notes.md" }],
      files: { "docs/my notes.md": "notes" },
    });
    const loader = new GiteaRepoLoader({
      repo: "https://git.example.com/acme/widgets",
      branch: "main",
    });
    await loader.init();
    const docs = await loader.recursiveLoader();

    expect(docs).toHaveLength(1);
    expect(requestedUrls(fetchMock)).toContain(
      "https://git.example.com/api/v1/repos/acme/widgets/raw/docs/my%20notes.md?ref=main"
    );
  });
});

describe("GiteaRepoLoader error handling", () => {
  test("a failing tree request yields no files instead of throwing", async () => {
    mockGiteaApi({ treeStatus: 500 });
    const loader = new GiteaRepoLoader({
      repo: "https://git.example.com/acme/widgets",
      branch: "main",
    });
    await loader.init();

    await expect(loader.fetchFilesRecursive()).resolves.toEqual([]);
    await expect(loader.recursiveLoader()).resolves.toEqual([]);
  });

  test("a failing branches request yields an empty branch list", async () => {
    mockGiteaApi({ branchStatus: 403 });
    const loader = new GiteaRepoLoader({
      repo: "https://git.example.com/acme/widgets",
    });

    await expect(loader.getRepoBranches()).resolves.toEqual([]);
  });

  test("a missing file resolves to null instead of throwing", async () => {
    mockGiteaApi({ files: { "README.md": "# widgets" } });
    const loader = new GiteaRepoLoader({
      repo: "https://git.example.com/acme/widgets",
      branch: "main",
    });
    await loader.init();

    await expect(
      loader.fetchSingleFile("does-not-exist.md")
    ).resolves.toBeNull();
  });

  test("a network level failure resolves to null instead of throwing", async () => {
    jest
      .spyOn(global, "fetch")
      .mockRejectedValue(new Error("ECONNREFUSED git.example.com"));
    const loader = new GiteaRepoLoader({
      repo: "https://git.example.com/acme/widgets",
      branch: "main",
    });
    jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(loader.fetchSingleFile("README.md")).resolves.toBeNull();
    await expect(loader.fetchJson("/repos/acme/widgets")).resolves.toBeNull();
  });

  test("recursiveLoader refuses to run before init", async () => {
    const loader = new GiteaRepoLoader({
      repo: "https://git.example.com/acme/widgets",
    });

    await expect(loader.recursiveLoader()).rejects.toThrow(
      "[Gitea Loader]: not in ready state!"
    );
  });
});

describe("Gitea chunkSource round trip", () => {
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

  test("a self-hosted repo url with a non-standard port survives encode then decode", async () => {
    mockGiteaApi({ branches: [{ name: "main" }] });
    const loader = new GiteaRepoLoader({
      repo: "http://git.example.com:3000/acme/widgets",
      branch: "main",
      accessToken: "pat_abc123",
    });
    await loader.init();

    const chunkSource = generateChunkSource(
      loader,
      { metadata: { source: "src/index.js" } },
      encryptionWorker
    );
    expect(chunkSource.startsWith("gitea://")).toBe(true);

    fetchGiteaFile.mockResolvedValue({
      success: true,
      reason: null,
      content: "console.log('hi');",
    });
    const { response, json } = mockResponse();
    await resyncHandlers.gitea({ chunkSource }, response);

    expect(fetchGiteaFile).toHaveBeenCalledWith({
      repoUrl: "http://git.example.com:3000/acme/widgets",
      branch: "main",
      accessToken: "pat_abc123",
      sourceFilePath: "src/index.js",
    });
    expect(json).toHaveBeenCalledWith({
      success: true,
      content: "console.log('hi');",
    });
  });

  test("an https instance on the default port round trips unchanged", async () => {
    mockGiteaApi({ branches: [{ name: "main" }] });
    const loader = new GiteaRepoLoader({
      repo: "https://git.example.com/acme/widgets",
      branch: "main",
    });
    await loader.init();

    const chunkSource = generateChunkSource(
      loader,
      { metadata: { source: "README.md" } },
      encryptionWorker
    );

    fetchGiteaFile.mockResolvedValue({
      success: true,
      reason: null,
      content: "# widgets",
    });
    const { response } = mockResponse();
    await resyncHandlers.gitea({ chunkSource }, response);

    expect(fetchGiteaFile).toHaveBeenCalledWith(
      expect.objectContaining({
        repoUrl: "https://git.example.com/acme/widgets",
        sourceFilePath: "README.md",
      })
    );
  });

  test("a failed file fetch reports an unsuccessful resync rather than throwing", async () => {
    mockGiteaApi({ branches: [{ name: "main" }] });
    const loader = new GiteaRepoLoader({
      repo: "http://git.example.com:3000/acme/widgets",
      branch: "main",
    });
    await loader.init();

    const chunkSource = generateChunkSource(
      loader,
      { metadata: { source: "README.md" } },
      encryptionWorker
    );

    jest.spyOn(console, "error").mockImplementation(() => {});
    fetchGiteaFile.mockResolvedValue({
      success: false,
      reason: "Target file returned a null content response.",
      content: null,
    });
    const { response, json } = mockResponse();
    await resyncHandlers.gitea({ chunkSource }, response);

    expect(json).toHaveBeenCalledWith({ success: false, content: null });
  });
});
