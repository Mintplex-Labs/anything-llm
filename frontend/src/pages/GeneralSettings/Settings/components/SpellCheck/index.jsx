import React, { useState, useEffect } from "react";
import Appearance from "@/models/appearance";
import { useTranslation } from "react-i18next";
import Toggle from "@/components/lib/Toggle";

export default function SpellCheck() {
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);
  const [enableSpellCheck, setEnableSpellCheck] = useState(
    Appearance.get("enableSpellCheck")
  );

  const handleChange = async (checked) => {
    setEnableSpellCheck(checked);
    setSaving(true);
    try {
      Appearance.set("enableSpellCheck", checked);
    } catch (error) {
      console.error("Failed to update appearance settings:", error);
      setEnableSpellCheck(!checked);
    }
    setSaving(false);
  };

  return (
    <div className="flex flex-col gap-y-0.5 my-4">
      <p className="text-sm leading-6 font-semibold text-white">
        {t("customization.chat.spellcheck.title")}
      </p>
      <p className="text-xs text-white/60">
        {t("customization.chat.spellcheck.description")}
      </p>
      <Toggle
        size="lg"
        enabled={enableSpellCheck}
        onChange={handleChange}
        disabled={saving}
      />
    </div>
  );
}
