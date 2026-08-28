/* eslint-env jest, node */

/**
 * Regression test for the DMR model-download SSE re-framing.
 *
 * The endpoint reads a newline-delimited event stream from the Docker Model
 * Runner and forwards `progress`/`success`/`error` frames to the browser.
 * The bytes arrive in arbitrary network chunks, so a single logical frame can
 * straddle a chunk boundary. Decoding each chunk in isolation
 * (`new TextDecoder("utf-8").decode(value)`) and splitting on "\n" with no
 * cross-chunk buffer drops any frame whose bytes are split across two reads —
 * including the terminal `success` frame, which then never reaches the UI.
 *
 * These tests feed a stream whose terminal `success` frame (and a multi-byte
 * `progress` message) are deliberately split at a UTF-8 continuation byte,
 * mid-line, and assert the endpoint still forwards them intact.
 */

jest.mock("../../../utils/middleware/validatedRequest", () => ({
  validatedRequest: (_req, _res, next) => next(),
}));
jest.mock("../../../utils/middleware/multiUserProtected", () => ({
  flexUserRoleValid: () => (_req, _res, next) => next(),
  ROLES: { admin: "admin" },
}));
jest.mock("../../../utils/AiProviders/dockerModelRunner", () => ({
  parseDockerModelRunnerEndpoint: () => "http://127.0.0.1:12434",
}));

const {
  dockerModelRunnerUtilsEndpoints,
} = require("../../../endpoints/utils/dockerModelRunnerUtils");

/** Minimal Express-like app that records the POST handler. */
function makeApp() {
  const routes = {};
  return {
    routes,
    post(path, _middleware, handler) {
      routes[path] = handler;
    },
  };
}

/** A reader that yields the given Uint8Array chunks, like body.getReader(). */
function readerFrom(chunks) {
  let i = 0;
  return {
    read: async () =>
      i < chunks.length
        ? { value: chunks[i++], done: false }
        : { value: undefined, done: true },
  };
}

/** Split a UTF-8 payload into two chunks at the given byte offset. */
function splitAt(str, byteOffset) {
  const full = new TextEncoder().encode(str);
  return [
    new Uint8Array(full.subarray(0, byteOffset)),
    new Uint8Array(full.subarray(byteOffset)),
  ];
}

function makeResponse() {
  return {
    headers: null,
    chunks: [],
    ended: false,
    writeHead(_status, headers) {
      this.headers = headers;
    },
    write(chunk) {
      this.chunks.push(chunk);
    },
    end() {
      this.ended = true;
    },
    get output() {
      return this.chunks.join("");
    },
  };
}

async function runDownload(streamText, byteSplit) {
  const app = makeApp();
  dockerModelRunnerUtilsEndpoints(app);
  const handler = app.routes["/utils/dmr/download-model"];

  const chunks = splitAt(streamText, byteSplit);
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    statusText: "OK",
    body: { getReader: () => readerFrom(chunks) },
  });

  const request = { body: { modelId: "ai/smollm2", basePath: "" } };
  const response = makeResponse();
  await handler(request, response);
  return response;
}

describe("dockerModelRunnerUtilsEndpoints - SSE frame reassembly", () => {
  afterEach(() => jest.restoreAllMocks());

  test("forwards the terminal success frame even when it straddles a chunk boundary", async () => {
    const stream =
      `${JSON.stringify({ type: "progress", pulled: 50, total: 100 })}\n` +
      `${JSON.stringify({ type: "success" })}\n`;

    // Split inside the token `"success"` -> the terminal frame spans two reads.
    const byteSplit = new TextEncoder().encode(stream).indexOf(
      // first byte of `success` value
      new TextEncoder().encode("success")[0],
      stream.indexOf('"success"')
    );

    const response = await runDownload(stream, byteSplit);

    expect(response.ended).toBe(true);
    // The success control frame must be forwarded to the browser.
    expect(response.output).toContain('"type":"success"');
    expect(response.output).toContain('"percentage":100');
  });

  test("does not corrupt a multi-byte progress message split across chunks", async () => {
    const message = "Descargando ✅";
    const stream =
      `${JSON.stringify({ type: "progress", pulled: 25, total: 100, message })}\n` +
      `${JSON.stringify({ type: "success" })}\n`;

    // Split inside the 3-byte "✅" of the progress line.
    const bytes = new TextEncoder().encode(stream);
    const emojiStart = bytes.indexOf(0xe2); // ✅ = E2 9C 85
    const response = await runDownload(stream, emojiStart + 1);

    // The multi-byte character must survive re-framing, uncorrupted.
    expect(response.output).toContain(message);
    expect(response.output).not.toContain("�"); // no replacement chars
    expect(response.output).toContain('"type":"success"');
  });
});
