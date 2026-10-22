jest.mock("ollama", () => ({
  Ollama: jest.fn(),
}));

const { Ollama } = require("ollama");
const { OllamaAILLM } = require("../../../../utils/AiProviders/ollama");

const ORIGINAL_ENV = process.env;

function showInfo(contextLength) {
  return {
    capabilities: ["completion"],
    model_info: { "llama.context_length": contextLength },
  };
}

beforeEach(() => {
  process.env = {
    ...ORIGINAL_ENV,
    OLLAMA_BASE_PATH: "http://127.0.0.1:11434",
  };
  delete process.env.OLLAMA_AUTH_TOKEN;
  OllamaAILLM.modelContextWindows = {};
  jest.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
  OllamaAILLM.modelContextWindows = {};
  jest.restoreAllMocks();
});

describe("OllamaAILLM.cacheContextWindows", () => {
  it("keeps context windows for models whose show calls succeed when one model fails", async () => {
    const list = jest.fn().mockResolvedValue({
      models: [{ name: "llama3:latest" }, { name: "retired:latest" }],
    });
    const show = jest.fn(async ({ model }) => {
      if (model === "retired:latest") {
        const error = new Error("retired:latest was retired on 2024-01-01");
        error.status_code = 410;
        throw error;
      }
      return showInfo(8192);
    });
    Ollama.mockImplementation(() => ({ list, show }));

    await OllamaAILLM.cacheContextWindows(true);

    expect(OllamaAILLM.modelContextWindows["llama3:latest"]).toBe(8192);
    expect(OllamaAILLM.modelContextWindows).not.toHaveProperty("retired:latest");
  });
});
