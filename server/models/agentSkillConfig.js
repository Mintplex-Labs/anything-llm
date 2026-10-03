const prisma = require("../utils/prisma");
const { safeJsonParse } = require("../utils/http");

/**
 * @typedef {Object} AgentSkillConfigRow
 * @property {number} id
 * @property {string} skill
 * @property {number|null} workspaceId
 * @property {number|null} userId
 * @property {boolean} enabled
 * @property {boolean} personal - true when the user set it for themselves
 * @property {string|null} config - JSON string
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} ResolvedSkillConfig
 * @property {boolean|null} enabled - set by an admin level, null when no admin row exists
 * @property {boolean} optedOut - the user disabled it for themselves
 * @property {Object|null} sharedConfig - config from the most specific admin level
 * @property {Object|null} personalConfig - config the user set for themselves
 */

/**
 * @typedef {Object} SkillConfigTarget
 * @property {number|null} [workspaceId]
 * @property {number|null} [userId]
 * @property {boolean} [personal]
 */

function toInt(v) {
  const n = Number(v);
  if (!Number.isInteger(n))
    throw new Error(`Expected integer, got ${JSON.stringify(v)}`);
  return n;
}

/**
 * Overrides of the built-in skill defaults, from least to most specific:
 * global (no workspace or user), a workspace, a user assigned by an admin, and
 * the user's own personal row. Admin levels decide whether a skill is enabled and
 * the most specific one wins. A personal row can only opt the user out. Config
 * comes from the most specific admin level that has one, and a personal config is
 * only used when no admin level set a config.
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
    userId: (v = null) => (v === null || v === undefined ? null : toInt(v)),
    enabled: (v) => v === true || v === "true",
    config: (v) => {
      if (v === null) return null;
      const parsed = typeof v === "string" ? JSON.parse(v) : v;
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
        throw new Error("Config must be an object");
      return parsed;
    },
    target: ({ workspaceId = null, userId = null, personal = false } = {}) => {
      const target = {
        workspaceId: AgentSkillConfig.validations.workspaceId(workspaceId),
        userId: AgentSkillConfig.validations.userId(userId),
        personal: personal === true,
      };
      if (target.workspaceId && target.userId)
        throw new Error("Target a workspace or a user, not both");
      if (target.personal && !target.userId)
        throw new Error("Personal configs require a user");
      if (target.personal && target.workspaceId)
        throw new Error("Personal configs cannot target a workspace");
      return target;
    },
  },

  /**
   * List rows matching a Prisma where clause.
   * @param {Object} [clause]
   * @returns {Promise<AgentSkillConfigRow[]>}
   */
  where: async function (clause = {}) {
    try {
      return await prisma.agent_skill_configs.findMany({ where: clause });
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  /**
   * Create or update the row for a skill at a target. Fields left undefined keep their
   * current value. A config object is merged into the existing config, skipping masked
   * (all `*`) values so secrets round-trip from the UI untouched. A null config clears it.
   * @param {Object} params
   * @param {string} params.skill
   * @param {SkillConfigTarget} [params.target]
   * @param {boolean} [params.enabled]
   * @param {Object|string|null} [params.config]
   * @returns {Promise<{config: AgentSkillConfigRow|null, error: string|null}>}
   */
  upsert: async function ({
    skill,
    target = {},
    enabled = undefined,
    config = undefined,
  }) {
    try {
      const where = {
        skill: this.validations.skill(skill),
        ...this.validations.target(target),
      };
      const existing = await prisma.agent_skill_configs.findFirst({ where });

      const data = {};
      if (enabled !== undefined)
        data.enabled = this.validations.enabled(enabled);
      if (config === null) data.config = null;
      if (config !== undefined && config !== null) {
        const merged = safeJsonParse(existing?.config, {}) || {};
        for (const [key, value] of Object.entries(
          this.validations.config(config)
        )) {
          if (typeof value === "string" && /^\*+$/.test(value)) continue;
          merged[key] = value;
        }
        data.config = JSON.stringify(merged);
      }

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
   * Delete the row for a skill at a target so it falls back to the next level.
   * @param {Object} params
   * @param {string} params.skill
   * @param {SkillConfigTarget} [params.target]
   * @returns {Promise<boolean>}
   */
  delete: async function ({ skill, target = {} }) {
    try {
      await prisma.agent_skill_configs.deleteMany({
        where: {
          skill: this.validations.skill(skill),
          ...this.validations.target(target),
        },
      });
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  },

  /**
   * Resolve every skill that has a row applying to this workspace and user.
   * Skills with no rows are absent and use their built-in default.
   * @param {Object} [params]
   * @param {number|null} [params.workspaceId]
   * @param {number|null} [params.userId]
   * @returns {Promise<Object<string, ResolvedSkillConfig>>}
   */
  resolveAll: async function ({ workspaceId = null, userId = null } = {}) {
    try {
      workspaceId = this.validations.workspaceId(workspaceId);
      userId = this.validations.userId(userId);
      const rows = await this.where({
        OR: [
          { workspaceId: null, userId: null },
          ...(workspaceId ? [{ workspaceId, userId: null }] : []),
          ...(userId ? [{ workspaceId: null, userId }] : []),
        ],
      });

      const level = (row) =>
        row.personal ? 3 : row.userId ? 2 : row.workspaceId ? 1 : 0;
      rows.sort((a, b) => level(a) - level(b));

      const resolved = {};
      for (const row of rows) {
        const current = resolved[row.skill] ?? {
          enabled: null,
          optedOut: false,
          sharedConfig: null,
          personalConfig: null,
        };
        const config = row.config ? safeJsonParse(row.config, null) : null;
        if (row.personal) {
          current.optedOut = !row.enabled;
          current.personalConfig = config;
        } else {
          current.enabled = row.enabled;
          if (config) current.sharedConfig = config;
        }
        resolved[row.skill] = current;
      }
      return resolved;
    } catch (error) {
      console.error(error.message);
      return {};
    }
  },

  /**
   * Resolve the config a skill should run with for a workspace and user.
   * @param {Object} params
   * @param {string} params.skill
   * @param {number|null} [params.workspaceId]
   * @param {number|null} [params.userId]
   * @returns {Promise<Object|null>}
   */
  configFor: async function ({ skill, workspaceId = null, userId = null }) {
    const resolved = (await this.resolveAll({ workspaceId, userId }))[skill];
    return resolved?.sharedConfig ?? resolved?.personalConfig ?? null;
  },
};

module.exports = { AgentSkillConfig };
