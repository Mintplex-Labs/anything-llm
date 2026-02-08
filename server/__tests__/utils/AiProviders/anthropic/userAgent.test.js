process.env.NODE_ENV = "test";
process.env.ANTHROPIC_API_KEY = "sk-ant-test-key";

const mockAnthropicConstructor = jest.fn();

jest.mock("@anthropic-ai/sdk", () => {
  return jest.fn().mockImplementation((opts) => {
    mockAnthropicConstructor(opts);
    return { messages: {} };
  });
});

jest.mock("../../../../endpoints/utils", () => ({
  getAnythingLLMUserAgent: jest.fn().mockReturnValue("AnythingLLM/1.0.0"),
}));

jest.mock("../../../../utils/EmbeddingEngines/native", () => ({
  NativeEmbedder: jest.fn().mockImplementation(() => ({})),
}));

jest.mock("../../../../utils/helpers/chat/LLMPerformanceMonitor", () => ({
  LLMPerformanceMonitor: {},
}));

// Mocks for AnthropicProvider's dependency chain
jest.mock("../../../../utils/agents/aibitat/providers/ai-provider.js", () => {
  return class Provider {
    constructor(client) {
      this.client = client;
    }
  };
});

jest.mock("../../../../utils/agents/aibitat/error.js", () => ({
  RetryError: class RetryError extends Error {},
}));

jest.mock("../../../../utils/http", () => ({
  safeJsonParse: jest.fn(),
}));

describe("Anthropic User-Agent header", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("AnthropicLLM sets User-Agent in defaultHeaders", () => {
    const { AnthropicLLM } = require("../../../../utils/AiProviders/anthropic");

    new AnthropicLLM();

    expect(mockAnthropicConstructor).toHaveBeenCalledTimes(1);
    const constructorArgs = mockAnthropicConstructor.mock.calls[0][0];
    expect(constructorArgs).toHaveProperty("defaultHeaders");
    expect(constructorArgs.defaultHeaders["User-Agent"]).toBe(
      "AnythingLLM/1.0.0"
    );
  });

  it("AnthropicProvider sets User-Agent in defaultHeaders", () => {
    const AnthropicProvider = require("../../../../utils/agents/aibitat/providers/anthropic");

    new AnthropicProvider({
      options: { apiKey: "sk-ant-test-key" },
    });

    expect(mockAnthropicConstructor).toHaveBeenCalledTimes(1);
    const constructorArgs = mockAnthropicConstructor.mock.calls[0][0];
    expect(constructorArgs).toHaveProperty("defaultHeaders");
    expect(constructorArgs.defaultHeaders["User-Agent"]).toBe(
      "AnythingLLM/1.0.0"
    );
  });

  it("AnthropicProvider preserves existing defaultHeaders from options", () => {
    const AnthropicProvider = require("../../../../utils/agents/aibitat/providers/anthropic");

    new AnthropicProvider({
      options: {
        apiKey: "sk-ant-test-key",
        defaultHeaders: { "X-Custom": "custom-value" },
      },
    });

    expect(mockAnthropicConstructor).toHaveBeenCalledTimes(1);
    const constructorArgs = mockAnthropicConstructor.mock.calls[0][0];
    expect(constructorArgs.defaultHeaders["User-Agent"]).toBe(
      "AnythingLLM/1.0.0"
    );
    expect(constructorArgs.defaultHeaders["X-Custom"]).toBe("custom-value");
  });
});
