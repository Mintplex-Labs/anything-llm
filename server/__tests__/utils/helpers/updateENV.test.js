/* eslint-env jest */
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
  process.env = { ...ORIGINAL_ENV };
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
  jest.restoreAllMocks();
});

// Ollama and LLMAn keep-alive timeouts are validated by the shared
// `isInteger` check in updateENV.js. The timeouts are passed to the
// providers as whole seconds, so fractional values must be rejected
// at save time instead of silently stored.
describe("isInteger validation for keep-alive timeouts", () => {
  it.each([
    ["OllamaLLMKeepAliveSeconds", "OLLAMA_KEEP_ALIVE_TIMEOUT"],
    ["LlmmanKeepAliveSeconds", "LLMMAN_KEEP_ALIVE_TIMEOUT"],
  ])(
    "rejects a fractional value for %s without touching the env",
    async (key, envKey) => {
      process.env[envKey] = "30";
      const { error } = await updateENV({ [key]: "5.5" });
      expect(error).toContain("Value must be a whole number");
      expect(process.env[envKey]).toBe("30");
    }
  );

  it.each([
    ["OllamaLLMKeepAliveSeconds", "OLLAMA_KEEP_ALIVE_TIMEOUT"],
    ["LlmmanKeepAliveSeconds", "LLMMAN_KEEP_ALIVE_TIMEOUT"],
  ])("accepts whole numbers for %s", async (key, envKey) => {
    const { error } = await updateENV({ [key]: "30" });
    expect(error).toBe(false);
    expect(process.env[envKey]).toBe("30");
  });

  it.each([
    ["OllamaLLMKeepAliveSeconds", "OLLAMA_KEEP_ALIVE_TIMEOUT"],
    ["LlmmanKeepAliveSeconds", "LLMMAN_KEEP_ALIVE_TIMEOUT"],
  ])(
    "accepts zero for %s (zero means the field is omitted)",
    async (key, envKey) => {
      const { error } = await updateENV({ [key]: "0" });
      expect(error).toBe(false);
      expect(process.env[envKey]).toBe("0");
    }
  );

  it("still rejects a non-numeric value", async () => {
    process.env.OLLAMA_KEEP_ALIVE_TIMEOUT = "30";
    const { error } = await updateENV({
      OllamaLLMKeepAliveSeconds: "abc",
    });
    expect(error).toContain("Value must be a number");
    expect(process.env.OLLAMA_KEEP_ALIVE_TIMEOUT).toBe("30");
  });
});
