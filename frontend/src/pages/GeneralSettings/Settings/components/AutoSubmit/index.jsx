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
    <div className="my-4">
      <Toggle
        size="md"
        variant="horizontal"
        enabled={autoSubmitSttInput}
        onChange={handleChange}
        disabled={saving}
        label={t("customization.chat.auto_submit.title")}
        description={t("customization.chat.auto_submit.description")}
      />
    </div>
  );
}
