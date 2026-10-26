process.env.STORAGE_DIR = __dirname;
process.env.NODE_ENV = "test";

const {
  AnythingLLMModelRouter,
} = require("../../../../utils/AiProviders/modelRouter/index.js");

describe("AnythingLLMModelRouter temperature", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = {
      ...ORIGINAL_ENV,
      GENERIC_OPEN_AI_BASE_PATH: "http://localhost:8080/v1",
    };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  // Resolves straight to a calculated-rule route so the delegate is built
  // without touching the database or an LLM classifier.
  async function resolvedDelegate(workspace, temperature) {
    const router = new AnythingLLMModelRouter(workspace, null, temperature);
    const route = { provider: "generic-openai", model: "gemma4" };
    Object.assign(router.routerService, {
      resolveRouterForWorkspace: async () => ({ rules: [] }),
      routeCacheKey: () => "key",
      logRoutingContext: () => {},
      evaluateCalculatedRules: () => route,
      setStickyRoute: () => {},
    });
    await router.resolve({});
    return router.delegateProvider;
  }

  test("applies a per-request override over the workspace temperature", async () => {
    const delegate = await resolvedDelegate({ slug: "ws", openAiTemp: 0.9 }, 0);
    expect(delegate.temperature).toBe(0);
  });

  test("falls back to the workspace temperature", async () => {
    const delegate = await resolvedDelegate({ slug: "ws", openAiTemp: 0.4 });
    expect(delegate.temperature).toBe(0.4);
  });

  test("leaves temperature unset when neither is set", async () => {
    const delegate = await resolvedDelegate({ slug: "ws", openAiTemp: null });
    expect(delegate.temperature).toBeUndefined();
  });
});
