/* eslint-env jest */
const { resolveTemperature } = require("../../../utils/helpers");

// Only OpenAI, Azure, Anthropic, and Bedrock define a `modelSupportsTemperature`
// guard. Every other provider takes the same parse-or-undefined path, so one
// unguarded provider is enough to cover all of them.

describe("resolveTemperature", () => {
  const originalAzureModelType = process.env.AZURE_OPENAI_MODEL_TYPE;
  afterEach(() => {
    process.env.AZURE_OPENAI_MODEL_TYPE = originalAzureModelType;
  });

  test("returns undefined for unset or invalid values", () => {
    expect(resolveTemperature("openai", "gpt-4o", null)).toBeUndefined();
    expect(resolveTemperature("openai", "gpt-4o", undefined)).toBeUndefined();
    expect(resolveTemperature("openai", "gpt-4o", "")).toBeUndefined();
    expect(resolveTemperature("openai", "gpt-4o", "abc")).toBeUndefined();
    expect(resolveTemperature("openai", "gpt-4o", -0.5)).toBeUndefined();
  });

  test("keeps zero and parses numeric strings", () => {
    expect(resolveTemperature("openai", "gpt-4o", 0)).toBe(0);
    expect(resolveTemperature("openai", "gpt-4o", "0")).toBe(0);
    expect(resolveTemperature("openai", "gpt-4o", "0.7")).toBe(0.7);
    expect(resolveTemperature("openai", "gpt-4o", 1.2)).toBe(1.2);
  });

  test("passes through for providers without a temperature guard", () => {
    expect(resolveTemperature("ollama", "llama3", 0.4)).toBe(0.4);
    expect(resolveTemperature("does-not-exist", "model", 0.4)).toBe(0.4);
  });

  test("omits temperature for OpenAI reasoning models", () => {
    expect(resolveTemperature("openai", "o3-mini", 0.7)).toBeUndefined();
    expect(resolveTemperature("openai", "gpt-5", 0.7)).toBeUndefined();
    expect(resolveTemperature("openai", "gpt-4o", 0.7)).toBe(0.7);
    expect(resolveTemperature("openai", "gpt-4o-mini", 0.7)).toBe(0.7);
  });

  test("omits temperature for Anthropic models that reject it", () => {
    expect(
      resolveTemperature("anthropic", "claude-sonnet-5", 0.7)
    ).toBeUndefined();
    expect(resolveTemperature("anthropic", "claude-3-5-haiku-latest", 0.7)).toBe(
      0.7
    );
  });

  test("omits temperature for Bedrock models that reject it", () => {
    expect(
      resolveTemperature("bedrock", "us.anthropic.claude-sonnet-5-v1:0", 0.7)
    ).toBeUndefined();
    expect(
      resolveTemperature("bedrock", "anthropic.claude-3-5-sonnet-v1:0", 0.7)
    ).toBe(0.7);
  });

  test("omits temperature for Azure reasoning deployments", () => {
    process.env.AZURE_OPENAI_MODEL_TYPE = "reasoning";
    expect(resolveTemperature("azure", "my-deployment", 0.7)).toBeUndefined();
    process.env.AZURE_OPENAI_MODEL_TYPE = "default";
    expect(resolveTemperature("azure", "my-deployment", 0.7)).toBe(0.7);
  });
});
