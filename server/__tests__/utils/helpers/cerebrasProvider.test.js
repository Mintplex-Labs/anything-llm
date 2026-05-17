/* eslint-env jest */

describe("Cerebras provider integration", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    process.env = { ...ORIGINAL_ENV };
    process.env.CEREBRAS_API_KEY = "test-cerebras-key";
    process.env.CEREBRAS_MODEL_PREF = "gpt-oss-120b";
    jest.doMock("../../../utils/EmbeddingEngines/native", () => ({
      NativeEmbedder: class {},
    }));
    jest.doMock("../../../utils/helpers/chat/LLMPerformanceMonitor", () => ({
      LLMPerformanceMonitor: {},
    }));
    jest.doMock("../../../utils/helpers/chat/responses", () => ({
      handleDefaultStreamResponseV2: jest.fn(),
    }));
    jest.doMock("../../../utils/AiProviders/modelMap", () => ({
      MODEL_MAP: { get: jest.fn(() => null) },
    }));
    jest.doMock("../../../utils/AiProviders/openRouter", () => ({
      fetchOpenRouterModels: jest.fn(),
    }));
    jest.doMock("../../../utils/EmbeddingEngines/openRouter", () => ({
      fetchOpenRouterEmbeddingModels: jest.fn(),
    }));
    jest.doMock("../../../utils/AiProviders/apipie", () => ({
      fetchApiPieModels: jest.fn(),
    }));
    jest.doMock("../../../utils/AiProviders/perplexity", () => ({
      perplexityModels: jest.fn(() => ({})),
    }));
    jest.doMock("../../../utils/AiProviders/fireworksAi", () => ({
      fireworksAiModels: jest.fn(() => ({})),
    }));
    jest.doMock("../../../utils/TextToSpeech/elevenLabs", () => ({
      ElevenLabsTTS: {},
    }));
    jest.doMock("../../../utils/AiProviders/novita", () => ({
      fetchNovitaModels: jest.fn(),
    }));
    jest.doMock("../../../utils/AiProviders/lmStudio", () => ({
      parseLMStudioBasePath: jest.fn((value) => value),
    }));
    jest.doMock("../../../utils/AiProviders/nvidiaNim", () => ({
      parseNvidiaNimBasePath: jest.fn((value) => value),
    }));
    jest.doMock("../../../utils/AiProviders/ppio", () => ({
      fetchPPIOModels: jest.fn(),
    }));
    jest.doMock("../../../utils/AiProviders/gemini", () => ({
      GeminiLLM: {},
    }));
    jest.doMock("../../../utils/AiProviders/cometapi", () => ({
      fetchCometApiModels: jest.fn(),
    }));
    jest.doMock("../../../utils/AiProviders/foundry", () => ({
      parseFoundryBasePath: jest.fn((value) => value),
    }));
    jest.doMock("../../../utils/AiProviders/dockerModelRunner", () => ({
      getDockerModels: jest.fn(),
    }));
    jest.doMock("../../../utils/AiProviders/lemonade", () => ({
      getAllLemonadeModels: jest.fn(),
    }));
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  test("uses the Cerebras model preference as the base LLM model", () => {
    const { getBaseLLMProviderModel } = require("../../../utils/helpers");

    expect(getBaseLLMProviderModel({ provider: "cerebras" })).toBe(
      "gpt-oss-120b"
    );
  });

  test("exposes the Cerebras provider class", () => {
    const { getLLMProviderClass } = require("../../../utils/helpers");
    const ProviderClass = getLLMProviderClass({ provider: "cerebras" });

    expect(ProviderClass?.name).toBe("CerebrasLLM");
    expect(ProviderClass.promptWindowLimit("gpt-oss-120b")).toBeGreaterThan(0);
  });

  test("fetches Cerebras models from the OpenAI-compatible API", async () => {
    const list = jest.fn().mockResolvedValue({
      data: [
        { id: "gpt-oss-120b", owned_by: "cerebras" },
        { id: "llama3.1-8b", owned_by: "cerebras" },
      ],
    });
    const OpenAI = jest.fn().mockImplementation((config) => {
      expect(config.baseURL).toBe("https://api.cerebras.ai/v1");
      expect(config.apiKey).toBe("test-cerebras-key");
      return { models: { list } };
    });
    jest.doMock("openai", () => ({ OpenAI }), { virtual: true });

    const { getCustomModels } = require("../../../utils/helpers/customModels");
    const { models, error } = await getCustomModels("cerebras", true);

    expect(error).toBeNull();
    expect(models).toEqual([
      {
        id: "gpt-oss-120b",
        name: "gpt-oss-120b",
        organization: "cerebras",
      },
      {
        id: "llama3.1-8b",
        name: "llama3.1-8b",
        organization: "cerebras",
      },
    ]);
  });
});
