const prisma = require("../utils/prisma");
const { safeJsonParse } = require("../utils/http");

const AgentSkillWhitelist = {
  SINGLE_USER_LABEL: "whitelisted_agent_skills",

  /**
   * Get the label for storing whitelist in system_settings
   * @param {number|null} userId - User ID in multi-user mode, null for single-user
   * @returns {string}
   */
  _getLabel: function (userId = null) {
    if (userId) return `user_${userId}_whitelisted_agent_skills`;
    return this.SINGLE_USER_LABEL;
  },

  /**
   * Get the whitelisted skills for a user or the system
   * @param {number|null} userId - User ID in multi-user mode, null for single-user
   * @returns {Promise<string[]>} Array of whitelisted skill names
   */
  get: async function (userId = null) {
    try {
      const label = this._getLabel(userId);
      const setting = await prisma.system_settings.findFirst({
        where: { label },
      });
      return safeJsonParse(setting?.value, []);
    } catch (error) {
      console.error("AgentSkillWhitelist.get error:", error.message);
      return [];
    }
  },

  /**
   * Add a skill to the whitelist
   * @param {string} skillName - The skill name to whitelist
   * @param {number|null} userId - User ID in multi-user mode, null for single-user
   * @returns {Promise<{success: boolean, error: string|null}>}
   */
  add: async function (skillName, userId = null) {
    try {
      if (!skillName || typeof skillName !== "string") {
        return { success: false, error: "Invalid skill name" };
      }

      const label = this._getLabel(userId);
      const currentList = await this.get(userId);

      if (currentList.includes(skillName)) {
        return { success: true, error: null };
      }

      const newList = [...currentList, skillName];

      await prisma.system_settings.upsert({
        where: { label },
        update: { value: JSON.stringify(newList) },
        create: { label, value: JSON.stringify(newList) },
      });

      return { success: true, error: null };
    } catch (error) {
      console.error("AgentSkillWhitelist.add error:", error.message);
      return { success: false, error: error.message };
    }
  },

  /**
   * Check if a skill is whitelisted
   * @param {string} skillName - The skill name to check
   * @param {number|null} userId - User ID in multi-user mode, null for single-user
   * @returns {Promise<boolean>}
   */
  isWhitelisted: async function (skillName, userId = null) {
    const whitelist = await this.get(userId);
    return whitelist.includes(skillName);
  },

  /**
   * Clear the single-user whitelist (used when switching to multi-user mode)
   * @returns {Promise<{success: boolean, error: string|null}>}
   */
  clearSingleUserWhitelist: async function () {
    try {
      await prisma.system_settings.deleteMany({
        where: { label: this.SINGLE_USER_LABEL },
      });
      return { success: true, error: null };
    } catch (error) {
      console.error(
        "AgentSkillWhitelist.clearSingleUserWhitelist error:",
        error.message
      );
      return { success: false, error: error.message };
    }
  },
};

module.exports = { AgentSkillWhitelist };
