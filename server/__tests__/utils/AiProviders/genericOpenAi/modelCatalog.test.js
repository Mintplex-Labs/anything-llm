const {
  catalogReasoningOptions,
  catalogCache,
} = require("../../../../utils/AiProviders/genericOpenAi/modelCatalog");
const {
  GenericOpenAiLLM,
} = require("../../../../utils/AiProviders/genericOpenAi");
const GenericOpenAiProvider = require("../../../../utils/agents/aibitat/providers/genericOpenAi.js");

const ORIGINAL_ENV = process.env;

function makeClient(list) {
  return {
    baseURL: "http://localhost:8080/v1",
    models: { list: jest.fn(list) },
  };
}

function catalog(data) {
  return async () => ({ data });
}

function stubCreate() {
  return jest.fn().mockResolvedValue({
    choices: [{ message: { content: "ok" } }],
    usage: {},
  });
}

beforeEach(() => {
  process.env = {
    ...ORIGINAL_ENV,
    GENERIC_OPEN_AI_BASE_PATH: "http://localhost:8080/v1",
    GENERIC_OPEN_AI_MODEL_PREF: "test-model",
  };
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
  catalogCache.clear();
  jest.restoreAllMocks();
});

describe("catalogReasoningOptions", () => {
  it("maps NanoGPT levels to session levels, with none as off", async () => {
    const client = makeClient(
      catalog([
        { id: "m", reasoning_efforts: ["none", "low", "turbo", null, "max"] },
      ])
    );
    expect(await catalogReasoningOptions(client, "m")).toEqual([
      "off",
      "low",
      "max",
    ]);
    expect(client.models.list).toHaveBeenCalledWith(
      expect.objectContaining({ query: { detailed: true } })
    );
  });

  it("returns no levels for a model without reasoning metadata", async () => {
    const client = makeClient(
      catalog([
        { id: "m", object: "model" },
        { id: "other", reasoning_efforts: ["high"] },
      ])
    );
    expect(await catalogReasoningOptions(client, "m")).toEqual([]);
    expect(await catalogReasoningOptions(client, "missing")).toEqual([]);
  });

  it("requests the catalog once across models and concurrent calls", async () => {
    const client = makeClient(
      catalog([
        { id: "a", reasoning_efforts: ["low"] },
        { id: "b", reasoning_efforts: ["high"] },
      ])
    );
    const results = await Promise.all([
      catalogReasoningOptions(client, "a"),
      catalogReasoningOptions(client, "b"),
      catalogReasoningOptions(client, "a"),
    ]);
    expect(results).toEqual([["low"], ["high"], ["low"]]);
    expect(client.models.list).toHaveBeenCalledTimes(1);
  });

  it("does not request a failing catalog again until the cache expires", async () => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    const client = makeClient(async () => {
      throw new Error("404 Not Found");
    });
    expect(await catalogReasoningOptions(client, "m")).toEqual([]);
    await catalogReasoningOptions(client, "m");
    expect(client.models.list).toHaveBeenCalledTimes(1);

    const now = Date.now();
    jest.spyOn(Date, "now").mockReturnValue(now + 31 * 60 * 1000);
    await catalogReasoningOptions(client, "m");
    expect(client.models.list).toHaveBeenCalledTimes(2);
  });
});

describe("Generic OpenAI reasoning request body", () => {
  it("sends off as reasoning_effort none on the chat path", async () => {
    const llm = new GenericOpenAiLLM();
    const create = stubCreate();
    llm.openai = { chat: { completions: { create } } };
    await llm.getChatCompletion([], { reasoningEffort: "off" });
    expect(create.mock.calls[0][0].reasoning_effort).toBe("none");
  });

  it("omits reasoning_effort when no effort is set", async () => {
    const llm = new GenericOpenAiLLM();
    const create = stubCreate();
    llm.openai = { chat: { completions: { create } } };
    await llm.getChatCompletion([], {});
    expect(create.mock.calls[0][0]).not.toHaveProperty("reasoning_effort");
  });

  it("sends reasoning_effort on the agent path", async () => {
    const provider = new GenericOpenAiProvider({
      model: "test-model",
      reasoningEffort: "high",
    });
    provider.supportsNativeToolCalling = async () => true;
    const create = stubCreate();
    provider._client = { chat: { completions: { create } } };
    await provider.complete([{ role: "user", content: "hi" }], []);
    expect(create.mock.calls[0][0].reasoning_effort).toBe("high");
  });
});
