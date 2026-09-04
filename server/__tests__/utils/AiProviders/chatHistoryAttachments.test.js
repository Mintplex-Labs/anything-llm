const fs = require("fs");
const os = require("os");
const path = require("path");

// The providers and the shared model map resolve their cache paths from
// STORAGE_DIR at require time.
const STORAGE_DIR = fs.mkdtempSync(path.join(os.tmpdir(), "chat-history-"));
process.env.STORAGE_DIR = STORAGE_DIR;

// Building these providers starts model lookups: the model map and Cerebras
// call fetch(), TogetherAI lists models through the openai client. None of
// that may leave the test.
const ORIGINAL_FETCH = globalThis.fetch;
globalThis.fetch = () => new Promise(() => {});
jest.mock("openai", () => ({
  OpenAI: class {
    constructor() {
      const pending = () => new Promise(() => {});
      this.models = { list: pending };
      this.chat = { completions: { create: pending } };
    }
  },
}));

const { TogetherAiLLM } = require("../../../utils/AiProviders/togetherAi");
const { SambaNovaLLM } = require("../../../utils/AiProviders/sambanova");
const { ZAiLLM } = require("../../../utils/AiProviders/zai");
const { CerebrasLLM } = require("../../../utils/AiProviders/cerebras");

const ORIGINAL_ENV = process.env;
const PROMPT = "What is in this picture?";
const ATTACHMENT = {
  name: "cat.png",
  mime: "image/png",
  contentString: "data:image/png;base64,AAAA",
};

const PROVIDERS = [
  [
    "TogetherAiLLM",
    TogetherAiLLM,
    {
      TOGETHER_AI_API_KEY: "sk-test",
      TOGETHER_AI_MODEL_PREF: "meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo",
    },
  ],
  [
    "SambaNovaLLM",
    SambaNovaLLM,
    {
      SAMBANOVA_LLM_API_KEY: "sk-test",
      SAMBANOVA_LLM_MODEL_PREF: "Llama-3.2-11B-Vision-Instruct",
    },
  ],
  ["ZAiLLM", ZAiLLM, { ZAI_API_KEY: "sk-test", ZAI_MODEL_PREF: "glm-4.5v" }],
  [
    "CerebrasLLM",
    CerebrasLLM,
    { CEREBRAS_API_KEY: "sk-test", CEREBRAS_MODEL_PREF: "gpt-oss-120b" },
  ],
];

beforeAll(() => jest.spyOn(console, "log").mockImplementation(() => {}));

afterAll(() => {
  globalThis.fetch = ORIGINAL_FETCH;
  fs.rmSync(STORAGE_DIR, { recursive: true, force: true });
});

describe.each(PROVIDERS)(
  "%s constructPrompt chat history",
  (_name, Provider, env) => {
    let messages;

    beforeEach(() => {
      process.env = { ...ORIGINAL_ENV, ...env };
      // The same image on an earlier user turn, in the shape
      // convertToPromptHistory stores it, and on the current turn.
      messages = new Provider().constructPrompt({
        systemPrompt: "SYS",
        chatHistory: [
          { role: "user", content: PROMPT, attachments: [ATTACHMENT] },
          { role: "assistant", content: "A cat." },
        ],
        userPrompt: PROMPT,
        attachments: [ATTACHMENT],
      });
    });

    afterEach(() => {
      process.env = ORIGINAL_ENV;
    });

    it("formats a history turn's attachments the same way as the current turn", () => {
      expect(messages[1].content).toEqual(
        messages[messages.length - 1].content
      );
    });

    it("does not forward the internal attachments field to the provider", () => {
      expect(messages[1]).not.toHaveProperty("attachments");
    });
  }
);
