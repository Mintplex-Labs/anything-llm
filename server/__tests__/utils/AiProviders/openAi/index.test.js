const fs = require("fs");
const os = require("os");
const path = require("path");

// The model map resolves its cache folder from STORAGE_DIR at require time.
const storageDir = fs.mkdtempSync(path.join(os.tmpdir(), "openai-limits-"));
process.env.STORAGE_DIR = storageDir;

const cacheDir = path.resolve(storageDir, "models", "context-windows");
fs.mkdirSync(cacheDir, { recursive: true });
fs.writeFileSync(
  path.resolve(cacheDir, "context-windows.json"),
  JSON.stringify({
    openai: {
      "gpt-4o-mini-2024-07-18": 128000,
      "gpt-4.1-2025-04-14": 1047576,
      "o4-mini-2025-04-16": 200000,
    },
  })
);
fs.writeFileSync(path.resolve(cacheDir, ".cached_at"), `${Date.now()}`);

const { OpenAiLLM } = require("../../../../utils/AiProviders/openAi");

const ORIGINAL_ENV = process.env;

beforeEach(() => {
  process.env = { ...ORIGINAL_ENV, OPEN_AI_KEY: "test-key" };
  jest.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
  jest.restoreAllMocks();
});

afterAll(() => {
  fs.rmSync(storageDir, { recursive: true, force: true });
});

describe("OpenAiLLM.promptWindowLimit", () => {
  it.each([
    ["gpt-4o-mini-2024-07-18", 128000],
    ["ft:gpt-4o-mini-2024-07-18:my-org:support-bot:9aBcDeFg", 128000],
    ["ft:gpt-4.1-2025-04-14:my-org::9aBcDeFg", 1047576],
    ["ft:o4-mini-2025-04-16:my-org:grader:9aBcDeFg:ckpt-step-100", 200000],
    ["ft:some-unknown-base:my-org::9aBcDeFg", 4096],
    ["some-unknown-model", 4096],
  ])("%s -> %i", (model, expected) => {
    expect(OpenAiLLM.promptWindowLimit(model)).toBe(expected);
    const llm = new OpenAiLLM(null, model);
    expect(llm.promptWindowLimit()).toBe(expected);
    expect(llm.limits.user).toBe(expected * 0.7);
  });
});
