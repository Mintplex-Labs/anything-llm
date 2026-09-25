const {
  REASONING_EFFORT_LEVELS,
  PROVIDER_REASONING_EFFORTS,
  reasoningParams,
  getReasoningCapabilities,
  resolveReasoningEffort,
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

describe("PROVIDER_REASONING_EFFORTS.openai", () => {
  it.each([
    ["gpt-5", ["minimal", "low", "medium", "high"]],
    ["gpt-5-mini", ["minimal", "low", "medium", "high"]],
    ["gpt-5-nano", ["minimal", "low", "medium", "high"]],
    ["gpt-5-2025-08-07", ["minimal", "low", "medium", "high"]],
    ["gpt-5.1", ["off", "low", "medium", "high"]],
    ["gpt-5.4-mini", ["off", "low", "medium", "high"]],
    ["gpt-5.6-sol", ["off", "low", "medium", "high"]],
    ["gpt-5.12", ["off", "low", "medium", "high"]],
    ["gpt-5-pro", ["high"]],
    ["gpt-5-pro-2025-10-06", ["high"]],
    ["gpt-5.2-pro", ["medium", "high"]],
    ["gpt-5.5-pro", ["medium", "high"]],
    ["o1", ["low", "medium", "high"]],
    ["o3-pro", ["low", "medium", "high"]],
    ["o4-mini", ["low", "medium", "high"]],
  ])("%s accepts %j", (model, expected) => {
    expect(PROVIDER_REASONING_EFFORTS.openai(model)).toEqual(expected);
  });

  it.each([
    // Unverified or known to reject reasoning params.
    "gpt-5-chat-latest",
    "gpt-5.1-chat-latest",
    "gpt-5.1-codex",
    "o1-mini",
    "omni-moderation-latest",
    "o",
    "gpt-4.1",
    "gpt-4o",
    "GPT-5",
    " gpt-5",
    "gpt-5 ",
    "my-gpt-5",
    "",
  ])("%j gets no reasoning controls", (model) => {
    expect(PROVIDER_REASONING_EFFORTS.openai(model)).toEqual([]);
  });

  it("handles a missing model", () => {
    expect(PROVIDER_REASONING_EFFORTS.openai()).toEqual([]);
    expect(PROVIDER_REASONING_EFFORTS.openai(undefined)).toEqual([]);
  });
});

describe("PROVIDER_REASONING_EFFORTS other providers", () => {
  it("has no static list for providers with a live lookup", () => {
    expect(PROVIDER_REASONING_EFFORTS.anthropic).toBeUndefined();
  });

  it("gemini pro models reject minimal", () => {
    expect(PROVIDER_REASONING_EFFORTS.gemini("gemini-2.5-pro")).toEqual([
      "low",
      "medium",
      "high",
    ]);
    expect(PROVIDER_REASONING_EFFORTS.gemini("gemini-2.5-flash")).toEqual([
      "minimal",
      "low",
      "medium",
      "high",
    ]);
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

  it("only lists levels every caller can store", () => {
    for (const listFor of Object.values(PROVIDER_REASONING_EFFORTS)) {
      for (const model of ["", "gpt-oss", "gemini-pro", "gpt-5", "gpt-5.1"])
        for (const level of listFor(model))
          expect(REASONING_EFFORT_LEVELS).toContain(level);
    }
  });
});

describe("reasoningParams", () => {
  it.each([
    ["openai", "off", { reasoning: { effort: "none" } }],
    ["openai", "minimal", { reasoning: { effort: "minimal" } }],
    ["openai", "high", { reasoning: { effort: "high" } }],
    ["anthropic", "max", { output_config: { effort: "max" } }],
    ["anthropic", "xhigh", { output_config: { effort: "xhigh" } }],
    ["gemini", "minimal", { reasoning_effort: "minimal" }],
    ["ollama", "on", { think: true }],
    ["ollama", "off", { think: false }],
    ["ollama", "high", { think: "high" }],
    ["lmstudio", "off", { reasoning_effort: "none" }],
    ["lmstudio", "on", { reasoning_effort: "medium" }],
    ["lmstudio", "low", { reasoning_effort: "low" }],
    ["lemonade", "on", { chat_template_kwargs: { enable_thinking: true } }],
    ["lemonade", "off", { chat_template_kwargs: { enable_thinking: false } }],
    ["lemonade", "low", { chat_template_kwargs: { reasoning_effort: "low" } }],
    ["deepseek", "on", { thinking: { type: "enabled" } }],
    ["deepseek", "off", { thinking: { type: "disabled" } }],
  ])("%s %s -> %j", (provider, effort, expected) => {
    expect(reasoningParams(provider, effort)).toEqual(expected);
  });

  it.each([null, undefined, ""])(
    "sends nothing when the effort is %j",
    (effort) => {
      for (const provider of ["openai", "anthropic", "ollama", "deepseek"])
        expect(reasoningParams(provider, effort)).toEqual({});
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

  it("prefers the session effort over the workspace and system defaults", async () => {
    process.env.REASONING_EFFORT = "high";
    expect(
      await resolveReasoningEffort(
        { reasoningEffort: "high" },
        supportsLowHigh(),
        "low"
      )
    ).toBe("low");
  });

  it("falls back to the workspace default, then the system default", async () => {
    process.env.REASONING_EFFORT = "high";
    expect(
      await resolveReasoningEffort(
        { reasoningEffort: "low" },
        supportsLowHigh()
      )
    ).toBe("low");
    expect(
      await resolveReasoningEffort({ reasoningEffort: null }, supportsLowHigh())
    ).toBe("high");
    expect(await resolveReasoningEffort(null, supportsLowHigh())).toBe("high");
  });

  it("skips a level the model does not support and uses the next one", async () => {
    process.env.REASONING_EFFORT = "high";
    expect(
      await resolveReasoningEffort(
        { reasoningEffort: "max" },
        supportsLowHigh(),
        "off"
      )
    ).toBe("high");
  });

  it("returns null when no candidate is supported", async () => {
    process.env.REASONING_EFFORT = "max";
    expect(
      await resolveReasoningEffort(
        { reasoningEffort: "xhigh" },
        supportsLowHigh(),
        "off"
      )
    ).toBeNull();
  });

  it("never sends anything to a model without reasoning support", async () => {
    const llm = fakeLLM({ reasoning: false, reasoningOptions: [] });
    expect(
      await resolveReasoningEffort({ reasoningEffort: "low" }, llm, "low")
    ).toBeNull();
  });

  it("drops the effort when the capability lookup fails", async () => {
    const llm = fakeLLM(new Error("timeout"));
    expect(
      await resolveReasoningEffort({ reasoningEffort: "low" }, llm)
    ).toBeNull();
  });

  it.each(["turbo", "LOW", " low", "null", "none", 123, true, {}, ["low"]])(
    "ignores the unknown session value %j",
    async (sessionEffort) => {
      expect(
        await resolveReasoningEffort(
          { reasoningEffort: "high" },
          supportsLowHigh(),
          sessionEffort
        )
      ).toBe("high");
    }
  );

  it("ignores an unknown system default", async () => {
    process.env.REASONING_EFFORT = "turbo";
    expect(await resolveReasoningEffort(null, supportsLowHigh())).toBeNull();
  });

  it("does not build or query the connector when no effort is set", async () => {
    const factory = jest.fn(() => supportsLowHigh());
    expect(await resolveReasoningEffort(null, factory)).toBeNull();
    expect(await resolveReasoningEffort({}, factory, "")).toBeNull();
    expect(factory).not.toHaveBeenCalled();
  });

  it("builds the connector lazily from a factory", async () => {
    const llm = supportsLowHigh();
    const factory = jest.fn(() => llm);
    expect(await resolveReasoningEffort(null, factory, "low")).toBe("low");
    expect(factory).toHaveBeenCalledTimes(1);
  });

  it("resolves to null when the connector factory throws", async () => {
    const factory = () => {
      throw new Error("No API key was set.");
    };
    await expect(resolveReasoningEffort(null, factory, "low")).resolves.toBe(
      null
    );
  });

  it("resolves to null without a connector", async () => {
    expect(await resolveReasoningEffort(null, null, "low")).toBeNull();
    expect(await resolveReasoningEffort(null, () => null, "low")).toBeNull();
  });
});
