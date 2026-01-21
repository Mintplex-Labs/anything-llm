import React, { useState, useEffect } from "react";
import Appearance from "@/models/appearance";
import { useTranslation } from "react-i18next";
import Toggle from "@/components/lib/Toggle";

export default function AutoSubmit() {
  const [saving, setSaving] = useState(false);
  const [autoSubmitSttInput, setAutoSubmitSttInput] = useState(true);
  const { t } = useTranslation();

  const handleChange = async (checked) => {
    setAutoSubmitSttInput(checked);
    setSaving(true);
    try {
      Appearance.updateSettings({ autoSubmitSttInput: checked });
    } catch (error) {
      console.error("Failed to update appearance settings:", error);
      setAutoSubmitSttInput(!checked);
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
    <div className="flex flex-col gap-y-0.5 my-4">
      <p className="text-sm leading-6 font-semibold text-white">
        {t("customization.chat.auto_submit.title")}
      </p>
      <p className="text-xs text-white/60">
        {t("customization.chat.auto_submit.description")}
      </p>
      <Toggle
        size="lg"
        enabled={autoSubmitSttInput}
        onChange={handleChange}
        disabled={saving}
      />
    </div>
  );
}
