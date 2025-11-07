const { LMStudioLLM } = require("../../../../utils/AiProviders/lmStudio");

jest.mock("../../../../utils/EmbeddingEngines/native");
jest.mock("openai");

global.fetch = jest.fn();

describe("LMStudioLLM", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    LMStudioLLM.modelContextWindows = {};
    LMStudioLLM._cachePromise = null;
    process.env.LMSTUDIO_BASE_PATH = "http://localhost:1234";
  });

  afterEach(() => {
    delete process.env.LMSTUDIO_BASE_PATH;
  });

  describe("Constructor initialization", () => {
    it("initializes limits immediately to prevent race conditions", () => {
      const llm = new LMStudioLLM();

      expect(llm.limits).toBeDefined();
      expect(llm.limits.user).toBe(4096 * 0.7);
      expect(llm.limits.system).toBe(4096 * 0.15);
      expect(llm.limits.history).toBe(4096 * 0.15);
    });

    it("sets model from preference or defaults to fallback", () => {
      const llm1 = new LMStudioLLM(null, "custom-model");
      expect(llm1.model).toBe("custom-model");

      const llm2 = new LMStudioLLM();
      expect(llm2.model).toBe("Loaded from Chat UI");
    });
  });

  describe("cacheContextWindows", () => {
    it("caches context windows for all chat models", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [
            { id: "model-1", type: "chat", max_context_length: 8192 },
            { id: "embedding-model", type: "embeddings", max_context_length: 2048 },
          ],
        }),
      });

      await LMStudioLLM.cacheContextWindows(true);

      expect(LMStudioLLM.modelContextWindows["model-1"]).toBe(8192);
      expect(LMStudioLLM.modelContextWindows["embedding-model"]).toBeUndefined();
    });

    it("handles concurrent cache requests without duplicate fetches", async () => {
      global.fetch.mockImplementation(() =>
        new Promise((resolve) =>
          setTimeout(() => resolve({
            ok: true,
            json: async () => ({ data: [{ id: "model-1", type: "chat", max_context_length: 8192 }] }),
          }), 100)
        )
      );

      const promise1 = LMStudioLLM.cacheContextWindows(true);
      const promise2 = LMStudioLLM.cacheContextWindows(false);

      await Promise.all([promise1, promise2]);

      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("ensureModelCached", () => {
    it("returns immediately if model is already cached", async () => {
      LMStudioLLM.modelContextWindows["model-1"] = 8192;

      await LMStudioLLM.ensureModelCached("model-1");

      expect(fetch).not.toHaveBeenCalled();
    });

    it("refreshes cache when model is not found", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [{ id: "new-model", type: "chat", max_context_length: 4096 }],
        }),
      });

      await LMStudioLLM.ensureModelCached("new-model");

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(LMStudioLLM.modelContextWindows["new-model"]).toBe(4096);
    });
  });

  describe("getChatCompletion", () => {
    it("ensures model is cached before making request", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [{ id: "test-model", type: "chat", max_context_length: 8192 }],
        }),
      });

      const llm = new LMStudioLLM(null, "test-model");
      const mockCreate = jest.fn().mockResolvedValue({
        choices: [{ message: { content: "Response" } }],
        usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 },
      });

      llm.lmstudio = {
        chat: {
          completions: { create: mockCreate },
        },
      };

      await llm.getChatCompletion([{ role: "user", content: "Hello" }], { temperature: 0.7 });

      expect(LMStudioLLM.modelContextWindows["test-model"]).toBe(8192);
      expect(mockCreate).toHaveBeenCalled();
    });
  });

  describe("streamGetChatCompletion", () => {
    it("ensures model is cached before streaming", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [{ id: "test-model", type: "chat", max_context_length: 8192 }],
        }),
      });

      const llm = new LMStudioLLM(null, "test-model");
      const mockCreate = jest.fn().mockResolvedValue({ [Symbol.asyncIterator]: jest.fn() });

      llm.lmstudio = {
        chat: {
          completions: { create: mockCreate },
        },
      };

      await llm.streamGetChatCompletion([{ role: "user", content: "Hello" }], { temperature: 0.7 });

      expect(LMStudioLLM.modelContextWindows["test-model"]).toBe(8192);
      expect(mockCreate).toHaveBeenCalled();
    });
  });
});
