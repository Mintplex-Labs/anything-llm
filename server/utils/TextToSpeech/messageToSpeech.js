const { stripThinkingFromText } = require("../helpers");

/**
 * Convert a markdown chat message to plain text for text-to-speech, dropping
 * thinking blocks, markdown syntax, code and emoji.
 * Mirrors `frontend/src/utils/chat/messageToSpeech.js`.
 * @param {string} message - Raw markdown message body.
 * @returns {string}
 */
function messageToSpeech(message = "") {
  if (typeof message !== "string") return "";

  // Thinking blocks, including one left unclosed by a cut off reply
  let text = stripThinkingFromText(message);
  text = text.replace(/<think>[\s\S]*$/gi, " ");

  // Code blocks are dropped, inline code keeps its text
  text = text.replace(/```[\s\S]*?```/g, " ");
  text = text.replace(/~~~[\s\S]*?~~~/g, " ");
  text = text.replace(/`([^`]*)`/g, "$1");

  // Images are dropped, links keep their label
  text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, " ");
  text = text.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
  text = text.replace(/^\s*\[[^\]]+\]:\s*\S+.*$/gm, "");

  // Headings, blockquotes, list markers and horizontal rules
  text = text.replace(/^\s{0,3}#{1,6}\s+/gm, "");
  text = text.replace(/^\s{0,3}>\s?/gm, "");
  text = text.replace(/^\s*[-*+]\s+/gm, "");
  text = text.replace(/^\s*\d+[.)]\s+/gm, "");
  text = text.replace(/^\s{0,3}(?:[-*_]\s*){3,}\s*$/gm, " ");

  // Bold, italic and strikethrough, longest markers first
  text = text.replace(/(\*\*\*|___)([^*_]+)\1/g, "$2");
  text = text.replace(/(\*\*|__)([^*_]+)\1/g, "$2");
  text = text.replace(/(\*|_)([^*_\n]+)\1/g, "$2");
  text = text.replace(/~~([^~]+)~~/g, "$1");

  // Tables read as comma separated rows
  text = text.replace(/^\s*\|?\s*[:\-\s|]+\|[:\-\s|]+\s*$/gm, "");
  text = text.replace(/\|/g, ", ");

  // HTML tags
  text = text.replace(/<\/?[^>]+>/g, " ");

  // Emoji and their modifiers, keeping the ©, ® and ™ signs
  text = text.replace(
    /(?![©®™])\p{Extended_Pictographic}|\p{Emoji_Modifier}|\p{Regional_Indicator}|‍|︎|️|⃣/gu,
    " "
  );

  return text.replace(/\s+/g, " ").trim();
}

module.exports = { messageToSpeech };
