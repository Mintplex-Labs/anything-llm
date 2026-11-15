const fs = require("fs");
const os = require("os");
const path = require("path");

// The model map resolves its cache folder from STORAGE_DIR at require time.
const storageDir = fs.mkdtempSync(path.join(os.tmpdir(), "groq-limits-"));
process.env.STORAGE_DIR = storageDir;

// The cached map as ContextWindowFinder writes it: LiteLLM's
// "groq/openai/gpt-oss-120b" is stored under its last path part.
const cacheDir = path.resolve(storageDir, "models", "context-windows");
fs.mkdirSync(cacheDir, { recursive: true });
fs.writeFileSync(
  path.resolve(cacheDir, "context-windows.json"),
  JSON.stringify({
    groq: {
      "llama-3.1-8b-instant": 131072,
      "gpt-oss-120b": 131072,
      "gpt-oss-20b": 131072,
    },
  })
);
fs.writeFileSync(path.resolve(cacheDir, ".cached_at"), `${Date.now()}`);

const { GroqLLM } = require("../../../../utils/AiProviders/groq");

const ORIGINAL_ENV = process.env;

beforeEach(() => {
  process.env = { ...ORIGINAL_ENV, GROQ_API_KEY: "test-key" };
  jest.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
  jest.restoreAllMocks();
});

afterAll(() => {
  fs.rmSync(storageDir, { recursive: true, force: true });
});

describe("GroqLLM.promptWindowLimit", () => {
  it.each([
    ["llama-3.1-8b-instant", 131072],
    ["openai/gpt-oss-120b", 131072],
    ["openai/gpt-oss-20b", 131072],
    ["some-unknown-model", 8192],
  ])("%s -> %i", (model, expected) => {
    expect(GroqLLM.promptWindowLimit(model)).toBe(expected);
    const llm = new GroqLLM(null, model);
    expect(llm.promptWindowLimit()).toBe(expected);
    expect(llm.limits.user).toBe(expected * 0.7);
  });
});
