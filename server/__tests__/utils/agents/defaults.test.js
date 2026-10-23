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

const {
  WORKSPACE_AGENT,
  agentSkillsFromSystemSettings,
} = require("../../../utils/agents/defaults");
const filesystemLib = require("../../../utils/agents/aibitat/plugins/filesystem/lib");

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

describe("agentSkillsFromSystemSettings", () => {
  function mockSystemSettings(settings = {}, { multiUser = false } = {}) {
    SystemSettings.getValueOrFallback = jest
      .fn()
      .mockImplementation(async ({ label }) =>
        JSON.stringify(settings[label] ?? [])
      );
    SystemSettings.isMultiUserMode = jest.fn().mockResolvedValue(multiUser);
  }

  const workspaceSkills = (enabled) => ({ enabled, mcpSuppressedTools: {} });
  const loads = (functions, skill) =>
    functions.some((name) => name === skill || name.startsWith(`${skill}#`));

  beforeEach(() => {
    jest.spyOn(filesystemLib, "isToolAvailable").mockReturnValue(true);
  });
  afterEach(() => jest.restoreAllMocks());

  it("follows the system settings when the workspace has no copy", async () => {
    mockSystemSettings({
      disabled_agent_skills: ["rag-memory"],
      default_agent_skills: ["create-chart"],
    });
    const functions = await agentSkillsFromSystemSettings(null);
    expect(loads(functions, "rag-memory")).toBe(false);
    expect(loads(functions, "web-browsing")).toBe(true);
    expect(loads(functions, "create-chart")).toBe(true);
  });

  it("loads any enabled system skill without a hardcoded list", async () => {
    mockSystemSettings({ default_agent_skills: ["sql-agent"] });
    const functions = await agentSkillsFromSystemSettings(null);
    expect(loads(functions, "sql-agent")).toBe(true);
  });

  it("disables a default skill the system has on", async () => {
    mockSystemSettings();
    const functions = await agentSkillsFromSystemSettings(
      workspaceSkills(["web-browsing"])
    );
    expect(functions).toEqual(["web-browsing"]);
  });

  it("enables an optional skill the system has off", async () => {
    mockSystemSettings();
    const functions = await agentSkillsFromSystemSettings(
      workspaceSkills(["create-chart"])
    );
    expect(functions).toEqual(["create-chart"]);
  });

  it("applies the workspace sub-skills in both directions", async () => {
    mockSystemSettings({
      default_agent_skills: ["filesystem-agent"],
      disabled_filesystem_skills: ["filesystem-write-text-file"],
    });
    const functions = await agentSkillsFromSystemSettings(
      workspaceSkills(["filesystem-agent", "filesystem-write-text-file"])
    );
    expect(functions).toEqual(["filesystem-agent#filesystem-write-text-file"]);
  });

  it("drops the sub-skills of an unavailable parent", async () => {
    filesystemLib.isToolAvailable.mockReturnValue(false);
    mockSystemSettings();
    const functions = await agentSkillsFromSystemSettings(
      workspaceSkills(["filesystem-agent", "filesystem-read-text-file"])
    );
    expect(functions).toEqual([]);
  });

  it("still blocks single-user-only skills in multi-user mode", async () => {
    mockSystemSettings({}, { multiUser: false });
    const skills = workspaceSkills(["create-scheduled-job"]);
    expect(
      loads(await agentSkillsFromSystemSettings(skills), "create-scheduled-job")
    ).toBe(true);

    mockSystemSettings({}, { multiUser: true });
    expect(
      loads(await agentSkillsFromSystemSettings(skills), "create-scheduled-job")
    ).toBe(false);
  });

  it("ignores unknown keys", async () => {
    mockSystemSettings();
    const functions = await agentSkillsFromSystemSettings(
      workspaceSkills(["not-a-skill", "constructor", "@@flow_abc"])
    );
    expect(functions).toEqual([]);
  });
});
