/* eslint-env jest, node */
const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");

process.env.STORAGE_DIR = fs.mkdtempSync(
  path.join(os.tmpdir(), "confluence-credentials-")
);

const {
  loadConfluence,
  fetchConfluencePage,
  generateChunkSource,
} = require("../../../../utils/extensions/Confluence");
const {
  confluence: resyncConfluence,
} = require("../../../../extensions/resync");
const { EncryptionWorker } = require("../../../../utils/EncryptionWorker");

const BASE_URL = "https://my.domain.com/confluence";
const PAGE_ID = "123";
const PAGE_URL = `${BASE_URL}/spaces/SP/pages/${PAGE_ID}`;
const PAGE_DOC = { metadata: { url: PAGE_URL } };

function newWorker() {
  return new EncryptionWorker(crypto.randomBytes(32).toString("base64"));
}

function page(body) {
  return {
    id: PAGE_ID,
    status: "current",
    title: "A page",
    type: "page",
    body: { storage: { value: `<p>${body}</p>` } },
    version: {
      number: 1,
      by: { displayName: "User" },
      when: "2026-01-01T00:00:00.000Z",
    },
  };
}

// fetchAllPagesInSpace pages until a response reports size 0, so a single page
// needs two responses.
function mockSpaceContaining(body) {
  let call = 0;
  return jest.spyOn(global, "fetch").mockImplementation(() => {
    const payload =
      call++ === 0
        ? { size: 1, results: [page(body)] }
        : { size: 0, results: [] };
    return Promise.resolve({ ok: true, json: () => Promise.resolve(payload) });
  });
}

function mockUnauthorized() {
  return jest
    .spyOn(global, "fetch")
    .mockResolvedValue({
      ok: false,
      status: 401,
      json: () => Promise.resolve({}),
    });
}

function authHeaderOf(fetchMock) {
  return fetchMock.mock.calls[0][1].headers.Authorization;
}

function responseStub() {
  const worker = newWorker();
  const sent = {};
  return {
    worker,
    sent,
    res: {
      locals: { encryptionWorker: worker },
      status() {
        return this;
      },
      json(payload) {
        Object.assign(sent, payload);
        return this;
      },
    },
  };
}

// Reads back the chunk source an import actually persisted, rather than
// building one by hand, so the credential has to survive every step.
function persistedChunkSource() {
  const root = path.resolve(process.env.STORAGE_DIR, "documents");
  const folder = fs
    .readdirSync(root)
    .map((name) => ({ name, at: fs.statSync(path.join(root, name)).mtimeMs }))
    .sort((a, b) => b.at - a.at)[0].name;
  const dir = path.join(root, folder);
  const file = fs.readdirSync(dir)[0];
  return JSON.parse(fs.readFileSync(path.join(dir, file), "utf8")).chunkSource;
}

afterEach(() => {
  jest.restoreAllMocks();
});

// An import and a re-sync are separated by an encrypted payload on disk. Both
// ends have to agree about which credential was used, so the only test that
// pins the whole thing is one that runs both.
describe("a space imported with a personal access token", () => {
  test("re-syncs with that token", async () => {
    const { worker, res } = responseStub();

    const importFetch = mockSpaceContaining("first version");
    const imported = await loadConfluence(
      {
        baseUrl: BASE_URL,
        spaceKey: "SP",
        personalAccessToken: "pat-123",
        cloud: false,
      },
      res
    );
    expect(imported.success).toBe(true);
    expect(authHeaderOf(importFetch)).toBe("Bearer pat-123");

    const chunkSource = persistedChunkSource();
    jest.restoreAllMocks();

    const resyncFetch = mockSpaceContaining("second version");
    const sync = responseStub();
    sync.res.locals.encryptionWorker = worker;
    await resyncConfluence({ chunkSource }, sync.res);

    expect(authHeaderOf(resyncFetch)).toBe("Bearer pat-123");
    expect(sync.sent.success).toBe(true);
    expect(sync.sent.content).toContain("second version");
  });

  test("does not fall back to a username and token that were never set", async () => {
    const { worker, res } = responseStub();

    mockSpaceContaining("first version");
    await loadConfluence(
      {
        baseUrl: BASE_URL,
        spaceKey: "SP",
        personalAccessToken: "pat-123",
        cloud: false,
      },
      res
    );

    const params = worker.expandPayload(persistedChunkSource()).searchParams;
    expect(params.get("personalAccessToken")).toBe("pat-123");
    // URLSearchParams writes an absent value as the string "null", which reads
    // back as a credential. Basic bnVsbDpudWxs decodes to null:null.
    expect(params.get("username")).toBeNull();
    expect(params.get("token")).toBeNull();
  });
});

describe("a space imported with a username and access token", () => {
  test("re-syncs with those", async () => {
    const { worker, res } = responseStub();

    const importFetch = mockSpaceContaining("first version");
    await loadConfluence(
      {
        baseUrl: BASE_URL,
        spaceKey: "SP",
        username: "user",
        accessToken: "api-token",
        cloud: false,
      },
      res
    );
    const expected = `Basic ${Buffer.from("user:api-token").toString(
      "base64"
    )}`;
    expect(authHeaderOf(importFetch)).toBe(expected);

    const chunkSource = persistedChunkSource();
    jest.restoreAllMocks();

    const resyncFetch = mockSpaceContaining("second version");
    const sync = responseStub();
    sync.res.locals.encryptionWorker = worker;
    await resyncConfluence({ chunkSource }, sync.res);

    expect(authHeaderOf(resyncFetch)).toBe(expected);
    expect(sync.sent.success).toBe(true);
    expect(sync.sent.content).toContain("second version");
  });

  test("stores those and no personal access token", () => {
    const worker = newWorker();
    const params = worker.expandPayload(
      generateChunkSource(
        {
          doc: PAGE_DOC,
          baseUrl: BASE_URL,
          spaceKey: "SP",
          accessToken: "api-token",
          username: "user",
          personalAccessToken: null,
          cloud: false,
          bypassSSL: false,
        },
        worker
      )
    ).searchParams;

    expect(params.get("username")).toBe("user");
    expect(params.get("token")).toBe("api-token");
    expect(params.get("personalAccessToken")).toBeNull();
  });
});

describe("chunk source metadata", () => {
  test.each([
    ["a personal access token", { personalAccessToken: "pat-123" }],
    ["a username and token", { username: "user", accessToken: "api-token" }],
  ])("survives %s", (_label, credential) => {
    const worker = newWorker();
    const params = worker.expandPayload(
      generateChunkSource(
        {
          doc: PAGE_DOC,
          baseUrl: BASE_URL,
          spaceKey: "SP",
          cloud: false,
          bypassSSL: false,
          ...credential,
        },
        worker
      )
    ).searchParams;

    expect(params.get("baseUrl")).toBe(BASE_URL);
    expect(params.get("spaceKey")).toBe("SP");
    expect(params.get("cloud")).toBe("false");
  });
});

describe("fetchConfluencePage credentials", () => {
  test("a personal access token alone is accepted", async () => {
    const fetchMock = mockSpaceContaining("content");

    const result = await fetchConfluencePage({
      pageUrl: PAGE_URL,
      baseUrl: BASE_URL,
      spaceKey: "SP",
      personalAccessToken: "pat-123",
      cloud: false,
    });

    expect(authHeaderOf(fetchMock)).toBe("Bearer pat-123");
    expect(result.success).toBe(true);
    expect(result.content).toContain("content");
  });

  test("no credential at all is refused without a request", async () => {
    const fetchMock = jest.spyOn(global, "fetch");

    const result = await fetchConfluencePage({
      pageUrl: PAGE_URL,
      baseUrl: BASE_URL,
      spaceKey: "SP",
      cloud: false,
    });

    expect(result.success).toBe(false);
    expect(result.reason).toMatch(/personal access token/i);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("a rejected credential reports no pages rather than the status", async () => {
    mockUnauthorized();

    const result = await fetchConfluencePage({
      pageUrl: PAGE_URL,
      baseUrl: BASE_URL,
      spaceKey: "SP",
      personalAccessToken: "pat-123",
      cloud: false,
    });

    expect(result.success).toBe(false);
    expect(result.reason).toBe("No pages found for that Confluence space.");
  });
});
