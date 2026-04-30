/**
 * Convert a chat message string to plain text suitable for text-to-speech.
 *
 * The chat history we render is Markdown — when we hand that text directly to
 * a TTS engine (Piper, ElevenLabs, OpenAI, the browser's `SpeechSynthesis`,
 * etc.) the engine reads every special character literally:
 *   - `**bold**` becomes "asterisk asterisk bold asterisk asterisk"
 *   - `_italic_` becomes "underscore italic underscore"
 *   - inline code/code fences are read verbatim with backticks
 *   - bullet lists become "hyphen item" / "asterisk item"
 *   - links become "open bracket label close bracket open paren url close paren"
 *
 * This helper strips the most common Markdown syntax while preserving the
 * underlying spoken content. It is intentionally regex-based (no extra
 * dependency) so it can be safely used both on the client and inside the
 * native browser TTS path which has no access to the server's markdown-it
 * tokenizer.
 *
 * Tracking issue: https://github.com/Mintplex-Labs/anything-llm/issues/5557
 *
 * @param {string} message - The raw markdown message body.
 * @returns {string} A plain-text string suitable for TTS.
 */
export default function messageToSpeech(message = "") {
  if (typeof message !== "string" || message.length === 0) return "";

  let text = message;

  // 1. Remove fenced code blocks entirely — reading code aloud is rarely
  //    useful and produces a long stream of unintelligible characters.
  text = text.replace(/```[\s\S]*?```/g, " ");
  text = text.replace(/~~~[\s\S]*?~~~/g, " ");

  // 2. Strip inline code wrappers but keep the text inside.
  text = text.replace(/`([^`]*)`/g, "$1");

  // 3. Images: drop entirely — there's nothing useful to speak.
  text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, " ");

  // 4. Links: keep the visible label, drop the URL.
  //    `[label](url)` -> `label`
  text = text.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");

  // 5. Reference-style link definitions: drop the URL line entirely.
  text = text.replace(/^\s*\[[^\]]+\]:\s*\S+.*$/gm, "");

  // 6. Heading markers (`#`, `##`, ...): keep the heading text only.
  text = text.replace(/^\s{0,3}#{1,6}\s+/gm, "");

  // 7. Blockquote markers (`>`): drop the leading marker.
  text = text.replace(/^\s{0,3}>\s?/gm, "");

  // 8. Unordered list markers (`-`, `*`, `+`) and ordered list markers
  //    (`1.`, `12)`): drop the marker, keep the item text.
  text = text.replace(/^\s*[-*+]\s+/gm, "");
  text = text.replace(/^\s*\d+[.)]\s+/gm, "");

  // 9. Horizontal rules: drop entirely.
  text = text.replace(/^\s{0,3}(?:[-*_]\s*){3,}\s*$/gm, " ");

  // 10. Bold / italic / strikethrough emphasis. Order matters — handle the
  //     longer markers (`***`, `___`, `**`, `__`, `~~`) before the singletons
  //     so "asterisk" is never read aloud.
  text = text.replace(/(\*\*\*|___)([^*_]+)\1/g, "$2");
  text = text.replace(/(\*\*|__)([^*_]+)\1/g, "$2");
  text = text.replace(/(\*|_)([^*_\n]+)\1/g, "$2");
  text = text.replace(/~~([^~]+)~~/g, "$1");

  // 11. Tables: convert pipe separators to commas so rows read naturally,
  //     and drop the alignment row (`---|---|---`).
  text = text.replace(/^\s*\|?\s*[:\-\s|]+\|[:\-\s|]+\s*$/gm, "");
  text = text.replace(/\|/g, ", ");

  // 12. HTML tags: strip but keep their text content.
  text = text.replace(/<\/?[^>]+>/g, " ");

  // 13. Collapse repeated whitespace (newlines and spaces) to single spaces.
  text = text.replace(/\s+/g, " ").trim();

  return text;
}
