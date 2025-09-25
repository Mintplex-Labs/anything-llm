import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { defaultNS, resources } from "./locales/resources";
import Admin from "@/models/admin.js";

i18next
  // https://github.com/i18next/i18next-browser-languageDetector/blob/9efebe6ca0271c3797bc09b84babf1ba2d9b4dbb/src/index.js#L11
  .use(initReactI18next) // Initialize i18n for React
  .use(LanguageDetector)
  .init({
    fallbackLng: "en",
    debug: import.meta.env.DEV,
    defaultNS,
    resources,
    lowerCaseLng: true,
    interpolation: {
      escapeValue: false,
    },
  });

const sendDefaultSystemPromptToServer = async function () {
  const default_system_prompt = i18next.t(
    "customization.items.system-prompt.default"
  );

  const { success, error } = await Admin.updateSystemPreferences({
    default_system_prompt,
  });
  if (!success) {
    console.error("error updating default_system_prompt on language change");
  } else {
    console.info(
      "successfully updated default_system_prompt on language change"
    );
  }
};

i18next.on("initialized", () => {
  sendDefaultSystemPromptToServer();
});

i18next.on("languageChanged", () => {
  sendDefaultSystemPromptToServer();
});

export default i18next;
