const fs = require("fs");
const os = require("os");
const path = require("path");

// The providers resolve their model cache folders from STORAGE_DIR at require time.
const storageDir = fs.mkdtempSync(path.join(os.tmpdir(), "cached-limits-"));
process.env.STORAGE_DIR = storageDir;

function writeCache(folder, data) {
  const dir = path.resolve(storageDir, "models", folder);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.resolve(dir, "models.json"), JSON.stringify(data));
  fs.writeFileSync(path.resolve(dir, ".cached_at"), String(Date.now()));
}

// A fresh model map cache, so nothing is pulled from the network.
const contextWindowsDir = path.resolve(storageDir, "models", "context-windows");
fs.mkdirSync(contextWindowsDir, { recursive: true });
fs.writeFileSync(
  path.resolve(contextWindowsDir, "context-windows.json"),
  JSON.stringify({ gemini: {} })
);
fs.writeFileSync(
  path.resolve(contextWindowsDir, ".cached_at"),
  `${Date.now()}`
);

const { OpenRouterLLM } = require("../../../utils/AiProviders/openRouter");
const { NovitaLLM } = require("../../../utils/AiProviders/novita");
const { ApiPieLLM } = require("../../../utils/AiProviders/apipie");
const { CometApiLLM } = require("../../../utils/AiProviders/cometapi");
const { FireworksAiLLM } = require("../../../utils/AiProviders/fireworksAi");
const { GeminiLLM } = require("../../../utils/AiProviders/gemini");

const ORIGINAL_ENV = process.env;

beforeEach(() => {
  process.env = {
    ...ORIGINAL_ENV,
    OPENROUTER_API_KEY: "test-key",
    NOVITA_LLM_API_KEY: "test-key",
    APIPIE_LLM_API_KEY: "test-key",
    COMETAPI_LLM_API_KEY: "test-key",
    FIREWORKS_AI_LLM_API_KEY: "test-key",
    GEMINI_API_KEY: "test-key",
  };
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
  jest.restoreAllMocks();
});

afterAll(() => {
  fs.rmSync(storageDir, { recursive: true, force: true });
});

function expectedLimits(window) {
  return { history: window * 0.15, system: window * 0.15, user: window * 0.7 };
}

describe("prompt budgets use the cached model context window", () => {
  it.each([
    ["openrouter", OpenRouterLLM, "anthropic/claude-sonnet-4", {}],
    ["novita", NovitaLLM, "deepseek/deepseek-r1", {}],
    ["apipie", ApiPieLLM, "openrouter/claude-sonnet-4", { subtype: "chat" }],
    ["cometapi", CometApiLLM, "gpt-5-mini", {}],
    [
      "fireworks",
      FireworksAiLLM,
      "accounts/fireworks/models/llama-v3p1-70b-instruct",
      {},
    ],
  ])("%s", (folder, Provider, model, extra) => {
    writeCache(folder, {
      [model]: { id: model, name: model, maxLength: 200_000, ...extra },
    });
    const llm = new Provider(null, model);
    expect(llm.promptWindowLimit()).toBe(200_000);
    expect(llm.limits).toEqual(expectedLimits(200_000));
  });

  it("gemini", () => {
    const model = "gemini-model-not-in-model-map";
    writeCache("gemini", [
      { id: model, name: model, contextWindow: 1_048_576, experimental: false },
    ]);
    const llm = new GeminiLLM(null, model);
    expect(llm.promptWindowLimit()).toBe(1_048_576);
    expect(llm.limits).toEqual(expectedLimits(1_048_576));
  });
});
