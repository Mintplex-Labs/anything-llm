// agents/index.js resolves storage paths from STORAGE_DIR at require time.
process.env.STORAGE_DIR = __dirname;

// agents/index.js loads the MCP SDK, whose dynamic import() crashes the Jest worker on Node 18.
jest.mock("../../../../utils/MCP", () =>
  jest.fn().mockImplementation(() => ({
    activeMCPServers: jest.fn().mockResolvedValue([]),
  }))
);

const { GeminiLLM } = require("../../../../utils/AiProviders/gemini");
const {
  defaultGeminiModels,
} = require("../../../../utils/AiProviders/gemini/defaultModels");
const GeminiProvider = require("../../../../utils/agents/aibitat/providers/gemini.js");
const { AgentHandler } = require("../../../../utils/agents");

const ORIGINAL_ENV = process.env;
const stableModelIds = defaultGeminiModels()
  .filter((model) => !model.experimental)
  .map((model) => model.id);

beforeEach(() => {
  process.env = { ...ORIGINAL_ENV, GEMINI_API_KEY: "test-key" };
  delete process.env.GEMINI_LLM_MODEL_PREF;
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
});

describe("Gemini fallback model", () => {
  it("chat falls back to a model in the stable list", () => {
    expect(stableModelIds).toContain(new GeminiLLM().model);
  });

  it("the agent provider falls back to a model in the stable list", () => {
    expect(stableModelIds).toContain(new GeminiProvider().model);
  });

  it("the agent handler's provider default is a model in the stable list", () => {
    const handler = new AgentHandler({ uuid: "test" });
    expect(stableModelIds).toContain(handler.providerDefault("gemini"));
  });

  it("an explicit model preference still wins", () => {
    process.env.GEMINI_LLM_MODEL_PREF = "gemini-2.5-pro";
    expect(new GeminiLLM().model).toBe("gemini-2.5-pro");
    const handler = new AgentHandler({ uuid: "test" });
    expect(handler.providerDefault("gemini")).toBe("gemini-2.5-pro");
  });
});
