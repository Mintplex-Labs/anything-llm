/* eslint-env jest, node */
const {
  handleDefaultStreamResponseV2,
  persistOrphanedStream,
  writeResponseChunk,
} = require("../../../../utils/helpers/chat/responses");

// Mock WorkspaceChats
jest.mock("../../../../models/workspaceChats", () => ({
  WorkspaceChats: {
    new: jest.fn().mockResolvedValue({ chat: { id: 1 }, message: null }),
  },
}));

const { WorkspaceChats } = require("../../../../models/workspaceChats");

// Helper: create a mock Express response that simulates a writable stream
function createMockResponse(shouldClose = false) {
  const res = {
    writable: true,
    destroyed: false,
    write: jest.fn(),
    removeListener: jest.fn(),
    on: jest.fn(),
    once: jest.fn(),
  };

  // Track "close" event listeners so we can simulate disconnect
  const listeners = {};
  res.on = jest.fn((event, cb) => {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(cb);
    return res;
  });

  res.removeListener = jest.fn((event, cb) => {
    if (listeners[event]) {
      listeners[event] = listeners[event].filter((fn) => fn !== cb);
    }
    return res;
  });

  // Helper to simulate client disconnect
  res.simulateClose = () => {
    if (listeners["close"]) {
      listeners["close"].forEach((cb) => cb());
    }
  };

  return res;
}

// Helper: create a mock async iterable stream
function createMockStream(chunks, opts = {}) {
  const { throwOnError = false, delayMs = 0 } = opts;

  return {
    [Symbol.asyncIterator]() {
      return {
        i: 0,
        done: false,
        async next() {
          if (this.i >= chunks.length) {
            this.done = true;
            return { value: undefined, done: true };
          }
          if (delayMs > 0) await new Promise((r) => setTimeout(r, delayMs));
          const chunk = chunks[this.i];
          this.i++;
          if (throwOnError && chunk?.error) {
            throw new Error(chunk.error);
          }
          return {
            value: chunk,
            done: false,
          };
        },
      };
    },
    endMeasurement: jest.fn(),
    metrics: { completion_tokens: 10 },
  };
}

function makeChunk(token, finishReason = null) {
  return {
    choices: [
      {
        delta: { content: token },
        finish_reason: finishReason,
      },
    ],
  };
}

describe("handleDefaultStreamResponseV2", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should resolve with full text when client stays connected", async () => {
    const res = createMockResponse();
    const chunks = [
      makeChunk("Hello"),
      makeChunk(" "),
      makeChunk("world"),
      makeChunk(null, "stop"),
    ];
    const stream = createMockStream(chunks);

    const result = await handleDefaultStreamResponseV2(res, stream, {
      uuid: "test-uuid",
      sources: [],
    });

    expect(result).toBe("Hello world");
    expect(res.write).toHaveBeenCalledTimes(4); // 3 tokens + final close chunk
  });

  test("should NOT resolve with text when client disconnects mid-stream", async () => {
    const res = createMockResponse();
    const chunks = [
      makeChunk("Hello"),
      makeChunk(" "),
      makeChunk("world"),
      makeChunk(null, "stop"),
    ];
    const stream = createMockStream(chunks, { delayMs: 30 });

    // Start the stream, then simulate disconnect mid-stream
    const promise = handleDefaultStreamResponseV2(res, stream, {
      uuid: "test-uuid",
      sources: [],
      persistContext: {
        workspaceId: 1,
        prompt: "test prompt",
        threadId: 1,
        user: null,
        chatMode: "chat",
        attachments: [],
      },
    });

    // Let first chunk be consumed, then disconnect
    await new Promise((r) => setTimeout(r, 50));
    res.simulateClose();

    const result = await promise;

    // Should resolve empty string (not the full text) to prevent double persistence
    expect(result).toBe("");
  });

  test("should call persistOrphanedStream when client disconnects and text exists", async () => {
    const res = createMockResponse();
    const chunks = [
      makeChunk("Hello"),
      makeChunk(" "),
      makeChunk("world"),
      makeChunk(null, "stop"),
    ];
    const stream = createMockStream(chunks, { delayMs: 30 });

    const persistContext = {
      workspaceId: 42,
      prompt: "test prompt",
      threadId: 7,
      user: { id: 1 },
      chatMode: "chat",
      attachments: [],
    };

    const promise = handleDefaultStreamResponseV2(res, stream, {
      uuid: "test-uuid",
      sources: [{ text: "source" }],
      persistContext,
    });

    // Let first chunk be consumed, then disconnect
    await new Promise((r) => setTimeout(r, 50));
    res.simulateClose();

    await promise;

    // Wait for persistOrphanedStream to be called (it's async fire-and-forget)
    await new Promise((r) => setTimeout(r, 50));

    expect(WorkspaceChats.new).toHaveBeenCalledWith({
      workspaceId: 42,
      prompt: "test prompt",
      response: {
        text: expect.stringContaining("Hello"),
        sources: [{ text: "source" }],
        type: "chat",
        attachments: [],
        metrics: expect.anything(),
      },
      threadId: 7,
      user: { id: 1 },
    });
  });

  test("should NOT persist when client disconnects but no text was generated", async () => {
    const res = createMockResponse();
    const chunks = [makeChunk(null, "stop")]; // Only finish chunk, no text
    const stream = createMockStream(chunks);

    const promise = handleDefaultStreamResponseV2(res, stream, {
      uuid: "test-uuid",
      sources: [],
      persistContext: {
        workspaceId: 1,
        prompt: "test",
        threadId: null,
        user: null,
        chatMode: "chat",
        attachments: [],
      },
    });

    res.simulateClose();
    await promise;
    await new Promise((r) => setTimeout(r, 50));

    expect(WorkspaceChats.new).not.toHaveBeenCalled();
  });

  test("should NOT persist when client disconnects but no persistContext provided", async () => {
    const res = createMockResponse();
    const chunks = [
      makeChunk("Hello"),
      makeChunk(null, "stop"),
    ];
    const stream = createMockStream(chunks);

    const promise = handleDefaultStreamResponseV2(res, stream, {
      uuid: "test-uuid",
      sources: [],
      // No persistContext
    });

    res.simulateClose();
    await promise;
    await new Promise((r) => setTimeout(r, 50));

    expect(WorkspaceChats.new).not.toHaveBeenCalled();
  });

  test("should not write chunks to response after client disconnects", async () => {
    const res = createMockResponse();
    const chunks = [
      makeChunk("First"),
      makeChunk("Second"),
      makeChunk("Third"),
      makeChunk(null, "stop"),
    ];
    const stream = createMockStream(chunks, { delayMs: 30 });

    const promise = handleDefaultStreamResponseV2(res, stream, {
      uuid: "test-uuid",
      sources: [],
    });

    // Let first chunk be consumed, then disconnect
    await new Promise((r) => setTimeout(r, 50));
    res.simulateClose();

    await promise;

    // Should have written at most 1 chunk (before disconnect), not all 3+1
    expect(res.write).toHaveBeenCalledTimes(1);
  });
});

describe("writeResponseChunk", () => {
  test("should write to response when writable", () => {
    const res = { writable: true, destroyed: false, write: jest.fn() };
    writeResponseChunk(res, { type: "test" });
    expect(res.write).toHaveBeenCalledWith(
      expect.stringContaining('"type":"test"')
    );
  });

  test("should NOT write when response is not writable", () => {
    const res = { writable: false, destroyed: false, write: jest.fn() };
    writeResponseChunk(res, { type: "test" });
    expect(res.write).not.toHaveBeenCalled();
  });

  test("should NOT write when response is destroyed", () => {
    const res = { writable: true, destroyed: true, write: jest.fn() };
    writeResponseChunk(res, { type: "test" });
    expect(res.write).not.toHaveBeenCalled();
  });
});

describe("persistOrphanedStream", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should persist text to database", async () => {
    await persistOrphanedStream({
      uuid: "test-uuid",
      text: "complete response",
      sources: [],
      metrics: { completion_tokens: 5 },
      workspaceId: 1,
      prompt: "user question",
      threadId: 3,
      user: { id: 2 },
      chatMode: "chat",
      attachments: [],
    });

    expect(WorkspaceChats.new).toHaveBeenCalledWith({
      workspaceId: 1,
      prompt: "user question",
      response: {
        text: "complete response",
        sources: [],
        type: "chat",
        attachments: [],
        metrics: { completion_tokens: 5 },
      },
      threadId: 3,
      user: { id: 2 },
    });
  });

  test("should NOT persist empty text", async () => {
    await persistOrphanedStream({
      uuid: "test-uuid",
      text: "",
      sources: [],
      metrics: {},
      workspaceId: 1,
      prompt: "test",
      threadId: null,
      user: null,
      chatMode: "chat",
      attachments: [],
    });

    expect(WorkspaceChats.new).not.toHaveBeenCalled();
  });

  test("should NOT throw when database write fails", async () => {
    WorkspaceChats.new.mockRejectedValueOnce(new Error("DB error"));

    // Should not throw
    await expect(
      persistOrphanedStream({
        uuid: "test-uuid",
        text: "some text",
        sources: [],
        metrics: {},
        workspaceId: 1,
        prompt: "test",
        threadId: null,
        user: null,
        chatMode: "chat",
        attachments: [],
      })
    ).resolves.toBeUndefined();
  });
});
