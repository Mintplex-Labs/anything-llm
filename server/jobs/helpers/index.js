const path = require("node:path");
const fs = require("node:fs");
const { parentPort } = require("node:worker_threads");
const documentsPath =
  process.env.NODE_ENV === "development"
    ? path.resolve(__dirname, `../../storage/documents`)
    : path.resolve(process.env.STORAGE_DIR, `documents`);

function log(stringContent = "") {
  if (parentPort)
    parentPort.postMessage(`\x1b[33m[${process.pid}]\x1b[0m: ${stringContent}`); // running as worker
  else
    process.send(
      `\x1b[33m[${process.ppid}:${process.pid}]\x1b[0m: ${stringContent}`
    ); // running as child_process
}

function conclude() {
  if (parentPort) parentPort.postMessage("done");
  else process.exit(0);
}

function updateSourceDocument(docPath = null, jsonContent = {}) {
  const destinationFilePath = path.resolve(documentsPath, docPath);
  fs.writeFileSync(destinationFilePath, JSON.stringify(jsonContent, null, 4), {
    encoding: "utf-8",
  });
}

/**
 * Strips thought/thinking tags from text (e.g., <thinking>...</thinking>)
 * Useful for cleaning LLM responses before sending notifications.
 * @param {string} text - The text to strip thoughts from.
 * @returns {string} - The text with thought tags and their content removed.
 */
const THOUGHT_KEYWORDS = ["thought", "thinking", "think", "thought_chain"];
const THOUGHT_REGEX_COMPLETE = new RegExp(
  THOUGHT_KEYWORDS.map(
    (keyword) =>
      `<${keyword}\\s*(?:[^>]*?)?\\s*>[\\s\\S]*?<\\/${keyword}\\s*(?:[^>]*?)?>`
  ).join("|"),
  "gi"
);

function stripThinkingFromText(text = "") {
  return text.replace(THOUGHT_REGEX_COMPLETE, "").trim();
}

module.exports = {
  log,
  conclude,
  updateSourceDocument,
  stripThinkingFromText,
};
