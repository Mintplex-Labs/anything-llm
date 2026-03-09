/* global process */
// This script finds translation keys defined in en/common.js that are not
// referenced anywhere in the frontend source code. It exits with code 1
// when unused keys are found so it can be used as a CI check.
//
// Usage:
//   node findUnusedTranslations.mjs            # Report unused keys
//   node findUnusedTranslations.mjs --delete   # Remove unused keys from en/common.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { resources } from "./resources.js";
import DYNAMIC_KEY_ALLOWLIST from "./dynamicKeyAllowlist.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND_SRC = path.resolve(__dirname, "..");
const shouldDelete = process.argv.includes("--delete");

// ---------------------------------------------------------------------------
// 1. Extract all dot-path keys from the English translation object
// ---------------------------------------------------------------------------
function extractKeys(obj, prefix = "") {
  const keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const dotPath = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object") {
      keys.push(...extractKeys(value, dotPath));
    } else {
      keys.push(dotPath);
    }
  }
  return keys;
}

const definedKeys = new Set(extractKeys(resources.en.common));

// ---------------------------------------------------------------------------
// 2. Collect all frontend source files, excluding locales/
// ---------------------------------------------------------------------------
function collectFiles(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip the locales directory to avoid self-references
      if (entry.name === "locales") continue;
      collectFiles(full, results);
    } else if (/\.(js|jsx)$/.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

const sourceFiles = collectFiles(FRONTEND_SRC);

// ---------------------------------------------------------------------------
// 3. Scan source files for t() references (literal and dynamic)
// ---------------------------------------------------------------------------
const referencedKeys = new Set();
const tCallRegex = /\bt\(\s*["'`]([^"'`]+)["'`]/g;
const dynamicTCallRegex = /\bt\(\s*([a-zA-Z_$][a-zA-Z0-9_$.]*)\s*[,)]/g;
const templateTCallRegex = /\bt\(\s*`([^`]*\$\{[^`]*)`\s*[,)]/g;
const dynamicUsages = [];

for (const file of sourceFiles) {
  const content = fs.readFileSync(file, "utf-8");

  let match;
  while ((match = tCallRegex.exec(content)) !== null) {
    referencedKeys.add(match[1]);
  }

  while ((match = dynamicTCallRegex.exec(content)) !== null) {
    const arg = match[1];
    if (/^["'`]/.test(arg)) continue;
    dynamicUsages.push({ file: path.relative(FRONTEND_SRC, file), arg });
  }

  while ((match = templateTCallRegex.exec(content)) !== null) {
    dynamicUsages.push({
      file: path.relative(FRONTEND_SRC, file),
      arg: `\`${match[1]}\``,
    });
  }
}

if (dynamicUsages.length > 0) {
  console.log(
    `\nWarning: Found ${dynamicUsages.length} dynamic t() call(s) that cannot be statically analyzed:\n`
  );
  for (const { file, arg } of dynamicUsages) {
    console.log(`  ${file}: t(${arg})`);
  }
  console.log(
    `\nIf these reference valid keys, add them to locales/dynamicKeyAllowlist.js to prevent accidental deletion.\n`
  );
}

// ---------------------------------------------------------------------------
// 4. Diff and report (excluding allowlisted keys and i18n plural forms)
// ---------------------------------------------------------------------------
const allowlist = new Set(DYNAMIC_KEY_ALLOWLIST);
const PLURAL_SUFFIXES = ["_zero", "_one", "_two", "_few", "_many", "_other"];

function isPluralFormOfReferencedKey(key) {
  for (const suffix of PLURAL_SUFFIXES) {
    if (key.endsWith(suffix)) {
      const baseKey = key.slice(0, -suffix.length);
      if (referencedKeys.has(baseKey)) return true;
    }
  }
  return false;
}

const unusedKeys = [...definedKeys]
  .filter(
    (key) =>
      !referencedKeys.has(key) &&
      !allowlist.has(key) &&
      !isPluralFormOfReferencedKey(key)
  )
  .sort();

if (unusedKeys.length === 0) {
  console.log("👍 All translation keys are referenced in the source code!");
  process.exit(0);
}

console.log(`Found ${unusedKeys.length} unused translation key(s):\n`);
for (const key of unusedKeys) {
  console.log(`  • ${key}`);
}

if (!shouldDelete) {
  console.log(
    `\nThese keys are defined in en/common.js but not referenced in any source file.`
  );
  console.log(`Run with --delete to remove them from en/common.js.`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// 5. Delete unused keys from en/common.js
// ---------------------------------------------------------------------------
function deleteKey(obj, dotPath) {
  const parts = dotPath.split(".");
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!current[parts[i]] || typeof current[parts[i]] !== "object") return;
    current = current[parts[i]];
  }
  delete current[parts[parts.length - 1]];
}

function pruneEmptyObjects(obj) {
  for (const key of Object.keys(obj)) {
    if (obj[key] && typeof obj[key] === "object") {
      pruneEmptyObjects(obj[key]);
      if (Object.keys(obj[key]).length === 0) delete obj[key];
    }
  }
}

const translations = structuredClone(resources.en.common);
for (const key of unusedKeys) {
  deleteKey(translations, key);
}
pruneEmptyObjects(translations);

const filePath = path.join(__dirname, "en", "common.js");
const output = `const TRANSLATIONS = ${JSON.stringify(translations, null, 2)}

export default TRANSLATIONS;\n`;
fs.writeFileSync(filePath, output, "utf-8");

console.log(
  `\n✅ Deleted ${unusedKeys.length} unused key(s) from en/common.js.`
);
process.exit(0);
