import React from "react";
import { useTranslation } from "react-i18next";

export default function FinishNode() {
  const { t } = useTranslation();

  return (
    <div className="text-sm text-white/60">
      {t("agentBuilder.finish.description")}
    </div>
  );
}
