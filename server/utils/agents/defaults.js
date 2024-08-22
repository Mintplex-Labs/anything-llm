const AgentPlugins = require("./aibitat/plugins");
const { SystemSettings } = require("../../models/systemSettings");
const { safeJsonParse } = require("../http");
const Provider = require("./aibitat/providers/ai-provider");

const USER_AGENT = {
  name: "USER",
  getDefinition: async () => {
    return {
      interrupt: "ALWAYS",
      role: "I am the human monitor and oversee this chat. Any questions on action or decision making should be directed to me.",
    };
  },
};

const WORKSPACE_AGENT = {
  name: "@agent",
  getDefinition: async (provider = null) => {
    const defaultFunctions = [
      AgentPlugins.memory.name, // RAG
      AgentPlugins.docSummarizer.name, // Doc Summary
      AgentPlugins.webScraping.name, // Collector web-scraping
    ];

    return {
      role: Provider.systemPrompt(provider),
      functions: [
        ...defaultFunctions,
        ...(await agentSkillsFromSystemSettings()),
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
  const _setting = (await SystemSettings.get({ label: "default_agent_skills" }))
    ?.value;

  safeJsonParse(_setting, []).forEach((skillName) => {
    if (!AgentPlugins.hasOwnProperty(skillName)) return;

    // This is a plugin module with many sub-children plugins who
    // need to be named via `${parent}#${child}` naming convention
    if (Array.isArray(AgentPlugins[skillName].plugin)) {
      for (const subPlugin of AgentPlugins[skillName].plugin) {
        systemFunctions.push(
          `${AgentPlugins[skillName].name}#${subPlugin.name}`
        );
      }
      return;
    }

    // This is normal single-stage plugin
    systemFunctions.push(AgentPlugins[skillName].name);
  });
  return systemFunctions;
}

module.exports = {
  USER_AGENT,
  WORKSPACE_AGENT,
  agentSkillsFromSystemSettings,
};
