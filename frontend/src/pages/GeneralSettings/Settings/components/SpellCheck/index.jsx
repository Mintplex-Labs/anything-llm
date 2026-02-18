import React, { useState } from "react";
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
    <div className="my-4">
      <Toggle
        size="md"
        variant="horizontal"
        enabled={enableSpellCheck}
        onChange={handleChange}
        disabled={saving}
        label={t("customization.chat.spellcheck.title")}
        description={t("customization.chat.spellcheck.description")}
      />
    </div>
  );
}
