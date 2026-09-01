// Set required env vars before requiring modules
process.env.STORAGE_DIR = __dirname;
process.env.NODE_ENV = "test";

const { SystemPromptVariables } = require("../../../models/systemPromptVariables");
const { SystemSettings } = require("../../../models/systemSettings");
const Provider = require("../../../utils/agents/aibitat/providers/ai-provider");

jest.mock("../../../models/systemPromptVariables");
jest.mock("../../../models/systemSettings");
jest.mock("../../../utils/agents/imported", () => ({
  activeImportedPlugins: jest.fn().mockReturnValue([]),
  validateImportedPluginHandler: jest.fn().mockReturnValue(false),
}));
jest.mock("../../../utils/agentFlows", () => ({
  AgentFlows: {
    activeFlowPlugins: jest.fn().mockReturnValue([]),
  },
}));
jest.mock("../../../utils/MCP", () => {
  return jest.fn().mockImplementation(() => ({
    activeMCPServers: jest.fn().mockResolvedValue([]),
  }));
});

const AgentPlugins = require("../../../utils/agents/aibitat/plugins");
const {
  WORKSPACE_AGENT,
  workspaceEnabledMCPTools,
  disabledWorkspaceSkillNames,
} = require("../../../utils/agents/defaults");

describe("WORKSPACE_AGENT.getDefinition", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    SystemPromptVariables.expandSystemPromptVariables.mockReset();
    SystemPromptVariables.expandSystemPromptVariables.mockImplementation(
      async (prompt) => prompt.replace("{datetime}", "January 1, 2024 12:00 PM")
    );
    // Mock SystemSettings to return empty arrays for agent skills
    SystemSettings.getValueOrFallback = jest.fn().mockResolvedValue("[]");
  });

  it("should use saneDefaultSystemPrompt when workspace has no openAiPrompt", async () => {
    const workspace = {
      id: 1,
      name: "Test Workspace",
      openAiPrompt: null,
    };
    const user = { id: 1 };
    const provider = "openai";
    const expectedPrompt = await Provider.systemPrompt({ workspace, user });
    const definition = await WORKSPACE_AGENT.getDefinition(
      provider,
      workspace,
      user
    );
    expect(definition.role).toBe(expectedPrompt);
    expect(SystemPromptVariables.expandSystemPromptVariables).toHaveBeenCalledWith(
      SystemSettings.saneDefaultSystemPrompt,
      user.id,
      workspace.id
    );
  });

  it("should use workspace system prompt with variable expansion when openAiPrompt exists", async () => {
    const workspace = {
      id: 1,
      name: "Test Workspace",
      openAiPrompt: "You are a helpful assistant for {workspace.name}. The current user is {user.name}.",
    };
    const user = { id: 1 };
    const provider = "openai";

    const expandedPrompt = "You are a helpful assistant for Test Workspace. The current user is John Doe.";
    SystemPromptVariables.expandSystemPromptVariables.mockResolvedValue(expandedPrompt);

    const definition = await WORKSPACE_AGENT.getDefinition(
      provider,
      workspace,
      user
    );

    expect(SystemPromptVariables.expandSystemPromptVariables).toHaveBeenCalledWith(
      workspace.openAiPrompt,
      user.id,
      workspace.id
    );
    expect(definition.role).toBe(expandedPrompt);
  });

  it("should handle workspace system prompt without user context", async () => {
    const workspace = {
      id: 1,
      name: "Test Workspace",
      openAiPrompt: "You are a helpful assistant. Today is {date}.",
    };
    const user = null;
    const provider = "lmstudio";
    const expandedPrompt = "You are a helpful assistant. Today is January 1, 2024.";
    SystemPromptVariables.expandSystemPromptVariables.mockResolvedValue(expandedPrompt);

    const definition = await WORKSPACE_AGENT.getDefinition(
      provider,
      workspace,
      user
    );

    expect(SystemPromptVariables.expandSystemPromptVariables).toHaveBeenCalledWith(
      workspace.openAiPrompt,
      null,
      workspace.id
    );
    expect(definition.role).toBe(expandedPrompt);
  });

  it("should return functions array in definition", async () => {
    const workspace = { id: 1, openAiPrompt: null };
    const provider = "openai";

    const definition = await WORKSPACE_AGENT.getDefinition(
      provider,
      workspace,
      null
    );

    expect(definition).toHaveProperty("functions");
    expect(Array.isArray(definition.functions)).toBe(true);
  });

  it("should use saneDefaultSystemPrompt for all providers when workspace has no openAiPrompt", async () => {
    const workspace = { id: 1, openAiPrompt: null };
    const user = null;
    const provider = "lmstudio";
    const definition = await WORKSPACE_AGENT.getDefinition(
      provider,
      workspace,
      null
    );

    expect(definition.role).toBe(await Provider.systemPrompt({ workspace, user }));
    expect(SystemPromptVariables.expandSystemPromptVariables).toHaveBeenCalledWith(
      SystemSettings.saneDefaultSystemPrompt,
      null,
      workspace.id
    );
  });
});

describe("workspace agent skill overrides", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    SystemPromptVariables.expandSystemPromptVariables.mockImplementation(
      async (prompt) => prompt
    );
    SystemSettings.getValueOrFallback = jest.fn().mockResolvedValue("[]");
  });

  async function functionsFor(agentConfig) {
    const { functions } = await WORKSPACE_AGENT.getDefinition(
      "openai",
      { id: 1, name: "Test Workspace", agentConfig },
      { id: 1 }
    );
    return functions;
  }

  it("inherits the instance defaults when the workspace has no overrides", async () => {
    expect(await functionsFor(null)).toContain(AgentPlugins.memory.name);
  });

  it("drops a default skill the workspace turned off", async () => {
    const functions = await functionsFor(
      JSON.stringify({ [AgentPlugins.memory.name]: false })
    );
    expect(functions).not.toContain(AgentPlugins.memory.name);
  });

  it("adds a configurable skill the workspace turned on", async () => {
    const functions = await functionsFor(
      JSON.stringify({ [AgentPlugins.webBrowsing.name]: true })
    );
    expect(functions).toContain(AgentPlugins.webBrowsing.name);
  });

  it("resolves disabled overrides into the function names to remove", () => {
    const names = disabledWorkspaceSkillNames({
      agentConfig: JSON.stringify({
        [AgentPlugins.memory.name]: false,
        "github-create_issue": false,
        "web-browsing": true,
      }),
    });
    expect(names).toEqual([AgentPlugins.memory.name, "github-create_issue"]);
  });

  it("extracts enabled MCP tool names for a given server", () => {
    const workspace = {
      agentConfig: JSON.stringify({
        "github-create_issue": true,
        "github-list_repos": false,
        "docker-list_containers": true,
      }),
    };
    expect(workspaceEnabledMCPTools(workspace, "github")).toEqual([
      "create_issue",
    ]);
  });
});
