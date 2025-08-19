// This script is used to normalize the translations files to ensure they are all the same.
// This will take the en file and compare it to all other files and ensure they are all the same.
// If a non-en file is missing a key, it will be added to the file and set to null
import { resources } from "./resources.js";
import fs from "fs";
const languageNames = new Intl.DisplayNames(Object.keys(resources), {
  type: "language",
});

function langDisplayName(lang) {
  return languageNames.of(lang);
}

function compareStructures(lang, a, b, subdir = null) {
  //if a and b aren't the same type, they can't be equal
  if (typeof a !== typeof b && a !== null && b !== null) {
    console.log("Invalid type comparison", [
      {
        lang,
        a: typeof a,
        b: typeof b,
        values: {
          a,
          b,
        },
        ...(!!subdir ? { subdir } : {}),
      },
    ]);
    return false;
  }

  // Need the truthy guard because
  // typeof null === 'object'
  if (a && typeof a === "object") {
    var keysA = Object.keys(a).sort(),
      keysB = Object.keys(b).sort();

    //if a and b are objects with different no of keys, unequal
    if (keysA.length !== keysB.length) {
      console.log("Keys are missing!", {
        [lang]: keysA,
        en: keysB,
        ...(!!subdir ? { subdir } : {}),
        diff: {
          added: keysB.filter((key) => !keysA.includes(key)),
          removed: keysA.filter((key) => !keysB.includes(key)),
        },
      });
      return false;
    }

    //if keys aren't all the same, unequal
    if (
      !keysA.every(function (k, i) {
        return k === keysB[i];
      })
    ) {
      console.log("Keys are not equal!", {
        [lang]: keysA,
        en: keysB,
        ...(!!subdir ? { subdir } : {}),
      });
      return false;
    }

    //recurse on the values for each key
    return keysA.every(function (key) {
      //if we made it here, they have identical keys
      return compareStructures(lang, a[key], b[key], key);
    });

    //for primitives just ignore since we don't check values.
  } else {
    return true;
  }
}

function normalizeTranslations(lang, source, target, subdir = null) {
  // Handle primitives - if target exists, keep it, otherwise set null
  if (!source || typeof source !== "object") {
    return target ?? null;
  }

  // Handle objects
  const normalized = target && typeof target === "object" ? { ...target } : {};

  // Add all keys from source (English), setting to null if missing
  for (const key of Object.keys(source)) {
    normalized[key] = normalizeTranslations(
      lang,
      source[key],
      normalized[key],
      key
    );
  }

  // If a non-en file has a key that is NOT in the en file, it will be removed
  for (const key of Object.keys(normalized)) {
    if (!source[key]) delete normalized[key];
  }

  return normalized;
}

function ISOToFilename(lang) {
  const ISO_TO_FILENAME = {
    "zh-tw": "zh_TW",
    pt: "pt_BR",
    vi: "vn",
  };
  return ISO_TO_FILENAME[lang] || lang.replace("-", "_");
}

const failed = [];
const TRANSLATIONS = {};
for (const [lang, { common }] of Object.entries(resources)) {
  TRANSLATIONS[lang] = common;
}

const PRIMARY = { ...TRANSLATIONS["en"] };
delete TRANSLATIONS["en"];

console.log(
  `The following translation files will be normalized against the English file: [${Object.keys(
    TRANSLATIONS
  ).join(",")}]`
);

// Normalize each non-English translation
for (const [lang, translations] of Object.entries(TRANSLATIONS)) {
  const normalized = normalizeTranslations(lang, PRIMARY, translations);

  // Update the translations in resources
  resources[lang].common = normalized;

  // Verify the structure matches
  const passed = compareStructures(lang, normalized, PRIMARY);
  console.log(`${langDisplayName(lang)} (${lang}): ${passed ? "✅" : "❌"}`);
  !passed && failed.push(lang);

  const langFilename = ISOToFilename(lang);
  fs.writeFileSync(
    `./${langFilename}/common.js`,
    `// Anything with "null" requires a translation. Contribute to translation via a PR!
const TRANSLATIONS = ${JSON.stringify(normalized, null, 2)}

export default TRANSLATIONS;`
  );
}

if (failed.length !== 0) {
  throw new Error(
    `Error verifying normalized translations. Please check the logs.`,
    failed
  );
}

console.log(
  `👍 All translation files have been normalized to match the English schema!`
);

process.exit(0);
