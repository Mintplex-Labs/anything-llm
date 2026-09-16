/**
 * The providers that gained an OpenAI-shaped `#generateContent` in this change.
 *
 * Two things are asserted for each: an image on the current turn reaches the
 * request as an `image_url` part, and an image in the chat history does too,
 * instead of the internal `attachments` array being spread into the body.
 */
const ORIGINAL_ENV = process.env;

const PROVIDERS = [
  {
    name: "CohereLLM",
    modulePath: "../../../utils/AiProviders/cohere",
    env: {
      COHERE_API_KEY: "key",
      COHERE_MODEL_PREF: "command-a-vision-07-2025",
    },
    vision: true,
  },
  {
    name: "FireworksAiLLM",
    modulePath: "../../../utils/AiProviders/fireworksAi",
    env: {
      FIREWORKS_AI_LLM_API_KEY: "key",
      FIREWORKS_AI_LLM_MODEL_PREF: "accounts/fireworks/models/firellava-13b",
    },
    vision: true,
  },
  {
    name: "GiteeAILLM",
    modulePath: "../../../utils/AiProviders/giteeai",
    env: { GITEE_AI_API_KEY: "key", GITEE_AI_MODEL_PREF: "Qwen2-VL-72B" },
    vision: true,
  },
  {
    name: "MinimaxLLM",
    modulePath: "../../../utils/AiProviders/minimax",
    env: { MINIMAX_API_KEY: "key", MINIMAX_MODEL_PREF: "MiniMax-VL-01" },
    vision: true,
  },
  {
    name: "PerplexityLLM",
    modulePath: "../../../utils/AiProviders/perplexity",
    env: { PERPLEXITY_API_KEY: "key", PERPLEXITY_MODEL_PREF: "sonar-pro" },
    vision: true,
  },
  {
    name: "VertexLLM",
    modulePath: "../../../utils/AiProviders/vertex",
    env: {
      VERTEX_AI_LLM_API_KEY: "key",
      VERTEX_AI_LLM_MODEL_PREF: "gemini-2.5-flash",
      VERTEX_AI_LLM_PROJECT_ID: "project",
    },
    vision: true,
  },
  {
    name: "DeepSeekLLM",
    modulePath: "../../../utils/AiProviders/deepseek",
    env: { DEEPSEEK_API_KEY: "key", DEEPSEEK_MODEL_PREF: "deepseek-chat" },
    // DeepSeek publishes no vision model, so its content generator is a stub.
    vision: false,
  },
];

const IMAGE = "data:image/png;base64,AAAA";

function attachment(name = "image.png") {
  return { name, mime: "image/png", contentString: IMAGE };
}

function providerFor({ name, modulePath, env }) {
  process.env = { ...ORIGINAL_ENV, ...env };
  const Provider = require(modulePath)[name];
  return new Provider();
}

afterEach(() => {
  process.env = ORIGINAL_ENV;
});

describe.each(PROVIDERS)("$name attachments", (entry) => {
  it("never leaks the internal attachments array into a message", () => {
    const messages = providerFor(entry).constructPrompt({
      systemPrompt: "system",
      chatHistory: [
        { role: "user", content: "what is this?", attachments: [attachment()] },
        { role: "assistant", content: "a picture" },
      ],
      userPrompt: "and this?",
      attachments: [attachment("second.png")],
    });

    for (const message of messages) {
      expect(Object.keys(message).sort()).toEqual(["content", "role"]);
    }
  });

  it("keeps a message without attachments a plain string", () => {
    const messages = providerFor(entry).constructPrompt({
      systemPrompt: "system",
      chatHistory: [{ role: "user", content: "hello" }],
      userPrompt: "hi",
    });

    expect(messages.at(-1)).toEqual({ role: "user", content: "hi" });
    expect(messages[1]).toEqual({ role: "user", content: "hello" });
  });

  if (entry.vision) {
    it("sends the current turn's image as an image_url part", () => {
      const messages = providerFor(entry).constructPrompt({
        systemPrompt: "system",
        userPrompt: "describe this",
        attachments: [attachment()],
      });

      expect(messages.at(-1).content).toEqual([
        { type: "text", text: "describe this" },
        { type: "image_url", image_url: { url: IMAGE } },
      ]);
    });

    it("sends an image from the chat history as an image_url part", () => {
      const messages = providerFor(entry).constructPrompt({
        systemPrompt: "system",
        chatHistory: [
          {
            role: "user",
            content: "what is this?",
            attachments: [attachment()],
          },
          { role: "assistant", content: "a picture" },
        ],
        userPrompt: "and now?",
      });

      expect(messages[1]).toEqual({
        role: "user",
        content: [
          { type: "text", text: "what is this?" },
          { type: "image_url", image_url: { url: IMAGE } },
        ],
      });
      // Assistant turns are passed through untouched.
      expect(messages[2]).toEqual({ role: "assistant", content: "a picture" });
    });
  } else {
    it("drops attachments rather than sending a part the model cannot read", () => {
      const messages = providerFor(entry).constructPrompt({
        systemPrompt: "system",
        chatHistory: [
          {
            role: "user",
            content: "what is this?",
            attachments: [attachment()],
          },
        ],
        userPrompt: "describe this",
        attachments: [attachment()],
      });

      expect(messages[1]).toEqual({ role: "user", content: "what is this?" });
      expect(messages.at(-1)).toEqual({
        role: "user",
        content: "describe this",
      });
    });
  }
});
