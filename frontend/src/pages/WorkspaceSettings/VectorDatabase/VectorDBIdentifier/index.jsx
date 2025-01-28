import { useTranslation } from "react-i18next";

export default function VectorDBIdentifier({ workspace }) {
  const { t } = useTranslation();
  return (
    <div>
      <h3 className="input-label custom-text-secondary">{t("vector-workspace.identifier")}</h3>
      <p className="text-white/60 text-xs font-medium py-1"> </p>
      <p className="text-white/60 text-sm custom-text-secondary">{workspace?.slug}</p>
    </div>
  );
}
