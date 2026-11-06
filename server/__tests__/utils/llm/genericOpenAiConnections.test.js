const path = require("path");
const fs = require("fs");
const os = require("os");

jest.mock("../../../utils/helpers/updateENV", () => ({
  updateENV: jest.fn(async () => ({ newValues: {}, error: null })),
}));

const { updateENV } = require("../../../utils/helpers/updateENV");
const {
  GenericOpenAiConnections,
} = require("../../../utils/llm/genericOpenAiConnections");

describe("GenericOpenAiConnections", () => {
  let storageDir;

  beforeEach(() => {
    storageDir = fs.mkdtempSync(path.join(os.tmpdir(), "generic-openai-conn-"));
    process.env.STORAGE_DIR = storageDir;
    process.env.NODE_ENV = "test";
    GenericOpenAiConnections._instance = undefined;
    updateENV.mockClear();
  });

  afterEach(() => {
    GenericOpenAiConnections._instance = undefined;
    delete process.env.STORAGE_DIR;
    delete process.env.GENERIC_OPEN_AI_BASE_PATH;
    delete process.env.GENERIC_OPEN_AI_MODEL_PREF;
    fs.rmSync(storageDir, { recursive: true, force: true });
  });

  it("creates, lists, and summarizes saved connections without exposing API keys", () => {
    const manager = new GenericOpenAiConnections();
    const { connection, error } = manager.upsertConnection({
      name: "RunPod Worker",
      basePath: "https://api.runpod.example/v1",
      apiKey: "secret-key",
      modelPref: "llama-3",
      tokenLimit: 8192,
      maxTokens: 1024,
    });

    expect(error).toBeNull();
    expect(connection?.name).toBe("RunPod Worker");

    const summaries = manager.listSummaries();
    expect(summaries).toHaveLength(1);
    expect(summaries[0]).toMatchObject({
      name: "RunPod Worker",
      basePath: "https://api.runpod.example/v1",
      modelPref: "llama-3",
      tokenLimit: 8192,
      maxTokens: 1024,
      hasApiKey: true,
      isActive: true,
    });
    expect(summaries[0].apiKey).toBeUndefined();
  });

  it("updates an existing connection and preserves the API key when omitted", () => {
    const manager = new GenericOpenAiConnections();
    const first = manager.upsertConnection({
      name: "Local",
      basePath: "https://localhost:8000/v1",
      apiKey: "keep-me",
      modelPref: "qwen",
      tokenLimit: 4096,
      maxTokens: 512,
    });
    expect(first.error).toBeNull();

    const updated = manager.upsertConnection({
      id: first.connection.id,
      name: "Local v2",
      basePath: "https://localhost:8000/v1",
      modelPref: "qwen-2",
      tokenLimit: 8192,
      maxTokens: 1024,
    });
    expect(updated.error).toBeNull();

    const stored = manager.getConnection(first.connection.id);
    expect(stored?.apiKey).toBe("keep-me");
    expect(stored?.modelPref).toBe("qwen-2");
  });

  it("activates a saved connection through updateENV", async () => {
    const manager = new GenericOpenAiConnections();
    const { connection } = manager.upsertConnection({
      name: "LiteLLM",
      basePath: "https://litellm.example/v1",
      apiKey: "sk-test",
      modelPref: "gpt-4o-mini",
      tokenLimit: 8192,
      maxTokens: 2048,
    });

    const result = await manager.activateConnection(connection.id);
    expect(result.success).toBe(true);
    expect(updateENV).toHaveBeenCalledWith(
      {
        LLMProvider: "generic-openai",
        GenericOpenAiBasePath: "https://litellm.example/v1",
        GenericOpenAiModelPref: "gpt-4o-mini",
        GenericOpenAiTokenLimit: "8192",
        GenericOpenAiMaxTokens: "2048",
        GenericOpenAiKey: "sk-test",
      },
      false
    );
    expect(manager.getActiveConnectionId()).toBe(connection.id);
  });

  it("deletes a saved connection", () => {
    const manager = new GenericOpenAiConnections();
    const { connection } = manager.upsertConnection({
      name: "Temp",
      basePath: "https://api.example/v1",
      modelPref: "test-model",
      tokenLimit: 4096,
      maxTokens: 512,
    });

    const deleted = manager.deleteConnection(connection.id);
    expect(deleted.success).toBe(true);
    expect(manager.listConnections()).toHaveLength(0);
    expect(manager.getActiveConnectionId()).toBeNull();
  });
});
