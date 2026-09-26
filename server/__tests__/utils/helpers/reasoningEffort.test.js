const { MODEL_PRICING } = require("../../../utils/helpers/modelPricing");
const {
  PROVIDER_REASONING_EFFORTS,
  modelsDevReasoningCapabilities,
  reasoningParams,
  getReasoningCapabilities,
  resolveReasoningEffort,
  createWithReasoningSummaryFallback,
  resetReasoningSummaryFallback,
  capabilityCache,
} = require("../../../utils/helpers/reasoningEffort");

const ORIGINAL_ENV = process.env;

beforeEach(() => {
  process.env = { ...ORIGINAL_ENV };
  delete process.env.REASONING_EFFORT;
  capabilityCache.clear();
  jest.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
  jest.restoreAllMocks();
  jest.useRealTimers();
});

/**
 * Minimal LLM connector stand-in with a mocked capability lookup.
 * @param {object|Error} capabilities - resolved value, or an Error to reject with
 */
function fakeLLM(capabilities, { model = "test-model", basePath } = {}) {
  return {
    model,
    basePath,
    getModelCapabilities: jest.fn(async () => {
      if (capabilities instanceof Error) throw capabilities;
      return capabilities;
    }),
  };
}

// Reasoning options as models.dev lists them (copied from api.json).
const MODELS_DEV = {
  openai: {
    "gpt-5.1": [{ type: "effort", values: ["none", "low", "medium", "high"] }],
    "gpt-5": [{ type: "effort", values: ["minimal", "low", "medium", "high"] }],
    "gpt-5-pro": [{ type: "effort", values: ["high"] }],
    "gpt-5.4-pro": [{ type: "effort", values: ["medium", "high", "xhigh"] }],
    "gpt-5.6": [
      {
        type: "effort",
        values: ["none", "low", "medium", "high", "xhigh", "max"],
      },
    ],
    "future-model": [{ type: "effort", values: ["low", "ultra"] }],
  },
  gemini: {
    "gemini-3.8-flash": [{ type: "effort", values: ["low", "medium", "high"] }],
    "gemini-3.5-flash": [
      { type: "effort", values: ["minimal", "low", "medium", "high"] },
    ],
    "gemini-2.5-pro": [{ type: "budget_tokens", min: 128, max: 32768 }],
    "gemini-2.5-flash": [
      { type: "toggle" },
      { type: "budget_tokens", min: 0, max: 24576 },
    ],
    "gemini-small-budget": [{ type: "budget_tokens", min: 2048, max: 4096 }],
    "gemma-4-31b-it": [{ type: "toggle" }],
  },
  deepseek: {
    "deepseek-flash": [
      { type: "toggle" },
      { type: "effort", values: ["low", "high", "max"] },
    ],
    "deepseek-toggle-only": [{ type: "toggle" }],
  },
};

function mockModelsDev(table = MODELS_DEV) {
  jest
    .spyOn(MODEL_PRICING, "getReasoningOptions")
    .mockImplementation((provider, model) =>
      table === null ? null : (table[provider]?.[model] ?? [])
    );
}

describe("modelsDevReasoningCapabilities", () => {
  beforeEach(() => mockModelsDev());

  it.each([
    ["openai", "gpt-5.1", ["off", "low", "medium", "high"]],
    ["openai", "gpt-5", ["minimal", "low", "medium", "high"]],
    ["openai", "gpt-5-pro", ["high"]],
    ["openai", "gpt-5.4-pro", ["medium", "high", "xhigh"]],
    ["openai", "gpt-5.6", ["off", "low", "medium", "high", "xhigh", "max"]],
    ["gemini", "gemini-3.8-flash", ["low", "medium", "high"]],
    ["gemini", "gemini-3.5-flash", ["minimal", "low", "medium", "high"]],
    ["gemini", "gemini-2.5-pro", ["low", "medium", "high"]],
    ["gemini", "gemini-2.5-flash", ["off", "low", "medium", "high"]],
    ["deepseek", "deepseek-flash", ["off", "on", "low", "high", "max"]],
    ["deepseek", "deepseek-toggle-only", ["off", "on"]],
  ])("%s %s offers %j", (provider, model, expected) => {
    expect(modelsDevReasoningCapabilities(provider, model)).toEqual({
      reasoning: true,
      reasoningOptions: expected,
    });
  });

  it("drops levels it has no way to send", () => {
    expect(
      modelsDevReasoningCapabilities("openai", "future-model").reasoningOptions
    ).toEqual(["low"]);
  });

  it("offers nothing for a Gemini toggle without a budget", () => {
    expect(modelsDevReasoningCapabilities("gemini", "gemma-4-31b-it")).toEqual({
      reasoning: false,
      reasoningOptions: [],
    });
  });

  it("only maps none to off for OpenAI", () => {
    mockModelsDev({
      deepseek: { x: [{ type: "effort", values: ["none", "low"] }] },
    });
    expect(
      modelsDevReasoningCapabilities("deepseek", "x").reasoningOptions
    ).toEqual(["low"]);
  });

  it.each(["gpt-4.1", "gpt-5-chat-latest", "", undefined])(
    "offers nothing for %j, which models.dev does not list as reasoning",
    (model) => {
      expect(modelsDevReasoningCapabilities("openai", model)).toEqual({
        reasoning: false,
        reasoningOptions: [],
      });
    }
  );

  it("reports unknown until the models.dev data has loaded", () => {
    mockModelsDev(null);
    expect(modelsDevReasoningCapabilities("openai", "gpt-5.1")).toEqual({
      reasoning: "unknown",
      reasoningOptions: [],
    });
  });

  it.each([
    [[{ type: "effort" }]],
    [[{ type: "effort", values: "high" }]],
    [[null, { values: ["high"] }]],
    [[{ type: "budget_tokens" }]],
  ])("tolerates malformed options %j", (options) => {
    mockModelsDev({ openai: { m: options }, gemini: { m: options } });
    expect(() => modelsDevReasoningCapabilities("openai", "m")).not.toThrow();
    expect(
      modelsDevReasoningCapabilities("openai", "m").reasoningOptions
    ).toEqual([]);
  });
});

describe("PROVIDER_REASONING_EFFORTS local providers", () => {
  it("has no static list for cloud providers", () => {
    for (const provider of ["openai", "anthropic", "gemini", "deepseek"])
      expect(PROVIDER_REASONING_EFFORTS[provider]).toBeUndefined();
  });

  it.each(["ollama", "lemonade"])(
    "%s gives gpt-oss levels and other models a toggle",
    (provider) => {
      expect(PROVIDER_REASONING_EFFORTS[provider]("gpt-oss:20b")).toEqual([
        "low",
        "medium",
        "high",
      ]);
      expect(PROVIDER_REASONING_EFFORTS[provider]("qwen3:8b")).toEqual([
        "on",
        "off",
      ]);
      expect(PROVIDER_REASONING_EFFORTS[provider]()).toEqual(["on", "off"]);
    }
  );
});

describe("reasoningParams", () => {
  beforeEach(() => mockModelsDev());

  const thinkingConfig = (thinking_config) => ({
    extra_body: { google: { thinking_config } },
  });

  it.each([
    ["openai", "off", null, { reasoning: { effort: "none" } }],
    [
      "openai",
      "xhigh",
      null,
      { reasoning: { effort: "xhigh", summary: "auto" } },
    ],
    ["openai", "max", null, { reasoning: { effort: "max", summary: "auto" } }],
    ["anthropic", "max", null, { output_config: { effort: "max" } }],
    [
      "gemini",
      "minimal",
      "gemini-3.5-flash",
      thinkingConfig({ thinking_level: "minimal", include_thoughts: true }),
    ],
    [
      "gemini",
      "high",
      "gemini-3.8-flash",
      thinkingConfig({ thinking_level: "high", include_thoughts: true }),
    ],
    [
      "gemini",
      "low",
      "gemini-2.5-pro",
      thinkingConfig({ thinking_budget: 1024, include_thoughts: true }),
    ],
    [
      "gemini",
      "medium",
      "gemini-2.5-pro",
      thinkingConfig({ thinking_budget: 8192, include_thoughts: true }),
    ],
    [
      "gemini",
      "high",
      "gemini-2.5-flash",
      thinkingConfig({ thinking_budget: 24576, include_thoughts: true }),
    ],
    [
      "gemini",
      "off",
      "gemini-2.5-flash",
      thinkingConfig({ thinking_budget: 0 }),
    ],
    [
      "gemini",
      "low",
      "gemini-small-budget",
      thinkingConfig({ thinking_budget: 2048, include_thoughts: true }),
    ],
    [
      "gemini",
      "high",
      "gemini-small-budget",
      thinkingConfig({ thinking_budget: 4096, include_thoughts: true }),
    ],
    ["ollama", "on", null, { think: true }],
    ["ollama", "off", null, { think: false }],
    ["ollama", "high", null, { think: "high" }],
    ["lmstudio", "off", null, { reasoning_effort: "none" }],
    ["lmstudio", "on", null, { reasoning_effort: "medium" }],
    ["lmstudio", "low", null, { reasoning_effort: "low" }],
    [
      "lemonade",
      "on",
      null,
      { chat_template_kwargs: { enable_thinking: true } },
    ],
    [
      "lemonade",
      "low",
      null,
      { chat_template_kwargs: { reasoning_effort: "low" } },
    ],
    ["deepseek", "on", null, { thinking: { type: "enabled" } }],
    ["deepseek", "off", null, { thinking: { type: "disabled" } }],
    [
      "deepseek",
      "max",
      null,
      { thinking: { type: "enabled" }, reasoning_effort: "max" },
    ],
  ])("%s %s (%s) -> %j", (provider, effort, model, expected) => {
    expect(reasoningParams(provider, effort, model)).toEqual(expected);
  });

  it("sends Gemini a thinking level when models.dev data is unavailable", () => {
    mockModelsDev(null);
    expect(reasoningParams("gemini", "high", "gemini-2.5-pro")).toEqual(
      thinkingConfig({ thinking_level: "high", include_thoughts: true })
    );
  });

  it.each([null, undefined, ""])(
    "sends nothing when the effort is %j",
    (effort) => {
      for (const provider of ["openai", "anthropic", "gemini", "deepseek"])
        expect(reasoningParams(provider, effort, "m")).toEqual({});
    }
  );

  it("sends nothing for a provider without reasoning controls", () => {
    expect(reasoningParams("groq", "high")).toEqual({});
    expect(reasoningParams(undefined, "high")).toEqual({});
  });
});

describe("getReasoningCapabilities", () => {
  it("reports no reasoning for connectors without a capability lookup", async () => {
    expect(await getReasoningCapabilities({ model: "x" })).toEqual({
      reasoning: false,
      reasoningOptions: [],
    });
    expect(await getReasoningCapabilities(null)).toEqual({
      reasoning: false,
      reasoningOptions: [],
    });
  });

  it("caches a successful lookup per connector + model", async () => {
    const llm = fakeLLM({ reasoning: true, reasoningOptions: ["low"] });
    await getReasoningCapabilities(llm);
    const second = await getReasoningCapabilities(llm);
    expect(second).toEqual({ reasoning: true, reasoningOptions: ["low"] });
    expect(llm.getModelCapabilities).toHaveBeenCalledTimes(1);

    const other = fakeLLM(
      { reasoning: true, reasoningOptions: ["high"] },
      { model: "other-model" }
    );
    expect((await getReasoningCapabilities(other)).reasoningOptions).toEqual([
      "high",
    ]);
  });

  it("keys the cache by base path so two servers do not share results", async () => {
    const a = fakeLLM(
      { reasoning: true, reasoningOptions: ["on"] },
      { basePath: "http://a:11434" }
    );
    const b = fakeLLM(
      { reasoning: false, reasoningOptions: [] },
      { basePath: "http://b:11434" }
    );
    await getReasoningCapabilities(a);
    expect((await getReasoningCapabilities(b)).reasoning).toBe(false);
    expect(b.getModelCapabilities).toHaveBeenCalledTimes(1);
  });

  it("caches a model without reasoning support", async () => {
    const llm = fakeLLM({ reasoning: false, reasoningOptions: [] });
    await getReasoningCapabilities(llm);
    await getReasoningCapabilities(llm);
    expect(llm.getModelCapabilities).toHaveBeenCalledTimes(1);
  });

  it("does not cache an unknown result so the next call retries", async () => {
    const llm = fakeLLM({ reasoning: "unknown", reasoningOptions: [] });
    await getReasoningCapabilities(llm);
    await getReasoningCapabilities(llm);
    expect(llm.getModelCapabilities).toHaveBeenCalledTimes(2);
  });

  it("treats a throwing lookup as unknown", async () => {
    const llm = fakeLLM(new Error("network down"));
    expect(await getReasoningCapabilities(llm)).toEqual({
      reasoning: "unknown",
      reasoningOptions: [],
    });
    await getReasoningCapabilities(llm);
    expect(llm.getModelCapabilities).toHaveBeenCalledTimes(2);
  });

  it.each([undefined, null, "low", { low: true }])(
    "normalizes reasoningOptions %j to an empty list",
    async (reasoningOptions) => {
      const llm = fakeLLM({ reasoning: true, reasoningOptions });
      expect((await getReasoningCapabilities(llm)).reasoningOptions).toEqual(
        []
      );
    }
  );

  it("normalizes a lookup without a reasoning key to unknown", async () => {
    const llm = fakeLLM({ tools: true });
    expect((await getReasoningCapabilities(llm)).reasoning).toBe("unknown");
  });

  it("refreshes the lookup once the cache entry expires", async () => {
    jest.useFakeTimers();
    const llm = fakeLLM({ reasoning: true, reasoningOptions: ["low"] });
    await getReasoningCapabilities(llm);
    jest.advanceTimersByTime(5 * 60 * 1000 - 1);
    await getReasoningCapabilities(llm);
    expect(llm.getModelCapabilities).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(2);
    await getReasoningCapabilities(llm);
    expect(llm.getModelCapabilities).toHaveBeenCalledTimes(2);
  });
});

describe("resolveReasoningEffort", () => {
  const supportsLowHigh = () =>
    fakeLLM({ reasoning: true, reasoningOptions: ["low", "high"] });

  it("uses the session effort when the model supports it", async () => {
    expect(await resolveReasoningEffort(supportsLowHigh(), "low")).toBe("low");
  });

  it("returns null without a session effort", async () => {
    expect(await resolveReasoningEffort(supportsLowHigh())).toBeNull();
    expect(await resolveReasoningEffort(supportsLowHigh(), null)).toBeNull();
    expect(await resolveReasoningEffort(supportsLowHigh(), "")).toBeNull();
  });

  it("ignores the REASONING_EFFORT env var", async () => {
    process.env.REASONING_EFFORT = "high";
    expect(await resolveReasoningEffort(supportsLowHigh())).toBeNull();
  });

  it("drops a level the model does not support", async () => {
    expect(await resolveReasoningEffort(supportsLowHigh(), "off")).toBeNull();
  });

  it("never sends anything to a model without reasoning support", async () => {
    const llm = fakeLLM({ reasoning: false, reasoningOptions: [] });
    expect(await resolveReasoningEffort(llm, "low")).toBeNull();
  });

  it("drops the effort when the capability lookup fails", async () => {
    const llm = fakeLLM(new Error("timeout"));
    expect(await resolveReasoningEffort(llm, "low")).toBeNull();
  });

  it.each(["turbo", "LOW", " low", "null", "none", 123, true, {}, ["low"]])(
    "ignores the unknown session value %j without a lookup",
    async (sessionEffort) => {
      const llm = supportsLowHigh();
      expect(await resolveReasoningEffort(llm, sessionEffort)).toBeNull();
      expect(llm.getModelCapabilities).not.toHaveBeenCalled();
    }
  );

  it("does not build or query the connector when no effort is set", async () => {
    const factory = jest.fn(() => supportsLowHigh());
    expect(await resolveReasoningEffort(factory)).toBeNull();
    expect(await resolveReasoningEffort(factory, "")).toBeNull();
    expect(factory).not.toHaveBeenCalled();
  });

  it("builds the connector lazily from a factory", async () => {
    const llm = supportsLowHigh();
    const factory = jest.fn(() => llm);
    expect(await resolveReasoningEffort(factory, "low")).toBe("low");
    expect(factory).toHaveBeenCalledTimes(1);
  });

  it("resolves to null when the connector factory throws", async () => {
    const factory = () => {
      throw new Error("No API key was set.");
    };
    await expect(resolveReasoningEffort(factory, "low")).resolves.toBe(null);
  });

  it("resolves to null without a connector", async () => {
    expect(await resolveReasoningEffort(null, "low")).toBeNull();
    expect(await resolveReasoningEffort(() => null, "low")).toBeNull();
  });
});

describe("createWithReasoningSummaryFallback", () => {
  const body = {
    model: "gpt-5.1",
    reasoning: { effort: "high", summary: "auto" },
  };
  const refusal = Object.assign(
    new Error(
      "400 Your organization must be verified to generate reasoning summaries."
    ),
    { status: 400 }
  );

  beforeEach(() => resetReasoningSummaryFallback());

  it("sends the body unchanged when summaries are allowed", async () => {
    const create = jest.fn(async () => "ok");
    expect(await createWithReasoningSummaryFallback(create, body)).toBe("ok");
    expect(create).toHaveBeenCalledWith(body);
  });

  it("retries once without the summary when the organization is refused", async () => {
    const create = jest
      .fn()
      .mockRejectedValueOnce(refusal)
      .mockResolvedValueOnce("ok");
    expect(await createWithReasoningSummaryFallback(create, body)).toBe("ok");
    expect(create).toHaveBeenCalledTimes(2);
    expect(create.mock.calls[1][0]).toEqual({
      model: "gpt-5.1",
      reasoning: { effort: "high" },
    });
  });

  it("stops requesting summaries after a refusal", async () => {
    const create = jest
      .fn()
      .mockRejectedValueOnce(refusal)
      .mockResolvedValue("ok");
    await createWithReasoningSummaryFallback(create, body);
    await createWithReasoningSummaryFallback(create, body);
    expect(create).toHaveBeenCalledTimes(3);
    expect(create.mock.calls[2][0].reasoning).toEqual({ effort: "high" });
  });

  it.each([
    [
      "another 400",
      Object.assign(new Error("400 Invalid value: 'low'"), { status: 400 }),
    ],
    [
      "a rate limit",
      Object.assign(new Error("429 Rate limit reached"), { status: 429 }),
    ],
    ["a network error", new Error("fetch failed")],
  ])("rethrows %s without retrying", async (_, error) => {
    const create = jest.fn().mockRejectedValue(error);
    await expect(createWithReasoningSummaryFallback(create, body)).rejects.toBe(
      error
    );
    expect(create).toHaveBeenCalledTimes(1);
  });

  it("rethrows a summary refusal when no summary was requested", async () => {
    const create = jest.fn().mockRejectedValue(refusal);
    await expect(
      createWithReasoningSummaryFallback(create, { model: "gpt-5.1" })
    ).rejects.toBe(refusal);
    expect(create).toHaveBeenCalledTimes(1);
  });
});
