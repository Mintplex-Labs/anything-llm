/**
 * `attachments` is an AnythingLLM-internal property that `convertToPromptHistory`
 * hangs on a user turn so a later turn can re-send the image as a content part.
 * No provider's message schema has that field, and the value carries the whole
 * base64 image, so a provider that spreads the raw history ships every image of
 * the conversation again on every request.
 *
 * `formatChatHistory` is what turns the property into whatever the provider's
 * content format is, or drops it for providers without vision support. These are
 * the providers that have no vision content formatter, so the assertion is about
 * what leaves the process, not about how an image is encoded.
 */

const ORIGINAL_ENV = process.env;

const PROVIDERS = [
  ["cohere", "CohereLLM", { COHERE_API_KEY: "test" }],
  ["deepseek", "DeepSeekLLM", { DEEPSEEK_API_KEY: "test" }],
  ["fireworksAi", "FireworksAiLLM", { FIREWORKS_AI_LLM_API_KEY: "test" }],
  ["giteeai", "GiteeAiLLM", { GITEE_AI_API_KEY: "test" }],
  ["groq", "GroqLLM", { GROQ_API_KEY: "test" }],
  ["minimax", "MinimaxLLM", { MINIMAX_API_KEY: "test" }],
  ["perplexity", "PerplexityLLM", { PERPLEXITY_API_KEY: "test" }],
  ["ppio", "PPIOLLM", { PPIO_API_KEY: "test" }],
  [
    "vertex",
    "VertexLLM",
    { VERTEX_AI_LLM_API_KEY: "test", VERTEX_AI_LLM_PROJECT_ID: "test-project" },
  ],
];

const CHAT_HISTORY = [
  {
    role: "user",
    content: "what is in this image?",
    attachments: [
      {
        name: "cat.png",
        mime: "image/png",
        contentString: "data:image/png;base64,SGVsbG8gV29ybGQ=",
      },
    ],
  },
  { role: "assistant", content: "A cat." },
];

afterEach(() => {
  process.env = ORIGINAL_ENV;
  jest.resetModules();
});

describe.each(PROVIDERS)("%s chat history attachments", (dir, _name, env) => {
  function constructPrompt() {
    process.env = { ...ORIGINAL_ENV, ...env };
    const exported = require(`../../../utils/AiProviders/${dir}`);
    const LLM = Object.values(exported).find(
      (value) => typeof value === "function"
    );
    return new LLM().constructPrompt({
      systemPrompt: "system",
      contextTexts: [],
      chatHistory: CHAT_HISTORY,
      userPrompt: "and now?",
      attachments: [],
    });
  }

  it("does not send the internal attachments property to the provider", () => {
    for (const message of constructPrompt()) {
      expect(Object.keys(message).sort()).toEqual(["content", "role"]);
    }
  });

  it("keeps the text of a history turn that carried an attachment", () => {
    const messages = constructPrompt();
    expect(messages).toEqual(
      expect.arrayContaining([
        { role: "user", content: "what is in this image?" },
        { role: "assistant", content: "A cat." },
      ])
    );
  });
});
