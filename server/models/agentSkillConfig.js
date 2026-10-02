const prisma = require("../utils/prisma");
const { safeJsonParse } = require("../utils/http");

/**
 * @typedef {Object} AgentSkillConfigRow
 * @property {number} id
 * @property {string} skill
 * @property {number|null} workspaceId - null for the global row
 * @property {number|null} userId
 * @property {boolean} enabled
 * @property {string|null} config - JSON string
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} ResolvedSkillConfig
 * @property {boolean} enabled
 * @property {Object|null} config
 */

function toInt(v) {
  const n = Number(v);
  if (!Number.isInteger(n))
    throw new Error(`Expected integer, got ${JSON.stringify(v)}`);
  return n;
}

/**
 * Per-skill overrides of the built-in skill defaults. A global row (no workspace)
 * applies everywhere and a workspace row overrides it for that workspace. A workspace
 * row without a config inherits the global row's config.
 */
const AgentSkillConfig = {
  validations: {
    skill: (v) => {
      if (typeof v !== "string" || v.trim().length === 0)
        throw new Error("Skill must be a non-empty string");
      return v.trim();
    },
    workspaceId: (v = null) =>
      v === null || v === undefined ? null : toInt(v),
    enabled: (v) => v === true || v === "true",
    config: (v) => {
      if (v === null) return null;
      if (typeof v === "string") return JSON.stringify(JSON.parse(v));
      if (typeof v === "object") return JSON.stringify(v);
      throw new Error("Config must be an object or JSON string");
    },
  },

  /**
   * List the global rows, plus the rows for a workspace when one is given.
   * @param {Object} [params]
   * @param {number|null} [params.workspaceId]
   * @returns {Promise<AgentSkillConfigRow[]>}
   */
  where: async function ({ workspaceId = null } = {}) {
    try {
      workspaceId = this.validations.workspaceId(workspaceId);
      return await prisma.agent_skill_configs.findMany({
        where: {
          userId: null,
          OR: [
            { workspaceId: null },
            ...(workspaceId ? [{ workspaceId }] : []),
          ],
        },
      });
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  /**
   * Create or update the row for a skill. Fields left undefined keep their current value.
   * @param {Object} params
   * @param {string} params.skill
   * @param {number|null} [params.workspaceId] - null for the global row
   * @param {boolean} [params.enabled]
   * @param {Object|string|null} [params.config] - null clears the config
   * @returns {Promise<{config: AgentSkillConfigRow|null, error: string|null}>}
   */
  upsert: async function ({
    skill,
    workspaceId = null,
    enabled = undefined,
    config = undefined,
  }) {
    try {
      const where = {
        skill: this.validations.skill(skill),
        workspaceId: this.validations.workspaceId(workspaceId),
        userId: null,
      };
      const data = {};
      if (enabled !== undefined)
        data.enabled = this.validations.enabled(enabled);
      if (config !== undefined) data.config = this.validations.config(config);

      const existing = await prisma.agent_skill_configs.findFirst({ where });
      if (existing) {
        const updated = await prisma.agent_skill_configs.update({
          where: { id: existing.id },
          data: { ...data, updatedAt: new Date() },
        });
        return { config: updated, error: null };
      }

      const created = await prisma.agent_skill_configs.create({
        data: { ...where, ...data },
      });
      return { config: created, error: null };
    } catch (error) {
      return { config: null, error: error.message };
    }
  },

  /**
   * Delete the row for a skill so it falls back to the next level.
   * @param {Object} params
   * @param {string} params.skill
   * @param {number|null} [params.workspaceId] - null for the global row
   * @returns {Promise<boolean>}
   */
  delete: async function ({ skill, workspaceId = null }) {
    try {
      await prisma.agent_skill_configs.deleteMany({
        where: {
          skill: this.validations.skill(skill),
          workspaceId: this.validations.workspaceId(workspaceId),
          userId: null,
        },
      });
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  },

  /**
   * Resolve every skill that has a row applying to this workspace.
   * Skills with no rows are absent and use their built-in default.
   * @param {Object} [params]
   * @param {number|null} [params.workspaceId]
   * @returns {Promise<Object<string, ResolvedSkillConfig>>}
   */
  resolveAll: async function ({ workspaceId = null } = {}) {
    const rows = await this.where({ workspaceId });
    rows.sort((a, b) => (a.workspaceId ? 1 : 0) - (b.workspaceId ? 1 : 0));

    const resolved = {};
    for (const row of rows) {
      resolved[row.skill] = {
        enabled: row.enabled,
        config: row.config
          ? safeJsonParse(row.config, null)
          : resolved[row.skill]?.config ?? null,
      };
    }
    return resolved;
  },

  /**
   * Resolve a single skill's config for a workspace.
   * @param {Object} params
   * @param {string} params.skill
   * @param {number|null} [params.workspaceId]
   * @returns {Promise<Object|null>}
   */
  configFor: async function ({ skill, workspaceId = null }) {
    const resolved = await this.resolveAll({ workspaceId });
    return resolved[skill]?.config ?? null;
  },
};

module.exports = { AgentSkillConfig };
