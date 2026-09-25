/* eslint-env jest */
const {
  resolveTemperature,
  getLLMProvider,
} = require("../../../utils/helpers");

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

  test("omits temperature for every Anthropic model", () => {
    expect(
      resolveTemperature("anthropic", "claude-sonnet-5", 0.7)
    ).toBeUndefined();
    expect(
      resolveTemperature("anthropic", "claude-3-5-haiku-latest", 0.7)
    ).toBeUndefined();
    expect(
      resolveTemperature("anthropic", "claude-3-5-haiku-latest", 0)
    ).toBeUndefined();
  });

  test("omits temperature for Bedrock Anthropic and OpenAI GPT models only", () => {
    expect(
      resolveTemperature("bedrock", "us.anthropic.claude-sonnet-5-v1:0", 0.7)
    ).toBeUndefined();
    expect(
      resolveTemperature("bedrock", "anthropic.claude-3-5-sonnet-v1:0", 0.7)
    ).toBeUndefined();
    expect(
      resolveTemperature("bedrock", "us.openai.gpt-5-v1:0", 0.7)
    ).toBeUndefined();
    expect(resolveTemperature("bedrock", "openai.gpt-oss-120b-1:0", 0.7)).toBe(
      0.7
    );
    expect(
      resolveTemperature("bedrock", "meta.llama3-70b-instruct-v1:0", 0.7)
    ).toBe(0.7);
  });

  test("omits temperature for Azure reasoning deployments", () => {
    process.env.AZURE_OPENAI_MODEL_TYPE = "reasoning";
    expect(resolveTemperature("azure", "my-deployment", 0.7)).toBeUndefined();
    process.env.AZURE_OPENAI_MODEL_TYPE = "default";
    expect(resolveTemperature("azure", "my-deployment", 0.7)).toBe(0.7);
  });
});

describe("getLLMProvider chat request temperature", () => {
  const ORIGINAL_ENV = process.env;
  const messages = [
    { role: "system", content: "sys" },
    { role: "user", content: "hi" },
  ];

  beforeEach(() => {
    process.env = {
      ...ORIGINAL_ENV,
      GENERIC_OPEN_AI_BASE_PATH: "http://localhost:8080/v1",
      MISTRAL_API_KEY: "test-key",
    };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  async function sentBody(provider, model, temperature, stream = false) {
    const connector = getLLMProvider({ provider, model, temperature });
    const create = jest.fn(async () => ({
      choices: [{ message: { content: "ok" } }],
      usage: {},
    }));
    connector.openai.chat.completions.create = create;
    if (stream) await connector.streamGetChatCompletion(messages);
    else await connector.getChatCompletion(messages);
    return create.mock.calls[0][0];
  }

  test.each([null, undefined, ""])(
    "omits temperature when the workspace value is %p",
    async (value) => {
      expect(await sentBody("generic-openai", "m", value)).not.toHaveProperty(
        "temperature"
      );
      expect(
        await sentBody("generic-openai", "m", value, true)
      ).not.toHaveProperty("temperature");
    }
  );

  test("sends the workspace temperature when set, including 0", async () => {
    expect((await sentBody("generic-openai", "m", 0)).temperature).toBe(0);
    expect((await sentBody("generic-openai", "m", "0.3")).temperature).toBe(
      0.3
    );
    expect((await sentBody("generic-openai", "m", 0.3, true)).temperature).toBe(
      0.3
    );
  });

  test("omits temperature for Mistral when unset", async () => {
    expect(
      await sentBody("mistral", "mistral-small-latest", null)
    ).not.toHaveProperty("temperature");
    expect(
      (await sentBody("mistral", "mistral-small-latest", 0.2)).temperature
    ).toBe(0.2);
  });
});
