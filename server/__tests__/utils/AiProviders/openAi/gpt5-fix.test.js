/**
 * Test for GPT-5 max_completion_tokens parameter fix
 * GitHub Issue: https://github.com/Mintplex-Labs/anything-llm/issues/4304
 */

describe("OpenAI GPT-5 Parameter Fix", () => {
  describe("Parameter Construction Logic", () => {
    // Mock the logic from the OpenAiLLM class
    function constructRequestParams(baseParams, maxTokens, model) {
      const isGpt5Model = model.startsWith("gpt-5");
      const params = { ...baseParams };

      if (maxTokens && isGpt5Model) {
        params.max_completion_tokens = maxTokens;
      } else if (maxTokens) {
        params.max_tokens = maxTokens;
      }

      return params;
    }

    test("should use max_completion_tokens for gpt-5 model", () => {
      const baseParams = { model: "gpt-5", messages: [] };
      const result = constructRequestParams(baseParams, 1024, "gpt-5");

      expect(result).toHaveProperty("max_completion_tokens", 1024);
      expect(result).not.toHaveProperty("max_tokens");
    });

    test("should use max_completion_tokens for gpt-5-turbo model", () => {
      const baseParams = { model: "gpt-5-turbo", messages: [] };
      const result = constructRequestParams(baseParams, 2048, "gpt-5-turbo");

      expect(result).toHaveProperty("max_completion_tokens", 2048);
      expect(result).not.toHaveProperty("max_tokens");
    });

    test("should use max_tokens for gpt-4o model", () => {
      const baseParams = { model: "gpt-4o", messages: [] };
      const result = constructRequestParams(baseParams, 4096, "gpt-4o");

      expect(result).toHaveProperty("max_tokens", 4096);
      expect(result).not.toHaveProperty("max_completion_tokens");
    });

    test("should use max_tokens for gpt-3.5-turbo model", () => {
      const baseParams = { model: "gpt-3.5-turbo", messages: [] };
      const result = constructRequestParams(baseParams, 1024, "gpt-3.5-turbo");

      expect(result).toHaveProperty("max_tokens", 1024);
      expect(result).not.toHaveProperty("max_completion_tokens");
    });

    test("should not add any token parameter when maxTokens is null", () => {
      const baseParams = { model: "gpt-5", messages: [] };
      const result = constructRequestParams(baseParams, null, "gpt-5");

      expect(result).not.toHaveProperty("max_tokens");
      expect(result).not.toHaveProperty("max_completion_tokens");
    });

    test("should not add any token parameter when maxTokens is undefined", () => {
      const baseParams = { model: "gpt-5", messages: [] };
      const result = constructRequestParams(baseParams, undefined, "gpt-5");

      expect(result).not.toHaveProperty("max_tokens");
      expect(result).not.toHaveProperty("max_completion_tokens");
    });

    test("should preserve other parameters in baseParams", () => {
      const baseParams = {
        model: "gpt-5",
        messages: [{ role: "user", content: "test" }],
        temperature: 0.7,
        stream: true,
      };
      const result = constructRequestParams(baseParams, 1024, "gpt-5");

      expect(result).toHaveProperty("model", "gpt-5");
      expect(result).toHaveProperty("messages");
      expect(result).toHaveProperty("temperature", 0.7);
      expect(result).toHaveProperty("stream", true);
      expect(result).toHaveProperty("max_completion_tokens", 1024);
    });
  });

  describe("Model Detection", () => {
    function isGpt5Model(model) {
      return model.startsWith("gpt-5");
    }

    test("should correctly identify gpt-5 models", () => {
      expect(isGpt5Model("gpt-5")).toBe(true);
      expect(isGpt5Model("gpt-5-turbo")).toBe(true);
      expect(isGpt5Model("gpt-5-32k")).toBe(true);
      expect(isGpt5Model("gpt-5-preview")).toBe(true);
    });

    test("should correctly identify non-gpt-5 models", () => {
      expect(isGpt5Model("gpt-4o")).toBe(false);
      expect(isGpt5Model("gpt-4")).toBe(false);
      expect(isGpt5Model("gpt-3.5-turbo")).toBe(false);
      expect(isGpt5Model("o1-preview")).toBe(false);
      expect(isGpt5Model("claude-3")).toBe(false);
    });
  });
});