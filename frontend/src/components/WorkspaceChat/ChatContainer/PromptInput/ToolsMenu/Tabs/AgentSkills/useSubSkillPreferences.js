import { useState, useCallback } from "react";
import { SUB_SKILL_REGISTRY, getPreferenceKeyForSkill } from "./skillRegistry";

/**
 * Hook to read the instance-wide sub-skill preferences for all skills in the registry.
 *
 * This hook eliminates the need for separate state variables for each skill's
 * sub-skills. Adding a new skill with sub-skills only requires updating the
 * skillRegistry.js file.
 */
export default function useSubSkillPreferences() {
  // Single state object holding disabled sub-skills for all skills
  // Key: preferenceKey, Value: array of disabled sub-skill names
  const [disabledSubSkills, setDisabledSubSkills] = useState({});

  /**
   * Load sub-skill preferences from settings object.
   * Called after fetching system preferences.
   */
  const loadFromSettings = useCallback((settings) => {
    if (!settings) return;

    const loaded = {};
    for (const [, config] of Object.entries(SUB_SKILL_REGISTRY)) {
      const value = settings[config.preferenceKey];
      loaded[config.preferenceKey] = value ?? [];
    }
    setDisabledSubSkills(loaded);
  }, []);

  /**
   * Check if a sub-skill is enabled for a given skill.
   */
  const isSubSkillEnabled = useCallback(
    (skillKey, subSkillName) => {
      const prefKey = getPreferenceKeyForSkill(skillKey);
      if (!prefKey) return true;

      const disabled = disabledSubSkills[prefKey] ?? [];
      return !disabled.includes(subSkillName);
    },
    [disabledSubSkills]
  );

  return {
    loadFromSettings,
    isSubSkillEnabled,
  };
}
