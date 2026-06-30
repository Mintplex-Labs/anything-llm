const AgentPlugins = require("./aibitat/plugins");
const { SystemSettings } = require("../../models/systemSettings");
const { safeJsonParse } = require("../http");
const Provider = require("./aibitat/providers/ai-provider");
const ImportedPlugin = require("./imported");
const { AgentFlows } = require("../agentFlows");
const MCPCompatibilityLayer = require("../MCP");

// This is a list of skills that are built-in and default enabled.
const DEFAULT_SKILLS = [
  AgentPlugins.memory.name,
  AgentPlugins.docSummarizer.name,
  AgentPlugins.webScraping.name,
];

/**
 * Configuration for agent skills that require availability checks and disabled sub-skill lists.
 * Each entry maps a skill name to its availability checker and disabled skills list key.
 */
const SKILL_FILTER_CONFIG = {
  "filesystem-agent": {
    getAvailability: () =>
      require("./aibitat/plugins/filesystem/lib").isToolAvailable(),
    disabledSettingKey: "disabled_filesystem_skills",
  },
  "create-files-agent": {
    getAvailability: () =>
      require("./aibitat/plugins/create-files/lib").isToolAvailable(),
    disabledSettingKey: "disabled_create_files_skills",
  },
  "gmail-agent": {
    getAvailability: async () =>
      require("./aibitat/plugins/gmail/lib").GmailBridge.isToolAvailable(),
    disabledSettingKey: "disabled_gmail_skills",
  },
  "outlook-agent": {
    getAvailability: async () =>
      require("./aibitat/plugins/outlook/lib").OutlookBridge.isToolAvailable(),
    disabledSettingKey: "disabled_outlook_skills",
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
   * @param {string} provider
   * @param {import("@prisma/client").workspaces | null} workspace
   * @param {import("@prisma/client").users | null} user
   * @param {string} [prompt] - Current user message for memory reranking
   * @returns {Promise<{ role: string, functions: object[] }>}
   */
  getDefinition: async (
    provider = null,
    workspace = null,
    user = null,
    prompt = ""
  ) => {
    let [role, clarifyingQuestionsSkills] = await Promise.all([
      Provider.systemPrompt({
        provider,
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
        ...(await agentSkillsFromSystemSettings()),
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
 * Fetches and preloads the names/identifiers for plugins that will be dynamically
 * loaded later
 * @returns {Promise<string[]>}
 */
async function agentSkillsFromSystemSettings() {
  const systemFunctions = [];

  // Load non-imported built-in skills that are configurable, but are default enabled.
  const _disabledDefaultSkills = safeJsonParse(
    await SystemSettings.getValueOrFallback(
      { label: "disabled_agent_skills" },
      "[]"
    ),
    []
  );
  DEFAULT_SKILLS.forEach((skill) => {
    if (!_disabledDefaultSkills.includes(skill))
      systemFunctions.push(AgentPlugins[skill].name);
  });

  // Load non-imported built-in skills that are configurable.
  const _setting = safeJsonParse(
    await SystemSettings.getValueOrFallback(
      { label: "default_agent_skills" },
      "[]"
    ),
    []
  );

  // Pre-load disabled sub-skills and availability for configured skills
  const skillFilterState = {};
  for (const skillName of Object.keys(SKILL_FILTER_CONFIG)) {
    if (!_setting.includes(skillName)) continue;
    const config = SKILL_FILTER_CONFIG[skillName];
    skillFilterState[skillName] = {
      available: await config.getAvailability(),
      disabledSubSkills: safeJsonParse(
        await SystemSettings.getValueOrFallback(
          { label: config.disabledSettingKey },
          "[]"
        ),
        []
      ),
    };
  }

  for (const skillName of _setting) {
    if (!AgentPlugins.hasOwnProperty(skillName)) continue;

    // This is a plugin module with many sub-children plugins who
    // need to be named via `${parent}#${child}` naming convention
    if (Array.isArray(AgentPlugins[skillName].plugin)) {
      for (const subPlugin of AgentPlugins[skillName].plugin) {
        // Check if this skill has filter configuration
        const filterState = skillFilterState[skillName];
        if (filterState) {
          if (!filterState.available) continue;
          if (filterState.disabledSubSkills.includes(subPlugin.name)) continue;
        }

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
  agentSkillsFromSystemSettings,
  resolveAgentSkill,
};
