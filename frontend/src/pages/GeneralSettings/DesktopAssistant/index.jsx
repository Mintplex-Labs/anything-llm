import { useState, useEffect } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import DesktopAssistant from "@/models/desktopAssistant";
import { SHORTCUT_MODIFIERS } from "@/models/desktopAssistant";
import Toggle from "@/components/lib/Toggle";
import { isMac } from "@/utils/keyboardShortcuts";

const MODIFIER_LABELS = {
  ctrl: { win: "Ctrl", mac: "Control" },
  alt: { win: "Alt", mac: "Option" },
  meta: { win: "Meta", mac: "Cmd" },
};

function getModifierLabel(value) {
  const labels = MODIFIER_LABELS[value];
  if (!labels) return value;
  return isMac ? labels.mac : labels.win;
}

export default function DesktopAssistantSettings() {
  const { t } = useTranslation();
  const [enabled, setEnabled] = useState(true);
  const [shortcutEnabled, setShortcutEnabled] = useState(true);
  const [shortcutModifier, setShortcutModifier] = useState(() =>
    DesktopAssistant.getSettings().shortcutModifier
  );

  useEffect(() => {
    const settings = DesktopAssistant.getSettings();
    setEnabled(settings.enabled);
    setShortcutEnabled(settings.shortcutEnabled);
    setShortcutModifier(settings.shortcutModifier);
  }, []);

  function handleEnabledChange(checked) {
    setEnabled(checked);
    DesktopAssistant.updateSettings({ enabled: checked });
  }

  function handleShortcutEnabledChange(checked) {
    setShortcutEnabled(checked);
    DesktopAssistant.updateSettings({ shortcutEnabled: checked });
  }

  function handleModifierChange(e) {
    const value = e.target.value;
    setShortcutModifier(value);
    DesktopAssistant.updateSettings({ shortcutModifier: value });
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-0"
      >
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[86px] md:py-6 py-16">
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white light:border-theme-sidebar-border border-b-2 border-opacity-10">
            <p className="text-lg leading-6 font-bold text-white">
              {t("desktop-assistant.title")}
            </p>
            <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
              {t("desktop-assistant.description")}
            </p>
          </div>

          <div className="flex flex-col gap-y-6 mt-6">
            <Toggle
              size="md"
              variant="horizontal"
              enabled={enabled}
              onChange={handleEnabledChange}
              label={t("desktop-assistant.enabled.title")}
              description={t("desktop-assistant.enabled.description")}
            />

            <Toggle
              size="md"
              variant="horizontal"
              enabled={shortcutEnabled}
              onChange={handleShortcutEnabledChange}
              disabled={!enabled}
              label={t("desktop-assistant.shortcut-enabled.title")}
              description={t("desktop-assistant.shortcut-enabled.description")}
            />

            <div className="flex flex-col gap-y-0.5">
              <p className="text-sm leading-6 font-semibold text-white">
                {t("desktop-assistant.shortcut-modifier.title")}
              </p>
              <p className="text-xs text-white/60">
                {t("desktop-assistant.shortcut-modifier.description")}
              </p>
              <select
                value={shortcutModifier}
                onChange={handleModifierChange}
                disabled={!enabled || !shortcutEnabled}
                className="border-none bg-theme-settings-input-bg mt-2 text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-fit py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {SHORTCUT_MODIFIERS.map((mod) => (
                  <option key={mod} value={mod}>
                    {getModifierLabel(mod)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
