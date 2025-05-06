import { APPEARANCE_SETTINGS } from "@/utils/constants";

const Appearance = {
  defaultSettings: {
    showScrollbar: false,
    autoSubmitSttInput: true,
    autoPlayAssistantTtsResponse: false,
  },

  /**
   * Fetches any locally storage settings for the user
   * @returns {{showScrollbar: boolean}}
   */
  getSettings: () => {
    try {
      const settings = localStorage.getItem(APPEARANCE_SETTINGS);
      return settings ? JSON.parse(settings) : Appearance.defaultSettings;
    } catch (e) {
      return Appearance.defaultSettings;
    }
  },

  /**
   * Fetches a specific setting from the user's settings
   * @param {string} key - The key of the setting to fetch
   * @returns {any} - a default value if the setting is not found or the current value
   */
  get: (key) => {
    const settings = Appearance.getSettings();
    return settings.hasOwnProperty(key)
      ? settings[key]
      : Appearance.defaultSettings[key];
  },

  /**
   * Updates a specific setting from the user's settings
   * @param {string} key - The key of the setting to update
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
