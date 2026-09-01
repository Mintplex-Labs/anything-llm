jest.mock("../../../utils/helpers/tiktoken", () => ({
  TokenManager: jest.fn().mockImplementation(() => ({
    countFromString: (input = "") => String(input).length,
    statsFrom: (input) =>
      input.reduce(
        (total, message) => total + String(message.content).length,
        0
      ),
    tokensFromString: (input = "") => [...String(input)],
    bytesFromTokens: (tokens = []) => tokens.join(""),
  })),
}));

const { messageArrayCompressor } = require("../../../utils/helpers/chat");

describe("messageArrayCompressor", () => {
  it("uses available prompt-window capacity for document context", async () => {
    const llm = {
      model: "test-model",
      promptWindowLimit: () => 4_000,
      limits: {
        system: 600,
        history: 600,
        user: 2_800,
      },
    };

    const context = "c".repeat(3_500);
    const userPrompt = "u".repeat(200);

    const result = await messageArrayCompressor(
      llm,
      [
        {
          role: "system",
          content: `Follow the system instructions.\nContext:${context}`,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      []
    );

    const retainedContext = result[0].content.split("Context:")[1];
    const retainedContextCharacters = retainedContext.match(/c/g)?.length || 0;

    expect(retainedContextCharacters).toBeGreaterThan(llm.limits.system);
    expect(result.at(-1)).toEqual({
      role: "user",
      content: userPrompt,
    });
  });
});
