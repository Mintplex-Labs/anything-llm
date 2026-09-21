const fs = require("fs");
const os = require("os");
const path = require("path");

// The provider resolves its model cache folder from STORAGE_DIR when it is
// first required, so the fixture has to be in place before it loads.
const storageDir = fs.mkdtempSync(path.join(os.tmpdir(), "alm-ppio-"));
const cacheDir = path.join(storageDir, "models", "ppio");
fs.mkdirSync(cacheDir, { recursive: true });
fs.writeFileSync(
  path.join(cacheDir, "models.json"),
  JSON.stringify({
    "minimaxai/minimax-m1-80k": {
      id: "minimaxai/minimax-m1-80k",
      name: "MiniMax M1 80k",
      organization: "minimaxai",
      maxLength: 128000,
    },
    "qwen/qwen2.5-32b-instruct": {
      id: "qwen/qwen2.5-32b-instruct",
      name: "Qwen2.5 32B Instruct",
      organization: "qwen",
      maxLength: 32000,
    },
  })
);
fs.writeFileSync(path.join(cacheDir, ".cached_at"), String(Date.now()));
// The agent provider module loads the model pricing table when it is required
// and refreshes it from the network when the cache is missing or stale, so a
// fresh empty cache keeps this suite offline.
const pricingDir = path.join(storageDir, "models", "pricing");
fs.mkdirSync(pricingDir, { recursive: true });
fs.writeFileSync(path.join(pricingDir, "model-pricing.json"), "{}");
fs.writeFileSync(path.join(pricingDir, ".cached_at"), String(Date.now()));
process.env.STORAGE_DIR = storageDir;
process.env.PPIO_API_KEY = "test-key";

const { PPIOLLM } = require("../../../../utils/AiProviders/ppio");
const Provider = require("../../../../utils/agents/aibitat/providers/ai-provider.js");

afterAll(() => {
  fs.rmSync(storageDir, { recursive: true, force: true });
});

describe("PPIOLLM.promptWindowLimit", () => {
  it("returns the cached context window for a known model from the static", () => {
    expect(PPIOLLM.promptWindowLimit("minimaxai/minimax-m1-80k")).toBe(128000);
    expect(PPIOLLM.promptWindowLimit("qwen/qwen2.5-32b-instruct")).toBe(32000);
  });

  it("compatibility control: falls back to 4096 for a model the cache does not list", () => {
    expect(PPIOLLM.promptWindowLimit("nobody/unlisted-model")).toBe(4096);
  });

  it("constructor budgets come from the cached window when the cache is warm", () => {
    const llm = new PPIOLLM({}, "minimaxai/minimax-m1-80k");
    expect(llm.promptWindowLimit()).toBe(128000);
    expect(llm.limits).toEqual({
      history: 128000 * 0.15,
      system: 128000 * 0.15,
      user: 128000 * 0.7,
    });
  });

  it("agent contextLimit reads the cached window instead of the 8000 fallback", () => {
    expect(Provider.contextLimit("ppio", "minimaxai/minimax-m1-80k")).toBe(
      128000
    );
  });
});
