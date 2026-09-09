jest.mock("../../../../models/telemetry", () => ({ Telemetry: {} }));
jest.mock("../../../../models/eventLogs", () => ({
  EventLogs: { logEvent: jest.fn() },
}));
jest.mock("../../../../utils/vectorStore/resetAllVectorStores", () => ({
  resetAllVectorStores: jest.fn(),
}));

const {
  OpenRouterLLM,
  openRouterServiceTier,
  fetchOpenRouterServiceTiers,
} = require("../../../../utils/AiProviders/openRouter");
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
  it.each(["default", "flex", "priority"])("accepts %s", async (tier) => {
    const { error } = await updateENV({ OpenRouterServiceTier: tier });
    expect(error).toBe(false);
    expect(process.env.OPENROUTER_SERVICE_TIER).toBe(tier);
  });

  it("rejects anything else without touching the env", async () => {
    process.env.OPENROUTER_SERVICE_TIER = "flex";
    const { error } = await updateENV({ OpenRouterServiceTier: "scale" });
    expect(error).toContain("Invalid service tier");
    expect(process.env.OPENROUTER_SERVICE_TIER).toBe("flex");
  });
});

describe("openRouterServiceTier", () => {
  it.each(["flex", "priority"])("returns %s as-is", (tier) => {
    process.env.OPENROUTER_SERVICE_TIER = tier;
    expect(openRouterServiceTier()).toBe(tier);
  });

  it.each([
    ["unset", undefined],
    ["empty", ""],
    ["default", "default"],
    ["an unknown value", "bogus"],
    ["wrong casing", "FLEX"],
    ["surrounding whitespace", " flex "],
  ])("returns undefined for %s", (_label, value) => {
    if (value === undefined) delete process.env.OPENROUTER_SERVICE_TIER;
    else process.env.OPENROUTER_SERVICE_TIER = value;
    expect(openRouterServiceTier()).toBeUndefined();
  });
});

describe("fetchOpenRouterServiceTiers", () => {
  function mockEndpoints(tags) {
    jest.spyOn(global, "fetch").mockResolvedValue({
      json: async () => ({ data: { endpoints: tags.map((tag) => ({ tag })) } }),
    });
  }

  it("detects flex and maps fast to priority", async () => {
    mockEndpoints(["openai/flex", "azure", "openai", "openai/fast"]);
    expect(await fetchOpenRouterServiceTiers("openai/gpt-5")).toEqual([
      "flex",
      "priority",
    ]);
  });

  it("reads the tier from the last tag segment", async () => {
    mockEndpoints(["google-vertex/global/priority", "google-ai-studio/flex"]);
    expect(await fetchOpenRouterServiceTiers("google/gemini")).toEqual([
      "flex",
      "priority",
    ]);
  });

  it("returns only the tiers present", async () => {
    mockEndpoints(["openai/priority", "openai"]);
    expect(await fetchOpenRouterServiceTiers("m")).toEqual(["priority"]);
  });

  it("returns an empty list when no tier endpoints exist", async () => {
    mockEndpoints(["openai", "azure", "deepinfra/fp8"]);
    expect(await fetchOpenRouterServiceTiers("m")).toEqual([]);
  });

  it("returns an empty list for an unknown model or a failed request", async () => {
    jest
      .spyOn(global, "fetch")
      .mockResolvedValueOnce({
        json: async () => ({ error: { message: "Not Found", code: 404 } }),
      })
      .mockRejectedValueOnce(new Error("network"));
    expect(await fetchOpenRouterServiceTiers("foo/bar")).toEqual([]);
    expect(await fetchOpenRouterServiceTiers("foo/bar")).toEqual([]);
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

  describe.each(["flex", "priority"])("with the tier set to %s", (tier) => {
    it.each(callSites)("%s sends it", async (_label, run) => {
      process.env.OPENROUTER_SERVICE_TIER = tier;
      const create = fakeCreate();
      await run(create);
      expect(create).toHaveBeenCalledTimes(1);
      expect(create.mock.calls[0][0].service_tier).toBe(tier);
    });
  });

  it.each(callSites)(
    "%s sends an unchanged request body at the default tier",
    async (_label, run) => {
      process.env.OPENROUTER_SERVICE_TIER = "default";
      const create = fakeCreate();
      await run(create);
      const wireBody = JSON.parse(JSON.stringify(create.mock.calls[0][0]));
      expect(wireBody).not.toHaveProperty("service_tier");
    }
  );
});
