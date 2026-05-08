import { getCreateFileSkills } from "@/pages/Admin/Agents/CreateFileSkillPanel";
import { getFileSystemSubSkills } from "@/pages/Admin/Agents/FileSystemSkillPanel";
import { getGmailSkills } from "@/pages/Admin/Agents/GMailSkillPanel/utils";
import { getGoogleCalendarSkills } from "@/pages/Admin/Agents/GoogleCalendarSkillPanel/utils";
import { getOutlookSkills } from "@/pages/Admin/Agents/OutlookSkillPanel/utils";

/**
 * Flattens categorized skills (used by app integrations) into a flat array.
 */
function flattenCategorySkills(categorizedSkills) {
  return Object.values(categorizedSkills).flatMap(
    (category) => category.skills
  );
}

/**
 * Registry of all skills that have sub-skills.
 * Each entry maps a skill key to its configuration:
 * - preferenceKey: The system preference key for storing disabled sub-skills
 * - getSubSkills: Function that returns the sub-skills array (receives translation function)
 *
 * To add a new skill with sub-skills:
 * 1. Add an entry here with the skill key, preference key, and getter function
 * 2. The rest is handled automatically by useSubSkillPreferences hook
 */
export const SUB_SKILL_REGISTRY = {
  "create-files-agent": {
    preferenceKey: "disabled_create_files_skills",
    getSubSkills: (t) => getCreateFileSkills(t),
  },
  "filesystem-agent": {
    preferenceKey: "disabled_filesystem_skills",
    getSubSkills: (t) => getFileSystemSubSkills(t),
  },
  "gmail-agent": {
    preferenceKey: "disabled_gmail_skills",
    getSubSkills: (t) => flattenCategorySkills(getGmailSkills(t)),
  },
  "google-calendar-agent": {
    preferenceKey: "disabled_google_calendar_skills",
    getSubSkills: (t) => flattenCategorySkills(getGoogleCalendarSkills(t)),
  },
  "outlook-agent": {
    preferenceKey: "disabled_outlook_skills",
    getSubSkills: (t) => flattenCategorySkills(getOutlookSkills(t)),
  },
};

/**
 * Get all preference keys that need to be fetched for sub-skills.
 */
export function getSubSkillPreferenceKeys() {
  return Object.values(SUB_SKILL_REGISTRY).map(
    (config) => config.preferenceKey
  );
}

/**
 * Get sub-skills for a given skill key.
 * Returns null if the skill has no sub-skills.
 */
export function getSubSkillsForSkill(skillKey, t) {
  const config = SUB_SKILL_REGISTRY[skillKey];
  if (!config) return null;
  return config.getSubSkills(t);
}

/**
 * Get the preference key for a skill's sub-skills.
 * Returns null if the skill has no sub-skills.
 */
export function getPreferenceKeyForSkill(skillKey) {
  return SUB_SKILL_REGISTRY[skillKey]?.preferenceKey ?? null;
}

/**
 * Check if a skill has sub-skills.
 */
export function hasSubSkills(skillKey) {
  return skillKey in SUB_SKILL_REGISTRY;
}
