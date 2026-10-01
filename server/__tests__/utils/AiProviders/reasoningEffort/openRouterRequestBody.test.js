const { OpenRouterLLM } = require("../../../../utils/AiProviders/openRouter");
const {
  OpenRouterProvider,
} = require("../../../../utils/agents/aibitat/providers");

const ORIGINAL_ENV = process.env;
const messages = [
  { role: "system", content: "You are helpful." },
  { role: "user", content: "hi" },
];

beforeEach(() => {
  process.env = { ...ORIGINAL_ENV, OPENROUTER_API_KEY: "test-key" };
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
  jest.restoreAllMocks();
});

function openRouterWithCapturedBody(model = "qwen/qwen3-30b-a3b") {
  const llm = new OpenRouterLLM(null, model);
  jest.spyOn(llm, "isValidChatCompletionModel").mockResolvedValue(true);
  const create = jest.fn(() => {
    const output = {
      choices: [{ message: { content: "hello" } }],
      usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
    };
    return Object.assign(Promise.resolve(output), {
      catch: () => Promise.resolve(output),
    });
  });
  llm.openai = { chat: { completions: { create } } };
  return { llm, body: () => create.mock.calls[0][0] };
}

describe("OpenRouterLLM reasoning request body", () => {
  it.each([
    ["high", { effort: "high" }],
    ["on", { enabled: true }],
    ["off", { enabled: false }],
  ])(
    "sends %s as the unified reasoning param instead of include_reasoning",
    async (reasoningEffort, reasoning) => {
      const { llm, body } = openRouterWithCapturedBody();
      await llm.getChatCompletion(messages, { reasoningEffort });
      expect(body().reasoning).toEqual(reasoning);
      expect(body()).not.toHaveProperty("include_reasoning");
    }
  );

  it.each([null, undefined])(
    "keeps the legacy include_reasoning flag when the effort is %j",
    async (reasoningEffort) => {
      const { llm, body } = openRouterWithCapturedBody();
      await llm.getChatCompletion(messages, { reasoningEffort });
      expect(body().include_reasoning).toBe(true);
      expect(body()).not.toHaveProperty("reasoning");
    }
  );

  it("sends the reasoning param on streamed requests", async () => {
    const { llm, body } = openRouterWithCapturedBody();
    await llm.streamGetChatCompletion(messages, { reasoningEffort: "off" });
    expect(body().reasoning).toEqual({ enabled: false });
    expect(body()).not.toHaveProperty("include_reasoning");
    expect(body().stream).toBe(true);
  });
});

describe("OpenRouterProvider reasoning config", () => {
  it("maps the validated effort for agent requests", () => {
    const provider = new OpenRouterProvider({
      model: "openai/gpt-5.1",
      reasoningEffort: "low",
    });
    expect(provider.reasoningConfig).toEqual({ reasoning: { effort: "low" } });
  });

  it("sends nothing without an effort", () => {
    const provider = new OpenRouterProvider({ model: "openai/gpt-5.1" });
    expect(provider.reasoningConfig).toEqual({});
  });
});
