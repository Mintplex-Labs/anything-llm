/**
 * Tests for ModelsLabLLM provider.
 *
 * Run with: jest server/utils/AiProviders/modelsLab/modelsLab.test.js
 */

"use strict";

// ── Mocks ────────────────────────────────────────────────────────────────────

jest.mock("../../EmbeddingEngines/native", () => ({
  NativeEmbedder: jest.fn().mockImplementation(() => ({
    embedTextInput: jest.fn().mockResolvedValue([[0.1, 0.2, 0.3]]),
    embedChunks: jest.fn().mockResolvedValue([[0.1, 0.2, 0.3]]),
  })),
}));

jest.mock("../../helpers/chat/responses", () => ({
  handleDefaultStreamResponseV2: jest.fn(),
}));

jest.mock("../../helpers/chat/LLMPerformanceMonitor", () => ({
  LLMPerformanceMonitor: {
    measureAsyncFunction: jest.fn(),
    measureStream: jest.fn(),
  },
}));

jest.mock("openai", () => ({
  OpenAI: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn(),
      },
    },
  })),
}));

jest.mock("../../helpers/chat", () => ({
  messageArrayCompressor: jest.fn().mockResolvedValue([]),
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

const {
  LLMPerformanceMonitor,
} = require("../../helpers/chat/LLMPerformanceMonitor");

function makeProvider(overrides = {}) {
  process.env.MODELSLAB_API_KEY = overrides.apiKey ?? "test-key-abc123";
  process.env.MODELSLAB_MODEL_PREF =
    overrides.modelPref ?? "llama-3.1-8b-uncensored";

  const { ModelsLabLLM } = require("./index");
  return new ModelsLabLLM(null, overrides.modelPreference ?? null);
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("ModelsLabLLM", () => {
  beforeEach(() => {
    jest.resetModules();
    delete process.env.MODELSLAB_API_KEY;
    delete process.env.MODELSLAB_MODEL_PREF;
    jest.clearAllMocks();
  });

  // ── Constructor ─────────────────────────────────────────────────────────────

  describe("constructor", () => {
    it("throws when MODELSLAB_API_KEY is not set", () => {
      const { ModelsLabLLM } = require("./index");
      expect(() => new ModelsLabLLM()).toThrow("No ModelsLab API key was set");
    });

    it("initialises with API key from env", () => {
      const provider = makeProvider();
      expect(provider.className).toBe("ModelsLabLLM");
    });

    it("uses default model when MODELSLAB_MODEL_PREF is not set", () => {
      process.env.MODELSLAB_API_KEY = "test-key";
      delete process.env.MODELSLAB_MODEL_PREF;
      const { ModelsLabLLM } = require("./index");
      const provider = new ModelsLabLLM();
      expect(provider.model).toBe("llama-3.1-8b-uncensored");
    });

    it("respects MODELSLAB_MODEL_PREF env var", () => {
      process.env.MODELSLAB_API_KEY = "test-key";
      process.env.MODELSLAB_MODEL_PREF = "llama-3.1-70b-uncensored";
      const { ModelsLabLLM } = require("./index");
      const provider = new ModelsLabLLM();
      expect(provider.model).toBe("llama-3.1-70b-uncensored");
    });

    it("modelPreference arg overrides env var", () => {
      const provider = makeProvider({ modelPreference: "llama-3.1-70b-uncensored" });
      expect(provider.model).toBe("llama-3.1-70b-uncensored");
    });

    it("sets correct limits for 128K context model", () => {
      const provider = makeProvider();
      expect(provider.limits.history).toBeCloseTo(131072 * 0.15);
      expect(provider.limits.system).toBeCloseTo(131072 * 0.15);
      expect(provider.limits.user).toBeCloseTo(131072 * 0.7);
    });
  });

  // ── Streaming ───────────────────────────────────────────────────────────────

  describe("streamingEnabled()", () => {
    it("returns true (streamGetChatCompletion is defined)", () => {
      const provider = makeProvider();
      expect(provider.streamingEnabled()).toBe(true);
    });
  });

  // ── Context window ──────────────────────────────────────────────────────────

  describe("promptWindowLimit()", () => {
    it("returns 131072 for llama-3.1-8b-uncensored", () => {
      const provider = makeProvider();
      expect(provider.promptWindowLimit()).toBe(131072);
    });

    it("returns 131072 for llama-3.1-70b-uncensored", () => {
      const provider = makeProvider({ modelPreference: "llama-3.1-70b-uncensored" });
      expect(provider.promptWindowLimit()).toBe(131072);
    });

    it("static version returns correct limit by model name", () => {
      const { ModelsLabLLM } = require("./index");
      expect(ModelsLabLLM.promptWindowLimit("llama-3.1-8b-uncensored")).toBe(131072);
      expect(ModelsLabLLM.promptWindowLimit("llama-3.1-70b-uncensored")).toBe(131072);
    });

    it("static version falls back to default for unknown model", () => {
      const { ModelsLabLLM } = require("./index");
      expect(ModelsLabLLM.promptWindowLimit("unknown-model")).toBe(131072);
    });
  });

  // ── Model validation ────────────────────────────────────────────────────────

  describe("isValidChatCompletionModel()", () => {
    it("returns true for llama-3.1-8b-uncensored", async () => {
      const provider = makeProvider();
      expect(await provider.isValidChatCompletionModel("llama-3.1-8b-uncensored")).toBe(true);
    });

    it("returns true for llama-3.1-70b-uncensored", async () => {
      const provider = makeProvider();
      expect(await provider.isValidChatCompletionModel("llama-3.1-70b-uncensored")).toBe(true);
    });

    it("returns false for unknown model", async () => {
      const provider = makeProvider();
      expect(await provider.isValidChatCompletionModel("gpt-99-turbo")).toBe(false);
    });

    it("returns false for empty string", async () => {
      const provider = makeProvider();
      expect(await provider.isValidChatCompletionModel("")).toBe(false);
    });
  });

  // ── Model listing ────────────────────────────────────────────────────────────

  describe("getModelsListing()", () => {
    it("returns array with two models", async () => {
      const { ModelsLabLLM } = require("./index");
      const models = await ModelsLabLLM.getModelsListing();
      expect(models).toHaveLength(2);
    });

    it("each model has required fields", async () => {
      const { ModelsLabLLM } = require("./index");
      const models = await ModelsLabLLM.getModelsListing();
      for (const m of models) {
        expect(m).toHaveProperty("id");
        expect(m).toHaveProperty("name");
        expect(m).toHaveProperty("organization", "ModelsLab");
        expect(m).toHaveProperty("maxLength", 131072);
      }
    });
  });

  // ── constructPrompt ──────────────────────────────────────────────────────────

  describe("constructPrompt()", () => {
    it("builds correct message array", () => {
      const provider = makeProvider();
      const result = provider.constructPrompt({
        systemPrompt: "You are helpful.",
        contextTexts: [],
        chatHistory: [],
        userPrompt: "Hello world",
        attachments: [],
      });
      expect(result[0]).toEqual({ role: "system", content: "You are helpful." });
      expect(result[result.length - 1]).toEqual({ role: "user", content: "Hello world" });
    });

    it("injects context texts into system message", () => {
      const provider = makeProvider();
      const result = provider.constructPrompt({
        systemPrompt: "System.",
        contextTexts: ["context-one"],
        chatHistory: [],
        userPrompt: "Question?",
        attachments: [],
      });
      expect(result[0].content).toContain("[CONTEXT 0]");
      expect(result[0].content).toContain("context-one");
    });

    it("includes chat history in correct position", () => {
      const provider = makeProvider();
      const history = [{ role: "assistant", content: "Previous answer" }];
      const result = provider.constructPrompt({
        systemPrompt: "Sys",
        contextTexts: [],
        chatHistory: history,
        userPrompt: "New question",
        attachments: [],
      });
      expect(result[1]).toEqual(history[0]);
    });

    it("generates content array when attachments are present", () => {
      const provider = makeProvider();
      const result = provider.constructPrompt({
        systemPrompt: "",
        contextTexts: [],
        chatHistory: [],
        userPrompt: "Describe this image",
        attachments: [{ contentString: "data:image/png;base64,abc123" }],
      });
      const lastMsg = result[result.length - 1];
      expect(Array.isArray(lastMsg.content)).toBe(true);
      expect(lastMsg.content[0]).toEqual({ type: "text", text: "Describe this image" });
      expect(lastMsg.content[1].type).toBe("image_url");
    });
  });

  // ── getChatCompletion ────────────────────────────────────────────────────────

  describe("getChatCompletion()", () => {
    it("returns textResponse on success", async () => {
      LLMPerformanceMonitor.measureAsyncFunction.mockResolvedValue({
        output: {
          choices: [{ message: { content: "Hello from ModelsLab!" } }],
          usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 },
        },
        duration: 1.5,
      });

      const provider = makeProvider();
      const result = await provider.getChatCompletion(
        [{ role: "user", content: "Hi" }],
        { temperature: 0.7 }
      );

      expect(result.textResponse).toBe("Hello from ModelsLab!");
      expect(result.metrics.total_tokens).toBe(30);
      expect(result.metrics.provider).toBe("ModelsLabLLM");
    });

    it("throws for invalid model", async () => {
      const provider = makeProvider({ modelPreference: "not-a-real-model" });
      // Hack model after construction
      provider.model = "not-a-real-model";
      await expect(
        provider.getChatCompletion([], { temperature: 0.7 })
      ).rejects.toThrow("not-a-real-model");
    });

    it("returns null when choices array is empty", async () => {
      LLMPerformanceMonitor.measureAsyncFunction.mockResolvedValue({
        output: { choices: [] },
        duration: 0.5,
      });

      const provider = makeProvider();
      const result = await provider.getChatCompletion([], { temperature: 0.7 });
      expect(result).toBeNull();
    });
  });

  // ── streamGetChatCompletion ──────────────────────────────────────────────────

  describe("streamGetChatCompletion()", () => {
    it("calls LLMPerformanceMonitor.measureStream", async () => {
      const mockStream = { [Symbol.asyncIterator]: jest.fn() };
      LLMPerformanceMonitor.measureStream.mockResolvedValue(mockStream);

      const provider = makeProvider();
      const result = await provider.streamGetChatCompletion(
        [{ role: "user", content: "Stream this" }],
        { temperature: 0.7 }
      );

      expect(LLMPerformanceMonitor.measureStream).toHaveBeenCalledWith(
        expect.objectContaining({
          modelTag: "llama-3.1-8b-uncensored",
          provider: "ModelsLabLLM",
        })
      );
      expect(result).toBe(mockStream);
    });

    it("throws for invalid model", async () => {
      const provider = makeProvider();
      provider.model = "invalid-model";
      await expect(
        provider.streamGetChatCompletion([], { temperature: 0.7 })
      ).rejects.toThrow();
    });
  });

  // ── Embedding ────────────────────────────────────────────────────────────────

  describe("embedTextInput()", () => {
    it("delegates to embedder", async () => {
      const provider = makeProvider();
      const result = await provider.embedTextInput("test text");
      expect(result).toEqual([[0.1, 0.2, 0.3]]);
    });
  });

  describe("embedChunks()", () => {
    it("delegates to embedder", async () => {
      const provider = makeProvider();
      const result = await provider.embedChunks(["chunk 1", "chunk 2"]);
      expect(result).toEqual([[0.1, 0.2, 0.3]]);
    });
  });
});
