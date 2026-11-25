import { sentenceCase } from "text-case";

/**
 * Treat any run of characters that is not a letter, combining mark, or number
 * as a word separator. The default `text-case` strip pattern is ASCII-only
 * (`/[^A-Z0-9]+/gi`), which deletes every CJK, Cyrillic, Arabic, or accented
 * character and renders names like "図面印刷" as an empty string (#6271).
 */
const WORD_SEPARATOR_PATTERN = /[^\p{L}\p{M}\p{N}]+/gu;

/**
 * Formats an imported skill's `plugin.json` name for display in the UI.
 *
 * Applies sentence case while preserving letters from every script, so
 * English names keep their existing look and non-Latin names are no longer
 * stripped to nothing. Punctuation, underscores, hyphens, whitespace, and
 * emoji are collapsed into single spaces; leading and trailing separators are
 * trimmed.
 *
 * @example
 * formatSkillName("hello_world");  // "Hello world"
 * formatSkillName("helloWorld");   // "Hello world"
 * formatSkillName("図面印刷");      // "図面印刷"
 * formatSkillName("日本語 skill");  // "日本語 skill"
 * formatSkillName("éCLAIR");       // "Éclair"
 * formatSkillName("!!!");          // ""
 * formatSkillName(null);           // ""
 *
 * @param {string|null|undefined} name - Raw skill name from `plugin.json`.
 *   Non-string values are coerced with `String()`; `null` and `undefined`
 *   become an empty string.
 * @returns {string} The display-ready name, or an empty string when the input
 *   is absent or contains no letters, marks, or numbers.
 */
export function formatSkillName(name) {
  return sentenceCase(String(name ?? ""), {
    stripRegexp: WORD_SEPARATOR_PATTERN,
  });
}
