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
  if (!("AGENT_AUTO_APPROVED_SKILLS" in process.env)) return false;
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

const EDITABLE_EMAIL_FIELDS = ["to", "cc", "bcc", "subject", "body"];

/**
 * Merges the recipient/subject/body edits a user made on the email approval card
 * into the fields the send tool was called with. Only known string fields are
 * accepted so the client cannot inject arbitrary send options. A rewritten body
 * drops the agent's HTML body so the plain-text edit is what actually gets sent.
 * @param {Object} fields - Email fields the tool was invoked with
 * @param {Object|null} edits - `payload` from the approval response, if any
 * @returns {Object} The fields with edits applied
 */
function applyEmailEdits(fields, edits = null) {
  if (!edits || typeof edits !== "object" || Array.isArray(edits))
    return fields;
  const merged = { ...fields };
  for (const key of EDITABLE_EMAIL_FIELDS) {
    if (typeof edits[key] !== "string") continue;
    merged[key] = edits[key].trim();
  }
  if (typeof edits.body === "string") merged.htmlBody = undefined;
  return merged;
}

module.exports = {
  skillIsAutoApproved,
  applyEmailEdits,
};
