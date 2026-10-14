const {
  isTruncatedFinish,
  handleDefaultStreamResponseV2,
  convertToChatHistory,
} = require("../../../../utils/helpers/chat/responses");

describe("chat response helper: isTruncatedFinish", () => {
  it("returns true for token limit termination reasons across providers", () => {
    expect(isTruncatedFinish("length")).toBe(true);
    expect(isTruncatedFinish("max_tokens")).toBe(true);
    expect(isTruncatedFinish("max_output_tokens")).toBe(true);
  });

  it("returns false for normal completions and non-truncation reasons", () => {
    expect(isTruncatedFinish("stop")).toBe(false);
    expect(isTruncatedFinish("end_turn")).toBe(false);
    expect(isTruncatedFinish("tool_calls")).toBe(false);
    expect(isTruncatedFinish("content_filter")).toBe(false);
    expect(isTruncatedFinish("")).toBe(false);
    expect(isTruncatedFinish(null)).toBe(false);
    expect(isTruncatedFinish(undefined)).toBe(false);
  });
});

describe("handleDefaultStreamResponseV2", () => {
  function createMockStream(chunks) {
    return {
      endMeasurement: jest.fn(),
      async *[Symbol.asyncIterator]() {
        for (const chunk of chunks) yield chunk;
      },
    };
  }

  function createMockResponse() {
    return {
      write: jest.fn(),
      on: jest.fn(),
      removeListener: jest.fn(),
    };
  }

  it("records truncated: true in endMeasurement when finish_reason is length", async () => {
    const stream = createMockStream([
      { choices: [{ delta: { content: "Partial " } }] },
      { choices: [{ delta: { content: "response" } }] },
      { choices: [{ delta: {}, finish_reason: "length" }] },
    ]);
    const response = createMockResponse();

    const fullText = await handleDefaultStreamResponseV2(response, stream, {
      uuid: "test-uuid",
      sources: [],
    });

    expect(fullText).toBe("Partial response");
    expect(stream.endMeasurement).toHaveBeenCalledTimes(1);
    expect(stream.endMeasurement).toHaveBeenCalledWith(
      expect.objectContaining({
        truncated: true,
      })
    );
  });

  it("does not set truncated when finish_reason is stop", async () => {
    const stream = createMockStream([
      { choices: [{ delta: { content: "Complete response." } }] },
      { choices: [{ delta: {}, finish_reason: "stop" }] },
    ]);
    const response = createMockResponse();

    const fullText = await handleDefaultStreamResponseV2(response, stream, {
      uuid: "test-uuid",
      sources: [],
    });

    expect(fullText).toBe("Complete response.");
    expect(stream.endMeasurement).toHaveBeenCalledTimes(1);
    const passedUsage = stream.endMeasurement.mock.calls[0][0];
    expect(passedUsage.truncated).toBeUndefined();
  });
});

describe("convertToChatHistory", () => {
  it("preserves metrics.truncated when history is restored from database", () => {
    const rawHistory = [
      {
        id: 1,
        prompt: "Tell me a long story",
        response: JSON.stringify({
          text: "Once upon a time...",
          sources: [],
          type: "chat",
          metrics: {
            prompt_tokens: 10,
            completion_tokens: 50,
            truncated: true,
          },
        }),
        createdAt: new Date().toISOString(),
      },
    ];

    const history = convertToChatHistory(rawHistory);
    expect(history).toHaveLength(2);

    const [userMessage, assistantMessage] = history;
    expect(userMessage.role).toBe("user");
    expect(assistantMessage.role).toBe("assistant");
    expect(assistantMessage.metrics).toEqual(
      expect.objectContaining({
        truncated: true,
      })
    );
  });

  it("defaults metrics safely when truncated is not present", () => {
    const rawHistory = [
      {
        id: 2,
        prompt: "Hello",
        response: JSON.stringify({
          text: "Hi there!",
          sources: [],
          type: "chat",
          metrics: {
            prompt_tokens: 5,
            completion_tokens: 5,
          },
        }),
        createdAt: new Date().toISOString(),
      },
    ];

    const history = convertToChatHistory(rawHistory);
    const assistantMessage = history[1];
    expect(assistantMessage.metrics.truncated).toBeUndefined();
  });
});
