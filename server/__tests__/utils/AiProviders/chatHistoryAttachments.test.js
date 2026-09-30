/* eslint-env jest */
const fs = require("fs");
const os = require("os");
const path = require("path");

process.env.STORAGE_DIR = fs.mkdtempSync(
  path.join(os.tmpdir(), "history-attachments-test-")
);

// Providers that send text only. A history turn that had an image (an upload,
// or a /img result read back by convertToPromptHistory) must reach them as
// plain text, without AnythingLLM's internal `attachments` property.
const PROVIDERS = [
  ["cohere", "CohereLLM", { COHERE_API_KEY: "k", COHERE_MODEL_PREF: "m" }],
  ["deepseek", "DeepSeekLLM", { DEEPSEEK_API_KEY: "k" }],
  [
    "fireworksAi",
    "FireworksAiLLM",
    { FIREWORKS_AI_LLM_API_KEY: "k", FIREWORKS_AI_LLM_MODEL_PREF: "m" },
  ],
  [
    "giteeai",
    "GiteeAILLM",
    { GITEE_AI_API_KEY: "k", GITEE_AI_MODEL_PREF: "m" },
  ],
  ["minimax", "MinimaxLLM", { MINIMAX_API_KEY: "k" }],
  ["perplexity", "PerplexityLLM", { PERPLEXITY_API_KEY: "k" }],
  ["ppio", "PPIOLLM", { PPIO_API_KEY: "k", PPIO_MODEL_PREF: "m" }],
  [
    "vertex",
    "VertexLLM",
    { VERTEX_AI_LLM_API_KEY: "k", VERTEX_AI_LLM_PROJECT_ID: "p" },
  ],
  ["groq", "GroqLLM", { GROQ_API_KEY: "k" }],
];

const chatHistory = [
  {
    role: "user",
    content: "/img a red fox in the snow",
    attachments: [
      {
        name: "a-red-fox.png",
        mime: "image/png",
        contentString: "data:image/png;base64,iVBORw0KGgo=",
      },
    ],
  },
  { role: "assistant", content: 'Generated an image for: "a red fox"' },
];

describe.each(PROVIDERS)("%s constructPrompt", (dir, className, env) => {
  beforeAll(() => Object.assign(process.env, env));

  it("sends earlier turns without the internal attachments property", () => {
    const Provider = require(`../../../utils/AiProviders/${dir}`)[className];
    const llm = new Provider({ embedTextInput() {}, embedChunks() {} });
    const messages = llm.constructPrompt({
      systemPrompt: "You are helpful.",
      contextTexts: [],
      chatHistory,
      userPrompt: "Make it blue.",
    });

    expect(messages.slice(1)).toEqual([
      { role: "user", content: "/img a red fox in the snow" },
      { role: "assistant", content: 'Generated an image for: "a red fox"' },
      { role: "user", content: "Make it blue." },
    ]);
  });
});
