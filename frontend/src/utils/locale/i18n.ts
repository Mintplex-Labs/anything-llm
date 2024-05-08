/* eslint-disable import/no-named-as-default-member */
/* eslint-disable @typescript-eslint/no-floating-promises */
// import the original type declarations
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { resources } from "./resources";

const defaultNS = "translation"; 

i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  defaultNS,
  resources,
  debug: process.env.NEXT_PUBLIC_ENV !== "prod",
  interpolation: {
    escapeValue: false,
  },
});
