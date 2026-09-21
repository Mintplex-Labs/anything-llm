const fs = require("fs");
const os = require("os");
const path = require("path");

// The context window map resolves its cache folder from STORAGE_DIR when it is
// first required, so the fixture has to be in place before the provider loads.
const storageDir = fs.mkdtempSync(path.join(os.tmpdir(), "alm-moonshot-"));
const contextWindowDir = path.join(storageDir, "models", "context-windows");
fs.mkdirSync(contextWindowDir, { recursive: true });
fs.writeFileSync(
  path.join(contextWindowDir, "context-windows.json"),
  JSON.stringify({
    moonshot: { "moonshot-v1-128k": 131072, "moonshot-v1-32k": 32768 },
  })
);
fs.writeFileSync(path.join(contextWindowDir, ".cached_at"), String(Date.now()));
// The agent provider module loads the model pricing table when it is required
// and refreshes it from the network when the cache is missing or stale, so a
// fresh empty cache keeps this suite offline.
const pricingDir = path.join(storageDir, "models", "pricing");
fs.mkdirSync(pricingDir, { recursive: true });
fs.writeFileSync(path.join(pricingDir, "model-pricing.json"), "{}");
fs.writeFileSync(path.join(pricingDir, ".cached_at"), String(Date.now()));
process.env.STORAGE_DIR = storageDir;
process.env.MOONSHOT_AI_API_KEY = "test-key";

const { MoonshotAiLLM } = require("../../../../utils/AiProviders/moonshotAi");
const Provider = require("../../../../utils/agents/aibitat/providers/ai-provider.js");

afterAll(() => {
  fs.rmSync(storageDir, { recursive: true, force: true });
});

describe("MoonshotAiLLM.promptWindowLimit", () => {
  it("returns the mapped context window for a known model from the static", () => {
    expect(MoonshotAiLLM.promptWindowLimit("moonshot-v1-128k")).toBe(131072);
    expect(MoonshotAiLLM.promptWindowLimit("moonshot-v1-32k")).toBe(32768);
  });

  it("compatibility control: falls back to 8192 for a model the map does not list", () => {
    expect(MoonshotAiLLM.promptWindowLimit("moonshot-v1-unlisted")).toBe(8192);
  });

  it("instance method and constructor budgets use the same lookup", () => {
    const llm = new MoonshotAiLLM({}, "moonshot-v1-128k");
    expect(llm.promptWindowLimit()).toBe(131072);
    expect(llm.limits).toEqual({
      history: 131072 * 0.15,
      system: 131072 * 0.15,
      user: 131072 * 0.7,
    });
  });

  it("agent contextLimit reads the model window instead of the 8000 fallback", () => {
    expect(Provider.contextLimit("moonshotai", "moonshot-v1-128k")).toBe(
      131072
    );
  });
});
