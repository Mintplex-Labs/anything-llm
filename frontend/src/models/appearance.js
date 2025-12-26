import { APPEARANCE_SETTINGS } from "@/utils/constants";
import { safeJsonParse } from "@/utils/request";

/**
 * @typedef { 'showScrollbar' |
 * 'autoSubmitSttInput' |
 * 'autoPlayAssistantTtsResponse' |
 * 'enableSpellCheck' |
 * 'renderHTML'
 * } AvailableSettings - The supported settings for the appearance model.
 */

const Appearance = {
  defaultSettings: {
    showScrollbar: false,
    autoSubmitSttInput: true,
    autoPlayAssistantTtsResponse: false,
    enableSpellCheck: true,
    renderHTML: false,
  },

  /**
   * Fetches any locally storage settings for the user
   * @returns {{showScrollbar: boolean, autoSubmitSttInput: boolean, autoPlayAssistantTtsResponse: boolean, enableSpellCheck: boolean, renderHTML: boolean}}
   */
  getSettings: () => {
    const settings = localStorage.getItem(APPEARANCE_SETTINGS);
    return safeJsonParse(settings, Appearance.defaultSettings);
  },

  /**
   * Fetches a specific setting from the user's settings
   * @param {AvailableSettings} key - The key of the setting to fetch
   * @returns {boolean} - a default value if the setting is not found or the current value
   */
  get: (key) => {
    const settings = Appearance.getSettings();
    return settings.hasOwnProperty(key)
      ? settings[key]
      : Appearance.defaultSettings[key];
  },

  /**
   * Updates a specific setting from the user's settings
   * @param {AvailableSettings} key - The key of the setting to update
   * @param {any} value - The value to update the setting to
   * @returns {object}
   */
  set: (key, value) => {
    const settings = Appearance.getSettings();
    settings[key] = value;
    Appearance.updateSettings(settings);
    return settings;
  },

  /**
   * Updates locally stored user settings
   * @param {object} newSettings - new settings to update.
   * @returns {object}
   */
  updateSettings: (newSettings) => {
    const updatedSettings = { ...Appearance.getSettings(), ...newSettings };
    localStorage.setItem(APPEARANCE_SETTINGS, JSON.stringify(updatedSettings));
    return updatedSettings;
  },
};

export default Appearance;
