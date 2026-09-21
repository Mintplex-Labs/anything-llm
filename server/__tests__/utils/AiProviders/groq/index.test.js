const { GroqLLM } = require("../../../../utils/AiProviders/groq");
const originalEnv = process.env;
const attachment = {
  name: "fixture.png",
  mime: "image/png",
  contentString: "data:image/png;base64,AAAA",
};
const history = [
  { role: "user", content: "Earlier question" },
  { role: "assistant", content: "Earlier answer" },
];

beforeEach(() => {
  process.env = { ...originalEnv, GROQ_API_KEY: "test-key" };
});

afterEach(() => {
  process.env = originalEnv;
});

describe("GroqLLM image eligibility", () => {
  it("includes the current image for the documented vision model", () => {
    const llm = new GroqLLM({}, "qwen/qwen3.8-27b");
    const messages = llm.constructPrompt({
      systemPrompt: "Describe the image.",
      chatHistory: history,
      userPrompt: "What is shown?",
      attachments: [attachment],
    });
    const currentTurn = messages[messages.length - 1];
    expect(currentTurn.role).toBe("user");
    expect(currentTurn.content).toEqual([
      { type: "text", text: "What is shown?" },
      { type: "image_url", image_url: { url: attachment.contentString } },
    ]);
  });

  // Control: an unlisted model keeps the existing text-only prompt with the
  // attachment dropped. That is the special case #6377 left in place.
  it.each([
    { label: "without an image", attachments: [] },
    { label: "with an image", attachments: [attachment] },
  ])(
    "preserves the default prompt for a text-only model $label",
    ({ attachments }) => {
      const llm = new GroqLLM({}, "openai/gpt-oss-20b");
      expect(
        llm.constructPrompt({
          systemPrompt: "Keep the conversation context.",
          chatHistory: history,
          userPrompt: "Continue.",
          attachments,
        })
      ).toEqual([
        { role: "system", content: "Keep the conversation context." },
        ...history,
        { role: "user", content: "Continue." },
      ]);
    }
  );

  it("keeps the default prompt for the vision model without an image", () => {
    const llm = new GroqLLM({}, "qwen/qwen3.8-27b");
    expect(
      llm.constructPrompt({
        systemPrompt: "Keep the conversation context.",
        chatHistory: history,
        userPrompt: "Continue.",
      })
    ).toEqual([
      { role: "system", content: "Keep the conversation context." },
      ...history,
      { role: "user", content: "Continue." },
    ]);
  });
});
