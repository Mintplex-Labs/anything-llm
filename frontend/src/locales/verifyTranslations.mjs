import { resources } from "./resources.js";
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

const failed = [];
const TRANSLATIONS = {};
for (const [lang, { common }] of Object.entries(resources))
  TRANSLATIONS[lang] = common;
const PRIMARY = { ...TRANSLATIONS["en"] };
delete TRANSLATIONS["en"];

console.log(
  `The following translation files will be verified: [${Object.keys(
    TRANSLATIONS
  ).join(",")}]`
);
for (const [lang, translations] of Object.entries(TRANSLATIONS)) {
  const passed = compareStructures(lang, translations, PRIMARY);
  console.log(`${langDisplayName(lang)} (${lang}): ${passed ? "✅" : "❌"}`);
  !passed && failed.push(lang);
}

if (failed.length !== 0)
  throw new Error(
    `The following translations files are INVALID and need fixing. Please see logs`,
    failed
  );
console.log(
  `👍 All translation files located match the schema defined by the English file!`
);
process.exit(0);
