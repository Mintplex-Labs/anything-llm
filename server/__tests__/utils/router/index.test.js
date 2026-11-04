jest.mock("../../../models/modelRouter", () => ({ ModelRouter: {} }));
jest.mock("../../../utils/agents/aibitat/plugins/router-classifier", () => ({
  classifyWithLLM: jest.fn(),
}));

const { ModelRouterService } = require("../../../utils/router");

beforeAll(() => jest.spyOn(console, "log").mockImplementation(() => {}));
afterAll(() => jest.restoreAllMocks());

function hourRule(comparator, value) {
  return {
    title: "hour_rule",
    enabled: true,
    type: "calculated",
    condition_logic: "AND",
    conditions: [{ property: "currentHour", comparator, value }],
    route_provider: "ollama",
    route_model: "llama3.2",
  };
}

/**
 * Evaluates a single currentHour rule with the clock set to the given local hour.
 * @returns {boolean} true if the rule matched
 */
function matchesAtHour(hour, comparator, value) {
  jest.setSystemTime(new Date(2026, 0, 15, hour, 30));
  const route = ModelRouterService.getInstance().evaluateCalculatedRules(
    [hourRule(comparator, value)],
    { prompt: "hello" }
  );
  return route !== null;
}

describe("ModelRouterService - currentHour between", () => {
  beforeAll(() => jest.useFakeTimers());
  afterAll(() => jest.useRealTimers());

  it("matches hours inside a daytime range", () => {
    expect(matchesAtHour(9, "between", "9,17")).toBe(true);
    expect(matchesAtHour(13, "between", "9,17")).toBe(true);
    expect(matchesAtHour(17, "between", "9,17")).toBe(true);
    expect(matchesAtHour(8, "between", "9,17")).toBe(false);
    expect(matchesAtHour(18, "between", "9,17")).toBe(false);
  });

  it("matches hours of an overnight range that spans midnight", () => {
    expect(matchesAtHour(22, "between", "22,6")).toBe(true);
    expect(matchesAtHour(23, "between", "22,6")).toBe(true);
    expect(matchesAtHour(0, "between", "22,6")).toBe(true);
    expect(matchesAtHour(6, "between", "22,6")).toBe(true);
  });

  it("does not match hours outside an overnight range", () => {
    expect(matchesAtHour(7, "between", "22,6")).toBe(false);
    expect(matchesAtHour(12, "between", "22,6")).toBe(false);
    expect(matchesAtHour(21, "between", "22,6")).toBe(false);
  });
});

describe("ModelRouterService - numeric between", () => {
  it("does not wrap a reversed range for non-clock properties", () => {
    const route = ModelRouterService.getInstance().evaluateCalculatedRules(
      [
        {
          ...hourRule(),
          conditions: [
            {
              property: "conversationMessageCount",
              comparator: "between",
              value: "50,10",
            },
          ],
        },
      ],
      { prompt: "hello", conversationMessageCount: 60 }
    );
    expect(route).toBeNull();
  });
});
