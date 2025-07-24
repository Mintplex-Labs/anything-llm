/* eslint-disable no-undef */
/* eslint-env jest, node */
/* global describe, it, expect */

const path = require("path");
// Ensure STORAGE_DIR is defined so modules that rely on it do not error out in tests.
if (!process.env.STORAGE_DIR) {
  process.env.STORAGE_DIR = path.resolve(__dirname, "../../../storage");
}

// Mock MCPCompatibilityLayer to avoid dynamic import issues during unit tests.
jest.mock("../../../utils/MCP", () => {
  return function () {
    return {
      activeMCPServers: async () => [],
    };
  };
});

const { WORKSPACE_AGENT } = require("../../../utils/agents/defaults");
const Provider = require("../../../utils/agents/aibitat/providers/ai-provider");

describe("WORKSPACE_AGENT.getDefinition system prompt prioritization", () => {
  it("uses workspace.openAiPrompt when provided and flag is true", async () => {
    const workspace = { openAiPrompt: "Respond only in emoji.", useWorkspacePromptForAgents: true };
    const def = await WORKSPACE_AGENT.getDefinition("openai", workspace, null);
    expect(def.role).toBe("Respond only in emoji.");
  });

  it("falls back to Provider.systemPrompt when workspace prompt is absent", async () => {
    const workspace = {};
    const def = await WORKSPACE_AGENT.getDefinition("openai", workspace, null);
    expect(def.role).toBe(Provider.systemPrompt("openai"));
  });
  it("falls back to Provider.systemPrompt when workspace.openAiPrompt provided but flag is false", async () => {
    const workspace = { openAiPrompt: "Respond only in emoji.", useWorkspacePromptForAgents: false };
    const def = await WORKSPACE_AGENT.getDefinition("openai", workspace, null);
    expect(def.role).toBe(Provider.systemPrompt("openai"));
  });
});
