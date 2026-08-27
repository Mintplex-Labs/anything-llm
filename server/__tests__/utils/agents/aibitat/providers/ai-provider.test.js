const Provider = require("../../../../../utils/agents/aibitat/providers/ai-provider.js");
const UnTooled = require("../../../../../utils/agents/aibitat/providers/helpers/untooled.js");
const InheritMultiple = require("../../../../../utils/agents/aibitat/providers/helpers/classes.js");
const { MODEL_PRICING } = require("../../../../../utils/helpers/modelPricing");

class TestProvider extends Provider {
  model = "test-model";

  constructor() {
    super(null);
  }
}

// Mirrors how the UnTooled providers (LM Studio, LocalAI, Cerebras, etc.) are
// declared - Provider's fields and methods arrive via the InheritMultiple mixin
// rather than a direct prototype chain.
class MixinProvider extends InheritMultiple([Provider, UnTooled]) {
  model = "mixin-model";
}

describe("Provider usage tracking", () => {
  test("recordUsage accumulates tokens across multiple completions", () => {
    const provider = new TestProvider();

    provider.resetUsage();
    provider.recordUsage({
      prompt_tokens: 100,
      completion_tokens: 20,
      total_tokens: 120,
    });

    provider.resetUsage();
    provider.recordUsage({
      prompt_tokens: 250,
      completion_tokens: 40,
      total_tokens: 290,
    });

    provider.resetUsage();
    provider.recordUsage({
      prompt_tokens: 400,
      completion_tokens: 60,
      total_tokens: 460,
    });

    // getUsage only reflects the most recent completion
    const last = provider.getUsage();
    expect(last.prompt_tokens).toBe(400);
    expect(last.completion_tokens).toBe(60);
    expect(last.total_tokens).toBe(460);

    // getCumulativeUsage reflects the sum of all completions
    const totals = provider.getCumulativeUsage();
    expect(totals.prompt_tokens).toBe(750);
    expect(totals.completion_tokens).toBe(120);
    expect(totals.total_tokens).toBe(870);
    expect(totals.model).toBe("test-model");
    expect(totals.provider).toBe("TestProvider");
  });

  test("resetUsage does not clear the accumulated totals", () => {
    const provider = new TestProvider();

    provider.resetUsage();
    provider.recordUsage({
      prompt_tokens: 100,
      completion_tokens: 20,
      total_tokens: 120,
    });

    provider.resetUsage();
    expect(provider.getUsage().total_tokens).toBe(0);
    expect(provider.getCumulativeUsage().total_tokens).toBe(120);
  });

  test("resetCumulativeUsage zeroes the accumulated totals", () => {
    const provider = new TestProvider();

    provider.resetUsage();
    provider.recordUsage({
      prompt_tokens: 100,
      completion_tokens: 20,
      total_tokens: 120,
    });

    provider.resetCumulativeUsage();
    const totals = provider.getCumulativeUsage();
    expect(totals.prompt_tokens).toBe(0);
    expect(totals.completion_tokens).toBe(0);
    expect(totals.total_tokens).toBe(0);
    expect(totals.model).toBe(null);
    expect(totals.provider).toBe(null);
  });

  test("recordUsage normalizes Anthropic-style input/output token keys", () => {
    const provider = new TestProvider();

    provider.resetUsage();
    provider.recordUsage({ input_tokens: 30, output_tokens: 10 });

    provider.resetUsage();
    provider.recordUsage({ input_tokens: 50, output_tokens: 15 });

    const totals = provider.getCumulativeUsage();
    expect(totals.prompt_tokens).toBe(80);
    expect(totals.completion_tokens).toBe(25);
    expect(totals.total_tokens).toBe(105);
  });

  test("instances do not share an accumulator", () => {
    const providerA = new TestProvider();
    const providerB = new TestProvider();

    providerA.resetUsage();
    providerA.recordUsage({
      prompt_tokens: 100,
      completion_tokens: 20,
      total_tokens: 120,
    });

    expect(providerA.getCumulativeUsage().total_tokens).toBe(120);
    expect(providerB.getCumulativeUsage().total_tokens).toBe(0);
  });

  test("duration accumulates and outputTps is recomputed from run totals", () => {
    const provider = new TestProvider();

    provider.applyUsage({
      prompt_tokens: 100,
      completion_tokens: 30,
      total_tokens: 130,
      duration: 2,
    });
    provider.applyUsage({
      prompt_tokens: 200,
      completion_tokens: 30,
      total_tokens: 230,
      duration: 4,
    });

    const totals = provider.getCumulativeUsage();
    expect(totals.duration).toBe(6);
    // 60 tokens over 6 seconds - not an average of the per-call TPS values.
    expect(totals.outputTps).toBe(10);
  });

  test("negative and non-finite durations do not poison the TPS math", () => {
    const provider = new TestProvider();

    provider.applyUsage({
      prompt_tokens: 100,
      completion_tokens: 30,
      total_tokens: 130,
      duration: -5,
    });
    provider.applyUsage({
      prompt_tokens: 100,
      completion_tokens: 30,
      total_tokens: 130,
      duration: Infinity,
    });

    const totals = provider.getCumulativeUsage();
    expect(totals.duration).toBe(0);
    expect(totals.outputTps).toBe(0);
  });

  test("returned usage snapshots are copies, not live references", () => {
    const provider = new TestProvider();

    provider.resetUsage();
    provider.recordUsage({
      prompt_tokens: 100,
      completion_tokens: 20,
      total_tokens: 120,
    });

    const cumulative = provider.getCumulativeUsage();
    const last = provider.getUsage();
    cumulative.prompt_tokens = 999_999;
    last.prompt_tokens = 999_999;

    expect(provider.getCumulativeUsage().prompt_tokens).toBe(100);
    expect(provider.getUsage().prompt_tokens).toBe(100);
  });

  test("accumulation works through InheritMultiple mixin providers", () => {
    const providerA = new MixinProvider();
    const providerB = new MixinProvider();

    providerA.resetUsage();
    providerA.recordUsage({
      prompt_tokens: 100,
      completion_tokens: 10,
      total_tokens: 110,
    });

    providerA.resetUsage();
    providerA.recordUsage({
      prompt_tokens: 300,
      completion_tokens: 30,
      total_tokens: 330,
    });

    expect(providerA.getCumulativeUsage().total_tokens).toBe(440);
    expect(providerA.getUsage().total_tokens).toBe(330);
    expect(providerB.getCumulativeUsage().total_tokens).toBe(0);

    providerA.resetCumulativeUsage();
    expect(providerA.getCumulativeUsage().total_tokens).toBe(0);
  });
});

describe("Provider cost accumulation", () => {
  afterEach(() => jest.restoreAllMocks());

  test("cost is priced per-call and summed even when the model changes mid-run", () => {
    // Return a different rate per model so a sum over per-call breakdowns is
    // distinguishable from pricing the summed totals at the final model's rate.
    jest
      .spyOn(MODEL_PRICING, "getCostBreakdown")
      .mockImplementation((_slug, model, { prompt_tokens }) => {
        const rate = model === "expensive-model" ? 10 : 1;
        const inputCost = (prompt_tokens / 1_000_000) * rate;
        return { inputCost, outputCost: 0, totalCost: inputCost };
      });

    const provider = new TestProvider();
    provider.providerSlug = "openai";

    provider.resetUsage();
    provider.recordUsage({ prompt_tokens: 1_000_000, completion_tokens: 10 });

    provider.model = "expensive-model";
    provider.resetUsage();
    provider.recordUsage({ prompt_tokens: 1_000_000, completion_tokens: 10 });

    expect(provider.getUsage().totalCost).toBe(10);
    const totals = provider.getCumulativeUsage();
    expect(totals.inputCost).toBe(11);
    expect(totals.outputCost).toBe(0);
    expect(totals.totalCost).toBe(11);
  });

  test("cost fields stay absent when pricing is unknown", () => {
    jest.spyOn(MODEL_PRICING, "getCostBreakdown").mockReturnValue(null);

    const provider = new TestProvider();
    provider.resetUsage();
    provider.recordUsage({ prompt_tokens: 100, completion_tokens: 10 });

    expect(provider.getUsage()).not.toHaveProperty("totalCost");
    expect(provider.getCumulativeUsage()).not.toHaveProperty("totalCost");
  });

  test("a partially priceable run sums only the priced calls", () => {
    jest
      .spyOn(MODEL_PRICING, "getCostBreakdown")
      .mockImplementation((_slug, model) =>
        model === "unknown-model"
          ? null
          : { inputCost: 1, outputCost: 2, totalCost: 3 }
      );

    const provider = new TestProvider();
    provider.providerSlug = "openai";

    provider.resetUsage();
    provider.recordUsage({ prompt_tokens: 100, completion_tokens: 10 });

    provider.model = "unknown-model";
    provider.resetUsage();
    provider.recordUsage({ prompt_tokens: 100, completion_tokens: 10 });

    // The unpriced call contributes nothing, but the priced call's cost survives.
    expect(provider.getUsage()).not.toHaveProperty("totalCost");
    expect(provider.getCumulativeUsage().totalCost).toBe(3);
  });
});

describe("Provider usage robustness against malformed payloads", () => {
  test.each([
    ["null", null],
    ["undefined", undefined],
    ["a string", "not-a-usage-object"],
    ["a number", 42],
    ["a boolean", true],
    ["an array", [100, 20, 120]],
    ["an empty object", {}],
  ])("recordUsage does not crash when the payload is %s", (_label, payload) => {
    const provider = new TestProvider();

    provider.resetUsage();
    expect(() => provider.recordUsage(payload)).not.toThrow();

    const totals = provider.getCumulativeUsage();
    expect(totals.prompt_tokens).toBe(0);
    expect(totals.completion_tokens).toBe(0);
    expect(totals.total_tokens).toBe(0);
  });

  test.each([
    ["null", null],
    ["undefined", undefined],
    ["a string", "not-a-usage-object"],
    ["an array", [100, 20, 120]],
  ])("applyUsage does not crash when the payload is %s", (_label, payload) => {
    const provider = new TestProvider();
    expect(() => provider.applyUsage(payload)).not.toThrow();
    expect(provider.getCumulativeUsage().total_tokens).toBe(0);
  });

  test("coerces numeric strings instead of concatenating them", () => {
    const provider = new TestProvider();

    provider.resetUsage();
    provider.recordUsage({
      prompt_tokens: "100",
      completion_tokens: "20",
      total_tokens: "120",
    });

    provider.resetUsage();
    provider.recordUsage({
      prompt_tokens: "50",
      completion_tokens: "5",
      total_tokens: "55",
    });

    const totals = provider.getCumulativeUsage();
    expect(totals.prompt_tokens).toBe(150);
    expect(totals.completion_tokens).toBe(25);
    expect(totals.total_tokens).toBe(175);
    expect(typeof totals.total_tokens).toBe("number");
  });

  test("treats negative, NaN, and non-finite token counts as zero", () => {
    const provider = new TestProvider();

    provider.resetUsage();
    provider.recordUsage({
      prompt_tokens: -100,
      completion_tokens: NaN,
      total_tokens: Infinity,
    });

    const totals = provider.getCumulativeUsage();
    expect(totals.prompt_tokens).toBe(0);
    expect(totals.completion_tokens).toBe(0);
    expect(totals.total_tokens).toBe(0);
  });

  test("treats non-numeric token values as zero", () => {
    const provider = new TestProvider();

    provider.resetUsage();
    provider.recordUsage({
      prompt_tokens: { nested: 100 },
      completion_tokens: "twenty",
      total_tokens: () => 120,
    });

    const totals = provider.getCumulativeUsage();
    expect(totals.prompt_tokens).toBe(0);
    expect(totals.completion_tokens).toBe(0);
    expect(totals.total_tokens).toBe(0);
  });

  test("garbage payloads between valid completions do not corrupt totals", () => {
    const provider = new TestProvider();

    provider.resetUsage();
    provider.recordUsage({
      prompt_tokens: 100,
      completion_tokens: 20,
      total_tokens: 120,
    });

    provider.resetUsage();
    provider.recordUsage(null);

    provider.resetUsage();
    provider.recordUsage({ prompt_tokens: "junk", completion_tokens: -5 });

    provider.resetUsage();
    provider.recordUsage({
      prompt_tokens: 50,
      completion_tokens: 10,
      total_tokens: 60,
    });

    const totals = provider.getCumulativeUsage();
    expect(totals.prompt_tokens).toBe(150);
    expect(totals.completion_tokens).toBe(30);
    expect(totals.total_tokens).toBe(180);
  });

  test("mixin providers survive malformed payloads too", () => {
    const provider = new MixinProvider();

    provider.resetUsage();
    expect(() => provider.recordUsage(null)).not.toThrow();
    expect(() => provider.recordUsage([1, 2, 3])).not.toThrow();

    provider.resetUsage();
    provider.recordUsage({
      prompt_tokens: 100,
      completion_tokens: 10,
      total_tokens: 110,
    });

    expect(provider.getCumulativeUsage().total_tokens).toBe(110);
  });
});
