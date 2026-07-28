process.env.STORAGE_DIR = __dirname;
process.env.NODE_ENV = "test";

const AIbitat = require("../../../../utils/agents/aibitat/index.js");
const {
  AnythingLLMModelRouter,
} = require("../../../../utils/AiProviders/modelRouter/index.js");

/**
 * The model-router cooldown timer restarts from when inference stops, not from
 * when the routing rule matched. `onInferenceComplete()` re-stamps the sticky
 * route to reset that timer, and skips fallback routes (which never become
 * sticky).
 *
 * For agents the re-stamp is wired to the aibitat `interrupt` event (fires
 * after each turn, when the agent waits on the next socket prompt) and the
 * `terminate` event (loop exit), so it fires on every turn — not only the
 * first.
 */

const NON_FALLBACK_ROUTE = {
  provider: "openai",
  model: "gpt-4.1",
  ruleTitle: "reasoning tasks",
  ruleType: "calculated",
  isFallback: false,
};

describe("AnythingLLMModelRouter.onInferenceComplete", () => {
  function makeRouter() {
    const router = new AnythingLLMModelRouter({ slug: "test-ws", name: "Test" });
    router._routeKey = "user:1|test-ws|thread:1";
    router.resolvedRoute = { ...NON_FALLBACK_ROUTE };
    return router;
  }

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

describe("AIbitat re-stamp wiring – interrupt/terminate", () => {
  // Mirror exactly what createAibitat wires up when a model router is active.
  function wire(aibitat, modelRouter) {
    aibitat.onInterrupt(() => modelRouter?.onInferenceComplete());
    aibitat.onTerminate(() => modelRouter?.onInferenceComplete());
  }

  function makeAibitat() {
    return new AIbitat({ provider: "openai", handlerProps: { log: () => {} } });
  }

  it("fires on every interrupt (each turn) plus terminate, not just the first", () => {
    const modelRouter = { onInferenceComplete: jest.fn() };
    const aibitat = makeAibitat();
    wire(aibitat, modelRouter);

    aibitat.interrupt({ from: "AGENT", to: "USER" }); // turn 1 done
    aibitat.interrupt({ from: "AGENT", to: "USER" }); // follow-up turn 2
    aibitat.interrupt({ from: "AGENT", to: "USER" }); // follow-up turn 3
    aibitat.terminate("AGENT"); // loop exits

    expect(modelRouter.onInferenceComplete).toHaveBeenCalledTimes(4);
  });

  it("coexists with the websocket plugin's own interrupt listener", () => {
    const modelRouter = { onInferenceComplete: jest.fn() };
    const aibitat = makeAibitat();
    wire(aibitat, modelRouter);

    // The websocket plugin attaches its own onInterrupt (askForFeedback).
    const pluginListener = jest.fn();
    aibitat.onInterrupt(pluginListener);

    aibitat.interrupt({ from: "AGENT", to: "USER" });

    expect(modelRouter.onInferenceComplete).toHaveBeenCalledTimes(1);
    expect(pluginListener).toHaveBeenCalledTimes(1);
  });

  it("is a safe no-op when the router is absent (optional chaining)", () => {
    const aibitat = makeAibitat();
    wire(aibitat, undefined);

    expect(() => {
      aibitat.interrupt({ from: "AGENT", to: "USER" });
      aibitat.terminate("AGENT");
    }).not.toThrow();
  });
});
