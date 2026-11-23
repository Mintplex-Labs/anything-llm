/* eslint-env jest */
const fs = require("fs");
const os = require("os");
const path = require("path");

const tmpStorageDir = fs.mkdtempSync(
  path.join(os.tmpdir(), "anythingllm-ephemeral-test-")
);
process.env.STORAGE_DIR = tmpStorageDir;
process.env.NODE_ENV = "test";
process.env.LLM_PROVIDER = "openai";
process.env.OPEN_AI_KEY = "sk-test";
process.env.OPEN_MODEL_PREF = "gpt-4o-mini";

jest.mock("../../../models/workspaceChats", () => ({
  WorkspaceChats: {
    whereWithEmbeds: jest.fn().mockResolvedValue([]),
  },
}));
jest.mock("../../../models/systemSettings", () => ({
  SystemSettings: {
    getValueOrFallback: jest.fn().mockResolvedValue("[]"),
    isMultiUserMode: jest.fn().mockResolvedValue(false),
    memoriesEnabled: jest.fn().mockResolvedValue(false),
    saneDefaultSystemPrompt: "You are a helpful assistant.",
  },
}));
jest.mock("../../../utils/helpers/modelPricing", () => ({
  ModelPricing: jest.fn().mockImplementation(() => ({
    bootRefresh: Promise.resolve(),
    getCostBreakdown: jest.fn().mockReturnValue(null),
    getReasoningOptions: jest.fn().mockReturnValue([]),
  })),
  addChatCostToMetrics: jest.fn((metrics) => metrics),
}));
jest.mock("../../../models/systemPromptVariables", () => ({
  SystemPromptVariables: {
    expandSystemPromptVariables: jest.fn(async (prompt) => prompt),
  },
}));
jest.mock("../../../models/user", () => ({
  User: {
    get: jest.fn().mockResolvedValue(null),
  },
}));
jest.mock("../../../utils/agents/imported", () => ({
  activeImportedPlugins: jest.fn().mockReturnValue([]),
  validateImportedPluginHandler: jest.fn().mockReturnValue(false),
}));
jest.mock("../../../utils/agentFlows", () => ({
  AgentFlows: {
    activeFlowPlugins: jest.fn().mockReturnValue([]),
    loadFlowPlugin: jest.fn().mockReturnValue(null),
  },
}));
jest.mock("../../../utils/MCP", () => {
  return jest.fn().mockImplementation(() => ({
    activeMCPServers: jest.fn().mockResolvedValue([]),
    convertServerToolsToPlugins: jest.fn().mockResolvedValue(null),
  }));
});

const { EphemeralAgentHandler } = require("../../../utils/agents/ephemeral");

afterAll(() => {
  fs.rmSync(tmpStorageDir, { recursive: true, force: true });
});

describe("EphemeralAgentHandler.createAIbitat toolOverrides", () => {
  function createHandler() {
    const agentHandler = new EphemeralAgentHandler({
      uuid: "test-uuid",
      prompt: "Run scheduled SQL query",
    });
    agentHandler.provider = "openai";
    agentHandler.model = "gpt-4o-mini";
    return agentHandler;
  }

  const noopSocketHandler = { send: jest.fn(), close: jest.fn() };

  it("expands multi-stage plugins like sql-agent into their child tools", async () => {
    const agentHandler = createHandler();
    const overrides = ["sql-agent"];

    await agentHandler.createAIbitat({
      handler: noopSocketHandler,
      toolOverrides: overrides,
    });

    const expectedChildIds = [
      "sql-agent#sql-list-databases",
      "sql-agent#sql-list-tables",
      "sql-agent#sql-get-table-schema",
      "sql-agent#sql-query",
    ];
    const expectedFunctionNames = [
      "sql-list-databases",
      "sql-list-tables",
      "sql-get-table-schema",
      "sql-query",
    ];

    expect(agentHandler.aibitat.agents.get("@agent").functions).toEqual(
      expectedChildIds
    );
    expect([...agentHandler.aibitat.functions.keys()]).toEqual(
      expectedFunctionNames
    );
    expect(overrides).toEqual(["sql-agent"]);
  });

  it("deduplicates mixed single-stage, parent, and child tool overrides", async () => {
    const agentHandler = createHandler();

    await agentHandler.createAIbitat({
      handler: noopSocketHandler,
      toolOverrides: ["web-scraping", "sql-agent", "sql-agent#sql-query"],
    });

    expect(agentHandler.aibitat.agents.get("@agent").functions).toEqual([
      "web-scraping",
      "sql-agent#sql-list-databases",
      "sql-agent#sql-list-tables",
      "sql-agent#sql-get-table-schema",
      "sql-agent#sql-query",
    ]);
    expect([...agentHandler.aibitat.functions.keys()]).toEqual([
      "web-scraping",
      "sql-list-databases",
      "sql-list-tables",
      "sql-get-table-schema",
      "sql-query",
    ]);
  });

  it("loads no tools when toolOverrides is empty", async () => {
    const agentHandler = createHandler();

    await agentHandler.createAIbitat({
      handler: noopSocketHandler,
      toolOverrides: [],
    });

    expect(agentHandler.aibitat.agents.get("@agent").functions).toEqual([]);
    expect([...agentHandler.aibitat.functions.keys()]).toEqual([]);
  });

  it("ignores unknown tool names and Object.prototype keys without throwing", async () => {
    const agentHandler = createHandler();

    await agentHandler.createAIbitat({
      handler: noopSocketHandler,
      toolOverrides: ["non-existent-tool", "toString", "sql-agent"],
    });

    expect([...agentHandler.aibitat.functions.keys()]).toEqual([
      "sql-list-databases",
      "sql-list-tables",
      "sql-get-table-schema",
      "sql-query",
    ]);
  });
});
