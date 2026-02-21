// Mock the heavy LangChain-based base class before requiring the module under test.
jest.mock(
  "../../../../../utils/agents/aibitat/providers/ai-provider.js",
  () => {
    class MockProvider {
      constructor(client) {
        this.client = client;
      }
    }
    return MockProvider;
  },
  { virtual: true }
);

// Mock the Anthropic SDK so no real HTTP calls are made.
const mockCreate = jest.fn();
jest.mock(
  "@anthropic-ai/sdk",
  () => {
    class MockAnthropic {
      constructor() {
        this.messages = { create: mockCreate };
      }
    }
    MockAnthropic.AuthenticationError = class AuthenticationError extends Error {};
    MockAnthropic.RateLimitError = class RateLimitError extends Error {};
    MockAnthropic.InternalServerError = class InternalServerError extends Error {};
    MockAnthropic.APIError = class APIError extends Error {};
    return MockAnthropic;
  },
  { virtual: true }
);

const AnthropicProvider = require("../../../../../utils/agents/aibitat/providers/anthropic");

describe("AnthropicProvider: maxTokens resolution", () => {
  describe("legacy models (4096 output limit)", () => {
    const legacyModels = [
      "claude-instant-1.2",
      "claude-2.0",
      "claude-2.1",
      "claude-3-haiku-20240307",
      "claude-3-sonnet-20240229",
      "claude-3-opus-20240229",
      "claude-3-opus-latest",
    ];

    legacyModels.forEach((model) => {
      it(`resolves maxTokens to 4096 for ${model}`, () => {
        const provider = new AnthropicProvider({ model });
        expect(provider.maxTokens).toBe(4096);
      });
    });
  });

  describe("modern models (8192 output limit)", () => {
    const modernModels = [
      "claude-3-5-sonnet-20240620",
      "claude-3-5-sonnet-20241022",
      "claude-3-5-sonnet-latest",
      "claude-3-5-haiku-20241022",
      "claude-3-5-haiku-latest",
    ];

    modernModels.forEach((model) => {
      it(`resolves maxTokens to 8192 for ${model}`, () => {
        const provider = new AnthropicProvider({ model });
        expect(provider.maxTokens).toBe(8192);
      });
    });
  });

  describe("claude-3-7 models (64000 output limit)", () => {
    const extendedModels = [
      "claude-3-7-sonnet-20250219",
      "claude-3-7-sonnet-latest",
    ];

    extendedModels.forEach((model) => {
      it(`resolves maxTokens to 64000 for ${model}`, () => {
        const provider = new AnthropicProvider({ model });
        expect(provider.maxTokens).toBe(64000);
      });
    });
  });

  describe("unknown or future models", () => {
    it("defaults to 4096 for an unrecognized model ID", () => {
      const provider = new AnthropicProvider({ model: "claude-99-ultra" });
      expect(provider.maxTokens).toBe(4096);
    });

    it("uses 8192 for the default model (claude-3-5-sonnet-20240620)", () => {
      const provider = new AnthropicProvider();
      expect(provider.maxTokens).toBe(8192);
    });
  });

  describe("API call receives correct max_tokens value", () => {
    beforeEach(() => {
      mockCreate.mockReset();
      mockCreate.mockResolvedValue({
        stop_reason: "end_turn",
        content: [{ type: "text", text: "hello" }],
      });
    });

    it("sends max_tokens: 4096 when using a legacy model", async () => {
      const provider = new AnthropicProvider({
        model: "claude-3-opus-20240229",
      });
      await provider.complete([{ role: "user", content: "hi" }]);
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ max_tokens: 4096 }),
        expect.anything()
      );
    });

    it("sends max_tokens: 8192 when using a modern model", async () => {
      const provider = new AnthropicProvider({
        model: "claude-3-5-sonnet-20241022",
      });
      await provider.complete([{ role: "user", content: "hi" }]);
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ max_tokens: 8192 }),
        expect.anything()
      );
    });
  });
});
