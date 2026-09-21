jest.mock("jsonwebtoken", () => ({}));
jest.mock("openai", () => ({
  OpenAI: jest.fn(() => ({
    models: { list: jest.fn().mockResolvedValue({ body: [] }) },
  })),
}));

const fs = require("fs");
const os = require("os");
const path = require("path");
const originalEnv = process.env;
const storageDir = fs.mkdtempSync(path.join(os.tmpdir(), "together-window-"));
process.env = {
  ...originalEnv,
  STORAGE_DIR: storageDir,
  TOGETHER_AI_API_KEY: "test-key",
  SIG_KEY: "test-key",
  SIG_SALT: "test-salt",
};

const { TogetherAiLLM } = require("../../../../utils/AiProviders/togetherAi");
const {
  convertToPromptHistory,
} = require("../../../../utils/helpers/chat/responses");
const { TokenManager } = require("../../../../utils/helpers/tiktoken");
const { OpenAI } = require("openai");
const cacheDir = path.join(storageDir, "models", "togetherAi");
const cachePath = path.join(cacheDir, "models.json");
const catalog = [
  { id: "fixture-small", type: "chat", maxLength: 16384 },
  { id: "fixture-large", type: "chat", maxLength: 131072 },
];

beforeEach(() => {
  fs.mkdirSync(cacheDir, { recursive: true });
  fs.writeFileSync(cachePath, JSON.stringify(catalog));
  fs.writeFileSync(path.join(cacheDir, ".cached_at"), String(Date.now()));
  OpenAI.mockClear();
});

afterAll(() => {
  process.env = originalEnv;
  fs.rmSync(storageDir, { recursive: true, force: true });
});

describe("TogetherAiLLM context windows", () => {
  it.each(catalog)(
    "returns the cached window for $id synchronously",
    (model) => {
      const llm = new TogetherAiLLM({}, model.id);
      for (const limit of [
        TogetherAiLLM.promptWindowLimit(model.id),
        llm.promptWindowLimit(),
      ]) {
        expect(typeof limit).toBe("number");
        expect(Number.isFinite(limit)).toBe(true);
        expect(limit).toBe(model.maxLength);
      }
    }
  );

  it.each(catalog)("initializes usable budgets for $id", (model) => {
    const llm = new TogetherAiLLM({}, model.id);
    expect(Object.values(llm.limits).every(Number.isFinite)).toBe(true);
  });

  it("retains every history pair when the complete prompt fits", async () => {
    const model = catalog[1];
    const llm = new TogetherAiLLM({}, model.id);
    const rawHistory = Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      prompt: `word number ${i + 1}`,
      response: JSON.stringify({ text: `word ${i + 1} noted` }),
    }));
    const chatHistory = convertToPromptHistory(rawHistory);
    const promptArgs = {
      systemPrompt: "Remember the words.",
      contextTexts: [],
      chatHistory,
      userPrompt: "Which words have we discussed?",
    };
    const authored = llm.constructPrompt(promptArgs);
    expect(chatHistory).toHaveLength(24);
    // 600 is the response reserve messageArrayCompressor adds before comparing
    // against the window, so the whole prompt fits with room to spare.
    expect(new TokenManager(model.id).statsFrom(authored) + 600).toBeLessThan(
      model.maxLength
    );

    const messages = await llm.compressMessages(promptArgs, rawHistory);
    expect(messages).toEqual(authored);
    expect(messages.slice(1, -1)).toEqual(chatHistory);
  });

  it("uses the existing fallback when the cache file is absent", () => {
    fs.unlinkSync(cachePath);
    const llm = new TogetherAiLLM({}, catalog[0].id);
    // Compatibility control for the existing fallback, not a new default policy.
    expect(TogetherAiLLM.promptWindowLimit(catalog[0].id)).toBe(4096);
    expect(llm.promptWindowLimit()).toBe(4096);
  });

  it("reads old cached metadata without requesting a catalog refresh", () => {
    fs.writeFileSync(path.join(cacheDir, ".cached_at"), "0");
    const llm = new TogetherAiLLM({}, catalog[0].id);
    expect(TogetherAiLLM.promptWindowLimit(catalog[0].id)).toBe(
      catalog[0].maxLength
    );
    expect(llm.promptWindowLimit()).toBe(catalog[0].maxLength);
    // Control: the lookup is a pure read of the cache. The catalog refresh still
    // runs from model validation and from settings discovery, not from here.
    for (const { value: client } of OpenAI.mock.results) {
      expect(client.models.list).not.toHaveBeenCalled();
    }
  });
});
