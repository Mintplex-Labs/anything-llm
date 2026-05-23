/* eslint-env jest */

const fs = require("fs");
const os = require("os");
const path = require("path");

jest.mock("../../../models/eventLogs", () => ({
  EventLogs: {
    logEvent: jest.fn().mockResolvedValue({ eventLog: null, message: null }),
  },
}));

describe("Qianfan LLM provider wiring", () => {
  const ORIGINAL_ENV = process.env;
  const ORIGINAL_FETCH = global.fetch;
  const STORAGE_DIR = path.join(os.tmpdir(), "anythingllm-qianfan-test");

  beforeEach(() => {
    jest.resetModules();
    fs.rmSync(STORAGE_DIR, { recursive: true, force: true });
    process.env = {
      ...ORIGINAL_ENV,
      NODE_ENV: "test",
      STORAGE_DIR,
      EMBEDDING_ENGINE: "native",
    };
    const contextWindowDir = path.join(STORAGE_DIR, "models", "context-windows");
    fs.mkdirSync(contextWindowDir, { recursive: true });
    fs.writeFileSync(
      path.join(contextWindowDir, "context-windows.json"),
      JSON.stringify({
        qianfan: {
          "ernie-4.5-turbo-128k": 128000,
        },
      })
    );
    fs.writeFileSync(
      path.join(contextWindowDir, ".cached_at"),
      Date.now().toString()
    );
    delete process.env.QIANFAN_API_KEY;
    delete process.env.QIANFAN_MODEL_PREF;
    delete process.env.LLM_PROVIDER;
  });

  afterEach(() => {
    global.fetch = ORIGINAL_FETCH;
    fs.rmSync(STORAGE_DIR, { recursive: true, force: true });
    jest.restoreAllMocks();
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  test("helpers resolve qianfan provider, class, and base model preference", () => {
    process.env.QIANFAN_API_KEY = "bce-v3/test-key";
    process.env.QIANFAN_MODEL_PREF = "ernie-4.5-turbo-128k";

    const {
      getLLMProvider,
      getLLMProviderClass,
      getBaseLLMProviderModel,
    } = require("../../../utils/helpers");

    const provider = getLLMProvider({ provider: "qianfan" });
    expect(provider.className).toBe("QianfanLLM");
    expect(provider.model).toBe("ernie-4.5-turbo-128k");
    expect(getLLMProviderClass({ provider: "qianfan" }).name).toBe(
      "QianfanLLM"
    );
    expect(getBaseLLMProviderModel({ provider: "qianfan" })).toBe(
      "ernie-4.5-turbo-128k"
    );
  });

  test("updateENV accepts qianfan as a supported LLM and persists qianfan keys", async () => {
    const { updateENV } = require("../../../utils/helpers/updateENV");
    const result = await updateENV({
      LLMProvider: "qianfan",
      QianfanApiKey: "bce-v3/test-key",
      QianfanModelPref: "ernie-4.5-turbo-128k",
    });

    expect(result.error).toBe(false);
    expect(result.newValues).toEqual({
      LLMProvider: "qianfan",
      QianfanApiKey: "bce-v3/test-key",
      QianfanModelPref: "ernie-4.5-turbo-128k",
    });
    expect(process.env.LLM_PROVIDER).toBe("qianfan");
    expect(process.env.QIANFAN_API_KEY).toBe("bce-v3/test-key");
    expect(process.env.QIANFAN_MODEL_PREF).toBe("ernie-4.5-turbo-128k");
  });

  test("AgentHandler accepts qianfan setup and default model", () => {
    const { AgentHandler } = require("../../../utils/agents");
    const handler = new AgentHandler({ uuid: "test-invocation" });

    expect(handler.providerDefault("qianfan")).toBe("ernie-4.5-turbo-128k");
    handler.provider = "qianfan";
    expect(() => handler.checkSetup()).toThrow(
      "Qianfan API key must be provided to use agents."
    );

    process.env.QIANFAN_API_KEY = "bce-v3/test-key";
    expect(() => handler.checkSetup()).not.toThrow();
  });

  test("custom model discovery maps qianfan /v2/models responses", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        data: [
          { id: "ernie-4.5-turbo-128k", owned_by: "baidu" },
          { id: "ernie-4.0-turbo-8k-latest", owned_by: "" },
        ],
      }),
    });

    const { getCustomModels } = require("../../../utils/helpers/customModels");
    const { models, error } = await getCustomModels("qianfan", "bce-v3/key");

    expect(error).toBeNull();
    expect(global.fetch).toHaveBeenCalledWith(
      "https://qianfan.baidubce.com/v2/models",
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({
          Authorization: "Bearer bce-v3/key",
        }),
      })
    );
    expect(models).toEqual([
      {
        id: "ernie-4.5-turbo-128k",
        name: "ernie-4.5-turbo-128k",
        organization: "baidu",
      },
      {
        id: "ernie-4.0-turbo-8k-latest",
        name: "ernie-4.0-turbo-8k-latest",
        organization: "baidu-qianfan",
      },
    ]);
  });

  test("custom model discovery falls back to ERNIE models when remote lookup fails", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    global.fetch = jest.fn().mockRejectedValue(new Error("network error"));

    const { getCustomModels } = require("../../../utils/helpers/customModels");
    const { models, error } = await getCustomModels("qianfan", "bce-v3/key");

    expect(error).toBeNull();
    expect(models).toEqual(
      expect.arrayContaining([
        {
          id: "ernie-4.5-turbo-128k",
          name: "ernie-4.5-turbo-128k",
          organization: "baidu-qianfan",
        },
      ])
    );
  });

  test("model router can delegate fallback routes to qianfan", async () => {
    process.env.QIANFAN_API_KEY = "bce-v3/test-key";

    const { AnythingLLMModelRouter } = require("../../../utils/AiProviders/modelRouter");
    const router = new AnythingLLMModelRouter({
      id: 1,
      slug: "qianfan-workspace",
      name: "Qianfan Workspace",
      router_id: 1,
    });
    router.routerService = {
      resolveRouterForWorkspace: jest.fn().mockResolvedValue({
        id: 1,
        name: "Qianfan Router",
        rules: [],
        fallback_provider: "qianfan",
        fallback_model: "ernie-4.5-turbo-128k",
        cooldown_seconds: 0,
      }),
      routeCacheKey: jest.fn().mockReturnValue("test-route"),
      logRoutingContext: jest.fn(),
      evaluateCalculatedRules: jest.fn().mockReturnValue(null),
      evaluateLLMRules: jest
        .fn()
        .mockResolvedValue({ route: null, fromCache: false }),
      getStickyRoute: jest.fn().mockReturnValue(null),
      shouldNotify: jest.fn().mockReturnValue(false),
      log: jest.fn(),
    };

    await router.resolve({ prompt: "hello" });

    expect(router.delegateProvider.className).toBe("QianfanLLM");
    expect(router.routingMetadata.routedTo).toEqual(
      expect.objectContaining({
        provider: "qianfan",
        model: "ernie-4.5-turbo-128k",
        isFallback: true,
      })
    );
  });
});
