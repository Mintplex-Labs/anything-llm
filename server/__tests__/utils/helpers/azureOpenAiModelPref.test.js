/* eslint-env jest */

/**
 * Tests for the AzureOpenAI model key migration from OPEN_MODEL_PREF
 * to AZURE_OPENAI_MODEL_PREF, ensuring backwards compatibility for
 * existing users who have OPEN_MODEL_PREF set.
 *
 * Related issue: https://github.com/Mintplex-Labs/anything-llm/issues/3839
 */

describe("AzureOpenAI model key backwards compatibility", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
    delete process.env.AZURE_OPENAI_MODEL_PREF;
    delete process.env.OPEN_MODEL_PREF;
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  describe("getBaseLLMProviderModel - helpers/index.js", () => {
    test("returns AZURE_OPENAI_MODEL_PREF when set", () => {
      process.env.AZURE_OPENAI_MODEL_PREF = "my-azure-deployment";
      process.env.OPEN_MODEL_PREF = "gpt-4o";
      const { getBaseLLMProviderModel } = require("../../../utils/helpers/index");
      expect(getBaseLLMProviderModel({ provider: "azure" })).toBe("my-azure-deployment");
    });

    test("falls back to OPEN_MODEL_PREF when AZURE_OPENAI_MODEL_PREF is not set (backwards compat)", () => {
      process.env.OPEN_MODEL_PREF = "my-old-azure-deployment";
      const { getBaseLLMProviderModel } = require("../../../utils/helpers/index");
      expect(getBaseLLMProviderModel({ provider: "azure" })).toBe("my-old-azure-deployment");
    });

    test("openai provider still uses OPEN_MODEL_PREF exclusively", () => {
      process.env.OPEN_MODEL_PREF = "gpt-4o";
      process.env.AZURE_OPENAI_MODEL_PREF = "my-azure-deployment";
      const { getBaseLLMProviderModel } = require("../../../utils/helpers/index");
      expect(getBaseLLMProviderModel({ provider: "openai" })).toBe("gpt-4o");
    });

    test("azure and openai return different values when both keys are set", () => {
      process.env.OPEN_MODEL_PREF = "gpt-4o";
      process.env.AZURE_OPENAI_MODEL_PREF = "my-azure-deployment";
      const { getBaseLLMProviderModel } = require("../../../utils/helpers/index");
      expect(getBaseLLMProviderModel({ provider: "azure" })).not.toBe(
        getBaseLLMProviderModel({ provider: "openai" })
      );
    });
  });
});
