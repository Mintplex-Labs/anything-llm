const AIbitat = require("../../../../utils/agents/aibitat");
const {
  MODEL_PRICING,
} = require("../../../../utils/helpers/modelPricing");

describe("AIbitat.getProviderForConfig providerSlug wiring", () => {
  const originalOpenAiKey = process.env.OPEN_AI_KEY;

  beforeAll(() => {
    // The OpenAI SDK refuses to construct without an api key - the tests
    // never make a request, so any value works.
    process.env.OPEN_AI_KEY = "test-key";
  });

  afterAll(() => {
    if (originalOpenAiKey === undefined) delete process.env.OPEN_AI_KEY;
    else process.env.OPEN_AI_KEY = originalOpenAiKey;
  });

  afterEach(() => jest.restoreAllMocks());

  test("stamps the instance with the AnythingLLM slug it was built from", () => {
    const aibitat = new AIbitat({ provider: "openai", model: "gpt-4o" });
    const provider = aibitat.getProviderForConfig({
      provider: "openai",
      model: "gpt-4o",
    });

    // The slug must be the pricing-map key ("openai"), not the class name
    // ("OpenAIProvider") that goes into the metrics `provider` field.
    expect(provider.providerSlug).toBe("openai");
    expect(provider.constructor.name).not.toBe(provider.providerSlug);
  });

  test("re-routing to a different slug stamps the new delegate's slug", () => {
    // Mirrors a model router re-route: same aibitat, a new per-turn provider
    // instance built from the resolved delegate's slug.
    const aibitat = new AIbitat({ provider: "openai", model: "gpt-4o" });
    const first = aibitat.getProviderForConfig({
      provider: "openai",
      model: "gpt-4o",
    });
    const second = aibitat.getProviderForConfig({
      provider: "ollama",
      model: "llama3:latest",
    });

    expect(first.providerSlug).toBe("openai");
    expect(second.providerSlug).toBe("ollama");
  });

  test("a pre-built provider instance keeps its own slug", () => {
    const aibitat = new AIbitat({ provider: "openai", model: "gpt-4o" });
    const prebuilt = aibitat.getProviderForConfig({
      provider: "openai",
      model: "gpt-4o",
    });
    prebuilt.providerSlug = "custom-slug";

    // config.provider as an object bypasses construction entirely - the
    // stamp must not overwrite the slug the instance already carries.
    const returned = aibitat.getProviderForConfig({ provider: prebuilt });
    expect(returned).toBe(prebuilt);
    expect(returned.providerSlug).toBe("custom-slug");
  });

  test("the stamped slug is what reaches the pricing lookup", () => {
    const getCostBreakdown = jest
      .spyOn(MODEL_PRICING, "getCostBreakdown")
      .mockReturnValue({ inputCost: 1, outputCost: 2, totalCost: 3 });

    const aibitat = new AIbitat({ provider: "openai", model: "gpt-4o" });
    const provider = aibitat.getProviderForConfig({
      provider: "openai",
      model: "gpt-4o",
    });

    provider.resetUsage();
    provider.recordUsage({ prompt_tokens: 100, completion_tokens: 10 });

    expect(getCostBreakdown).toHaveBeenCalledWith(
      "openai",
      "gpt-4o",
      expect.objectContaining({ prompt_tokens: 100, completion_tokens: 10 })
    );
    expect(provider.getCumulativeUsage().totalCost).toBe(3);
  });
});
