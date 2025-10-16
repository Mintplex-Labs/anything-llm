import React, { useState, useEffect } from "react";
import Appearance from "@/models/appearance";
import { useTranslation } from "react-i18next";

export default function ChatRenderHTML() {
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);
  const [renderHTML, setRenderHTML] = useState(false);

  const handleChange = async (e) => {
    const newValue = e.target.checked;
    setRenderHTML(newValue);
    setSaving(true);
    try {
      Appearance.updateSettings({ renderHTML: newValue });
    } catch (error) {
      console.error("Failed to update appearance settings:", error);
      setRenderHTML(!newValue);
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
      <div className="flex items-center gap-x-4 pt-1">
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            id="render_html"
            type="checkbox"
            name="render_html"
            value="yes"
            checked={renderHTML}
            onChange={handleChange}
            disabled={saving}
            className="peer sr-only"
          />
          <div className="pointer-events-none peer h-6 w-11 rounded-full bg-[#CFCFD0] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:shadow-xl after:border-none after:bg-white after:box-shadow-md after:transition-all after:content-[''] peer-checked:bg-[#32D583] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-transparent"></div>
        </label>
      </div>
    </div>
  );
}
