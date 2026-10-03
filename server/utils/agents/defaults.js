const AgentPlugins = require("./aibitat/plugins");
const { SystemSettings } = require("../../models/systemSettings");
const { AgentSkillConfig } = require("../../models/agentSkillConfig");
const Provider = require("./aibitat/providers/ai-provider");
const ImportedPlugin = require("./imported");
const { AgentFlows } = require("../agentFlows");
const MCPCompatibilityLayer = require("../MCP");

// This is a list of skills that are built-in and default enabled.
const DEFAULT_SKILLS = [
  AgentPlugins.memory.name,
  AgentPlugins.docSummarizer.name,
  AgentPlugins.webScraping.name,
  AgentPlugins.webBrowsing.name,
];

// Built-in skills that are off until enabled.
const OPTIONAL_SKILLS = [
  AgentPlugins.rechart.name,
  AgentPlugins.generateImage.name,
  AgentPlugins.sqlAgent.name,
  AgentPlugins.filesystemAgent.name,
  AgentPlugins.createFilesAgent.name,
  AgentPlugins.gmailAgent.name,
  AgentPlugins.outlookAgent.name,
  AgentPlugins.googleCalendarAgent.name,
  AgentPlugins.createScheduledJob.name,
];

// Skills that must never be injected when the instance is running in multi-user mode.
const SINGLE_USER_ONLY_SKILLS = new Set(["create-scheduled-job"]);

/**
 * Configuration for agent skills that require availability checks.
 * Each entry maps a skill name to its availability checker.
 */
const SKILL_FILTER_CONFIG = {
  "filesystem-agent": {
    getAvailability: () =>
      require("./aibitat/plugins/filesystem/lib").isToolAvailable(),
  },
  "create-files-agent": {
    getAvailability: () =>
      require("./aibitat/plugins/create-files/lib").isToolAvailable(),
  },
  "gmail-agent": {
    getAvailability: async () =>
      require("./aibitat/plugins/gmail/lib").GmailBridge.isToolAvailable(),
  },
  "outlook-agent": {
    getAvailability: async () =>
      require("./aibitat/plugins/outlook/lib").OutlookBridge.isToolAvailable(),
  },
  "google-calendar-agent": {
    getAvailability: async () =>
      require("./aibitat/plugins/google-calendar/lib").GoogleCalendarBridge.isToolAvailable(),
  },
};

const USER_AGENT = {
  name: "USER",
  getDefinition: () => {
    return {
      interrupt: "ALWAYS",
      role: "I am the human monitor and oversee this chat. Any questions on action or decision making should be directed to me.",
    };
  },
};

const WORKSPACE_AGENT = {
  name: "@agent",
  /**
   * Get the definition for the workspace agent with its role (prompt) and functions in Aibitat format
   * @param {string} _provider - Unused, kept for call-site compatibility
   * @param {import("@prisma/client").workspaces | null} workspace
   * @param {import("@prisma/client").users | null} user
   * @param {string} [prompt] - Current user message for memory reranking
   * @returns {Promise<{ role: string, functions: object[] }>}
   */
  getDefinition: async (
    _provider = null,
    workspace = null,
    user = null,
    prompt = ""
  ) => {
    let [role, clarifyingQuestionsSkills] = await Promise.all([
      Provider.systemPrompt({
        workspace,
        user,
        prompt,
      }),
      clarifyingQuestionsSkillIfEnabled(),
    ]);

    // If clarifying questions tools are enabled, add a note to the role that the user must use the request-user-input tool to ask questions.
    if (!!clarifyingQuestionsSkills?.length)
      role +=
        "\n\nWhen you need information from the user (URLs, file paths, preferences, choices, etc.), you MUST use the request-user-input tool. Do not ask questions in your text response - the user cannot reply to text. Only the tool can collect user input.";

    return {
      role,
      functions: [
        ...(await agentSkillsFromSystemSettings({ workspace, user })),
        ...clarifyingQuestionsSkills,
        ...ImportedPlugin.activeImportedPlugins(),
        ...AgentFlows.activeFlowPlugins(),
        ...(await new MCPCompatibilityLayer().activeMCPServers()),
      ],
    };
  },
};

/**
 * Conditionally include the request-user-input sub-tools in the workspace agent's
 * function list when the admin has enabled clarifying questions.
 * Returns an empty array when disabled so the tools aren't visible to the LLM.
 * Names use the parent#child convention so #attachPlugins loads each sub-tool.
 * @returns {Promise<string[]>}
 */
async function clarifyingQuestionsSkillIfEnabled() {
  const enabled =
    (await SystemSettings.getValueOrFallback(
      { label: "agent_clarifying_questions_enabled" },
      "false"
    )) === "true";
  if (!enabled) return [];

  const parentName = AgentPlugins.requestUserInput.name;
  const subPlugins = AgentPlugins.requestUserInput.plugin;
  if (!Array.isArray(subPlugins)) return [];
  return subPlugins.map((sub) => `${parentName}#${sub.name}`);
}

/**
 * @typedef {Object} AgentSkillState
 * @property {string} skill
 * @property {string|null} parent - parent skill name for sub-skills
 * @property {boolean} available - allowed by the admin levels
 * @property {boolean} enabled - available and not opted out of by the user
 * @property {Object|null} sharedConfig - unmasked config set by an admin level
 * @property {Object|null} personalConfig - unmasked config the user set for themselves
 */

/**
 * Resolve every built-in skill and sub-skill for a workspace and user.
 * @param {Object} [scope]
 * @param {import("@prisma/client").workspaces | null} [scope.workspace]
 * @param {import("@prisma/client").users | null} [scope.user]
 * @returns {Promise<AgentSkillState[]>}
 */
async function agentSkillStates({ workspace = null, user = null } = {}) {
  const resolved = await AgentSkillConfig.resolveAll({
    workspaceId: workspace?.id,
    userId: user?.id,
  });
  const state = (skill, enabledByDefault, parent = null) => {
    const available =
      (parent?.available ?? true) &&
      (resolved[skill]?.enabled ?? enabledByDefault);
    return {
      skill,
      parent: parent?.skill ?? null,
      available,
      enabled:
        available && (parent?.enabled ?? true) && !resolved[skill]?.optedOut,
      sharedConfig: resolved[skill]?.sharedConfig ?? null,
      personalConfig: resolved[skill]?.personalConfig ?? null,
    };
  };

  return [
    ...DEFAULT_SKILLS.map((skill) => [skill, true]),
    ...OPTIONAL_SKILLS.map((skill) => [skill, false]),
  ].flatMap(([skill, enabledByDefault]) => {
    const parent = state(skill, enabledByDefault);
    const children = Array.isArray(AgentPlugins[skill].plugin)
      ? AgentPlugins[skill].plugin.map((child) =>
          state(child.name, true, parent)
        )
      : [];
    return [parent, ...children];
  });
}

/**
 * Fetches and preloads the names/identifiers for plugins that will be dynamically
 * loaded later
 * @param {Object} [scope]
 * @param {import("@prisma/client").workspaces | null} [scope.workspace]
 * @param {import("@prisma/client").users | null} [scope.user]
 * @returns {Promise<string[]>}
 */
async function agentSkillsFromSystemSettings({
  workspace = null,
  user = null,
} = {}) {
  const systemFunctions = [];
  const [isMultiUser, states] = await Promise.all([
    SystemSettings.isMultiUserMode(),
    agentSkillStates({ workspace, user }),
  ]);
  const enabledSkills = new Set(
    states.filter((state) => state.enabled).map((state) => state.skill)
  );

  for (const skillName of [...DEFAULT_SKILLS, ...OPTIONAL_SKILLS]) {
    if (!enabledSkills.has(skillName)) continue;
    if (isMultiUser && SINGLE_USER_ONLY_SKILLS.has(skillName)) continue;
    if (
      SKILL_FILTER_CONFIG[skillName] &&
      !(await SKILL_FILTER_CONFIG[skillName].getAvailability())
    )
      continue;

    // This is a plugin module with many sub-children plugins who
    // need to be named via `${parent}#${child}` naming convention
    if (Array.isArray(AgentPlugins[skillName].plugin)) {
      for (const subPlugin of AgentPlugins[skillName].plugin) {
        if (!enabledSkills.has(subPlugin.name)) continue;
        systemFunctions.push(
          `${AgentPlugins[skillName].name}#${subPlugin.name}`
        );
      }
      continue;
    }

    // This is normal single-stage plugin
    systemFunctions.push(AgentPlugins[skillName].name);
  }
  return systemFunctions;
}

/**
 * Mask a skill config before it is sent to the UI. Skills list their secret config
 * keys in `secretConfigFields` on their plugin export. Masked values sent back on
 * save are ignored, so the stored secret is kept.
 * @param {string} skill
 * @param {Object|null} config
 * @returns {Object|null}
 */
function maskSkillConfig(skill, config = null) {
  if (!config) return null;
  const secretFields = AgentPlugins[skill]?.secretConfigFields ?? [];
  return Object.fromEntries(
    Object.entries(config).map(([key, value]) => [
      key,
      secretFields.includes(key) && value ? "********" : value,
    ])
  );
}

/**
 * Whether a name is a built-in skill or sub-skill that agent skill configs can toggle.
 * @param {string} skill
 * @returns {boolean}
 */
function isConfigurableSkill(skill = "") {
  return [...DEFAULT_SKILLS, ...OPTIONAL_SKILLS].some(
    (name) =>
      name === skill ||
      (Array.isArray(AgentPlugins[name].plugin) &&
        AgentPlugins[name].plugin.some((child) => child.name === skill))
  );
}

/**
 * Resolve a UI skill/tool identifier into the names needed to toggle it on a live
 * agent session. `loadable` are the funcsToLoad-style identifiers handed to the
 * plugin loader to (re)register the tool via `aibitat.use()`; `registered` are the
 * resulting `aibitat.functions` Map keys to delete when disabling.
 *
 * Handles flows (`@@flow_<uuid>`), multi-stage parents (e.g. sql-agent -> each
 * child), imported hubIds, MCP server tools, single built-ins, and sub-skill
 * child names.
 * @param {string} skill - Skill key, `@@flow_<uuid>`, MCP `<server>-<tool>`, hubId, or sub-skill name.
 * @param {object} [opts]
 * @param {string|null} [opts.serverName] - MCP server name; required to enable an MCP tool.
 * @returns {{ loadable: string[], registered: string[] }}
 */
function resolveAgentSkill(skill = "", { serverName = null } = {}) {
  // Flow tool: loaded by `@@flow_<uuid>`, registered under its sanitized tool name.
  if (skill.startsWith("@@flow_")) {
    const uuid = skill.replace("@@flow_", "");
    const flow = AgentFlows.loadFlow(uuid);
    if (!flow) return { loadable: [], registered: [] };
    return {
      loadable: [skill],
      registered: [AgentFlows.sanitizeToolName(flow.name) || `flow_${uuid}`],
    };
  }

  // MCP server tool (`<server>-<tool>`): the Map key matches the UI id exactly.
  // Enabling reloads the server so the current suppression state is respected.
  if (serverName)
    return { loadable: [`@@mcp_${serverName}`], registered: [skill] };

  // Top-level built-in skill.
  const plugin = AgentPlugins[skill];
  if (plugin) {
    // Multi-stage plugin (e.g. sql-agent) registers one function per child.
    if (Array.isArray(plugin.plugin))
      return {
        loadable: plugin.plugin.map((c) => `${plugin.name}#${c.name}`),
        registered: plugin.plugin.map((c) => c.name),
      };
    return { loadable: [plugin.name], registered: [plugin.name] };
  }

  // Imported plugin referenced by hubId (registered under the hubId itself).
  if (ImportedPlugin.validateImportedPluginHandler(skill))
    return { loadable: [`@@${skill}`], registered: [skill] };

  // Sub-skill child name (e.g. a filesystem-agent child): find its parent so the
  // loader can attach just that child via the `parent#child` convention.
  for (const key of Object.keys(AgentPlugins)) {
    const parent = AgentPlugins[key];
    if (!Array.isArray(parent?.plugin)) continue;
    const child = parent.plugin.find((c) => c.name === skill);
    if (child)
      return {
        loadable: [`${parent.name}#${child.name}`],
        registered: [child.name],
      };
  }

  // Fallback: treat the id as both the loadable entry and the registered name.
  return { loadable: [skill], registered: [skill] };
}

module.exports = {
  USER_AGENT,
  WORKSPACE_AGENT,
  agentSkillStates,
  agentSkillsFromSystemSettings,
  isConfigurableSkill,
  maskSkillConfig,
  resolveAgentSkill,
};
