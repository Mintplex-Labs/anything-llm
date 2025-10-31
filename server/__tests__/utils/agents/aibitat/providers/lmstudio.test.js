const LMStudioProvider = require("../../../../../utils/agents/aibitat/providers/lmstudio");
const { LMStudioLLM } = require("../../../../../utils/AiProviders/lmStudio");

jest.mock("openai");
jest.mock("../../../../../utils/AiProviders/lmStudio", () => ({
  LMStudioLLM: {
    ensureModelCached: jest.fn(),
    cacheContextWindows: jest.fn(),
  },
  parseLMStudioBasePath: jest.fn((path) => path),
}));

describe("LMStudioProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.LMSTUDIO_BASE_PATH = "http://localhost:1234";
  });

  afterEach(() => {
    delete process.env.LMSTUDIO_BASE_PATH;
    delete process.env.LMSTUDIO_MODEL_PREF;
  });

  describe("Initialization", () => {
    it("initializes with provided model or defaults", () => {
      const provider1 = new LMStudioProvider({ model: "custom-model" });
      expect(provider1.model).toBe("custom-model");

      const provider2 = new LMStudioProvider();
      expect(provider2.model).toBe("Loaded from Chat UI");
    });

    it("supports agent streaming", () => {
      const provider = new LMStudioProvider();
      expect(provider.supportsAgentStreaming).toBe(true);
    });
  });

  describe("Chat completion", () => {
    it("ensures model is cached before completing", async () => {
      const provider = new LMStudioProvider({ model: "test-model" });
      const mockCreate = jest.fn().mockResolvedValue({
        choices: [{ message: { content: "Response" } }],
      });

      provider._client = {
        chat: {
          completions: { create: mockCreate },
        },
      };

      await provider.complete([{ role: "user", content: "Hello" }]);

      expect(LMStudioLLM.ensureModelCached).toHaveBeenCalledWith("test-model");
      expect(mockCreate).toHaveBeenCalled();
    });

    it("ensures model is cached before streaming", async () => {
      const provider = new LMStudioProvider({ model: "test-model" });
      const mockCreate = jest.fn().mockResolvedValue({
        [Symbol.asyncIterator]: async function* () {
          yield { choices: [{ delta: { content: "Hello" } }] };
        },
      });

      provider._client = {
        chat: {
          completions: { create: mockCreate },
        },
      };

      await provider.stream([{ role: "user", content: "Hello" }], [], null);

      expect(LMStudioLLM.ensureModelCached).toHaveBeenCalledWith("test-model");
      expect(mockCreate).toHaveBeenCalled();
    });
  });

  describe("Cost calculation", () => {
    it("returns zero cost for LMStudio", () => {
      const provider = new LMStudioProvider();
      expect(provider.getCost({})).toBe(0);
    });
  });
});
