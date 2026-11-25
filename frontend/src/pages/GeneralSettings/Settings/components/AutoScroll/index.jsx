import React, { useState } from "react";
import Appearance from "@/models/appearance";
import { useTranslation } from "react-i18next";
import Toggle from "@/components/lib/Toggle";

export default function AutoScroll() {
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);
  const [disableAutoScroll, setDisableAutoScroll] = useState(() =>
    Appearance.get("disableAutoScroll")
  );

  const handleChange = (checked) => {
    setDisableAutoScroll(checked);
    setSaving(true);
    try {
      Appearance.set("disableAutoScroll", checked);
    } catch (error) {
      console.error("Failed to update appearance settings:", error);
      setDisableAutoScroll(!checked);
    }
    setSaving(false);
  };

  return (
    <div className="my-4">
      <Toggle
        size="md"
        variant="horizontal"
        enabled={disableAutoScroll}
        onChange={handleChange}
        disabled={saving}
        label={t("customization.items.disable-auto-scroll.title")}
        description={t("customization.items.disable-auto-scroll.description")}
      />
    </div>
  );
}
