jest.mock("../../../models/telemetry", () => ({ Telemetry: {} }));
jest.mock("../../../models/eventLogs", () => ({
  EventLogs: { logEvent: jest.fn() },
}));
jest.mock("../../../utils/vectorStore/resetAllVectorStores", () => ({
  resetAllVectorStores: jest.fn(),
}));

const { updateENV } = require("../../../utils/helpers/updateENV");

const ORIGINAL_ENV = process.env;

beforeEach(() => {
  process.env = {
    ...ORIGINAL_ENV,
    LLM_PROVIDER: "openai",
    OPEN_MODEL_PREF: "gpt-5.1",
    OLLAMA_MODEL_PREF: "qwen3:8b",
    REASONING_EFFORT: "high",
  };
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
});

describe("updateENV system reasoning effort", () => {
  it("accepts every stored level and clears on empty", async () => {
    for (const level of [
      "off",
      "on",
      "minimal",
      "low",
      "medium",
      "high",
      "xhigh",
      "max",
    ]) {
      expect((await updateENV({ ReasoningEffort: level })).error).toBe(false);
      expect(process.env.REASONING_EFFORT).toBe(level);
    }
    expect((await updateENV({ ReasoningEffort: "" })).error).toBe(false);
    expect(process.env.REASONING_EFFORT).toBe("");
  });

  it.each(["turbo", "LOW", "none"])(
    "rejects the unknown level %j",
    async (level) => {
      const { error } = await updateENV({ ReasoningEffort: level });
      expect(error).toBeTruthy();
      expect(process.env.REASONING_EFFORT).toBe("high");
    }
  );

  it("clears the effort when the provider changes without a new one", async () => {
    await updateENV({ LLMProvider: "groq" });
    expect(process.env.REASONING_EFFORT).toBe("");
  });

  it("clears the effort when the model of a reasoning provider changes", async () => {
    await updateENV({ LLMProvider: "openai", OpenAiModelPref: "gpt-4.1" });
    expect(process.env.REASONING_EFFORT).toBe("");
  });

  it("keeps an effort chosen alongside the new model", async () => {
    await updateENV({
      LLMProvider: "openai",
      OpenAiModelPref: "gpt-5.4",
      ReasoningEffort: "low",
    });
    expect(process.env.REASONING_EFFORT).toBe("low");
  });

  it("keeps the effort when the provider and model are resubmitted unchanged", async () => {
    await updateENV({ LLMProvider: "openai", OpenAiModelPref: "gpt-5.1" });
    expect(process.env.REASONING_EFFORT).toBe("high");
  });

  it("keeps the effort for unrelated settings", async () => {
    await updateENV({ OpenRouterServiceTier: "auto" });
    expect(process.env.REASONING_EFFORT).toBe("high");
  });
});
