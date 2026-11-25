process.env.STORAGE_DIR = __dirname;
process.env.NODE_ENV = "test";

jest.mock("../../utils/prisma", () => ({
  $transaction: jest.fn(async (ops) => Promise.all(ops)),
  model_routers: {
    create: jest.fn(async ({ data }) => ({ id: 1, ...data })),
    delete: jest.fn(async ({ where }) => ({ id: where.id })),
  },
  workspaces: {
    updateMany: jest.fn(async () => ({ count: 1 })),
  },
}));

const prisma = require("../../utils/prisma");
const { ModelRouter } = require("../../models/modelRouter");
const { ModelRouterService } = require("../../utils/router");

/**
 * `cooldown_seconds` is stored in seconds (see schema.prisma) and only converted
 * to milliseconds at the point of use in AnythingLLMModelRouter. The create
 * fallback previously wrote `DEFAULT_STICKY_MS` straight into the column, which
 * persisted a ~83 hour cooldown well past the validator's own 3600s ceiling.
 */
describe("ModelRouter.create cooldown_seconds", () => {
  const VALID_ROUTER = {
    name: "Test Router",
    fallback_provider: "openai",
    fallback_model: "gpt-4.1",
  };

  beforeEach(() => prisma.model_routers.create.mockClear());

  const createdWith = () => prisma.model_routers.create.mock.calls[0][0].data;

  it("defaults to seconds, not the millisecond constant, when omitted", async () => {
    await ModelRouter.create({ ...VALID_ROUTER });

    expect(createdWith().cooldown_seconds).toBe(
      ModelRouterService.DEFAULT_STICKY_MS / 1000
    );
    expect(createdWith().cooldown_seconds).toBe(300);
  });

  it("keeps the default within the validator's 0-3600 bounds", async () => {
    await ModelRouter.create({ ...VALID_ROUTER });

    const { cooldown_seconds } = createdWith();
    expect(
      ModelRouter.validations.cooldown_seconds(cooldown_seconds)
    ).not.toBeNull();
  });

  it("honors an explicit cooldown", async () => {
    await ModelRouter.create({ ...VALID_ROUTER, cooldown_seconds: 60 });
    expect(createdWith().cooldown_seconds).toBe(60);
  });

  it("allows an explicit zero rather than treating it as unset", async () => {
    await ModelRouter.create({ ...VALID_ROUTER, cooldown_seconds: 0 });
    expect(createdWith().cooldown_seconds).toBe(0);
  });

  it("falls back to 30s when an explicit cooldown fails validation", async () => {
    await ModelRouter.create({ ...VALID_ROUTER, cooldown_seconds: 999999 });
    expect(createdWith().cooldown_seconds).toBe(30);
  });
});

/**
 * Deleting a router also resets every workspace pointing at it back to the
 * system LLM, in the same transaction, so no workspace keeps a router_id
 * that no longer exists. Rollback on failure is Prisma's guarantee and is
 * not something these mocks can observe.
 */
describe("ModelRouter.delete", () => {
  const ROUTER_ID = 5;

  beforeEach(() => {
    prisma.$transaction.mockClear();
    prisma.model_routers.delete.mockClear();
    prisma.workspaces.updateMany.mockClear();
  });

  it("resets referencing workspaces to the system LLM and deletes the router in one transaction", async () => {
    const success = await ModelRouter.delete(ROUTER_ID);

    expect(success).toBe(true);
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(prisma.$transaction.mock.calls[0][0]).toHaveLength(2);
    expect(prisma.workspaces.updateMany).toHaveBeenCalledWith({
      where: { router_id: ROUTER_ID },
      data: { chatProvider: null, chatModel: null, router_id: null },
    });
    expect(prisma.model_routers.delete).toHaveBeenCalledWith({
      where: { id: ROUTER_ID },
    });
  });

  it("returns false when the transaction fails", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    prisma.model_routers.delete.mockRejectedValueOnce(
      new Error("Record to delete does not exist.")
    );

    const success = await ModelRouter.delete(ROUTER_ID);

    expect(success).toBe(false);
    consoleErrorSpy.mockRestore();
  });
});
