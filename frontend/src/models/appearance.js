import { APPEARANCE_SETTINGS } from "@/utils/constants";

const Appearance = {
  defaultSettings: { showScrollbar: false },
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
