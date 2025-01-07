// Looking for a language to translate AnythingLLM to?
// Create a `common.js` file in the language's ISO code https://www.w3.org/International/O-charset-lang.html
// eg: Spanish => es/common.js
// eg: French => fr/common.js
// You should copy the en/common.js file as your template and just translate every string in there.
// By default, we try to see what the browsers native language is set to and use that. If a string
// is not defined or is null in the translation file, it will fallback to the value in the en/common.js file
// RULES:
// The EN translation file is the ground-truth for what keys and options are available. DO NOT add a special key
// to a specific language file as this will break the other languages. Any new keys should be added to english
// and the language file you are working on.

// Contributor Notice: If you are adding a translation you MUST locally run `yarn verify:translations` from the root prior to PR.
// please do not submit PR's without first verifying this test passes as it will tell you about missing keys or values
// from the primary dictionary.

import English from "./en/common.js";
import Korean from "./ko/common.js";
import Spanish from "./es/common.js";
import French from "./fr/common.js";
import Mandarin from "./zh/common.js";
import German from "./de/common.js";
import Russian from "./ru/common.js";
import Italian from "./it/common.js";
import Portuguese from "./pt_BR/common.js";
import Hebrew from "./he/common.js";
import Dutch from "./nl/common.js";
import Vietnamese from "./vn/common.js";
import TraditionalChinese from "./zh_TW/common.js";

export const defaultNS = "common";
export const resources = {
  en: {
    common: English,
  },
  zh: {
    common: Mandarin,
  },
  "zh-tw": {
    common: TraditionalChinese,
  },
  es: {
    common: Spanish,
  },
  de: {
    common: German,
  },
  fr: {
    common: French,
  },
  ko: {
    common: Korean,
  },
  ru: {
    common: Russian,
  },
  it: {
    common: Italian,
  },
  pt: {
    common: Portuguese,
  },
  he: {
    common: Hebrew,
  },
  nl: {
    common: Dutch,
  },
  vi: {
    common: Vietnamese,
  },
};
