/* eslint-env jest */

describe("GenericOpenAiLLM.parseRequestParams", () => {
  const ORIGINAL_ENV = process.env;
  let warnSpy;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
    delete process.env.GENERIC_OPEN_AI_TOP_P;
    delete process.env.GENERIC_OPEN_AI_FREQUENCY_PENALTY;
    delete process.env.GENERIC_OPEN_AI_PRESENCE_PENALTY;
    delete process.env.GENERIC_OPEN_AI_SEED;
    delete process.env.GENERIC_OPEN_AI_STOP;
    delete process.env.GENERIC_OPEN_AI_EXTRA_PARAMS;
    warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  test("returns empty object when no request param env vars are set", () => {
    const { GenericOpenAiLLM } = require("../../../../utils/AiProviders/genericOpenAi");
    expect(GenericOpenAiLLM.parseRequestParams()).toEqual({});
  });

  test("includes top_p when GENERIC_OPEN_AI_TOP_P is set", () => {
    process.env.GENERIC_OPEN_AI_TOP_P = "0.9";
    const { GenericOpenAiLLM } = require("../../../../utils/AiProviders/genericOpenAi");
    expect(GenericOpenAiLLM.parseRequestParams()).toEqual({ top_p: 0.9 });
  });

  test("includes frequency_penalty and presence_penalty when set", () => {
    process.env.GENERIC_OPEN_AI_FREQUENCY_PENALTY = "0.5";
    process.env.GENERIC_OPEN_AI_PRESENCE_PENALTY = "0.25";
    const { GenericOpenAiLLM } = require("../../../../utils/AiProviders/genericOpenAi");
    expect(GenericOpenAiLLM.parseRequestParams()).toEqual({
      frequency_penalty: 0.5,
      presence_penalty: 0.25,
    });
  });

  test("includes seed when GENERIC_OPEN_AI_SEED is set", () => {
    process.env.GENERIC_OPEN_AI_SEED = "42";
    const { GenericOpenAiLLM } = require("../../../../utils/AiProviders/genericOpenAi");
    expect(GenericOpenAiLLM.parseRequestParams()).toEqual({ seed: 42 });
  });

  test("parses GENERIC_OPEN_AI_STOP as a JSON array", () => {
    process.env.GENERIC_OPEN_AI_STOP = '["</s>","###"]';
    const { GenericOpenAiLLM } = require("../../../../utils/AiProviders/genericOpenAi");
    expect(GenericOpenAiLLM.parseRequestParams()).toEqual({
      stop: ["</s>", "###"],
    });
  });

  test("parses GENERIC_OPEN_AI_STOP as comma-separated values", () => {
    process.env.GENERIC_OPEN_AI_STOP = "</s>, ### , END";
    const { GenericOpenAiLLM } = require("../../../../utils/AiProviders/genericOpenAi");
    expect(GenericOpenAiLLM.parseRequestParams()).toEqual({
      stop: ["</s>", "###", "END"],
    });
  });

  test("parses GENERIC_OPEN_AI_STOP as a single string", () => {
    process.env.GENERIC_OPEN_AI_STOP = "</s>";
    const { GenericOpenAiLLM } = require("../../../../utils/AiProviders/genericOpenAi");
    expect(GenericOpenAiLLM.parseRequestParams()).toEqual({ stop: "</s>" });
  });

  test("merges GENERIC_OPEN_AI_EXTRA_PARAMS JSON object into params", () => {
    process.env.GENERIC_OPEN_AI_TOP_P = "0.8";
    process.env.GENERIC_OPEN_AI_EXTRA_PARAMS =
      '{"repetition_penalty":1.1,"top_k":40}';
    const { GenericOpenAiLLM } = require("../../../../utils/AiProviders/genericOpenAi");
    expect(GenericOpenAiLLM.parseRequestParams()).toEqual({
      top_p: 0.8,
      repetition_penalty: 1.1,
      top_k: 40,
    });
  });

  test("warns and ignores invalid GENERIC_OPEN_AI_EXTRA_PARAMS JSON", () => {
    process.env.GENERIC_OPEN_AI_EXTRA_PARAMS = "{not valid json";
    const { GenericOpenAiLLM } = require("../../../../utils/AiProviders/genericOpenAi");
    expect(GenericOpenAiLLM.parseRequestParams()).toEqual({});
    expect(warnSpy).toHaveBeenCalledWith(
      "[GenericOpenAiLLM] Failed to parse GENERIC_OPEN_AI_EXTRA_PARAMS as JSON. Ignoring value."
    );
  });

  test("warns and ignores non-object GENERIC_OPEN_AI_EXTRA_PARAMS JSON", () => {
    process.env.GENERIC_OPEN_AI_EXTRA_PARAMS = '["not","an","object"]';
    const { GenericOpenAiLLM } = require("../../../../utils/AiProviders/genericOpenAi");
    expect(GenericOpenAiLLM.parseRequestParams()).toEqual({});
    expect(warnSpy).toHaveBeenCalledWith(
      "[GenericOpenAiLLM] GENERIC_OPEN_AI_EXTRA_PARAMS must be a JSON object. Ignoring value."
    );
  });

  test("skips invalid numeric env values", () => {
    process.env.GENERIC_OPEN_AI_TOP_P = "not-a-number";
    process.env.GENERIC_OPEN_AI_SEED = "also-bad";
    const { GenericOpenAiLLM } = require("../../../../utils/AiProviders/genericOpenAi");
    expect(GenericOpenAiLLM.parseRequestParams()).toEqual({});
  });
});

describe("GenericOpenAiLLM completion request params", () => {
  const ORIGINAL_ENV = process.env;
  let createMock;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
    process.env.GENERIC_OPEN_AI_BASE_PATH = "http://localhost:1234/v1";
    process.env.GENERIC_OPEN_AI_MODEL_PREF = "test-model";
    process.env.GENERIC_OPEN_AI_TOP_P = "0.95";
    process.env.GENERIC_OPEN_AI_EXTRA_PARAMS = '{"repetition_penalty":1.2}';

    createMock = jest.fn().mockResolvedValue({
      choices: [{ message: { content: "hello" } }],
      usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
    });

    jest.doMock("openai", () => ({
      OpenAI: jest.fn().mockImplementation(() => ({
        chat: {
          completions: {
            create: createMock,
          },
        },
      })),
    }));
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  test("getChatCompletion merges env request params into API call", async () => {
    const { GenericOpenAiLLM } = require("../../../../utils/AiProviders/genericOpenAi");
    const llm = new GenericOpenAiLLM();
    await llm.getChatCompletion([{ role: "user", content: "hi" }], {
      temperature: 0.5,
    });

    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "test-model",
        temperature: 0.5,
        max_tokens: 1024,
        top_p: 0.95,
        repetition_penalty: 1.2,
        messages: [{ role: "user", content: "hi" }],
      })
    );
  });

  test("streamGetChatCompletion merges env request params into API call", async () => {
    const asyncIterator = {
      async *[Symbol.asyncIterator]() {
        yield {
          choices: [{ delta: { content: "hi" }, finish_reason: "stop" }],
        };
      },
    };
    createMock.mockResolvedValue(asyncIterator);

    jest.doMock("../../../../utils/helpers/chat/LLMPerformanceMonitor", () => ({
      LLMPerformanceMonitor: {
        measureStream: jest.fn(async ({ func }) => ({
          stream: await func,
          endMeasurement: jest.fn(),
        })),
      },
    }));

    const { GenericOpenAiLLM } = require("../../../../utils/AiProviders/genericOpenAi");
    const llm = new GenericOpenAiLLM();
    await llm.streamGetChatCompletion([{ role: "user", content: "hi" }], {
      temperature: 0.6,
    });

    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "test-model",
        stream: true,
        temperature: 0.6,
        top_p: 0.95,
        repetition_penalty: 1.2,
      })
    );
  });
});
