const {
  isOpenAIModelId,
  openaiBaseURL,
} = require("../../../../utils/AiProviders/bedrock/endpoints");

describe("AWS Bedrock endpoint routing", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    delete process.env.AWS_BEDROCK_LLM_MANTLE_ENDPOINT;
    delete process.env.AWS_BEDROCK_LLM_RUNTIME_ENDPOINT;
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it("detects Bedrock OpenAI model ids with and without profile prefixes", () => {
    expect(isOpenAIModelId("openai.gpt-6-sol")).toBe(true);
    expect(isOpenAIModelId("us.openai.gpt-6-sol")).toBe(true);
    expect(isOpenAIModelId("global.openai.gpt-6-sol")).toBe(true);
    expect(isOpenAIModelId("anthropic.claude-sonnet-5")).toBe(false);
    expect(isOpenAIModelId(null)).toBe(false);
  });

  it("routes Bedrock OpenAI models to the runtime OpenAI route", () => {
    expect(openaiBaseURL("us-east-1", "openai.gpt-6-sol")).toBe(
      "https://bedrock-runtime.us-east-1.amazonaws.com/openai/v1"
    );
    expect(openaiBaseURL("us-east-1", "us.openai.gpt-6-sol")).toBe(
      "https://bedrock-runtime.us-east-1.amazonaws.com/openai/v1"
    );
  });

  it("keeps non-OpenAI chat models on Mantle", () => {
    expect(openaiBaseURL("us-east-1", "mistral.mistral-large-2407-v1:0")).toBe(
      "https://bedrock-mantle.us-east-1.api.aws/v1"
    );
  });
});
