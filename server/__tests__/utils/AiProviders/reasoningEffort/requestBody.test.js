const { OpenAiLLM } = require("../../../../utils/AiProviders/openAi");
const { AnthropicLLM } = require("../../../../utils/AiProviders/anthropic");

const ORIGINAL_ENV = process.env;
const messages = [
  { role: "system", content: "You are helpful." },
  { role: "user", content: "hi" },
];

beforeEach(() => {
  process.env = {
    ...ORIGINAL_ENV,
    OPEN_AI_KEY: "test-key",
    ANTHROPIC_API_KEY: "test-key",
  };
  // The constructor looks up the model's max tokens - keep the tests offline.
  jest.spyOn(AnthropicLLM, "fetchModelMaxTokens").mockResolvedValue(1024);
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
  jest.restoreAllMocks();
});

function openAiWithCapturedBody(model) {
  const llm = new OpenAiLLM(null, model);
  const create = jest.fn(async () => ({
    output_text: "hello",
    usage: { input_tokens: 1, output_tokens: 1, total_tokens: 2 },
  }));
  llm.openai = { responses: { create } };
  return { llm, body: () => create.mock.calls[0][0] };
}

function anthropicWithCapturedBody(model) {
  const llm = new AnthropicLLM(null, model);
  const stream = jest.fn(() => ({
    finalMessage: async () => ({
      content: [{ text: "hello" }],
      usage: { input_tokens: 1, output_tokens: 1 },
    }),
  }));
  llm.anthropic = { messages: { stream } };
  return { llm, body: () => stream.mock.calls[0][0] };
}

describe("OpenAiLLM reasoning request body", () => {
  it("sends the effort in the Responses API format", async () => {
    const { llm, body } = openAiWithCapturedBody("gpt-5.1");
    await llm.getChatCompletion(messages, { reasoningEffort: "off" });
    expect(body().reasoning).toEqual({ effort: "none" });
  });

  it.each([null, undefined])(
    "omits the reasoning key when the effort is %j",
    async (reasoningEffort) => {
      const { llm, body } = openAiWithCapturedBody("gpt-5.1");
      await llm.getChatCompletion(messages, { reasoningEffort });
      expect(body()).not.toHaveProperty("reasoning");
    }
  );
});

describe("AnthropicLLM reasoning request body", () => {
  it("sends the effort as output_config", async () => {
    const { llm, body } = anthropicWithCapturedBody("claude-sonnet-5");
    await llm.getChatCompletion(messages, { reasoningEffort: "max" });
    expect(body().output_config).toEqual({ effort: "max" });
    expect(body()).not.toHaveProperty("temperature");
  });

  it("omits output_config without an effort", async () => {
    const { llm, body } = anthropicWithCapturedBody("claude-haiku-4-5");
    await llm.getChatCompletion(messages, {});
    expect(body()).not.toHaveProperty("output_config");
  });

  it("omits output_config when called without options", async () => {
    const { llm, body } = anthropicWithCapturedBody("claude-haiku-4-5");
    await llm.getChatCompletion(messages);
    expect(body()).not.toHaveProperty("output_config");
  });
});
