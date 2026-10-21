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

// Questions agents ask over HTTP (tool approvals, clarifying questions) wait
// here until the client answers with a follow-up request or the timeout passes.
const pendingClientReplies = new Map();

/**
 * Waits for the client to answer a request sent over the stream. A reply of
 * `{ hold: true }` means the user started answering, so the wait is extended
 * to `holdTimeoutMs` instead of resolving.
 * @param {string} requestId
 * @param {number} timeoutMs
 * @param {number} [holdTimeoutMs]
 * @returns {Promise<object|null>} the client's reply, or null on timeout
 */
function waitForClientReply(requestId, timeoutMs, holdTimeoutMs = timeoutMs) {
  return new Promise((resolve) => {
    const expire = () => {
      pendingClientReplies.delete(requestId);
      resolve(null);
    };
    let timeout = setTimeout(expire, timeoutMs);
    pendingClientReplies.set(requestId, (reply) => {
      clearTimeout(timeout);
      if (reply.hold) return (timeout = setTimeout(expire, holdTimeoutMs));
      pendingClientReplies.delete(requestId);
      resolve(reply);
    });
  });
}

/**
 * Delivers the client's answer to a waiting request.
 * @param {string} requestId
 * @param {object} reply
 * @returns {boolean} false when no request with that id is waiting
 */
function resolveClientReply(requestId, reply) {
  const resolve = pendingClientReplies.get(requestId);
  if (!resolve) return false;
  resolve(reply);
  return true;
}

module.exports = {
  skillIsAutoApproved,
  waitForClientReply,
  resolveClientReply,
};
