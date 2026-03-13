/* eslint-env jest */

describe("Gemini key pool", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      GEMINI_API_KEYS: "llm-primary,\nllm-secondary,llm-primary",
      GEMINI_API_KEY: "llm-legacy",
      GEMINI_EMBEDDING_API_KEYS: "embed-primary, embed-secondary",
      GEMINI_EMBEDDING_API_KEY: "embed-legacy",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  test("merges multiline multi-key input with legacy keys and deduplicates values", () => {
    const { getGeminiApiKeys, resetGeminiKeyRotation } = require("../../../utils/gemini/keyPool");
    resetGeminiKeyRotation();

    expect(getGeminiApiKeys("llm")).toEqual([
      "llm-primary",
      "llm-secondary",
      "llm-legacy",
    ]);
    expect(getGeminiApiKeys("embedding")).toEqual([
      "embed-primary",
      "embed-secondary",
      "embed-legacy",
    ]);
  });

  test("retries retryable Gemini failures and promotes the successful key", async () => {
    const { withGeminiKeyFallback, resetGeminiKeyRotation } = require("../../../utils/gemini/keyPool");
    resetGeminiKeyRotation();

    const firstCalls = [];
    const result = await withGeminiKeyFallback({
      provider: "llm",
      operation: async (apiKey) => {
        firstCalls.push(apiKey);
        if (apiKey === "llm-primary") {
          const error = new Error("API key not valid. Please pass a valid API key.");
          error.status = 401;
          throw error;
        }
        return { ok: true, apiKey };
      },
    });

    expect(result).toEqual({ ok: true, apiKey: "llm-secondary" });
    expect(firstCalls).toEqual(["llm-primary", "llm-secondary"]);
    expect(process.env.GEMINI_API_KEY).toBe("llm-secondary");

    const secondCalls = [];
    await withGeminiKeyFallback({
      provider: "llm",
      operation: async (apiKey) => {
        secondCalls.push(apiKey);
        return { ok: true, apiKey };
      },
    });

    expect(secondCalls).toEqual(["llm-secondary"]);
  });

  test("classifies quota and auth errors as retryable but not generic server errors", () => {
    const { isRetryableGeminiKeyError } = require("../../../utils/gemini/keyPool");

    expect(
      isRetryableGeminiKeyError({ status: 429, message: "Rate limit exceeded" })
    ).toBe(true);
    expect(
      isRetryableGeminiKeyError({
        status: 400,
        message: "400 status code (no body)",
      })
    ).toBe(true);
    expect(
      isRetryableGeminiKeyError({ status: 403, message: "quota exceeded" })
    ).toBe(true);
    expect(
      isRetryableGeminiKeyError({ status: 500, message: "internal server error" })
    ).toBe(false);
  });
});
