const pluralize = require("pluralize");
const { getLLMProvider } = require("../../../helpers");
const { TokenManager } = require("../../../helpers/tiktoken");

// Each chunk we send to the LLM is sized to a fraction of the model context
// window so the chunk + the prior key points + the prompt always fit in a
// single request. This is what keeps small/local models from looping forever.
const CHUNK_CONTEXT_RATIO = 0.45;
// The key points from earlier sections are fed back into each chunk for
// continuity, but capped to a small slice of the window so they never crowd
// out the section we are actually trying to summarize.
const RUNNING_SUMMARY_RATIO = 0.05;
// How many sections to summarize before checking in with the user. Anything
// longer than this would otherwise tie up the chat with no way to bail out.
const CHUNKS_BEFORE_APPROVAL = 3;

/**
 * @typedef {Object} LCSummarizationConfig
 * @property {string} provider The LLM to use for summarization (inherited)
 * @property {string} model The LLM Model to use for summarization (inherited)
 * @property {AbortController['signal']} controllerSignal Abort signal checked between sections to stop summarization early
 * @property {string} content The text content of the text to summarize
 * @property {import("../index")|null} [aibitat] The aibitat instance used to report progress and request approval to continue
 * @property {string|null} [skillName] The skill requesting summarization, used for the tool approval request
 * @property {string|null} [caller] The agent calling the skill, used to prefix introspection messages
 */

/**
 * Split text into chunks no larger than `maxTokens` each, using the model
 * tokenizer so the chunk sizes are accurate against the context window.
 * @param {string} content
 * @param {TokenManager} tokenManager
 * @param {number} maxTokens
 * @returns {string[]}
 */
function chunkByTokens(content, tokenManager, maxTokens) {
  const tokens = tokenManager.tokensFromString(content);
  const chunks = [];
  for (let i = 0; i < tokens.length; i += maxTokens)
    chunks.push(tokenManager.bytesFromTokens(tokens.slice(i, i + maxTokens)));
  return chunks;
}

/**
 * Keep only the most recent `maxTokens` tokens of text, truncating from the
 * start. Used to cap the running key points so the latest section's details are
 * always preserved even when we split in the middle of a piece of content.
 * @param {string} text
 * @param {TokenManager} tokenManager
 * @param {number} maxTokens
 * @returns {string}
 */
function truncateToTokenLimit(text, tokenManager, maxTokens) {
  const tokens = tokenManager.tokensFromString(text);
  if (tokens.length <= maxTokens) return text;
  return tokenManager.bytesFromTokens(tokens.slice(tokens.length - maxTokens));
}

/** Count the key points/concepts captured so far (non-empty lines). */
function countKeyPoints(text) {
  return text.split("\n").filter((line) => line.trim().length > 0).length;
}

function summaryPrompt(section, priorPoints) {
  return `You are extracting the key points from a long document that was split into sections. Read the section below and list its key points, facts, and concepts as concise bullet points. Output ONLY the bullet points for THIS section - do not repeat earlier points and do not add commentary.

${priorPoints ? `Key points from earlier sections (for context only, do not repeat):\n${priorPoints}\n\n` : ""}Section:
"""
${section}
"""`;
}

/**
 * Summarize content by walking the text one chunk at a time and accumulating
 * the key points. This replaces the LangChain map_reduce chain which would lock
 * up on small context windows. After the first few sections the user is asked
 * whether to continue so a very long document never silently hangs the chat.
 * @param {LCSummarizationConfig} config
 * @returns {Promise<string>} The accumulated key points.
 */
async function summarizeContent({
  provider = "openai",
  model = null,
  controllerSignal,
  content,
  aibitat = null,
  skillName = null,
  caller = null,
}) {
  const introspect = (message) =>
    aibitat?.introspect?.(caller ? `${caller}: ${message}` : message);

  const llm = getLLMProvider({ provider, model });
  const tokenManager = new TokenManager(model);
  const contextWindow = llm.promptWindowLimit();
  const chunkTokenLimit = Math.floor(contextWindow * CHUNK_CONTEXT_RATIO);
  const priorPointsTokenLimit = Math.floor(
    contextWindow * RUNNING_SUMMARY_RATIO
  );

  const chunks = chunkByTokens(content, tokenManager, chunkTokenLimit);
  introspect(`Content split into ${chunks.length} section(s) to summarize.`);

  let keyPoints = "";
  for (let i = 0; i < chunks.length; i++) {
    if (controllerSignal?.aborted) break;

    // After the first few sections, check in with the user before continuing
    // through the rest of the document. Approving here continues to the end
    // without asking again.
    if (i === CHUNKS_BEFORE_APPROVAL && aibitat?.requestToolApproval) {
      const remaining = chunks.length - i;
      const approval = await aibitat.requestToolApproval({
        skillName,
        description: `There ${pluralize("is", remaining)} ${pluralize(
          "section",
          remaining,
          true
        )} of content left to summarize. Continue?`,
      });
      if (!approval.approved) {
        introspect(`User rejected the ${skillName} request.`);
        break;
      }
    }

    introspect(`Summarizing section ${i + 1} of ${chunks.length}...`);
    const priorPoints = truncateToTokenLimit(
      keyPoints,
      tokenManager,
      priorPointsTokenLimit
    );
    const { textResponse } = await llm.getChatCompletion(
      [{ role: "user", content: summaryPrompt(chunks[i], priorPoints) }],
      { temperature: 0 }
    );
    const sectionPoints = (textResponse || "").trim();
    keyPoints = keyPoints ? `${keyPoints}\n${sectionPoints}` : sectionPoints;
    introspect(`Captured ${countKeyPoints(keyPoints)} key points so far.`);
  }

  return keyPoints;
}

module.exports = { summarizeContent };
