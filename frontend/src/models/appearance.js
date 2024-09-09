import { APPEARANCE_SETTINGS } from "@/utils/constants";

const Appearance = {
  getSettings: () => {
    const settings = localStorage.getItem(APPEARANCE_SETTINGS);
    return settings ? JSON.parse(settings) : { showScrollbar: false };
  },

  updateSettings: (newSettings) => {
    const currentSettings = Appearance.getSettings();
    const updatedSettings = { ...currentSettings, ...newSettings };
    localStorage.setItem(APPEARANCE_SETTINGS, JSON.stringify(updatedSettings));
    return updatedSettings;
  },
};

export default Appearance;