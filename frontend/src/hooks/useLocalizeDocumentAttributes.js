// Set the document direction depending on the active locale (ltl-rtl)
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function useLocalizeDocumentAttributes() {
  const { i18n } = useTranslation();

  useEffect(() => {
    if (i18n.resolvedLanguage) {
      // Set the <html lang> attribute.
      document.documentElement.lang = i18n.resolvedLanguage;

      // Set the <html dir> attribute.
      document.documentElement.dir = i18n.dir(i18n.resolvedLanguage);
    }
  }, [i18n, i18n.resolvedLanguage]);
}
