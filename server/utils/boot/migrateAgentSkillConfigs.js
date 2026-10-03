const { SystemSettings } = require("../../models/systemSettings");
const { AgentSkillConfig } = require("../../models/agentSkillConfig");
const { isBuiltInSkill } = require("../agents/defaults");
const { safeJsonParse } = require("../http");

const MIGRATION_LABEL = "__migration_agent_skill_configs";
const LEGACY_DISABLED_SUB_SKILL_LABELS = [
  "disabled_filesystem_skills",
  "disabled_create_files_skills",
  "disabled_gmail_skills",
  "disabled_outlook_skills",
  "disabled_google_calendar_skills",
];

/**
 * One-time boot migration that copies the legacy agent skill system settings
 * (`default_agent_skills`, `disabled_agent_skills` and the `disabled_*_skills`
 * sub-skill lists) into global `agent_skill_configs` rows, which are now the
 * source of truth for which built-in skills are enabled.
 *
 * The legacy settings are left in place so a downgrade keeps working. The
 * `__migration_agent_skill_configs` system setting is written once the job has
 * run so it is skipped on every subsequent boot. Must run after
 * `migrateWebBrowsingToDefault()` since that job rewrites the legacy lists.
 * @returns {Promise<boolean>} true if the migration was executed on this boot.
 */
async function migrateAgentSkillConfigs() {
  try {
    const alreadyRan = await SystemSettings.get({ label: MIGRATION_LABEL });
    if (!!alreadyRan) return false;

    const readList = async (label) =>
      safeJsonParse(
        await SystemSettings.getValueOrFallback({ label }, "[]"),
        []
      );
    const [enabledSkills, disabledSkills, ...disabledSubSkills] =
      await Promise.all([
        readList("default_agent_skills"),
        readList("disabled_agent_skills"),
        ...LEGACY_DISABLED_SUB_SKILL_LABELS.map(readList),
      ]);

    const rows = [
      ...enabledSkills.map((skill) => ({ skill, enabled: true })),
      ...[...disabledSkills, ...disabledSubSkills.flat()].map((skill) => ({
        skill,
        enabled: false,
      })),
    ].filter(({ skill }) => isBuiltInSkill(skill));

    for (const row of rows) {
      const { error } = await AgentSkillConfig.upsert(row);
      if (error) throw new Error(error);
    }

    await SystemSettings._updateSettings({ [MIGRATION_LABEL]: "true" });
    if (rows.length > 0)
      console.log(
        `\x1b[33m[AGENT SKILL CONFIG MIGRATION]\x1b[0m Migrated ${rows.length} agent skill setting(s). You will not see this message again.`
      );
    return true;
  } catch (e) {
    console.error(
      "\x1b[31m[AGENT SKILL CONFIG MIGRATION]\x1b[0m Error migrating agent skill settings",
      e.message,
      e
    );
    return false;
  }
}

module.exports = migrateAgentSkillConfigs;
