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
    <div className="my-4">
      <Toggle
        size="md"
        variant="horizontal"
        enabled={renderHTML}
        onChange={handleChange}
        disabled={saving}
        label={t("customization.items.render-html.title")}
        description={t("customization.items.render-html.description")}
      />
    </div>
  );
}
