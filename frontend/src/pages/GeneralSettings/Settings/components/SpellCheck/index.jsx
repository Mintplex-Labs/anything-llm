import React, { useState, useEffect } from "react";
import Appearance from "@/models/appearance";
import { useTranslation } from "react-i18next";

export default function SpellCheck() {
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);
  const [enableSpellCheck, setEnableSpellCheck] = useState(
    Appearance.get("enableSpellCheck")
  );

  const handleChange = async (e) => {
    const newValue = e.target.checked;
    setEnableSpellCheck(newValue);
    setSaving(true);
    try {
      Appearance.set("enableSpellCheck", newValue);
    } catch (error) {
      console.error("Failed to update appearance settings:", error);
      setEnableSpellCheck(!newValue);
    }
    setSaving(false);
  };

  return (
    <div className="onenew-card p-5 mb-4">
      <p className="text-[var(--text)] font-medium">
        {t("customization.chat.spellcheck.title")}
      </p>
      <p className="text-sm text-[var(--text-muted)]">
        {t("customization.chat.spellcheck.description")}
      </p>
      <div className="flex items-center gap-x-4 mt-2">
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            id="spellcheck"
            type="checkbox"
            name="spellcheck"
            value="yes"
            checked={enableSpellCheck}
            onChange={handleChange}
            disabled={saving}
            className="peer sr-only"
          />
          <div className="h-6 w-11 rounded-full bg-[color-mix(in_srgb,var(--accent),transparent_85%)] peer-checked:bg-[var(--accent)] transition-colors peer-focus-visible:[box-shadow:0_0_0_3px_var(--ring)] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-card after:transition-transform peer-checked:after:translate-x-full"></div>
        </label>
      </div>
    </div>
  );
}
