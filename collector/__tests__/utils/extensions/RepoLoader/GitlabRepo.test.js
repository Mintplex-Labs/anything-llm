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
} = require("../../../../utils/extensions/RepoLoader/GitlabRepo");
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
 * Stands up a fake GitLab REST v4 API over `fetch` so no network access is required.
 * The handlers key off the endpoint path only - never the host.
 */
function mockGitlabApi({
  branches = [{ name: "main" }],
  branchStatus = 200,
  tree = [],
  files = {},
  userStatus = 200,
} = {}) {
  return jest.spyOn(global, "fetch").mockImplementation(async (url) => {
    const { pathname, searchParams } = new URL(url);
    const firstPage = Number(searchParams.get("page")) === 1;

    if (pathname === "/api/v4/user")
      return userStatus === 200
        ? jsonResponse({ username: "tester" })
        : errorResponse(userStatus, "Unauthorized");

    if (pathname.endsWith("/repository/branches")) {
      if (branchStatus !== 200) return errorResponse(branchStatus);
      return jsonResponse(firstPage ? branches : []);
    }

    if (pathname.endsWith("/repository/tree"))
      return jsonResponse(firstPage ? tree : []);

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
