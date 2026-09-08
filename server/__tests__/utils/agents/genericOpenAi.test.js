const providerPath = "../../../utils/agents/aibitat/providers/genericOpenAi";

jest.mock("openai", () => jest.fn(() => ({})), { virtual: true });
jest.mock("../../../utils/agents/aibitat/providers/ai-provider", () => {
  return class Provider {
    async supportsNativeToolCalling() {
      return false;
    }
  };
});
// Isolate the provider's request construction from tool selection and parsing.
jest.mock("../../../utils/agents/aibitat/providers/helpers/untooled", () => {
  return class UnTooled {
    async stream(messages, functions, request) {
      return request({ messages });
    }
  };
});
jest.mock("../../../utils/agents/aibitat/providers/helpers/tooled", () => ({}));
jest.mock("../../../utils/http/index.js", () => ({
  toValidNumber: (value, fallback) => Number(value) || fallback,
}));
jest.mock("../../../endpoints/utils", () => ({
  getAnythingLLMUserAgent: () => "anythingllm-test",
}));
jest.mock("../../../utils/AiProviders/genericOpenAi", () => ({
  GenericOpenAiLLM: { parseCustomHeaders: () => ({}) },
}));
jest.mock("../../../utils/helpers/attachments", () => ({}));

const GenericOpenAiProvider = require(providerPath);

describe("Generic OpenAI UnTooled streaming output budget", () => {
  const originalMaxTokens = process.env.GENERIC_OPEN_AI_MAX_TOKENS;

  afterEach(() => {
    if (originalMaxTokens === undefined)
      delete process.env.GENERIC_OPEN_AI_MAX_TOKENS;
    else process.env.GENERIC_OPEN_AI_MAX_TOKENS = originalMaxTokens;
  });

  it.each([
    ["128", 128],
    ["2048", 2048],
    [undefined, 1024],
  ])("forwards budget %s as max_tokens %i", async (configured, expected) => {
    if (configured === undefined) delete process.env.GENERIC_OPEN_AI_MAX_TOKENS;
    else process.env.GENERIC_OPEN_AI_MAX_TOKENS = configured;

    const provider = new GenericOpenAiProvider({ model: "test-model" });
    const response = { stream: "sentinel" };
    const create = jest.fn().mockResolvedValue(response);
    provider._client = { chat: { completions: { create } } };
    const messages = [{ role: "user", content: "Explain a long topic." }];

    await expect(provider.stream(messages)).resolves.toBe(response);
    expect(create).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledWith({
      model: "test-model",
      stream: true,
      messages,
      max_tokens: expected,
    });
  });
});
