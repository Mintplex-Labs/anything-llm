const { AWSBedrockLLM } = require("../../../../utils/AiProviders/bedrock");

/**
 * Minimal env required for the AWSBedrockLLM constructor to initialize.
 * No network calls are made — we only exercise the pure `temperatureConfig` helper.
 */
function withBedrockEnv() {
  process.env.AWS_BEDROCK_LLM_ACCESS_KEY_ID = "test-access-key-id";
  process.env.AWS_BEDROCK_LLM_ACCESS_KEY = "test-access-key";
  process.env.AWS_BEDROCK_LLM_REGION = "us-east-1";
  process.env.AWS_BEDROCK_LLM_MODEL_PREFERENCE = "anthropic.claude-3-haiku";
}

describe("AWSBedrockLLM: temperatureConfig", () => {
  beforeEach(() => withBedrockEnv());

  it("omits temperature for Claude Opus 4.8", () => {
    const llm = new AWSBedrockLLM(null, "anthropic.claude-opus-4-8");
    expect(llm.temperatureConfig(0.7)).toEqual({});
  });

  it("omits temperature for cross-region Claude Opus 4.8 (us. prefix)", () => {
    const llm = new AWSBedrockLLM(null, "us.anthropic.claude-opus-4-8");
    expect(llm.temperatureConfig(0.7)).toEqual({});
  });

  it("omits temperature for Claude Opus 4.7 (existing behavior preserved)", () => {
    const llm = new AWSBedrockLLM(null, "anthropic.claude-opus-4-7");
    expect(llm.temperatureConfig(0.7)).toEqual({});
  });

  it("still sends temperature for models that accept it", () => {
    const llm = new AWSBedrockLLM(
      null,
      "anthropic.claude-3-5-sonnet-20240620-v1:0"
    );
    expect(llm.temperatureConfig(0.7)).toEqual({ temperature: 0.7 });
  });

  it("returns an empty object when temperature is not a number", () => {
    const llm = new AWSBedrockLLM(null, "anthropic.claude-3-5-sonnet-20240620-v1:0");
    expect(llm.temperatureConfig(null)).toEqual({});
  });
});
