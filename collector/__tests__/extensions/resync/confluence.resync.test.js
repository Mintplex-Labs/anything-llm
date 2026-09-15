/* eslint-env jest, node */
process.env.STORAGE_DIR = "test-storage"; // needed for tests to run

// The resync module pulls in the generic link scraper at require-time which is
// irrelevant (and expensive - puppeteer) for these tests.
jest.mock("../../../processLink", () => ({ getLinkText: jest.fn() }));

const { EncryptionWorker } = require("../../../utils/EncryptionWorker");
const resyncHandlers = require("../../../extensions/resync");

const encryptionWorker = new EncryptionWorker(
  Buffer.alloc(32, 7).toString("base64")
);
const handler = resyncHandlers.confluence;
const USERNAME = "svc@example.com";
const ACCESS_TOKEN = "confluence_tok_abc123";

/**
 * Mirrors `generateChunkSource` in collector/utils/extensions/Confluence/index.js
 * which is intentionally not exported. The page url is embedded verbatim and the
 * credentials are encrypted into a single payload param, so the encode -> decode
 * round trip is exactly what these tests guard.
 */
function buildChunkSource({
  baseUrl,
  spaceKey = "SPACE",
  pageId = "123",
  cloud = false,
  includeBaseUrl = true,
  pageOrigin = null,
}) {
  const pageUrl = `${pageOrigin ?? baseUrl}${
    cloud ? "/wiki" : ""
  }/spaces/${spaceKey}/pages/${pageId}`;
  const payload = encryptionWorker.encrypt(
    JSON.stringify({
      ...(includeBaseUrl ? { baseUrl } : {}),
      spaceKey,
      token: ACCESS_TOKEN,
      username: USERNAME,
      cloud,
      bypassSSL: false,
    })
  );
  return `confluence://${pageUrl}?payload=${payload}`;
}

/** Express-ish response with the real encryption worker attached. */
function buildResponse() {
  const json = jest.fn();
  const response = {
    locals: { encryptionWorker },
    json,
    status: jest.fn().mockReturnThis(),
  };
  return { response, json };
}

/** One page in the shape `createDocumentFromPage` reads. */
function page({ id = "123", title = "Runbook", body = "Page body text" } = {}) {
  return {
    id,
    status: "current",
    title,
    type: "page",
    body: { storage: { value: `<p>${body}</p>` } },
    version: { number: 1, by: { displayName: "Someone" }, when: "2026-01-01" },
  };
}

/**
 * The loader pages until it sees size 0, so every mock answers the first call
 * with the pages and the second with an empty page.
 */
function mockSpace(pages) {
  let call = 0;
  return jest.spyOn(global, "fetch").mockImplementation(async () => ({
    ok: true,
    status: 200,
    json: async () =>
      call++ === 0
        ? { size: pages.length, results: pages }
        : { size: 0, results: [] },
  }));
}

let fetchMock;

afterEach(() => {
  fetchMock?.mockRestore();
  jest.clearAllMocks();
});

describe("resyncConfluence", () => {
  it("keeps the http scheme and port of a self-hosted instance", async () => {
    fetchMock = mockSpace([page({ body: "self hosted body" })]);
    const { response, json } = buildResponse();

    await handler(
      { chunkSource: buildChunkSource({ baseUrl: "http://wiki.local:8090" }) },
      response
    );

    expect(json).toHaveBeenCalledWith({
      success: true,
      content: "self hosted body",
    });
    expect(fetchMock.mock.calls[0][0]).toContain("http://wiki.local:8090/");
  });

  it("keeps a self-hosted context path", async () => {
    fetchMock = mockSpace([page({ body: "context path body" })]);
    const { response, json } = buildResponse();

    await handler(
      {
        chunkSource: buildChunkSource({
          baseUrl: "http://wiki.local:8090/confluence",
        }),
      },
      response
    );

    expect(json).toHaveBeenCalledWith({
      success: true,
      content: "context path body",
    });
  });

  it("still resolves an https cloud instance", async () => {
    fetchMock = mockSpace([page({ body: "cloud body" })]);
    const { response, json } = buildResponse();

    await handler(
      {
        chunkSource: buildChunkSource({
          baseUrl: "https://acme.atlassian.net",
          cloud: true,
        }),
      },
      response
    );

    expect(json).toHaveBeenCalledWith({ success: true, content: "cloud body" });
  });

  it("fails cleanly when the payload carries no baseUrl", async () => {
    // A payload with no baseUrl is handled by the connector's own credential
    // guard, which runs before any request. This pins that an unreadable baseUrl
    // does not throw out of the scheme lookup and does not reach the network.
    fetchMock = mockSpace([page()]);
    const { response, json } = buildResponse();

    await handler(
      {
        chunkSource: buildChunkSource({
          baseUrl: "https://acme.atlassian.net",
          cloud: true,
          includeBaseUrl: false,
        }),
      },
      response
    );

    expect(json).toHaveBeenCalledWith({ success: false, content: null });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("does not match a page whose path matches on another host", async () => {
    // The space really does return a page, and its path is the one being asked
    // for. Only the host differs, so a comparison that looked at the pathname
    // alone would accept this page and return its body.
    fetchMock = mockSpace([page({ body: "someone else's runbook" })]);
    const { response, json } = buildResponse();

    await handler(
      {
        chunkSource: buildChunkSource({
          baseUrl: "http://wiki.local:8090",
          pageOrigin: "http://other.host:8090",
        }),
      },
      response
    );

    expect(json).toHaveBeenCalledWith({ success: false, content: null });
  });

  it("does not match a page whose path matches on another port", async () => {
    fetchMock = mockSpace([page({ body: "other port body" })]);
    const { response, json } = buildResponse();

    await handler(
      {
        chunkSource: buildChunkSource({
          baseUrl: "http://wiki.local:8090",
          pageOrigin: "http://wiki.local:9090",
        }),
      },
      response
    );

    expect(json).toHaveBeenCalledWith({ success: false, content: null });
  });
});
