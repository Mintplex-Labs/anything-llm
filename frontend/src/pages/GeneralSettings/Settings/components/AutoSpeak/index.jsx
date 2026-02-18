import React, { useState, useEffect } from "react";
import Appearance from "@/models/appearance";
import { useTranslation } from "react-i18next";
import Toggle from "@/components/lib/Toggle";

export default function AutoSpeak() {
  const [saving, setSaving] = useState(false);
  const [autoPlayAssistantTtsResponse, setAutoPlayAssistantTtsResponse] =
    useState(false);
  const { t } = useTranslation();

  const handleChange = async (checked) => {
    setAutoPlayAssistantTtsResponse(checked);
    setSaving(true);
    try {
      Appearance.updateSettings({ autoPlayAssistantTtsResponse: checked });
    } catch (error) {
      console.error("Failed to update appearance settings:", error);
      setAutoPlayAssistantTtsResponse(!checked);
    }
    setSaving(false);
  };

  useEffect(() => {
    function fetchSettings() {
      const settings = Appearance.getSettings();
      setAutoPlayAssistantTtsResponse(
        settings.autoPlayAssistantTtsResponse ?? false
      );
    }
    fetchSettings();
  }, []);

  return (
    <div className="my-4">
      <Toggle
        size="md"
        variant="horizontal"
        enabled={autoPlayAssistantTtsResponse}
        onChange={handleChange}
        disabled={saving}
        label={t("customization.chat.auto_speak.title")}
        description={t("customization.chat.auto_speak.description")}
      />
    </div>
  );
}
