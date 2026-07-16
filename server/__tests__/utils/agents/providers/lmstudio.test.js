process.env.STORAGE_DIR = __dirname;
process.env.NODE_ENV = "test";
process.env.LMSTUDIO_MODEL_PREF = "test-model";
process.env.LMSTUDIO_BASE_PATH = "http://localhost:1234";

const mockCreate = jest.fn();

jest.mock("openai", () =>
  jest.fn(() => ({
    chat: { completions: { create: mockCreate } },
  }))
);
jest.mock("../../../../utils/AiProviders/lmStudio", () => ({
  LMStudioLLM: {
    cacheContextWindows: jest.fn(),
    promptWindowLimit: jest.fn(() => 4096),
    maxContextWindow: jest.fn(() => 4096),
  },
  parseLMStudioBasePath: jest.fn((url) => url),
}));

const LMStudioProvider = require("../../../../utils/agents/aibitat/providers/lmstudio");

describe("LMStudioProvider cancellation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreate.mockResolvedValue(
      (async function* () {
        yield { choices: [{ delta: { content: "partial" } }] };
      })()
    );
  });

  it("passes an abortable signal to streamed completion requests", async () => {
    const provider = new LMStudioProvider({ model: "test-model" });

    await provider.stream([{ role: "user", content: "hello" }]);

    const requestOptions = mockCreate.mock.calls[0][1];
    expect(requestOptions.signal).toBeInstanceOf(AbortSignal);
    expect(requestOptions.signal.aborted).toBe(false);

    provider.abort();

    expect(requestOptions.signal.aborted).toBe(true);
  });
});
