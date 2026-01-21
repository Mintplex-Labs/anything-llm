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
    <div className="flex flex-col gap-y-0.5 my-4">
      <p className="text-sm leading-6 font-semibold text-white">
        {t("customization.chat.auto_speak.title")}
      </p>
      <p className="text-xs text-white/60">
        {t("customization.chat.auto_speak.description")}
      </p>
      <Toggle
        size="lg"
        enabled={autoPlayAssistantTtsResponse}
        onChange={handleChange}
        disabled={saving}
      />
    </div>
  );
}
