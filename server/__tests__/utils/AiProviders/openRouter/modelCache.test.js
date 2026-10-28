const fs = require("fs");
const os = require("os");
const path = require("path");

// The provider resolves its cache folder from STORAGE_DIR when the module
// loads, so each test loads a fresh copy pointed at its own temp folder.
function loadWithStorage(storageDir) {
  process.env.STORAGE_DIR = storageDir;
  let mod;
  jest.isolateModules(() => {
    mod = require("../../../../utils/AiProviders/openRouter");
  });
  return mod;
}

function mockFetchJson(body) {
  global.fetch = jest.fn(async () => ({ json: async () => body }));
}

const ORIGINAL_ENV = process.env;
const ORIGINAL_FETCH = global.fetch;
let storageDir;
let cacheFile;

beforeEach(() => {
  process.env = { ...ORIGINAL_ENV };
  storageDir = fs.mkdtempSync(path.join(os.tmpdir(), "or-cache-"));
  cacheFile = path.join(storageDir, "models", "openrouter", "models.json");
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
  global.fetch = ORIGINAL_FETCH;
  fs.rmSync(storageDir, { recursive: true, force: true });
  jest.restoreAllMocks();
});

describe("fetchOpenRouterModels cache writes", () => {
  it("caches the model list when OpenRouter returns models", async () => {
    const { fetchOpenRouterModels } = loadWithStorage(storageDir);
    mockFetchJson({
      data: [{ id: "acme/chat-1", name: "Chat 1", context_length: 128000 }],
    });

    const models = await fetchOpenRouterModels();

    expect(models["acme/chat-1"].maxLength).toBe(128000);
    const cached = JSON.parse(fs.readFileSync(cacheFile, "utf8"));
    expect(cached["acme/chat-1"].maxLength).toBe(128000);
  });

  it("does not create a cache from an error response", async () => {
    const { fetchOpenRouterModels } = loadWithStorage(storageDir);
    mockFetchJson({ error: { message: "Rate limit exceeded", code: 429 } });

    const models = await fetchOpenRouterModels();

    expect(models).toEqual({});
    expect(fs.existsSync(cacheFile)).toBe(false);
  });

  it("keeps the last good cache when a later refresh fails", async () => {
    const { fetchOpenRouterModels, OpenRouterLLM } =
      loadWithStorage(storageDir);
    mockFetchJson({
      data: [{ id: "acme/chat-1", name: "Chat 1", context_length: 64000 }],
    });
    await fetchOpenRouterModels();

    mockFetchJson({ error: { message: "Internal error", code: 500 } });
    await fetchOpenRouterModels();

    expect(OpenRouterLLM.promptWindowLimit("acme/chat-1")).toBe(64000);
  });
});
