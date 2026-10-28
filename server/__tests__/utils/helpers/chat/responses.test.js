/* eslint-env jest, node */
const { EventEmitter } = require("events");
const {
  handleDefaultStreamResponseV2,
} = require("../../../../utils/helpers/chat/responses");

// Minimal stand-in for the express response the stream handler writes SSE chunks to.
function mockResponse() {
  const response = new EventEmitter();
  response.writableEnded = false;
  response.destroyed = false;
  response.chunks = [];
  response.write = (data) => {
    response.chunks.push(JSON.parse(data.replace(/^data: /, "")));
    return true;
  };
  return response;
}

// Builds a stream like the one `LLMPerformanceMonitor.measureStream` returns.
function mockStream(chunks) {
  async function* generate() {
    for (const chunk of chunks) yield chunk;
  }
  const stream = generate();
  stream.endMeasurement = jest.fn();
  return stream;
}

const contentChunk = (content, finish_reason = null) => ({
  choices: [{ delta: { content }, finish_reason }],
});

// Resolves to "timeout" instead of hanging the test when the handler never settles.
function settle(promise, ms = 500) {
  return Promise.race([
    promise,
    new Promise((resolve) => setTimeout(() => resolve("timeout"), ms)),
  ]);
}

describe("handleDefaultStreamResponseV2", () => {
  it("closes the response when the stream sends a finish_reason", async () => {
    const response = mockResponse();
    const stream = mockStream([
      contentChunk("Hello"),
      contentChunk(" world", "stop"),
    ]);

    const result = await settle(
      handleDefaultStreamResponseV2(response, stream, {
        uuid: "abc",
        sources: [{ id: 1 }],
      })
    );

    expect(result).toBe("Hello world");
    const last = response.chunks.at(-1);
    expect(last).toMatchObject({ uuid: "abc", close: true, error: false });
    expect(last.sources).toEqual([{ id: 1 }]);
    expect(stream.endMeasurement).toHaveBeenCalled();
    expect(response.listenerCount("close")).toBe(0);
  });

  it("closes the response when the stream ends without a finish_reason", async () => {
    const response = mockResponse();
    const stream = mockStream([contentChunk("Hello"), contentChunk(" world")]);

    const result = await settle(
      handleDefaultStreamResponseV2(response, stream, {
        uuid: "abc",
        sources: [{ id: 1 }],
      })
    );

    expect(result).toBe("Hello world");
    const last = response.chunks.at(-1);
    expect(last).toMatchObject({ uuid: "abc", close: true, error: false });
    expect(last.sources).toEqual([{ id: 1 }]);
    expect(response.chunks.filter((chunk) => chunk.close)).toHaveLength(1);
    expect(stream.endMeasurement).toHaveBeenCalled();
    expect(response.listenerCount("close")).toBe(0);
  });
});
