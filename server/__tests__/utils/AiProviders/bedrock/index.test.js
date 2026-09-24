const MockOpenAI = jest.fn(function MockOpenAI(options) {
  this.options = options;
});
MockOpenAI.OpenAI = MockOpenAI;

jest.mock("openai", () => MockOpenAI, { virtual: true });
jest.mock("../../../../utils/EmbeddingEngines/native", () => ({
  NativeEmbedder: jest.fn(function NativeEmbedder() {}),
}));
jest.mock("../../../../utils/helpers/chat/responses", () => ({
  handleDefaultStreamResponseV2: jest.fn(),
}));
jest.mock("../../../../utils/helpers/chat/LLMPerformanceMonitor", () => ({
  LLMPerformanceMonitor: {},
}));
jest.mock("../../../../utils/AiProviders/bedrock/anthropicChat", () => ({
  buildAnthropicParams: jest.fn(),
  handleAnthropicChatStream: jest.fn(),
}));

const { AWSBedrockLLM } = require("../../../../utils/AiProviders/bedrock");

describe("AWSBedrockLLM OpenAI model handling", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    MockOpenAI.mockClear();
    process.env = {
      ...ORIGINAL_ENV,
      AWS_BEDROCK_LLM_API_KEY: "test-key",
      AWS_BEDROCK_LLM_REGION: "us-east-1",
      AWS_BEDROCK_LLM_MODEL_PREFERENCE: "openai.gpt-6-sol",
    };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it("constructs OpenAI-family Bedrock clients against the runtime route", () => {
    new AWSBedrockLLM();

    expect(MockOpenAI).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: "https://bedrock-runtime.us-east-1.amazonaws.com/openai/v1",
      })
    );
  });

  it("omits temperature for Bedrock OpenAI models", () => {
    const provider = new AWSBedrockLLM();

    expect(provider.temperatureParam(0.7)).toBeUndefined();
    expect(provider.temperatureParam(1)).toBeUndefined();
  });
});
