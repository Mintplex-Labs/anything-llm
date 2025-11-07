const { OllamaAILLM } = require("../../../../utils/AiProviders/ollama");

jest.mock("../../../../utils/EmbeddingEngines/native");
jest.mock("ollama");

describe("OllamaAILLM", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    OllamaAILLM.modelContextWindows = {};
    OllamaAILLM._cachePromise = null;
    process.env.OLLAMA_BASE_PATH = "http://localhost:11434";
  });

  afterEach(() => {
    delete process.env.OLLAMA_BASE_PATH;
  });

  describe("Constructor initialization", () => {
    it("initializes limits immediately to prevent race conditions", () => {
      const llm = new OllamaAILLM();

      expect(llm.limits).toBeDefined();
      expect(llm.limits.user).toBe(4096 * 0.7);
      expect(llm.limits.system).toBe(4096 * 0.15);
      expect(llm.limits.history).toBe(4096 * 0.15);
    });

    it("sets model from preference or defaults to undefined", () => {
      const llm1 = new OllamaAILLM(null, "custom-model");
      expect(llm1.model).toBe("custom-model");

      const llm2 = new OllamaAILLM();
      expect(llm2.model).toBeUndefined();
    });
  });

  describe("cacheContextWindows", () => {
    it("caches context windows for all chat models", async () => {
      const mockClient = {
        list: jest.fn().mockResolvedValue({
          models: [
            { name: "model-1" },
            { name: "embedding-model" },
          ],
        }),
        show: jest.fn((params) => {
          if (params.model === "model-1") {
            return Promise.resolve({
              capabilities: [],
              model_info: { "general.context_length": 8192 },
            });
          }
          return Promise.resolve({
            capabilities: ["embedding"],
            model_info: { "general.context_length": 2048 },
          });
        }),
      };

      const { Ollama } = require("ollama");
      Ollama.mockImplementation(() => mockClient);

      await OllamaAILLM.cacheContextWindows(true);

      expect(OllamaAILLM.modelContextWindows["model-1"]).toBe(8192);
      expect(OllamaAILLM.modelContextWindows["embedding-model"]).toBeUndefined();
    });

    it("handles concurrent cache requests without duplicate fetches", async () => {
      const mockClient = {
        list: jest.fn().mockImplementation(() =>
          new Promise((resolve) =>
            setTimeout(() => resolve({
              models: [{ name: "model-1" }],
            }), 100)
          )
        ),
        show: jest.fn().mockResolvedValue({
          capabilities: [],
          model_info: { "general.context_length": 8192 },
        }),
      };

      const { Ollama } = require("ollama");
      Ollama.mockImplementation(() => mockClient);

      const promise1 = OllamaAILLM.cacheContextWindows(true);
      const promise2 = OllamaAILLM.cacheContextWindows(false);

      await Promise.all([promise1, promise2]);

      expect(mockClient.list).toHaveBeenCalledTimes(1);
    });
  });

  describe("ensureModelCached", () => {
    it("returns immediately if model is already cached", async () => {
      OllamaAILLM.modelContextWindows["model-1"] = 8192;

      const mockClient = {
        list: jest.fn(),
        show: jest.fn(),
      };

      const { Ollama } = require("ollama");
      Ollama.mockImplementation(() => mockClient);

      await OllamaAILLM.ensureModelCached("model-1");

      expect(mockClient.list).not.toHaveBeenCalled();
    });

    it("refreshes cache when model is not found", async () => {
      const mockClient = {
        list: jest.fn().mockResolvedValue({
          models: [{ name: "new-model" }],
        }),
        show: jest.fn().mockResolvedValue({
          capabilities: [],
          model_info: { "general.context_length": 4096 },
        }),
      };

      const { Ollama } = require("ollama");
      Ollama.mockImplementation(() => mockClient);

      await OllamaAILLM.ensureModelCached("new-model");

      expect(mockClient.list).toHaveBeenCalledTimes(1);
      expect(OllamaAILLM.modelContextWindows["new-model"]).toBe(4096);
    });
  });

  describe("getChatCompletion", () => {
    it("ensures model is cached before making request", async () => {
      const mockClient = {
        list: jest.fn().mockResolvedValue({
          models: [{ name: "test-model" }],
        }),
        show: jest.fn().mockResolvedValue({
          capabilities: [],
          model_info: { "general.context_length": 8192 },
        }),
        chat: jest.fn().mockResolvedValue({
          message: { content: "Response" },
          prompt_eval_count: 10,
          eval_count: 20,
        }),
      };

      const { Ollama } = require("ollama");
      Ollama.mockImplementation(() => mockClient);

      const llm = new OllamaAILLM(null, "test-model");
      await llm.getChatCompletion([{ role: "user", content: "Hello" }], { temperature: 0.7 });

      expect(OllamaAILLM.modelContextWindows["test-model"]).toBe(8192);
      expect(mockClient.chat).toHaveBeenCalled();
    });
  });

  describe("streamGetChatCompletion", () => {
    it("ensures model is cached before streaming", async () => {
      const mockClient = {
        list: jest.fn().mockResolvedValue({
          models: [{ name: "test-model" }],
        }),
        show: jest.fn().mockResolvedValue({
          capabilities: [],
          model_info: { "general.context_length": 8192 },
        }),
        chat: jest.fn().mockResolvedValue({
          [Symbol.asyncIterator]: async function* () {
            yield { message: { content: "Hello" } };
          },
        }),
      };

      const { Ollama } = require("ollama");
      Ollama.mockImplementation(() => mockClient);

      const llm = new OllamaAILLM(null, "test-model");
      await llm.streamGetChatCompletion([{ role: "user", content: "Hello" }], { temperature: 0.7 });

      expect(OllamaAILLM.modelContextWindows["test-model"]).toBe(8192);
      expect(mockClient.chat).toHaveBeenCalled();
    });
  });
});

