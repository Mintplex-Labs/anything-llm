/**
 * Convert a type to a readable string for the community hub.
 * @param {("agentSkills" | "agentSkill" | "systemPrompts" | "systemPrompt" | "slashCommands" | "slashCommand")} type
 * @returns {string}
 */
export function readableType(type) {
  switch (type) {
    case "agentSkills":
    case "agentSkill":
      return "Agent Skills";
    case "systemPrompt":
    case "systemPrompts":
      return "System Prompts";
    case "slashCommand":
    case "slashCommands":
      return "Slash Commands";
  }
}

/**
 * Convert a type to a path for the community hub.
 * @param {("agentSkill" | "agentSkills" | "systemPrompt" | "systemPrompts" | "slashCommand" | "slashCommands")} type
 * @returns {string}
 */
export function typeToPath(type) {
  switch (type) {
    case "agentSkill":
    case "agentSkills":
      return "agent-skills";
    case "systemPrompt":
    case "systemPrompts":
      return "system-prompts";
    case "slashCommand":
    case "slashCommands":
      return "slash-commands";
  }
}
