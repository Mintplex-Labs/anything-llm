/* eslint-env jest */

jest.mock("../../../utils/AiProviders/openRouter", () => ({
  fetchOpenRouterModels: jest.fn(),
}));
jest.mock("../../../utils/AiProviders/modelMap", () => ({
  MODEL_MAP: {
    get: jest.fn(() => null),
  },
}));
jest.mock("../../../utils/EmbeddingEngines/openRouter", () => ({
  fetchOpenRouterEmbeddingModels: jest.fn(),
}));
jest.mock("../../../utils/AiProviders/apipie", () => ({
  fetchApiPieModels: jest.fn(),
}));
jest.mock("../../../utils/AiProviders/perplexity", () => ({
  perplexityModels: jest.fn(),
}));
jest.mock("../../../utils/AiProviders/fireworksAi", () => ({
  fireworksAiModels: jest.fn(),
}));
jest.mock("../../../utils/TextToSpeech/elevenLabs", () => ({
  ElevenLabsTTS: { voices: jest.fn() },
}));
jest.mock("../../../utils/AiProviders/novita", () => ({
  fetchNovitaModels: jest.fn(),
}));
jest.mock("../../../utils/AiProviders/lmStudio", () => ({
  parseLMStudioBasePath: jest.fn(),
}));
jest.mock("../../../utils/AiProviders/nvidiaNim", () => ({
  parseNvidiaNimBasePath: jest.fn(),
}));
jest.mock("../../../utils/AiProviders/ppio", () => ({
  fetchPPIOModels: jest.fn(),
}));
jest.mock(
  "../../../utils/AiProviders/gemini",
  () => ({
    GeminiLLM: {
      fetchModels: jest.fn(),
    },
  }),
  { virtual: true }
);
jest.mock("../../../utils/AiProviders/cometapi", () => ({
  fetchCometApiModels: jest.fn(),
}));
jest.mock("../../../utils/AiProviders/foundry", () => ({
  parseFoundryBasePath: jest.fn(),
}));
jest.mock("../../../utils/AiProviders/dockerModelRunner", () => ({
  getDockerModels: jest.fn(),
}));
jest.mock("../../../utils/AiProviders/lemonade", () => ({
  getAllLemonadeModels: jest.fn(),
}));

const { GeminiLLM } = require("../../../utils/AiProviders/gemini");

describe("getCustomModels Gemini", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
    GeminiLLM.fetchModels.mockReset();
    process.env = {
      ...originalEnv,
      GEMINI_API_KEYS: "saved-bad,saved-good",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  test("tries provided Gemini key input until a valid key returns models", async () => {
    GeminiLLM.fetchModels.mockImplementation(async (apiKey) => {
      if (apiKey === "provided-bad") throw new Error("API key not valid");
      return [
        {
          id: "gemini-2.0-flash-lite",
          name: "Gemini 2.0 Flash Lite",
          experimental: false,
        },
      ];
    });

    const { getCustomModels } = require("../../../utils/helpers/customModels");
    const result = await getCustomModels("gemini", "provided-bad\nprovided-good");

    expect(GeminiLLM.fetchModels.mock.calls.map(([apiKey]) => apiKey)).toEqual([
      "provided-bad",
      "provided-good",
    ]);
    expect(result.models).toEqual([
      {
        id: "gemini-2.0-flash-lite",
        name: "Gemini 2.0 Flash Lite",
        experimental: false,
      },
    ]);
  });
});
