jest.mock("../../../utils/AiProviders/openRouter", () => ({
  fetchOpenRouterModels: jest.fn(),
}));

const {
  fetchOpenRouterModels,
} = require("../../../utils/AiProviders/openRouter");
const eagerLoadContextWindows = require("../../../utils/boot/eagerLoadContextWindows");

const ORIGINAL_ENV = process.env;

beforeEach(() => {
  process.env = { ...ORIGINAL_ENV };
  fetchOpenRouterModels.mockReset();
  jest.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
  jest.restoreAllMocks();
});

describe("eagerLoadContextWindows for OpenRouter", () => {
  it("starts the model list sync at boot when OpenRouter is the LLM", async () => {
    process.env.LLM_PROVIDER = "openrouter";
    fetchOpenRouterModels.mockResolvedValue({ "acme/chat-1": {} });

    await eagerLoadContextWindows();

    expect(fetchOpenRouterModels).toHaveBeenCalledTimes(1);
  });

  it("does not wait for the network before finishing boot", async () => {
    process.env.LLM_PROVIDER = "openrouter";
    fetchOpenRouterModels.mockReturnValue(new Promise(() => {}));

    await expect(eagerLoadContextWindows()).resolves.toBeUndefined();
  });

  it("does nothing for other providers", async () => {
    process.env.LLM_PROVIDER = "anthropic";

    await eagerLoadContextWindows();

    expect(fetchOpenRouterModels).not.toHaveBeenCalled();
  });
});
