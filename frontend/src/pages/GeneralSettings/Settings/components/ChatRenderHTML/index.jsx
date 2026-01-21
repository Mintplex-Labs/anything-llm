import React, { useState, useEffect } from "react";
import Appearance from "@/models/appearance";
import { useTranslation } from "react-i18next";
import Toggle from "@/components/lib/Toggle";

export default function ChatRenderHTML() {
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);
  const [renderHTML, setRenderHTML] = useState(false);

  const handleChange = async (checked) => {
    setRenderHTML(checked);
    setSaving(true);
    try {
      Appearance.updateSettings({ renderHTML: checked });
    } catch (error) {
      console.error("Failed to update appearance settings:", error);
      setRenderHTML(!checked);
    }
    setSaving(false);
  };

  useEffect(() => {
    function fetchSettings() {
      const settings = Appearance.getSettings();
      setRenderHTML(settings.renderHTML);
    }
    fetchSettings();
  }, []);

  return (
    <div className="flex flex-col gap-y-0.5 my-4">
      <p className="text-sm leading-6 font-semibold text-white">
        {t("customization.items.render-html.title")}
      </p>
      <p className="text-xs text-white/60 w-1/2 whitespace-pre-line">
        {t("customization.items.render-html.description")}
      </p>
      <div className="pt-1">
        <Toggle
          size="lg"
          enabled={renderHTML}
          onChange={handleChange}
          disabled={saving}
        />
      </div>
    </div>
  );
}
