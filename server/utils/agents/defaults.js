const AgentPlugins = require("./aibitat/plugins");
const { SystemSettings } = require("../../models/systemSettings");
const { safeJsonParse } = require("../http");
const Provider = require("./aibitat/providers/ai-provider");
const ImportedPlugin = require("./imported");
const { AgentFlows } = require("../agentFlows");
const MCPCompatibilityLayer = require("../MCP");
const { promptWithMemories } = require("../memories");

// This is a list of skills that are built-in and default enabled.
const DEFAULT_SKILLS = [
  AgentPlugins.memory.name,
  AgentPlugins.docSummarizer.name,
  AgentPlugins.webScraping.name,
];

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
   * @returns {Promise<{ role: string, functions: object[] }>}
   */
  getDefinition: async (provider = null, workspace = null, user = null) => {
    const basePrompt = await Provider.systemPrompt({
      provider,
      workspace,
      user,
    });
    const role = await promptWithMemories({
      systemPrompt: basePrompt,
      userId: user?.id ?? null,
      workspaceId: workspace?.id,
    });

    return {
      role,
      functions: [
        ...(await agentSkillsFromSystemSettings()),
        ...ImportedPlugin.activeImportedPlugins(),
        ...AgentFlows.activeFlowPlugins(),
        ...(await new MCPCompatibilityLayer().activeMCPServers()),
      ],
    };
  },
};

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

  // Load disabled filesystem sub-skills
  const _disabledFilesystemSkills = safeJsonParse(
    await SystemSettings.getValueOrFallback(
      { label: "disabled_filesystem_skills" },
      "[]"
    ),
    []
  );

  // Load disabled create-files sub-skills
  const _disabledCreateFilesSkills = safeJsonParse(
    await SystemSettings.getValueOrFallback(
      { label: "disabled_create_files_skills" },
      "[]"
    ),
    []
  );

  // Load disabled gmail sub-skills
  const _disabledGmailSkills = safeJsonParse(
    await SystemSettings.getValueOrFallback(
      { label: "disabled_gmail_skills" },
      "[]"
    ),
    []
  );

  // Load non-imported built-in skills that are configurable.
  const _setting = safeJsonParse(
    await SystemSettings.getValueOrFallback(
      { label: "default_agent_skills" },
      "[]"
    ),
    []
  );

  // Pre-check gmail availability once (async) to avoid await inside loop
  let gmailAvailable = false;
  if (_setting.includes("gmail-agent")) {
    const gmailTool = require("./aibitat/plugins/gmail/lib");
    gmailAvailable = await gmailTool.GmailBridge.isToolAvailable();
  }

  for (const skillName of _setting) {
    if (!AgentPlugins.hasOwnProperty(skillName)) continue;

    // This is a plugin module with many sub-children plugins who
    // need to be named via `${parent}#${child}` naming convention
    if (Array.isArray(AgentPlugins[skillName].plugin)) {
      for (const subPlugin of AgentPlugins[skillName].plugin) {
        /**
         * If the filesystem tool is not available, or the sub-skill is explicitly disabled, skip it
         * This is a docker specific skill so it cannot be used in other environments.
         */
        if (skillName === "filesystem-agent") {
          const filesystemTool = require("./aibitat/plugins/filesystem/lib");
          if (!filesystemTool.isToolAvailable()) continue;
          if (_disabledFilesystemSkills.includes(subPlugin.name)) continue;
        }

        /**
         * If the create-files tool is not available, or the sub-skill is explicitly disabled, skip it
         * This is a docker specific skill so it cannot be used in other environments.
         */
        if (skillName === "create-files-agent") {
          const createFilesTool = require("./aibitat/plugins/create-files/lib");
          if (!createFilesTool.isToolAvailable()) continue;
          if (_disabledCreateFilesSkills.includes(subPlugin.name)) continue;
        }

        /**
         * If the gmail tool is not available (multi-user mode or missing config),
         * or the sub-skill is explicitly disabled, skip it.
         * Gmail integration is only available in single-user mode for security reasons.
         */
        if (skillName === "gmail-agent") {
          if (!gmailAvailable) continue;
          if (_disabledGmailSkills.includes(subPlugin.name)) continue;
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

module.exports = {
  USER_AGENT,
  WORKSPACE_AGENT,
  agentSkillsFromSystemSettings,
};
