jest.mock("../../../../models/telemetry", () => ({ Telemetry: {} }));
jest.mock("../../../../models/eventLogs", () => ({
  EventLogs: { logEvent: jest.fn() },
}));
jest.mock("../../../../utils/vectorStore/resetAllVectorStores", () => ({
  resetAllVectorStores: jest.fn(),
}));

const { OpenRouterLLM } = require("../../../../utils/AiProviders/openRouter");
const OpenRouterProvider = require("../../../../utils/agents/aibitat/providers/openrouter.js");
const { updateENV } = require("../../../../utils/helpers/updateENV");

const ORIGINAL_ENV = process.env;

beforeEach(() => {
  process.env = { ...ORIGINAL_ENV, OPENROUTER_API_KEY: "test-key" };
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
  jest.restoreAllMocks();
});

describe("OPENROUTER_SERVICE_TIER validation on save", () => {
  it.each(["auto", "default", "fast", "flex", "priority", "scale"])(
    "accepts the documented tier %s",
    async (tier) => {
      const { error } = await updateENV({ OpenRouterServiceTier: tier });
      expect(error).toBe(false);
      expect(process.env.OPENROUTER_SERVICE_TIER).toBe(tier);
    }
  );

  it("rejects an undocumented tier without touching the env", async () => {
    process.env.OPENROUTER_SERVICE_TIER = "flex";
    const { error } = await updateENV({ OpenRouterServiceTier: "bogus" });
    expect(error).toContain("Invalid service tier");
    expect(process.env.OPENROUTER_SERVICE_TIER).toBe("flex");
  });
});

describe("service_tier on every OpenRouter chat completion call site", () => {
  const messages = [{ role: "user", content: "hi" }];

  function fakeCreate() {
    return jest.fn(async ({ stream }) => {
      if (!stream)
        return {
          choices: [{ message: { role: "assistant", content: "ok" } }],
          usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
        };
      return (async function* () {
        yield { choices: [{ delta: { content: "ok" }, finish_reason: "stop" }] };
      })();
    });
  }

  function chatLLM(create) {
    const llm = new OpenRouterLLM(null, "openai/gpt-5");
    llm.isValidChatCompletionModel = async () => true;
    llm.openai = { chat: { completions: { create } } };
    return llm;
  }

  function agent(create, native) {
    const provider = new OpenRouterProvider({ model: "openai/gpt-5" });
    provider.supportsNativeToolCalling = async () => native;
    provider._client = { chat: { completions: { create } } };
    return provider;
  }

  const callSites = [
    ["chat", (c) => chatLLM(c).getChatCompletion(messages, { temperature: 0.7 })],
    ["chat stream", (c) => chatLLM(c).streamGetChatCompletion(messages, { temperature: 0.7 })],
    ["agent native complete", (c) => agent(c, true).complete(messages, [])],
    ["agent native stream", (c) => agent(c, true).stream(messages, [], () => {})],
    ["agent untooled complete", (c) => agent(c, false).complete(messages, [])],
    ["agent untooled stream", (c) => agent(c, false).stream(messages, [], () => {})],
  ];

  describe.each(["flex", "priority", "scale"])("with the tier set to %s", (tier) => {
    it.each(callSites)("%s sends it", async (_label, run) => {
      process.env.OPENROUTER_SERVICE_TIER = tier;
      const create = fakeCreate();
      await run(create);
      expect(create).toHaveBeenCalledTimes(1);
      expect(create.mock.calls[0][0].service_tier).toBe(tier);
    });
  });

  it.each(callSites)(
    "%s omits the key entirely when no tier is configured",
    async (_label, run) => {
      delete process.env.OPENROUTER_SERVICE_TIER;
      const create = fakeCreate();
      await run(create);
      expect(create.mock.calls[0][0]).not.toHaveProperty("service_tier");
    }
  );
});
