const OllamaProvider = require("../../../../../utils/agents/aibitat/providers/ollama");
const { OllamaAILLM } = require("../../../../../utils/AiProviders/ollama");

jest.mock("ollama");
jest.mock("../../../../../utils/AiProviders/ollama", () => ({
  OllamaAILLM: {
    ensureModelCached: jest.fn(),
    cacheContextWindows: jest.fn(),
    promptWindowLimit: jest.fn(() => 4096),
  },
}));

describe("OllamaProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.OLLAMA_BASE_PATH = "http://localhost:11434";
  });

  afterEach(() => {
    delete process.env.OLLAMA_BASE_PATH;
  });

  describe("Initialization", () => {
    it("initializes with provided model or undefined", () => {
      const provider1 = new OllamaProvider({ model: "custom-model" });
      expect(provider1.model).toBe("custom-model");

      const provider2 = new OllamaProvider();
      expect(provider2.model).toBeNull();
    });

    it("supports agent streaming", () => {
      const provider = new OllamaProvider();
      expect(provider.supportsAgentStreaming).toBe(true);
    });
  });

  describe("Chat completion", () => {
    it("ensures model is cached before completing", async () => {
      const provider = new OllamaProvider({ model: "test-model" });
      const mockChat = jest.fn().mockResolvedValue({
        message: { content: "Response" },
      });

      provider._client = {
        chat: mockChat,
      };

      await provider.complete([{ role: "user", content: "Hello" }]);

      expect(OllamaAILLM.ensureModelCached).toHaveBeenCalledWith("test-model");
      expect(mockChat).toHaveBeenCalled();
    });

    it("ensures model is cached before streaming", async () => {
      const provider = new OllamaProvider({ model: "test-model" });
      const mockChat = jest.fn().mockResolvedValue({
        [Symbol.asyncIterator]: async function* () {
          yield { message: { content: "Hello" }, done: false };
          yield { done: true };
        },
      });

      provider._client = {
        chat: mockChat,
      };

      await provider.stream([{ role: "user", content: "Hello" }], [], null);

      expect(OllamaAILLM.ensureModelCached).toHaveBeenCalledWith("test-model");
      expect(mockChat).toHaveBeenCalled();
    });
  });

  describe("Cost calculation", () => {
    it("returns zero cost for Ollama", () => {
      const provider = new OllamaProvider();
      expect(provider.getCost({})).toBe(0);
    });
  });
});

