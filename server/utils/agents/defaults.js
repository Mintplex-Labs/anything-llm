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
 * @typedef {Object} AgentSkillCatalogEntry
 * @property {string} skill - key used for agent skill config rows
 * @property {"builtin"|"imported"|"flow"|"mcp"} type
 * @property {string|null} parent - parent skill for sub-skills and MCP tools
 * @property {boolean} enabledByDefault - state when no config row exists
 * @property {boolean} usable - false when it can never load here (not set up, single-user only, server down)
 * @property {string|null} load - identifier the agent plugin loader attaches, null when its children load instead
 * @property {string[]} registered - aibitat function names to remove when it is turned off
 */

/**
 * @typedef {AgentSkillCatalogEntry & {
 *   available: boolean,
 *   enabled: boolean,
 *   sharedConfig: Object|null,
 *   personalConfig: Object|null,
 * }} AgentSkillState
 * `available` is what the admin levels allow, `enabled` also respects the user opting out.
 * Configs are unmasked.
 */

/**
 * Every agent skill of every type in one list, so configs, loading and the UI
 * can treat them all the same way.
 * @param {Object} [options]
 * @param {boolean} [options.mcpTools] - also list MCP tools, which pings each running MCP server
 * @returns {Promise<AgentSkillCatalogEntry[]>}
 */
async function agentSkillCatalog({ mcpTools = true } = {}) {
  const catalog = [];
  const isMultiUser = await SystemSettings.isMultiUserMode();

  // Built-in skills, each followed by its sub-skills (eg: sql-agent -> sql-list-databases).
  // A skill with sub-skills loads through them, so the parent itself has nothing to load.
  for (const skill of [...DEFAULT_SKILLS, ...OPTIONAL_SKILLS]) {
    const subSkills = AgentPlugins[skill].plugin;
    const hasSubSkills = Array.isArray(subSkills);
    const usable =
      !(isMultiUser && SINGLE_USER_ONLY_SKILLS.has(skill)) &&
      (!SKILL_FILTER_CONFIG[skill] ||
        !!(await SKILL_FILTER_CONFIG[skill].getAvailability()));

    catalog.push({
      skill,
      type: "builtin",
      parent: null,
      enabledByDefault: DEFAULT_SKILLS.includes(skill),
      usable,
      load: hasSubSkills ? null : skill,
      registered: hasSubSkills ? [] : [skill],
    });

    if (!hasSubSkills) continue;
    for (const subSkill of subSkills)
      catalog.push({
        skill: subSkill.name,
        type: "builtin",
        parent: skill,
        enabledByDefault: true,
        usable,
        load: `${skill}#${subSkill.name}`,
        registered: [subSkill.name],
      });
  }

  // Imported skills are on by default when their plugin.json is active.
  for (const plugin of ImportedPlugin.listImportedPlugins())
    catalog.push({
      skill: plugin.hubId,
      type: "imported",
      parent: null,
      enabledByDefault: !!plugin.active,
      usable: true,
      load: `@@${plugin.hubId}`,
      registered: [plugin.hubId],
    });

  // Flows are on by default when the flow is active. They register under their sanitized name.
  for (const flow of AgentFlows.listFlows())
    catalog.push({
      skill: `@@flow_${flow.uuid}`,
      type: "flow",
      parent: null,
      enabledByDefault: flow.active,
      usable: true,
      load: `@@flow_${flow.uuid}`,
      registered: [
        AgentFlows.sanitizeToolName(flow.name) || `flow_${flow.uuid}`,
      ],
    });

  // MCP servers. The agent loader only needs the running servers, so skip
  // pinging each one for its tools.
  const mcp = new MCPCompatibilityLayer();
  if (!mcpTools) {
    for (const serverSkill of await mcp.activeMCPServers())
      catalog.push({
        skill: serverSkill,
        type: "mcp",
        parent: null,
        enabledByDefault: true,
        usable: true,
        load: serverSkill,
        registered: [],
      });
    return catalog;
  }

  // MCP servers, each followed by its tools. A tool is on by default unless the
  // MCP server config suppresses it. Tools load through their server, which only
  // registers the tools enabled for the agent's workspace and user.
  for (const server of await mcp.servers()) {
    const serverSkill = `@@mcp_${server.name}`;
    const suppressedTools = mcp.getSuppressedTools(server.name);
    const toolSkills = server.tools.map(
      (tool) => `${server.name}-${tool.name}`
    );
    catalog.push({
      skill: serverSkill,
      type: "mcp",
      parent: null,
      enabledByDefault: true,
      usable: server.running,
      load: serverSkill,
      registered: toolSkills,
    });

    for (const tool of server.tools)
      catalog.push({
        skill: `${server.name}-${tool.name}`,
        type: "mcp",
        parent: serverSkill,
        enabledByDefault: !suppressedTools.includes(tool.name),
        usable: server.running,
        load: serverSkill,
        registered: [`${server.name}-${tool.name}`],
      });
  }
  return catalog;
}

/**
 * Resolve one catalog entry against the resolved config rows.
 * @param {Object<string, import("../../models/agentSkillConfig").ResolvedSkillConfig>} resolved
 * @param {AgentSkillCatalogEntry} entry
 * @param {AgentSkillState|null} [parent]
 * @returns {AgentSkillState}
 */
function skillState(resolved, entry, parent = null) {
  const row = resolved[entry.skill];
  const available =
    (parent?.available ?? true) && (row?.enabled ?? entry.enabledByDefault);
  return {
    ...entry,
    available,
    enabled: available && (parent?.enabled ?? true) && !row?.optedOut,
    sharedConfig: row?.sharedConfig ?? null,
    personalConfig: row?.personalConfig ?? null,
  };
}

/**
 * Resolve every skill in the catalog for a workspace and user.
 * @param {Object} [scope]
 * @param {import("@prisma/client").workspaces | null} [scope.workspace]
 * @param {import("@prisma/client").users | null} [scope.user]
 * @param {boolean} [scope.mcpTools] - include MCP tools, see agentSkillCatalog
 * @returns {Promise<AgentSkillState[]>}
 */
async function agentSkillStates({
  workspace = null,
  user = null,
  mcpTools = true,
} = {}) {
  const [resolved, catalog] = await Promise.all([
    AgentSkillConfig.resolveAll({
      workspaceId: workspace?.id,
      userId: user?.id,
    }),
    agentSkillCatalog({ mcpTools }),
  ]);

  const states = {};
  for (const entry of catalog)
    states[entry.skill] = skillState(resolved, entry, states[entry.parent]);
  return Object.values(states);
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
  const states = await agentSkillStates({ workspace, user, mcpTools: false });
  const loads = states
    .filter((state) => state.enabled && state.usable && state.load)
    .map((state) => state.load);
  return [...new Set(loads)];
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
 * Whether a name is a built-in skill or sub-skill.
 * @param {string} skill
 * @returns {boolean}
 */
function isBuiltInSkill(skill = "") {
  return [...DEFAULT_SKILLS, ...OPTIONAL_SKILLS].some(
    (name) =>
      name === skill ||
      (Array.isArray(AgentPlugins[name].plugin) &&
        AgentPlugins[name].plugin.some((child) => child.name === skill))
  );
}

module.exports = {
  USER_AGENT,
  WORKSPACE_AGENT,
  agentSkillCatalog,
  agentSkillStates,
  agentSkillsFromSystemSettings,
  isBuiltInSkill,
  maskSkillConfig,
  skillState,
};
