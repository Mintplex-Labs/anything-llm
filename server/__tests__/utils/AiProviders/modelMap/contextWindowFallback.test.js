/* eslint-env jest */

/**
 * The context window finder pulls the LiteLLM model map from GitHub on boot and
 * caches it in the storage directory. When that pull never succeeds - or simply
 * does not list the requested model - `get()` used to return null, which makes
 * every provider fall back to its hard-coded minimum context window
 * (DeepSeek: 8192) even for models that are already listed in the bundled
 * `modelMap/legacy.js` table.
 *
 * These tests run without network access: the remote pull is stubbed so the
 * assertions only ever exercise the bundled map and the on-disk cache.
 */

const fs = require("fs");
const os = require("os");
const path = require("path");

const REMOTE_MODEL_MAP_URL =
  "https://raw.githubusercontent.com/BerriAI/litellm/main/model_prices_and_context_window.json";

describe("ContextWindowFinder model map fallback", () => {
  let storageDir;
  let fetchSpy;

  const cacheDir = () => path.join(storageDir, "models", "context-windows");
  const cacheFile = () => path.join(cacheDir(), "context-windows.json");
  const cacheExpiryFile = () => path.join(cacheDir(), ".cached_at");

  const writeCache = (modelMap) => {
    fs.mkdirSync(cacheDir(), { recursive: true });
    fs.writeFileSync(cacheFile(), JSON.stringify(modelMap, null, 2));
    fs.writeFileSync(cacheExpiryFile(), Date.now().toString());
  };

  const loadFinder = () => {
    jest.resetModules();
    return require("../../../../utils/AiProviders/modelMap").MODEL_MAP;
  };

  beforeEach(() => {
    storageDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "anythingllm-modelmap-")
    );
    process.env.STORAGE_DIR = storageDir;
    // Never let a test reach the network, whatever the finder decides to do.
    fetchSpy = jest
      .spyOn(globalThis, "fetch")
      .mockRejectedValue(new Error("network disabled in tests"));
  });

  afterEach(() => {
    fetchSpy.mockRestore();
    delete process.env.STORAGE_DIR;
    fs.rmSync(storageDir, { recursive: true, force: true });
  });

  test("uses the bundled map when the cache was never written", async () => {
    const finder = loadFinder();

    expect(fs.existsSync(cacheFile())).toBe(false);
    await Promise.resolve(); // let the (stubbed) background pull settle
    expect(fetchSpy).toHaveBeenCalledWith(REMOTE_MODEL_MAP_URL);

    expect(finder.get("deepseek", "deepseek-chat")).toBe(128000);
    expect(finder.get("deepseek", "deepseek-flash")).toBe(1000000);
    expect(finder.get("openai", "gpt-4o")).toBe(128000);
  });

  test("prefers the synced map and still covers models it does not list", () => {
    writeCache({ deepseek: { "deepseek-chat": 131072 } });
    const finder = loadFinder();

    // A fresh cache is used as-is and no pull is attempted.
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(finder.get("deepseek", "deepseek-chat")).toBe(131072);
    // The synced map has no entry for the newer model, so the bundled
    // window is used instead of dropping to the provider default.
    expect(finder.get("deepseek", "deepseek-flash")).toBe(1000000);
  });

  test("returns the provider map when no model is requested", () => {
    const finder = loadFinder();

    expect(finder.get("deepseek")).toMatchObject({
      "deepseek-chat": 128000,
      "deepseek-flash": 1000000,
      "deepseek-v4-flash": 1000000,
      "deepseek-v4-pro": 1000000,
    });
  });

  test("falls back for every provider, not just DeepSeek", () => {
    const finder = loadFinder();

    expect(finder.get("anthropic", "claude-3-5-sonnet-latest")).toBe(200000);
    expect(finder.get("groq", "mixtral-8x7b-32768")).toBe(32768);
    expect(finder.get("openai", "gpt-4.1")).toBe(1047576);
    expect(finder.get("gemini", "gemini-2.0-flash")).toBe(1048576);
  });

  test("hands out a copy so callers cannot mutate the bundled map", () => {
    const finder = loadFinder();
    // Resolved after the reset above, so this is the same module instance the
    // finder was built from.
    const legacyModelMap = require("../../../../utils/AiProviders/modelMap/legacy");

    // helpers/customModels.js reads this map to build provider model lists.
    const providerMap = finder.get("deepseek");
    providerMap["deepseek-flash"] = 1;

    expect(providerMap).not.toBe(legacyModelMap.deepseek);
    expect(finder.get("deepseek", "deepseek-flash")).toBe(1000000);
    expect(legacyModelMap.deepseek["deepseek-flash"]).toBe(1000000);
  });

  test("still returns null for providers and models that are unknown", () => {
    const finder = loadFinder();

    expect(finder.get("not-a-provider", "not-a-model")).toBeNull();
    expect(finder.get("deepseek", "not-a-model")).toBeNull();
  });
});
