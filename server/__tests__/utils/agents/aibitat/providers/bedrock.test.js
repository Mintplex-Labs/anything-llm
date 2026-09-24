const MockOpenAI = jest.fn(function MockOpenAI(options) {
  this.options = options;
});
MockOpenAI.AuthenticationError = class AuthenticationError extends Error {};
MockOpenAI.RateLimitError = class RateLimitError extends Error {};
MockOpenAI.InternalServerError = class InternalServerError extends Error {};
MockOpenAI.APIError = class APIError extends Error {};
MockOpenAI.OpenAI = MockOpenAI;

jest.mock("openai", () => MockOpenAI, { virtual: true });
jest.mock("@anthropic-ai/sdk", () => jest.fn(), { virtual: true });
jest.mock(
  "../../../../../utils/agents/aibitat/providers/ai-provider.js",
  () => {
    return class Provider {
      optsOutOfNativeToolCallingViaEnv(providerTag = null) {
        if (!providerTag) return false;
        if (!("PROVIDER_DISABLE_NATIVE_TOOL_CALLING" in process.env))
          return false;
        return process.env.PROVIDER_DISABLE_NATIVE_TOOL_CALLING.split(
          ","
        ).includes(providerTag);
      }
    };
  }
);
jest.mock(
  "../../../../../utils/agents/aibitat/providers/helpers/untooled.js",
  () => class UnTooled {}
);
jest.mock(
  "../../../../../utils/agents/aibitat/providers/helpers/tooled.js",
  () => ({
    tooledStream: jest.fn(),
    tooledComplete: jest.fn(),
  })
);
jest.mock(
  "../../../../../utils/agents/aibitat/providers/helpers/anthropicTooled.js",
  () => ({
    anthropicTooledStream: jest.fn(),
    anthropicTooledComplete: jest.fn(),
  })
);
jest.mock("../../../../../utils/agents/aibitat/error.js", () => ({
  RetryError: class RetryError extends Error {},
}));

const AWSBedrockProvider = require("../../../../../utils/agents/aibitat/providers/bedrock");

describe("AWSBedrockProvider OpenAI model handling", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    MockOpenAI.mockClear();
    process.env = {
      ...ORIGINAL_ENV,
      AWS_BEDROCK_LLM_API_KEY: "test-key",
      AWS_BEDROCK_LLM_REGION: "us-east-1",
      AWS_BEDROCK_LLM_MODEL_PREFERENCE: "openai.gpt-6-sol",
    };
    delete process.env.PROVIDER_DISABLE_NATIVE_TOOL_CALLING;
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it("constructs Bedrock OpenAI clients against the runtime route", () => {
    new AWSBedrockProvider();

    expect(MockOpenAI).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: "https://bedrock-runtime.us-east-1.amazonaws.com/openai/v1",
      })
    );
  });

  it("uses the non-native tool path for Bedrock OpenAI models", () => {
    const provider = new AWSBedrockProvider();

    expect(provider.supportsNativeToolCalling()).toBe(false);
  });

  it("keeps native tool calling enabled for other Bedrock models", () => {
    const provider = new AWSBedrockProvider({
      model: "mistral.mistral-large-2407-v1:0",
    });

    expect(provider.supportsNativeToolCalling()).toBe(true);
  });
});
