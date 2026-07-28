/* eslint-env jest */

describe("OllamaAILLM.applyOllamaFetch timeout selection", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
    delete process.env.OLLAMA_RESPONSE_TIMEOUT;
    delete process.env.ANYTHINGLLM_FETCH_TIMEOUT;
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  test("returns default fetch when no timeout ENVs are set", () => {
    const { OllamaAILLM } = require("../../../../utils/AiProviders/ollama");
    expect(OllamaAILLM.applyOllamaFetch()).toBe(fetch);
  });

  test("ignores OLLAMA_RESPONSE_TIMEOUT when <= 5 minutes", () => {
    process.env.OLLAMA_RESPONSE_TIMEOUT = "120000";
    const { OllamaAILLM } = require("../../../../utils/AiProviders/ollama");
    expect(OllamaAILLM.applyOllamaFetch()).toBe(fetch);
  });

  test("uses OLLAMA_RESPONSE_TIMEOUT when > 5 minutes", () => {
    process.env.OLLAMA_RESPONSE_TIMEOUT = "1800000";
    const { OllamaAILLM } = require("../../../../utils/AiProviders/ollama");
    const customFetch = OllamaAILLM.applyOllamaFetch();
    expect(customFetch).not.toBe(fetch);
    expect(typeof customFetch).toBe("function");
  });

  test("falls back to ANYTHINGLLM_FETCH_TIMEOUT when Ollama-specific unset", () => {
    process.env.ANYTHINGLLM_FETCH_TIMEOUT = "1800000";
    const { OllamaAILLM } = require("../../../../utils/AiProviders/ollama");
    const customFetch = OllamaAILLM.applyOllamaFetch();
    expect(customFetch).not.toBe(fetch);
  });
});

describe("ANYTHINGLLM_FETCH_TIMEOUT wiring", () => {
  test("updateENV maps AnythingLLMFetchTimeout", () => {
    const fs = require("fs");
    const src = fs.readFileSync(
      require.resolve("../../../../utils/helpers/updateENV"),
      "utf8"
    );
    expect(src).toMatch(
      /AnythingLLMFetchTimeout:\s*\{[\s\S]*?envKey:\s*"ANYTHINGLLM_FETCH_TIMEOUT"/
    );
  });

  test("patchSdkTimeouts documents ANYTHINGLLM_FETCH_TIMEOUT", () => {
    const fs = require("fs");
    const src = fs.readFileSync(
      require.resolve("../../../../utils/boot/patchSdkTimeouts"),
      "utf8"
    );
    expect(src).toContain("ANYTHINGLLM_FETCH_TIMEOUT");
    expect(src).toContain("600_000");
  });
});
