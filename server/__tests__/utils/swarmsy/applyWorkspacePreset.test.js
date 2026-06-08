jest.mock("../../../models/workspace", () => ({
  Workspace: {
    defaultPrompt:
      "Given the following conversation, relevant context, and a follow up question, reply with an answer to the current question the user is asking. Return only your response to the question given the above information following the users instructions as needed.",
    new: jest.fn(),
    update: jest.fn(),
    get: jest.fn(),
  },
}));

jest.mock("../../../models/promptHistory", () => ({
  PromptHistory: {
    new: jest.fn(),
  },
}));

jest.mock("../../../models/workspacesSuggestedMessages", () => ({
  WorkspaceSuggestedMessages: {
    saveAll: jest.fn(),
  },
}));

const { Workspace } = require("../../../models/workspace");
const { PromptHistory } = require("../../../models/promptHistory");
const {
  WorkspaceSuggestedMessages,
} = require("../../../models/workspacesSuggestedMessages");
const {
  applySparkyPromptToWorkspace,
  createSwarmsyHiveWorkspace,
  getSparkyPromptStatus,
  loadSwarmsyHivePreset,
} = require("../../../utils/swarmsy/applyWorkspacePreset");

describe("SWARMSY HIVE workspace preset", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("confirms the preset contains the SPARKY system prompt", () => {
    const preset = loadSwarmsyHivePreset();

    expect(preset.workspaceName).toBe("SWARMSY HIVE");
    expect(preset.systemPrompt).toContain("You are SPARKY.");
    expect(preset.systemPrompt).toContain("You live in the SWARMSY HIVE.");
  });

  it("creates a new SWARMSY HIVE with the SPARKY prompt persisted on openAiPrompt", async () => {
    const created = { id: 77, slug: "swarmsy-hive", name: "SWARMSY HIVE" };
    const refreshed = {
      ...created,
      openAiPrompt: loadSwarmsyHivePreset().systemPrompt,
    };

    Workspace.new.mockResolvedValue({ workspace: created, message: null });
    Workspace.update.mockResolvedValue({ workspace: refreshed, message: null });
    Workspace.get.mockResolvedValue(refreshed);

    const result = await createSwarmsyHiveWorkspace(12);

    expect(Workspace.new).toHaveBeenCalledWith("SWARMSY HIVE", 12, {
      openAiPrompt: loadSwarmsyHivePreset().systemPrompt,
    });
    expect(Workspace.update).toHaveBeenCalledWith(created.id, {
      openAiPrompt: loadSwarmsyHivePreset().systemPrompt,
    });
    expect(WorkspaceSuggestedMessages.saveAll).toHaveBeenCalledWith(
      loadSwarmsyHivePreset().suggestedMessages,
      created.slug
    );
    expect(result.workspace.openAiPrompt).toBe(
      loadSwarmsyHivePreset().systemPrompt
    );
  });

  it("reports unavailable when the preset SPARKY system prompt is missing", () => {
    const preset = loadSwarmsyHivePreset();
    const originalSystemPrompt = preset.systemPrompt;
    preset.systemPrompt = "";

    try {
      const status = getSparkyPromptStatus({
        id: 1,
        name: "SWARMSY HIVE",
        slug: "swarmsy-hive",
        openAiPrompt: "",
      });

      expect(status).toMatchObject({
        available: false,
        applied: false,
        missing: true,
        status: "unavailable",
        label: "SPARKY prompt not applied",
      });
    } finally {
      preset.systemPrompt = originalSystemPrompt;
    }
  });

  it("reports applied only when an available SPARKY prompt matches the workspace prompt", () => {
    const status = getSparkyPromptStatus({
      id: 1,
      name: "SWARMSY HIVE",
      slug: "swarmsy-hive",
      openAiPrompt: loadSwarmsyHivePreset().systemPrompt,
    });

    expect(status).toMatchObject({
      available: true,
      applied: true,
      missing: false,
      status: "applied",
      label: "SPARKY prompt applied",
    });
  });

  it("detects an existing generic workspace as missing SPARKY without changing it", () => {
    const workspace = {
      id: 1,
      name: "TEST",
      slug: "test",
      openAiPrompt: Workspace.defaultPrompt,
    };

    const status = getSparkyPromptStatus(workspace);

    expect(status).toMatchObject({
      available: true,
      applied: false,
      missing: true,
      isGenericDefault: true,
      status: "generic_default",
      label: "SPARKY prompt not applied",
    });
    expect(Workspace.update).not.toHaveBeenCalled();
  });

  it("does not overwrite an existing custom prompt unless the repair helper is explicitly called", () => {
    const workspace = {
      id: 2,
      name: "TEST",
      slug: "test",
      openAiPrompt: "My custom workspace brain.",
    };

    const status = getSparkyPromptStatus(workspace);

    expect(status).toMatchObject({
      available: true,
      applied: false,
      missing: true,
      isGenericDefault: false,
      status: "custom_prompt",
    });
    expect(Workspace.update).not.toHaveBeenCalled();
  });

  it("blocks SPARKY prompt repair when the preset prompt is unavailable", async () => {
    const preset = loadSwarmsyHivePreset();
    const originalSystemPrompt = preset.systemPrompt;
    preset.systemPrompt = "";

    try {
      const workspace = {
        id: 4,
        name: "SWARMSY HIVE",
        slug: "swarmsy-hive",
        openAiPrompt: "Keep this custom prompt safe.",
      };

      const result = await applySparkyPromptToWorkspace(workspace, {
        id: 99,
        role: "admin",
      });

      expect(Workspace.update).not.toHaveBeenCalled();
      expect(PromptHistory.new).not.toHaveBeenCalled();
      expect(result).toMatchObject({
        success: false,
        applied: false,
        before: {
          available: false,
          applied: false,
          missing: true,
          status: "unavailable",
        },
        after: {
          available: false,
          applied: false,
          missing: true,
          status: "unavailable",
        },
        message:
          "SPARKY system prompt is unavailable; no changes were applied.",
      });
    } finally {
      preset.systemPrompt = originalSystemPrompt;
    }
  });

  it("repairs an existing SWARMSY HIVE with the generic prompt and records prompt history", async () => {
    const workspace = {
      id: 3,
      name: "SWARMSY HIVE",
      slug: "swarmsy-hive",
      openAiPrompt: Workspace.defaultPrompt,
    };
    const updated = {
      ...workspace,
      openAiPrompt: loadSwarmsyHivePreset().systemPrompt,
    };

    Workspace.update.mockResolvedValue({ workspace: updated, message: null });

    const result = await applySparkyPromptToWorkspace(workspace, {
      id: 99,
      role: "admin",
    });

    expect(PromptHistory.new).toHaveBeenCalledWith({
      workspaceId: 3,
      prompt: Workspace.defaultPrompt,
      modifiedBy: 99,
    });
    expect(Workspace.update).toHaveBeenCalledWith(3, {
      openAiPrompt: loadSwarmsyHivePreset().systemPrompt,
    });
    expect(result).toMatchObject({
      success: true,
      applied: true,
      before: { status: "generic_default" },
      after: { status: "applied", applied: true },
    });
  });
});
