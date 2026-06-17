// Unit tests for the Atlas Cloud LLM provider integration.
process.env.NODE_ENV = "test";

// The provider transitively pulls in heavy runtime helpers (embedders, the
// OpenAI SDK, chat helpers). We mock those so the unit under test stays focused
// on the Atlas Cloud configuration/wiring and runs without a full install.
jest.mock("../../../utils/EmbeddingEngines/native", () => ({
  NativeEmbedder: class NativeEmbedder {},
}));
jest.mock("../../../utils/helpers/chat/LLMPerformanceMonitor", () => ({
  LLMPerformanceMonitor: {},
}));
jest.mock("../../../utils/helpers/chat/responses", () => ({
  formatChatHistory: () => [],
  writeResponseChunk: () => {},
  clientAbortedHandler: () => {},
}));
jest.mock("../../../endpoints/utils", () => ({
  getAnythingLLMUserAgent: () => "AnythingLLM-Test",
}));
jest.mock("../../../utils/http", () => ({
  toValidNumber: (value, fallback) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  },
}));
jest.mock(
  "openai",
  () => ({
    OpenAI: class OpenAI {
      constructor(config) {
        this.config = config;
      }
    },
  }),
  { virtual: true }
);
jest.mock("uuid", () => ({ v4: () => "test-uuid" }), { virtual: true });

const {
  ATLAS_CLOUD_MODELS,
  atlasCloudModels,
} = require("../../../utils/AiProviders/atlasCloud/models");

describe("Atlas Cloud model catalog", () => {
  test("exposes the curated 59-model catalog", () => {
    expect(ATLAS_CLOUD_MODELS.length).toBe(59);
  });

  test("normalizes models to { id, name, organization }", () => {
    const models = atlasCloudModels();
    expect(models.length).toBe(ATLAS_CLOUD_MODELS.length);
    for (const model of models) {
      expect(typeof model.id).toBe("string");
      expect(model.id.length).toBeGreaterThan(0);
      expect(model.name).toBe(model.id);
      expect(typeof model.organization).toBe("string");
    }
  });

  test("includes the default reasoning model", () => {
    const ids = atlasCloudModels().map((m) => m.id);
    expect(ids).toContain("deepseek-ai/deepseek-v4-pro");
  });

  test("has no duplicate model ids", () => {
    const ids = atlasCloudModels().map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("AtlasCloudLLM provider", () => {
  const ORIGINAL_KEY = process.env.ATLAS_CLOUD_API_KEY;
  afterEach(() => {
    if (ORIGINAL_KEY === undefined) delete process.env.ATLAS_CLOUD_API_KEY;
    else process.env.ATLAS_CLOUD_API_KEY = ORIGINAL_KEY;
    delete process.env.ATLAS_CLOUD_MODEL_PREF;
    delete process.env.ATLAS_CLOUD_MODEL_TOKEN_LIMIT;
  });

  test("throws when no API key is configured", () => {
    delete process.env.ATLAS_CLOUD_API_KEY;
    const { AtlasCloudLLM } = require("../../../utils/AiProviders/atlasCloud");
    expect(() => new AtlasCloudLLM()).toThrow(/API key/i);
  });

  test("uses the fixed Atlas Cloud base path and default model", () => {
    process.env.ATLAS_CLOUD_API_KEY = "test-key";
    const { AtlasCloudLLM } = require("../../../utils/AiProviders/atlasCloud");
    const client = new AtlasCloudLLM();
    expect(client.basePath).toBe("https://api.atlascloud.ai/v1");
    expect(client.model).toBe("deepseek-ai/deepseek-v4-pro");
    expect(client.streamingEnabled()).toBe(true);
  });

  test("respects a configured model preference and token limit", () => {
    process.env.ATLAS_CLOUD_API_KEY = "test-key";
    process.env.ATLAS_CLOUD_MODEL_PREF = "qwen/qwen3.6-plus";
    process.env.ATLAS_CLOUD_MODEL_TOKEN_LIMIT = "32768";
    const { AtlasCloudLLM } = require("../../../utils/AiProviders/atlasCloud");
    const client = new AtlasCloudLLM();
    expect(client.model).toBe("qwen/qwen3.6-plus");
    expect(client.promptWindowLimit()).toBe(32768);
  });
});
