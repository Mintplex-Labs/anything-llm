const AIbitat = require("../../../../utils/agents/aibitat");
const { MODEL_PRICING } = require("../../../../utils/helpers/modelPricing");

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

describe("AIbitat model loading status", () => {
  const makeProvider = (isModelLoaded) => ({
    model: "llama3:latest",
    isModelLoaded: jest.fn().mockResolvedValue(isModelLoaded),
    stream: jest.fn().mockResolvedValue({ textResponse: "ok" }),
    resetCumulativeUsage: jest.fn(),
    getCumulativeUsage: jest.fn().mockReturnValue({}),
  });

  const makeAibitat = (provider) => {
    const aibitat = new AIbitat({ provider: "openai", model: "gpt-4o" });
    aibitat.providerInstance = provider;
    aibitat.introspect = jest.fn();
    return aibitat;
  };

  test("reports a loading status before the first completion when the model is not loaded", async () => {
    const provider = makeProvider(false);
    const aibitat = makeAibitat(provider);

    await aibitat.handleAsyncExecution([], []);

    expect(aibitat.introspect).toHaveBeenCalledTimes(1);
    expect(aibitat.introspect.mock.calls[0][0]).toContain(
      "Loading llama3:latest into memory"
    );
    expect(provider.isModelLoaded.mock.invocationCallOrder[0]).toBeLessThan(
      provider.stream.mock.invocationCallOrder[0]
    );
  });

  test("reports nothing when the model is already loaded", async () => {
    const aibitat = makeAibitat(makeProvider(true));

    await aibitat.handleAsyncExecution([], []);

    expect(aibitat.introspect).not.toHaveBeenCalled();
  });

  test("only checks at the start of a turn, not on tool follow-up completions", async () => {
    const provider = makeProvider(false);
    const aibitat = makeAibitat(provider);

    await aibitat.handleAsyncExecution([], [], null, 1);

    expect(provider.isModelLoaded).not.toHaveBeenCalled();
    expect(aibitat.introspect).not.toHaveBeenCalled();
  });
});

describe("AIbitat.getProviderForConfig temperature wiring", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = {
      ...ORIGINAL_ENV,
      OPEN_AI_KEY: "test-key",
      ANTHROPIC_API_KEY: "test-key",
      GENERIC_OPEN_AI_BASE_PATH: "http://localhost:8080/v1",
    };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  function providerTemperature(provider, model, temperature) {
    const aibitat = new AIbitat({ provider, model, temperature });
    return aibitat.getProviderForConfig({ ...aibitat.defaultProvider })
      .temperature;
  }

  test("applies the workspace temperature to the agent provider", () => {
    expect(providerTemperature("generic-openai", "gemma4", 0.3)).toBe(0.3);
    expect(providerTemperature("openai", "gpt-4o", "0.3")).toBe(0.3);
    expect(providerTemperature("openai", "gpt-4o", 0)).toBe(0);
  });

  test.each([null, undefined, "", "abc", -1])(
    "leaves temperature unset for %p",
    (value) => {
      expect(
        providerTemperature("generic-openai", "gemma4", value)
      ).toBeUndefined();
    }
  );

  test("leaves temperature unset for models that reject it", () => {
    expect(providerTemperature("openai", "gpt-5", 0.3)).toBeUndefined();
    expect(
      providerTemperature("anthropic", "claude-3-5-haiku-latest", 0.3)
    ).toBeUndefined();
  });
});
