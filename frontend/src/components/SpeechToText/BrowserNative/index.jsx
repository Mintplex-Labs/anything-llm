import { useTranslation } from "react-i18next";

export default function BrowserNative() {
  const { t } = useTranslation(); // 다국어 번역 적용

  return (
    <div className="w-full h-10 items-center flex">
      <p className="text-sm font-base text-white text-opacity-60">
        {t("stt.providers.nativeConfiguration")}
      </p>
    </div>
  );
}
