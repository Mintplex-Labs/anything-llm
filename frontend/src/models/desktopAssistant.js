import { DESKTOP_ASSISTANT_SETTINGS } from "@/utils/constants";
import { safeJsonParse } from "@/utils/request";

const SHORTCUT_MODIFIERS = ["ctrl", "alt", "meta"];

function getDefaultModifier() {
  if (typeof navigator === "undefined") return "ctrl";
  return navigator.platform.toUpperCase().indexOf("MAC") >= 0 ? "meta" : "ctrl";
}

const DesktopAssistant = {
  getSettings: () => {
    const raw = localStorage.getItem(DESKTOP_ASSISTANT_SETTINGS);
    const settings = safeJsonParse(raw, {});
    return {
      enabled: settings.enabled ?? true,
      shortcutEnabled: settings.shortcutEnabled ?? true,
      shortcutModifier: settings.shortcutModifier ?? getDefaultModifier(),
    };
  },

  updateSettings: (newSettings) => {
    const updated = {
      ...DesktopAssistant.getSettings(),
      ...newSettings,
    };
    if (
      updated.shortcutModifier &&
      !SHORTCUT_MODIFIERS.includes(updated.shortcutModifier)
    ) {
      updated.shortcutModifier = getDefaultModifier();
    }
    localStorage.setItem(DESKTOP_ASSISTANT_SETTINGS, JSON.stringify(updated));
    return updated;
  },
};

export default DesktopAssistant;
export { SHORTCUT_MODIFIERS };
