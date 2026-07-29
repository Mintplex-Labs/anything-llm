process.env.STORAGE_DIR = __dirname;
process.env.NODE_ENV = "test";

const AIbitat = require("../../../../utils/agents/aibitat/index.js");
const {
  modelRouterCooldown,
} = require("../../../../utils/agents/aibitat/plugins/model-router-cooldown.js");
const {
  AnythingLLMModelRouter,
} = require("../../../../utils/AiProviders/modelRouter/index.js");

/**
 * The model-router cooldown timer restarts from when inference stops, not from
 * when the routing rule matched - otherwise a long reply can outlast its own
 * cooldown window and the next message reroutes.
 *
 * `onInferenceComplete()` re-stamps the sticky route to reset that timer, and
 * skips fallback routes (which never become sticky).
 *
 * Chat flows fire it via the instrumented delegate provider. Agent flows fire it
 * from the `model-router-cooldown` plugin, which listens for `interrupt` (end of
 * each turn) and `terminate` (loop exit) so every turn re-stamps, not just the
 * first.
 */

const NON_FALLBACK_ROUTE = {
  provider: "openai",
  model: "gpt-4.1",
  ruleTitle: "reasoning tasks",
  ruleType: "calculated",
  isFallback: false,
};

function makeRouter() {
  const router = new AnythingLLMModelRouter({ slug: "test-ws", name: "Test" });
  router._routeKey = "user:1|test-ws|thread:1";
  router.resolvedRoute = { ...NON_FALLBACK_ROUTE };
  return router;
}

describe("AnythingLLMModelRouter.onInferenceComplete", () => {
  it("re-stamps the sticky route for a real (non-fallback) route", () => {
    const router = makeRouter();
    const spy = jest
      .spyOn(router.routerService, "setStickyRoute")
      .mockImplementation(() => {});

    router.onInferenceComplete();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(router._routeKey, router.resolvedRoute);
    spy.mockRestore();
  });

  it("re-stamps on every call so the cooldown timer resets each turn", () => {
    const router = makeRouter();
    const spy = jest
      .spyOn(router.routerService, "setStickyRoute")
      .mockImplementation(() => {});

    router.onInferenceComplete();
    router.onInferenceComplete();
    router.onInferenceComplete();

    expect(spy).toHaveBeenCalledTimes(3);
    spy.mockRestore();
  });

  it("skips when there is no route key", () => {
    const router = makeRouter();
    router._routeKey = null;
    const spy = jest
      .spyOn(router.routerService, "setStickyRoute")
      .mockImplementation(() => {});

    router.onInferenceComplete();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it("skips when no route has been resolved", () => {
    const router = makeRouter();
    router.resolvedRoute = null;
    const spy = jest
      .spyOn(router.routerService, "setStickyRoute")
      .mockImplementation(() => {});

    router.onInferenceComplete();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it("does not make a fallback route sticky", () => {
    const router = makeRouter();
    router.resolvedRoute = { ...NON_FALLBACK_ROUTE, isFallback: true };
    const spy = jest
      .spyOn(router.routerService, "setStickyRoute")
      .mockImplementation(() => {});

    router.onInferenceComplete();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe("AnythingLLMModelRouter delegate instrumentation", () => {
  // `routerService` is a singleton, so the spy is shared across tests in this
  // block - reset it per test rather than counting another test's calls.
  afterEach(() => jest.restoreAllMocks());

  function instrument(provider) {
    const router = makeRouter();
    const spy = jest
      .spyOn(router.routerService, "setStickyRoute")
      .mockImplementation(() => {});
    spy.mockClear();
    return { connector: router._instrumentProvider(provider), spy };
  }

  it("re-stamps after a stream is fully drained, not before", async () => {
    let stampsDuringStream = null;
    const { connector, spy } = instrument({
      handleStream: async () => {
        stampsDuringStream = spy.mock.calls.length;
        return "complete text";
      },
      getChatCompletion: async () => ({ textResponse: "hello" }),
    });

    const result = await connector.handleStream({}, {}, {});

    expect(result).toBe("complete text");
    expect(stampsDuringStream).toBe(0);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("re-stamps after a sync completion resolves", async () => {
    const { connector, spy } = instrument({
      handleStream: async () => "text",
      getChatCompletion: async () => ({ textResponse: "hello" }),
    });

    const result = await connector.getChatCompletion([], {});

    expect(result).toEqual({ textResponse: "hello" });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("re-stamps even when inference throws", async () => {
    const { connector, spy } = instrument({
      handleStream: async () => {
        throw new Error("stream died");
      },
    });

    await expect(connector.handleStream({}, {}, {})).rejects.toThrow(
      "stream died"
    );
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("preserves `this` on the delegate", async () => {
    const provider = {
      model: "gpt-4.1",
      async getChatCompletion() {
        return { textResponse: this.model };
      },
    };
    const { connector } = instrument(provider);

    await expect(connector.getChatCompletion([], {})).resolves.toEqual({
      textResponse: "gpt-4.1",
    });
  });

  it("skips methods the provider does not implement", () => {
    const { connector } = instrument({ getChatCompletion: async () => null });
    expect(connector.handleStream).toBeUndefined();
  });
});

describe("model-router-cooldown plugin", () => {
  function makeAibitat() {
    return new AIbitat({ provider: "openai", handlerProps: { log: () => {} } });
  }

  it("fires on every interrupt (each turn) plus terminate, not just the first", () => {
    const onInferenceComplete = jest.fn();
    const aibitat = makeAibitat();
    aibitat.use(modelRouterCooldown.plugin(onInferenceComplete));

    aibitat.interrupt({ from: "AGENT", to: "USER" }); // turn 1 done
    aibitat.interrupt({ from: "AGENT", to: "USER" }); // follow-up turn 2
    aibitat.interrupt({ from: "AGENT", to: "USER" }); // follow-up turn 3
    aibitat.terminate("AGENT"); // loop exits

    expect(onInferenceComplete).toHaveBeenCalledTimes(4);
  });

  it("coexists with the websocket plugin's own interrupt listener", () => {
    const onInferenceComplete = jest.fn();
    const aibitat = makeAibitat();
    aibitat.use(modelRouterCooldown.plugin(onInferenceComplete));

    // The websocket plugin attaches its own onInterrupt (askForFeedback).
    const pluginListener = jest.fn();
    aibitat.onInterrupt(pluginListener);

    aibitat.interrupt({ from: "AGENT", to: "USER" });

    expect(onInferenceComplete).toHaveBeenCalledTimes(1);
    expect(pluginListener).toHaveBeenCalledTimes(1);
  });

  it("is a safe no-op when no callback is provided", () => {
    const aibitat = makeAibitat();
    aibitat.use(modelRouterCooldown.plugin());

    expect(() => {
      aibitat.interrupt({ from: "AGENT", to: "USER" });
      aibitat.terminate("AGENT");
    }).not.toThrow();
  });

  it("reads the current router on each turn, since routing re-resolves per turn", () => {
    // Mirrors the handler wiring: the callback closes over `handler._modelRouter`,
    // which is replaced whenever #resolveRouterProvider re-resolves.
    const handler = { _modelRouter: null };
    const aibitat = makeAibitat();
    aibitat.use(
      modelRouterCooldown.plugin(() =>
        handler._modelRouter?.onInferenceComplete()
      )
    );

    const firstRouter = { onInferenceComplete: jest.fn() };
    handler._modelRouter = firstRouter;
    aibitat.interrupt({ from: "AGENT", to: "USER" });

    const secondRouter = { onInferenceComplete: jest.fn() };
    handler._modelRouter = secondRouter;
    aibitat.interrupt({ from: "AGENT", to: "USER" });

    expect(firstRouter.onInferenceComplete).toHaveBeenCalledTimes(1);
    expect(secondRouter.onInferenceComplete).toHaveBeenCalledTimes(1);
  });
});
