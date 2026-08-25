const mockOpenAiConstructor = jest.fn();

jest.mock("openai", () => ({
  OpenAI: function OpenAI(config) {
    mockOpenAiConstructor(config);
    return { chat: { completions: { create: jest.fn() } } };
  },
}));

const { LocalAiLLM } = require("../../../../utils/AiProviders/localAi");

describe("LocalAiLLM saved connections", () => {
  beforeEach(() => mockOpenAiConstructor.mockClear());

  it("keeps endpoint, credentials, model, and context isolated per instance", () => {
    const embedder = {};
    const first = new LocalAiLLM(embedder, null, {
      base_url: "http://gpu-a:8080/v1",
      api_key: "key-a",
      model: "model-a",
      token_limit: 4096,
    });
    const second = new LocalAiLLM(embedder, null, {
      base_url: "http://gpu-b:8080/v1",
      api_key: "key-b",
      model: "model-b",
      token_limit: 16384,
    });

    expect(mockOpenAiConstructor.mock.calls).toEqual([
      [{ baseURL: "http://gpu-a:8080/v1", apiKey: "key-a" }],
      [{ baseURL: "http://gpu-b:8080/v1", apiKey: "key-b" }],
    ]);
    expect(first.model).toBe("model-a");
    expect(first.promptWindowLimit()).toBe(4096);
    expect(second.model).toBe("model-b");
    expect(second.promptWindowLimit()).toBe(16384);
  });

  it("allows an explicit route model to override the connection default", () => {
    const provider = new LocalAiLLM({}, "route-model", {
      base_url: "http://gpu:8080/v1",
      model: "connection-default",
      token_limit: 8192,
    });

    expect(provider.model).toBe("route-model");
  });
});
