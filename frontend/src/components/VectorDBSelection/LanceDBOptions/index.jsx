import { useTranslation } from "react-i18next";
export default function LanceDBOptions() {
  const { t } = useTranslation();
  return (
    <div className="w-full h-10 items-center flex">
      <p className="text-sm font-base text-white text-opacity-60">
        {t("vector.provider.description")}
      </p>
    </div>
  );
}
