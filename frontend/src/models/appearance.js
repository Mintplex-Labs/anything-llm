import { APPEARANCE_SETTINGS } from "@/utils/constants";

const Appearance = {
  /**
   * Fetches any locally storage settings for the user
   * @returns {{showScrollbar: boolean}}
   */
  getSettings: () => {
    const settings = localStorage.getItem(APPEARANCE_SETTINGS);
    return settings ? JSON.parse(settings) : { showScrollbar: false };
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
