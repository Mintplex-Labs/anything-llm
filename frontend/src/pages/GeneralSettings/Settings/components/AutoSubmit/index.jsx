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
    <div className="flex flex-col gap-y-0.5 my-4">
      <p className="text-sm leading-6 font-semibold text-white">
        {t("customization.chat.auto_submit.title")}
      </p>
      <p className="text-xs text-white/60">
        {t("customization.chat.auto_submit.description")}
      </p>
      <div className="flex items-center gap-x-4">
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
          <div className="pointer-events-none peer h-6 w-11 rounded-full bg-[#CFCFD0] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:shadow-xl after:border-none after:bg-white after:box-shadow-md after:transition-all after:content-[''] peer-checked:bg-[#32D583] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-transparent"></div>
        </label>
      </div>
    </div>
  );
}
