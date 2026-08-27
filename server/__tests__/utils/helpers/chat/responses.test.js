/* eslint-env jest, node */
jest.mock("uuid", () => ({ v4: () => "test-uuid" }));
jest.mock("moment", () => (() => ({ unix: () => 0 })));
jest.mock("../../../../utils/helpers/abortSignals", () => ({
  isAbortError: (e) => e?.name === "AbortError",
  abortConnectorOnClientDisconnect: jest.fn(),
}));

const { handleDefaultStreamResponseV2 } = require("../../../../utils/helpers/chat/responses");

describe("handleDefaultStreamResponseV2 - listener cleanup", () => {
  let mockResponse;
  let mockStream;

  beforeEach(() => {
    mockResponse = {
      write: jest.fn().mockReturnValue(true),
      writableEnded: false,
      destroyed: false,
      on: jest.fn(),
      removeListener: jest.fn(),
    };

    mockStream = {
      endMeasurement: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("removes the close listener on normal stream completion", async () => {
    mockStream[Symbol.asyncIterator] = async function* () {
      yield {
        choices: [
          {
            delta: { content: "Hello" },
            finish_reason: null,
          },
        ],
      };
      yield {
        choices: [
          {
            delta: { content: " World" },
            finish_reason: "stop",
          },
        ],
      };
    };

    const result = await handleDefaultStreamResponseV2(mockResponse, mockStream, {
      uuid: "test-uuid",
      sources: [],
    });

    expect(result).toBe("Hello World");
    expect(mockResponse.removeListener).toHaveBeenCalledWith(
      "close",
      expect.any(Function)
    );
  });

  it("removes the close listener when an abort error occurs", async () => {
    const abortError = new Error("aborted");
    abortError.name = "AbortError";

    mockStream[Symbol.asyncIterator] = async function* () {
      yield {
        choices: [
          {
            delta: { content: "Hello" },
            finish_reason: null,
          },
        ],
      };
      throw abortError;
    };

    const result = await handleDefaultStreamResponseV2(mockResponse, mockStream, {
      uuid: "test-uuid",
      sources: [],
    });

    expect(result).toBe("Hello");
    expect(mockResponse.removeListener).toHaveBeenCalled();
  });

  it("removes the close listener when a generic error occurs", async () => {
    const error = new Error("Something went wrong");

    mockStream[Symbol.asyncIterator] = async function* () {
      yield {
        choices: [
          {
            delta: { content: "Hello" },
            finish_reason: null,
          },
        ],
      };
      throw error;
    };

    const result = await handleDefaultStreamResponseV2(mockResponse, mockStream, {
      uuid: "test-uuid",
      sources: [],
    });

    expect(result).toBe("Hello");
    expect(mockResponse.removeListener).toHaveBeenCalled();
  });
});
