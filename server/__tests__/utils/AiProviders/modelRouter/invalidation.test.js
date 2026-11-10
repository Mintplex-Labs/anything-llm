jest.mock("../../../../models/modelRouter", () => ({
  ModelRouter: { getWithRules: jest.fn() },
}));

jest.mock("../../../../utils/agents/aibitat/plugins/router-classifier", () => ({
  classifyWithLLM: jest.fn(),
}));

jest.mock("../../../../utils/helpers", () => ({
  getLLMProvider: jest.fn(() => ({
    getChatCompletion: async () => ({ textResponse: "reply" }),
  })),
}));

const { ModelRouter } = require("../../../../models/modelRouter");
const {
  classifyWithLLM,
} = require("../../../../utils/agents/aibitat/plugins/router-classifier");
const {
  AnythingLLMModelRouter,
} = require("../../../../utils/AiProviders/modelRouter");
const { ModelRouterService } = require("../../../../utils/router");
const { getLLMProvider } = require("../../../../utils/helpers");

const calculatedRule = {
  title: "keyword",
  type: "calculated",
  enabled: true,
  conditions: [
    { property: "promptContent", comparator: "contains", value: "match" },
  ],
  route_provider: "ollama",
  route_model: "original",
};

const semanticRule = {
  title: "semantic",
  type: "llm",
  enabled: true,
  route_provider: "ollama",
  route_model: "original",
};

function config(id, rules) {
  return {
    id,
    name: "Test router",
    rules,
    fallback_provider: "ollama",
    fallback_model: "fallback",
    cooldown_seconds: 300,
  };
}

async function resolve(prompt, routerId = 1, workspaceSlug = "test") {
  const router = new AnythingLLMModelRouter({
    slug: workspaceSlug,
    router_id: routerId,
  });
  await router.resolve({ prompt }, { thread: { slug: "test-thread" } });
  return router;
}

describe("model router decisions after a configuration edit", () => {
  let configs;

  beforeEach(() => {
    ModelRouterService.instance = null;
    jest
      .spyOn(ModelRouterService.prototype, "log")
      .mockImplementation(() => {});
    jest
      .spyOn(ModelRouterService.prototype, "logIndent")
      .mockImplementation(() => {});
    configs = new Map();
    ModelRouter.getWithRules
      .mockReset()
      .mockImplementation(async ({ id }) => configs.get(id));
    classifyWithLLM.mockReset();
  });

  afterEach(() => jest.restoreAllMocks());

  test("stops using a disabled rule without clearing another router's cooldown", async () => {
    configs.set(1, config(1, [calculatedRule]));
    configs.set(2, config(2, [calculatedRule]));
    expect((await resolve("match")).resolvedRoute.model).toBe("original");
    expect((await resolve("match", 2, "other")).resolvedRoute.model).toBe(
      "original"
    );
    expect((await resolve("follow-up")).resolvedRoute.model).toBe("original");

    configs.set(1, config(1, [{ ...calculatedRule, enabled: false }]));
    ModelRouterService.invalidateRouter(1);

    const updated = await resolve("match");
    expect(updated.resolvedRoute.model).toBe("fallback");
    expect(updated.routingMetadata.routedTo.isFallback).toBe(true);
    expect((await resolve("follow-up", 2, "other")).resolvedRoute.model).toBe(
      "original"
    );
  });

  test("ignores the cached classification after a rule's model is edited", async () => {
    configs.set(1, config(1, [semanticRule]));
    classifyWithLLM.mockImplementation(async ([rule]) => rule);
    expect((await resolve("initial")).resolvedRoute.model).toBe("original");
    expect((await resolve("follow-up")).resolvedRoute.model).toBe("original");
    expect(classifyWithLLM).toHaveBeenCalledTimes(1);

    configs.set(1, config(1, [{ ...semanticRule, route_model: "updated" }]));
    ModelRouterService.invalidateRouter(1);

    expect((await resolve("follow-up")).resolvedRoute.model).toBe("updated");
    expect(classifyWithLLM).toHaveBeenCalledTimes(2);
  });

  test("an older inference completion cannot restore a disabled rule", async () => {
    configs.set(1, config(1, [calculatedRule]));
    const pendingReply = Promise.withResolvers();
    getLLMProvider.mockReturnValueOnce({
      getChatCompletion: () => pendingReply.promise,
    });
    const original = await resolve("match");
    const completion = original.delegateProvider.getChatCompletion([]);

    configs.set(1, config(1, [{ ...calculatedRule, enabled: false }]));
    ModelRouterService.invalidateRouter(1);

    pendingReply.resolve({ textResponse: "reply" });
    await completion;
    expect((await resolve("follow-up")).resolvedRoute.model).toBe("fallback");
  });

  test("resetting chat clears cached decisions for its thread", async () => {
    configs.set(1, config(1, [semanticRule]));
    classifyWithLLM
      .mockResolvedValueOnce(semanticRule)
      .mockResolvedValueOnce(null);
    expect((await resolve("initial")).resolvedRoute.model).toBe("original");

    ModelRouterService.resetForWorkspace({ slug: "test", router_id: 1 }, null, {
      slug: "test-thread",
    });

    expect((await resolve("follow-up")).resolvedRoute.model).toBe("fallback");
    expect(classifyWithLLM).toHaveBeenCalledTimes(2);
  });

  test("an invalidated lookup cannot replace a newer router configuration", async () => {
    const pendingLookup = Promise.withResolvers();
    ModelRouter.getWithRules.mockReturnValueOnce(pendingLookup.promise);
    const first = resolve("match");

    configs.set(1, config(1, [{ ...calculatedRule, enabled: false }]));
    ModelRouterService.invalidateRouter(1);
    expect((await resolve("match")).resolvedRoute.model).toBe("fallback");

    pendingLookup.resolve(config(1, [calculatedRule]));
    expect((await first).resolvedRoute.model).toBe("fallback");
    expect((await resolve("match")).resolvedRoute.model).toBe("fallback");
  });
});
