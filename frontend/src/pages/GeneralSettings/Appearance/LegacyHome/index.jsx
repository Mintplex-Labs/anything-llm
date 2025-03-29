import React, { useState, useEffect } from "react";
import Appearance from "@/models/appearance";

export default function LegacyHome() {
  const [saving, setSaving] = useState(false);
  const [showLegacyHome, setShowLegacyHome] = useState(false);

  const handleChange = async (e) => {
    const newValue = e.target.checked;
    setShowLegacyHome(newValue);
    setSaving(true);
    try {
      Appearance.updateSettings({ legacyHomeScreen: newValue });
      window.location.reload();
    } catch (error) {
      console.error("Failed to update appearance settings:", error);
      setShowLegacyHome(!newValue);
    }
    setSaving(false);
  };

  useEffect(() => {
    function fetchSettings() {
      const settings = Appearance.getSettings();
      setShowLegacyHome(settings.legacyHomeScreen);
    }
    fetchSettings();
  }, []);

  return (
    <div className="flex flex-col w-full gap-y-4 mb-8">
      <div className="flex flex-col gap-y-1">
        <h2 className="text-base leading-6 font-bold text-white">
          Show Legacy Home Screen
        </h2>
        <p className="text-xs leading-[18px] font-base text-white/60">
          Enable or disable the legacy home screen with custom messages.
        </p>
        <div className="mt-2">
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              id="show_legacy_home"
              type="checkbox"
              name="show_legacy_home"
              value="yes"
              checked={showLegacyHome}
              onChange={handleChange}
              disabled={saving}
              className="peer sr-only"
            />
            <div className="pointer-events-none peer h-6 w-11 rounded-full bg-[#CFCFD0] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:shadow-xl after:border-none after:bg-white after:box-shadow-md after:transition-all after:content-[''] peer-checked:bg-[#32D583] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-transparent"></div>
          </label>
        </div>
      </div>
    </div>
  );
}
