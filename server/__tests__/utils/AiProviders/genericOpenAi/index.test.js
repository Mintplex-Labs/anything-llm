/* eslint-env jest */
const fs = require("fs");
const os = require("os");
const path = require("path");

describe("getLLMProviderRequestParams", () => {
  let configDir;
  let warnSpy;

  beforeEach(() => {
    jest.resetModules();
    configDir = fs.mkdtempSync(path.join(os.tmpdir(), "llm-provider-config-"));
    warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
    fs.rmSync(configDir, { recursive: true, force: true });
  });

  function writeConfig(provider, data) {
    fs.writeFileSync(
      path.join(configDir, `${provider}.json`),
      typeof data === "string" ? data : JSON.stringify(data)
    );
  }

  test("returns empty object when config file is missing", () => {
    const {
      getLLMProviderRequestParams,
    } = require("../../../../utils/helpers/llmProviderConfig");
    expect(
      getLLMProviderRequestParams("generic-openai", null, { configDir })
    ).toEqual({});
  });

  test("returns provider-level params from JSON config", () => {
    writeConfig("generic-openai", {
      top_p: 0.9,
      repetition_penalty: 1.1,
      xtc_probability: 0.05,
    });
    const {
      getLLMProviderRequestParams,
    } = require("../../../../utils/helpers/llmProviderConfig");
    expect(
      getLLMProviderRequestParams("generic-openai", null, { configDir })
    ).toEqual({
      top_p: 0.9,
      repetition_penalty: 1.1,
      xtc_probability: 0.05,
    });
  });

  test("merges per-model overrides on top of provider defaults", () => {
    writeConfig("generic-openai", {
      top_p: 0.9,
      repetition_penalty: 1.1,
      models: {
        "local/model-a": {
          top_p: 0.95,
          xtc_threshold: 0.1,
        },
      },
    });
    const {
      getLLMProviderRequestParams,
    } = require("../../../../utils/helpers/llmProviderConfig");
    expect(
      getLLMProviderRequestParams("generic-openai", "local/model-a", {
        configDir,
      })
    ).toEqual({
      top_p: 0.95,
      repetition_penalty: 1.1,
      xtc_threshold: 0.1,
    });
  });

  test("does not apply another model's overrides", () => {
    writeConfig("generic-openai", {
      top_p: 0.9,
      models: {
        "model-a": { top_p: 0.5 },
        "model-b": { seed: 7 },
      },
    });
    const {
      getLLMProviderRequestParams,
    } = require("../../../../utils/helpers/llmProviderConfig");
    expect(
      getLLMProviderRequestParams("generic-openai", "model-b", { configDir })
    ).toEqual({
      top_p: 0.9,
      seed: 7,
    });
  });

  test("strips reserved and structural keys from request params", () => {
    writeConfig("generic-openai", {
      top_p: 0.8,
      model: "should-not-override",
      messages: [{ role: "user", content: "nope" }],
      stream: true,
      models: {
        "model-a": {
          temperature: 0.2,
          tools: [],
        },
      },
    });
    const {
      getLLMProviderRequestParams,
    } = require("../../../../utils/helpers/llmProviderConfig");
    expect(
      getLLMProviderRequestParams("generic-openai", "model-a", { configDir })
    ).toEqual({
      top_p: 0.8,
      temperature: 0.2,
    });
  });

  test("warns and ignores non-object JSON config", () => {
    writeConfig("generic-openai", '["not","an","object"]');
    const {
      getLLMProviderRequestParams,
    } = require("../../../../utils/helpers/llmProviderConfig");
    expect(
      getLLMProviderRequestParams("generic-openai", null, { configDir })
    ).toEqual({});
    expect(warnSpy).toHaveBeenCalledWith(
      "[LLMProviderConfig] generic-openai.json must be a JSON object. Ignoring."
    );
  });
});

describe("GenericOpenAiLLM completion request params", () => {
  const ORIGINAL_ENV = process.env;
  let createMock;
  let configDir;

  beforeEach(() => {
    jest.resetModules();
    jest.dontMock("../../../../utils/helpers/chat/LLMPerformanceMonitor");
    process.env = { ...ORIGINAL_ENV };
    process.env.GENERIC_OPEN_AI_BASE_PATH = "http://localhost:1234/v1";
    process.env.GENERIC_OPEN_AI_MODEL_PREF = "test-model";
    process.env.NODE_ENV = "development";

    configDir = fs.mkdtempSync(path.join(os.tmpdir(), "llm-provider-config-"));
    fs.writeFileSync(
      path.join(configDir, "generic-openai.json"),
      JSON.stringify({
        top_p: 0.95,
        repetition_penalty: 1.2,
        models: {
          "test-model": {
            seed: 42,
          },
        },
      })
    );

    jest.doMock("../../../../utils/helpers/llmProviderConfig", () => {
      const actual = jest.requireActual(
        "../../../../utils/helpers/llmProviderConfig"
      );
      return {
        ...actual,
        getLLMProviderRequestParams: (provider, model) =>
          actual.getLLMProviderRequestParams(provider, model, { configDir }),
      };
    });

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

  afterEach(() => {
    fs.rmSync(configDir, { recursive: true, force: true });
    jest.dontMock("../../../../utils/helpers/chat/LLMPerformanceMonitor");
    jest.dontMock("../../../../utils/helpers/llmProviderConfig");
    jest.dontMock("openai");
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  test("getChatCompletion merges JSON config params into API call", async () => {
    const {
      GenericOpenAiLLM,
    } = require("../../../../utils/AiProviders/genericOpenAi");
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
        seed: 42,
        messages: [{ role: "user", content: "hi" }],
      })
    );
  });

  test("streamGetChatCompletion merges JSON config params into API call", async () => {
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
        measureAsyncFunction: jest.fn(async (promise) => ({
          output: await promise,
          duration: 0.01,
        })),
      },
    }));

    const {
      GenericOpenAiLLM,
    } = require("../../../../utils/AiProviders/genericOpenAi");
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
        seed: 42,
      })
    );
  });

  test("app-owned fields win over config values", async () => {
    fs.writeFileSync(
      path.join(configDir, "generic-openai.json"),
      JSON.stringify({
        model: "config-model",
        temperature: 0.1,
        max_tokens: 7,
        top_p: 0.5,
      })
    );

    const {
      GenericOpenAiLLM,
    } = require("../../../../utils/AiProviders/genericOpenAi");
    const llm = new GenericOpenAiLLM();
    await llm.getChatCompletion([{ role: "user", content: "hi" }], {
      temperature: 0.5,
    });

    const body = createMock.mock.calls[0][0];
    expect(body.model).toBe("test-model");
    expect(body.temperature).toBe(0.5);
    expect(body.max_tokens).toBe(1024);
    expect(body.top_p).toBe(0.5);
  });
});
