const {
  anthropicBaseURL,
} = require("../../../../utils/AiProviders/bedrock/endpoints");

describe("anthropicBaseURL", () => {
  // Inference profiles listed by the ap-south-1 control plane.
  it.each([
    "in.anthropic.claude-haiku-4-5-20251001-v1:0",
    "in.anthropic.claude-sonnet-5",
    "in.anthropic.claude-opus-5",
  ])("routes the India inference profile %s to bedrock-runtime", (modelId) => {
    expect(anthropicBaseURL("ap-south-1", modelId)).toBe(
      "https://bedrock-runtime.ap-south-1.amazonaws.com/anthropic"
    );
  });

  it("keeps plain catalog IDs on Mantle", () => {
    expect(anthropicBaseURL("ap-south-1", "anthropic.claude-opus-5")).toBe(
      "https://bedrock-mantle.ap-south-1.api.aws/anthropic"
    );
  });
});
