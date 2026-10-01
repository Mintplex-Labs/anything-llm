const { LMStudioLLM } = require("../../../../utils/AiProviders/lmStudio");

const ORIGINAL_ENV = process.env;
const ORIGINAL_FETCH = global.fetch;

/** Stubs the LM Studio /api/v1/models listing with one model entry. */
function mockModelsApi(model) {
  global.fetch = jest.fn(async () => ({
    ok: true,
    json: async () => ({ models: [model] }),
  }));
}

beforeEach(() => {
  process.env = {
    ...ORIGINAL_ENV,
    LMSTUDIO_BASE_PATH: "http://127.0.0.1:1234/v1",
  };
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
  global.fetch = ORIGINAL_FETCH;
  jest.restoreAllMocks();
});

describe("LMStudioLLM reasoning capabilities", () => {
  it("offers on and off for toggle models", async () => {
    mockModelsApi({
      key: "qwen/qwen3.5-9b",
      capabilities: {
        reasoning: { allowed_options: ["off", "on"], default: "on" },
      },
    });
    const caps = await new LMStudioLLM(
      null,
      "qwen/qwen3.5-9b"
    ).getModelCapabilities();
    expect(caps.reasoning).toBe(true);
    expect(caps.reasoningOptions).toEqual(["off", "on"]);
  });

  it("offers only the levels the model allows", async () => {
    mockModelsApi({
      key: "openai/gpt-oss-20b",
      capabilities: {
        reasoning: {
          allowed_options: ["low", "medium", "high"],
          default: "medium",
        },
      },
    });
    const caps = await new LMStudioLLM(
      null,
      "openai/gpt-oss-20b"
    ).getModelCapabilities();
    expect(caps.reasoningOptions).toEqual(["low", "medium", "high"]);
  });

  it("drops allowed options we cannot store", async () => {
    mockModelsApi({
      key: "some/model",
      capabilities: {
        reasoning: { allowed_options: ["on", "turbo", "xhigh"] },
      },
    });
    const caps = await new LMStudioLLM(
      null,
      "some/model"
    ).getModelCapabilities();
    expect(caps.reasoningOptions).toEqual(["on"]);
  });

  it("offers nothing for models without reasoning", async () => {
    mockModelsApi({
      key: "ibm/granite-4-h-tiny",
      capabilities: { vision: false, trained_for_tool_use: true },
    });
    const caps = await new LMStudioLLM(
      null,
      "ibm/granite-4-h-tiny"
    ).getModelCapabilities();
    expect(caps.reasoning).toBe(false);
    expect(caps.reasoningOptions).toEqual([]);
  });

  it("reports unknown when the models API fails", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    global.fetch = jest.fn(async () => ({
      ok: false,
      statusText: "Bad Gateway",
    }));
    const caps = await new LMStudioLLM(
      null,
      "qwen/qwen3.5-9b"
    ).getModelCapabilities();
    expect(caps.reasoning).toBe("unknown");
    expect(caps.reasoningOptions).toEqual([]);
  });
});
