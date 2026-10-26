process.env.STORAGE_DIR = __dirname;
process.env.NODE_ENV = "test";

jest.mock("../../utils/prisma", () => ({
  model_routers: { create: jest.fn(async ({ data }) => ({ id: 1, ...data })) },
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
