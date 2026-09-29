process.env.STORAGE_DIR = __dirname;
process.env.NODE_ENV = "test";

let mockMultiUser = false;
let mockSettings = {};
jest.mock("../../../../../../models/systemSettings", () => ({
  SystemSettings: {
    isMultiUserMode: async () => mockMultiUser,
    getValueOrFallback: async ({ label }, fallback) =>
      mockSettings[label] ?? fallback,
    get: async ({ label }) =>
      mockSettings[label] ? { value: mockSettings[label] } : null,
  },
}));
jest.mock("../../../../../../utils/agents/imported", () => ({
  activeImportedPlugins: () => [],
}));
jest.mock("../../../../../../utils/agentFlows", () => ({
  AgentFlows: { activeFlowPlugins: () => [] },
}));
jest.mock("../../../../../../utils/MCP", () =>
  jest.fn().mockImplementation(() => ({ activeMCPServers: async () => [] }))
);

const bridge = require("../../../../../../utils/agents/aibitat/plugins/google-calendar/lib");
const {
  agentSkillsFromSystemSettings,
} = require("../../../../../../utils/agents/defaults");

const calendarSkills = (fns) =>
  fns.filter((f) => f.startsWith("google-calendar-agent#"));

describe("Google Calendar skill in multi-user mode", () => {
  beforeEach(() => {
    mockMultiUser = false;
    mockSettings = {
      default_agent_skills: JSON.stringify(["google-calendar-agent"]),
      google_calendar_agent_config: JSON.stringify({
        deploymentId: "DEPLOYMENT-ID-12345",
        apiKey: "api-key",
      }),
    };
    bridge.reset();
  });

  it("refuses requests once multi-user mode is enabled after a successful initialize", async () => {
    expect((await bridge.initialize()).success).toBe(true);

    mockMultiUser = true;
    const result = await bridge.initialize();
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/multi-user mode/);
    expect(await bridge.isAvailable()).toBe(false);
  });

  it("works again when multi-user mode is turned off", async () => {
    mockMultiUser = true;
    expect((await bridge.initialize()).success).toBe(false);

    mockMultiUser = false;
    expect((await bridge.initialize()).success).toBe(true);
  });

  it("includes calendar sub-skills in single-user mode", async () => {
    const fns = await agentSkillsFromSystemSettings();
    expect(calendarSkills(fns).length).toBeGreaterThan(0);
  });

  it("excludes all calendar sub-skills in multi-user mode", async () => {
    mockMultiUser = true;
    const fns = await agentSkillsFromSystemSettings();
    expect(calendarSkills(fns)).toEqual([]);
  });

  it("excludes calendar sub-skills when the skill is not configured", async () => {
    delete mockSettings.google_calendar_agent_config;
    const fns = await agentSkillsFromSystemSettings();
    expect(calendarSkills(fns)).toEqual([]);
  });

  it("respects disabled_google_calendar_skills", async () => {
    const all = calendarSkills(await agentSkillsFromSystemSettings());
    const [disabled, ...rest] = all.map((f) => f.split("#")[1]);
    mockSettings.disabled_google_calendar_skills = JSON.stringify([disabled]);

    const fns = calendarSkills(await agentSkillsFromSystemSettings());
    expect(fns).not.toContain(`google-calendar-agent#${disabled}`);
    expect(fns).toEqual(rest.map((n) => `google-calendar-agent#${n}`));
  });
});
