process.env.STORAGE_DIR = __dirname;
process.env.NODE_ENV = "test";

jest.mock("../../utils/prisma", () => ({
  model_router_rules: {
    create: jest.fn(async ({ data }) => ({ id: 1, ...data })),
    update: jest.fn(async ({ where, data }) => ({ id: where.id, ...data })),
  },
}));

const prisma = require("../../utils/prisma");
const { ModelRouterRule } = require("../../models/modelRouterRule");
const { ModelRouterService } = require("../../utils/router");

describe("ModelRouterRule condition_logic validation", () => {
  const CONDITIONS = [
    { property: "promptContent", comparator: "contains", value: "sql" },
    { property: "conversationTokenCount", comparator: "gt", value: "4000" },
  ];

  const BASE_RULE = {
    title: "sql_or_long",
    type: "calculated",
    priority: 1,
    conditions: CONDITIONS,
    route_provider: "openai",
    route_model: "gpt-4o",
  };

  beforeEach(() => {
    prisma.model_router_rules.create.mockClear();
    prisma.model_router_rules.update.mockClear();
  });

  it("creates a calculated rule with OR condition_logic and hydrates conditions", async () => {
    const { rule, error } = await ModelRouterRule.create(1, {
      ...BASE_RULE,
      condition_logic: "OR",
    });

    expect(error).toBeNull();
    expect(prisma.model_router_rules.create).toHaveBeenCalledTimes(1);
    expect(prisma.model_router_rules.create.mock.calls[0][0].data).toEqual(
      expect.objectContaining({
        condition_logic: "OR",
        conditions: JSON.stringify(CONDITIONS),
      })
    );
    expect(rule.condition_logic).toBe("OR");
    expect(rule.conditions).toEqual(CONDITIONS);
  });

  it("creates a calculated rule with AND condition_logic", async () => {
    const { rule, error } = await ModelRouterRule.create(1, {
      ...BASE_RULE,
      condition_logic: "AND",
    });

    expect(error).toBeNull();
    expect(prisma.model_router_rules.create).toHaveBeenCalledTimes(1);
    expect(rule.condition_logic).toBe("AND");
  });

  it("updates a calculated rule to OR condition_logic", async () => {
    const { rule, error } = await ModelRouterRule.update(42, {
      type: "calculated",
      condition_logic: "OR",
      conditions: CONDITIONS,
    });

    expect(error).toBeNull();
    expect(prisma.model_router_rules.update).toHaveBeenCalledTimes(1);
    expect(prisma.model_router_rules.update).toHaveBeenCalledWith({
      where: { id: 42 },
      data: expect.objectContaining({
        condition_logic: "OR",
        conditions: JSON.stringify(CONDITIONS),
      }),
    });
    expect(rule.condition_logic).toBe("OR");
    expect(rule.conditions).toEqual(CONDITIONS);
  });

  it.each(["XOR", "", null, undefined])(
    "rejects invalid condition_logic %p on create and update",
    async (invalidLogic) => {
      const createRes = await ModelRouterRule.create(1, {
        ...BASE_RULE,
        condition_logic: invalidLogic,
      });
      expect(createRes.rule).toBeNull();
      expect(createRes.error).toBe("Condition logic must be one of: AND, OR");
      expect(prisma.model_router_rules.create).not.toHaveBeenCalled();

      const updateRes = await ModelRouterRule.update(42, {
        type: "calculated",
        condition_logic: invalidLogic,
        conditions: CONDITIONS,
      });
      expect(updateRes.rule).toBeNull();
      expect(updateRes.error).toBe("Condition logic must be one of: AND, OR");
      expect(prisma.model_router_rules.update).not.toHaveBeenCalled();
    }
  );

  it("clears condition_logic and conditions when updating a rule to llm type", async () => {
    const { rule, error } = await ModelRouterRule.update(42, {
      type: "llm",
      condition_logic: "OR",
      conditions: CONDITIONS,
      description: "Match SQL requests",
    });

    expect(error).toBeNull();
    expect(prisma.model_router_rules.update).toHaveBeenCalledWith({
      where: { id: 42 },
      data: expect.objectContaining({
        type: "llm",
        condition_logic: null,
        conditions: null,
      }),
    });
    expect(rule.condition_logic).toBeNull();
    expect(rule.conditions).toBeNull();
  });

  it("evaluates a created OR rule when any single condition matches", async () => {
    const { rule, error } = await ModelRouterRule.create(1, {
      ...BASE_RULE,
      condition_logic: "OR",
    });
    expect(error).toBeNull();

    const routerService = ModelRouterService.getInstance();
    const matched = routerService.evaluateCalculatedRules([rule], {
      prompt: "write a sql query",
      conversationTokenCount: 100,
      conversationMessageCount: 1,
      attachments: [],
    });
    expect(matched).toEqual({
      provider: "openai",
      model: "gpt-4o",
      ruleTitle: "sql_or_long",
      ruleType: "calculated",
      isFallback: false,
    });

    const missed = routerService.evaluateCalculatedRules([rule], {
      prompt: "hello world",
      conversationTokenCount: 100,
      conversationMessageCount: 1,
      attachments: [],
    });
    expect(missed).toBeNull();
  });
});
