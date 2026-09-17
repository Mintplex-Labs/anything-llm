const moment = require("moment");

const DEFAULT_SYSTEM_PROMPT =
  "Given the following conversation, relevant context, and a follow up question, reply with an answer to the current question the user is asking. Return only your response to the question given the above information following the users instructions as needed.";
const LEGACY_DEFAULT_SYSTEM_PROMPT = DEFAULT_SYSTEM_PROMPT.replace(
  "Return only",
  "The current date and time is {datetime}. Return only"
);

function isDefaultPrompt(prompt) {
  return (
    prompt == null ||
    prompt.trim() === DEFAULT_SYSTEM_PROMPT ||
    prompt.trim() === LEGACY_DEFAULT_SYSTEM_PROMPT
  );
}

// Recognize defaults already persisted in workspace/global settings without
// rewriting user settings or changing custom prompt variable expansion.
function resolveSystemPrompt(prompt) {
  return isDefaultPrompt(prompt) ? DEFAULT_SYSTEM_PROMPT : prompt;
}

function getPromptDatetime(prompt) {
  if (!isDefaultPrompt(prompt)) return undefined;
  // Keep the same format as the existing {datetime} system prompt variable.
  return moment().format("LLLL");
}

function appendPromptDatetime(prompt, datetime) {
  return datetime
    ? `${prompt}\n\nThe current date and time is ${datetime}.`
    : prompt;
}

module.exports = {
  DEFAULT_SYSTEM_PROMPT,
  LEGACY_DEFAULT_SYSTEM_PROMPT,
  resolveSystemPrompt,
  getPromptDatetime,
  appendPromptDatetime,
};
