/* eslint-env jest, node */

// The resync module pulls in the generic link scraper at require-time which is
// irrelevant (and expensive - puppeteer) for these tests.
jest.mock("../../../processLink", () => ({ getLinkText: jest.fn() }));

const { EncryptionWorker } = require("../../../utils/EncryptionWorker");
const resyncHandlers = require("../../../extensions/resync");

const encryptionWorker = new EncryptionWorker(
  Buffer.alloc(32, 7).toString("base64")
);
const handler = resyncHandlers["paperless-ngx"];
const API_TOKEN = "paperless_tok_abc123";

/**
 * Mirrors `generateChunkSource` in collector/utils/extensions/PaperlessNgx/index.js
 * which is intentionally not exported - the encode -> decode round trip is what
 * these tests are guarding, so the format has to be reproduced exactly.
 */
function buildChunkSource({ id = "123", baseUrl, apiToken = API_TOKEN }) {
  const payload = encryptionWorker.encrypt(
    JSON.stringify({ baseUrl, token: apiToken })
  );
  return `paperless-ngx://${id}?payload=${payload}`;
}

/** Express-ish response with the real encryption worker attached. */
function buildResponse() {
  const json = jest.fn();
  const response = {
    locals: { encryptionWorker },
    json,
    status: jest.fn().mockReturnThis(),
  };
  const status = response.status;
  return { response, json, status };
}

function fakeFetchResponse({
  ok = true,
  status = 200,
  contentType = "text/plain",
  body = "",
} = {}) {
  return {
    ok,
    status,
    headers: { get: () => contentType },
    text: async () => body,
    arrayBuffer: async () => new ArrayBuffer(0),
  };
}

let fetchMock;

beforeEach(() => {
  fetchMock = jest
    .spyOn(global, "fetch")
    .mockResolvedValue(fakeFetchResponse({ body: "" }));
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("resyncPaperlessNgx", () => {
  test("round trips a bare origin base url and downloads the document by id", async () => {
    fetchMock.mockResolvedValue(
      fakeFetchResponse({ body: "re-synced document body" })
    );
    const chunkSource = buildChunkSource({
      id: "123",
      baseUrl: "https://paperless.example.com",
    });
    const { response, json, status } = buildResponse();

    await handler({ chunkSource }, response);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://paperless.example.com/api/documents/123/download/",
      { headers: { Authorization: `Token ${API_TOKEN}` } }
    );
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({
      success: true,
      content: "re-synced document body",
    });
  });

  test("preserves a context path and collapses the trailing slash", async () => {
    fetchMock.mockResolvedValue(fakeFetchResponse({ body: "context content" }));
    const chunkSource = buildChunkSource({
      id: "123",
      baseUrl: "https://my.domain.com/paperless/",
    });
    const { response, json } = buildResponse();

    await handler({ chunkSource }, response);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://my.domain.com/paperless/api/documents/123/download/",
      { headers: { Authorization: `Token ${API_TOKEN}` } }
    );
    expect(json).toHaveBeenCalledWith({
      success: true,
      content: "context content",
    });
  });

  test("a missing chunkSource rejects before any response is written", async () => {
    const { response, json } = buildResponse();

    await expect(handler({ chunkSource: undefined }, response)).rejects.toThrow(
      "Invalid source property provided"
    );
    expect(json).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("an undecryptable payload fails the resync without contacting the instance", async () => {
    // expandPayload swallows the decrypt failure, so baseUrl/token come back null
    // and the loader constructor throws on `new URL(null)`.
    const chunkSource = "paperless-ngx://123?payload=not-a-real-cipher";
    const { response, json } = buildResponse();

    await handler({ chunkSource }, response);

    expect(json).toHaveBeenCalledWith({ success: false, content: null });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("a 404 from the download endpoint yields empty content and an unsuccessful resync", async () => {
    fetchMock.mockResolvedValue(
      fakeFetchResponse({ ok: false, status: 404, body: "" })
    );
    const chunkSource = buildChunkSource({
      id: "123",
      baseUrl: "https://paperless.example.com",
    });
    const { response, json, status } = buildResponse();

    await handler({ chunkSource }, response);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ success: false, content: null });
  });

  test("a network level failure is reported as an unsuccessful resync", async () => {
    fetchMock.mockRejectedValue(
      new Error("ECONNREFUSED paperless.example.com")
    );
    const chunkSource = buildChunkSource({
      id: "123",
      baseUrl: "https://paperless.example.com",
    });
    const { response, json } = buildResponse();

    await handler({ chunkSource }, response);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(json).toHaveBeenCalledWith({ success: false, content: null });
  });

  test("an empty document id is not guarded and still requests a malformed download url", async () => {
    // Real behavior: `source.host` is "" so the id is never validated - the loader
    // requests /api/documents//download/ and only fails once the instance 404s.
    fetchMock.mockResolvedValue(
      fakeFetchResponse({ ok: false, status: 404, body: "" })
    );
    const chunkSource = buildChunkSource({
      id: "",
      baseUrl: "https://paperless.example.com",
    });
    const { response, json } = buildResponse();

    await handler({ chunkSource }, response);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://paperless.example.com/api/documents//download/",
      { headers: { Authorization: `Token ${API_TOKEN}` } }
    );
    expect(json).toHaveBeenCalledWith({ success: false, content: null });
  });
});
