const {
  supportsTemperature,
} = require("../../../../utils/AiProviders/anthropic/models");

describe("supportsTemperature", () => {
  describe("models that dropped the temperature parameter", () => {
    test.each([
      "claude-opus-4-7",
      "claude-opus-4-8",
      "claude-sonnet-5",
      "claude-opus-5",
      "claude-haiku-5",
      "claude-opus-5-20260929",
      "claude-opus-5-latest",
      "claude-sonnet-6",
      // Bedrock-style ids
      "anthropic.claude-opus-4-8-v1:0",
      "us.anthropic.claude-opus-5-v1:0",
      "eu.anthropic.claude-sonnet-5-20260929-v1:0",
    ])("returns false for %s", (model) => {
      expect(supportsTemperature(model)).toBe(false);
    });
  });

  describe("models that still accept temperature", () => {
    test.each([
      "claude-opus-4-5",
      "claude-sonnet-4-5",
      "claude-haiku-4-5",
      "claude-3-5-sonnet-20241022",
      "claude-3-7-sonnet-20250219",
      "claude-3-opus-20240229",
      "claude-2.1",
      "eu.anthropic.claude-sonnet-4-5-20250929-v1:0",
      "us.anthropic.claude-haiku-4-5-20251001-v1:0",
    ])("returns true for %s", (model) => {
      expect(supportsTemperature(model)).toBe(true);
    });
  });

  it("returns true for unknown or empty model names", () => {
    expect(supportsTemperature("")).toBe(true);
    expect(supportsTemperature(undefined)).toBe(true);
    expect(supportsTemperature("some-other-model")).toBe(true);
  });
});

describe("provider temperatureParam", () => {
  const cases = [
    ["claude-opus-4-1", 0.7],
    ["claude-opus-4-8", undefined],
    ["claude-opus-5", undefined],
    ["claude-sonnet-5", undefined],
    ["claude-sonnet-4-5", 0.7],
    ["claude-3-5-sonnet-20241022", 0.7],
  ];

  test.each(cases)("AnthropicLLM with %s returns %s", (model, expected) => {
    const {
      AnthropicLLM,
    } = require("../../../../utils/AiProviders/anthropic");
    const provider = Object.create(AnthropicLLM.prototype);
    provider.model = model;
    provider.defaultTemp = 0.7;
    expect(provider.temperatureParam(0.7)).toBe(expected);
  });

  test.each(cases)("AWSBedrockLLM with %s returns %s", (model, expected) => {
    const {
      AWSBedrockLLM,
    } = require("../../../../utils/AiProviders/bedrock");
    const provider = Object.create(AWSBedrockLLM.prototype);
    provider.model = model;
    provider.defaultTemp = 0.7;
    expect(provider.temperatureParam(0.7)).toBe(expected);
  });

  it("returns undefined for a non-numeric temperature", () => {
    const {
      AnthropicLLM,
    } = require("../../../../utils/AiProviders/anthropic");
    const provider = Object.create(AnthropicLLM.prototype);
    provider.model = "claude-3-5-sonnet-20241022";
    provider.defaultTemp = 0.7;
    expect(provider.temperatureParam("0.7")).toBe(undefined);
  });
});
