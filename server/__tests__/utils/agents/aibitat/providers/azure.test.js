jest.mock("openai", () => ({
  OpenAI: jest.fn().mockImplementation(() => ({ chat: { completions: {} } })),
  AuthenticationError: class AuthenticationError extends Error {},
  RateLimitError: class RateLimitError extends Error {},
  InternalServerError: class InternalServerError extends Error {},
  APIError: class APIError extends Error {},
}));

jest.mock("../../../../../utils/AiProviders/azureOpenAi", () => ({
  AzureOpenAiLLM: {
    formatBaseUrl: jest.fn(() => "https://mock.azure.example"),
  },
}));

jest.mock(
  "../../../../../utils/agents/aibitat/providers/helpers/tooled.js",
  () => ({
    ...jest.requireActual(
      "../../../../../utils/agents/aibitat/providers/helpers/tooled.js"
    ),
    tooledStream: jest.fn(),
    tooledComplete: jest.fn(),
  })
);

const { tooledStream, tooledComplete, MAX_PARSE_RETRIES } = require(
  "../../../../../utils/agents/aibitat/providers/helpers/tooled.js"
);
const AzureOpenAiProvider = require("../../../../../utils/agents/aibitat/providers/azure.js");

describe("AzureOpenAiProvider stream() retry on retryWithError", () => {
  beforeEach(() => {
    tooledStream.mockReset();
    tooledComplete.mockReset();
  });

  it("retries by appending retryWithError to messages and forwarding eventHandler", async () => {
    const provider = new AzureOpenAiProvider({ model: "m" });
    const messages = [{ role: "user", content: "hi" }];
    const retryWithError = {
      role: "function",
      name: "lookup",
      content:
        "Failed to parse tool call arguments as JSON. Raw arguments: bad",
      originalFunctionCall: { id: "c1", name: "lookup", arguments: "bad" },
    };
    const finalResult = {
      textResponse: null,
      functionCall: { id: "c2", name: "lookup", arguments: { q: "ok" } },
      uuid: "u",
      usage: null,
    };

    tooledStream.mockResolvedValueOnce({ retryWithError });
    tooledStream.mockResolvedValueOnce(finalResult);

    const eventHandler = jest.fn();
    const result = await provider.stream(messages, [], eventHandler);

    expect(tooledStream).toHaveBeenCalledTimes(2);

    const secondCallArgs = tooledStream.mock.calls[1];
    expect(secondCallArgs[2]).toEqual([...messages, retryWithError]);

    expect(tooledStream.mock.calls[0][4]).toBe(eventHandler);
    expect(tooledStream.mock.calls[1][4]).toBe(eventHandler);

    expect(result).toEqual(finalResult);
  });

  it("does not retry when tooledStream returns a normal functionCall", async () => {
    const provider = new AzureOpenAiProvider({ model: "m" });
    const messages = [{ role: "user", content: "hi" }];
    const normalResult = {
      textResponse: null,
      functionCall: { id: "c1", name: "lookup", arguments: { q: "ok" } },
      uuid: "u",
      usage: null,
    };

    tooledStream.mockResolvedValueOnce(normalResult);

    const result = await provider.stream(messages, [], jest.fn());

    expect(tooledStream).toHaveBeenCalledTimes(1);
    expect(result).toEqual(normalResult);
  });

  it("stops retrying once the parse-retry cap is reached and returns the error text", async () => {
    const provider = new AzureOpenAiProvider({ model: "m" });
    const messages = [{ role: "user", content: "hi" }];
    const retryWithError = {
      role: "function",
      name: "lookup",
      content:
        "Failed to parse tool call arguments as JSON. Raw arguments: bad",
    };

    tooledStream.mockResolvedValue({ retryWithError });

    const result = await provider.stream(messages, [], jest.fn());

    expect(tooledStream).toHaveBeenCalledTimes(MAX_PARSE_RETRIES + 1);
    expect(result).toEqual({
      textResponse: retryWithError.content,
      functionCall: null,
    });
  });

  it("applies the same parse-retry cap to complete()", async () => {
    const provider = new AzureOpenAiProvider({ model: "m" });
    const messages = [{ role: "user", content: "hi" }];
    const retryWithError = {
      role: "function",
      name: "lookup",
      content:
        "Failed to parse tool call arguments as JSON. Raw arguments: bad",
    };

    tooledComplete.mockResolvedValue({ retryWithError });

    const result = await provider.complete(messages, []);

    expect(tooledComplete).toHaveBeenCalledTimes(MAX_PARSE_RETRIES + 1);
    expect(result).toEqual({
      textResponse: retryWithError.content,
      functionCall: null,
    });
  });
});
