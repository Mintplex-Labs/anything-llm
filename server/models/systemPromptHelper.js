const { SystemSettings } = require("../models/systemSettings"); // путь поправь по проекту

async function getGeneralOrDefaultSystemPrompt() {
  try {
    const generalSetting = await SystemSettings.get({
      label: "general_system_prompt",
    });
    const defaultSetting = await SystemSettings.get({
      label: "default_system_prompt",
    });

    const generalSystemPrompt = generalSetting?.value?.trim() || null;
    const defaultSystemPrompt = defaultSetting?.value?.trim() || "";

    return generalSystemPrompt || defaultSystemPrompt;
  } catch (error) {
    console.error("Error fetching system prompts:", error);
    return "";
  }
}

module.exports = { getGeneralOrDefaultSystemPrompt };
