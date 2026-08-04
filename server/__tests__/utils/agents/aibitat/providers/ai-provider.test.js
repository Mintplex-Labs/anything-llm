const Provider = require("../../../../../utils/agents/aibitat/providers/ai-provider.js");
const UnTooled = require("../../../../../utils/agents/aibitat/providers/helpers/untooled.js");
const InheritMultiple = require("../../../../../utils/agents/aibitat/providers/helpers/classes.js");

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
