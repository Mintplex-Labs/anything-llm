process.env.STORAGE_DIR = __dirname;
process.env.NODE_ENV = "test";

const mockAbort = jest.fn();

jest.mock("ollama", () => ({
  Ollama: jest.fn(() => ({ abort: mockAbort })),
}));
jest.mock("../../../../utils/AiProviders/ollama", () => ({
  OllamaAILLM: {
    applyOllamaFetch: jest.fn(),
  },
}));

const OllamaProvider = require("../../../../utils/agents/aibitat/providers/ollama");

describe("OllamaProvider cancellation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("aborts the active Ollama stream", () => {
    const provider = new OllamaProvider({ model: "test-model" });
    const signal = provider.requestOptions().signal;

    provider.abort();

    expect(mockAbort).toHaveBeenCalledTimes(1);
    expect(signal.aborted).toBe(true);
  });
});
