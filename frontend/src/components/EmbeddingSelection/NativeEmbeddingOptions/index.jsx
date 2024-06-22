import { useTranslation } from "react-i18next";

export default function NativeEmbeddingOptions() {
  const { t } = useTranslation();
  return (
    <div className="w-full h-10 items-center flex">
      <p className="text-sm font-base text-white text-opacity-60">
        {t("embedding.provider.description")}
      </p>
    </div>
  );
}
