import React, { useState, useEffect } from "react";
import Appearance from "@/models/appearance";
import { useTranslation } from "react-i18next";
import Toggle from "@/components/lib/Toggle";

export default function ShowScrollbar() {
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);
  const [showScrollbar, setShowScrollbar] = useState(false);

  const handleChange = async (checked) => {
    setShowScrollbar(checked);
    setSaving(true);
    try {
      Appearance.updateSettings({ showScrollbar: checked });
    } catch (error) {
      console.error("Failed to update appearance settings:", error);
      setShowScrollbar(!checked);
    }
    setSaving(false);
  };

  useEffect(() => {
    function fetchSettings() {
      const settings = Appearance.getSettings();
      setShowScrollbar(settings.showScrollbar);
    }
    fetchSettings();
  }, []);

  return (
    <div className="flex flex-col gap-y-0.5 my-4">
      <p className="text-sm leading-6 font-semibold text-white">
        {t("customization.items.show-scrollbar.title")}
      </p>
      <p className="text-xs text-white/60">
        {t("customization.items.show-scrollbar.description")}
      </p>
      <Toggle
        size="lg"
        enabled={showScrollbar}
        onChange={handleChange}
        disabled={saving}
      />
    </div>
  );
}
