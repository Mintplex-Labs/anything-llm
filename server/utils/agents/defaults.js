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

    const _setting = (
      await SystemSettings.get({ label: "default_agent_skills" })
    )?.value;
    safeJsonParse(_setting, []).forEach((skillName) => {
      if (!AgentPlugins.hasOwnProperty(skillName)) return;
      defaultFunctions.push(AgentPlugins[skillName].name);
    });

    return {
      role: Provider.systemPrompt(provider),
      functions: defaultFunctions,
    };
  },
};

module.exports = {
  USER_AGENT,
  WORKSPACE_AGENT,
};
