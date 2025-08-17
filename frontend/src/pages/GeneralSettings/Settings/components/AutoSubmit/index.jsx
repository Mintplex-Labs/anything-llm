import React, { useState, useEffect } from "react";
import Appearance from "@/models/appearance";
import { useTranslation } from "react-i18next";

export default function AutoSubmit() {
  const [saving, setSaving] = useState(false);
  const [autoSubmitSttInput, setAutoSubmitSttInput] = useState(true);
  const { t } = useTranslation();

  const handleChange = async (e) => {
    const newValue = e.target.checked;
    setAutoSubmitSttInput(newValue);
    setSaving(true);
    try {
      Appearance.updateSettings({ autoSubmitSttInput: newValue });
    } catch (error) {
      console.error("Failed to update appearance settings:", error);
      setAutoSubmitSttInput(!newValue);
    }
    setSaving(false);
  };

  useEffect(() => {
    function fetchSettings() {
      const settings = Appearance.getSettings();
      setAutoSubmitSttInput(settings.autoSubmitSttInput ?? true);
    }
    fetchSettings();
  }, []);

  return (
    <div className="onenew-card p-5 mb-4">
      <p className="text-[var(--text)] font-medium">
        {t("customization.chat.auto_submit.title")}
      </p>
      <p className="text-sm text-[var(--text-muted)]">
        {t("customization.chat.auto_submit.description")}
      </p>
      <div className="flex items-center gap-x-4 mt-2">
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            id="auto_submit"
            type="checkbox"
            name="auto_submit"
            value="yes"
            checked={autoSubmitSttInput}
            onChange={handleChange}
            disabled={saving}
            className="peer sr-only"
          />
          <div className="h-6 w-11 rounded-full bg-[color-mix(in_srgb,var(--accent),transparent_85%)] peer-checked:bg-[var(--accent)] transition-colors peer-focus-visible:[box-shadow:0_0_0_3px_var(--ring)] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-full"></div>
        </label>
      </div>
    </div>
  );
}
