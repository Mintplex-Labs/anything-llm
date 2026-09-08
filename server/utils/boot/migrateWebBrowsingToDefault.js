const { SystemSettings } = require("../../models/systemSettings");
const { safeJsonParse } = require("../http");

const WEB_BROWSING_SKILL = "web-browsing";
const MIGRATION_LABEL = "__migration_web_browser_to_default";

/**
 * One-time boot migration for moving `web-browsing` from an opt-in configurable
 * skill to a default-enabled skill.
 *
 * Existing instances must keep the exact behavior they had before upgrading:
 * - If they had opted into web-browsing (present in `default_agent_skills`) we remove
 *   it from that list since it is now on by default.
 * - If they had not opted in, we add it to `disabled_agent_skills` so the skill does
 *   not silently appear for them.
 *
 * Fresh instances (onboarding not complete) get the new default with no changes.
 *
 * IMPORTANT: this must run BEFORE `markOnboarded()` on boot. A fresh install can ship
 * with env vars (JWT_SECRET, VECTOR_DB, etc.) that make the legacy onboarding patch mark
 * the instance as onboarded on its very first boot, which would otherwise make this job
 * treat a brand-new instance as an existing one and disable web-browsing for it. Reading
 * `onboarding_complete` first means it only reflects the onboarding UI or a prior boot.
 * The `__migration_web_browser_to_default` system setting is written once the job has
 * run so it is skipped on every subsequent boot.
 * @returns {Promise<boolean>} true if the migration was executed on this boot.
 */
async function migrateWebBrowsingToDefault() {
  try {
    const alreadyRan = await SystemSettings.get({ label: MIGRATION_LABEL });
    if (!!alreadyRan) return false;

    // Fresh install - nothing to migrate, but mark as ran so that we never
    // touch this instance's settings once onboarding completes later on.
    const onboarded = await SystemSettings.isOnboardingComplete();
    if (onboarded !== true) {
      await markMigrationComplete();
      return false;
    }

    const enabledSkills = safeJsonParse(
      await SystemSettings.getValueOrFallback(
        { label: "default_agent_skills" },
        "[]"
      ),
      []
    );

    if (enabledSkills.includes(WEB_BROWSING_SKILL)) {
      await SystemSettings._updateSettings({
        default_agent_skills: enabledSkills
          .filter((skill) => skill !== WEB_BROWSING_SKILL)
          .join(","),
      });
      console.log(
        `\x1b[33m[WEB BROWSING MIGRATION]\x1b[0m ${WEB_BROWSING_SKILL} is now a default skill - removed from configured skills. You will not see this message again.`
      );
    } else {
      const disabledSkills = safeJsonParse(
        await SystemSettings.getValueOrFallback(
          { label: "disabled_agent_skills" },
          "[]"
        ),
        []
      );
      if (!disabledSkills.includes(WEB_BROWSING_SKILL))
        await SystemSettings._updateSettings({
          disabled_agent_skills: [...disabledSkills, WEB_BROWSING_SKILL].join(
            ","
          ),
        });
      console.log(
        `\x1b[33m[WEB BROWSING MIGRATION]\x1b[0m ${WEB_BROWSING_SKILL} is now a default skill but was not previously enabled on this instance - it has been disabled to preserve existing behavior. You will not see this message again.`
      );
    }

    await markMigrationComplete();
    return true;
  } catch (e) {
    console.error(
      "\x1b[31m[WEB BROWSING MIGRATION]\x1b[0m Error migrating web-browsing to a default skill",
      e.message,
      e
    );
    return false;
  }
}

async function markMigrationComplete() {
  await SystemSettings._updateSettings({ [MIGRATION_LABEL]: "true" });
}

module.exports = migrateWebBrowsingToDefault;
