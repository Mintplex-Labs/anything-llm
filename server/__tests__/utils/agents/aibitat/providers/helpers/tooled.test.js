jest.mock("uuid", () => ({ v4: () => "fallback_uuid" }), { virtual: true });
jest.mock("../../../../../../utils/http", () => ({
  safeJsonParse: (jsonString, fallback = null) => {
    try {
      return JSON.parse(jsonString);
    } catch {
      return fallback;
    }
  },
}));

const { tooledStream } = require("../../../../../../utils/agents/aibitat/providers/helpers/tooled");

describe("tooledStream", () => {
  it("replaces a generated fallback tool call id when the stream later provides the real id", async () => {
    async function* streamChunks() {
      yield {
        choices: [
          {
            delta: {
              tool_calls: [
                {
                  index: 0,
                  id: null,
                  function: { name: "lookup", arguments: "{\"query\"" },
                },
              ],
            },
          },
        ],
      };
      yield {
        choices: [
          {
            delta: {
              tool_calls: [
                {
                  index: 0,
                  id: "call_real_123",
                  function: { arguments: ":\"weather\"}" },
                },
              ],
            },
          },
        ],
      };
    }

    const client = {
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue(streamChunks()),
        },
      },
    };

    const result = await tooledStream(
      client,
      "test-model",
      [{ role: "user", content: "Use the lookup tool" }],
      [{ name: "lookup", description: "Lookup", parameters: { type: "object" } }]
    );

    expect(result.functionCall).toEqual({
      id: "call_real_123",
      name: "lookup",
      arguments: { query: "weather" },
    });
  });
});
