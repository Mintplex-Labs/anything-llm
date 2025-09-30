const { SystemSettings } = require("../models/systemSettings");
const { SystemPromptVariables } = require("./systemPromptVariables"); // путь поправь по проекту

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

/**
 * Returns the base prompt for the chat. This method will also do variable
 * substitution on the prompt if there are any defined variables in the prompt.
 * @param {Object|null} workspace - the workspace object
 * @param {Object|null} user - the user object
 * @returns {Promise<string>} - the base prompt
 */
async function chatPrompt(workspace, user = null) {
  const generalOrDefaultSystemPrompt = await getGeneralOrDefaultSystemPrompt();
  const basePrompt = workspace?.openAiPrompt || generalOrDefaultSystemPrompt;

  return await SystemPromptVariables.expandSystemPromptVariables(
    basePrompt,
    user?.id,
    workspace?.id
  );
}

module.exports = { getGeneralOrDefaultSystemPrompt, chatPrompt };
