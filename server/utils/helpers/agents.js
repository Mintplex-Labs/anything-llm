const chalk = require("chalk");

/**
 * Checks if a skill is auto-approved by the ENV variable AGENT_AUTO_APPROVED_SKILLS.
 * which is a comma-separated list of skill names. This property applies globally to all users
 * so that all invocations of the skill are auto-approved without user interaction.
 * @param {Object} options - The options object
 * @param {string} options.skillName - The name of the skill
 * @returns {boolean} True if the skill is auto-approved, false otherwise
 */
function skillIsAutoApproved({ skillName }) {
  if ((!"AGENT_AUTO_APPROVED_SKILLS") in process.env) return false;
  const autoApprovedSkills = String(process.env.AGENT_AUTO_APPROVED_SKILLS)
    .split(",")
    .map((skill) => skill.trim())
    .filter((skill) => !!skill);

  // If the list contains <all>, then all skills are auto-approved
  // This is a special case and overrides any other items in the list.
  if (autoApprovedSkills.includes("<all>")) return true;

  if (!autoApprovedSkills.length || !autoApprovedSkills.includes(skillName))
    return false;

  console.log(
    chalk.green(
      `Skill ${skillName} is auto-approved by the ENV variable AGENT_AUTO_APPROVED_SKILLS.`
    )
  );
  return true;
}

module.exports = {
  skillIsAutoApproved,
};
