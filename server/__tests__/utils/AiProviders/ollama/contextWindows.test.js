jest.mock("ollama", () => ({ Ollama: jest.fn() }));
jest.mock("../../../../utils/EmbeddingEngines/native", () => ({
  NativeEmbedder: jest.fn(),
}));

const { Ollama } = require("ollama");
const { OllamaAILLM } = require("../../../../utils/AiProviders/ollama");

const model = "example";
const env = process.env;
const list = jest.fn();
const show = jest.fn();
const chat = jest.fn();

function metadata(limit) {
  return {
    capabilities: ["completion"],
    model_info: { "test.context_length": limit },
  };
}

function connector(modelName = model) {
  return new OllamaAILLM(null, modelName);
}

describe("Ollama context window cache", () => {
  let now;

  beforeEach(() => {
    process.env = {
      ...env,
      OLLAMA_BASE_PATH: "http://localhost:11434",
      OLLAMA_AUTH_TOKEN: expect.getState().currentTestName,
    };
    delete process.env.OLLAMA_MODEL_TOKEN_LIMIT;
    list.mockReset().mockResolvedValue({
      models: [{ name: "example:latest" }, { name: "other:latest" }],
    });
    show.mockReset().mockResolvedValue(metadata(8192));
    chat.mockReset().mockResolvedValue({ message: { content: "response" } });
    Ollama.mockReset().mockImplementation(() => ({ list, show, chat }));
    jest.spyOn(console, "log").mockImplementation(() => {});
    now = 0;
    jest.spyOn(Date, "now").mockImplementation(() => now);
  });

  afterEach(() => {
    process.env = env;
    jest.restoreAllMocks();
  });

  test("reuses boot metadata across connectors without listing models again", async () => {
    await OllamaAILLM.cacheContextWindows(true);
    list.mockClear();
    show.mockClear();

    const clients = [connector(), connector("example:latest")];
    await Promise.all(clients.map((client) => client.getChatCompletion([])));

    expect(list).not.toHaveBeenCalled();
    expect(show).not.toHaveBeenCalled();
    expect(chat).toHaveBeenCalledTimes(2);
    for (const [request] of chat.mock.calls) {
      expect(request.options.num_ctx).toBe(8192);
    }
  });

  test("loads only the selected model and joins concurrent requests on a miss", async () => {
    const pending = Promise.withResolvers();
    show.mockReturnValue(pending.promise);
    const clients = [connector(), connector("example:latest")];
    const calls = clients.map((client) => client.getChatCompletion([]));

    pending.resolve(metadata(12288));
    await Promise.all(calls);

    expect(list).not.toHaveBeenCalled();
    expect(show).toHaveBeenCalledTimes(1);
    expect(clients.map((client) => client.promptWindowLimit())).toEqual([
      12288, 12288,
    ]);
  });

  test("keeps successful boot metadata when another model cannot be inspected", async () => {
    show
      .mockResolvedValueOnce(metadata(8192))
      .mockRejectedValueOnce(new Error("unavailable"));
    await OllamaAILLM.cacheContextWindows(true);
    expect(OllamaAILLM.maxContextWindow(model)).toBe(8192);

    show.mockResolvedValue(metadata(4096));
    const missing = connector("other:latest");
    await missing.assertModelContextLimits();

    expect(list).toHaveBeenCalledTimes(1);
    expect(show).toHaveBeenCalledTimes(3);
    expect(show).toHaveBeenLastCalledWith({ model: "other:latest" });
    expect(missing.promptWindowLimit()).toBe(4096);
  });

  test("refreshes an expired model without refreshing the rest of the inventory", async () => {
    await connector().assertModelContextLimits();
    list.mockClear();
    show.mockClear();
    show.mockResolvedValue(metadata(2048));
    now = 10 * 60 * 1000;

    const client = connector();
    await client.assertModelContextLimits();

    expect(list).not.toHaveBeenCalled();
    expect(show).toHaveBeenCalledTimes(1);
    expect(client.promptWindowLimit()).toBe(2048);
  });

  test("isolates connection changes from older requests resolving late", async () => {
    const pending = Promise.withResolvers();
    show.mockReturnValueOnce(pending.promise).mockResolvedValue(metadata(2048));
    const original = connector();
    const originalLimits = original.assertModelContextLimits();

    process.env.OLLAMA_BASE_PATH = "http://localhost:11435";
    const current = connector();
    await current.assertModelContextLimits();
    expect(current.promptWindowLimit()).toBe(2048);

    pending.resolve(metadata(8192));
    await originalLimits;
    expect(original.promptWindowLimit()).toBe(8192);
    expect(OllamaAILLM.promptWindowLimit(model)).toBe(2048);

    process.env.OLLAMA_AUTH_TOKEN = "different-token";
    show.mockResolvedValue(metadata(4096));
    const authenticated = connector();
    await authenticated.assertModelContextLimits();
    expect(authenticated.promptWindowLimit()).toBe(4096);
  });

  test("keeps the last known context after a failed refresh and retries next turn", async () => {
    await connector().assertModelContextLimits();
    now = 10 * 60 * 1000;
    show.mockRejectedValueOnce(new Error("unavailable"));
    const retry = connector();
    await retry.assertModelContextLimits();
    expect(retry.promptWindowLimit()).toBe(8192);

    show.mockResolvedValue(metadata(4096));
    const recovered = connector();
    await recovered.assertModelContextLimits();
    expect(recovered.promptWindowLimit()).toBe(4096);
    expect(show).toHaveBeenCalledTimes(3);
  });
});
