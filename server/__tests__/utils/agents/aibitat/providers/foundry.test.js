/* eslint-env jest */
const FoundryProvider = require("../../../../../utils/agents/aibitat/providers/foundry.js");
const { FoundryLLM } = require("../../../../../utils/AiProviders/foundry");

describe("FoundryProvider native tool calls", () => {
  test("send max_completion_tokens, so Foundry does not cap the reply at 1024 tokens", async () => {
    const provider = new FoundryProvider({ model: "phi-4-mini" });
    provider._llm = {
      assertModelContextLimits: async () => {},
      assertModelLoaded: async () => {},
      getModelCapabilities: async () => ({ tools: true }),
    };
    FoundryLLM.contextWindows.set("phi-4-mini", 8192);
    const create = jest.fn().mockResolvedValue({
      choices: [{ message: { content: "Done." }, finish_reason: "stop" }],
    });
    provider._client = { chat: { completions: { create } } };

    await provider.complete(
      [{ role: "user", content: "hi" }],
      [{ name: "web-search", parameters: { type: "object", properties: {} } }]
    );
    expect(create.mock.calls[0][0].max_completion_tokens).toBe(8192);
  });
});
