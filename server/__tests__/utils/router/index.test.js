/* eslint-env jest */

describe("ModelRouterService sticky TTL after inference", () => {
  let ModelRouterService;
  let svc;

  beforeEach(() => {
    jest.resetModules();
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
    ({ ModelRouterService } = require("../../../utils/router"));
    // Reset singleton between tests
    ModelRouterService.instance = null;
    svc = ModelRouterService.getInstance();
    // Silence logs
    svc.log = jest.fn();
    svc.logIndent = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
    ModelRouterService.instance = null;
  });

  test("sticky route expires after cooldown without touch", () => {
    const key = "1:ws:thread";
    const route = {
      provider: "openai",
      model: "gpt-4o",
      ruleTitle: "r1",
      ruleType: "calculated",
      isFallback: false,
    };
    svc.setStickyRoute(key, route);

    jest.advanceTimersByTime(301_000);
    expect(svc.getStickyRoute(key, 300_000)).toBeNull();
  });

  test("touchStickyRoute renews TTL so long inference does not expire route", () => {
    const key = "1:ws:thread";
    const route = {
      provider: "openai",
      model: "gpt-4o",
      ruleTitle: "r1",
      ruleType: "calculated",
      isFallback: false,
    };
    svc.setStickyRoute(key, route);

    // Simulate a 4-minute inference, then touch on completion
    jest.advanceTimersByTime(240_000);
    expect(svc.touchStickyRoute(key)).toBe(true);

    // Another 4 minutes later — still within renewed 300s window
    jest.advanceTimersByTime(240_000);
    const sticky = svc.getStickyRoute(key, 300_000);
    expect(sticky).toEqual(route);
  });

  test("markInferenceComplete refreshes sticky and LLM match cache by routeKey", () => {
    const key = "0:demo:default";
    const route = {
      provider: "anthropic",
      model: "claude",
      ruleTitle: "code",
      ruleType: "llm",
      isFallback: false,
    };
    svc.setStickyRoute(key, route);
    svc.setCachedLLMResult(key, {
      title: "code",
      route_provider: "anthropic",
      route_model: "claude",
      type: "llm",
    });

    jest.advanceTimersByTime(250_000);
    ModelRouterService.markInferenceComplete({ routeKey: key });

    jest.advanceTimersByTime(250_000);
    expect(svc.getStickyRoute(key, 300_000)).toEqual(route);
    expect(svc.getCachedLLMResult(key, 300_000)?.title).toBe("code");
  });

  test("touchCachedLLMResult does not refresh null/no-match entries", () => {
    const key = "0:demo:default";
    svc.setCachedLLMResult(key, null);
    expect(svc.touchCachedLLMResult(key)).toBe(false);
  });
});
